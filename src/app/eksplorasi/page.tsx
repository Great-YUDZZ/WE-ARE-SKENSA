"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import LoginModal from "@/components/LoginModal";
import LocationOriginControl from "@/components/LocationOriginControl";
import PdfExportGateModal, {
  type PdfGateReason,
} from "@/components/PdfExportGateModal";
import { formatOriginLabel } from "@/data/catalog";
import { BASE_QUESTIONS, ADAPTIVE_BRANCH_QUESTIONS, AssessmentQuestion } from "@/data/questions";
import { type AssessmentAnalysisResult } from "@/lib/scoring";
import { useBaliLocation } from "@/lib/useBaliLocation";
import { useAuth } from "@/lib/useAuth";
import {
  buildExplorationReportHtml,
  openPrintableReport,
} from "@/lib/test-report-download";
import {
  saveExplorationResultToStorage,
  type ExplorationQuizAnswerItem,
} from "@/lib/learningProfile";

export default function EksplorasiPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [pdfGateReason, setPdfGateReason] = useState<PdfGateReason>(null);
  const [dismissedGuestNotice, setDismissedGuestNotice] = useState(false);

  // Step state: 1 = Profil & Persetujuan, 2 = Kuesioner, 3 = Hasil Rekomendasi
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Profile data
  const [educationLevel, setEducationLevel] = useState<"SMP" | "SMA" | "SMK" | "Lainnya">("SMP");
  const {
    origin,
    isDetecting,
    isGeocoding,
    locationNote,
    setManualKabupaten,
    setManualAddress,
    detectLocation,
  } = useBaliLocation();

  // Questionnaire state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [activeBranchId, setActiveBranchId] = useState<string | null>(null);
  const [openEndedText, setOpenEndedText] = useState<string>("");

  // Priority Weights
  const [matchWeight, setMatchWeight] = useState<number>(80);
  const [distanceWeight, setDistanceWeight] = useState<number>(50);
  const [costWeight, setCostWeight] = useState<number>(65);

  // Results & UI State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [assessmentError, setAssessmentError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AssessmentAnalysisResult | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Restore state from sessionStorage on mount if exists
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("km_assessment_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.educationLevel) setEducationLevel(parsed.educationLevel);
        const hasLocationStorage = sessionStorage.getItem("kertamarga_user_location");
        if (!hasLocationStorage && parsed.selectedKabupaten) {
          setManualKabupaten(parsed.selectedKabupaten);
        }
      }
    } catch {
      // Ignore session storage errors
    }
  }, [setManualKabupaten]);

  // Save state to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(
        "km_assessment_state",
        JSON.stringify({ answers, educationLevel, selectedKabupaten: origin.kabupaten })
      );
    } catch {
      // Ignore
    }
  }, [answers, educationLevel, origin.kabupaten]);

  const handleDetectLocation = async () => {
    const outcome = await detectLocation();
    triggerToast(outcome.message);
  };

  // Run calculation via backend API (/api/assessment/analyze)
  const [activePresetId, setActivePresetId] = useState<string>("seimbang");
  const [showManualSliders, setShowManualSliders] = useState<boolean>(false);

  const runAssessmentCalculation = async (customWeights?: {
    matchWeight: number;
    distanceWeight: number;
    costWeight: number;
  }) => {
    const w = customWeights || { matchWeight, distanceWeight, costWeight };
    setIsLoading(true);
    setAssessmentError(null);
    setCurrentStep(3);

    try {
      const res = await fetch("/api/assessment/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentEducation: educationLevel,
          homeKabupaten: origin.kabupaten,
          homeCoords: origin.coords,
          selectedAnswers: answers,
          openEndedReflection: openEndedText,
          weights: w,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data || !Array.isArray(data.topRecommendations)) {
        throw new Error(data?.error || "Gagal menghitung rekomendasi dari server.");
      }

      const typedResult = data as AssessmentAnalysisResult;
      setAnalysisResult(typedResult);

      const allQuestions: AssessmentQuestion[] = [
        ...BASE_QUESTIONS,
        ...Object.values(ADAPTIVE_BRANCH_QUESTIONS),
      ];
      const answersSummary: ExplorationQuizAnswerItem[] = [];
      for (const q of allQuestions) {
        const chosenOptId = answers[q.id];
        if (!chosenOptId) continue;
        const chosenOpt = q.options.find((o) => o.id === chosenOptId);
        if (chosenOpt) {
          answersSummary.push({
            questionId: q.id,
            prompt: q.title,
            answerLabel: chosenOpt.text,
          });
        }
      }

      saveExplorationResultToStorage({
        educationLevel,
        originLabel: formatOriginLabel(origin),
        weights: w,
        totalQuestionsAnswered: typedResult.totalQuestionsAnswered,
        extractedSignals: typedResult.extractedSignals || [],
        openEndedReflection: openEndedText.trim() || undefined,
        answersSummary,
        topRecommendations: typedResult.topRecommendations.slice(0, 3).map((rec) => ({
          rank: rec.rank,
          fieldId: rec.field.id,
          fieldName: rec.field.name,
          categoryName: rec.field.categoryName,
          compositeScore: rec.compositeScore,
          confidenceBand: rec.confidenceBand,
          interestScore: rec.breakdown.interestScore,
          readinessScore: rec.breakdown.readinessScore,
          preferenceScore: rec.breakdown.preferenceScore,
          topInstitution: rec.matchedInstitutions?.[0]
            ? `${rec.matchedInstitutions[0].institutionName} (${rec.matchedInstitutions[0].kabupaten}, ~${rec.matchedInstitutions[0].estimatedDistanceKm} km)`
            : undefined,
        })),
        completedAt: new Date().toISOString(),
      });

      triggerToast("Hasil rekomendasi objektif berhasil dihitung!");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Koneksi ke layanan analisis terputus. Silakan coba hitung ulang.";
      setAssessmentError(message);
      triggerToast("Terjadi kendala saat menghitung rekomendasi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Current active question
  const isBranching = Boolean(activeBranchId && ADAPTIVE_BRANCH_QUESTIONS[activeBranchId]);
  const activeQuestion: AssessmentQuestion = isBranching
    ? ADAPTIVE_BRANCH_QUESTIONS[activeBranchId!]
    : BASE_QUESTIONS[currentQuestionIndex];

  const totalQuestions = BASE_QUESTIONS.length;
  const progressPercent = Math.round(
    ((currentQuestionIndex + (isBranching ? 0.5 : 0)) / totalQuestions) * 100
  );

  const handleSelectOption = (optionId: string, branchTrigger?: string) => {
    setAnswers((prev) => ({ ...prev, [activeQuestion.id]: optionId }));

    if (branchTrigger && ADAPTIVE_BRANCH_QUESTIONS[branchTrigger]) {
      setActiveBranchId(branchTrigger);
      return;
    }

    if (isBranching) {
      setActiveBranchId(null);
    }

    if (currentQuestionIndex < BASE_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleSkipQuestion = () => {
    if (isBranching) {
      setActiveBranchId(null);
    } else if (currentQuestionIndex < BASE_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (isBranching) {
      setActiveBranchId(null);
      return;
    }
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      setCurrentStep(1);
    }
  };

  // Re-run calculation when preset or manual weights change in Step 3
  const handleSelectPriorityPreset = (preset: {
    id: string;
    matchWeight: number;
    distanceWeight: number;
    costWeight: number;
  }) => {
    setActivePresetId(preset.id);
    setMatchWeight(preset.matchWeight);
    setDistanceWeight(preset.distanceWeight);
    setCostWeight(preset.costWeight);
    runAssessmentCalculation({
      matchWeight: preset.matchWeight,
      distanceWeight: preset.distanceWeight,
      costWeight: preset.costWeight,
    });
  };

  const handleRecalculateWeights = () => {
    setActivePresetId("manual");
    runAssessmentCalculation();
  };

  return (
    <div className="min-h-screen flex flex-col neopop-canvas-subtle text-[#141413] relative selection:bg-[#B8F348] selection:text-[#141413]">
      {/* Toast Notification (solid dark surface, never neo-card which forces white bg) */}
      {toastMessage && (
        <div
          role="status"
          className="fixed top-24 right-4 sm:right-8 z-50 px-5 py-3 rounded-2xl bg-[#141413] text-white border-2 border-[#141413] shadow-[4px_4px_0px_#B8F348] flex items-center gap-3 max-w-md"
        >
          <div className="w-3 h-3 rounded-full bg-[#B8F348] shrink-0" />
          <span className="text-xs sm:text-sm font-display font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Floating Navbar */}
      <PdfExportGateModal
        reason={pdfGateReason}
        onClose={() => setPdfGateReason(null)}
        onDeclineLogin={() => {
          setDismissedGuestNotice(true);
          triggerToast("Tanpa login, file PDF tidak dapat diunduh.");
        }}
      />
      <Navbar
        onOpenLogin={() => {
          setAuthMode("login");
          setIsLoginModalOpen(true);
        }}
        onOpenRegister={() => {
          setAuthMode("register");
          setIsLoginModalOpen(true);
        }}
        onOpenTest={() => setCurrentStep(1)}
      />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        {/* Step Wizard Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-[#52514E] mb-2">
            <span>TAHAP {currentStep} DARI 3: {currentStep === 1 ? "PROFIL & PERSETUJUAN" : currentStep === 2 ? "KUESIONER ADAPTIF" : "HASIL & PETA REKOMENDASI"}</span>
            <span>{currentStep === 1 ? "Persiapan" : currentStep === 2 ? `${progressPercent}% Selesai` : "Rekomendasi Siap"}</span>
          </div>
          <div className="w-full h-3 rounded-full bg-white border-2 border-[#141413] overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-[#B8F348] border border-[#141413] transition-all duration-300"
              style={{
                width: currentStep === 1 ? "15%" : currentStep === 2 ? `${Math.max(25, progressPercent)}%` : "100%",
              }}
            />
          </div>
        </div>

        {/* ============================================================== */}
        {/* STEP 1: PROFIL MINIMAL & PERSETUJUAN EKSPLORASI                */}
        {/* ============================================================== */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="neo-card-lg rounded-3xl p-6 sm:p-8 bg-white space-y-6">
              {/* Header Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] border-2 border-[#141413]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1AD598] border border-[#141413]" />
                <span className="text-xs font-mono font-bold tracking-wider text-[#141413] uppercase">
                  PANDUAN EKSPLORASI PENDIDIKAN BALI
                </span>
              </div>

              <div>
                <h1 className="font-display font-black text-2xl sm:text-4xl text-[#141413] leading-tight">
                  Mulai Temukan Arah Masa Depanmu
                </h1>
                <p className="mt-2 text-sm sm:text-base text-[#52514E] leading-relaxed">
                  Jawab kuesioner singkat untuk memetakan minat, kesiapan, dan rekomendasi sekolah atau kampus di Bali yang paling cocok dengan profilmu.
                </p>
              </div>

              {/* Compact Trust Strip */}
              <div className="flex flex-wrap gap-2 text-xs font-mono font-bold text-[#141413]">
                <span className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border-2 border-[#141413]">
                  Data Terverifikasi PDDIKTI &amp; Kemendikbud
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border-2 border-[#141413]">
                  Bebas Sponsor &amp; Objektif
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border-2 border-[#141413]">
                  Lokasi Hanya untuk Estimasi Jarak
                </span>
              </div>

              {/* Form Input Profil Minimal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div>
                  <label className="block text-xs font-mono font-bold text-[#141413] uppercase mb-2">
                    Jenjang Pendidikanmu Saat Ini:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["SMP", "SMA", "SMK", "Lainnya"] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setEducationLevel(lvl)}
                        className={`py-2.5 px-3 rounded-xl border-2 border-[#141413] font-display font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                          educationLevel === lvl
                            ? "bg-[#B8F348] text-[#141413] shadow-[3px_3px_0px_#141413] -translate-y-0.5"
                            : "bg-white text-[#52514E] hover:bg-[#F0ECE1]"
                        }`}
                      >
                        {lvl === "SMP" ? "Siswa SMP" : lvl === "SMA" ? "Siswa SMA" : lvl === "SMK" ? "Siswa SMK" : "Gap Year / Umum"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <LocationOriginControl
                    id="eksplorasi-kabupaten-asal"
                    label="Alamat / Kabupaten Tinggal di Bali"
                    origin={origin}
                    isDetecting={isDetecting}
                    isGeocoding={isGeocoding}
                    locationNote={locationNote}
                    onChangeManualKabupaten={(kab) => {
                      setManualKabupaten(kab);
                      triggerToast(`Lokasi asal diperbarui ke ${kab}.`);
                    }}
                    onSubmitManualAddress={async (addr, kab) => {
                      const outcome = await setManualAddress(addr, kab);
                      triggerToast(outcome.message);
                    }}
                    onDetectLocation={handleDetectLocation}
                  />
                  <span className="text-xs text-[#52514E] mt-1.5 block">
                    Ketik kelurahan/jalan atau pilih kabupaten untuk mengestimasi jarak kampus terdekat (tombol GPS hanya opsional).
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t-2 border-[#141413]/10 flex flex-col sm:flex-row items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="group w-full sm:w-auto inline-flex items-center justify-between sm:justify-center gap-4 pl-6 pr-2.5 py-2.5 rounded-2xl bg-[#FF5E4D] hover:bg-[#ff4b38] text-white border-2 border-[#141413] shadow-[0_6px_0_#141413] hover:translate-y-[2px] hover:shadow-[0_4px_0_#141413] active:translate-y-[6px] active:shadow-none transition-all duration-150 cursor-pointer"
                >
                  <span className="font-display font-black text-sm sm:text-base">
                    Lanjut ke Kuesioner Adaptif
                  </span>
                  <span className="w-10 h-10 rounded-xl bg-[#B8F348] text-[#141413] border-2 border-[#141413] flex items-center justify-center font-mono font-bold group-hover:translate-x-0.5 transition-transform">
                    &rarr;
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 2: KUESIONER ADAPTIF BERTINGKAT                          */}
        {/* ============================================================== */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="neo-card-lg rounded-3xl p-6 sm:p-8 bg-white space-y-6">
              {/* Question Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b-2 border-[#141413]">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-[#B8F348] text-[#141413] font-mono font-bold text-xs border-2 border-[#141413]">
                    {isBranching ? "PERTANYAAN CABANG ADAPTIF" : `PERTANYAAN ${currentQuestionIndex + 1} / ${BASE_QUESTIONS.length}`}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#52514E] uppercase">
                    DIMENSI: {activeQuestion.dimension}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handlePreviousQuestion}
                  className="text-xs font-mono font-bold text-[#52514E] hover:text-[#141413] underline cursor-pointer"
                >
                  &larr; Kembali
                </button>
              </div>

              {/* Question Text */}
              <div>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-[#141413] leading-tight">
                  {activeQuestion.title}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-[#52514E] font-medium">
                  {activeQuestion.subtitle}
                </p>
              </div>

              {/* Options Grid */}
              <div className="space-y-3 pt-2">
                {activeQuestion.options.map((opt) => {
                  const isSelected = answers[activeQuestion.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt.id, opt.branchTrigger)}
                      className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 border-[#141413] transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isSelected
                          ? "bg-[#B8F348] shadow-[4px_4px_0px_#141413] -translate-y-0.5"
                          : "bg-[#FAF7F2] hover:bg-[#F0ECE1]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`w-5 h-5 rounded-full border-2 border-[#141413] shrink-0 mt-0.5 flex items-center justify-center text-xs font-black ${isSelected ? "bg-[#141413] text-white" : "bg-white"}`}>
                          {isSelected ? "✓" : ""}
                        </span>
                        <span className="font-display font-bold text-sm sm:text-base text-[#141413] leading-snug">
                          {opt.text}
                        </span>
                      </div>

                      {opt.branchTrigger && (
                        <span className="shrink-0 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white border border-[#141413] text-[#141413]">
                          + Detail Khusus
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Optional Open-Ended Text on Last Question */}
              {currentQuestionIndex === BASE_QUESTIONS.length - 1 && !isBranching && (
                <div className="mt-6 p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono font-bold text-[#141413] uppercase">
                      CATATAN / REFLEKSI BEBAS TAMBAHAN (OPSIONAL):
                    </label>
                    <span className="text-[11px] font-mono text-[#52514E]">
                      {openEndedText.length} / 300 Karakter
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    maxLength={300}
                    value={openEndedText}
                    onChange={(e) => setOpenEndedText(e.target.value)}
                    placeholder="Contoh: Saya suka coding web dan ingin kuliah di Denpasar atau Badung yang terjangkau..."
                    className="w-full p-3 rounded-xl bg-white border-2 border-[#141413] text-xs sm:text-sm text-[#141413] focus:outline-none resize-none"
                  />
                  <span className="text-[11px] font-mono text-[#0F6E4E] block">
                    Peringatan Privasi: Jangan mencantumkan nama lengkap, nomor telepon, atau data sensitif pribadi.
                  </span>
                </div>
              )}

              {/* Action Buttons Bottom */}
              <div className="pt-4 border-t-2 border-[#141413]/10 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleSkipQuestion}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-[#52514E] hover:text-[#141413] underline cursor-pointer"
                >
                  Belum Tahu / Lewati Soal Ini
                </button>

                {currentQuestionIndex === BASE_QUESTIONS.length - 1 && !isBranching && (
                  <button
                    type="button"
                    onClick={() => runAssessmentCalculation()}
                    className="group inline-flex items-center gap-3 pl-6 pr-2.5 py-2.5 rounded-2xl bg-[#141413] hover:bg-[#282826] text-white border-2 border-[#141413] shadow-[0_5px_0_#B8F348] active:translate-y-[5px] active:shadow-none transition-all cursor-pointer font-display font-black text-sm"
                  >
                    <span>Selesai &amp; Hitung Rekomendasi</span>
                    <span className="w-9 h-9 rounded-xl bg-[#B8F348] text-[#141413] flex items-center justify-center font-mono font-bold">
                      &rarr;
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 3: HASIL REKOMENDASI & PETA KAMPUS                        */}
        {/* ============================================================== */}
        {currentStep === 3 && (
          <div className="space-y-8">
            {/* Loading Skeleton */}
            {isLoading && (
              <div className="space-y-4 animate-pulse" aria-busy="true" aria-label="Memuat hasil analisis">
                <div className="h-10 w-64 bg-white rounded-xl border-2 border-[#141413]" />
                <div className="h-48 bg-white rounded-3xl border-2 border-[#141413]" />
                <div className="h-48 bg-white rounded-3xl border-2 border-[#141413]" />
              </div>
            )}

            {/* Error Boundary */}
            {!isLoading && assessmentError && (
              <div
                role="alert"
                className="neo-card-lg rounded-3xl p-6 sm:p-8 bg-[#FFE5E0] border-2 border-[#141413] space-y-4 text-[#141413]"
              >
                <span className="inline-block px-3 py-1 rounded-lg bg-[#FF5E4D] text-white font-mono font-bold text-xs border-2 border-[#141413]">
                  KENDALA PEMROSESAN
                </span>
                <h2 className="font-display font-black text-2xl">
                  Analisis Rekomendasi Belum Berhasil Dimuat
                </h2>
                <p className="text-sm text-[#52514E] leading-relaxed">
                  {assessmentError}
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => runAssessmentCalculation()}
                    className="px-5 py-2.5 rounded-xl bg-[#141413] text-[#B8F348] font-display font-bold text-xs border-2 border-[#141413] cursor-pointer"
                  >
                    Coba Hitung Ulang
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAssessmentError(null);
                      setCurrentStep(2);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-white text-[#141413] font-display font-bold text-xs border-2 border-[#141413] cursor-pointer"
                  >
                    Kembali ke Kuesioner
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !assessmentError && analysisResult && analysisResult.topRecommendations.length === 0 && (
              <div className="neo-card-lg rounded-3xl p-6 sm:p-8 bg-white text-center space-y-4">
                <h2 className="font-display font-black text-2xl text-[#141413]">
                  Belum Ada Rekomendasi yang Cocok
                </h2>
                <p className="text-sm text-[#52514E] max-w-lg mx-auto">
                  Silakan lengkapi beberapa pertanyaan minat atau tulis catatan refleksi singkat agar sistem bisa menghitung bidang yang selaras.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(2);
                    setCurrentQuestionIndex(0);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#B8F348] text-[#141413] font-display font-bold text-xs border-2 border-[#141413] cursor-pointer"
                >
                  Lengkapi Kuesioner
                </button>
              </div>
            )}

            {!isLoading && !assessmentError && analysisResult && analysisResult.topRecommendations.length > 0 && (
              <>
                {/* Header Summary Card */}
                <div className="neo-card-lg rounded-3xl p-6 sm:p-8 bg-white space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-3.5 py-1 rounded-xl bg-[#B8F348] text-[#141413] font-mono font-bold text-xs border-2 border-[#141413] shadow-[2px_2px_0px_#141413]">
                      HASIL ANALISIS OBJEKTIF &bull; KERTAMARGA BALI
                    </span>
                    <span className="text-xs font-mono font-bold text-[#52514E]">
                      Lokasi Acuan: {formatOriginLabel(origin)}
                    </span>
                  </div>

                  <h1 className="font-display font-black text-3xl sm:text-4xl text-[#141413] leading-tight">
                    Rekomendasi Bidang yang Selaras dengan Frekuensimu
                  </h1>

                  <p className="text-sm sm:text-base text-[#52514E] leading-relaxed">
                    Sistem menganalisis {analysisResult.totalQuestionsAnswered} jawabanmu dengan memisahkan faktor <strong>Minat</strong>, <strong>Kesiapan Saat Ini</strong>, dan <strong>Preferensi Belajar</strong>. Pilihlah bidang yang paling menarik untuk membaca panduan detailnya.
                  </p>

                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (!user) {
                          setPdfGateReason("need-login");
                          return;
                        }
                        const html = buildExplorationReportHtml({
                          result: analysisResult,
                          educationLevel,
                          originLabel: formatOriginLabel(origin),
                          weights: { matchWeight, distanceWeight, costWeight },
                          userName: user?.name,
                          userIdentifier: user?.identifier,
                        });
                        openPrintableReport(
                          html,
                          `kertamarga-hasil-eksplorasi-${new Date().toISOString().slice(0, 10)}.html`
                        );
                      }}
                      className="neo-btn min-h-[42px] px-4 py-2 rounded-xl bg-[#B8F348] hover:bg-[#a8e635] text-[#141413] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] font-display font-bold text-xs sm:text-sm cursor-pointer"
                    >
                      Unduh Laporan PDF
                    </button>
                  </div>

                  {!user && !dismissedGuestNotice && (
                    <div className="p-4 rounded-2xl bg-[#FFBE2E]/25 border-2 border-[#141413] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <p className="font-display font-bold text-xs sm:text-sm text-[#141413]">
                          Login untuk Mengunduh Laporan PDF
                        </p>
                        <p className="text-xs text-[#52514E]">
                          Hasil tes Anda sudah siap. Masuk ke akun untuk mengunduh file PDF, atau pilih tidak ingin login (tidak dapat mengunduh PDF).
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <Link
                          href="/login"
                          className="neo-btn px-3.5 py-2 rounded-xl bg-[#B8F348] hover:bg-[#a8e635] text-[#141413] border-2 border-[#141413] font-display font-bold text-xs"
                        >
                          Login untuk Unduh
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setDismissedGuestNotice(true);
                            triggerToast("Anda melanjutkan tanpa login (file PDF tidak dapat diunduh).");
                          }}
                          className="px-3 py-2 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#52514E] border border-[#141413]/30 font-mono font-bold text-xs cursor-pointer"
                        >
                          Tidak Ingin Login
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sinyal Ekstraksi dari Refleksi */}
                  {analysisResult.extractedSignals.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#141413] uppercase">
                        Sinyal Minat Terekstraksi:
                      </span>
                      {analysisResult.extractedSignals.map((sig) => (
                        <span key={sig} className="px-2.5 py-0.5 rounded-lg bg-[#FFBE2E] border border-[#141413] font-mono font-bold text-xs text-[#141413]">
                          #{sig}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Priority Presets (1-Click) + Optional Manual Sliders */}
                  <div className="mt-4 pt-4 border-t-2 border-[#141413]/15 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-[#141413] uppercase">
                        Sesuaikan Prioritas Pilihanmu (1-Klik Hitung Ulang):
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowManualSliders((prev) => !prev)}
                        className="text-xs font-mono font-bold text-[#3B66FF] hover:underline cursor-pointer"
                      >
                        {showManualSliders ? "Tutup Pengaturan Manual" : "Atur Bobot Manual"}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        {
                          id: "minat",
                          label: "Fokus Minat",
                          desc: "Utamakan kecocokan bakat",
                          matchWeight: 95,
                          distanceWeight: 30,
                          costWeight: 40,
                        },
                        {
                          id: "seimbang",
                          label: "Seimbang",
                          desc: "Kombinasi ideal",
                          matchWeight: 80,
                          distanceWeight: 50,
                          costWeight: 65,
                        },
                        {
                          id: "dekat",
                          label: "Dekat Rumah",
                          desc: "Prioritas jarak terdekat",
                          matchWeight: 65,
                          distanceWeight: 95,
                          costWeight: 55,
                        },
                        {
                          id: "hemat",
                          label: "Hemat Biaya",
                          desc: "Prioritas biaya terjangkau",
                          matchWeight: 65,
                          distanceWeight: 50,
                          costWeight: 95,
                        },
                      ].map((preset) => {
                        const isActive = activePresetId === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleSelectPriorityPreset(preset)}
                            className={`min-h-[56px] p-3 rounded-xl border-2 border-[#141413] text-left transition-all cursor-pointer ${
                              isActive
                                ? "bg-[#B8F348] shadow-[3px_3px_0px_#141413]"
                                : "bg-[#FAF7F2] hover:bg-white"
                            }`}
                          >
                            <span className="font-display font-black text-xs sm:text-sm text-[#141413] block">
                              {preset.label}
                            </span>
                            <span className="text-xs text-[#52514E] block mt-0.5">
                              {preset.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {showManualSliders && (
                      <div className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div className="p-3 rounded-xl bg-white border border-[#141413]">
                            <div className="flex justify-between font-mono font-bold mb-1">
                              <span className="text-[#3B66FF]">Kecocokan Minat</span>
                              <span>{matchWeight}%</span>
                            </div>
                            <input
                              type="range"
                              min="20"
                              max="100"
                              step="5"
                              value={matchWeight}
                              onChange={(e) => setMatchWeight(Number(e.target.value))}
                              className="w-full neo-fader"
                            />
                          </div>

                          <div className="p-3 rounded-xl bg-white border border-[#141413]">
                            <div className="flex justify-between font-mono font-bold mb-1">
                              <span className="text-[#0F6E4E]">Jarak Tempuh Bali</span>
                              <span>{distanceWeight}%</span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              step="5"
                              value={distanceWeight}
                              onChange={(e) => setDistanceWeight(Number(e.target.value))}
                              className="w-full neo-fader"
                            />
                          </div>

                          <div className="p-3 rounded-xl bg-white border border-[#141413]">
                            <div className="flex justify-between font-mono font-bold mb-1">
                              <span className="text-[#FF5E4D]">Efisiensi Biaya</span>
                              <span>{costWeight}%</span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              step="5"
                              value={costWeight}
                              onChange={(e) => setCostWeight(Number(e.target.value))}
                              className="w-full neo-fader"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={handleRecalculateWeights}
                            className="min-h-[40px] px-4 py-2 rounded-xl bg-[#141413] text-[#B8F348] font-mono font-bold text-xs cursor-pointer"
                          >
                            Terapkan Bobot Manual &rarr;
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Top 3-4 Recommended Fields Cards */}
                <div className="space-y-6">
                  {analysisResult.topRecommendations.map((rec) => (
                    <div
                      key={rec.field.id}
                      className="neo-card-lg rounded-3xl p-6 sm:p-8 bg-white space-y-5"
                    >
                      {/* Card Header Tag */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-[#141413]">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-3 py-1 rounded-xl bg-[#141413] text-[#B8F348] font-mono font-bold text-xs border-2 border-[#141413]">
                            PERINGKAT #{rec.rank}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#141413] font-mono font-bold text-xs text-[#141413]">
                            Keyakinan: {rec.confidenceBand}
                          </span>
                          <span className="text-xs font-mono text-[#52514E]">
                            Klaster: {rec.field.categoryName}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#52514E]">Skor Komposit:</span>
                          <span className="px-3 py-1 rounded-xl bg-[#B8F348] text-[#141413] font-mono font-extrabold text-base border-2 border-[#141413]">
                            {rec.compositeScore} / 100
                          </span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h2 className="font-display font-black text-2xl sm:text-3xl text-[#141413] leading-tight">
                          {rec.field.name}
                        </h2>
                        <p className="mt-1 text-xs sm:text-sm font-bold text-[#3B66FF]">
                          {rec.field.vibeTagline}
                        </p>
                        <p className="mt-2 text-xs sm:text-sm text-[#52514E] leading-relaxed">
                          {rec.field.shortDesc}
                        </p>
                      </div>

                      {/* Dimension Score Bar Breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] text-xs">
                        <div>
                          <div className="flex justify-between font-mono font-bold mb-1">
                            <span className="text-[#3B66FF]">Minat &amp; Aktivitas</span>
                            <span>{rec.breakdown.interestScore}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-white border border-[#141413] overflow-hidden">
                            <div className="h-full bg-[#3B66FF]" style={{ width: `${rec.breakdown.interestScore}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between font-mono font-bold mb-1">
                            <span className="text-[#0F6E4E]">Kesiapan Saat Ini</span>
                            <span>{rec.breakdown.readinessScore}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-white border border-[#141413] overflow-hidden">
                            <div className="h-full bg-[#1AD598]" style={{ width: `${rec.breakdown.readinessScore}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between font-mono font-bold mb-1">
                            <span className="text-[#FF5E4D]">Preferensi Kerja</span>
                            <span>{rec.breakdown.preferenceScore}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-white border border-[#141413] overflow-hidden">
                            <div className="h-full bg-[#FF5E4D]" style={{ width: `${rec.breakdown.preferenceScore}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Explainable Reasoning Trace */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-mono font-bold text-[#141413] uppercase block">
                          Mengapa Bidang Ini Muncul untuk Anda:
                        </span>
                        <ul className="space-y-1 text-xs text-[#52514E]">
                          {rec.reasoningTrace.map((reason, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-2">
                              <span className="text-[#141413] font-bold">&bull;</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Matched Verified Institutions in Bali */}
                      <div className="space-y-2.5 pt-2">
                        <span className="text-xs font-mono font-bold text-[#141413] uppercase block">
                          {educationLevel === "SMP"
                            ? "Rekomendasi Sekolah (SMA/SMK) & Jurusan Terdekat di Bali:"
                            : "Rekomendasi Kampus & Program Studi Terdekat di Bali:"}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {rec.matchedInstitutions.slice(0, 2).map((inst) => (
                            <div
                              key={inst.institutionId}
                              className="p-3.5 rounded-2xl bg-white border-2 border-[#141413] shadow-[2px_2px_0px_#141413] space-y-1.5 text-xs"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-display font-extrabold text-[#141413]">
                                  {inst.institutionName}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-[#B8F348] border border-[#141413] font-mono font-bold text-xs shrink-0">
                                  {inst.level}
                                </span>
                              </div>
                              <p className="text-xs font-semibold text-[#3B66FF]">
                                {inst.programName}
                              </p>
                              <div className="flex items-center justify-between font-mono text-xs text-[#52514E]">
                                <span>{inst.district}, {inst.kabupaten}</span>
                                <span className="font-bold text-[#141413]">~{inst.estimatedDistanceKm} km</span>
                              </div>
                              <div className="pt-1.5 border-t border-[#141413]/10 text-xs text-[#52514E]">
                                <span>{inst.tuitionFeeText}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Button: Confirm & Read Field Guide */}
                      <div className="pt-4 border-t-2 border-[#141413]/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <span className="text-xs text-[#52514E]">
                          {rec.alternativeNotes}
                        </span>

                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                          <Link
                            href={`/hasil-analisis?field=${rec.field.id}&score=${Math.max(
                              35,
                              Math.min(95, Math.round(rec.breakdown.readinessScore))
                            )}&dominant=${
                              analysisResult.topRecommendations[0]?.field.group || rec.field.group
                            }&mismatch=${
                              rec.field.group !==
                              (analysisResult.topRecommendations[0]?.field.group || rec.field.group)
                                ? "1"
                                : "0"
                            }`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F0ECE1] text-[#141413] border-2 border-[#141413] shadow-[0_3px_0_#141413] font-display font-bold text-xs"
                          >
                            <span>Bimbingan Nilai &amp; Modul</span>
                            <span className="font-mono text-xs">&rarr;</span>
                          </Link>

                          <Link
                            href={`/peta-bidang/${rec.field.id}?kabupaten=${encodeURIComponent(origin.kabupaten)}`}
                            className="group w-full sm:w-auto inline-flex items-center justify-between sm:justify-center gap-3 pl-5 pr-2 py-2 rounded-xl bg-[#FF5E4D] hover:bg-[#ff4936] text-white border-2 border-[#141413] shadow-[0_4px_0_#141413] hover:translate-y-[1px] hover:shadow-[0_3px_0_#141413] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer font-display font-extrabold text-xs sm:text-sm"
                          >
                            <span>Konfirmasi Pilihan &amp; Baca Peta Bidang</span>
                            <span className="w-8 h-8 rounded-lg bg-[#B8F348] text-[#141413] border-2 border-[#141413] flex items-center justify-center font-mono font-bold group-hover:translate-x-0.5 transition-transform">
                              &rarr;
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reset / Retake Button */}
                <div className="flex items-center justify-center pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(2);
                      setCurrentQuestionIndex(0);
                    }}
                    className="px-5 py-2.5 rounded-xl border-2 border-[#141413] bg-white hover:bg-[#FAF7F2] font-mono font-bold text-xs text-[#141413] shadow-[2px_2px_0px_#141413] cursor-pointer"
                  >
                    Ulangi atau Koreksi Kuesioner
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#141413] text-white border-t-2 border-[#141413] py-8 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs font-mono text-[#F0ECE1]/80">
          <div>
            <span className="font-display font-black text-white text-sm block">KertaMarga Bali</span>
            <span>Platform Eksplorasi Pendidikan Bali</span>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="hover:underline">Beranda</Link>
            <Link href="/katalog" className="hover:underline">Katalog Institusi</Link>
            <Link href="/ai-navigator" className="hover:underline">AI Navigator</Link>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onProceedToTest={() => {
          setIsLoginModalOpen(false);
          setCurrentStep(2);
        }}
        initialMode={authMode}
      />
    </div>
  );
}
