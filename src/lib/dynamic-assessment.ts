import { SignJWT, jwtVerify } from "jose";
import {
  MENTOR_CURRICULUM_BY_FIELD,
  type CertificationQuestion,
  type FieldCurriculum,
  type LearningModule,
  type TargetCourse,
} from "@/data/mentorCurriculum";
import {
  callGeminiDirectWithFailover,
  callRouterWithFailover,
  extractJsonPayload,
  sanitizeNoEmojiNoEmDash,
} from "@/lib/router-client";

export interface DynamicQuizQuestion extends CertificationQuestion {
  variationTag?: string;
  generatedBy?: string;
}

export interface DynamicQuizResponse {
  fieldId: string;
  fieldName: string;
  seedUsed: number;
  sourceMode: "9router-structured" | "gemini-structured" | "curriculum-dynamic";
  generatedAt: string;
  drills: DynamicQuizQuestion[];
}

export interface VerificationMcqPublic {
  id: string;
  competencyCode: string;
  moduleTitle: string;
  question: string;
  options: string[];
}

export interface VerificationOpenPrompt {
  id: string;
  title: string;
  question: string;
  contextHint: string;
  minChars: number;
}

export interface VerificationEligibility {
  eligible: boolean;
  completedModulesCount: number;
  totalModules: number;
  passedCertCount: number;
  totalCerts: number;
  practiceNotesCount: number;
  missingModules: { id: string; title: string }[];
  missingCerts: { id: string; competencyCode: string; certName: string }[];
}

export interface GeneratedVerificationResponse {
  assessmentId: string;
  fieldId: string;
  fieldName: string;
  targetCourseName: string;
  generatedAt: string;
  seedUsed: number;
  sourceMode: "9router-structured" | "gemini-structured" | "curriculum-dynamic";
  mcqs: VerificationMcqPublic[];
  openPrompt: VerificationOpenPrompt;
  verificationToken: string;
}

export interface VerificationQuestionReview {
  id: string;
  competencyCode: string;
  question: string;
  options: string[];
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
  explanation: string;
}

export interface EvaluatedVerificationResponse {
  fieldId: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  mcqCorrectCount: number;
  mcqTotal: number;
  openScore: number;
  maxOpenScore: number;
  status: "passed" | "needs_review";
  summary: string;
  strengths: string[];
  improvements: string[];
  reviews: VerificationQuestionReview[];
  openFeedback: string;
  openAnswer: string;
  verifiedAt: string;
  sourceMode: string;
}

interface InternalVerificationMcq extends VerificationMcqPublic {
  correctIndex: number;
  explanation: string;
}

interface SignedVerificationClaims {
  purpose: "skill-verification";
  assessmentId: string;
  fieldId: string;
  fieldName: string;
  targetCourseName: string;
  mcqs: InternalVerificationMcq[];
  openPrompt: VerificationOpenPrompt;
  expectedKeywords: string[];
}

function getAssessmentJwtSecret(): Uint8Array {
  const raw =
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    "kertamarga-dev-secret-ganti-di-produksi-minimal-32-karakter";
  return new TextEncoder().encode(raw);
}

function createSeededRng(seed: number): () => number {
  let a = (Math.floor(Math.abs(seed)) || 1) >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffleQuestionOptions<
  T extends { options: string[]; correctIndex: number }
>(item: T, seed: number): T {
  const rng = createSeededRng(seed);
  const indexed = item.options.map((text, idx) => ({
    text,
    isCorrect: idx === item.correctIndex,
  }));

  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }

  let newCorrectIndex = indexed.findIndex((o) => o.isCorrect);
  if (newCorrectIndex < 0) newCorrectIndex = 0;

  return {
    ...item,
    options: indexed.map((o) => o.text),
    correctIndex: newCorrectIndex,
  };
}

export function shuffleQuizDrills(
  drills: CertificationQuestion[],
  seed: number
): DynamicQuizQuestion[] {
  const rng = createSeededRng(seed);
  const withShuffledOptions = drills.map((d, idx) => {
    const shuffled = shuffleQuestionOptions(d, seed + idx * 97 + 13);
    return {
      ...shuffled,
      variationTag: `Acak Opsi #${(Math.abs(seed) % 99) + 1}`,
      generatedBy: "curriculum-shuffle",
    };
  });

  if (withShuffledOptions.length <= 1) return withShuffledOptions;

  const reordered = [...withShuffledOptions];
  for (let i = reordered.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [reordered[i], reordered[j]] = [reordered[j], reordered[i]];
  }
  return reordered;
}

export function checkVerificationEligibility(
  curriculum: FieldCurriculum,
  completedModules: string[],
  passedCertIds: string[],
  practiceNotes: Record<string, string> = {}
): VerificationEligibility {
  const completedSet = new Set(completedModules);
  const passedSet = new Set(passedCertIds);

  const missingModules = curriculum.learningModules
    .filter((m) => !completedSet.has(m.id))
    .map((m) => ({ id: m.id, title: m.title }));

  const missingCerts = curriculum.certificationDrills
    .filter((c) => !passedSet.has(c.id))
    .map((c) => ({
      id: c.id,
      competencyCode: c.competencyCode,
      certName: c.certName,
    }));

  const practiceNotesCount = Object.values(practiceNotes).filter(
    (v) => typeof v === "string" && v.trim().length > 0
  ).length;

  return {
    eligible: missingModules.length === 0 && missingCerts.length === 0,
    completedModulesCount: curriculum.learningModules.length - missingModules.length,
    totalModules: curriculum.learningModules.length,
    passedCertCount: curriculum.certificationDrills.length - missingCerts.length,
    totalCerts: curriculum.certificationDrills.length,
    practiceNotesCount,
    missingModules,
    missingCerts,
  };
}

function cleanConceptText(raw: string): string {
  return sanitizeNoEmojiNoEmDash(raw).replace(/\s+/g, " ").trim();
}

function splitFirstSentence(raw: string): string {
  const cleaned = cleanConceptText(raw);
  const firstPeriod = cleaned.indexOf(".");
  if (firstPeriod > 30 && firstPeriod < 210) {
    return cleaned.slice(0, firstPeriod + 1);
  }
  return cleaned.length > 185 ? cleaned.slice(0, 182) + "..." : cleaned;
}

