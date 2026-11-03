import {
  PROGRAM_FIELDS,
  INSTITUTIONS_CATALOG,
  ProgramField,
  InstitutionProgram,
  estimateDistanceKm,
} from "@/data/catalog";
import { BASE_QUESTIONS, ADAPTIVE_BRANCH_QUESTIONS } from "@/data/questions";

export interface UserAssessmentInput {
  currentEducation: "SMP" | "SMA" | "SMK" | "Lainnya";
  homeKabupaten?: string;
  selectedAnswers: Record<string, string>; // questionId -> optionId
  openEndedReflection?: string;
  weights?: {
    matchWeight?: number;
    distanceWeight?: number;
    costWeight?: number;
  };
}

export interface RecommendationFieldResult {
  rank: number;
  field: ProgramField;
  compositeScore: number;
  breakdown: {
    interestScore: number;
    readinessScore: number;
    preferenceScore: number;
  };
  confidenceBand: "Tinggi" | "Sedang" | "Eksploratif Awal";
  reasoningTrace: string[];
  alternativeNotes: string;
  matchedInstitutions: (InstitutionProgram & { estimatedDistanceKm: number })[];
}

export interface AssessmentAnalysisResult {
  topRecommendations: RecommendationFieldResult[];
  extractedSignals: string[];
  totalQuestionsAnswered: number;
  calculatedAt: string;
  isDeterministicFallback: boolean;
}

// Controlled keyword dictionary untuk mengekstrak sinyal dari jawaban terbuka
const KEYWORD_FIELD_MAP: Record<string, { fieldId: string; tag: string }> = {
  coding: { fieldId: "informatika", tag: "Coding & Web" },
  koding: { fieldId: "informatika", tag: "Coding & Web" },
  programmer: { fieldId: "informatika", tag: "Software Engineering" },
  komputer: { fieldId: "informatika", tag: "Teknologi Komputer" },
  desain: { fieldId: "dkv", tag: "Desain Visual" },
  gambar: { fieldId: "dkv", tag: "Ilustrasi Kreatif" },
  video: { fieldId: "dkv", tag: "Produksi Video" },
  arsitektur: { fieldId: "arsitektur", tag: "Rancang Bangun" },
  bangunan: { fieldId: "arsitektur", tag: "Desain Bangunan" },
  medis: { fieldId: "kesehatan", tag: "Layanan Medis" },
  perawat: { fieldId: "kesehatan", tag: "Keperawatan" },
  kesehatan: { fieldId: "kesehatan", tag: "Kesehatan Komunitas" },
  guru: { fieldId: "pendidikan", tag: "Pengajaran & Edukasi" },
  mengajar: { fieldId: "pendidikan", tag: "Pendidikan Generasi" },
  konseling: { fieldId: "pendidikan", tag: "Bimbingan Konseling" },
  tari: { fieldId: "budaya", tag: "Seni Tari Tradisi" },
  gamelan: { fieldId: "budaya", tag: "Tabuh Karawitan" },
  budaya: { fieldId: "budaya", tag: "Pelestarian Budaya Bali" },
  petani: { fieldId: "pertanian", tag: "Pertanian Organik" },
  subak: { fieldId: "pertanian", tag: "Agroteknologi Subak" },
  tanaman: { fieldId: "pertanian", tag: "Hortikultura" },
  laut: { fieldId: "lingkungan", tag: "Kelautan & Pesisir" },
  sampah: { fieldId: "lingkungan", tag: "Pengelolaan Limbah" },
  lingkungan: { fieldId: "lingkungan", tag: "Konservasi Alam" },
  bisnis: { fieldId: "bisnis", tag: "Wirausaha & Pemasaran" },
  jualan: { fieldId: "bisnis", tag: "E-Commerce" },
  startup: { fieldId: "bisnis", tag: "Bisnis Digital" },
  hotel: { fieldId: "pariwisata", tag: "Manajemen Perhotelan" },
  wisata: { fieldId: "pariwisata", tag: "Ekowisata Bali" },
  pariwisata: { fieldId: "pariwisata", tag: "Hospitality Dunia" },
};

