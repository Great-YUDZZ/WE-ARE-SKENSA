"use client";

import React from "react";
import type { FieldCurriculum, LearningModule } from "@/data/mentorCurriculum";
import { getMasterclassContentForModule } from "@/data/moduleMasterclassExtension";

interface ModulesTabProps {
  curriculum: FieldCurriculum;
  filteredModules: LearningModule[];
  selectedModuleFilter: string;
  onChangeFilter: (filterId: string) => void;
  onSelectCourse: (courseId: string) => void;
  expandedModuleId: string;
  onToggleExpand: (moduleId: string) => void;
  completedModules: string[];
  onToggleCompleteModule: (moduleId: string, title: string, boost: number) => void;
  modulePracticeNotes: Record<string, string>;
  onChangePracticeNote: (moduleId: string, note: string) => void;
  inlinePdfModuleId: string;
  onToggleInlinePdf: (moduleId: string) => void;
  onAskMentorAboutModule: (moduleTitle: string, courseName: string) => void;
  onGoToPustaka: () => void;
  onGoToCertification: () => void;
  pustakaCount: number;
}

export default function ModulesTab({
  curriculum,
  filteredModules,
  selectedModuleFilter,
  onChangeFilter,
  onSelectCourse,
  expandedModuleId,
  onToggleExpand,
  completedModules,
  onToggleCompleteModule,
  modulePracticeNotes,
  onChangePracticeNote,
  inlinePdfModuleId,
  onToggleInlinePdf,
  onAskMentorAboutModule,
  onGoToPustaka,
  onGoToCertification,
  pustakaCount,
}: ModulesTabProps) {
  return (
    <div className="neo-card rounded-2xl bg-white p-5 sm:p-7 border-2 border-[#141413] shadow-[4px_4px_0px_#141413] space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-[#141413]">
        <div>
          <span className="text-xs font-mono font-bold text-[#3B66FF] uppercase tracking-wider">
            Kurikulum Modul Masterclass
          </span>
          <h2 className="font-display font-black text-xl sm:text-2xl text-[#141413] mt-0.5">
            Modul Keahlian: {curriculum.fieldName}
          </h2>
          <p className="text-xs sm:text-sm text-[#52514E] mt-1 font-medium">
            Pelajari materi teknis mendalam, referensi praktisi, lampiran PDF, dan tugas praktik untuk menaikkan skor kesiapan Anda.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onGoToPustaka}
            className="neo-btn min-h-[44px] px-4 rounded-xl bg-[#FAF7F2] border-2 border-[#141413] hover:bg-[#F0ECE1] text-[#141413] font-mono font-bold text-xs cursor-pointer"
          >
            Pustaka PDF ({pustakaCount})
          </button>
          <button
            type="button"
            onClick={onGoToCertification}
            className="neo-btn min-h-[44px] px-4 rounded-xl bg-[#B8F348] hover:bg-[#a8e635] text-[#141413] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] font-display font-bold text-xs sm:text-sm cursor-pointer"
          >
            Tes Sertifikasi &rarr;
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono font-bold text-[#52514E] mr-1">
          Filter Matkul:
        </span>
        <button
          type="button"
          onClick={() => onChangeFilter("ALL")}
          className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border-2 border-[#141413] transition-all cursor-pointer ${
            selectedModuleFilter === "ALL"
              ? "bg-[#3B66FF] text-white shadow-[2px_2px_0px_#141413]"
              : "bg-[#FAF7F2] text-[#52514E] hover:bg-[#F0ECE1] hover:text-[#141413]"
          }`}
        >
          Semua ({curriculum.learningModules.length})
        </button>
        {curriculum.targetCourses.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              onSelectCourse(c.id);
              onChangeFilter(c.id);
            }}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border-2 border-[#141413] transition-all cursor-pointer ${
              selectedModuleFilter === c.id
                ? "bg-[#3B66FF] text-white shadow-[2px_2px_0px_#141413]"
                : "bg-[#FAF7F2] text-[#52514E] hover:bg-[#F0ECE1] hover:text-[#141413]"
            }`}
          >
            {c.code}
          </button>
        ))}
      </div>

      {/* Module Accordion List */}
      <div className="space-y-4">
        {filteredModules.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] text-center space-y-3">
            <p className="font-display font-bold text-sm sm:text-base text-[#141413]">
              Belum ada modul spesifik untuk filter mata kuliah ini.
            </p>
            <button
              type="button"
              onClick={() => onChangeFilter("ALL")}
              className="neo-btn px-4 py-2 rounded-xl bg-[#B8F348] text-[#141413] border-2 border-[#141413] font-mono font-bold text-xs cursor-pointer"
            >
              Tampilkan Semua Modul ({curriculum.learningModules.length})
            </button>
          </div>
        ) : (
        filteredModules.map((mod, idx) => {
          const isCompleted = completedModules.includes(mod.id);
          const isExpanded = expandedModuleId === mod.id;
          const masterclass = getMasterclassContentForModule(mod);
          const isPdfPreviewOpen = inlinePdfModuleId === mod.id;

          return (
            <div
              key={mod.id}
              className={`rounded-2xl border-2 border-[#141413] transition-all overflow-hidden ${
                isCompleted
                  ? "bg-[#B8F348]/15 shadow-[4px_4px_0px_#141413]"
                  : "bg-[#FAF7F2] shadow-[3px_3px_0px_#141413]"
              }`}
            >
              {/* Module Header */}
              <button
                type="button"
                onClick={() => onToggleExpand(isExpanded ? "" : mod.id)}
                className="w-full text-left p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-white/70 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#3B66FF] text-white border border-[#141413] font-bold">
                      {mod.moduleCode ? mod.moduleCode : `MODUL 0${idx + 1}`} &bull;{" "}
                      {mod.level.toUpperCase()}
                    </span>
                    {mod.semesterStage && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#FFBE2E] text-[#141413] border border-[#141413] font-bold">
                        {mod.semesterStage}
                      </span>
                    )}
                    <span className="text-[#52514E] font-bold">
                      {mod.courseName} &bull; {mod.duration}
                    </span>
                  </div>
                  <h3 className="font-display font-black text-base sm:text-lg text-[#141413]">
                    {mod.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border-2 border-[#141413] ${
                      isCompleted
                        ? "bg-[#B8F348] text-[#141413]"
                        : "bg-[#FFBE2E] text-[#141413]"
                    }`}
                  >
                    {isCompleted
                      ? `Selesai (+${mod.scoreBoost}%)`
                      : `+${mod.scoreBoost}% Skor`}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#141413]">
                    {isExpanded ? "Tutup" : "Buka"}
                  </span>
                </div>
              </button>

              {/* Expanded Module Body */}
              {isExpanded && (
                <div className="p-5 pt-4 border-t-2 border-[#141413] space-y-5 bg-white">
                  <p className="text-xs sm:text-sm text-[#52514E] leading-relaxed font-medium">
                    {mod.summary}
                  </p>

                  {/* Key Concepts */}
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413]">
                    <span className="text-xs font-mono font-bold text-[#3B66FF] uppercase block mb-2">
                      Konsep Inti yang Wajib Dikuasai
                    </span>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-[#141413]">
                      {mod.keyConcepts.map((kc, kIdx) => (
                        <li key={kIdx} className="flex items-start gap-2">
                          <span className="font-mono font-bold text-[#3B66FF]">
                            {kIdx + 1}.
                          </span>
                          <span>{kc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Multi-Chapter Masterclass Deep Dive */}
                  {masterclass.deepDiveChapters.map((ch, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] space-y-3"
                    >
                      <span className="text-xs font-mono font-bold text-[#1F7A52] uppercase block">
                        {ch.chapterTitle}
                      </span>
                      <div className="space-y-3 text-xs sm:text-sm text-[#141413] leading-relaxed">
                        {ch.paragraphs.map((pText, pIdx) => (
                          <p key={pIdx}>{pText}</p>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Technical Reference Code / Formulas / SOP Block */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#141413] text-[#FAF7F2] border-2 border-[#141413] space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-[#B8F348] uppercase">
                        Bab III: {masterclass.technicalReferenceTitle}
                      </span>
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-white/10 text-white/90">
                        Referensi Teknis &amp; Rumus Praktisi
                      </span>
                    </div>
                    <pre className="text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap text-[#E6ECF5] pt-1">
                      {masterclass.technicalReferenceCode}
                    </pre>
                  </div>

                  {/* Step-by-Step Professional Implementation Roadmap */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] space-y-3">
                    <span className="text-xs font-mono font-bold text-[#3B66FF] uppercase block">
                      Bab IV: Tahapan Langkah Kerja Profesional
                    </span>
                    <div className="space-y-2.5">
                      {masterclass.professionalWorkflowSteps.map((stepText, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-3 rounded-xl bg-white border-2 border-[#141413] flex items-start gap-3 text-xs sm:text-sm text-[#141413]"
                        >
                          <span className="w-6 h-6 rounded-lg bg-[#3B66FF] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-[#141413]">
                            0{sIdx + 1}
                          </span>
                          <span className="leading-relaxed">{stepText}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Common Pitfalls vs Certified Expert Best Practices */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] space-y-3">
                    <span className="text-xs font-mono font-bold text-[#FF5E4D] uppercase block">
                      Bab V: Kesalahan Umum vs Solusi Praktisi
                    </span>
                    <div className="grid grid-cols-1 gap-3">
                      {masterclass.pitfallComparisons.map((pit, pIdx) => (
                        <div
                          key={pIdx}
                          className="p-3.5 rounded-xl bg-white border-2 border-[#141413] grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm"
                        >
                          <div className="space-y-1">
                            <span className="font-mono font-bold text-xs text-[#FF5E4D] uppercase block">
                              Kesalahan #{pIdx + 1}
                            </span>
                            <p className="text-[#141413] leading-relaxed">
                              {pit.mistake}
                            </p>
                          </div>
                          <div className="space-y-1 md:border-l-2 md:pl-3 border-[#141413]">
                            <span className="font-mono font-bold text-xs text-[#1F7A52] uppercase block">
                              Standar Praktisi
                            </span>
                            <p className="text-[#141413] leading-relaxed">
                              {pit.expertSolution}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Attached PDF Handbook (clean student-facing view) */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#3B66FF]/10 border-2 border-[#141413] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-[#3B66FF] text-white border border-[#141413] inline-block">
                          Lampiran Modul PDF
                        </span>
                        <h4 className="font-display font-black text-sm sm:text-base text-[#141413]">
                          {masterclass.attachedPdf.title}
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => onToggleInlinePdf(mod.id)}
                          className="neo-btn min-h-[44px] px-4 py-2 rounded-xl bg-[#3B66FF] hover:bg-[#2F55DF] text-white border-2 border-[#141413] shadow-[2px_2px_0px_#141413] font-mono font-bold text-xs cursor-pointer"
                        >
                          {isPdfPreviewOpen
                            ? "Tutup Pratinjau PDF"
                            : "Baca PDF di Sini"}
                        </button>
                        <a
                          href={masterclass.attachedPdf.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={masterclass.attachedPdf.filename}
                          className="neo-btn inline-flex items-center min-h-[44px] px-4 py-2 rounded-xl bg-white border-2 border-[#141413] hover:bg-[#FAF7F2] text-[#141413] font-mono font-bold text-xs"
                        >
                          Unduh PDF &rarr;
                        </a>
                      </div>
                    </div>

                    {isPdfPreviewOpen && (
                      <div className="pt-2">
                        <iframe
                          src={masterclass.attachedPdf.fileUrl}
                          title={masterclass.attachedPdf.title}
                          className="w-full h-[380px] sm:h-[520px] rounded-xl border-2 border-[#141413] bg-white"
                        />
                      </div>
                    )}
                  </div>

                  {/* External Reference Resources */}
                  {mod.referenceResources && mod.referenceResources.length > 0 && (
                    <div className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] space-y-2">
                      <span className="text-xs font-mono font-bold text-[#1F7A52] uppercase block">
                        Referensi Belajar Resmi
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {mod.referenceResources.map((refItem, rIdx) => (
                          <a
                            key={rIdx}
                            href={refItem.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 min-h-[40px] px-3 py-1.5 rounded-xl bg-white border-2 border-[#141413] hover:bg-[#B8F348]/25 text-xs font-bold text-[#141413] transition-colors"
                          >
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#3B66FF] text-white">
                              {refItem.provider}
                            </span>
                            <span>{refItem.title} &rarr;</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Practice Exercise Input */}
                  <div className="p-4 rounded-2xl bg-[#FFBE2E]/20 border-2 border-[#141413] space-y-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#141413] uppercase block">
                        Tugas Praktik Mandiri
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-[#141413] mt-1">
                        {mod.practiceTask}
                      </p>
                    </div>

                    <textarea
                      rows={2}
                      value={modulePracticeNotes[mod.id] || ""}
                      onChange={(e) => onChangePracticeNote(mod.id, e.target.value)}
                      placeholder="Tuliskan catatan jawaban atau langkah praktik Anda di sini..."
                      className="w-full p-3 rounded-xl bg-white border-2 border-[#141413] text-xs sm:text-sm text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#3B66FF]"
                    />

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => onAskMentorAboutModule(mod.title, mod.courseName)}
                        className="min-h-[44px] text-xs font-mono font-bold text-[#3B66FF] hover:underline cursor-pointer"
                      >
                        Diskusikan Materi Ini dengan AI Pembimbing &rarr;
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onToggleCompleteModule(mod.id, mod.title, mod.scoreBoost)
                        }
                        className={`neo-btn min-h-[44px] px-5 rounded-xl border-2 border-[#141413] shadow-[3px_3px_0px_#141413] font-display font-bold text-xs sm:text-sm cursor-pointer ${
                          isCompleted
                            ? "bg-[#B8F348] text-[#141413]"
                            : "bg-[#FFBE2E] hover:bg-[#f2b329] text-[#141413]"
                        }`}
                      >
                        {isCompleted
                          ? "Modul Telah Selesai (Klik untuk Batal)"
                          : `Tandai Selesai (+${mod.scoreBoost}% Skor)`}
                      </button>
                    </div>
                  </div>
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
