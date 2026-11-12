"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ChatBubble from "@/components/ai-navigator/ChatBubble";
import TypingIndicator from "@/components/ai-navigator/TypingIndicator";
import { FIELDS } from "@/data/fields";
import { matchNavigator, type NavigatorResult, type TargetLevel } from "@/lib/ai-matcher";
import type {
  DiagnosticState,
  NavigatorChatResponse,
} from "@/app/api/navigator-chat/route";
import { saveExplorationResultToStorage } from "@/lib/learningProfile";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const PRESET_QUERIES = [
  "Saya ingin masuk prodi Informatika, apa saja yang harus saya lakukan?",
  "Apa perbedaan prospek SMK Jurusan RPL dengan Kuliah TRPL di PNB?",
  "Bagaimana prospek kerja pariwisata modern dan perhotelan di Bali?",
  "Mau ambil DKV atau Animasi di Bali, apa persiapan portofolionya?",
];

const KABUPATEN = [
  "Kota Denpasar",
  "Kabupaten Badung",
  "Kabupaten Gianyar",
  "Kabupaten Tabanan",
  "Kabupaten Buleleng",
  "Kabupaten Klungkung",
  "Kabupaten Bangli",
  "Kabupaten Karangasem",
  "Kabupaten Jembrana",
];

function resolveFieldFromQuery(rawField: string | null) {
  if (!rawField) return null;
  const q = rawField.trim().toLowerCase();
  if (!q) return null;
  return (
    FIELDS.find((f) => f.id.toLowerCase() === q) ||
    FIELDS.find((f) => f.name.toLowerCase() === q) ||
    FIELDS.find(
      (f) =>
        f.name.toLowerCase().includes(q) || q.includes(f.name.toLowerCase())
    ) ||
    null
  );
}

function resolveKabupatenFromQuery(rawKab: string | null): string | null {
  if (!rawKab) return null;
  const normalized = rawKab.replace(/^Kab\.\s+/i, "Kabupaten ").trim().toLowerCase();
  return (
    KABUPATEN.find((k) => k.toLowerCase() === normalized) ||
    KABUPATEN.find((k) => k.toLowerCase().replace(/^kabupaten\s+/i, "") === normalized.replace(/^kabupaten\s+/i, "")) ||
    null
  );
}

