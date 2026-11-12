import { FIELDS, GROUP_CONFIG, type FieldGroup } from "@/data/fields";
import { MENTOR_CURRICULUM_BY_FIELD } from "@/data/mentorCurriculum";
import type { SafeUser } from "@/lib/schema";

export const PERSONAL_NOTES_STORAGE_KEY = "kertamarga_personal_notes";
export const SURVEY_RESULT_STORAGE_KEY = "kertamarga_survey_result";
export const STUDY_PROGRESS_PREFIX = "kertamarga_study_progress_";

export type PersonalNoteCategory =
  | "Ringkasan Materi"
  | "Catatan Praktik"
  | "Target Kampus"
  | "Persiapan Sertifikasi"
  | "Refleksi Karier";

export const NOTE_CATEGORIES: PersonalNoteCategory[] = [
  "Ringkasan Materi",
  "Catatan Praktik",
  "Target Kampus",
  "Persiapan Sertifikasi",
  "Refleksi Karier",
];

export interface PersonalLearningNote {
  id: string;
  title: string;
  fieldId: string;
  category: PersonalNoteCategory;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface FieldVerificationResult {
  status: "passed" | "needs_review";
  score: number;
  correctCount: number;
  totalQuestions: number;
  attemptCount: number;
  verifiedAt: string;
  summary: string;
  strengths: string[];
  improvements: string[];
  sourceMode: string;
}

export interface FieldStudyProgressSnapshot {
  fieldId: string;
  completedModules: string[];
  passedCertIds: string[];
  practiceNotes: Record<string, string>;
  verification?: FieldVerificationResult;
  updatedAt?: string;
}

export interface SavedSurveySnapshot {
  fieldId: string;
  courseId?: string;
  score: number;
  dominant: FieldGroup;
  mismatch: boolean;
  completedAt?: string;
}

export interface FullLearningSnapshot {
  personalNotes: PersonalLearningNote[];
  progressByField: Record<string, FieldStudyProgressSnapshot>;
  surveyResult: SavedSurveySnapshot | null;
  updatedAt: string;
}

export interface ModulePracticeNoteView {
  fieldId: string;
  fieldName: string;
  moduleId: string;
  moduleCode: string;
  moduleTitle: string;
  courseCode: string;
  courseName: string;
  practiceTask: string;
  noteText: string;
  isCompleted: boolean;
  scoreBoost: number;
}

const VALID_FIELD_IDS = Object.keys(MENTOR_CURRICULUM_BY_FIELD);

function sanitizeStringArray(val: unknown): string[] {
  if (!Array.isArray(val)) return [];
  return Array.from(
    new Set(val.filter((item): item is string => typeof item === "string" && item.trim().length > 0))
  );
}

function sanitizeNotesRecord(val: unknown): Record<string, string> {
  if (!val || typeof val !== "object" || Array.isArray(val)) return {};
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
    if (typeof k === "string" && typeof v === "string" && v.trim().length > 0) {
      result[k] = v;
    }
  }
  return result;
}

function sanitizeVerificationResult(val: unknown): FieldVerificationResult | undefined {
  if (!val || typeof val !== "object" || Array.isArray(val)) return undefined;
  const v = val as Partial<FieldVerificationResult>;
  if (v.status !== "passed" && v.status !== "needs_review") return undefined;
  if (typeof v.score !== "number" || Number.isNaN(v.score)) return undefined;
  return {
    status: v.status,
    score: Math.max(0, Math.min(100, Math.round(v.score))),
    correctCount:
      typeof v.correctCount === "number" && !Number.isNaN(v.correctCount)
        ? Math.max(0, Math.round(v.correctCount))
        : 0,
    totalQuestions:
      typeof v.totalQuestions === "number" && !Number.isNaN(v.totalQuestions)
        ? Math.max(1, Math.round(v.totalQuestions))
        : 5,
    attemptCount:
      typeof v.attemptCount === "number" && !Number.isNaN(v.attemptCount)
        ? Math.max(1, Math.round(v.attemptCount))
        : 1,
    verifiedAt:
      typeof v.verifiedAt === "string" && v.verifiedAt
        ? v.verifiedAt
        : new Date().toISOString(),
    summary: typeof v.summary === "string" ? v.summary.slice(0, 1000) : "",
    strengths: sanitizeStringArray(v.strengths).slice(0, 5),
    improvements: sanitizeStringArray(v.improvements).slice(0, 5),
    sourceMode:
      typeof v.sourceMode === "string" && v.sourceMode
        ? v.sourceMode.slice(0, 60)
        : "ai-verified",
  };
}