function pickDistinctDistractors(
  correctOption: string,
  pool: string[],
  seed: number
): string[] {
  const normalizedCorrect = correctOption.toLowerCase().slice(0, 48);
  const filtered = pool
    .map((item) => cleanConceptText(item))
    .filter(
      (item) =>
        item.length >= 16 &&
        item.length <= 210 &&
        !item.toLowerCase().startsWith(normalizedCorrect)
    );

  const unique: string[] = [];
  const seen = new Set<string>();
  for (const item of filtered) {
    const key = item.toLowerCase().slice(0, 48);
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    }
  }

  const rng = createSeededRng(seed);
  for (let i = unique.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [unique[i], unique[j]] = [unique[j], unique[i]];
  }

  const fallbackPool = [
    "Mengabaikan dokumentasi standar kerja dan langsung melewati tahap verifikasi teknis",
    "Mengubah konfigurasi utama secara manual tanpa pencadangan dan uji validasi awal",
    "Menggunakan pendekatan acak tanpa merujuk pada indikator kompetensi bidang terkait",
    "Menunda pencatatan data lapangan hingga seluruh proses operasional dinyatakan selesai",
  ];

  const result = unique.slice(0, 3);
  let fbIdx = 0;
  while (result.length < 3 && fbIdx < fallbackPool.length) {
    const candidate = fallbackPool[fbIdx++];
    if (!result.some((r) => r.toLowerCase() === candidate.toLowerCase())) {
      result.push(candidate);
    }
  }
  return result.slice(0, 3);
}

const BALI_LOCATIONS = [
  "Denpasar",
  "Badung",
  "Gianyar",
  "Tabanan",
  "Buleleng",
  "Klungkung",
  "Karangasem",
  "Bangli",
  "Jembrana",
];

export function buildDeterministicDynamicQuiz(
  curriculum: FieldCurriculum,
  attemptSeed: number,
  excludeQuestions: string[] = []
): DynamicQuizQuestion[] {
  const excludedSet = new Set(
    excludeQuestions.map((q) => cleanConceptText(q).toLowerCase())
  );

  const allModules = curriculum.learningModules;
  const allDrills = curriculum.certificationDrills;

  // Bangun pool distraktor dari konsep modul lain & opsi salah pada bank soal bidang
  const crossFieldDistractorPool: string[] = [
    ...allDrills.flatMap((d) =>
      d.options.filter((_, idx) => idx !== d.correctIndex)
    ),
    ...allModules.flatMap((m) =>
      m.keyConcepts.map((kc) => `Fokus hanya pada: ${splitFirstSentence(kc)}`)
    ),
  ];

  const generated: DynamicQuizQuestion[] = allDrills.map((baseDrill, idx) => {
    const matchingMod: LearningModule =
      allModules.find((m) => m.courseId === baseDrill.courseId) ||
      allModules[idx % allModules.length];
    const matchingCourse: TargetCourse =
      curriculum.targetCourses.find((c) => c.id === baseDrill.courseId) ||
      curriculum.targetCourses[idx % curriculum.targetCourses.length];

    const baliArea = BALI_LOCATIONS[(attemptSeed + idx * 2) % BALI_LOCATIONS.length];
    const angle = (attemptSeed + idx) % 4;
    const conceptIdx = (attemptSeed + idx) % matchingMod.keyConcepts.length;
    const pickedConcept = cleanConceptText(matchingMod.keyConcepts[conceptIdx]);

    let question = "";
    let correctOption = "";
    let explanation = "";
    let variationTag = "";

    const otherConceptsPool = allModules
      .filter((m) => m.id !== matchingMod.id)
      .flatMap((m) => m.keyConcepts.map((kc) => splitFirstSentence(kc)));

    const wrongFromSameDrill = baseDrill.options.filter(
      (_, oIdx) => oIdx !== baseDrill.correctIndex
    );

    if (angle === 0) {
      question = `[Skenario ${baliArea}] Dalam penerapan kompetensi ${baseDrill.competencyCode} (${matchingCourse.code} - ${matchingCourse.name}), prinsip atau langkah manakah yang paling tepat untuk mendukung ${splitFirstSentence(matchingMod.summary)}?`;
      correctOption = splitFirstSentence(pickedConcept);
      const distractors = pickDistinctDistractors(
        correctOption,
        [...otherConceptsPool, ...wrongFromSameDrill],
        attemptSeed + idx * 31
      );
      const item = shuffleQuestionOptions(
        {
          ...baseDrill,
          question: sanitizeNoEmojiNoEmDash(question),
          options: [correctOption, ...distractors],
          correctIndex: 0,
          explanation: sanitizeNoEmojiNoEmDash(
            `Konsep ini merupakan pilar utama pada ${matchingMod.title}. ${splitFirstSentence(matchingMod.studyMaterial)}`
          ),
          variationTag: `Studi Kasus ${baliArea} #${(attemptSeed % 99) + 1}`,
          generatedBy: "curriculum-dynamic",
        },
        attemptSeed + idx * 53 + 7
      );
      if (!excludedSet.has(item.question.toLowerCase())) {
        return item;
      }
    }

    if (angle === 1) {
      const caseContext = splitFirstSentence(matchingMod.baliCaseStudy);
      question = `[Studi Kasus Lapangan] Meninjau konteks proyek di Bali: "${caseContext}" Pada skema ${baseDrill.certName}, keputusan atau kompetensi inti apa yang wajib diutamakan?`;
      correctOption = `${cleanConceptText(matchingCourse.coreCompetency)} sesuai standar ${baseDrill.competencyCode}`;
      const otherCoursesPool = curriculum.targetCourses
        .filter((c) => c.id !== matchingCourse.id)
        .map((c) => `Mengutamakan ${c.coreCompetency} tanpa menyesuaikan target ${baseDrill.competencyCode}`);
      const distractors = pickDistinctDistractors(
        correctOption,
        [...otherCoursesPool, ...wrongFromSameDrill, ...crossFieldDistractorPool],
        attemptSeed + idx * 41
      );
      const item = shuffleQuestionOptions(
        {
          ...baseDrill,
          question: sanitizeNoEmojiNoEmDash(question),
          options: [correctOption, ...distractors],
          correctIndex: 0,
          explanation: sanitizeNoEmojiNoEmDash(
            `Benar! Pada kasus ${matchingMod.courseName}, kompetensi ${matchingCourse.coreCompetency} menjadi tolok ukur keberhasilan unit ${baseDrill.competencyCode}.`
          ),
          variationTag: `Konteks Industri #${(attemptSeed % 99) + 1}`,
          generatedBy: "curriculum-dynamic",
        },
        attemptSeed + idx * 67 + 11
      );
      if (!excludedSet.has(item.question.toLowerCase())) {
        return item;
      }
    }

    if (angle === 2) {
      const taskText = splitFirstSentence(matchingMod.practiceTask);
      question = `[Evaluasi Praktik ${baliArea}] Jika peserta ujian mendapat penugasan: "${taskText}" Hasil verifikasi terbaik untuk memenuhi unit ${baseDrill.competencyCode} adalah ...`;
      const altConcept = cleanConceptText(
        matchingMod.keyConcepts[(conceptIdx + 1) % matchingMod.keyConcepts.length]
      );
      correctOption = `Menerapkan ${splitFirstSentence(altConcept)} dengan dokumentasi kerja terukur`;
      const distractors = pickDistinctDistractors(
        correctOption,
        [...otherConceptsPool, ...wrongFromSameDrill],
        attemptSeed + idx * 73
      );
      const item = shuffleQuestionOptions(
        {
          ...baseDrill,
          question: sanitizeNoEmojiNoEmDash(question),
          options: [correctOption, ...distractors],
          correctIndex: 0,
          explanation: sanitizeNoEmojiNoEmDash(
            `Tepat! Tugas praktik pada ${matchingMod.moduleCode || matchingMod.title} menguji penerapan langsung: ${altConcept}.`
          ),
          variationTag: `Uji Praktik #${(attemptSeed % 99) + 1}`,
          generatedBy: "curriculum-dynamic",
        },
        attemptSeed + idx * 89 + 19
      );
      if (!excludedSet.has(item.question.toLowerCase())) {
        return item;
      }
    }

    // Angle 3 (atau cadangan jika teks kebetulan ada di excludedSet): Reframe soal sertifikasi inti + acak opsi
    const baseStem = cleanConceptText(baseDrill.question);
    const reframePrefix = `[Simulasi Adaptif #${(attemptSeed % 99) + 1} - ${baliArea}] `;
    question = excludedSet.has(baseStem.toLowerCase())
      ? `${reframePrefix}${baseStem}`
      : `${reframePrefix}${baseStem}`;
    explanation = cleanConceptText(baseDrill.explanation);
    variationTag = `Simulasi Adaptif #${(attemptSeed % 99) + 1}`;

    return shuffleQuestionOptions(
      {
        ...baseDrill,
        question: sanitizeNoEmojiNoEmDash(question),
        explanation: sanitizeNoEmojiNoEmDash(explanation),
        variationTag,
        generatedBy: "curriculum-dynamic",
      },
      attemptSeed + idx * 101 + 29
    );
  });

  // Rotasi urutan kartu soal berdasarkan seed agar urutan soal pun terasa segar
  const rng = createSeededRng(attemptSeed * 19 + 7);
  for (let i = generated.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [generated[i], generated[j]] = [generated[j], generated[i]];
  }
  return generated;
}