function AiNavigatorContent() {
  const searchParams = useSearchParams();
  const initialField = resolveFieldFromQuery(searchParams.get("field"));
  const initialKab = resolveKabupatenFromQuery(searchParams.get("kabupaten")) || "Kota Denpasar";

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      content: initialField
        ? `Halo, aku Navigator KertaMarga. Kulihat kamu sedang mengeksplorasi bidang "${initialField.name}". Di panel sebelah kanan sudah kutampilkan rekomendasi SMK dan Perguruan Tinggi terkait di Bali. Silakan tanyakan apa saja mengenai persiapan, mata kuliah, atau prospek karier bidang ini.`
        : "Halo, aku Navigator KertaMarga. Tanyakan apa saja seputar pilihan jurusan, langkah persiapan masuk prodi impian, info kampus/SMK di Bali, hingga prospek karier masa depan. Apa yang ingin kamu diskusikan hari ini?",
    },
  ]);
  const [input, setInput] = useState(() =>
    initialField ? `Saya ingin tahu langkah persiapan masuk bidang ${initialField.name} di Bali.` : ""
  );
  const [isTyping, setIsTyping] = useState(false);
  const [streamId, setStreamId] = useState<string | null>(null);
  const [sourceMode, setSourceMode] = useState<"9router-live" | "gemini-live" | "deterministic-qa" | "scope-guard">("9router-live");
  const [activeResults, setActiveResults] = useState<NavigatorResult[]>(() =>
    initialField ? matchNavigator(initialField.id, initialKab, "semua") : []
  );
  const [lastMatchedQuery, setLastMatchedQuery] = useState<string | null>(() =>
    initialField ? initialField.id : null
  );
  const [userKabupaten, setUserKabupaten] = useState(initialKab);
  const [targetLevel, setTargetLevel] = useState<TargetLevel>("semua");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [chatError, setChatError] = useState<string | null>(null);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [chatMode, setChatMode] = useState<"standard" | "diagnostic">("standard");
  const [diagnosticState, setDiagnosticState] = useState<DiagnosticState | null>(null);
  const [isSavedToProfile, setIsSavedToProfile] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const resolvedField = resolveFieldFromQuery(searchParams.get("field"));
    const resolvedKab = resolveKabupatenFromQuery(searchParams.get("kabupaten"));
    if (resolvedKab) {
      setUserKabupaten(resolvedKab);
    }
    if (resolvedField) {
      setLastMatchedQuery(resolvedField.id);
      setActiveResults(matchNavigator(resolvedField.id, resolvedKab || userKabupaten, targetLevel));
    }
    // Jalankan saat query parameter URL berubah
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleSwitchMode = (nextMode: "standard" | "diagnostic") => {
    if (chatMode === nextMode) return;
    setChatMode(nextMode);
    setChatError(null);
    setStreamId(null);
    if (nextMode === "diagnostic") {
      const diagIntro: Message = {
        id: "diag-welcome",
        role: "assistant",
        content: `Halo! Saya Navigator KertaMarga. Di mode Kuesioner Interaktif ini, kita akan menentukan jurusan dan rujukan sekolah/kampus di Bali yang paling cocok melalui 4 langkah percakapan dinamis.

Pertanyaan 1/4: Aktivitas apa yang paling membuatmu bersemangat dan lupa waktu dalam keseharian?
Silakan pilih salah satu opsi cepat di bawah atau ceritakan bebas dengan bahasamu sendiri:`,
      };
      setMessages([diagIntro]);
      setDiagnosticState({
        status: "in_progress",
        step: 1,
        totalSteps: 4,
        quickOptions: [
          "A) Utak-atik kode & logika komputer",
          "B) Desain visual, video & seni kreatif",
          "C) Bisnis, jualan & strategi pemasaran",
          "D) Alam, laut, lingkungan & pertanian Bali",
          "E) Berkomunikasi, kesehatan & mengajar",
        ],
      });
      setIsSavedToProfile(false);
      triggerToast("Mode Kuesioner Dinamis aktif. Jawab pertanyaan untuk memprediksi jurusan.");
    } else {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: initialField
            ? `Halo, aku Navigator KertaMarga. Kulihat kamu sedang mengeksplorasi bidang "${initialField.name}". Di panel sebelah kanan sudah kutampilkan rekomendasi SMK dan Perguruan Tinggi terkait di Bali. Silakan tanyakan apa saja mengenai persiapan, mata kuliah, atau prospek karier bidang ini.`
            : "Halo, aku Navigator KertaMarga. Tanyakan apa saja seputar pilihan jurusan, langkah persiapan masuk prodi impian, info kampus/SMK di Bali, hingga prospek karier masa depan. Apa yang ingin kamu diskusikan hari ini?",
        },
      ]);
      setDiagnosticState(null);
      setIsSavedToProfile(false);
      triggerToast("Kembali ke mode konsultasi tanya-jawab standar.");
    }
  };

  const handleRestartDiagnostic = () => {
    handleSwitchMode("diagnostic");
  };

  const handleSavePredictionToProfile = () => {
    if (!diagnosticState?.prediction) return;
    const pred = diagnosticState.prediction;
    const targetEducation =
      targetLevel === "smk" ? "SMP" : targetLevel === "kuliah" ? "SMA" : "SMK";
    saveExplorationResultToStorage({
      educationLevel: targetEducation,
      originLabel: userKabupaten,
      weights: { matchWeight: 85, distanceWeight: 50, costWeight: 60 },
      totalQuestionsAnswered: diagnosticState.step,
      extractedSignals: [pred.fieldId, "chat-ai-prediction"],
      openEndedReflection: `Hasil prediksi AI Navigator KertaMarga: ${pred.analysisSummary}`,
      topRecommendations: [
        {
          rank: 1,
          fieldId: pred.fieldId,
          fieldName: pred.fieldName,
          categoryName: "Prediksi Percakapan AI",
          compositeScore: pred.confidenceScore,
          confidenceBand: "Sangat Cocok",
          interestScore: pred.confidenceScore,
          readinessScore: Math.round(pred.confidenceScore * 0.92),
          preferenceScore: Math.round(pred.confidenceScore * 0.95),
        },
      ],
      completedAt: new Date().toISOString(),
    });
    setIsSavedToProfile(true);
    triggerToast("Hasil prediksi percakapan berhasil disimpan ke profil belajar!");
  };

  useEffect(() => {
    if (lastMatchedQuery) {
      setActiveResults(matchNavigator(lastMatchedQuery, userKabupaten, targetLevel));
    }
  }, [lastMatchedQuery, userKabupaten, targetLevel]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const [cooldownSec, setCooldownSec] = useState<number>(0);

  useEffect(() => {
    if (cooldownSec <= 0) return;
    const timer = window.setInterval(() => {
      setCooldownSec((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldownSec]);

  const sendMessage = async (text: string) => {
    const clean = text.trim();
    if (!clean || isTyping) return;
    if (cooldownSec > 0) {
      triggerToast(`Jeda proteksi API aktif (${cooldownSec}d). Silakan tunggu sebentar.`);
      return;
    }
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: clean };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setSelectedPreset(clean);
    setChatError(null);
    setLastFailedPrompt(null);
    setIsTyping(true);
    setCooldownSec(3);

    try {
      await new Promise((resolve) => setTimeout(resolve, 350));
      const res = await fetch("/api/navigator-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          userKabupaten,
          targetLevel,
          mode: chatMode,
        }),
      });

      if (!res.ok) {
        throw new Error(`Layanan konsultasi merespons status ${res.status}.`);
      }

      const data = (await res.json()) as NavigatorChatResponse;
      const replyText = data.reply || "";
      const matchedField = data.matchedFieldId;
      if (data.sourceMode) {
        setSourceMode(data.sourceMode);
      }
      if (data.diagnostic) {
        setDiagnosticState(data.diagnostic);
        if (data.diagnostic.prediction) {
          setIsSavedToProfile(false);
          const predQuery = data.diagnostic.prediction.fieldId;
          const predResults = matchNavigator(predQuery, userKabupaten, targetLevel);
          if (predResults.length > 0) {
            setLastMatchedQuery(predQuery);
            setActiveResults(predResults);
          }
        }
      }

      if (!replyText.trim()) {
        throw new Error("Respons konsultasi kosong, silakan coba kirim ulang.");
      }

      // Perbarui kartu institusi terkait hanya jika pertanyaan berada dalam cakupan website
      if (!data.outOfScope && !data.diagnostic?.prediction) {
        const queryForResults = matchedField || clean;
        const results = matchNavigator(queryForResults, userKabupaten, targetLevel);
        if (results.length > 0) {
          setLastMatchedQuery(queryForResults);
          setActiveResults(results);
        }
      }

      const assistantId = `a-${Date.now()}`;
      setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);
      setIsTyping(false);
      setStreamId(assistantId);

      // Streaming jawaban kata demi kata agar terasa responsif dan interaktif
      const words = replyText.split(" ");
      let idx = 0;
      const timer = setInterval(() => {
        idx += 2;
        const partial = words.slice(0, idx).join(" ");
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: partial } : m))
        );
        if (idx >= words.length) {
          clearInterval(timer);
          setStreamId(null);
        }
      }, 25);
    } catch (err) {
      setIsTyping(false);
      const errMsg =
        err instanceof Error
          ? err.message
          : "Koneksi ke layanan Navigator terputus sejenak.";
      setChatError(errMsg);
      setLastFailedPrompt(clean);
      triggerToast("Gagal memuat jawaban, klik Kirim Ulang untuk mencoba kembali.");
    }
  };

  const stopStream = () => {
    setStreamId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const groupColor = (g: string) =>
    g === "teknologi"
      ? "bg-[#2D6CDF] text-white"
      : g === "manusia"
      ? "bg-[#FF5E4D] text-white"
      : g === "alam"
      ? "bg-[#2E9E6B] text-white"
      : "bg-[#FFBE2E] text-[#141413]";

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#141413] flex flex-col selection:bg-[#B8F348] selection:text-[#141413]">
      {toastMessage && (
        <div
          role="status"
          className="fixed top-24 right-4 sm:right-8 z-50 px-4 py-2.5 rounded-2xl bg-[#141413] text-white border-2 border-[#141413] shadow-[4px_4px_0px_#B8F348] flex items-center gap-2.5 max-w-sm"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#B8F348] shrink-0" />
          <span className="text-xs font-display font-bold">{toastMessage}</span>
        </div>
      )}
      <Navbar onOpenLogin={() => {}} onOpenRegister={() => {}} onOpenTest={() => {}} />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24">
        <div className="flex items-center gap-2 text-xs font-mono text-[#141413]/70 mb-4">
          <Link href="/" className="hover:text-[#141413] underline font-bold">
            Beranda
          </Link>
          <span>/</span>
          <span className="text-[#141413] font-black uppercase">AI Navigator</span>
        </div>

        <div className="mb-5">
          <h1 className="font-display font-black text-2xl sm:text-4xl tracking-tight">
            Konsultasi &amp; Tanya Jawab Jurusan
          </h1>
          <p className="text-sm text-[#141413]/75 font-medium mt-1">
            Sesi dialog interaktif langsung dengan AI Navigator KertaMarga berbasis kurikulum dan data institusi se-Bali.
          </p>
        </div>

        {/* Compact Context Bar: Domisili & Target Jenjang */}
        <div className="mb-4 bg-white border-2 border-[#141413] rounded-2xl shadow-[4px_4px_0px_#141413] p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <label
              htmlFor="kab"
              className="text-xs font-mono font-black uppercase text-[#141413] shrink-0"
            >
              Domisili Bali:
            </label>
            <select
              id="kab"
              value={userKabupaten}
              onChange={(e) => setUserKabupaten(e.target.value)}
              className="w-full sm:w-60 min-h-[44px] px-3 pr-8 rounded-xl bg-[#FAF7F2] border-2 border-[#141413] text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#3B66FF] cursor-pointer"
            >
              {KABUPATEN.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono font-black uppercase text-[#141413] hidden md:inline">
              Jenjang:
            </span>
            <div className="grid grid-cols-3 gap-1.5 w-full sm:w-auto">
              {(["semua", "smk", "kuliah"] as TargetLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setTargetLevel(lvl)}
                  className={`min-h-[44px] px-3.5 rounded-xl text-xs font-mono font-bold uppercase border-2 border-[#141413] transition-colors cursor-pointer ${
                    targetLevel === lvl
                      ? "bg-[#FFBE2E] text-[#141413] shadow-[2px_2px_0px_#141413]"
                      : "bg-[#FAF7F2] text-[#141413]/75 hover:bg-[#F0ECE1]"
                  }`}
                >
                  {lvl === "semua" ? "Semua" : lvl === "smk" ? "SMK" : "Kuliah"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mode Switcher: Tanya Jawab Bebas vs Kuesioner Dinamis & Prediksi Jurusan */}
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleSwitchMode("standard")}
            className={`min-h-[50px] p-3 rounded-2xl border-2 border-[#141413] text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
              chatMode === "standard"
                ? "bg-white shadow-[3px_3px_0px_#141413]"
                : "bg-[#FAF7F2] hover:bg-[#F0ECE1] opacity-75"
            }`}
          >
            <div>
              <span className="text-[11px] font-mono font-bold uppercase text-[#52514E] block">
                Mode Standar
              </span>
              <span className="font-display font-black text-xs sm:text-sm text-[#141413]">
                Konsultasi &amp; Tanya Jawab Bebas
              </span>
            </div>
            <span
              className={`w-3.5 h-3.5 rounded-full border border-[#141413] shrink-0 ${
                chatMode === "standard" ? "bg-[#3B66FF]" : "bg-transparent"
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => handleSwitchMode("diagnostic")}
            className={`min-h-[50px] p-3 rounded-2xl border-2 border-[#141413] text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
              chatMode === "diagnostic"
                ? "bg-[#B8F348] shadow-[3px_3px_0px_#141413]"
                : "bg-[#FAF7F2] hover:bg-[#F0ECE1] opacity-75"
            }`}
          >
            <div>
              <span className="text-[11px] font-mono font-bold uppercase text-[#141413] block">
                Asesmen Percakapan Dinamis
              </span>
              <span className="font-display font-black text-xs sm:text-sm text-[#141413]">
                Kuesioner Dinamis &amp; Prediksi Jurusan
              </span>
            </div>
            <span
              className={`w-3.5 h-3.5 rounded-full border border-[#141413] shrink-0 ${
                chatMode === "diagnostic" ? "bg-[#141413]" : "bg-transparent"
              }`}
            />
          </button>
        </div>

        {/* Full-Width Roomy Chat AI Workspace */}
        <div className="bg-white border-2 border-[#141413] rounded-3xl shadow-[6px_6px_0px_#141413] overflow-hidden flex flex-col h-[560px] sm:h-[640px]">
          <div className="px-4 sm:px-6 py-3.5 border-b-2 border-[#141413] bg-[#FAF7F2] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-9 h-9 shrink-0 rounded-xl bg-[#B8F348] border-2 border-[#141413] flex items-center justify-center font-display font-black text-xs">
                AI
              </span>
              <div className="min-w-0">
                <p className="font-display font-black text-sm sm:text-base leading-tight truncate">
                  Navigator KertaMarga
                </p>
                <p className="text-xs font-bold text-[#0F6E4E] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1AD598] border border-[#141413]" />
                  {chatMode === "diagnostic"
                    ? `Mode Kuesioner Dinamis &bull; Konteks ${userKabupaten}`
                    : `Online sekarang &bull; Konteks ${userKabupaten}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-bold bg-white border border-[#141413]/25 rounded-lg px-2.5 py-1 text-[#141413]/85">
                <span
                  className={`w-2 h-2 rounded-full ${
                    sourceMode.includes("live") ? "bg-[#1AD598] animate-pulse" : "bg-[#FFBE2E]"
                  }`}
                />
                {sourceMode === "9router-live"
                  ? "AI Live (9Router)"
                  : sourceMode === "gemini-live"
                  ? "AI Live (Gemini)"
                  : sourceMode === "scope-guard"
                  ? "Fokus Topik Web"
                  : "Q&A Fallback"}
              </span>
              {streamId && (
                <button
                  type="button"
                  onClick={stopStream}
                  className="text-xs font-bold border-2 border-[#141413] bg-[#FFBE2E] rounded-lg px-3 py-1 cursor-pointer"
                >
                  Berhenti
                </button>
              )}
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAF7F2]/60">
            {chatMode === "diagnostic" && (
              <div className="p-3.5 rounded-2xl bg-[#EEF9D4] border-2 border-[#141413] shadow-[2px_2px_0px_#141413] space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-[#1F7A52] uppercase">
                    Kuesioner Diagnostik Percakapan AI
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-white border border-[#141413]">
                    {diagnosticState?.status === "completed"
                      ? "Prediksi Jurusan Selesai"
                      : `Langkah ${diagnosticState?.step || 1} / ${diagnosticState?.totalSteps || 4}`}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                  {[
                    "1. Minat Aktivitas",
                    "2. Gaya Belajar",
                    "3. Target Jenjang",
                    "4. Prediksi AI",
                  ].map((label, idx) => {
                    const stepNum = idx + 1;
                    const currentStep = diagnosticState?.step || 1;
                    const isDone =
                      diagnosticState?.status === "completed" ||
                      currentStep > stepNum;
                    const isActive =
                      diagnosticState?.status !== "completed" &&
                      currentStep === stepNum;
                    return (
                      <div
                        key={label}
                        className={`text-[10px] sm:text-[11px] font-mono font-bold py-1 px-1.5 rounded-lg border text-center truncate ${
                          isDone
                            ? "bg-[#B8F348] text-[#141413] border-[#141413]"
                            : isActive
                            ? "bg-[#141413] text-[#B8F348] border-[#141413]"
                            : "bg-white/80 text-[#52514E] border-[#141413]/30"
                        }`}
                      >
                        {label}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <ChatBubble key={m.id} role={m.role} content={m.content} streaming={streamId === m.id} />
            ))}

            {diagnosticState?.status === "completed" && diagnosticState.prediction && (
              <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#141413] shadow-[4px_4px_0px_#141413] space-y-3.5 my-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#B8F348] text-[#141413] border border-[#141413] font-mono font-bold text-xs uppercase">
                      Hasil Prediksi Jurusan AI
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#3B66FF] text-white border border-[#141413] font-mono font-bold text-xs">
                      Keyakinan: {diagnosticState.prediction.confidenceScore}%
                    </span>
                  </div>
                  {isSavedToProfile && (
                    <span className="text-xs font-mono font-bold text-[#1F7A52] bg-[#EEF9D4] px-2 py-0.5 rounded-lg border border-[#141413]">
                      Tersimpan di Profil
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-display font-black text-xl sm:text-2xl text-[#141413]">
                    {diagnosticState.prediction.fieldName}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#52514E] font-medium mt-1">
                    {diagnosticState.prediction.analysisSummary}
                  </p>
                  {diagnosticState.prediction.secondaryFieldName && (
                    <p className="text-xs font-mono text-[#3B66FF] font-bold mt-1.5">
                      Rekomendasi Alternatif: {diagnosticState.prediction.secondaryFieldName}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#141413]/15">
                  <Link
                    href={`/peta-bidang/${diagnosticState.prediction.fieldId}`}
                    className="neo-btn inline-flex items-center min-h-[40px] px-3.5 rounded-xl bg-[#141413] text-white hover:bg-[#333] border-2 border-[#141413] font-mono font-bold text-xs"
                  >
                    Buka Silabus Bidang &rarr;
                  </Link>
                  <Link
                    href={`/hasil-analisis?field=${diagnosticState.prediction.fieldId}`}
                    className="neo-btn inline-flex items-center min-h-[40px] px-3.5 rounded-xl bg-[#FFBE2E] hover:bg-[#e6a81f] text-[#141413] border-2 border-[#141413] font-mono font-bold text-xs"
                  >
                    Mulai Belajar di Workspace &rarr;
                  </Link>
                  <button
                    type="button"
                    onClick={handleSavePredictionToProfile}
                    className="neo-btn inline-flex items-center min-h-[40px] px-3.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F0ECE1] text-[#141413] border-2 border-[#141413] font-mono font-bold text-xs cursor-pointer"
                  >
                    {isSavedToProfile ? "Perbarui di Profil" : "Simpan Prediksi ke Profil"}
                  </button>
                  <button
                    type="button"
                    onClick={handleRestartDiagnostic}
                    className="neo-btn inline-flex items-center min-h-[40px] px-3 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#52514E] border border-[#141413] font-mono font-bold text-xs cursor-pointer ml-auto"
                  >
                    Mulai Ulang Tes
                  </button>
                </div>
              </div>
            )}

            {isTyping && <TypingIndicator />}
            {chatError && (
              <div
                role="alert"
                className="p-3.5 rounded-2xl bg-[#FFE5E0] border-2 border-[#141413] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="text-xs sm:text-sm text-[#7A1A12] font-bold">
                  {chatError}
                </div>
                {lastFailedPrompt && (
                  <button
                    type="button"
                    onClick={() => sendMessage(lastFailedPrompt)}
                    className="shrink-0 min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#141413] text-[#B8F348] font-mono font-bold text-xs border border-[#141413] cursor-pointer"
                  >
                    Kirim Ulang
                  </button>
                )}
              </div>
            )}
            {chatMode === "standard" && messages.length === 1 && (
              <div className="pt-2 space-y-2.5">
                <p className="text-xs font-mono font-black uppercase text-[#141413]/70">
                  Contoh Pertanyaan yang Sering Diajukan:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PRESET_QUERIES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => sendMessage(p)}
                      className={`min-h-[48px] text-xs sm:text-sm px-4 py-2.5 rounded-xl border-2 border-[#141413] font-semibold text-left transition-all cursor-pointer ${
                        selectedPreset === p
                          ? "bg-[#B8F348] shadow-[2px_2px_0_#141413]"
                          : "bg-white hover:bg-[#F0ECE1] shadow-[2px_2px_0_#141413]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-3.5 sm:p-4 border-t-2 border-[#141413] bg-white">
            {chatMode === "diagnostic" &&
              diagnosticState?.quickOptions &&
              diagnosticState.quickOptions.length > 0 &&
              diagnosticState.status !== "completed" && (
                <div className="mb-3 space-y-1.5">
                  <span className="text-[11px] font-mono font-bold text-[#52514E] uppercase block">
                    Pilihan Cepat Jawaban Kuesioner (Klik untuk Membalas Langsung):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {diagnosticState.quickOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => sendMessage(opt)}
                        disabled={isTyping}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#B8F348] border-2 border-[#141413] text-[#141413] shadow-[1.5px_1.5px_0_#141413] transition-all cursor-pointer disabled:opacity-50 text-left"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            <div className="flex items-end gap-2.5">
              <textarea
                ref={textareaRef}
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={
                  chatMode === "diagnostic"
                    ? "Ketik jawaban atau pilih opsi kuesioner di atas... (Enter kirim)"
                    : "Ketik pertanyaan atau diskusikan pilihan jurusanmu di sini... (Enter kirim, Shift+Enter baris baru)"
                }
                className="flex-1 min-h-[52px] max-h-36 p-3.5 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] text-sm font-medium placeholder:text-[#141413]/45 focus:bg-white focus:outline-none resize-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping || cooldownSec > 0}
                aria-label="Kirim pertanyaan"
                className="h-13 w-13 shrink-0 rounded-2xl bg-[#FF5E4D] hover:bg-[#ff4b38] disabled:opacity-40 text-white border-2 border-[#141413] shadow-[0_4px_0_#141413] active:translate-y-[3px] active:shadow-none transition-all flex items-center justify-center font-bold cursor-pointer disabled:cursor-not-allowed"
              >
                {cooldownSec > 0 ? (
                  <span className="font-mono text-xs font-black">{cooldownSec}d</span>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                )}
              </button>
            </div>
            <p className="mt-2 text-[11px] font-mono text-[#52514E]">
              Catatan: Rekomendasi AI bersifat pendampingan edukatif untuk orientasi studi dan tidak menggantikan konseling resmi Guru BK maupun syarat penerimaan resmi institusi.
            </p>
          </form>
        </div>

        {/* Conditional Rekomendasi Kampus Terkait Shelf (only shown when typing or results exist) */}
        {(isTyping || activeResults.length > 0) && (
          <section className="mt-6 bg-white border-2 border-[#141413] rounded-3xl p-5 sm:p-6 shadow-[4px_4px_0px_#141413] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-[#3B66FF] uppercase block">
                  Rekomendasi Terdeteksi Otomatis
                </span>
                <h2 className="font-display font-black text-lg sm:text-xl text-[#141413]">
                  Kampus &amp; Jurusan Terkait di {userKabupaten}
                </h2>
              </div>
              <span className="text-xs bg-[#B8F348] border-2 border-[#141413] px-3 py-1 rounded-xl font-mono font-bold">
                {activeResults.length} Bidang Cocok
              </span>
            </div>

            {isTyping && activeResults.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse" aria-busy="true">
                <div className="h-36 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413]/20" />
                <div className="h-36 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413]/20" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeResults.map((item) => (
                  <div
                    key={item.fieldId}
                    className="border-2 border-[#141413] rounded-2xl p-4 shadow-[3px_3px_0_#141413] bg-[#FAF7F2] flex flex-col justify-between gap-3"
                  >
                    <div>
                      <span
                        className={`text-xs font-mono font-black uppercase px-2.5 py-0.5 rounded-lg border-2 border-[#141413] inline-block ${groupColor(
                          item.group
                        )}`}
                      >
                        {item.badgeName}
                      </span>
                      <h3 className="font-display font-black text-base mt-2.5 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#141413]/80 font-medium mt-1 leading-relaxed">
                        {item.reason}
                      </p>
                      <div className="mt-3 space-y-2">
                        {item.recommendedInstitutions.map((inst) => (
                          <div
                            key={inst.name}
                            className="text-xs font-medium bg-white border-2 border-[#141413]/20 rounded-xl px-3 py-2"
                          >
                            <span className="font-bold text-[#141413] block">{inst.name}</span>
                            <span className="text-[#141413]/75 text-xs">
                              {inst.level} &bull; {inst.kabupaten} &bull; ~{inst.distanceKm} km &bull; Akreditasi {inst.akreditasi}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <Link
                        href={`/peta-bidang/${item.fieldId}`}
                        className="inline-flex items-center min-h-[40px] text-xs font-black border-2 border-[#141413] bg-[#141413] text-white rounded-xl px-3.5 py-1.5 hover:bg-[#333]"
                      >
                        Panduan Silabus
                      </Link>
                      <Link
                        href={`/hasil-analisis?field=${item.fieldId}`}
                        className="inline-flex items-center min-h-[40px] text-xs font-black border-2 border-[#141413] bg-[#FFBE2E] rounded-xl px-3.5 py-1.5 hover:bg-[#e6a81f]"
                      >
                        Modul Latihan
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default function AiNavigatorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] text-[#141413] flex items-center justify-center font-mono font-bold text-xs">
          Memuat AI Navigator KertaMarga...
        </div>
      }
    >
      <AiNavigatorContent />
    </Suspense>
  );
}
