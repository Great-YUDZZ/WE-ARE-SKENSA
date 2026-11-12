import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  applyStandardApiHeaders,
  buildRateLimitResponse,
  checkSlidingRateLimit,
  getClientIp,
  handleCorsPreflight,
  readBoundedJsonBody,
  verifyRequestOrigin,
} from "@/lib/api-security";
import { getSessionUserId } from "@/lib/auth";
import { findUserById, toSafeResponse, updateUserById } from "@/lib/db";
import { getUserLearningProfile, saveUserLearningProfile } from "@/lib/profile-store";
import type { FullLearningSnapshot } from "@/lib/learningProfile";

export async function OPTIONS(req: NextRequest) {
  return handleCorsPreflight(req, "GET, PUT, PATCH, OPTIONS");
}

const PersonalNoteSchema = z.object({
  id: z.string().min(1).max(80),
  title: z.string().min(1).max(160),
  fieldId: z.string().min(1).max(40),
  category: z.enum([
    "Ringkasan Materi",
    "Catatan Praktik",
    "Target Kampus",
    "Persiapan Sertifikasi",
    "Refleksi Karier",
  ]),
  content: z.string().max(4000),
  createdAt: z.string().max(60),
  updatedAt: z.string().max(60),
});

const FieldVerificationSchema = z.object({
  status: z.enum(["passed", "needs_review"]),
  score: z.number().min(0).max(100),
  correctCount: z.number().min(0).max(50),
  totalQuestions: z.number().min(1).max(50),
  attemptCount: z.number().min(1).max(200),
  verifiedAt: z.string().max(60),
  summary: z.string().max(1000),
  strengths: z.array(z.string().max(300)).max(5),
  improvements: z.array(z.string().max(300)).max(5),
  sourceMode: z.string().max(60),
});

const FieldProgressSchema = z.object({
  fieldId: z.string().min(1).max(40),
  completedModules: z.array(z.string().max(80)).max(50),
  passedCertIds: z.array(z.string().max(80)).max(50),
  practiceNotes: z.record(z.string().max(80), z.string().max(4000)),
  verification: FieldVerificationSchema.optional(),
  updatedAt: z.string().max(60).optional(),
});

const SurveySnapshotSchema = z
  .object({
    fieldId: z.string().min(1).max(40),
    courseId: z.string().max(80).optional(),
    score: z.number().min(0).max(100),
    dominant: z.enum(["teknologi", "manusia", "alam", "usaha"]),
    mismatch: z.boolean(),
    completedAt: z.string().max(60).optional(),
  })
  .nullable();

const LearningSnapshotSchema = z.object({
  personalNotes: z.array(PersonalNoteSchema).max(100),
  progressByField: z.record(z.string().max(40), FieldProgressSchema),
  surveyResult: SurveySnapshotSchema.optional(),
  updatedAt: z.string().max(60).optional(),
});

const UpdateProfileSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  interests: z.array(z.string().trim().min(1).max(120)).max(15).optional(),
  learningProfile: LearningSnapshotSchema.optional(),
  syncMode: z.enum(["merge", "replace"]).optional(),
});

export async function GET(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return applyStandardApiHeaders(
      NextResponse.json({ user: null, learningProfile: null }, { status: 401 }),
      req
    );
  }

  const user = await findUserById(userId);
  if (!user) {
    return applyStandardApiHeaders(
      NextResponse.json({ user: null, learningProfile: null }, { status: 401 }),
      req
    );
  }

  const learningProfile = getUserLearningProfile(userId);
  return applyStandardApiHeaders(
    NextResponse.json({
      user: toSafeResponse(user),
      learningProfile,
    }),
    req
  );
}

async function handleSaveProfile(req: NextRequest) {
  const originErr = verifyRequestOrigin(req);
  if (originErr) return originErr;

  const ip = getClientIp(req);
  const rateLimit = checkSlidingRateLimit(`profile:${ip}`, 30, 60_000);
  if (!rateLimit.allowed) {
    return buildRateLimitResponse(
      req,
      rateLimit.limit,
      rateLimit.retryAfterSeconds
    );
  }

  const userId = await getSessionUserId();
  if (!userId) {
    return applyStandardApiHeaders(
      NextResponse.json(
        { error: "Silakan masuk ke akun Anda untuk menyinkronkan profil." },
        { status: 401 }
      ),
      req
    );
  }

  const currentUser = await findUserById(userId);
  if (!currentUser) {
    return applyStandardApiHeaders(
      NextResponse.json({ error: "Akun tidak ditemukan." }, { status: 401 }),
      req
    );
  }

  try {
    const parsedBody = await readBoundedJsonBody<unknown>(req, 65_536);
    if (!parsedBody.ok) {
      return applyStandardApiHeaders(
        NextResponse.json({ error: parsedBody.error }, { status: parsedBody.status }),
        req
      );
    }

    const parsed = UpdateProfileSchema.safeParse(parsedBody.data);
    if (!parsed.success) {
      return applyStandardApiHeaders(
        NextResponse.json(
          { error: "Data pembaruan profil atau catatan belajar tidak valid." },
          { status: 400 }
        ),
        req
      );
    }

    const { name, interests, learningProfile, syncMode } = parsed.data;
    let updatedUser = currentUser;

    if (name !== undefined || interests !== undefined) {
      const nextRow = await updateUserById(userId, { name, interests });
      if (nextRow) {
        updatedUser = nextRow;
      }
    }

    let nextLearningProfile = getUserLearningProfile(userId);
    if (learningProfile) {
      const normalizedSnapshot: FullLearningSnapshot = {
        personalNotes: learningProfile.personalNotes,
        progressByField: learningProfile.progressByField,
        surveyResult: learningProfile.surveyResult ?? null,
        updatedAt: learningProfile.updatedAt || new Date().toISOString(),
      };
      nextLearningProfile = saveUserLearningProfile(
        userId,
        normalizedSnapshot,
        syncMode || "merge"
      );
    }

    return applyStandardApiHeaders(
      NextResponse.json({
        ok: true,
        user: toSafeResponse(updatedUser),
        learningProfile: nextLearningProfile,
        syncedAt: new Date().toISOString(),
      }),
      req
    );
  } catch {
    return applyStandardApiHeaders(
      NextResponse.json(
        { error: "Gagal menyimpan data profil dan catatan belajar." },
        { status: 500 }
      ),
      req
    );
  }
}

export async function PUT(req: NextRequest) {
  return handleSaveProfile(req);
}

export async function PATCH(req: NextRequest) {
  return handleSaveProfile(req);
}