function normalizeAiQuizPayload(
  rawText: string,
  curriculum: FieldCurriculum,
  attemptSeed: number,
  sourceMode: "9router-structured" | "gemini-structured"
): DynamicQuizQuestion[] | null {
  const parsed = extractJsonPayload(rawText);
  if (!parsed || !Array.isArray(parsed.questions)) return null;

  const items = parsed.questions as Array<Record<string, unknown>>;
  if (items.length < Math.min(3, curriculum.certificationDrills.length)) {
    return null;
  }

  const baseById = new Map(
    curriculum.certificationDrills.map((d) => [d.id, d])
  );
  const usedIds = new Set<string>();
  const normalized: DynamicQuizQuestion[] = [];

  for (let i = 0; i < curriculum.certificationDrills.length; i++) {
    const baseDrill = curriculum.certificationDrills[i];
    const match =
      items.find(
        (it) => typeof it?.id === "string" && it.id.trim() === baseDrill.id
      ) || items[i];

    if (!match || typeof match !== "object") return null;

    const qText =
      typeof match.question === "string"
        ? sanitizeNoEmojiNoEmDash(match.question)
        : "";
    const expText =
      typeof match.explanation === "string"
        ? sanitizeNoEmojiNoEmDash(match.explanation)
        : "";
    const rawOptions = Array.isArray(match.options)
      ? match.options
          .map((o) => sanitizeNoEmojiNoEmDash(String(o || "")))
          .filter((o) => o.length >= 6)
      : [];
    const correctIdx =
      typeof match.correctIndex === "number" && Number.isInteger(match.correctIndex)
        ? match.correctIndex
        : -1;

    if (
      qText.length < 20 ||
      expText.length < 15 ||
      rawOptions.length !== 4 ||
      correctIdx < 0 ||
      correctIdx > 3
    ) {
      return null;
    }

    // Pastikan 4 opsi unik
    const uniqueOptSet = new Set(rawOptions.map((o) => o.toLowerCase()));
    if (uniqueOptSet.size < 4) return null;

    const targetBase = baseById.get(baseDrill.id) || baseDrill;
    if (usedIds.has(targetBase.id)) continue;
    usedIds.add(targetBase.id);

    const shuffled = shuffleQuestionOptions(
      {
        ...targetBase,
        question: qText,
        options: rawOptions,
        correctIndex: correctIdx,
        explanation: expText,
        variationTag: `AI Dinamis #${(attemptSeed % 99) + 1}`,
        generatedBy: sourceMode,
      },
      attemptSeed + i * 43 + 5
    );
    normalized.push(shuffled);
  }

  return normalized.length === curriculum.certificationDrills.length
    ? normalized
    : null;
}

