"use client";

import React from "react";
import Link from "next/link";
import type {
  FieldCurriculum,
  TargetCourse,
} from "@/data/mentorCurriculum";
import type { FieldVerificationResult } from "@/lib/learningProfile";
import type {
  EvaluatedVerificationResponse,
  GeneratedVerificationResponse,
  VerificationEligibility,
} from "@/lib/dynamic-assessment";
import { getCachedUser } from "@/lib/useAuth";
import {
  buildVerificationReportHtml,
  downloadHtmlFile,
  openPrintableReport,
} from "@/lib/test-report-download";

interface VerificationTabProps {
  curriculum: FieldCurriculum;
  targetCourse: TargetCourse;
  eligibility: VerificationEligibility;
  savedVerification?: FieldVerificationResult;
  activeExam: GeneratedVerificationResponse | null;
  mcqAnswers: Record<string, number>;
  openAnswer: string;
  isGenerating: boolean;
  isEvaluating: boolean;
  verCooldownSec: number;
  error: string | null;
  evaluationResult: EvaluatedVerificationResponse | null;
  onGenerateExam: () => void;
  onSelectMcqAnswer: (questionId: string, optionIdx: number) => void;
  onChangeOpenAnswer: (text: string) => void;
  onSubmitEvaluation: () => void;
  onResetExam: () => void;
  onGoToModules: () => void;
  onGoToCertification: () => void;
}

