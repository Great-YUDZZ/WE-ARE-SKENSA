"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  UnifiedKatalogInstitution,
  getFieldLabelById,
} from "@/data/katalog-adapter";
import {
  UserLocationOrigin,
  buildGoogleMapsDirectionsUrl,
} from "@/data/catalog";

interface InstitutionDetailDrawerProps {
  institution: UnifiedKatalogInstitution | null;
  kabupatenOrigin: string;
  locationOrigin?: UserLocationOrigin;
  originLabel?: string;
  isCompared: boolean;
  onToggleCompare: (institution: UnifiedKatalogInstitution) => void;
  onClose: () => void;
}

export default function InstitutionDetailDrawer({
  institution,
  kabupatenOrigin,
  locationOrigin,
  originLabel,
  isCompared,
  onToggleCompare,
  onClose,
}: InstitutionDetailDrawerProps) {
  useEffect(() => {
    if (!institution) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [institution, onClose]);

  if (!institution) return null;

  const isNegeri = institution.status.toLowerCase().includes("negeri");
  const codeLabel =
    institution.category === "perguruan-tinggi" ? "Kode PT" : "NPSN";

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#141413]/45"
      onClick={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-institution-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl h-full bg-[#FAF7F2] border-l-2 border-[#141413] shadow-[-8px_0_0_#141413] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-white border-b-2 border-[#141413] p-5 sm:p-6 flex items-start justify-between gap-4">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded-lg border-2 border-[#141413] text-xs font-bold ${
                  isNegeri ? "bg-[#B8F348]" : "bg-[#F0ECE1]"
                }`}
              >
                {institution.bentuk} &middot; {institution.status}
              </span>
              {institution.hasAudit && (
                <span className="px-2.5 py-1 rounded-lg bg-[#3B66FF] text-white border-2 border-[#141413] text-xs font-bold">
                  Audit Lengkap
                </span>
              )}
              <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#141413]/40 font-mono text-xs font-bold text-[#141413]">
                {codeLabel}: {institution.code}
              </span>
            </div>

            <h2
              id="drawer-institution-title"
              className="text-xl sm:text-2xl font-display font-black text-[#141413] leading-snug"
            >
              {institution.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup panel detail"
            className="w-10 h-10 rounded-xl bg-white hover:bg-[#F0ECE1] border-2 border-[#141413] shadow-[2px_2px_0px_#141413] flex items-center justify-center font-display font-black text-base text-[#141413] shrink-0 cursor-pointer"
          >
            X
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Lokasi & Jarak */}
          <div className="bg-white border-2 border-[#141413] rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wide text-[#52514E]">
                Lokasi Kampus / Sekolah
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#1AD598]/25 border border-[#141413] text-xs font-bold text-[#141413]">
                ~{institution.estimatedDistanceKm} km dari {originLabel ?? kabupatenOrigin}
              </span>
            </div>
            <p className="text-base font-bold text-[#141413]">
              {institution.kabupaten}
            </p>
            <p className="text-sm sm:text-base text-[#52514E] leading-relaxed">
              {institution.address}
            </p>
          </div>

          {/* Audit Spotlight Data (Biaya, Akreditasi, Fasilitas) */}
          {institution.hasAudit && (
            <div className="space-y-3">
              <h3 className="text-lg font-display font-extrabold text-[#141413]">
                Sorotan Audit Sumber Resmi
              </h3>
              {institution.auditSpotlights.map((audit) => (
                <div
                  key={audit.institutionId}
                  className="bg-white border-2 border-[#141413] rounded-2xl p-4 sm:p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm sm:text-base font-display font-bold text-[#3B66FF]">
                      {audit.programName}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#B8F348] border border-[#141413] text-xs font-bold text-[#141413]">
                      Akreditasi: {audit.accreditation}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm sm:text-base text-[#141413]">
                    <p>
                      <strong>Estimasi Biaya:</strong>{" "}
                      <span className="text-[#52514E]">
                        {audit.tuitionFeeText}
                      </span>
                    </p>
                    <p>
                      <strong>Fasilitas Kunci:</strong>{" "}
                      <span className="text-[#52514E]">
                        {audit.facilitiesText}
                      </span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#141413]/15 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                    <span className="text-[#52514E]">
                      Sumber: <strong>{audit.source.publisher}</strong> (
                      {audit.source.checkDate})
                    </span>
                    <a
                      href={audit.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#3B66FF] underline"
                    >
                      Buka Portal Resmi
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Semua Program Studi / Keahlian */}
          <div className="space-y-3">
            <h3 className="text-lg font-display font-extrabold text-[#141413]">
              Daftar Lengkap Program ({institution.programs.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {institution.programs.map((programName) => (
                <span
                  key={programName}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#141413]/40 text-xs sm:text-sm font-medium text-[#141413]"
                >
                  {programName}
                </span>
              ))}
            </div>
          </div>

          {/* Keterkaitan ke Peta Bidang */}
          {institution.matchedFields.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-display font-extrabold text-[#141413]">
                Eksplorasi Peta Bidang Terkait
              </h3>
              <div className="flex flex-wrap gap-2">
                {institution.matchedFields.map((fieldId) => (
                  <Link
                    key={fieldId}
                    href={`/peta-bidang/${fieldId}?kabupaten=${encodeURIComponent(
                      kabupatenOrigin
                    )}`}
                    className="px-3.5 py-2 rounded-xl bg-[#FFBE2E] hover:bg-[#ffd262] border-2 border-[#141413] text-xs sm:text-sm font-display font-bold text-[#141413] transition-colors"
                  >
                    {getFieldLabelById(fieldId)} -&gt;
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer Actions */}
        <div className="bg-white border-t-2 border-[#141413] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onToggleCompare(institution)}
            className={`neo-btn px-4 py-2.5 rounded-xl text-sm font-display font-bold cursor-pointer ${
              isCompared
                ? "bg-[#141413] text-[#B8F348]"
                : "bg-[#FAF7F2] text-[#141413]"
            }`}
          >
            {isCompared ? "Sudah di Perbandingan" : "+ Tambah ke Bandingkan"}
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {locationOrigin &&
              (locationOrigin.source === "address" ||
                locationOrigin.source === "gps") && (
                <a
                  href={buildGoogleMapsDirectionsUrl(locationOrigin, institution)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neo-btn px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF7F2] text-sm font-display font-bold text-[#141413]"
                >
                  Rute dari Alamat Anda
                </a>
              )}
            <a
              href={institution.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn px-4 py-2.5 rounded-xl bg-[#B8F348] text-sm font-display font-bold text-[#141413]"
            >
              Buka Peta Google Maps
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
