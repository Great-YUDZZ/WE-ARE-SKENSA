"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VIBE_CARDS, GROUP_CONFIG, VibeCardItem } from "@/data/fields";

interface InteractiveCompassWidgetProps {
  onOpenTest: (fieldId?: string) => void;
  onSelectVibe?: (vibe: VibeCardItem) => void;
}

export default function InteractiveCompassWidget({
  onOpenTest,
  onSelectVibe,
}: InteractiveCompassWidgetProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lockedVibeIds, setLockedVibeIds] = useState<string[]>(["vibe-tech"]);

  const currentCard = VIBE_CARDS[currentIndex];
  const groupConfig = GROUP_CONFIG[currentCard.group];
  const isLocked = lockedVibeIds.includes(currentCard.id);

  const handleNextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % VIBE_CARDS.length);
  };

  const handlePrevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + VIBE_CARDS.length) % VIBE_CARDS.length);
  };

  const handleLockVibe = () => {
    if (!lockedVibeIds.includes(currentCard.id)) {
      setLockedVibeIds([...lockedVibeIds, currentCard.id]);
    }
    if (onSelectVibe) {
      onSelectVibe(currentCard);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto lg:max-w-none relative">
      {/* Decorative Background Stack Layer */}
      <div
        className="hidden sm:block absolute inset-0 translate-x-3 translate-y-3 rounded-3xl bg-[#FFBE2E] border-2 border-[#141413] pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Tactile Deck Console */}
      <div className="relative bg-white border-2 border-[#141413] rounded-3xl p-5 sm:p-6 shadow-[6px_6px_0px_#141413] flex flex-col justify-between">
        {/* Top Console Bar */}
        <div className="flex items-center justify-between gap-2 pb-4 border-b-2 border-[#141413]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF5E4D] border-2 border-[#141413]" />
            <span className="w-3 h-3 rounded-full bg-[#FFBE2E] border-2 border-[#141413]" />
            <span className="w-3 h-3 rounded-full bg-[#B8F348] border-2 border-[#141413]" />
            <span className="ml-1 text-xs font-mono font-bold text-[#141413] uppercase tracking-wider">
              VIBE MATCHER DECK
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-[#B8F348] text-[#141413] border-2 border-[#141413]">
              {currentIndex + 1} / {VIBE_CARDS.length} KARTU
            </span>
          </div>
        </div>

        {/* Quick Vibe Selector Pills */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1">
          {VIBE_CARDS.map((card, idx) => {
            const active = idx === currentIndex;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold border-2 transition-all cursor-pointer shrink-0 ${
                  active
                    ? "bg-[#141413] text-[#B8F348] border-[#141413] shadow-[2px_2px_0px_#3B66FF]"
                    : "bg-[#F0ECE1] text-[#52514E] border-[#141413]/30 hover:border-[#141413] hover:text-[#141413]"
                }`}
              >
                {card.cardNumber}
              </button>
            );
          })}
        </div>

        {/* Animated Active Vibe Card */}
        <div className="mt-3 relative min-h-[270px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard.id}
              initial={{ opacity: 0, x: 24, rotate: 1.5 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, x: -24, rotate: -1.5 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] shadow-[4px_4px_0px_#141413] flex flex-col justify-between gap-4"
            >
              {/* Card Header Tag & Match Score */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span
                    className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border-2 border-[#141413] uppercase"
                    style={{
                      backgroundColor: currentCard.accentBg,
                      color: currentCard.accentText,
                    }}
                  >
                    {groupConfig.shortLabel}
                  </span>

                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-white border-2 border-[#141413] text-[#141413]">
                    Frekuensi Cocok: {currentCard.matchPercentage}%
                  </span>
                </div>

                {/* Activity Headline */}
                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#141413] leading-tight">
                  {currentCard.vibeTitle}
                </h3>

                {/* Relatable Student Quote */}
                <p className="mt-2.5 text-xs sm:text-sm text-[#52514E] bg-white p-3 rounded-xl border-2 border-[#141413]/20 font-medium leading-relaxed">
                  &ldquo;{currentCard.studentQuote}&rdquo;
                </p>

                {/* Skill / Activity Sticker Chips */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {currentCard.activityTags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-[#F0ECE1] border border-[#141413] text-[#141413]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Instant Matched Major & Bali Campus Box */}
              <div className="p-3.5 rounded-xl bg-[#141413] text-white border-2 border-[#141413] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#B8F348] uppercase tracking-wider block">
                    REKOMENDASI INSTAN DI BALI:
                  </span>
                  <p className="font-display font-bold text-sm sm:text-base text-white leading-snug mt-0.5">
                    {currentCard.matchedMajor}
                  </p>
                  <p className="text-xs text-[#F0ECE1]/80 mt-0.5">
                    {currentCard.matchedCampus} ({currentCard.matchedLocation})
                  </p>
                </div>
                {isLocked && (
                  <span className="self-start sm:self-center shrink-0 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-[#B8F348] text-[#141413]">
                    TERSIMPAN
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Deck Controls: Prev / Next Vibe + Lock Vibe */}
        <div className="mt-4 pt-3 border-t-2 border-[#141413]/15 grid grid-cols-12 gap-2.5">
          <button
            type="button"
            onClick={handlePrevCard}
            className="col-span-3 neo-btn h-11 rounded-xl bg-[#F0ECE1] hover:bg-[#e5dfd0] text-[#141413] font-mono font-bold text-xs flex items-center justify-center cursor-pointer"
            aria-label="Kartu sebelumnya"
          >
            &larr; Geser
          </button>

          <button
            type="button"
            onClick={handleLockVibe}
            className="col-span-5 neo-btn h-11 rounded-xl bg-[#B8F348] hover:bg-[#a8e635] text-[#141413] font-display font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Ini Gue Banget!</span>
          </button>

          <button
            type="button"
            onClick={handleNextCard}
            className="col-span-4 neo-btn h-11 rounded-xl bg-[#FFBE2E] hover:bg-[#f5b21d] text-[#141413] font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Ganti Vibe</span>
            <span className="font-mono">&rarr;</span>
          </button>
        </div>

        {/* Bottom Direct Link to Full Questionnaire */}
        <div className="mt-3 flex items-center justify-between text-xs px-1">
          <span className="font-mono text-[11px] text-[#52514E]">
            {lockedVibeIds.length} vibe dikunci buat simulasi
          </span>
          <button
            type="button"
            onClick={() => onOpenTest(currentCard.matchedFieldId)}
            className="font-display font-bold text-xs text-[#3B66FF] hover:underline cursor-pointer"
          >
            Lanjut Tes Kuesioner Penuh &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
