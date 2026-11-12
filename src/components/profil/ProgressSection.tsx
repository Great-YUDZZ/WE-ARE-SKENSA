"use client";

import React from "react";
import Link from "next/link";
import { FIELDS, GROUP_CONFIG } from "@/data/fields";
import { MENTOR_CURRICULUM_BY_FIELD } from "@/data/mentorCurriculum";
import type { FullLearningSnapshot } from "@/lib/learningProfile";
import { getCachedUser } from "@/lib/useAuth";
import {
  buildSurveyWorkspaceReportHtml,
  downloadHtmlFile,
} from "@/lib/test-report-download";

interface ProgressSectionProps {
  snapshot: FullLearningSnapshot;
}

export default function ProgressSection({ snapshot }: ProgressSectionProps) {
  const activeFieldEntries = Object.values(snapshot.progressByField).filter(
    (prog) => Boolean(MENTOR_CURRICULUM_BY_FIELD[prog.fieldId])
  );

  const surveyCurr = snapshot.surveyResult
    ? MENTOR_CURRICULUM_BY_FIELD[snapshot.surveyResult.fieldId]
    : null;

  return (
    <div className="space-y-6">
      {/* Survey Result Summary */}
      <section className="neo-card rounded-2xl bg-white p-5 sm:p-6 border-2 border-[#141413] shadow-[4px_4px_0px_#141413] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#141413]">
          <div>
            <span className="text-xs font-mono font-bold text-[#3B66FF] uppercase">
              Evaluasi Keminatan Terakhir
            </span>
            <h2 className="font-display font-black text-xl sm:text-2xl text-[#141413]">
              Hasil Survey &amp; Skor Dasar Kesiapan
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {snapshot.surveyResult && surveyCurr && (
              <button
                type="button"
                onClick={() => {
                  const cachedUser = getCachedUser();
                  const prog = snapshot.progressByField[snapshot.surveyResult!.fieldId] || {
                    fieldId: snapshot.surveyResult!.fieldId,
                    completedModules: [],
                    passedCertIds: [],
                    practiceNotes: {},
                  };
                  const modBonus = surveyCurr.learningModules
                    .filter((m) => prog.completedModules.includes(m.id))
                    .reduce((acc, m) => acc + m.scoreBoost, 0);
                  const certBonus = surveyCurr.certificationDrills
                    .filter((c) => prog.passedCertIds.includes(c.id))
                    .reduce((acc, c) => acc + c.scoreBoost, 0);
                  const course =
                    surveyCurr.targetCourses.find(
                      (c) => c.id === snapshot.surveyResult?.courseId
                    ) || surveyCurr.targetCourses[0];
                  const html = buildSurveyWorkspaceReportHtml({
                    curriculum: surveyCurr,
                    targetCourse: course,
                    baseScore: snapshot.surveyResult!.score,
                    moduleBonus: modBonus,
                    certBonus,
                    currentReadinessScore: Math.min(
                      99,
                      snapshot.surveyResult!.score + modBonus + certBonus
                    ),
                    dominantGroup: snapshot.surveyResult!.dominant,
                    isGroupMismatch: snapshot.surveyResult!.mismatch,
                    isPreviewMode: false,
                    progress: prog,
                    userName: cachedUser?.name,
                    userIdentifier: cachedUser?.identifier,
                  });
                  downloadHtmlFile(
                    `kertamarga-hasil-survey-${snapshot.surveyResult!.fieldId}-${new Date().toISOString().slice(0, 10)}.html`,
                    html
                  );
                }}
                className="neo-btn inline-flex items-center justify-center min-h-[42px] px-4 rounded-xl bg-[#B8F348] hover:bg-[#a8e635] border-2 border-[#141413] text-xs font-mono font-bold text-[#141413] cursor-pointer"
              >
                Unduh Hasil Survey (.html) &darr;
              </button>
            )}
            <Link
              href="/tes-keminatan"
              className="neo-btn inline-flex items-center justify-center min-h-[42px] px-4 rounded-xl bg-[#FAF7F2] hover:bg-[#B8F348]/40 border-2 border-[#141413] text-xs font-mono font-bold text-[#141413]"
            >
              {snapshot.surveyResult ? "Ulangi Survey Keminatan" : "Mulai Survey Keminatan"} &rarr;
            </Link>
          </div>
        </div>

        {snapshot.surveyResult ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8 p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-[#3B66FF] text-white border border-[#141413] font-mono font-bold text-xs">
                  Minat Alami: {GROUP_CONFIG[snapshot.surveyResult.dominant]?.label || snapshot.surveyResult.dominant}
                </span>
                {snapshot.surveyResult.mismatch && (
                  <span className="px-2.5 py-0.5 rounded-lg bg-[#FFBE2E] text-[#141413] border border-[#141413] font-mono font-bold text-xs">
                    Jalur Lintas Minat - Perlu Penguatan Modul
                  </span>
                )}
              </div>

              <h3 className="font-display font-black text-lg sm:text-xl text-[#141413]">
                {surveyCurr?.fieldName || snapshot.surveyResult.fieldId.toUpperCase()}
              </h3>
              <p className="text-xs sm:text-sm text-[#52514E] font-medium">
                Sertifikasi Target:{" "}
                <strong className="text-[#141413]">
                  {surveyCurr?.mainCertificationTitle || "Kompetensi Standar Industri"}
                </strong>
              </p>

              <div className="pt-1">
                <Link
                  href={`/hasil-analisis?field=${encodeURIComponent(snapshot.surveyResult.fieldId)}`}
                  className="neo-btn inline-flex items-center min-h-[42px] px-4 py-2 rounded-xl bg-[#B8F348] hover:bg-[#a8e635] text-[#141413] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] font-display font-bold text-xs sm:text-sm"
                >
                  Lanjutkan Belajar di Workspace &rarr;
                </Link>
              </div>
            </div>

            <div className="md:col-span-4 p-4 rounded-2xl bg-[#141413] text-white border-2 border-[#141413] space-y-2 text-center">
              <span className="text-xs font-mono font-bold text-[#B8F348] uppercase block">
                Skor Dasar Survey
              </span>
              <span className="font-display font-black text-4xl text-white block">
                {snapshot.surveyResult.score}%
              </span>
              <p className="text-[11px] text-[#F0ECE1]/80">
                Tambah hingga +25% lewat penyelesaian modul dan latihan sertifikasi.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border-2 border-dashed border-[#141413]/40 text-center space-y-3">
            <p className="font-display font-bold text-sm sm:text-base text-[#141413]">
              Anda belum menyelesaikan Survey Keminatan Penjurusan.
            </p>
            <p className="text-xs text-[#52514E] max-w-md mx-auto">
              Ikuti Kuesioner Eksplorasi atau Survey Keminatan 5 menit untuk memperoleh skor kesiapan dasar dan rekomendasi bidang yang paling sesuai.
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-1">
              <Link
                href="/eksplorasi"
                className="neo-btn px-4 py-2.5 rounded-xl bg-[#FF5E4D] text-white border-2 border-[#141413] shadow-[2px_2px_0px_#141413] font-display font-bold text-xs"
              >
                Eksplorasi Minat &rarr;
              </Link>
              <Link
                href="/tes-keminatan"
                className="neo-btn px-4 py-2.5 rounded-xl bg-[#B8F348] text-[#141413] border-2 border-[#141413] shadow-[2px_2px_0px_#141413] font-display font-bold text-xs"
              >
                Survey Keminatan &rarr;
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Active Learning & Certification Progress by Field */}
      <section className="neo-card rounded-2xl bg-white p-5 sm:p-6 border-2 border-[#141413] shadow-[4px_4px_0px_#141413] space-y-4">
        <div className="pb-3 border-b-2 border-[#141413]">
          <span className="text-xs font-mono font-bold text-[#1F7A52] uppercase">
            Rekam Jejak Belajar
          </span>
          <h2 className="font-display font-black text-xl sm:text-2xl text-[#141413]">
            Progres Modul &amp; Sertifikasi Kompetensi
          </h2>
          <p className="text-xs text-[#52514E] font-medium mt-0.5">
            Akumulasi modul yang sudah dituntaskan, poin kesiapan tambahan, dan unit sertifikasi BNSP/industri yang lulus uji.
          </p>
        </div>

        {activeFieldEntries.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border-2 border-dashed border-[#141413]/40 text-center space-y-2.5">
            <p className="font-display font-bold text-sm sm:text-base text-[#141413]">
              Belum ada progres modul atau tes sertifikasi yang tercatat.
            </p>
            <p className="text-xs text-[#52514E] max-w-md mx-auto">
              Mulai pelajari salah satu dari 11 bidang di bawah ini dan tandai modul selesai untuk mengumpulkan poin kesiapan.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeFieldEntries.map((prog) => {
              const curriculum = MENTOR_CURRICULUM_BY_FIELD[prog.fieldId];
              const totalModules = curriculum.learningModules.length;
              const totalCerts = curriculum.certificationDrills.length;
              const doneMods = prog.completedModules.length;
              const doneCerts = prog.passedCertIds.length;
              const practiceCount = Object.keys(prog.practiceNotes || {}).length;

              const modBoost = curriculum.learningModules
                .filter((m) => prog.completedModules.includes(m.id))
                .reduce((acc, m) => acc + m.scoreBoost, 0);
              const certBoost = curriculum.certificationDrills
                .filter((c) => prog.passedCertIds.includes(c.id))
                .reduce((acc, c) => acc + c.scoreBoost, 0);

              const pctModules =
                totalModules > 0 ? Math.round((doneMods / totalModules) * 100) : 0;

              return (
                <div
                  key={prog.fieldId}
                  className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#3B66FF] text-white border border-[#141413] font-mono font-bold text-[11px] inline-block mb-1">
                        {GROUP_CONFIG[curriculum.group]?.label || curriculum.group}
                      </span>
                      <h3 className="font-display font-black text-lg text-[#141413]">
                        {curriculum.fieldName}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {prog.verification && (
                        <span
                          className={`px-3 py-1 rounded-xl border border-[#141413] font-mono font-bold text-xs ${
                            prog.verification.status === "passed"
                              ? "bg-[#3B66FF] text-white"
                              : "bg-[#FFBE2E] text-[#141413]"
                          }`}
                        >
                          {prog.verification.status === "passed"
                            ? `Terverifikasi AI (${prog.verification.score}%)`
                            : `Evaluasi AI (${prog.verification.score}%)`}
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-xl bg-[#B8F348] border border-[#141413] font-mono font-bold text-xs text-[#141413]">
                        Total Bonus: +{modBoost + certBoost}%
                      </span>
                      <Link
                        href={`/hasil-analisis?field=${encodeURIComponent(prog.fieldId)}&preview=1`}
                        className="neo-btn px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#B8F348]/40 border-2 border-[#141413] text-xs font-mono font-bold text-[#141413]"
                      >
                        Buka Workspace &rarr;
                      </Link>
                    </div>
                  </div>

                  {/* Progress Bars */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-white border border-[#141413]/30 space-y-1.5">
                      <div className="flex justify-between font-bold text-[#141413]">
                        <span>Modul Materi</span>
                        <span>
                          {doneMods}/{totalModules} ({pctModules}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-[#FAF7F2] border border-[#141413] overflow-hidden">
                        <div
                          className="h-full bg-[#B8F348]"
                          style={{ width: `${Math.min(100, pctModules)}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-[#141413]/30 space-y-1">
                      <span className="font-bold text-[#52514E] block">Sertifikasi Kompeten</span>
                      <span className="font-display font-black text-base text-[#3B66FF]">
                        {doneCerts}/{totalCerts} Unit Lulus
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-[#141413]/30 space-y-1">
                      <span className="font-bold text-[#52514E] block">Catatan Praktik</span>
                      <span className="font-display font-black text-base text-[#141413]">
                        {practiceCount} Modul Terisi
                      </span>
                    </div>
                  </div>

                  {prog.verification && (
                    <div
                      className={`p-3.5 rounded-xl border-2 border-[#141413] text-xs space-y-1.5 ${
                        prog.verification.status === "passed"
                          ? "bg-[#3B66FF]/10"
                          : "bg-[#FFBE2E]/20"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 font-mono font-bold text-[#141413]">
                        <span>
                          Verifikasi Pemahaman Kemampuan ({prog.verification.status === "passed" ? "Lulus Terverifikasi" : "Perlu Pendalaman"})
                        </span>
                        <span>
                          Skor: {prog.verification.score}% ({prog.verification.correctCount}/{prog.verification.totalQuestions}) &bull; Percobaan #{prog.verification.attemptCount}
                        </span>
                      </div>
                      {prog.verification.summary && (
                        <p className="text-[#141413] leading-relaxed">
                          {prog.verification.summary}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Completed Modules & Passed Certs Pills */}
                  {(doneMods > 0 || doneCerts > 0) && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {curriculum.learningModules
                        .filter((m) => prog.completedModules.includes(m.id))
                        .map((m) => (
                          <span
                            key={m.id}
                            className="px-2.5 py-1 rounded-lg bg-white border border-[#141413] text-[11px] font-bold text-[#141413]"
                          >
                            Modul Selesai: {m.moduleCode || m.title}
                          </span>
                        ))}
                      {curriculum.certificationDrills
                        .filter((c) => prog.passedCertIds.includes(c.id))
                        .map((c) => (
                          <span
                            key={c.id}
                            className="px-2.5 py-1 rounded-lg bg-[#3B66FF]/10 border border-[#3B66FF] text-[11px] font-mono font-bold text-[#3B66FF]"
                          >
                            Lulus: {c.competencyCode} ({c.certName})
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Launch Across All 11 Fields */}
        <div className="pt-2 space-y-3">
          <h3 className="font-display font-bold text-sm sm:text-base text-[#141413]">
            Jelajahi &amp; Pelajari Bidang Lain (11 Bidang KertaMarga)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {FIELDS.map((field) => {
              const hasActivity = Boolean(snapshot.progressByField[field.id]);
              return (
                <Link
                  key={field.id}
                  href={`/hasil-analisis?field=${encodeURIComponent(field.id)}&preview=1`}
                  className={`p-3 rounded-xl border-2 border-[#141413] flex items-center justify-between gap-2 transition-colors ${
                    hasActivity
                      ? "bg-[#B8F348]/25 hover:bg-[#B8F348]/40"
                      : "bg-[#FAF7F2] hover:bg-white"
                  }`}
                >
                  <div className="min-w-0">
                    <span className="font-display font-bold text-xs sm:text-sm text-[#141413] block truncate">
                      {field.name}
                    </span>
                    <span className="text-[10px] font-mono text-[#52514E]">
                      {GROUP_CONFIG[field.group]?.label || field.group}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#3B66FF] shrink-0">
                    Buka &rarr;
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