export function analyzeAssessment(input: UserAssessmentInput): AssessmentAnalysisResult {
  const {
    homeKabupaten = "Kota Denpasar",
    selectedAnswers = {},
    openEndedReflection = "",
    weights = {},
  } = input;

  const matchWeight = weights.matchWeight ?? 70;
  const distanceWeight = weights.distanceWeight ?? 50;
  const costWeight = weights.costWeight ?? 60;

  // Skor akumulator per field
  const interestRaw: Record<string, number> = {};
  const readinessRaw: Record<string, number> = {};
  const preferenceRaw: Record<string, number> = {};
  const matchedReasonSnippets: Record<string, string[]> = {};

  PROGRAM_FIELDS.forEach((f) => {
    interestRaw[f.id] = 0;
    readinessRaw[f.id] = 0;
    preferenceRaw[f.id] = 0;
    matchedReasonSnippets[f.id] = [];
  });

  // 1. Evaluasi jawaban pilihan terstruktur (Base + Adaptive)
  const allQuestionMap = new Map();
  BASE_QUESTIONS.forEach((q) => allQuestionMap.set(q.id, q));
  Object.values(ADAPTIVE_BRANCH_QUESTIONS).forEach((q) => allQuestionMap.set(q.id, q));

  let questionsAnsweredCount = 0;

  Object.entries(selectedAnswers).forEach(([qId, optionId]) => {
    const question = allQuestionMap.get(qId);
    if (!question) return;

    const chosenOption = question.options.find((opt: { id: string }) => opt.id === optionId);
    if (!chosenOption) return;

    questionsAnsweredCount++;

    Object.entries(chosenOption.fieldWeights).forEach(([fieldId, weight]) => {
      const numericWeight = Number(weight) || 0;
      if (question.dimension === "interest") {
        interestRaw[fieldId] = (interestRaw[fieldId] || 0) + numericWeight;
        matchedReasonSnippets[fieldId].push(
          `Jawabanmu memilih aktivitas: "${chosenOption.text.slice(0, 70)}..."`
        );
      } else if (question.dimension === "readiness") {
        readinessRaw[fieldId] = (readinessRaw[fieldId] || 0) + numericWeight;
        matchedReasonSnippets[fieldId].push(
          `Kesiapan yang kamu rasakan saat ini selaras dengan kebutuhan dasar bidang ini.`
        );
      } else if (question.dimension === "preference") {
        preferenceRaw[fieldId] = (preferenceRaw[fieldId] || 0) + numericWeight;
      }
    });
  });

  // 2. Ekstraksi kata kunci deterministik dari jawaban terbuka (Zero PII, no hallucination)
  const extractedSignals: string[] = [];
  if (openEndedReflection.trim()) {
    const tokens = openEndedReflection.toLowerCase().split(/[\s,.;:!?\-()]+/);
    tokens.forEach((token) => {
      const match = KEYWORD_FIELD_MAP[token];
      if (match) {
        interestRaw[match.fieldId] = (interestRaw[match.fieldId] || 0) + 2;
        if (!extractedSignals.includes(match.tag)) {
          extractedSignals.push(match.tag);
          matchedReasonSnippets[match.fieldId].push(
            `Refleksi pribadimu secara spesifik menyebutkan minat seputar #${match.tag}.`
          );
        }
      }
    });
  }

  // 3. Normalisasi skor dan pemeringkatan bidang
  const scoredFields = PROGRAM_FIELDS.map((field) => {
    // Normalisasi kasar ke skala 0 - 100
    const iScore = Math.min(100, Math.round((interestRaw[field.id] / 12) * 100));
    const rScore = Math.min(100, Math.round((readinessRaw[field.id] / 6) * 100));
    const pScore = Math.min(100, Math.round((preferenceRaw[field.id] / 6) * 100));

    // Skor kecocokan inti
    const coreMatch = Math.round(iScore * 0.55 + rScore * 0.25 + pScore * 0.2);

    // Kaitan institusi di katalog yang relevan dengan bidang ini
    const matchedInstitutions = INSTITUTIONS_CATALOG.filter((inst) => {
      // Pemetaan sederhana berdasarkan programName
      const progLower = inst.programName.toLowerCase();
      if (field.id === "informatika" && (progLower.includes("perangkat lunak") || progLower.includes("jaringan") || progLower.includes("komputer"))) return true;
      if (field.id === "dkv" && (progLower.includes("desain komunikasi visual") || progLower.includes("multimedia"))) return true;
      if (field.id === "arsitektur" && (progLower.includes("arsitektur") || progLower.includes("pemodelan"))) return true;
      if (field.id === "kesehatan" && (progLower.includes("keperawatan") || progLower.includes("kesehatan") || progLower.includes("farmasi"))) return true;
      if (field.id === "pendidikan" && (progLower.includes("pendidikan") || progLower.includes("konseling"))) return true;
      if (field.id === "budaya" && (progLower.includes("karawitan") || progLower.includes("tari") || progLower.includes("seni"))) return true;
      if (field.id === "pertanian" && (progLower.includes("tanaman") || progLower.includes("agribisnis") || progLower.includes("subak"))) return true;
      if (field.id === "lingkungan" && (progLower.includes("maritim") || progLower.includes("kelautan") || progLower.includes("lingkungan"))) return true;
      if (field.id === "bisnis" && (progLower.includes("bisnis") || progLower.includes("manajemen") || progLower.includes("akuntansi"))) return true;
      if (field.id === "pariwisata" && (progLower.includes("perhotelan") || progLower.includes("pariwisata") || progLower.includes("wisata"))) return true;
      return false;
    }).map((inst) => {
      const dist = estimateDistanceKm(homeKabupaten, inst.kabupaten);
      return {
        ...inst,
        estimatedDistanceKm: dist,
      };
    }).sort((a, b) => a.estimatedDistanceKm - b.estimatedDistanceKm);

    // Hitung jarak terdekat institusi yang ada
    const nearestKm = matchedInstitutions.length > 0 ? matchedInstitutions[0].estimatedDistanceKm : 30;
    const distanceScore = Math.max(20, Math.round(100 - nearestKm * 1.5));
    const costScore = 80; // Baseline moderat

    // Skor komposit berbobot dinamis
    const totalW = matchWeight + distanceWeight + costWeight || 1;
    const compositeScore = Math.round(
      (coreMatch * matchWeight + distanceScore * distanceWeight + costScore * costWeight) / totalW
    );

    // Tentukan confidence band secara hati-hati
    let confidenceBand: "Tinggi" | "Sedang" | "Eksploratif Awal" = "Eksploratif Awal";
    if (compositeScore >= 80 && matchedReasonSnippets[field.id].length >= 2) {
      confidenceBand = "Tinggi";
    } else if (compositeScore >= 65) {
      confidenceBand = "Sedang";
    }

    // Pastikan alasan minimal selalu ada
    const cleanReasons = matchedReasonSnippets[field.id].length > 0
      ? matchedReasonSnippets[field.id].slice(0, 3)
      : [`Karakteristik bidang ini bersinggungan dengan beberapa preferensi umum yang kamu tentukan.`];

    return {
      field,
      compositeScore,
      breakdown: {
        interestScore: Math.max(40, iScore),
        readinessScore: Math.max(35, rScore),
        preferenceScore: Math.max(40, pScore),
      },
      confidenceBand,
      reasoningTrace: cleanReasons,
      alternativeNotes: `Jika kamu masih ragu, bidang ini juga memiliki irisan erat dengan ${field.group === "teknologi" ? "DKV atau Bisnis Digital" : "Pariwisata Berkelanjutan atau Seni Budaya"}.`,
      matchedInstitutions,
    };
  });

  // Urutkan dari skor komposit tertinggi
  scoredFields.sort((a, b) => b.compositeScore - a.compositeScore);

  // Ambil top 3 - 5
  const topRecommendations: RecommendationFieldResult[] = scoredFields.slice(0, 4).map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));

  return {
    topRecommendations,
    extractedSignals,
    totalQuestionsAnswered: questionsAnsweredCount,
    calculatedAt: new Date().toISOString(),
    isDeterministicFallback: false,
  };
}