export function readFieldProgressFromStorage(fieldId: string): FieldStudyProgressSnapshot {
  const empty: FieldStudyProgressSnapshot = {
    fieldId,
    completedModules: [],
    passedCertIds: [],
    practiceNotes: {},
  };
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(`${STUDY_PROGRESS_PREFIX}${fieldId}`);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<FieldStudyProgressSnapshot>;
    return {
      fieldId,
      completedModules: sanitizeStringArray(parsed.completedModules),
      passedCertIds: sanitizeStringArray(parsed.passedCertIds),
      practiceNotes: sanitizeNotesRecord(parsed.practiceNotes),
      verification: sanitizeVerificationResult(parsed.verification),
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : undefined,
    };
  } catch {
    return empty;
  }
}

export function writeFieldProgressToStorage(
  fieldId: string,
  progress: Omit<FieldStudyProgressSnapshot, "fieldId">
): FieldStudyProgressSnapshot {
  const payload: FieldStudyProgressSnapshot = {
    fieldId,
    completedModules: sanitizeStringArray(progress.completedModules),
    passedCertIds: sanitizeStringArray(progress.passedCertIds),
    practiceNotes: sanitizeNotesRecord(progress.practiceNotes),
    verification: sanitizeVerificationResult(progress.verification),
    updatedAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(
        `${STUDY_PROGRESS_PREFIX}${fieldId}`,
        JSON.stringify(payload)
      );
    } catch {
      // Abaikan kegagalan kuota penyimpanan browser
    }
  }
  return payload;
}

export function updateModulePracticeNoteInStorage(
  fieldId: string,
  moduleId: string,
  noteText: string
): FieldStudyProgressSnapshot {
  const current = readFieldProgressFromStorage(fieldId);
  const nextNotes = { ...current.practiceNotes };
  if (noteText.trim().length > 0) {
    nextNotes[moduleId] = noteText;
  } else {
    delete nextNotes[moduleId];
  }
  return writeFieldProgressToStorage(fieldId, {
    completedModules: current.completedModules,
    passedCertIds: current.passedCertIds,
    practiceNotes: nextNotes,
    verification: current.verification,
  });
}

export function readPersonalNotesFromStorage(): PersonalLearningNote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PERSONAL_NOTES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is PersonalLearningNote =>
          Boolean(item) &&
          typeof item.id === "string" &&
          typeof item.title === "string" &&
          typeof item.content === "string"
      )
      .map((item) => ({
        id: item.id,
        title: item.title.trim(),
        fieldId: typeof item.fieldId === "string" ? item.fieldId : "umum",
        category: NOTE_CATEGORIES.includes(item.category)
          ? item.category
          : "Ringkasan Materi",
        content: item.content,
        createdAt:
          typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString(),
        updatedAt:
          typeof item.updatedAt === "string" ? item.updatedAt : new Date().toISOString(),
      }))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch {
    return [];
  }
}

export function writePersonalNotesToStorage(notes: PersonalLearningNote[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PERSONAL_NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // Abaikan kegagalan kuota penyimpanan browser
  }
}

export function readSurveyResultFromStorage(): SavedSurveySnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SURVEY_RESULT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedSurveySnapshot>;
    if (
      !parsed ||
      typeof parsed.fieldId !== "string" ||
      typeof parsed.score !== "number" ||
      Number.isNaN(parsed.score)
    ) {
      return null;
    }
    const validField = MENTOR_CURRICULUM_BY_FIELD[parsed.fieldId]
      ? parsed.fieldId
      : "tkj";
    const dominant: FieldGroup =
      parsed.dominant && GROUP_CONFIG[parsed.dominant]
        ? parsed.dominant
        : MENTOR_CURRICULUM_BY_FIELD[validField].group;

    return {
      fieldId: validField,
      courseId: typeof parsed.courseId === "string" ? parsed.courseId : undefined,
      score: Math.max(35, Math.min(95, Math.round(parsed.score))),
      dominant,
      mismatch: Boolean(parsed.mismatch),
      completedAt:
        typeof parsed.completedAt === "string" ? parsed.completedAt : undefined,
    };
  } catch {
    return null;
  }
}

export function readFullLearningSnapshot(): FullLearningSnapshot {
  const progressByField: Record<string, FieldStudyProgressSnapshot> = {};
  for (const fieldId of VALID_FIELD_IDS) {
    const prog = readFieldProgressFromStorage(fieldId);
    if (
      prog.completedModules.length > 0 ||
      prog.passedCertIds.length > 0 ||
      Object.keys(prog.practiceNotes).length > 0 ||
      Boolean(prog.verification)
    ) {
      progressByField[fieldId] = prog;
    }
  }
  return {
    personalNotes: readPersonalNotesFromStorage(),
    progressByField,
    surveyResult: readSurveyResultFromStorage(),
    updatedAt: new Date().toISOString(),
  };
}

