"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FIELDS, GROUP_CONFIG, FieldGroup } from "@/data/fields";
import type { FieldCurriculum, TargetCourse } from "@/data/mentorCurriculum";
import type { FieldVerificationResult } from "@/lib/learningProfile";

export type WorkspaceTabId =
  | "rencana"
  | "materi"
  | "pustaka"
  | "sertifikasi"
  | "verifikasi";

interface WorkspaceHeaderProps {
  targetFieldId: string;
  onChangeField: (fieldId: string) => void;
  targetCourse: TargetCourse;
  onChangeCourse: (courseId: string) => void;
  curriculum: FieldCurriculum;
  baseScore: number;
  moduleBonus: number;
  certBonus: number;
  currentReadinessScore: number;
  scoreGap: number;
  isNowReady: boolean;
  isGroupMismatch: boolean;
  dominantGroup: FieldGroup;
  activeTab: WorkspaceTabId;
  onChangeTab: (tab: WorkspaceTabId) => void;
  pustakaCount: number;
  passedCertCount: number;
  completedModuleCount: number;
  isVerificationUnlocked: boolean;
  verificationResult?: FieldVerificationResult;
  onDownloadReport?: () => void;
  onPrintReport?: () => void;
}

export default function WorkspaceHeader({
  targetFieldId,
  onChangeField,
  targetCourse,
  onChangeCourse,
  curriculum,
  baseScore,
  moduleBonus,
  certBonus,
  currentReadinessScore,
  scoreGap,
  isNowReady,
  isGroupMismatch,
  dominantGroup,
  activeTab,
  onChangeTab,
  pustakaCount,
  passedCertCount,
  completedModuleCount,
  isVerificationUnlocked,
  verificationResult,
  onDownloadReport,
  onPrintReport,
}: WorkspaceHeaderProps) {
  const tabs: { id: WorkspaceTabId; label: string; badge?: string }[] = [
    {
      id: "rencana",
      label: "Rencana Belajar",
      badge: `${curriculum.remedialActionPlan.length} Langkah`,
    },
    {
      id: "materi",
      label: "Modul & Materi",
      badge: `${completedModuleCount}/${curriculum.learningModules.length}`,
    },
    {
      id: "pustaka",
      label: "Pustaka PDF",
      badge: `${pustakaCount} PDF`,
    },
    {
      id: "sertifikasi",
      label: "Tes Sertifikasi",
      badge: `${passedCertCount}/${curriculum.certificationDrills.length}`,
    },
    {
      id: "verifikasi",
      label: "Verifikasi Kemampuan",
      badge:
        verificationResult?.status === "passed"
          ? `Lulus ${verificationResult.score}%`
          : isVerificationUnlocked
          ? "Siap Diuji"
          : "Terkunci",
    },
  ];

  return (
    <section className="space-y-4">
      {/* Compact Breadcrumb & Survey Action */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-[#52514E]"
        >
          <Link href="/" className="hover:text-[#141413] transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link
            href={`/tes-keminatan?field=${encodeURIComponent(targetFieldId)}`}
            className="hover:text-[#141413] transition-colors"
          >
            Survey Keminatan
          </Link>
          <span>/</span>
          <span className="text-[#141413]">Modul &amp; Sertifikasi</span>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          {onDownloadReport && (
            <button
              type="button"
              onClick={onDownloadReport}
              className="neo-btn inline-flex items-center min-h-[44px] px-4 rounded-xl bg-[#FAF7F2] border-2 border-[#141413] hover:bg-[#FFBE2E]/40 text-xs font-mono font-bold text-[#141413] cursor-pointer"
            >
              Unduh Hasil Survey (.html) &darr;
            </button>
          )}
          {onPrintReport && (
            <button
              type="button"
              onClick={onPrintReport}
              className="neo-btn inline-flex items-center min-h-[44px] px-3.5 rounded-xl bg-white border-2 border-[#141413] hover:bg-[#FAF7F2] text-xs font-mono font-bold text-[#141413] cursor-pointer"
            >
              Cetak PDF
            </button>
          )}
          <Link
            href="/profil"
            className="neo-btn inline-flex items-center min-h-[44px] px-4 rounded-xl bg-[#B8F348] border-2 border-[#141413] hover:bg-[#a8e635] text-xs font-mono font-bold text-[#141413]"
          >
            Profil &amp; Catatan Belajar
          </Link>
          <Link
            href={`/tes-keminatan?field=${encodeURIComponent(targetFieldId)}`}
            className="neo-btn inline-flex items-center min-h-[44px] px-4 rounded-xl bg-white border-2 border-[#141413] hover:bg-[#FAF7F2] text-xs font-mono font-bold text-[#141413]"
          >
            Ulangi / Ubah Survey &rarr;
          </Link>
        </div>
      </div>

      {/* Unified Compact Header Bar: Switcher + Readiness Score */}
      <div className="neo-card rounded-2xl bg-white p-4 sm:p-5 border-2 border-[#141413] shadow-[4px_4px_0px_#141413]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Left 7 Cols: Title, Status, and Quick Switcher */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold border border-[#141413] ${
                  isNowReady
                    ? "bg-[#B8F348] text-[#141413]"
                    : "bg-[#FFBE2E] text-[#141413]"
                }`}
              >
                {isNowReady
                  ? "Siap Mengikuti Standar Jurusan"
                  : `Perlu Penguatan +${scoreGap} Poin`}
              </span>

              {isGroupMismatch && (
                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-mono font-bold bg-[#FAF7F2] text-[#141413] border border-[#141413]">
                  Minat Alami: {GROUP_CONFIG[dominantGroup].label}
                </span>
              )}
            </div>

            <div>
              <h1 className="font-display font-black text-xl sm:text-2xl text-[#141413] leading-snug">
                {curriculum.fieldName}
              </h1>
              <p className="text-xs sm:text-sm text-[#52514E] font-medium mt-1">
                Fokus: <strong className="text-[#141413]">{targetCourse.code} - {targetCourse.name}</strong> &bull;
                Sertifikasi: {targetCourse.certificationAlignment || curriculum.mainCertificationTitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label className="block space-y-1 min-w-0">
                <span className="text-xs font-mono font-bold text-[#52514E] block">
                  Jurusan Tujuan
                </span>
                <select
                  value={targetFieldId}
                  onChange={(e) => onChangeField(e.target.value)}
                  className="w-full min-h-[44px] px-3 pr-8 rounded-xl bg-[#FAF7F2] border-2 border-[#141413] text-xs sm:text-sm font-bold text-[#141413] truncate focus:outline-none focus:ring-2 focus:ring-[#3B66FF] cursor-pointer"
                >
                  {FIELDS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({GROUP_CONFIG[f.group].label})
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-1 min-w-0">
                <span className="text-xs font-mono font-bold text-[#52514E] block">
                  Mata Kuliah Fokus
                </span>
                <select
                  value={targetCourse.id}
                  onChange={(e) => onChangeCourse(e.target.value)}
                  className="w-full min-h-[44px] px-3 pr-8 rounded-xl bg-[#FAF7F2] border-2 border-[#141413] text-xs sm:text-sm font-bold text-[#141413] truncate focus:outline-none focus:ring-2 focus:ring-[#3B66FF] cursor-pointer"
                >
                  {curriculum.targetCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.name} (Min. {c.minScore}%)
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Right 5 Cols: Compact Dynamic Score Gauge */}
          <div className="lg:col-span-5 p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] space-y-3">
            <div className="flex items-end justify-between gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-[#52514E] block">
                  Skor Kesiapan Anda
                </span>
                <span className="font-display font-black text-3xl sm:text-4xl text-[#141413]">
                  {currentReadinessScore}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-[#52514E] block">
                  Target Matkul
                </span>
                <span className="font-display font-black text-lg text-[#3B66FF]">
                  {targetCourse.minScore}%
                </span>
              </div>
            </div>

            <div className="w-full h-3 bg-white rounded-full border-2 border-[#141413] overflow-hidden relative">
              <motion.div
                className={`h-full ${
                  isNowReady ? "bg-[#B8F348]" : "bg-[#FFBE2E]"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, currentReadinessScore)}%` }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#52514E]">
              <span>Survey: {baseScore}%</span>
              <span className="text-[#1F7A52] font-bold">
                Modul: +{moduleBonus}%
              </span>
              <span className="text-[#3B66FF] font-bold">
                Sertifikasi: +{certBonus}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Clean 5-Tab Workspace Navigation */}
      <div
        role="tablist"
        aria-label="Navigasi Workspace Modul dan Sertifikasi"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChangeTab(tab.id)}
              className={`min-h-[48px] px-4 py-2.5 rounded-xl border-2 border-[#141413] font-display font-bold text-xs sm:text-sm flex items-center justify-between gap-2 transition-all cursor-pointer ${
                isActive
                  ? "bg-[#141413] text-[#B8F348] shadow-[3px_3px_0px_#3B66FF]"
                  : "bg-white text-[#141413] hover:bg-[#FAF7F2]"
              }`}
            >
              <span className="truncate">{tab.label}</span>
              {tab.badge && (
                <span
                  className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold shrink-0 ${
                    isActive
                      ? "bg-[#B8F348] text-[#141413]"
                      : "bg-[#FAF7F2] text-[#52514E] border border-[#141413]/30"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