export async function generateDynamicQuizSet(params: {
  fieldId: string;
  targetCourseId?: string;
  attemptSeed?: number;
  excludeQuestions?: string[];
}): Promise<DynamicQuizResponse> {
  const fieldId = MENTOR_CURRICULUM_BY_FIELD[params.fieldId]
    ? params.fieldId
    : "tkj";
  const curriculum = MENTOR_CURRICULUM_BY_FIELD[fieldId];
  const seedUsed =
    typeof params.attemptSeed === "number" && Number.isFinite(params.attemptSeed)
      ? Math.max(1, Math.floor(Math.abs(params.attemptSeed)))
      : Math.floor(Date.now() % 100000);
  const excludeList = (params.excludeQuestions || []).slice(0, 12);

  const unitsSpec = curriculum.certificationDrills.map((d) => {
    const mod =
      curriculum.learningModules.find((m) => m.courseId === d.courseId) ||
      curriculum.learningModules[0];
    return {
      id: d.id,
      competencyCode: d.competencyCode,
      certName: d.certName,
      topicHint: `${mod.title} - ${mod.keyConcepts.slice(0, 2).join("; ")}`,
    };
  });

  const systemInstruction = `Anda adalah Pembuat Bank Soal Uji Kompetensi Adaptif KertaMarga Bali.
Tugas Anda menghasilkan soal pilihan ganda BARU yang aplikatif dan tidak statis untuk bidang "${curriculum.fieldName}" (${curriculum.certificationBody}).
Aturan wajib:
1. Buat tepat ${curriculum.certificationDrills.length} soal BARU sesuai daftar unit (gunakan exact "id" setiap unit).
2. Setiap soal WAJIB berbeda redaksi dan skenarionya dari soal yang ada di daftar excludeQuestions. Gunakan skenario dunia kerja atau studi kasus realistis di Bali.
3. Dilarang memakai emoji apapun dan dilarang memakai em-dash. Gunakan tanda hubung biasa (-).
4. Setiap soal memiliki tepat 4 opsi jawaban yang masuk akal, setara panjangnya, serta 1 penjelasan pembahasan ringkas.
5. WAJIB membalas HANYA satu objek JSON valid:
{
  "questions": [
    {
      "id": "exact-unit-id",
      "question": "Pertanyaan skenario baru...",
      "options": ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
      "correctIndex": 0,
      "explanation": "Pembahasan konseptual singkat..."
    }
  ]
}`;

  const seedBucket = (seedUsed % 12) + 1;
  const userPrompt = `Bucket variasi: ${seedBucket}. Target course aktif: ${params.targetCourseId || curriculum.targetCourses[0].id}.
Daftar unit kompetensi: ${JSON.stringify(unitsSpec)}.
Soal sebelumnya yang HARUS DIHINDARI pengulangannya: ${JSON.stringify(excludeList)}.`;

  const routerResult = await callRouterWithFailover({
    model:
      process.env.ROUTER_MODEL ||
      process.env.ROUTER_COMBO_MODEL ||
      "ag/gemini-3-flash",
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: userPrompt },
    ],
    responseFormatJson: true,
    timeoutMs: 3200,
    totalBudgetMs: process.env.VERCEL ? 3800 : 6500,
    validateResponse: (raw) =>
      normalizeAiQuizPayload(raw, curriculum, seedUsed, "9router-structured") !== null,
  });

  if (routerResult?.content) {
    const normalized = normalizeAiQuizPayload(
      routerResult.content,
      curriculum,
      seedUsed,
      "9router-structured"
    );
    if (normalized) {
      return {
        fieldId,
        fieldName: curriculum.fieldName,
        seedUsed,
        sourceMode: "9router-structured",
        generatedAt: new Date().toISOString(),
        drills: normalized,
      };
    }
  }

  const geminiResult = await callGeminiDirectWithFailover({
    systemInstruction,
    userPrompt,
    perModelTimeoutMs: 6500,
    totalBudgetMs: 11000,
    validateResponse: (raw) =>
      normalizeAiQuizPayload(raw, curriculum, seedUsed, "gemini-structured") !== null,
  });

  if (geminiResult?.content) {
    const normalized = normalizeAiQuizPayload(
      geminiResult.content,
      curriculum,
      seedUsed,
      "gemini-structured"
    );
    if (normalized) {
      return {
        fieldId,
        fieldName: curriculum.fieldName,
        seedUsed,
        sourceMode: "gemini-structured",
        generatedAt: new Date().toISOString(),
        drills: normalized,
      };
    }
  }

  // Deterministic Dynamic Scenario Engine (tetap berganti-ganti tiap seed/percobaan)
  const fallbackDrills = buildDeterministicDynamicQuiz(
    curriculum,
    seedUsed,
    excludeList
  );

  return {
    fieldId,
    fieldName: curriculum.fieldName,
    seedUsed,
    sourceMode: "curriculum-dynamic",
    generatedAt: new Date().toISOString(),
    drills: fallbackDrills,
  };
}

