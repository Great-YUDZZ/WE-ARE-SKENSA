"use client";

import React from "react";

// Indikator mengetik tiga titik dengan animasi pantul halus
export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-white border-2 border-[#141413] shadow-[3px_3px_0px_#141413] rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#141413] animate-bounce" />
        <span className="w-2 h-2 rounded-full bg-[#141413] animate-bounce [animation-delay:120ms]" />
        <span className="w-2 h-2 rounded-full bg-[#141413] animate-bounce [animation-delay:240ms]" />
        <span className="ml-2 text-[11px] font-bold text-[#52514E]">AI menulis</span>
      </div>
    </div>
  );
}
