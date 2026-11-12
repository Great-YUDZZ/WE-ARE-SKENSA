"use client";

import React from "react";
import Link from "next/link";

interface SurveyRequiredGateProps {
  onStartPreview?: () => void;
  previewFieldName?: string;
  targetFieldId?: string;
}

export default function SurveyRequiredGate({
  onStartPreview,
  previewFieldName,
  targetFieldId,
}: SurveyRequiredGateProps) {
  const surveyHref = targetFieldId
    ? `/tes-keminatan?field=${encodeURIComponent(targetFieldId)}`
    : "/tes-keminatan";

  return (
    <section className="max-w-2xl mx-auto py-8 sm:py-14">
      <div className="neo-card rounded-3xl bg-white p-6 sm:p-10 border-2 border-[#141413] shadow-[6px_6px_0px_#141413] space-y-6 text-center">
        <div className="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-[#FFBE2E] border-2 border-[#141413] text-xs font-mono font-bold text-[#141413] uppercase">
          Survey Keminatan Diperlukan
        </div>

        <div className="space-y-2.5">
          <h1 className="font-display font-black text-2xl sm:text-3xl text-[#141413] leading-tight">
            Ikuti Survey Tes Keminatan Terlebih Dahulu
          </h1>
          <p className="text-sm sm:text-base text-[#52514E] leading-relaxed font-medium">
            Skor kesiapan, rencana belajar, modul materi, dan latihan sertifikasi pada halaman ini dihitung langsung dari hasil Survey Tes Keminatan Anda.
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] text-left space-y-2 text-xs sm:text-sm text-[#141413]">
          <p className="font-mono font-bold text-xs text-[#3B66FF] uppercase">
            Yang Akan Anda Dapatkan Setelah Survey:
          </p>
          <ul className="space-y-1.5 font-medium text-[#52514E]">
            <li>1. Skor kesiapan awal terhadap mata kuliah target jurusan Anda.</li>
            <li>2. Rekomendasi 4 langkah perbaikan dan modul masterclass terarah.</li>
            <li>3. Akses Pustaka PDF dan simulasi soal uji kompetensi resmi.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href={surveyHref}
            className="neo-btn w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-xl bg-[#B8F348] hover:bg-[#a8e635] text-[#141413] border-2 border-[#141413] shadow-[4px_4px_0px_#141413] font-display font-black text-sm cursor-pointer"
          >
            Mulai Survey Tes Keminatan &rarr;
          </Link>
          <Link
            href="/peta-bidang"
            className="neo-btn w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#141413] border-2 border-[#141413] font-display font-bold text-sm cursor-pointer"
          >
            Lihat Peta Bidang
          </Link>
        </div>

        {onStartPreview && (
          <div className="pt-2 border-t border-[#141413]/15">
            <button
              type="button"
              onClick={onStartPreview}
              className="text-xs font-mono font-bold text-[#3B66FF] hover:underline cursor-pointer"
            >
              Atau pratinjau langsung modul &amp; pustaka PDF
              {previewFieldName ? ` (${previewFieldName})` : ""} tanpa skor survey &rarr;
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