function buildDeterministicVerificationItems(
  curriculum: FieldCurriculum,
  targetCourse: TargetCourse,
  seedUsed: number,
  practiceNotes: Record<string, string>,
  personalNotesText: string[]
): {
  mcqs: InternalVerificationMcq[];
  openPrompt: VerificationOpenPrompt;
  expectedKeywords: string[];
} {
  const mods = curriculum.learningModules;
  const baliCity = BALI_LOCATIONS[seedUsed % BALI_LOCATIONS.length];

  const allKeyConcepts = mods.flatMap((m) => m.keyConcepts);
  const mcqs: InternalVerificationMcq[] = [];

  for (let i = 0; i < 4; i++) {
    const mod = mods[(seedUsed + i) % mods.length];
    const concept = cleanConceptText(
      mod.keyConcepts[(seedUsed + i) % mod.keyConcepts.length]
    );
    const otherModConcepts = mods
      .filter((m) => m.id !== mod.id)
      .flatMap((m) => m.keyConcepts.map((kc) => splitFirstSentence(kc)));

    const wrongChoices = pickDistinctDistractors(
      splitFirstSentence(concept),
      [
        ...otherModConcepts,
        "Menjalankan proses tanpa verifikasi prasyarat atau pengukuran hasil kerja",
        "Mengandalkan hafalan langkah tunggal tanpa menyesuaikan kondisi kasus lapangan",
      ],
      seedUsed + i * 37 + 17
    );

    const promptVariant = (seedUsed + i) % 3;
    let qText = "";
    if (promptVariant === 0) {
      qText = `[Verifikasi Pemahaman Lintas Modul - ${baliCity}] Anda telah menuntaskan "${mod.title}". Dalam skenario kerja nyata (${splitFirstSentence(mod.baliCaseStudy)}), penerapan konsep inti manakah yang paling krusial untuk mencegah kegagalan teknis?`;
    } else if (promptVariant === 1) {
      qText = `[Sintesis Kurikulum ${mod.moduleCode || `MOD-${i + 1}`}] Setelah menyelesaikan modul dan tes sertifikasi ${curriculum.fieldName}, mengapa aspek "${splitFirstSentence(mod.summary)}" sangat bergantung pada penguasaan konsep berikut?`;
    } else {
      qText = `[Evaluasi Pemecahan Masalah] Saat menghadapi tugas: "${splitFirstSentence(mod.practiceTask)}", pendekatan teknis manakah yang paling sesuai dengan standar ${mod.courseName}?`;
    }

    const rawMcq: InternalVerificationMcq = {
      id: `ver-mcq-${i + 1}-${seedUsed % 1000}`,
      competencyCode: mod.moduleCode || `COMP-0${i + 1}`,
      moduleTitle: mod.title,
      question: sanitizeNoEmojiNoEmDash(qText),
      options: [splitFirstSentence(concept), ...wrongChoices],
      correctIndex: 0,
      explanation: sanitizeNoEmojiNoEmDash(
        `Pemahaman tepat! Pada "${mod.title}", penguasaan "${splitFirstSentence(concept)}" adalah fondasi untuk menyelesaikan studi kasus ${baliCity} dan target ${targetCourse.name}.`
      ),
    };

    mcqs.push(shuffleQuestionOptions(rawMcq, seedUsed + i * 71 + 9));
  }

  const filledPracticeValues = Object.values(practiceNotes).filter(
    (v) => v.trim().length > 0
  );
  const noteReference =
    filledPracticeValues[0] ||
    personalNotesText[0] ||
    curriculum.learningModules[0]?.practiceTask ||
    targetCourse.coreCompetency;

  const openQuestionTemplates = [
    `Sebagai evaluasi akhir pemahaman bidang ${curriculum.fieldName} (khususnya target mata kuliah ${targetCourse.name}), bayangkan Anda ditugaskan menangani proyek nyata di ${baliCity}. Jelaskan dalam 2 sampai 4 kalimat: (1) langkah analisis awal yang Anda lakukan, (2) konsep atau standar sertifikasi ${curriculum.mainCertificationTitle} yang Anda terapkan, dan (3) cara memvalidasi hasilnya.`,
    `Berdasarkan rangkuman seluruh modul dan latihan sertifikasi ${curriculum.fieldName} yang sudah Anda selesaikan, rumuskan solusi terstruktur untuk studi kasus: "${splitFirstSentence(mods[seedUsed % mods.length].baliCaseStudy)}". Sertakan alasan pemilihan metode dan target kompetensi ${targetCourse.code}.`,
  ];

  const openPrompt: VerificationOpenPrompt = {
    id: `ver-open-${seedUsed % 1000}`,
    title: sanitizeNoEmojiNoEmDash(
      `Studi Kasus Penerapan Mandiri: ${targetCourse.name}`
    ),
    question: sanitizeNoEmojiNoEmDash(
      openQuestionTemplates[seedUsed % openQuestionTemplates.length]
    ),
    contextHint: sanitizeNoEmojiNoEmDash(
      `Mengacu pada modul selesai dan catatan praktik Anda (${cleanConceptText(noteReference).slice(0, 110)}).`
    ),
    minChars: 40,
  };

  const keywordSource = [
    curriculum.fieldName,
    targetCourse.name,
    targetCourse.coreCompetency,
    ...allKeyConcepts,
    ...mods.map((m) => m.title),
  ]
    .join(" ")
    .toLowerCase();

  const stopWords = new Set([
    "untuk",
    "dengan",
    "yang",
    "pada",
    "dalam",
    "atau",
    "dari",
    "serta",
    "agar",
    "oleh",
    "modul",
    "dasar",
    "kompetensi",
    "standar",
    "sistem",
    "proses",
    "kerja",
    "bali",
  ]);
  const tokens = Array.from(
    new Set(
      keywordSource
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length >= 4 && !stopWords.has(w))
    )
  ).slice(0, 28);

  return {
    mcqs,
    openPrompt,
    expectedKeywords: tokens,
  };
}

function normalizeAiVerificationPayload(
  rawText: string,
  curriculum: FieldCurriculum,
  targetCourse: TargetCourse,
  seedUsed: number
): {
  mcqs: InternalVerificationMcq[];
  openPrompt: VerificationOpenPrompt;
  expectedKeywords: string[];
} | null {
  const parsed = extractJsonPayload(rawText);
  if (!parsed || !Array.isArray(parsed.mcqs) || parsed.mcqs.length < 4) {
    return null;
  }

  const normalizedMcqs: InternalVerificationMcq[] = [];
  for (let i = 0; i < 4; i++) {
    const rawItem = parsed.mcqs[i] as Record<string, unknown> | undefined;
    if (!rawItem || typeof rawItem !== "object") return null;

    const q =
      typeof rawItem.question === "string"
        ? sanitizeNoEmojiNoEmDash(rawItem.question)
        : "";
    const exp =
      typeof rawItem.explanation === "string"
        ? sanitizeNoEmojiNoEmDash(rawItem.explanation)
        : "";
    const opts = Array.isArray(rawItem.options)
      ? rawItem.options
          .map((o) => sanitizeNoEmojiNoEmDash(String(o || "")))
          .filter((o) => o.length >= 6)
      : [];
    const cIdx =
      typeof rawItem.correctIndex === "number" && Number.isInteger(rawItem.correctIndex)
        ? rawItem.correctIndex
        : -1;

    if (
      q.length < 24 ||
      exp.length < 15 ||
      opts.length !== 4 ||
      new Set(opts.map((o) => o.toLowerCase())).size < 4 ||
      cIdx < 0 ||
      cIdx > 3
    ) {
      return null;
    }

    const fallbackMod =
      curriculum.learningModules[i % curriculum.learningModules.length];

    normalizedMcqs.push(
      shuffleQuestionOptions(
        {
          id: `ver-mcq-${i + 1}-${seedUsed % 1000}`,
          competencyCode: sanitizeNoEmojiNoEmDash(
            typeof rawItem.competencyCode === "string" && rawItem.competencyCode.trim()
              ? rawItem.competencyCode
              : fallbackMod.moduleCode || `VER-0${i + 1}`
          ),
          moduleTitle: sanitizeNoEmojiNoEmDash(
            typeof rawItem.moduleTitle === "string" && rawItem.moduleTitle.trim()
              ? rawItem.moduleTitle
              : fallbackMod.title
          ),
          question: q,
          options: opts,
          correctIndex: cIdx,
          explanation: exp,
        },
        seedUsed + i * 59 + 3
      )
    );
  }

  const rawOpen =
    parsed.openPrompt && typeof parsed.openPrompt === "object"
      ? (parsed.openPrompt as Record<string, unknown>)
      : null;
  const openQuestion =
    rawOpen && typeof rawOpen.question === "string"
      ? sanitizeNoEmojiNoEmDash(rawOpen.question)
      : "";
  if (openQuestion.length < 30) return null;

  const expectedKeywords = Array.isArray(parsed.expectedKeywords)
    ? parsed.expectedKeywords
        .map((k) => cleanConceptText(String(k || "")).toLowerCase())
        .filter((k) => k.length >= 3)
        .slice(0, 20)
    : [curriculum.fieldId, targetCourse.code.toLowerCase()];

  return {
    mcqs: normalizedMcqs,
    openPrompt: {
      id: `ver-open-${seedUsed % 1000}`,
      title: sanitizeNoEmojiNoEmDash(
        rawOpen && typeof rawOpen.title === "string" && rawOpen.title.trim()
          ? rawOpen.title
          : `Studi Kasus Pemahaman Akhir: ${targetCourse.name}`
      ),
      question: openQuestion,
      contextHint: sanitizeNoEmojiNoEmDash(
        rawOpen && typeof rawOpen.contextHint === "string" && rawOpen.contextHint.trim()
          ? rawOpen.contextHint
          : `Hubungkan pemahaman seluruh modul, sertifikasi, dan praktik ${curriculum.fieldName}.`
      ),
      minChars: 40,
    },
    expectedKeywords,
  };
}

