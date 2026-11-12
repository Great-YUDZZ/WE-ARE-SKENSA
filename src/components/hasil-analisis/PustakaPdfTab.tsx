"use client";

import React from "react";
import type { FieldCurriculum } from "@/data/mentorCurriculum";
import type { PustakaDokumenItem } from "@/app/api/pustaka-modul/route";

interface PustakaPdfTabProps {
  curriculum: FieldCurriculum;
  pustakaDocs: PustakaDokumenItem[];
  pustakaScope: "FIELD" | "ALL_FIELDS";
  onToggleScope: () => void;
  onReload: () => void;
  isLoading: boolean;
  error: string | null;
  activePreviewPdfUrl: string;
  activePreviewPdfTitle: string;
  onSelectPdf: (url: string, title: string) => void;
}

export default function PustakaPdfTab({
  curriculum,
  pustakaDocs,
  pustakaScope,
  onToggleScope,
  onReload,
  isLoading,
  error,
  activePreviewPdfUrl,
  activePreviewPdfTitle,
  onSelectPdf,
}: PustakaPdfTabProps) {
  return (
    <div className="neo-card rounded-2xl bg-white p-5 sm:p-7 border-2 border-[#141413] shadow-[4px_4px_0px_#141413] space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-[#141413]">
        <div>
          <span className="text-xs font-mono font-bold text-[#3B66FF] uppercase tracking-wider">
            Pustaka Buku Ajar &amp; Praktikum
          </span>
          <h2 className="font-display font-black text-xl sm:text-2xl text-[#141413] mt-0.5">
            Pustaka Modul PDF:{" "}
            {pustakaScope === "FIELD"
              ? curriculum.fieldName
              : "Semua Jurusan (33 PDF)"}
          </h2>
          <p className="text-xs sm:text-sm text-[#52514E] mt-1 font-medium">
            Pilih dokumen di sebelah kiri untuk membaca langsung atau mengunduh salinan PDF.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleScope}
            className={`neo-btn min-h-[44px] px-4 rounded-xl border-2 border-[#141413] font-mono font-bold text-xs cursor-pointer ${
              pustakaScope === "ALL_FIELDS"
                ? "bg-[#3B66FF] text-white shadow-[2px_2px_0px_#141413]"
                : "bg-[#FAF7F2] text-[#141413] hover:bg-[#F0ECE1]"
            }`}
          >
            {pustakaScope === "FIELD"
              ? "Tampilkan Semua Jurusan"
              : `Fokus ${curriculum.fieldName}`}
          </button>
          <button
            type="button"
            onClick={onReload}
            className="neo-btn min-h-[44px] px-4 rounded-xl bg-white border-2 border-[#141413] hover:bg-[#FAF7F2] text-[#141413] font-mono font-bold text-xs cursor-pointer"
          >
            Muat Ulang
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-[#FFE5E0] border-2 border-[#141413] flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-[#7A1A12]"
        >
          <span className="font-bold">{error}</span>
          <button
            type="button"
            onClick={onReload}
            className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#141413] text-[#B8F348] font-mono font-bold text-xs cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-pulse">
          <div className="lg:col-span-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413]"
              />
            ))}
          </div>
          <div className="lg:col-span-8 h-[460px] lg:h-[620px] rounded-2xl bg-[#FAF7F2] border-2 border-[#141413]" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && pustakaDocs.length === 0 && (
        <div className="p-8 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] text-center space-y-2">
          <p className="font-display font-black text-base text-[#141413]">
            Belum ada dokumen PDF pada kategori ini
          </p>
          <p className="text-xs sm:text-sm text-[#52514E]">
            Coba beralih ke semua jurusan atau muat ulang daftar dokumen.
          </p>
        </div>
      )}

      {/* 4:8 Split Layout: Document List + Interactive PDF Reader */}
      {!isLoading && pustakaDocs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left 4 Cols: Clean PDF Cards */}
          <div className="lg:col-span-4 space-y-3 max-h-[620px] overflow-y-auto pr-1">
            {pustakaDocs.map((doc) => {
              const isSelected = activePreviewPdfUrl === doc.fileUrl;
              return (
                <div
                  key={doc.id}
                  className={`p-4 rounded-2xl border-2 border-[#141413] transition-all space-y-3 ${
                    isSelected
                      ? "bg-[#B8F348]/25 shadow-[4px_4px_0px_#141413]"
                      : "bg-[#FAF7F2] hover:bg-white"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2 text-xs font-mono text-[#52514E]">
                      <span className="font-bold text-[#3B66FF] uppercase truncate">
                        {doc.certStandard}
                      </span>
                      <span className="shrink-0">{doc.fileSizeKb} KB</span>
                    </div>
                    <h3 className="font-display font-black text-sm text-[#141413] leading-snug">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-[#52514E] line-clamp-2">
                      {doc.category} &bull; {doc.author}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectPdf(doc.fileUrl, doc.title)}
                      className={`flex-1 min-h-[40px] px-3 py-1.5 rounded-xl border-2 border-[#141413] font-mono font-bold text-xs cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-[#141413] text-[#B8F348]"
                          : "bg-[#3B66FF] text-white hover:bg-[#2F55DF]"
                      }`}
                    >
                      {isSelected ? "Sedang Dibaca" : "Baca PDF"}
                    </button>
                    <a
                      href={doc.fileUrl}
                      download={doc.filename}
                      className="inline-flex items-center justify-center min-h-[40px] px-3 py-1.5 rounded-xl bg-white border-2 border-[#141413] font-mono font-bold text-xs text-[#141413] hover:bg-[#FAF7F2]"
                    >
                      Unduh
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right 8 Cols: Interactive Embedded PDF Reader */}
          <div className="lg:col-span-8 flex flex-col rounded-2xl border-2 border-[#141413] bg-[#FAF7F2] shadow-[4px_4px_0px_#141413] overflow-hidden">
            <div className="p-3.5 sm:p-4 bg-white border-b-2 border-[#141413] flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-0.5">
                <span className="text-xs font-mono font-bold text-[#3B66FF] uppercase block">
                  Pembaca Dokumen PDF
                </span>
                <h4 className="font-display font-bold text-sm text-[#141413] truncate">
                  {activePreviewPdfTitle || "Pilih dokumen PDF di sebelah kiri"}
                </h4>
              </div>

              {activePreviewPdfUrl && (
                <a
                  href={activePreviewPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neo-btn inline-flex items-center min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#3B66FF] text-white border-2 border-[#141413] font-mono font-bold text-xs hover:bg-[#2F55DF] shrink-0"
                >
                  Buka Layar Penuh &rarr;
                </a>
              )}
            </div>

            {activePreviewPdfUrl ? (
              <iframe
                src={activePreviewPdfUrl}
                title={activePreviewPdfTitle}
                className="w-full h-[460px] lg:h-[620px] bg-white"
              />
            ) : (
              <div className="h-[460px] lg:h-[620px] flex items-center justify-center text-xs sm:text-sm font-mono font-bold text-[#52514E] p-6 text-center">
                Pilih salah satu modul PDF untuk membaca langsung di halaman ini.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