export default function VerificationTab({
  curriculum,
  targetCourse,
  eligibility,
  savedVerification,
  activeExam,
  mcqAnswers,
  openAnswer,
  isGenerating,
  isEvaluating,
  verCooldownSec,
  error,
  evaluationResult,
  onGenerateExam,
  onSelectMcqAnswer,
  onChangeOpenAnswer,
  onSubmitEvaluation,
  onResetExam,
  onGoToModules,
  onGoToCertification,
}: VerificationTabProps) {
  const answeredMcqCount = activeExam
    ? activeExam.mcqs.filter((q) => mcqAnswers[q.id] !== undefined).length
    : 0;
  const isReadyToSubmit =
    Boolean(activeExam) &&
    answeredMcqCount === (activeExam?.mcqs.length || 0) &&
    openAnswer.trim().length >= 20;

  return (
    <div className="neo-card rounded-2xl bg-white p-5 sm:p-7 border-2 border-[#141413] shadow-[4px_4px_0px_#141413] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-[#141413]">
        <div>
          <span className="text-xs font-mono font-bold text-[#3B66FF] uppercase tracking-wider">
            Verifikasi Pemahaman Lintas Modul &bull; {curriculum.fieldName}
          </span>
          <h2 className="font-display font-black text-xl sm:text-2xl text-[#141413] mt-0.5">
            Verifikasi Kemampuan Akhir
          </h2>
          <p className="text-xs sm:text-sm text-[#52514E] mt-1 font-medium">
            Pertanyaan analitis dan studi kasus dihasilkan khusus dari seluruh modul, quiz sertifikasi, dan catatan praktik Anda.
          </p>
        </div>

        <div
          className={`px-4 py-2.5 rounded-xl border-2 border-[#141413] shadow-[3px_3px_0px_#141413] text-xs sm:text-sm font-mono shrink-0 ${
            savedVerification?.status === "passed"
              ? "bg-[#B8F348] text-[#141413]"
              : eligibility.eligible
              ? "bg-[#3B66FF] text-white"
              : "bg-[#FFBE2E] text-[#141413]"
          }`}
        >
          Status:{" "}
          <strong>
            {savedVerification?.status === "passed"
              ? `Terverifikasi (${savedVerification.score}%)`
              : eligibility.eligible
              ? "Siap Diuji"
              : "Terkunci"}
          </strong>
        </div>
      </div>

      {/* Responsible AI Disclosure */}
      <div className="p-3.5 rounded-xl bg-[#FAF7F2] border-2 border-[#141413] text-xs text-[#52514E] leading-relaxed">
        <strong className="text-[#141413] font-mono uppercase">
          Catatan Penggunaan AI Bertanggung Jawab:
        </strong>{" "}
        Soal dan evaluasi umpan balik disusun secara dinamis untuk mengukur pemahaman mandiri terhadap materi KertaMarga Bali, bukan pengganti sertifikasi resmi BNSP/LSP.
      </div>

      {/* Prerequisite Gate when not all modules & quizzes are finished */}
      {!eligibility.eligible && (
        <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] space-y-5">
          <div className="space-y-1.5">
            <span className="inline-block px-2.5 py-0.5 rounded-lg bg-[#FFBE2E] border border-[#141413] font-mono font-bold text-xs text-[#141413]">
              Syarat Pembukaan Fitur Verifikasi
            </span>
            <h3 className="font-display font-black text-lg sm:text-xl text-[#141413]">
              Selesaikan Semua Modul &amp; Quiz Sertifikasi Terlebih Dahulu
            </h3>
            <p className="text-xs sm:text-sm text-[#52514E] font-medium">
              Fitur verifikasi kemampuan terbuka otomatis setelah seluruh modul materi dan semua unit tes sertifikasi pada bidang ini dituntaskan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-white border-2 border-[#141413] space-y-1.5">
              <span className="text-xs font-mono font-bold text-[#52514E] block">
                1. Semua Modul Materi
              </span>
              <span className="font-display font-black text-xl text-[#141413] block">
                {eligibility.completedModulesCount} / {eligibility.totalModules} Selesai
              </span>
              <span
                className={`text-xs font-mono font-bold ${
                  eligibility.missingModules.length === 0
                    ? "text-[#1F7A52]"
                    : "text-[#FF5E4D]"
                }`}
              >
                {eligibility.missingModules.length === 0
                  ? "Terpenuhi"
                  : `Kurang ${eligibility.missingModules.length} modul lagi`}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white border-2 border-[#141413] space-y-1.5">
              <span className="text-xs font-mono font-bold text-[#52514E] block">
                2. Semua Unit Tes Quiz
              </span>
              <span className="font-display font-black text-xl text-[#141413] block">
                {eligibility.passedCertCount} / {eligibility.totalCerts} Lulus
              </span>
              <span
                className={`text-xs font-mono font-bold ${
                  eligibility.missingCerts.length === 0
                    ? "text-[#1F7A52]"
                    : "text-[#FF5E4D]"
                }`}
              >
                {eligibility.missingCerts.length === 0
                  ? "Terpenuhi"
                  : `Kurang ${eligibility.missingCerts.length} unit quiz`}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white border-2 border-[#141413] space-y-1.5">
              <span className="text-xs font-mono font-bold text-[#52514E] block">
                3. Catatan Praktik (Pengaya Soal)
              </span>
              <span className="font-display font-black text-xl text-[#3B66FF] block">
                {eligibility.practiceNotesCount} Modul Terisi
              </span>
              <span className="text-xs text-[#52514E] font-medium block">
                Opsional, memperkaya konteks studi kasus AI.
              </span>
            </div>
          </div>

          {eligibility.missingModules.length > 0 && (
            <div className="p-4 rounded-xl bg-white border border-[#141413]/40 space-y-1.5 text-xs">
              <span className="font-mono font-bold text-[#141413] block">
                Modul yang belum ditandai selesai:
              </span>
              <ul className="list-disc pl-5 space-y-1 text-[#52514E]">
                {eligibility.missingModules.slice(0, 4).map((m) => (
                  <li key={m.id}>{m.title}</li>
                ))}
                {eligibility.missingModules.length > 4 && (
                  <li>Dan {eligibility.missingModules.length - 4} modul lainnya</li>
                )}
              </ul>
            </div>
          )}

          {eligibility.missingCerts.length > 0 && (
            <div className="p-4 rounded-xl bg-white border border-[#141413]/40 space-y-1.5 text-xs">
              <span className="font-mono font-bold text-[#141413] block">
                Unit Quiz Sertifikasi yang belum lulus:
              </span>
              <ul className="list-disc pl-5 space-y-1 text-[#52514E]">
                {eligibility.missingCerts.slice(0, 4).map((c) => (
                  <li key={c.id}>
                    {c.competencyCode}: {c.certName}
                  </li>
                ))}
                {eligibility.missingCerts.length > 4 && (
                  <li>Dan {eligibility.missingCerts.length - 4} unit lainnya</li>
                )}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-1">
            {eligibility.missingModules.length > 0 && (
              <button
                type="button"
                onClick={onGoToModules}
                className="neo-btn min-h-[44px] px-5 py-2.5 rounded-xl bg-[#B8F348] hover:bg-[#a8e635] text-[#141413] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] font-display font-bold text-xs sm:text-sm cursor-pointer"
              >
                Lanjut Selesaikan Modul ({eligibility.missingModules.length}) &rarr;
              </button>
            )}
            {eligibility.missingCerts.length > 0 && (
              <button
                type="button"
                onClick={onGoToCertification}
                className="neo-btn min-h-[44px] px-5 py-2.5 rounded-xl bg-[#FFBE2E] hover:bg-[#f2b329] text-[#141413] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] font-display font-bold text-xs sm:text-sm cursor-pointer"
              >
                Kerjakan Tes Sertifikasi ({eligibility.missingCerts.length}) &rarr;
              </button>
            )}
          </div>
        </div>
      )}

      {/* Unlocked State */}
      {eligibility.eligible && (
        <div className="space-y-6">
          {/* Saved Verification Summary */}
          {savedVerification && !activeExam && !evaluationResult && (
            <div
              className={`p-5 rounded-2xl border-2 border-[#141413] shadow-[3px_3px_0px_#141413] space-y-3 ${
                savedVerification.status === "passed"
                  ? "bg-[#B8F348]/25"
                  : "bg-[#FFBE2E]/20"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono font-bold text-xs uppercase px-2.5 py-1 rounded-lg bg-[#141413] text-white">
                  Rekam Verifikasi Terakhir (Percobaan #{savedVerification.attemptCount})
                </span>
                <span className="font-display font-black text-xl text-[#141413]">
                  Skor: {savedVerification.score}% ({savedVerification.correctCount}/{savedVerification.totalQuestions})
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#141413] leading-relaxed font-medium">
                {savedVerification.summary}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const cachedUser = getCachedUser();
                    const html = buildVerificationReportHtml({
                      curriculum,
                      targetCourse,
                      saved: savedVerification,
                      userName: cachedUser?.name,
                    });
                    downloadHtmlFile(
                      `kertamarga-verifikasi-${curriculum.fieldId}-${new Date().toISOString().slice(0, 10)}.html`,
                      html
                    );
                  }}
                  className="neo-btn px-4 py-2 rounded-xl bg-[#B8F348] hover:bg-[#a8e635] border-2 border-[#141413] text-xs font-mono font-bold text-[#141413] cursor-pointer"
                >
                  Unduh Hasil Verifikasi (.html) &darr;
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const cachedUser = getCachedUser();
                    const html = buildVerificationReportHtml({
                      curriculum,
                      targetCourse,
                      saved: savedVerification,
                      userName: cachedUser?.name,
                    });
                    openPrintableReport(
                      html,
                      `kertamarga-verifikasi-${curriculum.fieldId}-${new Date().toISOString().slice(0, 10)}.html`
                    );
                  }}
                  className="neo-btn px-4 py-2 rounded-xl bg-white border-2 border-[#141413] text-xs font-mono font-bold text-[#141413] cursor-pointer"
                >
                  Cetak PDF
                </button>
                <Link
                  href="/profil"
                  className="neo-btn px-4 py-2 rounded-xl bg-white border-2 border-[#141413] text-xs font-mono font-bold text-[#141413]"
                >
                  Lihat Lencana di Profil &rarr;
                </Link>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-[#FFE5E0] border-2 border-[#141413] flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-[#141413]">
              <span className="font-medium">{error}</span>
              <button
                type="button"
                onClick={onGenerateExam}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#141413] font-mono font-bold text-xs cursor-pointer"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Initial Launch Card when no active exam or evaluation */}
          {!activeExam && !evaluationResult && (
            <div className="p-6 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] space-y-4">
              <div className="space-y-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded-lg bg-[#B8F348] border border-[#141413] font-mono font-bold text-xs text-[#141413]">
                  Semua Prasyarat Terpenuhi ({eligibility.totalModules}/{eligibility.totalModules} Modul &bull; {eligibility.totalCerts}/{eligibility.totalCerts} Quiz)
                </span>
                <h3 className="font-display font-black text-lg sm:text-xl text-[#141413]">
                  Siap Menguji Pemahaman Nyata Anda pada {targetCourse.code} - {targetCourse.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#52514E] leading-relaxed">
                  Sistem akan men-generate <strong>4 soal analisis lintas modul</strong> dan <strong>1 pertanyaan uraian studi kasus Bali</strong> baru berdasarkan kurikulum serta {eligibility.practiceNotesCount} catatan praktik Anda. Ambang kelulusan verifikasi adalah <strong>70%</strong>.
                </p>
              </div>

              <button
                type="button"
                disabled={isGenerating || verCooldownSec > 0}
                onClick={onGenerateExam}
                className="neo-btn min-h-[48px] px-6 py-3 rounded-xl bg-[#3B66FF] hover:bg-[#2f56e0] disabled:opacity-60 text-white border-2 border-[#141413] shadow-[4px_4px_0px_#141413] font-display font-black text-sm cursor-pointer disabled:cursor-not-allowed"
              >
                {isGenerating
                  ? "Sedang Menyusun Soal Verifikasi..."
                  : verCooldownSec > 0
                  ? `Jeda Proteksi API (${verCooldownSec}d)`
                  : savedVerification
                  ? "Generate Soal Verifikasi Baru"
                  : "Mulai & Generate Soal Verifikasi"}
              </button>
            </div>
          )}

          {/* Loading Skeleton */}
          {isGenerating && (
            <div className="space-y-4">
              {[1, 2, 3].map((k) => (
                <div
                  key={k}
                  className="p-5 rounded-2xl border-2 border-[#141413] bg-[#FAF7F2] space-y-3 animate-pulse"
                >
                  <div className="h-4 w-40 rounded bg-[#141413]/10" />
                  <div className="h-5 w-full rounded bg-[#141413]/10" />
                  <div className="h-10 w-full rounded-xl bg-white border border-[#141413]/20" />
                </div>
              ))}
            </div>
          )}

          {/* Active Exam Form */}
          {activeExam && !evaluationResult && !isGenerating && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-[#141413] text-white border-2 border-[#141413] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-mono font-bold text-[#B8F348]">
                    Asesmen Aktif &bull; {activeExam.sourceMode === "curriculum-dynamic" ? "Generator Kurikulum Adaptif" : "AI Generated Assessment"}
                  </span>
                  <p className="text-xs text-[#F0ECE1]/90">
                    Terjawab: {answeredMcqCount}/{activeExam.mcqs.length} pilihan ganda &bull; Uraian kasus minimal {activeExam.openPrompt.minChars} karakter
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isGenerating || isEvaluating || verCooldownSec > 0}
                  onClick={onGenerateExam}
                  className="px-3.5 py-2 rounded-xl bg-[#FFBE2E] hover:bg-[#f2b329] disabled:opacity-60 text-[#141413] border-2 border-white font-mono font-bold text-xs cursor-pointer shrink-0 disabled:cursor-not-allowed"
                >
                  {verCooldownSec > 0
                    ? `Jeda Proteksi API (${verCooldownSec}d)`
                    : "Buat Ulang Soal Baru"}
                </button>
              </div>

              {/* 4 MCQs */}
              <div className="space-y-4">
                {activeExam.mcqs.map((q, idx) => {
                  const chosenIdx = mcqAnswers[q.id];
                  return (
                    <div
                      key={q.id}
                      className="p-5 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] space-y-3.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                        <span className="font-bold px-2.5 py-1 rounded-lg bg-[#3B66FF] text-white border border-[#141413]">
                          Soal Verifikasi #{idx + 1} &bull; {q.competencyCode}
                        </span>
                        <span className="text-[#52514E] font-bold truncate max-w-md">
                          {q.moduleTitle}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-sm sm:text-base text-[#141413] leading-relaxed">
                        {q.question}
                      </h3>

                      <div className="space-y-2">
                        {q.options.map((optText, oIdx) => {
                          const isChosen = chosenIdx === oIdx;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() => onSelectMcqAnswer(q.id, oIdx)}
                              className={`w-full min-h-[44px] text-left p-3.5 rounded-xl text-xs sm:text-sm border-2 border-[#141413] transition-all cursor-pointer flex items-start gap-2.5 ${
                                isChosen
                                  ? "bg-[#3B66FF] text-white font-bold shadow-[3px_3px_0px_#141413]"
                                  : "bg-white text-[#52514E] hover:bg-[#F0ECE1] hover:text-[#141413]"
                              }`}
                            >
                              <span className="font-mono font-bold text-xs shrink-0 mt-0.5">
                                {String.fromCharCode(65 + oIdx)}.
                              </span>
                              <span>{optText}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Open Case Question */}
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-[#FFBE2E] text-[#141413] border border-[#141413]">
                    Bagian 2: Penalaran Studi Kasus Mandiri (Bobot 20%)
                  </span>
                  <span className="text-xs font-mono text-[#52514E]">
                    {openAnswer.trim().length} karakter (disarankan min. {activeExam.openPrompt.minChars})
                  </span>
                </div>

                <h3 className="font-display font-bold text-sm sm:text-base text-[#141413]">
                  {activeExam.openPrompt.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#141413] leading-relaxed">
                  {activeExam.openPrompt.question}
                </p>
                <p className="text-xs text-[#52514E] font-mono">
                  Petunjuk fokus: {activeExam.openPrompt.contextHint}
                </p>

                <textarea
                  rows={4}
                  value={openAnswer}
                  onChange={(e) => onChangeOpenAnswer(e.target.value)}
                  placeholder="Tuliskan langkah analisis, penerapan standar kompetensi, dan cara memvalidasi hasilnya dengan kata-kata Anda sendiri..."
                  className="w-full p-3.5 rounded-xl bg-white border-2 border-[#141413] text-xs sm:text-sm text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#3B66FF]"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={onResetExam}
                  className="px-4 py-2.5 rounded-xl bg-white border-2 border-[#141413] text-xs font-mono font-bold text-[#141413] cursor-pointer"
                >
                  Batalkan Sesi
                </button>

                <button
                  type="button"
                  disabled={!isReadyToSubmit || isEvaluating}
                  onClick={onSubmitEvaluation}
                  className="neo-btn min-h-[48px] px-6 py-3 rounded-xl bg-[#B8F348] hover:bg-[#a8e635] disabled:opacity-50 text-[#141413] border-2 border-[#141413] shadow-[4px_4px_0px_#141413] font-display font-black text-xs sm:text-sm cursor-pointer"
                >
                  {isEvaluating
                    ? "Mengevaluasi Jawaban Anda..."
                    : "Kirim & Evaluasi Verifikasi"}
                </button>
              </div>
            </div>
          )}

          {/* Evaluation Result View */}
          {evaluationResult && (
            <div className="space-y-5">
              <div
                className={`p-5 sm:p-6 rounded-2xl border-2 border-[#141413] shadow-[4px_4px_0px_#141413] space-y-4 ${
                  evaluationResult.status === "passed"
                    ? "bg-[#B8F348]/25"
                    : "bg-[#FFBE2E]/25"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-lg border border-[#141413] font-mono font-bold text-xs uppercase ${
                        evaluationResult.status === "passed"
                          ? "bg-[#3B66FF] text-white"
                          : "bg-[#FF5E4D] text-white"
                      }`}
                    >
                      {evaluationResult.status === "passed"
                        ? "Kemampuan Terverifikasi Lulus"
                        : "Perlu Pendalaman Lanjutan (< 70%)"}
                    </span>
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-[#141413] mt-2">
                      Skor Verifikasi: {evaluationResult.score}%
                    </h3>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border-2 border-[#141413] text-xs font-mono space-y-1 shrink-0">
                    <div>
                      Analisis Pilihan Ganda:{" "}
                      <strong>
                        {evaluationResult.mcqCorrectCount}/{evaluationResult.mcqTotal} Benar
                      </strong>
                    </div>
                    <div>
                      Penalaran Studi Kasus:{" "}
                      <strong>
                        {evaluationResult.openScore}/{evaluationResult.maxOpenScore} Poin
                      </strong>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#141413] font-medium leading-relaxed">
                  {evaluationResult.summary}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-white border border-[#141413] space-y-1.5 text-xs">
                    <span className="font-mono font-bold text-[#1F7A52] uppercase block">
                      Kekuatan Pemahaman
                    </span>
                    {evaluationResult.strengths.length === 0 ? (
                      <p className="text-[#52514E]">
                        Teruskan latihan menghubungkan teori ke langkah kerja terukur.
                      </p>
                    ) : (
                      <ul className="list-disc pl-4 space-y-1 text-[#141413]">
                        {evaluationResult.strengths.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#141413] space-y-1.5 text-xs">
                    <span className="font-mono font-bold text-[#3B66FF] uppercase block">
                      Rekomendasi Peningkatan
                    </span>
                    {evaluationResult.improvements.length === 0 ? (
                      <p className="text-[#52514E]">
                        Penguasaan lintas modul sudah sangat solid. Pertahankan dengan proyek portofolio!
                      </p>
                    ) : (
                      <ul className="list-disc pl-4 space-y-1 text-[#141413]">
                        {evaluationResult.improvements.map((imp, idx) => (
                          <li key={idx}>{imp}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* Open Case Evaluation Detail */}
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] space-y-2.5 text-xs sm:text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 font-mono font-bold">
                  <span className="text-[#3B66FF]">
                    Evaluasi Jawaban Studi Kasus Mandiri
                  </span>
                  <span className="text-[#141413]">
                    Skor Kasus: {evaluationResult.openScore}/{evaluationResult.maxOpenScore}
                  </span>
                </div>
                <p className="text-[#52514E] italic bg-white p-3 rounded-xl border border-[#141413]/30">
                  &ldquo;{evaluationResult.openAnswer}&rdquo;
                </p>
                <p className="text-[#141413] font-medium leading-relaxed">
                  {evaluationResult.openFeedback}
                </p>
              </div>

              {/* Per-Question Reviews */}
              <div className="space-y-3">
                <h4 className="font-display font-black text-base text-[#141413]">
                  Pembahasan Soal Pilihan Ganda
                </h4>
                {evaluationResult.reviews.map((rev, idx) => (
                  <div
                    key={rev.id}
                    className={`p-4 rounded-2xl border-2 border-[#141413] space-y-2 text-xs sm:text-sm ${
                      rev.isCorrect ? "bg-[#B8F348]/15" : "bg-[#FFE5E0]"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono font-bold text-xs">
                      <span>
                        Soal #{idx + 1} ({rev.competencyCode})
                      </span>
                      <span
                        className={
                          rev.isCorrect ? "text-[#1F7A52]" : "text-[#FF5E4D]"
                        }
                      >
                        {rev.isCorrect ? "Tepat" : "Perlu Tinjauan"}
                      </span>
                    </div>
                    <p className="font-bold text-[#141413]">{rev.question}</p>
                    <div className="text-xs space-y-1">
                      <div>
                        Jawaban Anda:{" "}
                        <strong>
                          {rev.selectedIndex >= 0
                            ? `${String.fromCharCode(65 + rev.selectedIndex)}. ${rev.options[rev.selectedIndex]}`
                            : "Belum dipilih"}
                        </strong>
                      </div>
                      {!rev.isCorrect && (
                        <div>
                          Jawaban Tepat:{" "}
                          <strong className="text-[#1F7A52]">
                            {String.fromCharCode(65 + rev.correctIndex)}.{" "}
                            {rev.options[rev.correctIndex]}
                          </strong>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-[#141413] leading-relaxed pt-1 border-t border-[#141413]/20">
                      {rev.explanation}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const cachedUser = getCachedUser();
                    const html = buildVerificationReportHtml({
                      curriculum,
                      targetCourse,
                      evaluation: evaluationResult,
                      saved: savedVerification,
                      userName: cachedUser?.name,
                    });
                    downloadHtmlFile(
                      `kertamarga-verifikasi-${curriculum.fieldId}-${new Date().toISOString().slice(0, 10)}.html`,
                      html
                    );
                  }}
                  className="neo-btn min-h-[44px] px-5 py-2.5 rounded-xl bg-[#B8F348] hover:bg-[#a8e635] text-[#141413] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] font-display font-bold text-xs sm:text-sm cursor-pointer"
                >
                  Unduh Hasil Verifikasi (.html) &darr;
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const cachedUser = getCachedUser();
                    const html = buildVerificationReportHtml({
                      curriculum,
                      targetCourse,
                      evaluation: evaluationResult,
                      saved: savedVerification,
                      userName: cachedUser?.name,
                    });
                    openPrintableReport(
                      html,
                      `kertamarga-verifikasi-${curriculum.fieldId}-${new Date().toISOString().slice(0, 10)}.html`
                    );
                  }}
                  className="neo-btn min-h-[44px] px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#141413] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] font-mono font-bold text-xs cursor-pointer"
                >
                  Cetak PDF
                </button>

                <button
                  type="button"
                  disabled={isGenerating || verCooldownSec > 0}
                  onClick={onGenerateExam}
                  className="neo-btn min-h-[44px] px-5 py-2.5 rounded-xl bg-[#FFBE2E] hover:bg-[#f2b329] disabled:opacity-60 text-[#141413] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] font-display font-bold text-xs sm:text-sm cursor-pointer disabled:cursor-not-allowed"
                >
                  {isGenerating
                    ? "Menyusun Soal Baru..."
                    : verCooldownSec > 0
                    ? `Jeda Proteksi API (${verCooldownSec}d)`
                    : "Uji Ulang dengan Soal Baru"}
                </button>

                <Link
                  href="/profil"
                  className="neo-btn inline-flex items-center min-h-[44px] px-5 py-2.5 rounded-xl bg-[#3B66FF] hover:bg-[#2f56e0] text-white border-2 border-[#141413] shadow-[3px_3px_0px_#141413] font-display font-bold text-xs sm:text-sm"
                >
                  Simpan &amp; Buka Profil Belajar &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