export async function generateCompetencyVerification(params: {
  fieldId: string;
  targetCourseId?: string;
  attemptSeed?: number;
  completedModules: string[];
  passedCertIds: string[];
  practiceNotes?: Record<string, string>;
  personalNotesText?: string[];
}): Promise<
  | { ok: true; data: GeneratedVerificationResponse }
  | { ok: false; error: string; eligibility: VerificationEligibility }
> {
  const fieldId = MENTOR_CURRICULUM_BY_FIELD[params.fieldId]
    ? params.fieldId
    : "tkj";
  const curriculum = MENTOR_CURRICULUM_BY_FIELD[fieldId];
  const practiceNotes = params.practiceNotes || {};
  const eligibility = checkVerificationEligibility(
    curriculum,
    params.completedModules,
    params.passedCertIds,
    practiceNotes
  );

  if (!eligibility.eligible) {
    return {
      ok: false,
      error: `Verifikasi kemampuan terkunci. Selesaikan seluruh modul (${eligibility.completedModulesCount}/${eligibility.totalModules}) dan lulus semua unit quiz sertifikasi (${eligibility.passedCertCount}/${eligibility.totalCerts}) terlebih dahulu.`,
      eligibility,
    };
  }

  const targetCourse =
    curriculum.targetCourses.find((c) => c.id === params.targetCourseId) ||
    curriculum.targetCourses[0];
  const seedUsed =
    typeof params.attemptSeed === "number" && Number.isFinite(params.attemptSeed)
      ? Math.max(1, Math.floor(Math.abs(params.attemptSeed)))
      : Math.floor(Date.now() % 100000);
  const assessmentId = `ver-${fieldId}-${seedUsed}-${Date.now().toString(36)}`;

  const moduleDigests = curriculum.learningModules.map((m) => ({
    code: m.moduleCode || m.id,
    title: m.title,
    keyConcepts: m.keyConcepts.slice(0, 3),
    practiceNote: practiceNotes[m.id] ? practiceNotes[m.id].slice(0, 220) : "",
  }));

  const personalSnippets = (params.personalNotesText || [])
    .filter((t) => typeof t === "string" && t.trim().length > 0)
    .slice(0, 3)
    .map((t) => t.slice(0, 180));

  const systemInstruction = `Anda adalah Asesor Kompetensi & Pembuat Ujian Verifikasi Pemahaman KertaMarga Bali.
Pengguna telah menuntaskan SEMUA modul materi dan lulus SEMUA quiz sertifikasi di bidang "${curriculum.fieldName}".
Tugas Anda: merancang asesmen verifikasi pemahaman tingkat sintesis berbasis materi modul dan catatan praktik siswa.
Aturan wajib:
1. Hasilkan TEPAT 4 soal pilihan ganda analitis ("mcqs") yang menguji PEMAHAMAN KONSEP & PENERAPAN KASUS NYATA DI BALI lintas modul (bukan sekadar hafalan definisi).
2. Hasilkan 1 pertanyaan studi kasus uraian singkat ("openPrompt") untuk mengecek penalaran mandiri siswa.
3. Dilarang memakai emoji dan dilarang memakai em-dash. Gunakan tanda hubung biasa (-).
4. WAJIB membalas HANYA satu objek JSON valid dengan skema:
{
  "mcqs": [
    {
      "competencyCode": "kode unit/modul",
      "moduleTitle": "judul modul terkait",
      "question": "Pertanyaan analisis pemahaman...",
      "options": ["Opsi 1", "Opsi 2", "Opsi 3", "Opsi 4"],
      "correctIndex": 0,
      "explanation": "Alasan teknis mengapa jawaban ini benar..."
    }
  ],
  "openPrompt": {
    "title": "Judul studi kasus akhir",
    "question": "Pertanyaan kasus aplikasi nyata 1-2 kalimat yang menuntut penjelasan terstruktur siswa...",
    "contextHint": "Petunjuk singkat fokus penilaian jawaban"
  },
  "expectedKeywords": ["kata-kunci-1", "kata-kunci-2", "kata-kunci-3", "kata-kunci-4", "kata-kunci-5"]
}`;

  const verBucket = (seedUsed % 12) + 1;
  const userPrompt = `Bucket percobaan: ${verBucket}. Target mata kuliah: ${targetCourse.code} - ${targetCourse.name} (${targetCourse.coreCompetency}).
Sertifikasi acuan: ${curriculum.mainCertificationTitle}.
Ringkasan modul selesai & catatan praktik siswa: ${JSON.stringify(moduleDigests)}.
Catatan pribadi siswa: ${JSON.stringify(personalSnippets)}.`;

  let sourceMode: "9router-structured" | "gemini-structured" | "curriculum-dynamic" =
    "curriculum-dynamic";
  let built: {
    mcqs: InternalVerificationMcq[];
    openPrompt: VerificationOpenPrompt;
    expectedKeywords: string[];
  } | null = null;

  const routerResult = await callRouterWithFailover({
    model:
      process.env.ROUTER_MODEL ||
      process.env.ROUTER_COMBO_MODEL ||
      "ag/gemini-3-flash",
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: userPrompt },
    ],
    responseFormatJson: true,
    timeoutMs: 3200,
    totalBudgetMs: process.env.VERCEL ? 3800 : 6500,
    validateResponse: (raw) =>
      normalizeAiVerificationPayload(raw, curriculum, targetCourse, seedUsed) !== null,
  });

  if (routerResult?.content) {
    const normalized = normalizeAiVerificationPayload(
      routerResult.content,
      curriculum,
      targetCourse,
      seedUsed
    );
    if (normalized) {
      built = normalized;
      sourceMode = "9router-structured";
    }
  }

  if (!built) {
    const geminiResult = await callGeminiDirectWithFailover({
      systemInstruction,
      userPrompt,
      perModelTimeoutMs: 6500,
      totalBudgetMs: 11000,
      validateResponse: (raw) =>
        normalizeAiVerificationPayload(raw, curriculum, targetCourse, seedUsed) !== null,
    });
    if (geminiResult?.content) {
      const normalized = normalizeAiVerificationPayload(
        geminiResult.content,
        curriculum,
        targetCourse,
        seedUsed
      );
      if (normalized) {
        built = normalized;
        sourceMode = "gemini-structured";
      }
    }
  }

  if (!built) {
    built = buildDeterministicVerificationItems(
      curriculum,
      targetCourse,
      seedUsed,
      practiceNotes,
      params.personalNotesText || []
    );
    sourceMode = "curriculum-dynamic";
  }

  const claims: SignedVerificationClaims = {
    purpose: "skill-verification",
    assessmentId,
    fieldId,
    fieldName: curriculum.fieldName,
    targetCourseName: `${targetCourse.code} - ${targetCourse.name}`,
    mcqs: built.mcqs,
    openPrompt: built.openPrompt,
    expectedKeywords: built.expectedKeywords,
  };

  const verificationToken = await new SignJWT(claims as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(getAssessmentJwtSecret());

  return {
    ok: true,
    data: {
      assessmentId,
      fieldId,
      fieldName: curriculum.fieldName,
      targetCourseName: claims.targetCourseName,
      generatedAt: new Date().toISOString(),
      seedUsed,
      sourceMode,
      mcqs: built.mcqs.map((m) => ({
        id: m.id,
        competencyCode: m.competencyCode,
        moduleTitle: m.moduleTitle,
        question: m.question,
        options: m.options,
      })),
      openPrompt: built.openPrompt,
      verificationToken,
    },
  };
}

