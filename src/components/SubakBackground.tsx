"use client";

import React from "react";

export default function SubakBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Subtle organic contour lines reminiscent of Balinese rice terraces (Subak Jatiluwih) */}
      <svg
        className="absolute top-0 right-0 w-full h-[850px] opacity-[0.22] text-[#B8B0A0]"
        viewBox="0 0 1440 850"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M-50,220 C280,180 520,310 880,240 C1180,180 1340,320 1500,280"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="4 6"
        />
        <path
          d="M-80,340 C260,300 620,440 960,360 C1220,290 1380,430 1520,400"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M-40,460 C320,410 680,560 1040,480 C1280,410 1410,540 1540,510"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="3 5"
        />
        <path
          d="M-60,580 C360,530 740,680 1120,600 C1320,530 1440,650 1560,630"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M-30,700 C400,650 800,790 1200,720 C1380,650 1480,760 1580,740"
          stroke="currentColor"
          strokeWidth="1.2"
        />

        {/* Minimalist Balinese Candi Bentar structural framing lines */}
        <line x1="80" y1="40" x2="80" y2="780" stroke="#DFD9CC" strokeWidth="1" strokeDasharray="6 6" />
        <line x1="1360" y1="40" x2="1360" y2="780" stroke="#DFD9CC" strokeWidth="1" strokeDasharray="6 6" />
      </svg>

      {/* Gentle gradient fade at the bottom to transition smoothly into the value props section */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-canvas to-transparent" />
    </div>
  );
}