export function applyFullLearningSnapshotToStorage(snapshot: FullLearningSnapshot): void {
  if (typeof window === "undefined") return;
  writePersonalNotesToStorage(snapshot.personalNotes || []);
  for (const [fieldId, prog] of Object.entries(snapshot.progressByField || {})) {
    if (MENTOR_CURRICULUM_BY_FIELD[fieldId]) {
      writeFieldProgressToStorage(fieldId, prog);
    }
  }
  if (snapshot.surveyResult && MENTOR_CURRICULUM_BY_FIELD[snapshot.surveyResult.fieldId]) {
    try {
      const existing = readSurveyResultFromStorage();
      if (!existing) {
        window.localStorage.setItem(
          SURVEY_RESULT_STORAGE_KEY,
          JSON.stringify(snapshot.surveyResult)
        );
      }
    } catch {
      // Abaikan kesalahan penyimpanan
    }
  }
}

export function mergeLearningSnapshots(
  local: FullLearningSnapshot,
  remote?: Partial<FullLearningSnapshot> | null
): FullLearningSnapshot {
  if (!remote) return local;

  const notesMap = new Map<string, PersonalLearningNote>();
  for (const note of remote.personalNotes || []) {
    if (note && note.id) notesMap.set(note.id, note);
  }
  for (const note of local.personalNotes || []) {
    const prev = notesMap.get(note.id);
    if (!prev || (note.updatedAt || "") >= (prev.updatedAt || "")) {
      notesMap.set(note.id, note);
    }
  }

  const allFieldKeys = new Set<string>([
    ...Object.keys(remote.progressByField || {}),
    ...Object.keys(local.progressByField || {}),
  ]);

  const mergedProgress: Record<string, FieldStudyProgressSnapshot> = {};
  for (const fid of allFieldKeys) {
    const r = remote.progressByField?.[fid];
    const l = local.progressByField?.[fid];
    const completedModules = Array.from(
      new Set([...(r?.completedModules || []), ...(l?.completedModules || [])])
    );
    const passedCertIds = Array.from(
      new Set([...(r?.passedCertIds || []), ...(l?.passedCertIds || [])])
    );

    const practiceNotes: Record<string, string> = { ...(r?.practiceNotes || {}) };
    for (const [modId, val] of Object.entries(l?.practiceNotes || {})) {
      if (val.trim().length > 0) {
        practiceNotes[modId] = val;
      }
    }

    const localVer = sanitizeVerificationResult(l?.verification);
    const remoteVer = sanitizeVerificationResult(r?.verification);
    let verification: FieldVerificationResult | undefined;
    if (localVer && remoteVer) {
      verification =
        (localVer.verifiedAt || "") >= (remoteVer.verifiedAt || "")
          ? localVer
          : remoteVer;
    } else {
      verification = localVer || remoteVer;
    }

    if (
      completedModules.length > 0 ||
      passedCertIds.length > 0 ||
      Object.keys(practiceNotes).length > 0 ||
      Boolean(verification)
    ) {
      mergedProgress[fid] = {
        fieldId: fid,
        completedModules,
        passedCertIds,
        practiceNotes,
        verification,
        updatedAt: l?.updatedAt || r?.updatedAt || new Date().toISOString(),
      };
    }
  }

  const surveyResult = local.surveyResult || remote.surveyResult || null;

  return {
    personalNotes: Array.from(notesMap.values()).sort((a, b) =>
      (b.updatedAt || "").localeCompare(a.updatedAt || "")
    ),
    progressByField: mergedProgress,
    surveyResult,
    updatedAt: new Date().toISOString(),
  };
}

export function collectModulePracticeNoteViews(
  snapshot: FullLearningSnapshot
): ModulePracticeNoteView[] {
  const list: ModulePracticeNoteView[] = [];
  for (const [fieldId, prog] of Object.entries(snapshot.progressByField || {})) {
    const curriculum = MENTOR_CURRICULUM_BY_FIELD[fieldId];
    if (!curriculum) continue;

    for (const [modId, noteText] of Object.entries(prog.practiceNotes || {})) {
      if (!noteText || !noteText.trim()) continue;
      const mod = curriculum.learningModules.find((m) => m.id === modId);
      if (!mod) continue;
      const course = curriculum.targetCourses.find((c) => c.id === mod.courseId);

      list.push({
        fieldId,
        fieldName: curriculum.fieldName,
        moduleId: mod.id,
        moduleCode: mod.moduleCode || "MODUL",
        moduleTitle: mod.title,
        courseCode: course?.code || mod.courseId.toUpperCase(),
        courseName: mod.courseName,
        practiceTask: mod.practiceTask,
        noteText,
        isCompleted: prog.completedModules.includes(mod.id),
        scoreBoost: mod.scoreBoost,
      });
    }
  }
  return list;
}