function evaluateOpenAnswerDeterministic(
  openAnswer: string,
  expectedKeywords: string[],
  curriculum: FieldCurriculum,
  targetCourse: TargetCourse
): {
  openScore: number;
  openFeedback: string;
  strengths: string[];
  improvements: string[];
} {
  const trimmed = cleanConceptText(openAnswer);
  if (trimmed.length < 25) {
    return {
      openScore: 2,
      openFeedback:
        "Jawaban uraian studi kasus terlalu singkat sehingga belum menunjukkan alur analisis, pemilihan metode teknis, maupun verifikasi hasil kerja.",
      strengths: [],
      improvements: [
        `Uraikan langkah kerja terstruktur minimal 2 sampai 4 kalimat untuk mata kuliah ${targetCourse.name}.`,
        `Sertakan standar kompetensi atau langkah validasi hasil sesuai ${curriculum.mainCertificationTitle}.`,
      ],
    };
  }

  const lower = trimmed.toLowerCase();
  const matchedKeywords = expectedKeywords.filter((kw) =>
    lower.includes(kw.toLowerCase())
  );
  const hasActionReasoning =
    /(langkah|pertama|analisis|konfigurasi|desain|uji|validasi|evaluasi|standar|metode|dokumentasi|karena|sehingga|agar)/i.test(
      trimmed
    );
  const lengthPoints = trimmed.length >= 160 ? 6 : trimmed.length >= 90 ? 5 : 3;
  const keywordPoints = Math.min(9, matchedKeywords.length * 3);
  const logicPoints = hasActionReasoning ? 5 : 2;
  const openScore = Math.max(4, Math.min(20, lengthPoints + keywordPoints + logicPoints));

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (matchedKeywords.length >= 2) {
    strengths.push(
      `Menghubungkan konsep kunci bidang (${matchedKeywords.slice(0, 3).join(", ")}) ke dalam solusi.`
    );
  }
  if (hasActionReasoning) {
    strengths.push(
      "Menyajikan alur penalaran langkah kerja dan tujuan validasi dengan jelas."
    );
  }
  if (openScore < 14) {
    improvements.push(
      `Perkuat penjelasan dengan menyebutkan standar verifikasi spesifik (${curriculum.certificationBody}) dan langkah mitigasi risiko lapangan.`
    );
  } else if (openScore < 18) {
    improvements.push(
      `Tambahkan indikator keberhasilan terukur saat menguji solusi pada kasus nyata di ${curriculum.fieldName}.`
    );
  }

  const openFeedback =
    openScore >= 14
      ? `Penalaran studi kasus sudah relevan dengan fokus ${targetCourse.name} dan mencerminkan pemahaman alur kerja praktis.`
      : `Jawaban sudah mengarah ke topik ${curriculum.fieldName}, namun masih perlu diperdalam dengan langkah teknis konkret dan kriteria validasi standar industri.`;

  return {
    openScore,
    openFeedback: sanitizeNoEmojiNoEmDash(openFeedback),
    strengths: strengths.map((s) => sanitizeNoEmojiNoEmDash(s)),
    improvements: improvements.map((s) => sanitizeNoEmojiNoEmDash(s)),
  };
}

export async function evaluateCompetencyVerification(params: {
  fieldId: string;
  verificationToken: string;
  mcqAnswers: Record<string, number>;
  openAnswer: string;
}): Promise<
  | { ok: true; data: EvaluatedVerificationResponse }
  | { ok: false; status: number; error: string }
