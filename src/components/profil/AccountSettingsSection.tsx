"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import LocationOriginControl from "@/components/LocationOriginControl";
import { FIELDS } from "@/data/fields";
import type { UserLocationOrigin } from "@/data/catalog";
import type { SafeUser } from "@/lib/schema";

interface AccountSettingsSectionProps {
  user: SafeUser | null;
  authLoading: boolean;
  isSavingAccount: boolean;
  isSyncingServer: boolean;
  lastSyncedAt: string | null;
  onUpdateAccount: (payload: { name: string; interests: string[] }) => Promise<void>;
  onManualSyncServer: () => Promise<void>;
  onExportMarkdown: () => void;
  onDownloadTestHtml?: () => void;
  onPrintTestPdf?: () => void;
  onLogout: () => Promise<void>;
  origin: UserLocationOrigin;
  isDetectingLocation: boolean;
  isGeocodingLocation: boolean;
  locationNote: string | null;
  onChangeManualKabupaten: (kab: string) => void;
  onSubmitManualAddress: (address: string, preferredKab?: string) => Promise<unknown>;
  onDetectLocation: () => Promise<unknown>;
}

export default function AccountSettingsSection({
  user,
  authLoading,
  isSavingAccount,
  isSyncingServer,
  lastSyncedAt,
  onUpdateAccount,
  onManualSyncServer,
  onExportMarkdown,
  onDownloadTestHtml,
  onPrintTestPdf,
  onLogout,
  origin,
  isDetectingLocation,
  isGeocodingLocation,
  locationNote,
  onChangeManualKabupaten,
  onSubmitManualAddress,
  onDetectLocation,
}: AccountSettingsSectionProps) {
  const [nameDraft, setNameDraft] = useState(user?.name || "");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    user?.interests || []
  );
  const [customInterest, setCustomInterest] = useState("");
  const [accountError, setAccountError] = useState<string | null>(null);

  useEffect(() => {
    setNameDraft(user?.name || "");
    setSelectedInterests(user?.interests || []);
  }, [user]);

  const toggleInterest = (label: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(label)) {
        return prev.filter((item) => item !== label);
      }
      if (prev.length >= 15) return prev;
      return [...prev, label];
    });
  };

  const handleAddCustomInterest = () => {
    const clean = customInterest.trim();
    if (!clean) return;
    if (!selectedInterests.includes(clean) && selectedInterests.length < 15) {
      setSelectedInterests((prev) => [...prev, clean]);
    }
    setCustomInterest("");
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError(null);
    const cleanName = nameDraft.trim();
    if (cleanName.length < 2) {
      setAccountError("Nama lengkap minimal 2 karakter.");
      return;
    }
    await onUpdateAccount({
      name: cleanName,
      interests: selectedInterests,
    });
  };

  return (
    <div className="space-y-6">
      {/* Account Identity & Interests */}
      <section className="neo-card rounded-2xl bg-white p-5 sm:p-6 border-2 border-[#141413] shadow-[4px_4px_0px_#141413] space-y-4">
        <div className="pb-3 border-b-2 border-[#141413] flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono font-bold text-[#3B66FF] uppercase">
              Identitas Pengguna
            </span>
            <h2 className="font-display font-black text-xl sm:text-2xl text-[#141413]">
              Profil Akun &amp; Minat Penjurusan
            </h2>
          </div>

          <span
            className={`px-3 py-1 rounded-xl border border-[#141413] font-mono font-bold text-xs ${
              user ? "bg-[#B8F348] text-[#141413]" : "bg-[#FFBE2E] text-[#141413]"
            }`}
          >
            {authLoading
              ? "Memeriksa Sesi..."
              : user
              ? user.role === "guru"
                ? "Akun Guru BK"
                : "Akun Siswa"
              : "Mode Tamu Lokal"}
          </span>
        </div>

        {user ? (
          <form onSubmit={handleSaveAccount} className="space-y-4">
            {accountError && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-[#FFE5E0] border-2 border-[#141413] text-xs font-bold text-[#7A1A12]"
              >
                {accountError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="block space-y-1">
                <span className="text-xs font-mono font-bold text-[#52514E] block">
                  Nama Lengkap
                </span>
                <input
                  type="text"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  maxLength={120}
                  className="w-full min-h-[44px] px-3.5 rounded-xl bg-[#FAF7F2] border-2 border-[#141413] text-xs sm:text-sm font-bold text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#3B66FF]"
                />
              </label>

              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-[#52514E] block">
                  {user.role === "guru" ? "NIP / ID Guru" : "NISN / Identitas"}
                </span>
                <div className="w-full min-h-[44px] px-3.5 rounded-xl bg-[#F0ECE1] border-2 border-[#141413]/40 flex items-center text-xs sm:text-sm font-mono font-bold text-[#141413]">
                  {user.identifier}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-[#52514E] block">
                  Email Terdaftar
                </span>
                <div className="w-full min-h-[44px] px-3.5 rounded-xl bg-[#F0ECE1] border-2 border-[#141413]/40 flex items-center text-xs sm:text-sm font-mono text-[#141413] truncate">
                  {user.email}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-[#52514E] block">
                Minat Bidang Studi ({selectedInterests.length}/15)
              </span>
              <div className="flex flex-wrap gap-2">
                {FIELDS.map((field) => {
                  const active = selectedInterests.includes(field.name);
                  return (
                    <button
                      key={field.id}
                      type="button"
                      onClick={() => toggleInterest(field.name)}
                      className={`px-3 py-1.5 rounded-xl border-2 border-[#141413] text-xs font-bold transition-colors cursor-pointer ${
                        active
                          ? "bg-[#B8F348] text-[#141413] shadow-[2px_2px_0px_#141413]"
                          : "bg-[#FAF7F2] text-[#52514E] hover:bg-white"
                      }`}
                    >
                      {field.name}
                    </button>
                  );
                })}
                {selectedInterests
                  .filter((item) => !FIELDS.some((f) => f.name === item))
                  .map((customItem) => (
                    <button
                      key={customItem}
                      type="button"
                      onClick={() => toggleInterest(customItem)}
                      className="px-3 py-1.5 rounded-xl border-2 border-[#141413] bg-[#3B66FF] text-white text-xs font-bold shadow-[2px_2px_0px_#141413] cursor-pointer"
                    >
                      {customItem} (Hapus)
                    </button>
                  ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1 max-w-md">
                <input
                  type="text"
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomInterest();
                    }
                  }}
                  placeholder="Tambah minat spesifik (cth: Rekayasa Perangkat Lunak)"
                  className="flex-1 min-h-[40px] px-3 rounded-xl bg-[#FAF7F2] border-2 border-[#141413] text-xs text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#3B66FF]"
                />
                <button
                  type="button"
                  onClick={handleAddCustomInterest}
                  className="min-h-[40px] px-3.5 rounded-xl bg-white hover:bg-[#F0ECE1] border-2 border-[#141413] text-xs font-mono font-bold text-[#141413] cursor-pointer"
                >
                  + Tambah Minat
                </button>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#141413]/20">
              <button
                type="button"
                onClick={() => void onLogout()}
                className="min-h-[42px] px-4 rounded-xl bg-[#FFE5E0] hover:bg-[#ffd0c7] border-2 border-[#141413] text-xs font-mono font-bold text-[#7A1A12] cursor-pointer"
              >
                Keluar dari Akun
              </button>

              <button
                type="submit"
                disabled={isSavingAccount}
                className="neo-btn min-h-[44px] px-5 rounded-xl bg-[#B8F348] hover:bg-[#a8e635] disabled:opacity-60 text-[#141413] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] font-display font-black text-xs sm:text-sm cursor-pointer"
              >
                {isSavingAccount ? "Menyimpan..." : "Simpan Perubahan Profil"}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-5 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] space-y-3">
            <h3 className="font-display font-black text-base sm:text-lg text-[#141413]">
              Anda sedang menggunakan Mode Tamu Lokal
            </h3>
            <p className="text-xs sm:text-sm text-[#52514E] leading-relaxed">
              Seluruh catatan pembelajaran pribadi, jawaban tugas praktik modul, progres sertifikasi, dan hasil survey tetap tersimpan aman di browser ini. Masuk atau buat akun Siswa/Guru BK untuk menyinkronkan catatan Anda agar tersimpan di akun.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-1">
              <Link
                href="/login"
                className="neo-btn inline-flex items-center min-h-[42px] px-5 rounded-xl bg-[#B8F348] hover:bg-[#a8e635] text-[#141413] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] font-display font-bold text-xs sm:text-sm"
              >
                Masuk Akun &rarr;
              </Link>
              <Link
                href="/daftar"
                className="neo-btn inline-flex items-center min-h-[42px] px-5 rounded-xl bg-white hover:bg-[#F0ECE1] text-[#141413] border-2 border-[#141413] font-display font-bold text-xs sm:text-sm"
              >
                Daftar Akun Baru
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Bali Domicile Control */}
      <section className="neo-card rounded-2xl bg-white p-5 sm:p-6 border-2 border-[#141413] shadow-[4px_4px_0px_#141413] space-y-4">
        <div className="pb-3 border-b-2 border-[#141413]">
          <span className="text-xs font-mono font-bold text-[#1F7A52] uppercase">
            Preferensi Wilayah Bali
          </span>
          <h2 className="font-display font-black text-xl sm:text-2xl text-[#141413]">
            Acuan Alamat &amp; Domisili Kabupaten
          </h2>
          <p className="text-xs text-[#52514E] font-medium mt-0.5">
            Digunakan untuk menghitung estimasi jarak kampus dan SMK di Radar Peta Bali, Katalog, dan Survey Keminatan.
          </p>
        </div>

        <LocationOriginControl
          id="profil-location-control"
          label="Alamat Rumah / Kecamatan Anda di Bali"
          origin={origin}
          isDetecting={isDetectingLocation}
          isGeocoding={isGeocodingLocation}
          locationNote={locationNote}
          onChangeManualKabupaten={onChangeManualKabupaten}
          onSubmitManualAddress={onSubmitManualAddress}
          onDetectLocation={onDetectLocation}
        />
      </section>

      {/* Export & Server Sync Actions */}
      <section className="neo-card rounded-2xl bg-white p-5 sm:p-6 border-2 border-[#141413] shadow-[4px_4px_0px_#141413] space-y-4">
        <div className="pb-3 border-b-2 border-[#141413]">
          <span className="text-xs font-mono font-bold text-[#FF5E4D] uppercase">
            Portofolio &amp; Cadangan Data
          </span>
          <h2 className="font-display font-black text-xl sm:text-2xl text-[#141413]">
            Ekspor Catatan Belajar &amp; Sinkronisasi
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413]">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-sm sm:text-base text-[#141413]">
              Unduh Rekapan Lengkap Aktivitas &amp; Hasil Belajar
            </h3>
            <p className="text-xs text-[#52514E]">
              Simpan rekapan menyeluruh dari Kuesioner Eksplorasi Minat, Survey Keminatan Dasar, penyelesaian modul materi, quiz latihan sertifikasi, verifikasi kemampuan AI, jurnal catatan pribadi, serta bidang favorit menjadi dokumen PDF, HTML, atau Markdown.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onPrintTestPdf && (
              <button
                type="button"
                onClick={onPrintTestPdf}
                className="neo-btn min-h-[44px] px-4 py-2 rounded-xl bg-[#B8F348] hover:bg-[#a8e635] text-[#141413] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] font-display font-bold text-xs sm:text-sm cursor-pointer"
              >
                Unduh Rekap PDF &darr;
              </button>
            )}
            {onDownloadTestHtml && (
              <button
                type="button"
                onClick={onDownloadTestHtml}
                className="neo-btn min-h-[44px] px-4 py-2 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#141413] border-2 border-[#141413] font-mono font-bold text-xs cursor-pointer"
              >
                Unduh Hasil (.html) &darr;
              </button>
            )}
            <button
              type="button"
              onClick={onExportMarkdown}
              className="neo-btn min-h-[44px] px-4 py-2 rounded-xl bg-[#3B66FF] hover:bg-[#2F55DF] text-white border-2 border-[#141413] shadow-[3px_3px_0px_#141413] font-display font-bold text-xs sm:text-sm cursor-pointer"
            >
              Unduh Rekap (.md) &darr;
            </button>
          </div>
        </div>

        {user && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#B8F348]/15 border-2 border-[#141413]">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-sm sm:text-base text-[#141413]">
                Sinkronisasi Akun Server
              </h3>
              <p className="text-xs text-[#52514E]">
                {lastSyncedAt
                  ? `Terakhir tersinkron ke akun pada ${lastSyncedAt}.`
                  : "Catatan dan progres Anda otomatis disinkronkan saat login."}
              </p>
            </div>

            <button
              type="button"
              disabled={isSyncingServer}
              onClick={() => void onManualSyncServer()}
              className="neo-btn min-h-[44px] px-4 py-2 rounded-xl bg-white hover:bg-[#B8F348] disabled:opacity-60 text-[#141413] border-2 border-[#141413] shadow-[2px_2px_0px_#141413] font-mono font-bold text-xs cursor-pointer shrink-0"
            >
              {isSyncingServer ? "Menyinkronkan..." : "Sinkronkan Sekarang"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
