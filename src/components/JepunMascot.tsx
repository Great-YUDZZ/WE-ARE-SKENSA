"use client";

import React from "react";
import { motion } from "framer-motion";

export default function JepunMascot() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="hidden md:flex flex-col items-center select-none pointer-events-none"
    >
      <div className="relative w-28 h-28">
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Stem & Leaves */}
          <path
            d="M60 85 C60 105 52 115 50 120"
            stroke="#2E9E6B"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Leaf Left */}
          <path
            d="M58 95 C45 92 38 100 36 106 C46 108 55 102 58 95Z"
            fill="#2E9E6B"
          />
          {/* Leaf Right pointing down */}
          <path
            d="M62 92 C74 90 84 96 86 104 C76 106 66 100 62 92Z"
            fill="#1F7A52"
          />

          {/* Jepun Petals (5 petals with soft creamy white and bright yellow center) */}
          {/* Top Petal */}
          <path
            d="M60 52 C52 28 68 28 60 12 C52 28 68 28 60 52Z"
            fill="#FFFDF8"
            stroke="#E6E1D6"
            strokeWidth="1.5"
          />
          {/* Petal 1 */}
          <ellipse cx="60" cy="28" rx="14" ry="22" fill="#FFFDF8" stroke="#E6E1D6" strokeWidth="1.5" />
          {/* Petal 2 */}
          <ellipse cx="85" cy="44" rx="20" ry="14" transform="rotate(35 85 44)" fill="#FFFDF8" stroke="#E6E1D6" strokeWidth="1.5" />
          {/* Petal 3 */}
          <ellipse cx="78" cy="74" rx="20" ry="14" transform="rotate(75 78 74)" fill="#FFFDF8" stroke="#E6E1D6" strokeWidth="1.5" />
          {/* Petal 4 */}
          <ellipse cx="42" cy="74" rx="20" ry="14" transform="rotate(-75 42 74)" fill="#FFFDF8" stroke="#E6E1D6" strokeWidth="1.5" />
          {/* Petal 5 */}
          <ellipse cx="35" cy="44" rx="20" ry="14" transform="rotate(-35 35 44)" fill="#FFFDF8" stroke="#E6E1D6" strokeWidth="1.5" />

          {/* Yellow Warm Center */}
          <circle cx="60" cy="52" r="16" fill="#FFC93C" />
          <circle cx="60" cy="52" r="10" fill="#FFAE19" />

          {/* Friendly Eyes */}
          <ellipse cx="55" cy="50" rx="2.5" ry="3.5" fill="#1B1B2F" />
          <ellipse cx="65" cy="50" rx="2.5" ry="3.5" fill="#1B1B2F" />
          {/* Eye reflections */}
          <circle cx="56" cy="49" r="1" fill="#FFFFFF" />
          <circle cx="66" cy="49" r="1" fill="#FFFFFF" />

          {/* Happy Smile */}
          <path
            d="M56 56 Q60 60 64 56"
            stroke="#1B1B2F"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Rosy Cheeks */}
          <circle cx="51" cy="54" r="2.5" fill="#D7263D" opacity="0.35" />
          <circle cx="69" cy="54" r="2.5" fill="#D7263D" opacity="0.35" />
        </svg>
      </div>
      <span className="text-[11px] font-mono font-bold text-kmNeutral-sekunder dark:text-kmNeutral-darkSekunder mt-1">
        Coba tes interaktif di bawah ↓
      </span>
    </motion.div>
  );
}
