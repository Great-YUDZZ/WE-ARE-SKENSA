"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import KertaMargaLogo from "@/components/KertaMargaLogo";
import LoginModal from "@/components/LoginModal";
import { FIELDS, GROUP_CONFIG, FieldGroup } from "@/data/fields";
import {
  INTEREST_TEST_QUESTIONS,
  MENTOR_CURRICULUM_BY_FIELD,
  FieldCurriculum,
  TargetCourse,
} from "@/data/mentorCurriculum";

const INTEREST_TO_FIELD_MAP: Record<string, string> = {
  "Teknik Jaringan (TKJ/CCNA/MTCNA)": "tkj",
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

function TesKeminatanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fieldParam = searchParams.get("field") || undefined;
  const interestsParam = searchParams.get("interests");

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const initialInterests = interestsParam ? interestsParam.split(",") : undefined;
  const resolvedInitialField =
    fieldParam && MENTOR_CURRICULUM_BY_FIELD[fieldParam]
      ? fieldParam
      : initialInterests && initialInterests.length > 0
      ? INTEREST_TO_FIELD_MAP[initialInterests[0]] || "informatika"
      : "informatika";

  const [targetFieldId, setTargetFieldId] = useState<string>(resolvedInitialField);
  const curriculum: FieldCurriculum =
    MENTOR_CURRICULUM_BY_FIELD[targetFieldId] || MENTOR_CURRICULUM_BY_FIELD.informatika;

  const [targetCourseId, setTargetCourseId] = useState<string>(
    curriculum.targetCourses[0].id
  );

  useEffect(() => {
    const curr =
      MENTOR_CURRICULUM_BY_FIELD[targetFieldId] || MENTOR_CURRICULUM_BY_FIELD.informatika;
    setTargetCourseId(curr.targetCourses[0].id);
  }, [targetFieldId]);

  const targetCourse: TargetCourse =
    curriculum.targetCourses.find((c) => c.id === targetCourseId) ||
    curriculum.targetCourses[0];

  const [answers, setAnswers] = useState<Record<string, number>>({
    "q1-situasi": 0,
    "q2-fondasi-nilai": 2,
    "q3-kesiapan-matkul": 2,
    "q4-portofolio": 2,
  });

  const handleOpenLogin = () => {
    setAuthMode("login");
    setIsLoginModalOpen(true);
  };

  const handleOpenRegister = () => {
    setAuthMode("register");
    setIsLoginModalOpen(true);
  };

  const computeAndNavigateToResult = (customAnswers?: Record<string, number>) => {
    const activeAnswers = customAnswers || answers;
    let totalWeight = 0;
    let count = 0;
    const groupCounts: Record<FieldGroup, number> = {
      teknologi: 0,
      manusia: 0,
      alam: 0,
      usaha: 0,
    };

    INTEREST_TEST_QUESTIONS.forEach((q) => {
      const idx = activeAnswers[q.id];
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
    const baseScore = isGroupMismatch ? Math.max(40, avg - 6) : avg;

    try {
      window.localStorage.setItem(
        "kertamarga_survey_result",
        JSON.stringify({
          fieldId: targetFieldId,
          courseId: targetCourse.id,
          score: baseScore,
          dominant: dominantGroup,
          mismatch: isGroupMismatch,
          completedAt: new Date().toISOString(),
        })
      );
    } catch {
      // Ignore storage quota or private mode errors
    }

    const params = new URLSearchParams();
    params.set("field", targetFieldId);
    params.set("course", targetCourse.id);
    params.set("score", String(baseScore));
    params.set("dominant", dominantGroup);
    params.set("mismatch", isGroupMismatch ? "1" : "0");

    router.push(`/hasil-analisis?${params.toString()}`);
  };

  const handleSubmitSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    computeAndNavigateToResult();
  };

  const handleSimulateLowScore = () => {
    const simulatedAnswers: Record<string, number> = {
      "q1-situasi": curriculum.group === "teknologi" ? 1 : 0,
      "q2-fondasi-nilai": 2,
      "q3-kesiapan-matkul": 2,
      "q4-portofolio": 3,
    };
    setAnswers(simulatedAnswers);
    computeAndNavigateToResult(simulatedAnswers);
  };

  const groupStyle = GROUP_CONFIG[curriculum.group];
  const selectedFieldObj = FIELDS.find((f) => f.id === targetFieldId) || FIELDS[0];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen flex flex-col neopop-canvas-subtle text-[#141413] relative selection:bg-[#B8F348] selection:text-[#141413]">
      <Navbar
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
        onOpenTest={() => {}}
      />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-[#52514E] mb-6">
          <Link href="/" className="hover:text-[#141413] transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <span className="text-[#3B66FF] uppercase">
            Survey Tes Keminatan & Kesiapan Siswa
          </span>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-center max-w-4xl mx-auto space-y-4 mb-10"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#3B66FF] text-white border-2 border-[#141413] shadow-[3px_3px_0px_#141413]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B8F348] border border-[#141413]" />
            <span>TAHAP 1 DARI 2 &bull; SURVEY KEMINATAN & KESIAPAN AKADEMIK</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-[#141413] tracking-tight leading-tight">
            Survey Keminatan &amp; Evaluasi Jurusan Tujuan
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-[#52514E] max-w-3xl mx-auto leading-relaxed font-medium">
            Isi kuesioner singkat di bawah ini sesuai kondisi nilai dan minat Anda. Setelah selesai, Anda akan diarahkan ke halaman khusus Hasil Analisis &amp; Agen Pembimbing.
          </p>
        </motion.div>

        {/* Survey Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="neo-card-lg rounded-3xl p-5 sm:p-8 bg-white"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b-2 border-[#141413]">
            <div>
              <span className="text-xs font-mono font-bold text-[#3B66FF] uppercase tracking-wider">
                FORMULIR SURVEY SISWA &bull; {answeredCount}/4 TERJAWAB
              </span>
              <h2 className="font-display font-black text-xl sm:text-2xl text-[#141413] mt-1">
                Tentukan Jurusan &amp; Mata Kuliah yang Ingin Anda Tuju
              </h2>
            </div>

            <button
              type="button"
              onClick={handleSimulateLowScore}
              className="neo-btn text-xs font-mono font-bold px-4 py-2.5 rounded-xl bg-[#FFE5E0] hover:bg-[#FF5E4D] hover:text-white text-[#141413] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] cursor-pointer shrink-0"
            >
              Simulasikan Nilai Kecil &amp; Lihat Bimbingan &rarr;
            </button>
          </div>

          {/* Target Major & Target Course Selector */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413]">
              <label className="block text-xs font-display font-extrabold text-[#141413] mb-2">
                1. Jurusan / Program Studi yang Dituju di Bali:
              </label>
              <select
                value={targetFieldId}
                onChange={(e) => setTargetFieldId(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-white border-2 border-[#141413] text-[#141413] text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#3B66FF] transition-colors"
              >
                {FIELDS.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name} ({field.categoryName})
                  </option>
                ))}
              </select>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#52514E]">
                <span className={`font-mono font-bold px-2.5 py-0.5 rounded-lg border border-[#141413] ${groupStyle.badgeBg} ${groupStyle.badgeText}`}>
                  {groupStyle.label}
                </span>
                <span>
                  Rujukan:{" "}
                  <strong className="text-[#141413]">
                    {selectedFieldObj.institutions.map((i) => i.name).join(", ")}
                  </strong>
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413]">
              <label className="block text-xs font-display font-extrabold text-[#141413] mb-2">
                2. Mata Kuliah / Kompetensi Inti yang Dituju:
              </label>
              <select
                value={targetCourse.id}
                onChange={(e) => setTargetCourseId(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-white border-2 border-[#141413] text-[#141413] text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#3B66FF] transition-colors"
              >
                {curriculum.targetCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    [{course.code}] {course.name} ({course.sks} SKS - Standar Min. {course.minScore}%)
                  </option>
                ))}
              </select>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#52514E]">
                <span>
                  Kompetensi Kunci:{" "}
                  <strong className="text-[#141413]">
                    {targetCourse.coreCompetency}
                  </strong>
                </span>
                {targetCourse.certificationAlignment && (
                  <span className="font-mono font-bold px-2.5 py-0.5 rounded-lg bg-[#B8F348] text-[#141413] border border-[#141413]">
                    Sertifikasi: {targetCourse.certificationAlignment}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 4 Survey Questions */}
          <form onSubmit={handleSubmitSurvey} className="mt-6 space-y-5 pt-6 border-t-2 border-[#141413]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-display font-extrabold text-[#141413]">
                3. Pertanyaan Survey Minat &amp; Penguasaan Nilai Awal:
              </span>
              <span className="text-xs font-mono font-bold text-[#52514E] px-2.5 py-1 rounded-lg bg-[#F0ECE1] border border-[#141413]">
                Pilih satu jawaban per nomor
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {INTEREST_TEST_QUESTIONS.map((q) => (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] shadow-[4px_4px_0px_#141413] flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg bg-[#3B66FF] text-white border border-[#141413]">
                        PERTANYAAN 0{q.step} &bull; {q.category.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-sm sm:text-base text-[#141413] leading-snug">
                      {q.question}
                    </h3>
                    <p className="text-xs text-[#52514E] mt-1 font-medium">
                      {q.subtitle}
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
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
                          className={`w-full text-left p-3 rounded-xl text-xs transition-all cursor-pointer border-2 flex items-start gap-2.5 ${
                            isSelected
                              ? "bg-[#B8F348] border-[#141413] text-[#141413] font-bold shadow-[3px_3px_0px_#141413]"
                              : "bg-white border-[#141413] text-[#52514E] hover:bg-[#F0ECE1] hover:text-[#141413] font-medium"
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-lg shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-mono font-bold border border-[#141413] ${
                              isSelected
                                ? "bg-[#141413] text-[#B8F348]"
                                : "bg-[#FAF7F2] text-[#141413]"
                            }`}
                          >
                            {isSelected ? "OK" : String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="leading-relaxed">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-[#141413]">
              <p className="text-xs text-[#52514E] font-medium">
                Setelah menekan tombol selesai, Anda akan diarahkan ke halaman khusus{" "}
                <strong className="text-[#141413]">
                  Hasil Analisis &amp; Bimbingan Agen
                </strong>
                .
              </p>

              <button
                type="submit"
                className="neo-btn w-full sm:w-auto h-12 px-7 rounded-2xl bg-[#FFBE2E] hover:bg-[#f2b329] text-[#141413] font-display font-black text-sm border-2 border-[#141413] shadow-[4px_4px_0px_#141413] cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <span>Selesaikan Survey &amp; Lihat Hasil Analisis</span>
                <span className="font-mono text-sm">&rarr;</span>
              </button>
            </div>
          </form>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t-2 border-[#141413] py-8 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <KertaMargaLogo variant="compact" className="w-7 h-7 shrink-0" />
              <span className="font-display font-black text-sm text-[#141413]">
                KertaMarga Bali
              </span>
            </div>
            <p className="text-xs text-[#52514E] font-medium">
              Inovasi Navigasi Karier &amp; Penjurusan AI untuk Bali DigiFest 2026 (Kategori SMK)
            </p>
          </div>
          <div className="text-xs font-mono font-bold text-[#52514E] flex flex-wrap justify-center gap-4">
            <Link href="/" className="hover:text-[#141413]">
              Beranda
            </Link>
            <Link href="/eksplorasi" className="hover:text-[#141413]">
              Kuesioner Adaptif
            </Link>
            <Link href="/katalog" className="hover:text-[#141413]">
              Katalog Bali
            </Link>
            <Link href="/ai-navigator" className="hover:text-[#141413]">
              AI Navigator
            </Link>
          </div>
        </div>
      </footer>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onProceedToTest={() => setIsLoginModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}

export default function TesKeminatanPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center neopop-canvas-subtle text-[#141413] font-mono font-bold text-xs">
          Memuat Survey Tes Keminatan...
        </div>
      }
    >
      <TesKeminatanContent />
    </Suspense>
  );
}
