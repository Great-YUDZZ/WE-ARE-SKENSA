"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  UserLocationOrigin,
  searchLocalBaliAreas,
} from "@/data/catalog";

interface LocationOriginControlProps {
  id?: string;
  label?: string;
  origin: UserLocationOrigin;
  isDetecting?: boolean;
  isGeocoding?: boolean;
  locationNote?: string | null;
  onChangeManualKabupaten: (kabupaten: string) => void;
  onSubmitManualAddress?: (
    address: string,
    preferredKabupaten?: string
  ) => void | Promise<unknown>;
  onDetectLocation?: () => void | Promise<unknown>;
  compact?: boolean;
}

export default function LocationOriginControl({
  id = "select-lokasi-asal",
  label = "Alamat Rumah Anda (untuk Hitung Jarak)",
  origin,
  isGeocoding = false,
  locationNote,
  onChangeManualKabupaten,
  onSubmitManualAddress,
}: LocationOriginControlProps) {
  const [addressDraft, setAddressDraft] = useState(origin.addressQuery ?? "");

  useEffect(() => {
    setAddressDraft(origin.addressQuery ?? "");
  }, [origin.addressQuery]);

  const localSuggestions = useMemo(
    () => searchLocalBaliAreas(addressDraft),
    [addressDraft]
  );

  const datalistId = `${id}-bali-areas`;
  const addressInputId = `${id}-address`;
  const isAddressMode = origin.source === "address";

  const handleApplyAddress = () => {
    if (!onSubmitManualAddress) return;
    void onSubmitManualAddress(addressDraft);
  };

  const handleClearAddress = () => {
    setAddressDraft("");
    onChangeManualKabupaten("Kota Denpasar");
  };

  return (
    <div id={id} className="space-y-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label
          htmlFor={addressInputId}
          className="block text-xs sm:text-sm font-bold text-[#141413]"
        >
          {label}
        </label>

        {isAddressMode && (
          <span className="px-2 py-0.5 rounded-md border border-[#141413] bg-[#B8F348] text-[#141413] text-xs font-bold">
            Alamat Rumah Aktif
          </span>
        )}
      </div>

      {/* Input Alamat Rumah Tunggal */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            id={addressInputId}
            type="text"
            list={datalistId}
            value={addressDraft}
            onChange={(e) => setAddressDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleApplyAddress();
              }
            }}
            placeholder="Ketik alamat rumah Anda (cth: Jl. Tukad Yeh Aya No. 12, Panjer, Denpasar)"
            className="w-full min-h-[44px] px-3 py-2 rounded-xl border-2 border-[#141413] bg-white text-xs sm:text-sm font-medium text-[#141413] placeholder:text-[#52514E]/75 focus:outline-none focus:ring-2 focus:ring-[#3B66FF]"
          />
          <datalist id={datalistId}>
            {localSuggestions.map((item) => (
              <option key={item.label} value={item.label} />
            ))}
          </datalist>
        </div>

        <button
          type="button"
          disabled={isGeocoding}
          onClick={handleApplyAddress}
          className="min-h-[44px] px-4 py-2 rounded-xl border-2 border-[#141413] bg-[#B8F348] hover:bg-[#c8f76b] disabled:opacity-60 text-xs sm:text-sm font-display font-bold text-[#141413] shadow-[2px_2px_0px_#141413] shrink-0 cursor-pointer transition-colors"
        >
          {isGeocoding ? "Mencari..." : "Pakai Alamat"}
        </button>
      </div>

      {/* Status / Feedback */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#52514E] pt-0.5">
        <span>
          {isGeocoding
            ? "Sedang mencari titik koordinat alamat rumah Anda..."
            : locationNote
              ? locationNote
              : isAddressMode
                ? `Acuan jarak dari: ${origin.areaLabel || origin.addressQuery || origin.kabupaten}.`
                : `Acuan default sementara: pusat ${origin.kabupaten}. Ketik alamat rumah di atas agar akurat.`}
        </span>
        {isAddressMode && (
          <button
            type="button"
            onClick={handleClearAddress}
            className="font-bold text-[#3B66FF] underline cursor-pointer shrink-0"
          >
            Hapus Alamat
          </button>
        )}
      </div>
    </div>
  );
}
