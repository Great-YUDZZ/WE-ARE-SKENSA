"use client";

import React, { useState, useEffect } from "react";
import { FIELDS, GROUP_CONFIG, FieldGroup } from "@/data/fields";
import {
  INTEREST_TEST_QUESTIONS,
  MENTOR_CURRICULUM_BY_FIELD,
  FieldCurriculum,
  TargetCourse,
} from "@/data/mentorCurriculum";
import type { MentorAgentResponse } from "@/app/api/mentor-agent/route";

interface StudentMentorWorkspaceProps {
  initialFieldId?: string;
  initialInterests?: string[];
  onSwitchToGeneralAi?: (prefillQuery: string) => void;
}

interface ChatTurn {
  id: string;
  sender: "student" | "agent";
  text: string;
  diagnosisSummary?: string;
  recommendedItemTitle?: string;
  recommendedActionType?: "materi" | "sertifikasi" | "portofolio" | "siap";
  keyTakeaways?: string[];
  encouragementNote?: string;
}

const INTEREST_TO_FIELD_MAP: Record<string, string> = {
  "Rekayasa Perangkat Lunak": "informatika",
  "Desain Komunikasi Visual": "dkv",
  "Arsitektur & Lanskap": "arsitektur",
  "Keperawatan & Kesehatan": "kesehatan",
  "Pendidikan & Konseling": "pendidikan",
  "Seni Karawitan & Budaya": "budaya",
  "Pertanian Organik Subak": "pertanian",
  "Kelautan & Konservasi": "lingkungan",
  "Bisnis Digital & E-Commerce": "bisnis",
  "Perhotelan & Ekowisata": "pariwisata",
};