> {
  let claims: SignedVerificationClaims;
  try {
    const { payload } = await jwtVerify(
      params.verificationToken,
      getAssessmentJwtSecret()
    );
    if (
      payload?.purpose !== "skill-verification" ||
      payload?.fieldId !== params.fieldId ||
      !Array.isArray(payload?.mcqs)
    ) {
      return {
        ok: false,
        status: 400,
        error: "Token verifikasi kemampuan tidak valid atau tidak sesuai bidang.",
      };
    }
    claims = payload as unknown as SignedVerificationClaims;
  } catch {
    return {
      ok: false,
      status: 400,
      error: "Sesi soal verifikasi sudah kedaluwarsa atau tidak valid. Silakan buat ulang soal verifikasi.",
    };
  }

  const curriculum =
    MENTOR_CURRICULUM_BY_FIELD[claims.fieldId] || MENTOR_CURRICULUM_BY_FIELD.tkj;
  const targetCourse =
    curriculum.targetCourses.find(
      (c) => `${c.code} - ${c.name}` === claims.targetCourseName
    ) || curriculum.targetCourses[0];

  const reviews: VerificationQuestionReview[] = claims.mcqs.map((mcq) => {
    const rawChosen = params.mcqAnswers?.[mcq.id];
    const selectedIndex =
      typeof rawChosen === "number" &&
      Number.isInteger(rawChosen) &&
      rawChosen >= 0 &&
      rawChosen < mcq.options.length
        ? rawChosen
        : -1;
    const isCorrect = selectedIndex === mcq.correctIndex;
    return {
      id: mcq.id,
      competencyCode: mcq.competencyCode,
      question: mcq.question,
      options: mcq.options,
      selectedIndex,
      correctIndex: mcq.correctIndex,
      isCorrect,
      explanation: mcq.explanation,
    };
  });

  const mcqCorrectCount = reviews.filter((r) => r.isCorrect).length;
  const mcqTotal = reviews.length;
  const mcqPoints = mcqCorrectCount * 20; // maks 80

  let openEval = evaluateOpenAnswerDeterministic(
    params.openAnswer || "",
    claims.expectedKeywords || [],
    curriculum,
    targetCourse
  );
  let evalSourceMode = "deterministic-rubric";

  // Jika jawaban uraian memadai (>= 30 karakter), coba periksa juga dengan LLM untuk feedback personal
  const trimmedOpen = cleanConceptText(params.openAnswer || "");
  if (trimmedOpen.length >= 30) {
    const evalSystem = `Anda adalah Asesor Penilai Pemahaman Siswa KertaMarga Bali untuk bidang "${curriculum.fieldName}".
Nilai jawaban uraian siswa pada rentang skor 0 hingga 20 berdasarkan ketepatan konsep, langkah praktis, dan kesesuaian terhadap studi kasus.
Aturan:
1. Dilarang memakai emoji dan dilarang memakai em-dash.
2. Balas HANYA satu objek JSON valid:
{
  "openScore": 16,
  "openFeedback": "Umpan balik 1-2 kalimat yang spesifik terhadap jawaban siswa...",
  "strengths": ["Poin kuat siswa"],
  "improvements": ["Saran perbaikan spesifik bila ada"]
}`;
    const evalUser = `Pertanyaan kasus: ${claims.openPrompt.question}
Kata kunci acuan: ${JSON.stringify(claims.expectedKeywords)}.
Jawaban siswa: "${trimmedOpen.slice(0, 1200)}"`;

    const tryParseEval = (raw: string) => {
      const obj = extractJsonPayload(raw);
      if (!obj || typeof obj.openScore !== "number") return null;
      const sc = Math.max(0, Math.min(20, Math.round(obj.openScore)));
      const fb =
        typeof obj.openFeedback === "string" && obj.openFeedback.trim().length >= 15
          ? sanitizeNoEmojiNoEmDash(obj.openFeedback)
          : "";
      if (!fb) return null;
      const strengths = Array.isArray(obj.strengths)
        ? obj.strengths.map((s) => sanitizeNoEmojiNoEmDash(String(s || ""))).filter(Boolean).slice(0, 3)
        : [];
      const improvements = Array.isArray(obj.improvements)
        ? obj.improvements.map((s) => sanitizeNoEmojiNoEmDash(String(s || ""))).filter(Boolean).slice(0, 3)
        : [];
      return { openScore: sc, openFeedback: fb, strengths, improvements };
    };

    const routerEval = await callRouterWithFailover({
      model:
        process.env.ROUTER_MODEL ||
        process.env.ROUTER_COMBO_MODEL ||
        "ag/gemini-3-flash",
      messages: [
        { role: "system", content: evalSystem },
        { role: "user", content: evalUser },
      ],
      responseFormatJson: true,
      bypassCache: true,
      timeoutMs: 3000,
      totalBudgetMs: process.env.VERCEL ? 3500 : 5500,
      validateResponse: (raw) => tryParseEval(raw) !== null,
    });

    if (routerEval?.content) {
      const parsed = tryParseEval(routerEval.content);
      if (parsed) {
        openEval = parsed;
        evalSourceMode = "9router-graded";
      }
    } else {
      const geminiEval = await callGeminiDirectWithFailover({
        systemInstruction: evalSystem,
        userPrompt: evalUser,
        perModelTimeoutMs: 5500,
        totalBudgetMs: 8500,
        validateResponse: (raw) => tryParseEval(raw) !== null,
      });
      if (geminiEval?.content) {
        const parsed = tryParseEval(geminiEval.content);
        if (parsed) {
          openEval = parsed;
          evalSourceMode = "gemini-graded";
        }
      }
    }
  }

  const totalScore = Math.max(
    0,
    Math.min(100, Math.round(mcqPoints + openEval.openScore))
  );
  const openPassed = openEval.openScore >= 12;
  const correctCount = mcqCorrectCount + (openPassed ? 1 : 0);
  const totalQuestions = mcqTotal + 1;
  const status: "passed" | "needs_review" =
    totalScore >= 70 ? "passed" : "needs_review";

  const strengths = [...openEval.strengths];
  if (mcqCorrectCount >= 3) {
    strengths.unshift(
      `Menguasai ${mcqCorrectCount}/${mcqTotal} skenario analisis konsep inti lintas modul ${curriculum.fieldName}.`
    );
  }
  const improvements = [...openEval.improvements];
  const wrongReviews = reviews.filter((r) => !r.isCorrect);
  if (wrongReviews.length > 0) {
    improvements.unshift(
      `Tinjau kembali unit ${wrongReviews.map((r) => r.competencyCode).join(", ")} pada pembahasan di bawah.`
    );
  }

  const summary =
    status === "passed"
      ? `Pemahaman kemampuan Anda pada bidang ${curriculum.fieldName} dinyatakan TERVERIFIKASI dengan skor ${totalScore}% (${correctCount}/${totalQuestions} komponen terpenuhi). Anda siap melangkah ke portofolio dan jalur seleksi lanjutan.`
      : `Skor verifikasi kemampuan Anda saat ini ${totalScore}% (${correctCount}/${totalQuestions} komponen terpenuhi). Tinjau pembahasan pada unit yang masih keliru lalu buat soal verifikasi baru untuk mencapai minimal 70%.`;

  return {
    ok: true,
    data: {
      fieldId: claims.fieldId,
      score: totalScore,
      correctCount,
      totalQuestions,
      mcqCorrectCount,
      mcqTotal,
      openScore: openEval.openScore,
      maxOpenScore: 20,
      status,
      summary: sanitizeNoEmojiNoEmDash(summary),
      strengths: strengths.slice(0, 4).map((s) => sanitizeNoEmojiNoEmDash(s)),
      improvements: improvements.slice(0, 4).map((s) => sanitizeNoEmojiNoEmDash(s)),
      reviews,
      openFeedback: openEval.openFeedback,
      openAnswer: sanitizeNoEmojiNoEmDash(params.openAnswer || "").slice(0, 1200),
      verifiedAt: new Date().toISOString(),
      sourceMode: evalSourceMode,
    },
  };
}
