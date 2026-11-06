"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
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
    <div className="min-h-screen flex flex-col justify-between bg-kmNeutral-latar text-kmNeutral-tinta relative transition-colors selection:bg-[#FFC93C] selection:text-[#1B1B2F]">
      <Navbar
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
        onOpenTest={() => {}}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-kmNeutral-sekunder mb-8">
          <Link href="/" className="hover:text-kmNeutral-tinta transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <span className="text-[#1F7A52] font-bold">
            Survey Tes Keminatan & Evaluasi Kesiapan Siswa
          </span>
        </div>

        {/* Header */}
        <div className="text-center max-w-4xl mx-auto space-y-5 mb-12">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-xs sm:text-sm font-mono font-bold bg-[#2D6CDF]/15 text-[#2D6CDF] border border-[#2D6CDF]/30 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2D6CDF] animate-pulse" />
            <span>TAHAP 1 DARI 2 &bull; SURVEY KEMINATAN & KESIAPAN AKADEMIK</span>
          </div>

          <h1 className="font-serif font-bold text-4xl sm:text-6xl lg:text-7xl text-kmNeutral-tinta tracking-tight leading-tight">
            Survey Keminatan & Evaluasi Jurusan Tujuan
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-kmNeutral-sekunder max-w-3xl mx-auto leading-relaxed">
            Isi kuesioner singkat di bawah ini sesuai kondisi nilai dan minat Anda. Setelah selesai mengisi survey, Anda akan diarahkan ke halaman khusus Hasil Analisis & Agen Pembimbing.
          </p>
        </div>

        {/* Survey Form Card */}
        <div className="bg-kmNeutral-surface border-2 border-kmNeutral-garis rounded-2xl p-6 sm:p-9 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-kmNeutral-garis">
            <div>
              <span className="text-xs font-mono font-bold text-[#2D6CDF] uppercase tracking-wider">
                FORMULIR SURVEY SISWA &bull; {answeredCount}/4 TERJAWAB
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-kmNeutral-tinta mt-1">
                Tentukan Jurusan & Mata Kuliah yang Ingin Anda Tuju
              </h2>
            </div>

            <button
              type="button"
              onClick={handleSimulateLowScore}
              className="text-xs font-mono font-bold px-3.5 py-2 rounded-lg bg-[#D7263D]/10 hover:bg-[#D7263D]/20 text-[#D7263D] border border-[#D7263D]/30 transition-colors cursor-pointer shrink-0"
            >
              Simulasikan Hasil Nilai Kecil & Lihat Bimbingan &rarr;
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
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-kmNeutral-sekunder">
                <span>
                  Kompetensi Kunci:{" "}
                  <strong className="text-kmNeutral-tinta">
                    {targetCourse.coreCompetency}
                  </strong>
                </span>
                {targetCourse.certificationAlignment && (
                  <span className="font-mono font-bold px-2 py-0.5 rounded bg-[#2E9E6B]/15 text-[#1F7A52] border border-[#2E9E6B]/30">
                    Sertifikasi: {targetCourse.certificationAlignment}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 4 Survey Questions */}
          <form onSubmit={handleSubmitSurvey} className="mt-6 space-y-5 pt-5 border-t border-kmNeutral-garis">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-kmNeutral-tinta">
                3. Pertanyaan Survey Minat & Penguasaan Nilai Awal:
              </span>
              <span className="text-[11px] font-mono text-kmNeutral-sekunder">
                Pilih satu jawaban pada setiap nomor
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
                        PERTANYAAN 0{q.step} &bull; {q.category.toUpperCase()}
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

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-kmNeutral-garis">
              <p className="text-xs text-kmNeutral-sekunder">
                Setelah menekan tombol selesai, Anda akan diarahkan ke halaman khusus{" "}
                <strong className="text-kmNeutral-tinta">
                  Hasil Analisis & Bimbingan Agen
                </strong>
                .
              </p>

              <button
                type="submit"
                className="w-full sm:w-auto h-12 px-8 rounded-xl bg-[#FFC93C] hover:bg-[#F5BF2E] text-[#1B1B2F] font-sans font-bold text-sm shadow-sm border border-[#E6B020]/40 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <span>Selesaikan Survey & Lihat Hasil Analisis</span>
                <span className="font-mono text-sm">&rarr;</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-kmNeutral-surface border-t border-kmNeutral-garis py-8 px-4 sm:px-6 lg:px-8 mt-16 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <span className="w-5 h-5 rounded bg-[#FFC93C] text-[#1B1B2F] font-mono font-bold text-[10px] flex items-center justify-center">
                KM
              </span>
              <span className="font-serif font-bold text-sm text-kmNeutral-tinta">
                KertaMarga Bali
              </span>
            </div>
            <p className="text-xs text-kmNeutral-sekunder">
              Inovasi Navigasi Karier & Penjurusan AI untuk Bali DigiFest 2026 (Kategori SMK)
            </p>
          </div>
          <div className="text-[11px] font-mono text-kmNeutral-sekunder flex gap-3">
            <Link href="/" className="hover:underline">
              Beranda
            </Link>
            <span>&bull;</span>
            <Link href="/ai-navigator" className="hover:underline">
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
        <div className="min-h-screen flex items-center justify-center bg-kmNeutral-latar text-kmNeutral-tinta font-mono text-xs">
          Memuat Survey Tes Keminatan...
        </div>
      }
    >
      <TesKeminatanContent />
    </Suspense>
  );
}
