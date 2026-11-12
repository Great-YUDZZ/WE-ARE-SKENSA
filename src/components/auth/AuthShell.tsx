"use client";

import React from "react";

/** Full-viewport edge-to-edge Neo-Pop stage for the unified Dual-Pane Auth portal. */
export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen md:h-screen w-full relative overflow-x-hidden md:overflow-hidden bg-[#FAF7F2] text-[#141413] selection:bg-[#B8F348] selection:text-[#141413]">
      {children}
    </div>
  );
}
