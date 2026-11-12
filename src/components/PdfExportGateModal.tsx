"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export type PdfGateReason = "no-test" | "need-login" | null;

interface PdfExportGateModalProps {
  reason: PdfGateReason;
  onClose: () => void;
  onDeclineLogin?: () => void;
}

export default function PdfExportGateModal({
  reason,
  onClose,
  onDeclineLogin,
}: PdfExportGateModalProps) {
  useEffect(() => {
    if (!reason) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [reason, onClose]);

  if (!reason) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-gate-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141413]/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white border-2 border-[#141413] shadow-[6px_6px_0px_#141413] p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {reason === "no-test" ? (
          <>
            <div className="space-y-1.5">
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#FFBE2E] border border-[#141413] font-mono font-bold text-[11px] uppercase text-[#141413]">
                Belum Ada Hasil Tes
              </span>
              <h2
                id="pdf-gate-title"
                className="font-display font-black text-xl text-[#141413]"
              >
                Kerjakan Tes Terlebih Dahulu
              </h2>
              <p className="text-xs sm:text-sm text-[#52514E] leading-relaxed">
                Anda belum memiliki hasil tes yang tercatat. Silakan kerjakan Tes Eksplorasi Minat atau Survey Keminatan terlebih dahulu untuk bisa mengunduh laporan PDF.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <Link
                href="/eksplorasi"
                onClick={onClose}
                className="neo-btn flex-1 min-h-[42px] px-4 rounded-xl bg-[#B8F348] hover:bg-[#a8e635] text-[#141413] border-2 border-[#141413] font-display font-bold text-xs flex items-center justify-center text-center"
              >
                Mulai Tes Eksplorasi &rarr;
              </Link>
              <Link
                href="/tes-keminatan"
                onClick={onClose}
                className="neo-btn flex-1 min-h-[42px] px-4 rounded-xl bg-[#FAF7F2] hover:bg-[#F0ECE1] text-[#141413] border-2 border-[#141413] font-display font-bold text-xs flex items-center justify-center text-center"
              >
                Survey Minat
              </Link>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full min-h-[38px] rounded-xl text-xs font-mono font-bold text-[#52514E] hover:text-[#141413] cursor-pointer"
            >
              Tutup
            </button>
          </>
        ) : (
          <>
            <div className="space-y-1.5">
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#3B66FF] text-white font-mono font-bold text-[11px] uppercase">
                Login Diperlukan
              </span>
              <h2
                id="pdf-gate-title"
                className="font-display font-black text-xl text-[#141413]"
              >
                Masuk untuk Mengunduh Laporan PDF
              </h2>
              <p className="text-xs sm:text-sm text-[#52514E] leading-relaxed">
                Hasil tes Anda sudah siap. Silakan login ke akun Anda untuk mengunduh laporan PDF. Jika memilih tidak ingin login, Anda tetap bisa melihat hasil di layar namun tidak dapat mengunduh file PDF.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <Link
                href="/login"
                onClick={onClose}
                className="neo-btn flex-1 min-h-[42px] px-4 rounded-xl bg-[#B8F348] hover:bg-[#a8e635] text-[#141413] border-2 border-[#141413] font-display font-bold text-xs flex items-center justify-center text-center"
              >
                Login untuk Unduh PDF &rarr;
              </Link>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDeclineLogin?.();
                }}
                className="flex-1 min-h-[42px] px-4 rounded-xl bg-[#FAF7F2] hover:bg-[#F0ECE1] text-[#52514E] border-2 border-[#141413]/30 font-mono font-bold text-xs cursor-pointer"
              >
                Tidak Ingin Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