export function getFieldLabelById(fieldId: string): string {
  if (fieldId === "umum") return "Catatan Umum Studi";
  return (
    FIELDS.find((f) => f.id === fieldId)?.name ||
    MENTOR_CURRICULUM_BY_FIELD[fieldId]?.fieldName ||
    fieldId.toUpperCase()
  );
}

export function exportLearningReportMarkdown(
  snapshot: FullLearningSnapshot,
  user: SafeUser | null,
  originLabel: string
): string {
  const lines: string[] = [];
  lines.push("# Laporan Profil & Catatan Pembelajaran KertaMarga Bali");
  lines.push("");
  lines.push(`Tanggal Ekspor: ${new Date().toLocaleString("id-ID")}`);
  lines.push(`Nama Pengguna: ${user ? `${user.name} (${user.role === "guru" ? "Guru BK" : "Siswa"})` : "Mode Tamu Anonim"}`);
  if (user) {
    lines.push(`Identitas: ${user.identifier} | Email: ${user.email}`);
  }
  lines.push(`Acuan Lokasi Bali: ${originLabel}`);
  lines.push("");

  if (snapshot.surveyResult) {
    const curr = MENTOR_CURRICULUM_BY_FIELD[snapshot.surveyResult.fieldId];
    lines.push("## 1. Hasil Survey Keminatan Terakhir");
    lines.push(`- Bidang Tujuan: ${curr?.fieldName || snapshot.surveyResult.fieldId}`);
    lines.push(`- Skor Dasar Survey: ${snapshot.surveyResult.score}%`);
    lines.push(`- Klaster Minat Dominan: ${GROUP_CONFIG[snapshot.surveyResult.dominant]?.label || snapshot.surveyResult.dominant}`);
    lines.push("");
  }

  lines.push("## 2. Jurnal Catatan Belajar Pribadi");
  if (snapshot.personalNotes.length === 0) {
    lines.push("Belum ada catatan belajar pribadi yang tersimpan.");
  } else {
    snapshot.personalNotes.forEach((n, idx) => {
      lines.push(`### ${idx + 1}. ${n.title}`);
      lines.push(`- Bidang: ${getFieldLabelById(n.fieldId)} | Kategori: ${n.category}`);
      lines.push(`- Diperbarui: ${new Date(n.updatedAt).toLocaleString("id-ID")}`);
      lines.push("");
      lines.push(n.content);
      lines.push("");
    });
  }

  lines.push("## 3. Catatan Praktik Modul Kurikulum");
  const modNotes = collectModulePracticeNoteViews(snapshot);
  if (modNotes.length === 0) {
    lines.push("Belum ada catatan praktik modul yang diisi.");
  } else {
    modNotes.forEach((item, idx) => {
      lines.push(`### ${idx + 1}. [${item.moduleCode}] ${item.moduleTitle} (${item.fieldName})`);
      lines.push(`- Mata Kuliah: ${item.courseName} | Status: ${item.isCompleted ? "Selesai" : "Dalam Progres"}`);
      lines.push(`- Tugas Praktik: ${item.practiceTask}`);
      lines.push("");
      lines.push(item.noteText);
      lines.push("");
    });
  }

  lines.push("## 4. Ringkasan Progres Modul & Sertifikasi per Bidang");
  const activeFields = Object.values(snapshot.progressByField);
  if (activeFields.length === 0) {
    lines.push("Belum ada progres modul atau sertifikasi yang tersimpan.");
  } else {
    activeFields.forEach((prog) => {
      const curr = MENTOR_CURRICULUM_BY_FIELD[prog.fieldId];
      if (!curr) return;
      const verSuffix = prog.verification
        ? ` | Verifikasi Kemampuan: ${prog.verification.status === "passed" ? "Lulus" : "Perlu Tinjauan"} (${prog.verification.score}%)`
        : "";
      lines.push(
        `- **${curr.fieldName}**: ${prog.completedModules.length}/${curr.learningModules.length} modul selesai, ${prog.passedCertIds.length}/${curr.certificationDrills.length} sertifikasi kompeten${verSuffix}`
      );
    });
  }

  return lines.join("\n");
}
