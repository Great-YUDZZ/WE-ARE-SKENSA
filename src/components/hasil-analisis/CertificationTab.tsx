"use client";

import React from "react";
import type {
  FieldCurriculum,
  TargetCourse,
} from "@/data/mentorCurriculum";
import type { DynamicQuizQuestion } from "@/lib/dynamic-assessment";

interface CertificationTabProps {
  curriculum: FieldCurriculum;
  targetCourse: TargetCourse;
  filteredCertDrills: DynamicQuizQuestion[];
  selectedCertFilter: string;
  onChangeFilter: (filterId: string) => void;
  certTrackOptions: string[];
  selectedCertAnswers: Record<string, number>;
  onSelectAnswer: (drillId: string, optionIdx: number) => void;
  submittedCertIds: string[];
  passedCertIds: string[];
  onCheckAnswer: (
    drillId: string,
    correctIndex: number,
    boost: number,
    code: string
  ) => void;
  quizVariationNumber: number;
  quizSourceMode: string;
  isQuizGenerating: boolean;
  quizCooldownSec: number;
  quizError: string | null;
  onRegenerateQuiz: () => void;
  isVerificationUnlocked: boolean;
  onGoToVerification: () => void;
}

export default function CertificationTab({
  curriculum,
  targetCourse,
  filteredCertDrills,
  selectedCertFilter,
  onChangeFilter,
  certTrackOptions,
  selectedCertAnswers,
  onSelectAnswer,
  submittedCertIds,
  passedCertIds,
  onCheckAnswer,
  quizVariationNumber,
  quizSourceMode,
  isQuizGenerating,
  quizCooldownSec,
  quizError,
  onRegenerateQuiz,
  isVerificationUnlocked,
  onGoToVerification,
}: CertificationTabProps) {
  const isAiGenerated =
    quizSourceMode === "9router-structured" ||
    quizSourceMode === "gemini-structured";

  return (
    <div className="neo-card rounded-2xl bg-white p-5 sm:p-7 border-2 border-[#141413] shadow-[4px_4px_0px_#141413] space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-[#141413]">
        <div>
          <span className="text-xs font-mono font-bold text-[#1F7A52] uppercase tracking-wider">
            Simulasi Uji Kompetensi Dinamis &bull; {curriculum.certificationBody}
          </span>
          <h2 className="font-display font-black text-xl sm:text-2xl text-[#141413] mt-0.5">
            {curriculum.mainCertificationTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#52514E] mt-1 font-medium">
            Soal dan urutan pilihan jawaban A-D berganti secara dinamis per percobaan untuk mencegah hafalan statis dan mengukur pemahaman nyata.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-[#B8F348] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] text-xs sm:text-sm font-mono shrink-0">
          Lulus:{" "}
          <strong className="text-[#141413]">
            {passedCertIds.length} / {curriculum.certificationDrills.length} Unit
          </strong>
        </div>
      </div>

      {/* Dynamic Quiz Generator Control Banner */}
      <div className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold">
            <span className="px-2.5 py-0.5 rounded-lg bg-[#141413] text-[#B8F348]">
              Set Soal Dinamis #{quizVariationNumber}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-lg border border-[#141413] ${
                isAiGenerated
                  ? "bg-[#3B66FF] text-white"
                  : "bg-[#FFBE2E] text-[#141413]"
              }`}
            >
              {isAiGenerated
                ? "AI Generated Scenario"
                : "Bank Variasi Adaptif"}
            </span>
          </div>
          <p className="text-xs text-[#52514E] font-medium">
            Ingin menguji pemahaman ulang dengan skenario berbeda? Buat set pertanyaan baru kapan saja; skor unit yang sudah lulus tetap tersimpan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={isQuizGenerating || quizCooldownSec > 0}
            onClick={onRegenerateQuiz}
            className="neo-btn min-h-[44px] px-4 py-2 rounded-xl bg-[#FFBE2E] hover:bg-[#f2b329] disabled:opacity-60 text-[#141413] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] font-display font-bold text-xs sm:text-sm cursor-pointer"
          >
            {isQuizGenerating
              ? "Menyusun Soal Baru..."
              : quizCooldownSec > 0
              ? `Jeda Proteksi API (${quizCooldownSec}d)`
              : "Acak & Buat Soal Baru"}
          </button>

          {isVerificationUnlocked && (
            <button
              type="button"
              onClick={onGoToVerification}
              className="neo-btn min-h-[44px] px-4 py-2 rounded-xl bg-[#3B66FF] hover:bg-[#2f56e0] text-white border-2 border-[#141413] shadow-[3px_3px_0px_#141413] font-display font-bold text-xs sm:text-sm cursor-pointer"
            >
              Lanjut Verifikasi Kemampuan &rarr;
            </button>
          )}
        </div>
      </div>

      {quizError && (
        <div className="p-3.5 rounded-xl bg-[#FFE5E0] border-2 border-[#141413] flex flex-wrap items-center justify-between gap-2 text-xs text-[#141413]">
          <span className="font-medium">{quizError}</span>
          <button
            type="button"
            onClick={onRegenerateQuiz}
            className="px-3 py-1 rounded-lg bg-white border border-[#141413] font-mono font-bold cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono font-bold text-[#52514E] mr-1">
          Filter Skema:
        </span>
        <button
          type="button"
          onClick={() => onChangeFilter("ALL")}
          className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border-2 border-[#141413] transition-all cursor-pointer ${
            selectedCertFilter === "ALL"
              ? "bg-[#141413] text-[#B8F348] shadow-[2px_2px_0px_#3B66FF]"
              : "bg-[#FAF7F2] text-[#52514E] hover:bg-[#F0ECE1] hover:text-[#141413]"
          }`}
        >
          Semua ({curriculum.certificationDrills.length})
        </button>
        <button
          type="button"
          onClick={() => onChangeFilter("TARGET_COURSE")}
          className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border-2 border-[#141413] transition-all cursor-pointer ${
            selectedCertFilter === "TARGET_COURSE"
              ? "bg-[#141413] text-[#B8F348] shadow-[2px_2px_0px_#3B66FF]"
              : "bg-[#FAF7F2] text-[#52514E] hover:bg-[#F0ECE1] hover:text-[#141413]"
          }`}
        >
          Matkul [{targetCourse.code}]
        </button>
        {certTrackOptions.map((trackName) => (
          <button
            key={trackName}
            type="button"
            onClick={() => onChangeFilter(trackName)}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border-2 border-[#141413] transition-all cursor-pointer ${
              selectedCertFilter === trackName
                ? "bg-[#141413] text-[#B8F348] shadow-[2px_2px_0px_#3B66FF]"
                : "bg-[#FAF7F2] text-[#52514E] hover:bg-[#F0ECE1] hover:text-[#141413]"
            }`}
          >
            {trackName}
          </button>
        ))}
      </div>

      {/* Drills List */}
      <div className="space-y-4">
        {isQuizGenerating ? (
          <div className="space-y-4">
            {[1, 2, 3].map((sk) => (
              <div
                key={sk}
                className="p-5 rounded-2xl border-2 border-[#141413] bg-[#FAF7F2] space-y-3 animate-pulse"
              >
                <div className="h-5 w-48 rounded bg-[#141413]/10" />
                <div className="h-4 w-full rounded bg-[#141413]/10" />
                <div className="h-4 w-3/4 rounded bg-[#141413]/10" />
                <div className="space-y-2 pt-2">
                  <div className="h-10 w-full rounded-xl bg-white border border-[#141413]/20" />
                  <div className="h-10 w-full rounded-xl bg-white border border-[#141413]/20" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCertDrills.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] text-center space-y-3">
            <p className="font-display font-bold text-sm sm:text-base text-[#141413]">
              Belum ada soal latihan pada filter skema ini.
            </p>
            <button
              type="button"
              onClick={() => onChangeFilter("ALL")}
              className="neo-btn px-4 py-2 rounded-xl bg-[#B8F348] text-[#141413] border-2 border-[#141413] font-mono font-bold text-xs cursor-pointer"
            >
              Tampilkan Semua Soal ({curriculum.certificationDrills.length})
            </button>
          </div>
        ) : (
          filteredCertDrills.map((drill, dIdx) => {
            const chosenIdx = selectedCertAnswers[drill.id];
            const isSubmitted = submittedCertIds.includes(drill.id);
            const isPassed = passedCertIds.includes(drill.id);
            const isCorrectNow = chosenIdx === drill.correctIndex;

            return (
              <div
                key={drill.id}
                className={`p-5 rounded-2xl border-2 border-[#141413] space-y-4 shadow-[3px_3px_0px_#141413] ${
                  isPassed ? "bg-[#B8F348]/15" : "bg-[#FAF7F2]"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="font-bold px-2.5 py-1 rounded-lg bg-[#B8F348] text-[#141413] border border-[#141413]">
                      {drill.competencyCode}
                    </span>
                    {drill.certTrack && (
                      <span className="font-bold px-2.5 py-1 rounded-lg bg-[#3B66FF] text-white border border-[#141413]">
                        {drill.certTrack}
                      </span>
                    )}
                    {drill.variationTag && (
                      <span className="font-bold px-2.5 py-1 rounded-lg bg-white text-[#141413] border border-[#141413]">
                        {drill.variationTag}
                      </span>
                    )}
                    <span className="font-bold text-[#52514E]">{drill.certName}</span>
                  </div>

                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                      isPassed
                        ? "bg-[#B8F348] text-[#141413] border border-[#141413]"
                        : "text-[#52514E]"
                    }`}
                  >
                    {isPassed
                      ? `Kompeten (+${drill.scoreBoost}%)`
                      : `Soal #${dIdx + 1} (+${drill.scoreBoost}%)`}
                  </span>
                </div>

                <h3 className="font-display font-bold text-sm sm:text-base text-[#141413] leading-relaxed">
                  {drill.question}
                </h3>

                <div className="space-y-2">
                  {drill.options.map((optText, oIdx) => {
                    const isChosen = chosenIdx === oIdx;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => onSelectAnswer(drill.id, oIdx)}
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

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    disabled={chosenIdx === undefined}
                    onClick={() =>
                      onCheckAnswer(
                        drill.id,
                        drill.correctIndex,
                        drill.scoreBoost,
                        drill.competencyCode
                      )
                    }
                    className="neo-btn min-h-[44px] px-5 rounded-xl bg-[#FFBE2E] hover:bg-[#f2b329] disabled:opacity-50 text-[#141413] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] font-display font-bold text-xs sm:text-sm cursor-pointer"
                  >
                    Periksa Jawaban
                  </button>

                  {isSubmitted && (
                    <span
                      className={`text-xs sm:text-sm font-mono font-bold ${
                        isCorrectNow ? "text-[#1F7A52]" : "text-[#FF5E4D]"
                      }`}
                    >
                      {isCorrectNow
                        ? "Jawaban Tepat (Kompeten)"
                        : "Belum tepat, silakan pilih opsi lain dan periksa kembali."}
                    </span>
                  )}
                </div>

                {isSubmitted && (
                  <div
                    className={`p-4 rounded-2xl border-2 border-[#141413] text-xs sm:text-sm leading-relaxed ${
                      isCorrectNow
                        ? "bg-[#B8F348]/25 text-[#141413]"
                        : "bg-[#FFE5E0] text-[#141413]"
                    }`}
                  >
                    <span className="font-mono font-bold text-xs uppercase block mb-1">
                      Pembahasan ({drill.competencyCode})
                    </span>
                    <p>{drill.explanation}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
