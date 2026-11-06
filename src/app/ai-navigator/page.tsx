"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ChatBubble from "@/components/ai-navigator/ChatBubble";
import TypingIndicator from "@/components/ai-navigator/TypingIndicator";
import { matchNavigator, buildChatIntro, type NavigatorResult, type TargetLevel } from "@/lib/ai-matcher";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  results?: NavigatorResult[];
}

const PRESET_QUERIES = [
  "Saya suka coding web dan desain UI/UX",
  "Prospek pariwisata dan perhotelan modern di Bali",
  "Seni visual, animasi, dan budaya Bali",
  "Pertanian organik dan kelautan di Bali",
];

const KABUPATEN = ["Kota Denpasar", "Kabupaten Badung", "Kabupaten Gianyar", "Kabupaten Tabanan", "Kabupaten Buleleng", "Kabupaten Klungkung", "Kabupaten Bangli", "Kabupaten Karangasem", "Kabupaten Jembrana"];

// Halaman AI Navigator versi chatbot Neo-Pop dengan bubble percakapan
// dan streaming jawaban kata demi kata plus dock input fixed di bawah
export default function AiNavigatorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Halo, aku Navigator. Ceritakan minatmu dalam satu kalimat, misal suka coding web atau pariwisata. Aku carikan jurusan yang paling cocok.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamId, setStreamId] = useState<string | null>(null);
  const [activeResults, setActiveResults] = useState<NavigatorResult[]>([]);
  const [userKabupaten, setUserKabupaten] = useState("Kota Denpasar");
  const [targetLevel, setTargetLevel] = useState<TargetLevel>("semua");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    const clean = text.trim();
    if (!clean || isTyping) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: clean };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSelectedPreset(clean);
    setIsTyping(true);

    setTimeout(() => {
      const results = matchNavigator(clean, userKabupaten, targetLevel);
      const fullText = buildChatIntro(results);
      const assistantId = `a-${Date.now()}`;
      setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "", results }]);
      setActiveResults(results);
      setIsTyping(false);
      setStreamId(assistantId);

      // Streaming jawaban kata demi kata agar terasa seperti chatbot
      const words = fullText.split(" ");
      let idx = 0;
      const timer = setInterval(() => {
        idx += 1;
        const partial = words.slice(0, idx).join(" ");
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: partial } : m))
        );
        if (idx >= words.length) {
          clearInterval(timer);
          setStreamId(null);
        }
      }, 28);
    }, 450);
  };

  const stopStream = () => {
    // Hentikan streaming dengan menuntaskan teks yang sudah dikirim
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
    g === "teknologi" ? "bg-[#2D6CDF] text-white" : g === "manusia" ? "bg-[#FF5E4D] text-white" : g === "alam" ? "bg-[#2E9E6B] text-white" : "bg-[#FFBE2E] text-[#141413]";

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#141413] flex flex-col selection:bg-[#B8F348] selection:text-[#141413]">
      <Navbar onOpenLogin={() => {}} onOpenRegister={() => {}} onOpenTest={() => {}} />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-36">
        <div className="flex items-center gap-2 text-xs font-mono text-[#141413]/60 mb-4">
          <Link href="/" className="hover:text-[#141413] underline font-bold">Beranda</Link>
          <span>/</span>
          <span className="text-[#141413] font-black uppercase">AI Navigator</span>
        </div>

        <div className="mb-5">
          <h1 className="font-display font-black text-2xl sm:text-4xl tracking-tight">Konsultasi Jurusan</h1>
          <p className="text-sm text-[#141413]/70 font-medium mt-1">Chat langsung, jawaban disusun dari data terverifikasi Bali.</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-5 items-start">
          <div className="bg-white border-2 border-[#141413] rounded-3xl shadow-[6px_6px_0px_#141413] overflow-hidden flex flex-col" style={{ height: "560px" }}>
            <div className="px-4 sm:px-5 py-3 border-b-2 border-[#141413] bg-[#FAF7F2] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-8 h-8 shrink-0 rounded-xl bg-[#B8F348] border-2 border-[#141413] flex items-center justify-center font-display font-black text-xs">AI</span>
                <div className="min-w-0">
                  <p className="font-display font-black text-sm leading-tight truncate">Navigator KertaMarga</p>
                  <p className="text-[11px] font-bold text-[#0F6E4E] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#1AD598] border border-[#141413]" /> Online sekarang
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden sm:inline-flex text-[10px] font-mono font-bold bg-white border border-[#141413]/20 rounded-lg px-2 py-1 text-[#141413]/70">Deterministik</span>
                {streamId && (
                  <button type="button" onClick={stopStream} className="text-[11px] font-bold border-2 border-[#141413] bg-[#FFBE2E] rounded-lg px-2.5 py-1">Berhenti</button>
                )}
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#FAF7F2]/60">
              {messages.map((m) => (
                <ChatBubble key={m.id} role={m.role} content={m.content} streaming={streamId === m.id} />
              ))}
              {isTyping && <TypingIndicator />}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {PRESET_QUERIES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => sendMessage(p)}
                      className={`text-xs px-3 py-1.5 rounded-xl border-2 border-[#141413] font-medium text-left ${selectedPreset === p ? "bg-[#B8F348]" : "bg-white hover:bg-[#F0ECE1]"}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t-2 border-[#141413] bg-white">
              <div className="flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Tulis minatmu di sini... (Enter kirim, Shift plus Enter baris baru)"
                  className="flex-1 min-h-[44px] max-h-32 p-3 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] text-sm font-medium placeholder:text-[#141413]/40 focus:bg-white focus:outline-none resize-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  aria-label="Kirim pesan"
                  className="h-11 w-11 shrink-0 rounded-2xl bg-[#FF5E4D] hover:bg-[#ff4b38] disabled:opacity-40 text-white border-2 border-[#141413] shadow-[0_4px_0_#141413] active:translate-y-[3px] active:shadow-none transition-all flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="bg-white border-2 border-[#141413] rounded-3xl shadow-[4px_4px_0px_#141413] p-4 space-y-3">
              <div>
                <label htmlFor="kab" className="block text-xs font-mono font-black uppercase mb-1.5">Domisili:</label>
                <select id="kab" value={userKabupaten} onChange={(e) => setUserKabupaten(e.target.value)} className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border-2 border-[#141413] text-xs font-bold focus:outline-none">
                  {KABUPATEN.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <p className="text-xs font-mono font-black uppercase mb-1.5">Jenjang:</p>
                <div className="grid grid-cols-3 gap-2">
                  {(["semua", "smk", "kuliah"] as TargetLevel[]).map((lvl) => (
                    <button key={lvl} type="button" onClick={() => setTargetLevel(lvl)} className={`py-2 rounded-xl text-xs font-mono font-bold uppercase border-2 border-[#141413] ${targetLevel === lvl ? "bg-[#FFBE2E]" : "bg-[#FAF7F2] text-[#141413]/70"}`}>
                      {lvl === "semua" ? "Semua" : lvl === "smk" ? "SMK" : "Kuliah"}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[11px] font-medium text-[#141413]/60 leading-relaxed">Pengaturan ini dipakai untuk pesan berikutnya. Ucapkan minat barumu di dock chat.</p>
            </div>

            <div className="bg-white border-2 border-dashed border-[#141413]/30 rounded-3xl p-4">
              <p className="text-xs font-mono font-black uppercase mb-3">Hasil terakhir</p>
              {activeResults.length === 0 ? (
                <div className="text-center py-4">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-[#FFBE2E] border-2 border-[#141413] flex items-center justify-center font-mono font-black mb-2 shadow-[2px_2px_0_#141413]">?</div>
                  <p className="text-xs font-medium text-[#141413]/70">Belum ada rekomendasi. Kirim pesan dulu.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {activeResults.map((item) => (
                    <div key={item.fieldId} className="border-2 border-[#141413] rounded-2xl p-3.5 shadow-[2px_2px_0_#141413]">
                      <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-lg border-2 border-[#141413] ${groupColor(item.group)}`}>{item.badgeName}</span>
                      <h3 className="font-display font-black text-sm mt-2 leading-snug">{item.title}</h3>
                      <p className="text-xs text-[#141413]/80 font-medium mt-1 leading-relaxed">{item.reason}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {item.careerOutlooks.map((c) => <span key={c} className="text-[11px] px-2 py-0.5 rounded-lg bg-[#FAF7F2] border border-[#141413]/30 font-medium">{c}</span>)}
                      </div>
                      <div className="mt-2 space-y-1.5">
                        {item.recommendedInstitutions.map((inst) => (
                          <div key={inst.name} className="text-xs font-medium bg-[#FAF7F2] border border-[#141413]/20 rounded-xl px-2.5 py-2">
                            <span className="font-bold">{inst.name}</span>
                            <span className="block text-[#141413]/70">{inst.level} • {inst.kabupaten} • {inst.distanceKm} km • {inst.akreditasi}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Link href={`/peta-bidang/${item.fieldId}`} className="text-[11px] font-black border-2 border-[#141413] bg-[#141413] text-white rounded-lg px-2.5 py-1.5">Panduan Bidang</Link>
                        <Link href={`/hasil-analisis?field=${item.fieldId}`} className="text-[11px] font-black border-2 border-[#141413] bg-[#FFBE2E] rounded-lg px-2.5 py-1.5">Modul</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      <div className="fixed bottom-0 inset-x-0 z-30 px-4 sm:px-6 pb-3 sm:pb-4 pt-2 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/95 to-transparent pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">
          <div className="bg-white border-2 border-[#141413] rounded-3xl shadow-[4px_4px_0px_#141413] px-4 py-2.5 flex items-center justify-between gap-3 text-xs font-bold">
            <span className="hidden sm:inline">Tip: tekan Enter untuk kirim, Shift plus Enter untuk baris baru.</span>
            <span className="sm:hidden">Chat AI Navigator</span>
            <Link href="/eksplorasi" className="underline decoration-2 underline-offset-2 hover:text-[#3B66FF]">Tes kuesioner penuh &rarr;</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