export default function StudentMentorWorkspace({
  initialFieldId,
  initialInterests,
}: StudentMentorWorkspaceProps) {
  // Determine initial target field
  const resolvedInitialField =
    initialFieldId && MENTOR_CURRICULUM_BY_FIELD[initialFieldId]
      ? initialFieldId
      : initialInterests && initialInterests.length > 0
      ? INTEREST_TO_FIELD_MAP[initialInterests[0]] || "informatika"
      : "informatika";

  const [targetFieldId, setTargetFieldId] = useState<string>(resolvedInitialField);
  const curriculum: FieldCurriculum =
    MENTOR_CURRICULUM_BY_FIELD[targetFieldId] || MENTOR_CURRICULUM_BY_FIELD.informatika;

  const [targetCourseId, setTargetCourseId] = useState<string>(
    curriculum.targetCourses[0].id
  );

  // Sync targetCourseId when targetFieldId changes
  useEffect(() => {
    const curr =
      MENTOR_CURRICULUM_BY_FIELD[targetFieldId] || MENTOR_CURRICULUM_BY_FIELD.informatika;
    setTargetCourseId(curr.targetCourses[0].id);
  }, [targetFieldId]);

  const targetCourse: TargetCourse =
    curriculum.targetCourses.find((c) => c.id === targetCourseId) ||
    curriculum.targetCourses[0];

  // Questionnaire Answers (index of selected option per question id)
  // Default pre-selected to represent a student whose score is still low / needs mentoring (around 54%)
  const [answers, setAnswers] = useState<Record<string, number>>({
    "q1-situasi": 0,
    "q2-fondasi-nilai": 2,
    "q3-kesiapan-matkul": 2,
    "q4-portofolio": 2,
  });

  const [hasSubmittedTest, setHasSubmittedTest] = useState<boolean>(false);
  const [activeAgentTab, setActiveAgentTab] = useState<
    "rencana" | "materi" | "sertifikasi" | "konsultasi"
  >("rencana");

  // Progress State: Completed Learning Modules & Passed Certification Drills
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [expandedModuleId, setExpandedModuleId] = useState<string>(
    curriculum.learningModules[0].id
  );
  const [modulePracticeNotes, setModulePracticeNotes] = useState<Record<string, string>>({});

  // Certification Quiz State
  const [selectedCertAnswers, setSelectedCertAnswers] = useState<Record<string, number>>({});
  const [submittedCertIds, setSubmittedCertIds] = useState<string[]>([]);
  const [passedCertIds, setPassedCertIds] = useState<string[]>([]);

  // Agent Chat State
  const [chatInput, setChatInput] = useState<string>("");
  const [isAgentLoading, setIsAgentLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatTurn[]>([]);

  // Reset progress when changing major field
  useEffect(() => {
    const curr =
      MENTOR_CURRICULUM_BY_FIELD[targetFieldId] || MENTOR_CURRICULUM_BY_FIELD.informatika;
    setExpandedModuleId(curr.learningModules[0].id);
  }, [targetFieldId]);

  // Calculate base score from the 4 interest & academic readiness questions
  const calculateBaseScore = (): {
    baseScore: number;
    dominantGroup: FieldGroup;
    isGroupMismatch: boolean;
  } => {
    let totalWeight = 0;
    let count = 0;
    const groupCounts: Record<FieldGroup, number> = {
      teknologi: 0,
      manusia: 0,
      alam: 0,
      usaha: 0,
    };

    INTEREST_TEST_QUESTIONS.forEach((q) => {
      const idx = answers[q.id];
      if (idx !== undefined && q.options[idx]) {
        const opt = q.options[idx];
        totalWeight += opt.readinessWeight;
        count += 1;
        groupCounts[opt.groupAffinity] += 1;
      }
    });

    const avg = count > 0 ? Math.round(totalWeight / count) : 55;
    const dominantGroup = (Object.keys(groupCounts) as FieldGroup[]).reduce((a, b) =>
      groupCounts[a] >= groupCounts[b] ? a : b
    );
    const isGroupMismatch = dominantGroup !== curriculum.group;

    // If student's dominant interest group differs from the target major's group, apply a realistic initial adjustment
    const adjustedBase = isGroupMismatch ? Math.max(40, avg - 6) : avg;

    return {
      baseScore: adjustedBase,
      dominantGroup,
      isGroupMismatch,
    };
  };

  const { baseScore, dominantGroup, isGroupMismatch } = calculateBaseScore();

  // Calculate bonus points earned from studying modules & passing certification drills in the current field
  const moduleBonus = curriculum.learningModules
    .filter((m) => completedModules.includes(m.id))
    .reduce((acc, m) => acc + m.scoreBoost, 0);

  const certBonus = curriculum.certificationDrills
    .filter((c) => passedCertIds.includes(c.id))
    .reduce((acc, c) => acc + c.scoreBoost, 0);

  const currentReadinessScore = Math.min(99, baseScore + moduleBonus + certBonus);
  const scoreGap = Math.max(0, targetCourse.minScore - currentReadinessScore);
  const isInitialLowOrMismatch = baseScore < targetCourse.minScore || isGroupMismatch;
  const isNowReady = currentReadinessScore >= targetCourse.minScore;

  // Initialize welcome message from the AI Mentor Agent whenever test is submitted or field changes
  useEffect(() => {
    if (!hasSubmittedTest) return;
    const gapNow = Math.max(0, targetCourse.minScore - currentReadinessScore);
    const initialTurn: ChatTurn = {
      id: "init-" + targetFieldId + "-" + targetCourse.id,
      sender: "agent",
      text:
        gapNow > 0
          ? `Halo! Saya Agen Pembimbing untuk bidang ${curriculum.fieldName}. Hasil evaluasi awal Anda menunjukkan skor kesiapan ${baseScore}% untuk mata kuliah tujuan '${targetCourse.name}' (standar minimum: ${targetCourse.minScore}%). ${
              isGroupMismatch
                ? `Saya juga mendeteksi profil minat alami Anda cenderung ke kelompok '${GROUP_CONFIG[dominantGroup].label}', sedangkan jurusan tujuan Anda berada di kelompok '${GROUP_CONFIG[curriculum.group].label}'. `
                : ""
            }Jangan berkecil hati. Saya telah menyusun 4 langkah perbaikan, 3 modul materi pembelajaran inti, dan 3 latihan uji sertifikasi ${curriculum.certificationBody} agar nilai dan keahlian Anda meningkat hingga memenuhi syarat jurusan yang dituju.`
          : `Selamat! Skor kesiapan Anda (${currentReadinessScore}%) sudah memenuhi ambang batas minimum (${targetCourse.minScore}%) untuk mata kuliah '${targetCourse.name}' pada jurusan ${curriculum.fieldName}. Anda tetap dapat mempelajari modul materi dan menyelesaikan latihan sertifikasi ${curriculum.mainCertificationTitle} untuk memperkokoh portofolio Anda.`,
      diagnosisSummary:
        gapNow > 0
          ? `Perlu Peningkatan +${gapNow} Poin Menuju Standar ${targetCourse.code} (${targetCourse.minScore}%)`
          : `Memenuhi Standar Kesiapan ${targetCourse.code} (${currentReadinessScore}% >= ${targetCourse.minScore}%)`,
      recommendedActionType: gapNow > 0 ? "materi" : "sertifikasi",
      recommendedItemTitle: curriculum.learningModules[0].title,
      keyTakeaways: [
        `Target Jurusan: ${curriculum.fieldName}`,
        `Target Mata Kuliah: ${targetCourse.code} - ${targetCourse.name} (Min. ${targetCourse.minScore}%)`,
        `Sertifikasi Pendukung: ${curriculum.mainCertificationTitle}`,
      ],
      encouragementNote:
        "Tuntaskan setiap modul materi (+10 poin) dan latihan soal sertifikasi (+7 poin) untuk menaikkan grafik kesiapan Anda secara langsung.",
    };
    setChatHistory([initialTurn]);
  }, [hasSubmittedTest, targetFieldId, targetCourseId]);

  const handleSubmitTest = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmittedTest(true);
    setActiveAgentTab("rencana");
  };

  const handlePresetLowScoreScenario = () => {
    setAnswers({
      "q1-situasi": curriculum.group === "teknologi" ? 1 : 0, // sengaja lintas minat
      "q2-fondasi-nilai": 2, // nilai agak kecil (60-74)
      "q3-kesiapan-matkul": 2, // prasyarat matkul di bawah standar
      "q4-portofolio": 3, // butuh panduan dari dasar
    });
    setCompletedModules([]);
    setSubmittedCertIds([]);
    setPassedCertIds([]);
    setHasSubmittedTest(true);
    setActiveAgentTab("rencana");
  };

  const handleToggleCompleteModule = (moduleId: string, moduleTitle: string, boost: number) => {
    const alreadyDone = completedModules.includes(moduleId);
    const updated = alreadyDone
      ? completedModules.filter((id) => id !== moduleId)
      : [...completedModules, moduleId];
    setCompletedModules(updated);

    if (!alreadyDone) {
      const newTurn: ChatTurn = {
        id: "mod-done-" + Date.now(),
        sender: "agent",
        text: `Bagus sekali! Anda telah menyelesaikan pembelajaran '${moduleTitle}'. Skor kesiapan Anda untuk mata kuliah ${targetCourse.name} meningkat sebesar +${boost} poin. Langkah selanjutnya, uji pemahaman Anda pada tab 'Latihan Sertifikasi' atau lanjutkan ke modul berikutnya.`,
        diagnosisSummary: `Progres Belajar Bertambah (+${boost}% Kesiapan)`,
        recommendedActionType: "sertifikasi",
        recommendedItemTitle: curriculum.mainCertificationTitle,
      };
      setChatHistory((prev) => [...prev, newTurn]);
    }
  };

  const handleCheckCertAnswer = (certId: string, correctIndex: number, boost: number, code: string) => {
    const chosen = selectedCertAnswers[certId];
    if (chosen === undefined) return;

    if (!submittedCertIds.includes(certId)) {
      setSubmittedCertIds([...submittedCertIds, certId]);
    }

    if (chosen === correctIndex && !passedCertIds.includes(certId)) {
      setPassedCertIds([...passedCertIds, certId]);
      const newTurn: ChatTurn = {
        id: "cert-pass-" + Date.now(),
        sender: "agent",
        text: `Luar biasa! Jawaban Anda pada latihan sertifikasi unit kompetensi ${code} tepat. Anda memperoleh tambahan +${boost} poin kesiapan keahlian menuju standar ${curriculum.fieldName}.`,
        diagnosisSummary: `Unit Kompetensi ${code} Terverifikasi (+${boost}% Kesiapan)`,
        recommendedActionType: "materi",
        recommendedItemTitle: curriculum.mainCertificationTitle,
      };
      setChatHistory((prev) => [...prev, newTurn]);
    }
  };

  const handleSendAgentMessage = async (customPrompt?: string) => {
    const messageToSend = (customPrompt ?? chatInput).trim();
    if (!messageToSend || isAgentLoading) return;

    const studentTurn: ChatTurn = {
      id: "user-" + Date.now(),
      sender: "student",
      text: messageToSend,
    };

    setChatHistory((prev) => [...prev, studentTurn]);
    if (!customPrompt) setChatInput("");
    setIsAgentLoading(true);

    try {
      const res = await fetch("/api/mentor-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fieldId: targetFieldId,
          targetCourseId: targetCourse.id,
          currentScore: currentReadinessScore,
          targetScore: targetCourse.minScore,
          userMessage: messageToSend,
          completedModules,
          passedCerts: passedCertIds,
        }),
      });

      const data = (await res.json()) as MentorAgentResponse;
      const safeReply =
        data.replyMessage && data.replyMessage.trim().length > 0
          ? data.replyMessage.trim()
          : `${data.diagnosisSummary || `Fokus kesiapan untuk mata kuliah ${targetCourse.name}:`} Pelajari '${data.recommendedItemTitle || curriculum.learningModules[0]?.title}' terlebih dahulu dan lanjutkan ke simulasi sertifikasi ${curriculum.mainCertificationTitle}.`;
      const agentTurn: ChatTurn = {
        id: "agent-" + Date.now(),
        sender: "agent",
        text: safeReply,
        diagnosisSummary: data.diagnosisSummary,
        recommendedActionType: data.recommendedActionType,
        recommendedItemTitle: data.recommendedItemTitle,
        keyTakeaways: data.keyTakeaways,
        encouragementNote: data.encouragementNote,
      };
      setChatHistory((prev) => [...prev, agentTurn]);
    } catch {
      const fallbackTurn: ChatTurn = {
        id: "agent-fallback-" + Date.now(),
        sender: "agent",
        text: `Untuk meningkatkan kesiapan pada mata kuliah ${targetCourse.name} di jurusan ${curriculum.fieldName}, fokuskan belajar pada modul '${curriculum.learningModules[0].title}' dan kerjakan simulasi sertifikasi ${curriculum.mainCertificationTitle}.`,
        diagnosisSummary: "Mode Pendampingan Deterministik Aktif",
      };
      setChatHistory((prev) => [...prev, fallbackTurn]);
    } finally {
      setIsAgentLoading(false);
    }
  };

  const groupStyle = GROUP_CONFIG[curriculum.group];
  const selectedFieldObj = FIELDS.find((f) => f.id === targetFieldId) || FIELDS[0];

  return (
    <div className="space-y-8">
      {/* SECTION 1: TARGET JURUSAN & TES KEMINATAN SISWA */}
      <div className="bg-kmNeutral-surface border-2 border-kmNeutral-garis rounded-2xl p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-kmNeutral-garis">
          <div>
            <span className="text-[11px] font-mono font-bold text-[#2D6CDF] uppercase tracking-wider">
              TAHAP 1 &bull; PEMETAAN TARGET & TES KEMINATAN SISWA
            </span>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-kmNeutral-tinta mt-0.5">
              Pilih Jurusan & Mata Kuliah Tujuan Anda
            </h2>
          </div>

          <button
            type="button"
            onClick={handlePresetLowScoreScenario}
            className="text-xs font-mono font-bold px-3.5 py-2 rounded-lg bg-[#D7263D]/10 hover:bg-[#D7263D]/20 text-[#D7263D] border border-[#D7263D]/30 transition-colors cursor-pointer shrink-0"
          >
            Simulasikan Kasus Nilai Kecil / Lintas Jurusan &rarr;
          </button>
        </div>

        {/* Target Major & Target Course Selector */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-kmNeutral-tinta mb-2">
              1. Jurusan / Program Studi yang Dituju di Bali:
            </label>
            <select
              value={targetFieldId}
              onChange={(e) => setTargetFieldId(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-kmNeutral-latar border border-kmNeutral-garis text-kmNeutral-tinta text-xs sm:text-sm font-medium focus:border-[#2D6CDF] transition-colors"
            >
              {FIELDS.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.name} ({field.categoryName})
                </option>
              ))}
            </select>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-kmNeutral-sekunder">
              <span className={`font-mono font-bold px-2 py-0.5 rounded ${groupStyle.badgeBg} ${groupStyle.badgeText}`}>
                {groupStyle.label}
              </span>
              <span>
                Kampus/SMK Rujukan:{" "}
                <strong className="text-kmNeutral-tinta">
                  {selectedFieldObj.institutions.map((i) => i.name).join(", ")}
                </strong>
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-kmNeutral-tinta mb-2">
              2. Mata Kuliah / Kompetensi Inti yang Dituju:
            </label>
            <select
              value={targetCourse.id}
              onChange={(e) => setTargetCourseId(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-kmNeutral-latar border border-kmNeutral-garis text-kmNeutral-tinta text-xs sm:text-sm font-medium focus:border-[#2D6CDF] transition-colors"
            >
              {curriculum.targetCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  [{course.code}] {course.name} ({course.sks} SKS - Standar Min. {course.minScore}%)
                </option>
              ))}
            </select>
            <p className="mt-2 text-[11px] text-kmNeutral-sekunder">
              Kompetensi Kunci:{" "}
              <strong className="text-kmNeutral-tinta">
                {targetCourse.coreCompetency}
              </strong>
            </p>
          </div>
        </div>

        {/* 4 Diagnostic Questions */}
        <form onSubmit={handleSubmitTest} className="mt-6 space-y-5 pt-5 border-t border-kmNeutral-garis">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-kmNeutral-tinta">
              3. Kuesioner Evaluasi Minat & Nilai Penguasaan Awal Siswa:
            </span>
            <span className="text-[11px] font-mono text-kmNeutral-sekunder">
              4 Pertanyaan Diagnostik
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INTEREST_TEST_QUESTIONS.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-xl bg-kmNeutral-latar border border-kmNeutral-garis flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#2D6CDF]/10 text-[#2D6CDF]">
                      SOAL 0{q.step} &bull; {q.category.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-sans font-bold text-xs sm:text-sm text-kmNeutral-tinta leading-snug">
                    {q.question}
                  </h3>
                  <p className="text-[11px] text-kmNeutral-sekunder mt-0.5">
                    {q.subtitle}
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = answers[q.id] === oIdx;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() =>
                          setAnswers((prev) => ({
                            ...prev,
                            [q.id]: oIdx,
                          }))
                        }
                        className={`w-full text-left p-2.5 rounded-lg text-xs transition-all cursor-pointer border flex items-start gap-2.5 ${
                          isSelected
                            ? "bg-[#FFC93C]/25 border-[#E6B020] text-kmNeutral-tinta font-semibold"
                            : "bg-kmNeutral-surface border-kmNeutral-garis text-kmNeutral-sekunder hover:border-[#FFC93C]"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-mono font-bold ${
                            isSelected
                              ? "bg-[#1B1B2F] text-[#FFC93C]"
                              : "border border-kmNeutral-garis"
                          }`}
                        >
                          {isSelected ? "✓" : String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="leading-relaxed">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-kmNeutral-sekunder">
              Jika hasil nilai analisis masih di bawah ambang batas mata kuliah ({targetCourse.minScore}%),{" "}
              <strong className="text-kmNeutral-tinta">
                Agen Pembimbing KertaMarga
              </strong>{" "}
              akan otomatis menyusun langkah tindak lanjut, materi belajar, dan latihan sertifikasi.
            </p>

            <button
              type="submit"
              className="w-full sm:w-auto h-11 px-7 rounded-xl bg-[#FFC93C] hover:bg-[#F5BF2E] text-[#1B1B2F] font-sans font-bold text-sm shadow-sm border border-[#E6B020]/40 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              <span>Analisis Hasil & Aktifkan Agen Pembimbing</span>
              <span className="font-mono text-sm">&rarr;</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: HASIL ANALISIS NILAI & AGEN PEMBIMBING (Tampil setelah tes disubmit) */}
      {hasSubmittedTest && (
        <div className="space-y-6">
          {/* SCORE & DIAGNOSIS BANNER */}
          <div
            className={`rounded-2xl p-6 sm:p-7 border-2 shadow-sm transition-colors ${
              isNowReady
                ? "bg-kmNeutral-surface border-[#2E9E6B]"
                : "bg-kmNeutral-surface border-[#D7263D]"
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-kmNeutral-garis">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  {isNowReady ? (
                    <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-[#2E9E6B]/15 text-[#1F7A52] border border-[#2E9E6B]/40">
                      STATUS: KESIAPAN TERCAPAI &bull; SIAP MASUK JURUSAN TUJUAN
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-[#D7263D]/15 text-[#D7263D] border border-[#D7263D]/40">
                      PERHATIAN: NILAI KESIAPAN DI BAWAH STANDAR / PERLU BIMBINGAN AGEN
                    </span>
                  )}
                  <span className="text-xs font-mono text-kmNeutral-sekunder">
                    Target Matkul: [{targetCourse.code}] {targetCourse.name}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-2xl text-kmNeutral-tinta">
                  {isNowReady
                    ? `Selamat! Kompetensi Anda Telah Sesuai dengan Standar ${curriculum.fieldName}`
                    : `Apa yang Harus Anda Lakukan Saat Hasil Analisis Nilai Belum Sesuai (${currentReadinessScore}%)`}
                </h3>

                <p className="text-xs sm:text-sm text-kmNeutral-sekunder leading-relaxed">
                  {isNowReady
                    ? `Melalui penyelesaian materi pembelajaran dan latihan sertifikasi bersama Agen Pembimbing, skor kesiapan Anda meningkat dari ${baseScore}% menjadi ${currentReadinessScore}% (melampaui batas minimum ${targetCourse.minScore}%).`
                    : `Skor awal Anda adalah ${baseScore}%, sedangkan mata kuliah '${targetCourse.name}' pada jurusan ${curriculum.fieldName} menuntut kesiapan minimal ${targetCourse.minScore}% (selisih ${scoreGap} poin). ${
                        isGroupMismatch
                          ? `Selain itu, jawaban minat alami Anda lebih condong ke '${GROUP_CONFIG[dominantGroup].label}', sehingga Anda memerlukan jembatan materi lintas bidang.`
                          : "Ikuti panduan Agen Pembimbing di bawah untuk menuntaskan modul materi dan simulasi sertifikasi hingga skor Anda memenuhi syarat."
                      }`}
                </p>
              </div>

              {/* Dynamic Score Meter Card */}
              <div className="p-4 rounded-xl bg-kmNeutral-latar border border-kmNeutral-garis min-w-[260px] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-kmNeutral-sekunder">
                    SKOR KESIAPAN SAAT INI:
                  </span>
                  <span
                    className={`font-bold text-xl ${
                      isNowReady
                        ? "text-[#1F7A52]"
                        : "text-[#D7263D]"
                    }`}
                  >
                    {currentReadinessScore}%
                  </span>
                </div>

                {/* Progress bar with target marker */}
                <div className="space-y-1">
                  <div className="w-full h-3 rounded-full bg-kmNeutral-garis overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isNowReady ? "bg-[#2E9E6B]" : "bg-[#2D6CDF]"
                      }`}
                      style={{ width: `${currentReadinessScore}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-kmNeutral-sekunder">
                    <span>Skor Awal: {baseScore}%</span>
                    <span>Bonus Latihan: +{moduleBonus + certBonus}%</span>
                    <span className="font-bold text-kmNeutral-tinta">
                      Target: {targetCourse.minScore}%
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-kmNeutral-garis grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div>
                    <span className="text-kmNeutral-sekunder block">
                      Modul Selesai:
                    </span>
                    <span className="font-bold text-kmNeutral-tinta">
                      {completedModules.length} / {curriculum.learningModules.length} Materi
                    </span>
                  </div>
                  <div>
                    <span className="text-kmNeutral-sekunder block">
                      Uji Sertifikasi:
                    </span>
                    <span className="font-bold text-kmNeutral-tinta">
                      {passedCertIds.length} / {curriculum.certificationDrills.length} Lulus
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mismatch Bridge Explanation Box (Always shown if initial score was low or mismatched) */}
            {isInitialLowOrMismatch && (
              <div className="mt-4 p-4 rounded-xl bg-[#FFC93C]/15 border border-[#E6B020]/40 text-xs sm:text-sm text-kmNeutral-tinta">
                <span className="font-mono font-bold text-[11px] uppercase tracking-wider block mb-1 text-[#1B1B2F]">
                  STRATEGI JEMBATAN LINTAS MINAT & PERBAIKAN NILAI OLEH AGEN:
                </span>
                <p className="leading-relaxed">{curriculum.mismatchBridgeAdvice}</p>
              </div>
            )}

            {/* Navigation Tabs for the Agent Mentoring System */}
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveAgentTab("rencana")}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeAgentTab === "rencana"
                    ? "bg-[#D7263D] text-white shadow-xs"
                    : "bg-kmNeutral-latar text-kmNeutral-sekunder border border-kmNeutral-garis"
                }`}
              >
                <span>1. Langkah yang Harus Dilakukan</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveAgentTab("materi")}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeAgentTab === "materi"
                    ? "bg-[#2D6CDF] text-white shadow-xs"
                    : "bg-kmNeutral-latar text-kmNeutral-sekunder border border-kmNeutral-garis"
                }`}
              >
                <span>
                  2. Materi Pembelajaran ({completedModules.length}/{curriculum.learningModules.length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveAgentTab("sertifikasi")}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeAgentTab === "sertifikasi"
                    ? "bg-[#2E9E6B] text-white shadow-xs"
                    : "bg-kmNeutral-latar text-kmNeutral-sekunder border border-kmNeutral-garis"
                }`}
              >
                <span>
                  3. Latihan Sertifikasi ({passedCertIds.length}/{curriculum.certificationDrills.length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveAgentTab("konsultasi")}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeAgentTab === "konsultasi"
                    ? "bg-[#FFC93C] text-[#1B1B2F] shadow-xs"
                    : "bg-kmNeutral-latar text-kmNeutral-sekunder border border-kmNeutral-garis"
                }`}
              >
                <span>4. Tanya Agen Pembimbing AI</span>
              </button>
            </div>
          </div>

          {/* TAB CONTENT 1: LANGKAH YANG HARUS DILAKUKAN (ACTION PLAN) */}
          {activeAgentTab === "rencana" && (
            <div className="bg-kmNeutral-surface border-2 border-kmNeutral-garis rounded-2xl p-6 sm:p-7 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-kmNeutral-garis">
                <div>
                  <span className="text-[11px] font-mono font-bold text-[#D7263D] uppercase tracking-wider">
                    PETA JALAN REMEDIAL & PENYELARASAN KOMPETENSI
                  </span>
                  <h4 className="font-serif font-bold text-xl text-kmNeutral-tinta mt-0.5">
                    4 Langkah Wajib Jika Nilai Kecil atau Belum Sesuai dengan {curriculum.fieldName}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveAgentTab("materi")}
                  className="h-10 px-4 rounded-xl bg-[#2D6CDF] hover:bg-[#2256B8] text-white font-sans font-bold text-xs transition-colors cursor-pointer shrink-0"
                >
                  Mulai Pelajari Materi Sekarang &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {curriculum.remedialActionPlan.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-5 rounded-xl bg-kmNeutral-latar border border-kmNeutral-garis flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="w-8 h-8 rounded-lg bg-[#D7263D]/15 text-[#D7263D] font-mono font-bold text-xs flex items-center justify-center border border-[#D7263D]/30">
                          {step.stepNumber}
                        </span>
                        <span className="text-[11px] font-mono font-semibold text-kmNeutral-sekunder">
                          {step.phase}
                        </span>
                      </div>
                      <h5 className="font-serif font-bold text-base text-kmNeutral-tinta">
                        {step.title}
                      </h5>
                      <p className="text-xs text-kmNeutral-sekunder mt-1.5 leading-relaxed">
                        {step.action}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-kmNeutral-garis text-[11px]">
                      <span className="font-mono font-bold text-[#1F7A52] block">
                        Target Capaian:
                      </span>
                      <span className="text-kmNeutral-tinta">
                        {step.targetOutcome}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Target Courses Checklist */}
              <div className="p-5 rounded-xl bg-kmNeutral-latar border border-kmNeutral-garis space-y-3">
                <span className="text-xs font-mono font-bold text-kmNeutral-tinta uppercase">
                  DAFTAR MATA KULIAH INTI YANG WAJIB DIPERSIAPKAN DI JURUSAN INI:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {curriculum.targetCourses.map((c) => {
                    const isSelectedCourse = c.id === targetCourse.id;
                    const meetsCourse = currentReadinessScore >= c.minScore;
                    return (
                      <div
                        key={c.id}
                        onClick={() => setTargetCourseId(c.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelectedCourse
                            ? "bg-kmNeutral-surface border-[#2D6CDF]"
                            : "bg-kmNeutral-surface/60 border-kmNeutral-garis"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                          <span className="font-bold text-[#2D6CDF]">
                            {c.code} &bull; {c.sks} SKS
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded font-bold ${
                              meetsCourse
                                ? "bg-[#2E9E6B]/15 text-[#1F7A52]"
                                : "bg-[#D7263D]/15 text-[#D7263D]"
                            }`}
                          >
                            Min. {c.minScore}%
                          </span>
                        </div>
                        <h6 className="font-bold text-xs text-kmNeutral-tinta">
                          {c.name}
                        </h6>
                        <p className="text-[11px] text-kmNeutral-sekunder mt-1">
                          {c.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT 2: MATERI PEMBELAJARAN TERARAH */}
          {activeAgentTab === "materi" && (
            <div className="bg-kmNeutral-surface border-2 border-kmNeutral-garis rounded-2xl p-6 sm:p-7 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-kmNeutral-garis">
                <div>
                  <span className="text-[11px] font-mono font-bold text-[#2D6CDF] uppercase tracking-wider">
                    MODUL PEMBELAJARAN PENDAMPING MATKUL & JURUSAN
                  </span>
                  <h4 className="font-serif font-bold text-xl text-kmNeutral-tinta mt-0.5">
                    Materi Pembelajaran {curriculum.fieldName}
                  </h4>
                  <p className="text-xs text-kmNeutral-sekunder mt-0.5">
                    Pelajari ringkasan konsep inti di bawah dan kerjakan latihan praktiknya untuk menambah skor kesiapan Anda (+10% per modul).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveAgentTab("sertifikasi")}
                  className="h-10 px-4 rounded-xl bg-[#2E9E6B] hover:bg-[#1F7A52] text-white font-sans font-bold text-xs transition-colors cursor-pointer shrink-0"
                >
                  Lanjut ke Latihan Sertifikasi &rarr;
                </button>
              </div>

              <div className="space-y-4">
                {curriculum.learningModules.map((mod, idx) => {
                  const isCompleted = completedModules.includes(mod.id);
                  const isExpanded = expandedModuleId === mod.id;

                  return (
                    <div
                      key={mod.id}
                      className={`rounded-xl border-2 transition-all overflow-hidden ${
                        isCompleted
                          ? "border-[#2E9E6B]/60 bg-kmNeutral-latar"
                          : "border-kmNeutral-garis bg-kmNeutral-latar"
                      }`}
                    >
                      {/* Module Header */}
                      <div
                        onClick={() =>
                          setExpandedModuleId(isExpanded ? "" : mod.id)
                        }
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-kmNeutral-surface/50 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                            <span className="px-2 py-0.5 rounded bg-[#2D6CDF]/15 text-[#2D6CDF] font-bold">
                              MODUL 0{idx + 1} &bull; {mod.level.toUpperCase()}
                            </span>
                            <span className="text-kmNeutral-sekunder">
                              Matkul: {mod.courseName}
                            </span>
                            <span className="text-kmNeutral-sekunder">
                              &bull; Durasi: {mod.duration}
                            </span>
                          </div>
                          <h5 className="font-serif font-bold text-base sm:text-lg text-kmNeutral-tinta">
                            {mod.title}
                          </h5>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isCompleted ? (
                            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#2E9E6B]/20 text-[#1F7A52] border border-[#2E9E6B]/40">
                              ✓ Selesai (+{mod.scoreBoost}%)
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FFC93C]/25 text-[#1B1B2F] border border-[#E6B020]/40">
                              +{mod.scoreBoost}% Kesiapan
                            </span>
                          )}
                          <span className="text-xs font-mono text-kmNeutral-sekunder px-2">
                            {isExpanded ? "[Tutup]" : "[Buka Materi]"}
                          </span>
                        </div>
                      </div>

                      {/* Expanded Module Body */}
                      {isExpanded && (
                        <div className="p-5 pt-0 border-t border-kmNeutral-garis space-y-4">
                          <p className="text-xs sm:text-sm text-kmNeutral-sekunder pt-3 leading-relaxed">
                            {mod.summary}
                          </p>

                          {/* Key Concepts */}
                          <div className="p-4 rounded-xl bg-kmNeutral-surface border border-kmNeutral-garis">
                            <span className="text-xs font-mono font-bold text-[#2D6CDF] uppercase block mb-2">
                              KONSEP INTI YANG WAJIB DIKUASAI:
                            </span>
                            <ul className="space-y-1.5 text-xs sm:text-sm text-kmNeutral-tinta">
                              {mod.keyConcepts.map((kc, kIdx) => (
                                <li key={kIdx} className="flex items-start gap-2">
                                  <span className="font-mono font-bold text-[#2D6CDF]">
                                    {kIdx + 1}.
                                  </span>
                                  <span>{kc}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Full Study Material */}
                          <div className="p-4 rounded-xl bg-kmNeutral-surface border border-kmNeutral-garis space-y-2">
                            <span className="text-xs font-mono font-bold text-kmNeutral-tinta uppercase block">
                              URAIAN MATERI PEMBELAJARAN:
                            </span>
                            <p className="text-xs sm:text-sm text-kmNeutral-tinta leading-relaxed">
                              {mod.studyMaterial}
                            </p>
                            <div className="pt-2 mt-2 border-t border-kmNeutral-garis text-xs text-[#1F7A52] font-medium">
                              {mod.baliCaseStudy}
                            </div>
                          </div>

                          {/* Practice Exercise Input */}
                          <div className="p-4 rounded-xl bg-[#FFC93C]/10 border border-[#E6B020]/40 space-y-3">
                            <div>
                              <span className="text-xs font-mono font-bold text-[#1B1B2F] uppercase block">
                                TUGAS PRAKTIK MANDIRI (PENINGKAT KOMPETENSI):
                              </span>
                              <p className="text-xs sm:text-sm font-medium text-kmNeutral-tinta mt-1">
                                {mod.practiceTask}
                              </p>
                            </div>

                            <textarea
                              rows={2}
                              value={modulePracticeNotes[mod.id] || ""}
                              onChange={(e) =>
                                setModulePracticeNotes((prev) => ({
                                  ...prev,
                                  [mod.id]: e.target.value,
                                }))
                              }
                              placeholder="Tuliskan catatan jawaban atau rancangan singkat Anda di sini sebelum menandai modul selesai..."
                              className="w-full p-3 rounded-lg bg-kmNeutral-surface border border-kmNeutral-garis text-xs sm:text-sm text-kmNeutral-tinta"
                            />

                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveAgentTab("konsultasi");
                                  handleSendAgentMessage(
                                    `Bantu saya memahami lebih dalam tentang ${mod.title} pada mata kuliah ${mod.courseName}`
                                  );
                                }}
                                className="text-xs font-mono font-bold text-[#2D6CDF] hover:underline cursor-pointer"
                              >
                                Diskusikan Materi Ini dengan Agen Pembimbing &rarr;
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleCompleteModule(
                                    mod.id,
                                    mod.title,
                                    mod.scoreBoost
                                  )
                                }
                                className={`h-10 px-5 rounded-lg font-sans font-bold text-xs transition-all cursor-pointer ${
                                  isCompleted
                                    ? "bg-[#2E9E6B] text-white"
                                    : "bg-[#FFC93C] hover:bg-[#F5BF2E] text-[#1B1B2F]"
                                }`}
                              >
                                {isCompleted
                                  ? "✓ Modul Telah Dikuasai (Klik untuk Batal)"
                                  : `Tandai Selesai Dipelajari (+${mod.scoreBoost}% Skor)`}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB CONTENT 3: LATIHAN SERTIFIKASI & UJI KOMPETENSI */}
          {activeAgentTab === "sertifikasi" && (
            <div className="bg-kmNeutral-surface border-2 border-kmNeutral-garis rounded-2xl p-6 sm:p-7 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-kmNeutral-garis">
                <div>
                  <span className="text-[11px] font-mono font-bold text-[#1F7A52] uppercase tracking-wider">
                    SIMULASI UJI KOMPETENSI &bull; {curriculum.certificationBody}
                  </span>
                  <h4 className="font-serif font-bold text-xl text-kmNeutral-tinta mt-0.5">
                    {curriculum.mainCertificationTitle}
                  </h4>
                  <p className="text-xs text-kmNeutral-sekunder mt-0.5">
                    Selesaikan latihan uji kompetensi di bawah agar Anda semakin ahli dan memiliki bukti kesiapan sertifikasi (+7% skor per soal benar).
                  </p>
                </div>

                <div className="px-3.5 py-2 rounded-xl bg-kmNeutral-latar border border-kmNeutral-garis text-xs font-mono">
                  Status Lulus:{" "}
                  <strong className="text-[#1F7A52]">
                    {passedCertIds.length} / {curriculum.certificationDrills.length} Unit Kompetensi
                  </strong>
                </div>
              </div>

              <div className="space-y-5">
                {curriculum.certificationDrills.map((drill, dIdx) => {
                  const chosenIdx = selectedCertAnswers[drill.id];
                  const isSubmitted = submittedCertIds.includes(drill.id);
                  const isPassed = passedCertIds.includes(drill.id);
                  const isCorrectNow = chosenIdx === drill.correctIndex;

                  return (
                    <div
                      key={drill.id}
                      className={`p-5 rounded-xl border-2 space-y-4 ${
                        isPassed
                          ? "bg-kmNeutral-latar border-[#2E9E6B]/60"
                          : "bg-kmNeutral-latar border-kmNeutral-garis"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-[#2E9E6B]/15 text-[#1F7A52] border border-[#2E9E6B]/30">
                            UNIT KOMPETENSI: {drill.competencyCode}
                          </span>
                          <span className="text-xs font-mono text-kmNeutral-sekunder">
                            {drill.certName}
                          </span>
                        </div>

                        {isPassed ? (
                          <span className="text-xs font-mono font-bold text-[#1F7A52]">
                            ✓ KOMPETEN (+{drill.scoreBoost}% Skor)
                          </span>
                        ) : (
                          <span className="text-xs font-mono text-kmNeutral-sekunder">
                            Soal Sertifikasi #{dIdx + 1} (+{drill.scoreBoost}%)
                          </span>
                        )}
                      </div>

                      <h5 className="font-sans font-bold text-sm sm:text-base text-kmNeutral-tinta leading-relaxed">
                        {drill.question}
                      </h5>

                      <div className="space-y-2">
                        {drill.options.map((optText, oIdx) => {
                          const isChosen = chosenIdx === oIdx;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() =>
                                setSelectedCertAnswers((prev) => ({
                                  ...prev,
                                  [drill.id]: oIdx,
                                }))
                              }
                              className={`w-full text-left p-3 rounded-lg text-xs sm:text-sm border transition-all cursor-pointer flex items-start gap-2.5 ${
                                isChosen
                                  ? "bg-[#2D6CDF]/15 border-[#2D6CDF] text-kmNeutral-tinta font-semibold"
                                  : "bg-kmNeutral-surface border-kmNeutral-garis text-kmNeutral-sekunder hover:border-[#2D6CDF]/50"
                              }`}
                            >
                              <span className="font-mono font-bold text-xs">
                                {String.fromCharCode(65 + oIdx)}.
                              </span>
                              <span>{optText}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <button
                          type="button"
                          disabled={chosenIdx === undefined}
                          onClick={() =>
                            handleCheckCertAnswer(
                              drill.id,
                              drill.correctIndex,
                              drill.scoreBoost,
                              drill.competencyCode
                            )
                          }
                          className="h-10 px-5 rounded-lg bg-[#FFC93C] hover:bg-[#F5BF2E] disabled:opacity-50 text-[#1B1B2F] font-sans font-bold text-xs transition-all cursor-pointer"
                        >
                          Periksa Jawaban Sertifikasi
                        </button>

                        {isSubmitted && (
                          <span
                            className={`text-xs font-mono font-bold ${
                              isCorrectNow
                                ? "text-[#1F7A52]"
                                : "text-[#D7263D]"
                            }`}
                          >
                            {isCorrectNow
                              ? "Status: Jawaban Tepat (Kompeten)"
                              : "Status: Belum Tepat, Silakan Pilih Opsi Lain & Periksa Kembali"}
                          </span>
                        )}
                      </div>

                      {isSubmitted && (
                        <div
                          className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                            isCorrectNow
                              ? "bg-[#2E9E6B]/10 border-[#2E9E6B]/40 text-kmNeutral-tinta"
                              : "bg-[#D7263D]/10 border-[#D7263D]/40 text-kmNeutral-tinta"
                          }`}
                        >
                          <span className="font-mono font-bold text-[11px] uppercase block mb-1">
                            PEMBAHASAN AGEN SERTIFIKASI ({drill.competencyCode}):
                          </span>
                          <p>{drill.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB CONTENT 4: RUANG KONSULTASI INTERAKTIF AGEN PEMBIMBING AI */}
          {activeAgentTab === "konsultasi" && (
            <div className="bg-kmNeutral-surface border-2 border-kmNeutral-garis rounded-2xl p-6 sm:p-7 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-kmNeutral-garis">
                <div>
                  <span className="text-[11px] font-mono font-bold text-[#1F7A52] uppercase tracking-wider">
                    PENDAMPINGAN PERSONAL &bull; AGEN PEMBIMBING KERTAMARGA
                  </span>
                  <h4 className="font-serif font-bold text-xl text-kmNeutral-tinta mt-0.5">
                    Diskusi Bimbingan Nilai, Mata Kuliah & Sertifikasi
                  </h4>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-kmNeutral-latar border border-kmNeutral-garis text-kmNeutral-sekunder">
                  Fokus: {curriculum.fieldName} ({targetCourse.code})
                </span>
              </div>

              {/* Quick Question Prompts for the Mentor Agent */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold text-kmNeutral-sekunder block">
                  Pertanyaan Cepat untuk Agen Pembimbing:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    `Nilai saya masih kecil (${currentReadinessScore}%), apa langkah pertama mengejar matkul ${targetCourse.name}?`,
                    `Saya berasal dari lintas jurusan/minat, bagaimana cara beradaptasi di ${curriculum.fieldName}?`,
                    `Jelaskan materi inti mata kuliah ${targetCourse.code} - ${targetCourse.name}`,
                    `Bagaimana tips lulus ${curriculum.mainCertificationTitle}?`,
                  ].map((qText, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSendAgentMessage(qText)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-kmNeutral-latar hover:bg-[#FFC93C]/20 border border-kmNeutral-garis hover:border-[#FFC93C] text-kmNeutral-sekunder hover:text-kmNeutral-tinta transition-colors cursor-pointer text-left"
                    >
                      &ldquo;{qText}&rdquo;
                    </button>
                  ))}
                </div>
              </div>

              {/* Conversation History */}
              <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                {chatHistory.map((turn) => (
                  <div
                    key={turn.id}
                    className={`p-4 sm:p-5 rounded-xl border ${
                      turn.sender === "agent"
                        ? "bg-kmNeutral-latar border-kmNeutral-garis"
                        : "bg-[#2D6CDF]/10 border-[#2D6CDF]/30 ml-auto max-w-2xl"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-mono font-bold uppercase text-kmNeutral-tinta">
                        {turn.sender === "agent"
                          ? `Agen Pembimbing ${curriculum.fieldName}`
                          : "Pertanyaan Siswa"}
                      </span>
                      {turn.diagnosisSummary && (
                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-[#FFC93C]/25 text-[#1B1B2F]">
                          {turn.diagnosisSummary}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-kmNeutral-tinta leading-relaxed">
                      {turn.text}
                    </p>

                    {turn.keyTakeaways && turn.keyTakeaways.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-kmNeutral-garis space-y-1.5">
                        <span className="text-[10px] font-mono font-bold text-kmNeutral-sekunder uppercase block">
                          Poin Tindakan Utama:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {turn.keyTakeaways.map((kt, kIdx) => (
                            <span
                              key={kIdx}
                              className="text-xs px-2.5 py-1 rounded bg-kmNeutral-surface border border-kmNeutral-garis font-medium"
                            >
                              {kt}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {turn.sender === "agent" && turn.recommendedActionType && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveAgentTab(
                              turn.recommendedActionType === "sertifikasi"
                                ? "sertifikasi"
                                : "materi"
                            )
                          }
                          className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-[#2D6CDF] text-white hover:bg-[#2256B8] transition-colors cursor-pointer"
                        >
                          {turn.recommendedActionType === "sertifikasi"
                            ? "Buka Latihan Sertifikasi Terkait ->"
                            : "Buka Modul Materi Pembelajaran ->"}
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {isAgentLoading && (
                  <div className="p-4 rounded-xl bg-kmNeutral-latar border border-kmNeutral-garis flex items-center gap-3 text-xs font-mono text-kmNeutral-sekunder">
                    <span className="w-4 h-4 border-2 border-[#2D6CDF] border-t-transparent rounded-full animate-spin" />
                    <span>Agen Pembimbing sedang menyusun strategi belajar dan latihan...</span>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendAgentMessage();
                }}
                className="flex flex-col sm:flex-row gap-3 pt-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Tanyakan materi mata kuliah ${targetCourse.name}, cara menaikkan nilai, atau latihan sertifikasi...`}
                  className="flex-1 h-11 px-4 rounded-xl bg-kmNeutral-latar border border-kmNeutral-garis text-xs sm:text-sm text-kmNeutral-tinta focus:border-[#2D6CDF]"
                />
                <button
                  type="submit"
                  disabled={isAgentLoading || !chatInput.trim()}
                  className="h-11 px-6 rounded-xl bg-[#FFC93C] hover:bg-[#F5BF2E] disabled:opacity-50 text-[#1B1B2F] font-sans font-bold text-xs sm:text-sm transition-all cursor-pointer shrink-0"
                >
                  Kirim ke Agen Pembimbing &rarr;
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
