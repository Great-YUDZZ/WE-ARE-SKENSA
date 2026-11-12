import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  acquireAiConcurrencySlot,
  applyStandardApiHeaders,
  buildRateLimitResponse,
  checkSlidingRateLimit,
  getClientIp,
  handleCorsPreflight,
  readBoundedJsonBody,
  verifyRequestOrigin,
} from "@/lib/api-security";
import {
  evaluateCompetencyVerification,
  generateCompetencyVerification,
  generateDynamicQuizSet,
} from "@/lib/dynamic-assessment";

export const maxDuration = 30;

const GenerateQuizSchema = z
  .object({
    action: z.literal("generate_quiz"),
    fieldId: z.string().trim().min(1).max(40),
    targetCourseId: z.string().trim().max(80).optional(),
    attemptSeed: z.number().int().min(1).max(10_000_000).optional(),
    excludeQuestions: z.array(z.string().max(400)).max(20).optional(),
  })
  .strict();

const GenerateVerificationSchema = z
  .object({
    action: z.literal("generate_verification"),
    fieldId: z.string().trim().min(1).max(40),
    targetCourseId: z.string().trim().max(80).optional(),
    attemptSeed: z.number().int().min(1).max(10_000_000).optional(),
    completedModules: z.array(z.string().trim().max(80)).max(50),
    passedCertIds: z.array(z.string().trim().max(80)).max(50),
    practiceNotes: z.record(z.string().max(80), z.string().max(2000)).optional(),
    personalNotesText: z.array(z.string().max(1000)).max(10).optional(),
  })
  .strict();

const EvaluateVerificationSchema = z
  .object({
    action: z.literal("evaluate_verification"),
    fieldId: z.string().trim().min(1).max(40),
    verificationToken: z.string().min(20).max(40_000),
    mcqAnswers: z.record(z.string().max(80), z.number().int().min(0).max(5)),
    openAnswer: z.string().trim().max(2000),
  })
  .strict();

const SkillVerificationRequestSchema = z.discriminatedUnion("action", [
  GenerateQuizSchema,
  GenerateVerificationSchema,
  EvaluateVerificationSchema,
]);

export async function OPTIONS(req: NextRequest) {
  return handleCorsPreflight(req, "POST, OPTIONS");
}

function finalizeResponse<T>(
  req: NextRequest,
  body: T,
  status: number,
  remaining: number
): NextResponse<T> {
  const res = applyStandardApiHeaders(
    NextResponse.json(body, { status }),
    req
  );
  res.headers.set("X-RateLimit-Limit", "20");
  res.headers.set("X-RateLimit-Remaining", String(Math.max(0, remaining)));
  return res;
}

export async function POST(req: NextRequest) {
  const originErr = verifyRequestOrigin(req);
  if (originErr) return originErr;

  const ip = getClientIp(req);
  const rateLimit = checkSlidingRateLimit(`ai-assessment:${ip}`, 20, 60_000);
  if (!rateLimit.allowed) {
    return buildRateLimitResponse(
      req,
      rateLimit.limit,
      rateLimit.retryAfterSeconds,
      "Batas laju generator soal & verifikasi AI tercapai. Silakan tunggu beberapa detik."
    );
  }

  const parsedBody = await readBoundedJsonBody<unknown>(req, 65_536);
  if (!parsedBody.ok) {
    return finalizeResponse(
      req,
      { error: parsedBody.error },
      parsedBody.status,
      rateLimit.remaining
    );
  }

  const validated = SkillVerificationRequestSchema.safeParse(parsedBody.data);
  if (!validated.success) {
    const firstIssue = validated.error.issues[0];
    return finalizeResponse(
      req,
      {
        error:
          firstIssue?.message ||
          "Format permintaan asesmen atau verifikasi kemampuan tidak valid.",
      },
      400,
      rateLimit.remaining
    );
  }

  const slot = acquireAiConcurrencySlot(ip, 3);
  if (!slot.acquired) {
    return buildRateLimitResponse(
      req,
      3,
      5,
      "Terlalu banyak permintaan asesmen AI bersamaan dari koneksi Anda. Tunggu sebentar."
    );
  }

  try {
    const payload = validated.data;

    if (payload.action === "generate_quiz") {
      const quizData = await generateDynamicQuizSet({
        fieldId: payload.fieldId,
        targetCourseId: payload.targetCourseId,
        attemptSeed: payload.attemptSeed,
        excludeQuestions: payload.excludeQuestions,
      });
      return finalizeResponse(req, quizData, 200, rateLimit.remaining);
    }

    if (payload.action === "generate_verification") {
      const genResult = await generateCompetencyVerification({
        fieldId: payload.fieldId,
        targetCourseId: payload.targetCourseId,
        attemptSeed: payload.attemptSeed,
        completedModules: payload.completedModules,
        passedCertIds: payload.passedCertIds,
        practiceNotes: payload.practiceNotes,
        personalNotesText: payload.personalNotesText,
      });

      if (!genResult.ok) {
        return finalizeResponse(
          req,
          { error: genResult.error, eligibility: genResult.eligibility },
          400,
          rateLimit.remaining
        );
      }

      return finalizeResponse(req, genResult.data, 200, rateLimit.remaining);
    }

    // payload.action === "evaluate_verification"
    const evalResult = await evaluateCompetencyVerification({
      fieldId: payload.fieldId,
      verificationToken: payload.verificationToken,
      mcqAnswers: payload.mcqAnswers,
      openAnswer: payload.openAnswer,
    });

    if (!evalResult.ok) {
      return finalizeResponse(
        req,
        { error: evalResult.error },
        evalResult.status,
        rateLimit.remaining
      );
    }

    return finalizeResponse(req, evalResult.data, 200, rateLimit.remaining);
  } catch {
    return finalizeResponse(
      req,
      { error: "Gagal memproses generator soal atau verifikasi kemampuan." },
      500,
      rateLimit.remaining
    );
  } finally {
    slot.release();
  }
}
