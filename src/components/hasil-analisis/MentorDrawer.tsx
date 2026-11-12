"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { FieldCurriculum, TargetCourse } from "@/data/mentorCurriculum";
import type { WorkspaceTabId } from "./WorkspaceHeader";

export interface MentorChatTurn {
  id: string;
  sender: "student" | "agent";
  text: string;
  diagnosisSummary?: string;
  recommendedItemTitle?: string;
  recommendedActionType?: "materi" | "sertifikasi" | "portofolio" | "siap";
  keyTakeaways?: string[];
  encouragementNote?: string;
  outOfScope?: boolean;
}

interface MentorDrawerProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  curriculum: FieldCurriculum;
  targetCourse: TargetCourse;
  currentReadinessScore: number;
  chatHistory: MentorChatTurn[];
  chatInput: string;
  onChangeInput: (value: string) => void;
  onSendMessage: (customPrompt?: string) => void;
  isLoading: boolean;
  error: string | null;
  lastFailedPrompt: string | null;
  onJumpToTab: (tab: WorkspaceTabId) => void;
}

export default function MentorDrawer({
  isOpen,
  onOpen,
  onClose,
  curriculum,
  targetCourse,
  currentReadinessScore,
  chatHistory,
  chatInput,
  onChangeInput,
  onSendMessage,
  isLoading,
  error,
  lastFailedPrompt,
  onJumpToTab,
}: MentorDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const quickPrompts = [
    `Skor saya ${currentReadinessScore}%, apa langkah pertama mengejar matkul ${targetCourse.name}?`,
    `Jelaskan materi inti ${targetCourse.code} - ${targetCourse.name}`,
    `Tips lulus sertifikasi ${targetCourse.certificationAlignment || curriculum.mainCertificationTitle}`,
  ];

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={onOpen}
          aria-expanded={isOpen}
          className="neo-btn min-h-[48px] px-5 py-3 rounded-2xl bg-[#FFBE2E] hover:bg-[#f2b329] text-[#141413] border-2 border-[#141413] shadow-[4px_4px_0px_#141413] font-display font-black text-xs sm:text-sm flex items-center gap-2.5 cursor-pointer"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#1F7A52] border border-[#141413]" />
          <span>Tanya AI Pembimbing</span>
        </button>
      </div>

      {/* Slide-Over Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-[#141413]/45"
            />

            {/* Drawer Panel */}
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Konsultasi Agen Pembimbing AI"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="relative z-10 w-full max-w-lg h-full bg-white border-l-2 border-[#141413] flex flex-col shadow-[-6px_0px_0px_#141413]"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 bg-[#FAF7F2] border-b-2 border-[#141413] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-xs font-mono font-bold text-[#1F7A52] uppercase block">
                    Agen Pembimbing AI
                  </span>
                  <h2 className="font-display font-black text-base sm:text-lg text-[#141413] truncate">
                    {curriculum.fieldName} ({targetCourse.code})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Tutup panel AI Pembimbing"
                  className="min-h-[40px] min-w-[40px] px-3 rounded-xl bg-white border-2 border-[#141413] font-mono font-bold text-xs text-[#141413] hover:bg-[#F0ECE1] cursor-pointer"
                >
                  Tutup
                </button>
              </div>

              {/* Quick Question Prompts */}
              <div className="p-4 border-b-2 border-[#141413] bg-white space-y-2">
                <span className="text-xs font-mono font-bold text-[#52514E] block">
                  Pertanyaan Cepat
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quickPrompts.map((qText, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSendMessage(qText)}
                      className="text-left px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#B8F348]/30 border border-[#141413] text-xs font-semibold text-[#141413] cursor-pointer transition-colors"
                    >
                      {qText}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF7F2]">
                {chatHistory.map((turn) => (
                  <div
                    key={turn.id}
                    className={`p-4 rounded-2xl border-2 border-[#141413] space-y-2 ${
                      turn.sender === "student"
                        ? "bg-[#3B66FF]/10 ml-6"
                        : "bg-white mr-4"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs font-mono">
                      <span className="font-bold text-[#141413]">
                        {turn.sender === "student" ? "Anda" : "AI Pembimbing"}
                      </span>
                      {turn.diagnosisSummary && (
                        <span
                          className={`px-2 py-0.5 rounded font-bold border border-[#141413] ${
                            turn.outOfScope
                              ? "bg-[#FFBE2E] text-[#141413]"
                              : "bg-[#B8F348] text-[#141413]"
                          }`}
                        >
                          {turn.diagnosisSummary}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-[#141413] leading-relaxed whitespace-pre-line">
                      {turn.text}
                    </p>

                    {turn.keyTakeaways && turn.keyTakeaways.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {turn.keyTakeaways.map((kt, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#141413] font-bold text-[#141413]"
                          >
                            {kt}
                          </span>
                        ))}
                      </div>
                    )}

                    {turn.sender === "agent" && turn.recommendedActionType && !turn.outOfScope && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            onJumpToTab(
                              turn.recommendedActionType === "sertifikasi"
                                ? "sertifikasi"
                                : "materi"
                            );
                            onClose();
                          }}
                          className="neo-btn min-h-[38px] text-xs font-mono font-bold px-3.5 py-1.5 rounded-xl bg-[#3B66FF] text-white border-2 border-[#141413] hover:bg-[#2F55DF] cursor-pointer"
                        >
                          {turn.recommendedActionType === "sertifikasi"
                            ? "Buka Tes Sertifikasi ->"
                            : "Buka Modul & Materi ->"}
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="p-4 rounded-2xl bg-white border-2 border-[#141413] flex items-center gap-3 text-xs font-mono font-bold text-[#52514E]">
                    <span className="w-4 h-4 border-2 border-[#3B66FF] border-t-transparent rounded-full animate-spin" />
                    <span>Menyusun rekomendasi belajar...</span>
                  </div>
                )}

                {error && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-2xl bg-[#FFE5E0] border-2 border-[#141413] flex flex-wrap items-center justify-between gap-2 text-xs text-[#7A1A12]"
                  >
                    <span className="font-bold">{error}</span>
                    {lastFailedPrompt && (
                      <button
                        type="button"
                        onClick={() => onSendMessage(lastFailedPrompt)}
                        className="px-3 py-1.5 rounded-xl bg-[#141413] text-[#B8F348] font-mono font-bold text-xs cursor-pointer"
                      >
                        Coba Ulang
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSendMessage();
                }}
                className="p-4 bg-white border-t-2 border-[#141413] flex gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => onChangeInput(e.target.value)}
                  placeholder={`Tanya soal ${targetCourse.code} atau sertifikasi...`}
                  className="flex-1 min-h-[44px] px-3.5 rounded-xl bg-[#FAF7F2] border-2 border-[#141413] text-xs sm:text-sm text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#3B66FF]"
                />
                <button
                  type="submit"
                  disabled={isLoading || !chatInput.trim()}
                  className="neo-btn min-h-[44px] px-4 rounded-xl bg-[#FFBE2E] hover:bg-[#f2b329] disabled:opacity-50 text-[#141413] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] font-display font-black text-xs sm:text-sm cursor-pointer shrink-0"
                >
                  Kirim
                </button>
              </form>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
