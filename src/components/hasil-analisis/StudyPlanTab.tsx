"use client";

import React from "react";
import type { FieldCurriculum, TargetCourse } from "@/data/mentorCurriculum";

interface StudyPlanTabProps {
  curriculum: FieldCurriculum;
  targetCourse: TargetCourse;
  currentReadinessScore: number;
  onSelectCourse: (courseId: string) => void;
  onGoToModules: () => void;
  onGoToCertification: () => void;
}

export default function StudyPlanTab({
  curriculum,
  targetCourse,
  currentReadinessScore,
  onSelectCourse,
  onGoToModules,
  onGoToCertification,
}: StudyPlanTabProps) {
  return (
    <div className="neo-card rounded-2xl bg-white p-5 sm:p-7 border-2 border-[#141413] shadow-[4px_4px_0px_#141413] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-[#141413]">
        <div>
          <span className="text-xs font-mono font-bold text-[#1F7A52] uppercase tracking-wider">
            Rencana Belajar Terarah
          </span>
          <h2 className="font-display font-black text-xl sm:text-2xl text-[#141413] mt-0.5">
            4 Langkah Penguatan: {targetCourse.name}
          </h2>
          <p className="text-xs sm:text-sm text-[#52514E] mt-1 font-medium">
            Ikuti tahapan berikut secara berurutan untuk menutup selisih nilai dan menyiapkan diri menuju sertifikasi {curriculum.certificationBody}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onGoToModules}
            className="neo-btn min-h-[44px] px-4 rounded-xl bg-[#3B66FF] hover:bg-[#2F55DF] text-white border-2 border-[#141413] shadow-[3px_3px_0px_#141413] font-display font-bold text-xs sm:text-sm cursor-pointer"
          >
            Buka Modul &amp; Materi &rarr;
          </button>
          <button
            type="button"
            onClick={onGoToCertification}
            className="neo-btn min-h-[44px] px-4 rounded-xl bg-[#B8F348] hover:bg-[#a8e635] text-[#141413] border-2 border-[#141413] font-display font-bold text-xs sm:text-sm cursor-pointer"
          >
            Tes Sertifikasi
          </button>
        </div>
      </div>

      {/* 2x2 Grid of Remedial Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {curriculum.remedialActionPlan.map((step) => (
          <div
            key={step.stepNumber}
            className="p-5 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[#3B66FF] text-white border border-[#141413]">
                  Langkah {step.stepNumber}
                </span>
                <span className="text-xs font-mono font-bold text-[#52514E]">
                  {step.phase}
                </span>
              </div>
              <h3 className="font-display font-black text-base text-[#141413]">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#52514E] mt-1.5 leading-relaxed font-medium">
                {step.action}
              </p>
            </div>

            <div className="pt-3 border-t-2 border-[#141413]/20 text-xs">
              <span className="font-mono font-bold text-[#1F7A52] block uppercase">
                Target Capaian
              </span>
              <span className="text-[#141413] font-semibold mt-0.5 block">
                {step.targetOutcome}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Target Courses Selector */}
      <div className="p-5 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] space-y-3">
        <div>
          <span className="text-xs font-mono font-bold text-[#141413] uppercase block">
            Daftar Mata Kuliah Inti Jurusan
          </span>
          <p className="text-xs text-[#52514E] mt-0.5">
            Klik salah satu kartu mata kuliah untuk mengganti fokus target belajar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {curriculum.targetCourses.map((c) => {
            const isSelected = c.id === targetCourse.id;
            const meetsCourse = currentReadinessScore >= c.minScore;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectCourse(c.id)}
                className={`text-left p-4 rounded-2xl border-2 border-[#141413] transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isSelected
                    ? "bg-[#B8F348] shadow-[4px_4px_0px_#141413]"
                    : "bg-white hover:bg-[#F0ECE1]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="font-bold text-[#141413]">
                      {c.code} &bull; {c.sks} SKS
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-lg font-bold border border-[#141413] ${
                        meetsCourse
                          ? "bg-white text-[#1F7A52]"
                          : "bg-[#FF5E4D] text-white"
                      }`}
                    >
                      Min. {c.minScore}%
                    </span>
                  </div>
                  <h4 className="font-display font-black text-sm text-[#141413]">
                    {c.name}
                  </h4>
                  <p className="text-xs text-[#52514E] mt-1 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                {c.certificationAlignment && (
                  <div className="pt-2 border-t border-[#141413]/20 text-xs font-mono font-bold text-[#141413]">
                    Sertifikasi: {c.certificationAlignment}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
