"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { UnifiedKatalogInstitution } from "@/data/katalog-adapter";
import {
  UserLocationOrigin,
  buildGoogleMapsDirectionsUrl,
} from "@/data/catalog";

interface CompareInstitutionsModalProps {
  isOpen: boolean;
  items: UnifiedKatalogInstitution[];
  kabupatenOrigin: string;
  locationOrigin?: UserLocationOrigin;
  originLabel?: string;
  onRemoveItem: (id: string) => void;
  onClose: () => void;
}

export default function CompareInstitutionsModal({
  isOpen,
  items,
  kabupatenOrigin,
  locationOrigin,
  originLabel,
  onRemoveItem,
  onClose,
}: CompareInstitutionsModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen || items.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#141413]/55 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="compare-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl max-h-[90vh] bg-white border-2 border-[#141413] rounded-3xl shadow-[8px_8px_0px_#141413] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b-2 border-[#141413] bg-[#FAF7F2] flex items-center justify-between gap-4">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-lg bg-[#B8F348] border border-[#141413] text-xs font-bold text-[#141413]">
              Perbandingan Lembaga
            </span>
            <h2
              id="compare-modal-title"
              className="text-xl sm:text-2xl font-display font-black text-[#141413] mt-1"
            >
              Membandingkan {items.length} Institusi di Bali
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal perbandingan"
            className="w-10 h-10 rounded-xl bg-white hover:bg-[#F0ECE1] border-2 border-[#141413] shadow-[2px_2px_0px_#141413] font-display font-black text-base text-[#141413] shrink-0 cursor-pointer"
          >
            X
          </button>
        </div>

        {/* Comparison Table Body */}
        <div className="flex-1 overflow-auto p-5 sm:p-6">
          <div className="min-w-[640px] border-2 border-[#141413] rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF7F2] border-b-2 border-[#141413]">
                  <th className="p-4 w-44 text-xs sm:text-sm font-display font-extrabold text-[#141413] border-r border-[#141413]/20 align-top">
                    Aspek Perbandingan
                  </th>
                  {items.map((item) => (
                    <th
                      key={item.id}
                      className="p-4 text-sm sm:text-base font-display font-black text-[#141413] border-r last:border-r-0 border-[#141413]/20 align-top"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span>{item.name}</span>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="px-2 py-0.5 rounded-md bg-white border border-[#141413] text-xs font-bold text-[#FF5E4D] hover:bg-[#FAF7F2] cursor-pointer shrink-0"
                        >
                          Hapus
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141413]/15 text-sm sm:text-base">
                <tr>
                  <td className="p-4 font-bold text-[#52514E] border-r border-[#141413]/20 align-top">
                    Bentuk &amp; Status
                  </td>
                  {items.map((item) => (
                    <td
                      key={`${item.id}-status`}
                      className="p-4 border-r last:border-r-0 border-[#141413]/20 align-top"
                    >
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#141413] text-xs font-bold text-[#141413]">
                        {item.bentuk} &middot; {item.status}
                      </span>
                      <p className="text-xs font-mono text-[#52514E] mt-1.5">
                        Kode: {item.code}
                      </p>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-[#52514E] border-r border-[#141413]/20 align-top">
                    Lokasi &amp; Jarak
                  </td>
                  {items.map((item) => (
                    <td
                      key={`${item.id}-loc`}
                      className="p-4 border-r last:border-r-0 border-[#141413]/20 align-top space-y-1"
                    >
                      <p className="font-bold text-[#141413]">
                        ~{item.estimatedDistanceKm} km dari {originLabel ?? kabupatenOrigin}
                      </p>
                      <p className="text-sm text-[#52514E]">
                        {item.kabupaten} - {item.address}
                      </p>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-[#52514E] border-r border-[#141413]/20 align-top">
                    Program / Keahlian
                  </td>
                  {items.map((item) => (
                    <td
                      key={`${item.id}-prog`}
                      className="p-4 border-r last:border-r-0 border-[#141413]/20 align-top space-y-2"
                    >
                      <p className="text-xs font-bold text-[#52514E]">
                        Total {item.programs.length} program
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.programs.slice(0, 5).map((prog) => (
                          <span
                            key={prog}
                            className="px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#141413]/25 text-xs font-medium text-[#141413]"
                          >
                            {prog}
                          </span>
                        ))}
                        {item.programs.length > 5 && (
                          <span className="text-xs font-bold text-[#3B66FF]">
                            +{item.programs.length - 5} lainnya
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-[#52514E] border-r border-[#141413]/20 align-top">
                    Audit Biaya &amp; Akreditasi
                  </td>
                  {items.map((item) => (
                    <td
                      key={`${item.id}-audit`}
                      className="p-4 border-r last:border-r-0 border-[#141413]/20 align-top"
                    >
                      {item.hasAudit ? (
                        <div className="space-y-1.5 text-sm">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-[#B8F348] border border-[#141413] text-xs font-bold">
                            Akreditasi: {item.auditSpotlights[0].accreditation}
                          </span>
                          <p className="text-[#141413] font-medium">
                            {item.auditSpotlights[0].tuitionFeeText}
                          </p>
                          <p className="text-xs text-[#52514E]">
                            Fasilitas: {item.auditSpotlights[0].facilitiesText}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs sm:text-sm text-[#52514E]">
                          Belum tercantum di sampel audit biaya UKT. Periksa portal resmi lembaga atau PDDIKTI.
                        </p>
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-[#52514E] border-r border-[#141413]/20 align-top">
                    Aksi Cepat
                  </td>
                  {items.map((item) => (
                    <td
                      key={`${item.id}-act`}
                      className="p-4 border-r last:border-r-0 border-[#141413]/20 align-top space-y-2"
                    >
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={item.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-3 py-1.5 rounded-xl bg-white hover:bg-[#B8F348] border-2 border-[#141413] text-xs font-display font-bold text-[#141413]"
                        >
                          Buka Peta
                        </a>
                        {locationOrigin &&
                          (locationOrigin.source === "address" ||
                            locationOrigin.source === "gps") && (
                            <a
                              href={buildGoogleMapsDirectionsUrl(
                                locationOrigin,
                                item
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block px-3 py-1.5 rounded-xl bg-[#B8F348] hover:bg-[#c8f76b] border-2 border-[#141413] text-xs font-display font-bold text-[#141413]"
                            >
                              Rute dari Alamat
                            </a>
                          )}
                      </div>
                      {item.matchedFields[0] && (
                        <div>
                          <Link
                            href={`/peta-bidang/${item.matchedFields[0]}?kabupaten=${encodeURIComponent(
                              kabupatenOrigin
                            )}`}
                            className="text-xs font-bold text-[#3B66FF] underline"
                          >
                            Lihat Peta Bidang Terkait
                          </Link>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
