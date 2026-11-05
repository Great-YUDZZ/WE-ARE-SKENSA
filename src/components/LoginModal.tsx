"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToTest: (isAnonymous: boolean, selectedInterests?: string[]) => void;
  initialMode?: "login" | "register";
}

const INTEREST_CHIPS = [
  "Rekayasa Perangkat Lunak",
  "Teknik Jaringan (TKJ/CCNA/MTCNA)",
  "Desain Komunikasi Visual",
  "Arsitektur & Lanskap",
  "Keperawatan & Kesehatan",
  "Pendidikan & Konseling",
  "Seni Karawitan & Budaya",
  "Pertanian Organik Subak",
  "Kelautan & Konservasi",
  "Bisnis Digital & E-Commerce",
  "Perhotelan & Ekowisata",
];

export default function LoginModal({
  isOpen,
  onClose,
  onProceedToTest,
  initialMode = "login",
}: LoginModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<"siswa" | "guru">("siswa");
  const [identifier, setIdentifier] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Rekayasa Perangkat Lunak",
  ]);

  // Sync mode with initialMode whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((item) => item !== interest));
      }
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProceedToTest(false, selectedInterests);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1B1B2F]/70 backdrop-blur-[2px]"
          />

          {/* Modal Dialog Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg bg-[#FFFDF8] dark:bg-[#1F1F2E] border-2 border-[#E6E1D6] dark:border-[#2E2E42] rounded-t-2xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl z-10 max-h-[92vh] overflow-y-auto text-[#1B1B2F] dark:text-[#F4F2EA]"
          >
            {/* Header row */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E1D6] dark:border-[#2E2E42]">
              <span className="text-[11px] font-mono font-bold text-[#D7263D] dark:text-[#FF5A6B] tracking-wider uppercase">
                {mode === "login"
                  ? "GERBANG MASUK EKSPLORASI"
                  : "PENDAFTARAN AKUN BARU"}
              </span>
              <button
                onClick={onClose}
                type="button"
                className="text-xs font-mono font-bold text-[#5A5A70] dark:text-[#A8A8BA] hover:text-[#1B1B2F] dark:hover:text-[#F4F2EA] px-2 py-1 rounded transition-colors cursor-pointer"
              >
                [Tutup X]
              </button>
            </div>

            {/* Title & Sub */}
            <div className="mt-4 space-y-1.5">
              <h2 className="font-sans font-bold text-2xl text-[#1B1B2F] dark:text-[#F4F2EA] tracking-tight">
                {mode === "login"
                  ? "Akses Platform KertaMarga"
                  : "Buat Akun KertaMarga"}
              </h2>
              <p className="text-xs sm:text-sm text-[#5A5A70] dark:text-[#A8A8BA] leading-relaxed">
                {mode === "login"
                  ? "Masuk untuk mengakses riwayat rekomendasi, konsultasi dengan Guru BK, atau pantau perkembangan minat."
                  : "Daftar untuk menyimpan preferensi peminatan, konsultasi karir terarah, dan rekomendasi AI resmi."}
              </p>
            </div>

            {/* Mode Switcher Tabs (Login vs Buat Akun) */}
            <div className="mt-5 p-1 bg-[#F5F2EA] dark:bg-[#14141F] rounded-xl flex gap-1 border border-[#E6E1D6] dark:border-[#2E2E42]">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === "login"
                    ? "bg-[#FFFDF8] dark:bg-[#1F1F2E] text-[#1B1B2F] dark:text-[#F4F2EA] shadow-xs border border-[#E6E1D6] dark:border-[#2E2E42]"
                    : "text-[#5A5A70] dark:text-[#A8A8BA] hover:text-[#1B1B2F] dark:hover:text-white"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === "register"
                    ? "bg-[#FFFDF8] dark:bg-[#1F1F2E] text-[#1B1B2F] dark:text-[#F4F2EA] shadow-xs border border-[#E6E1D6] dark:border-[#2E2E42]"
                    : "text-[#5A5A70] dark:text-[#A8A8BA] hover:text-[#1B1B2F] dark:hover:text-white"
                }`}
              >
                Buat Akun
              </button>
            </div>

            {/* Role Tabs */}
            <div className="mt-4 p-1 bg-[#F5F2EA] dark:bg-[#14141F] rounded-lg flex gap-1 border border-[#E6E1D6] dark:border-[#2E2E42]">
              <button
                type="button"
                onClick={() => setRole("siswa")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  role === "siswa"
                    ? "bg-[#FFFDF8] dark:bg-[#1F1F2E] text-[#1B1B2F] dark:text-[#F4F2EA] shadow-xs border border-[#E6E1D6] dark:border-[#2E2E42]"
                    : "text-[#5A5A70] dark:text-[#A8A8BA]"
                }`}
              >
                Siswa SMP / SMA / SMK
              </button>
              <button
                type="button"
                onClick={() => setRole("guru")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  role === "guru"
                    ? "bg-[#FFFDF8] dark:bg-[#1F1F2E] text-[#1B1B2F] dark:text-[#F4F2EA] shadow-xs border border-[#E6E1D6] dark:border-[#2E2E42]"
                    : "text-[#5A5A70] dark:text-[#A8A8BA]"
                }`}
              >
                Guru BK / Pembimbing
              </button>
            </div>

            {/* Chip Minat Awal */}
            <div className="mt-4">
              <label className="block text-xs font-bold text-[#1B1B2F] dark:text-[#F4F2EA] mb-2">
                Pilih Fokus Minat Awal (Opsional):
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                {INTEREST_CHIPS.map((chip) => {
                  const isSelected = selectedInterests.includes(chip);
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => toggleInterest(chip)}
                      className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-[#FFC93C] dark:bg-[#FFD25E] text-[#1B1B2F] border-[#E6B020] font-bold shadow-xs"
                          : "bg-[#F5F2EA] dark:bg-[#14141F] text-[#5A5A70] dark:text-[#A8A8BA] border-[#E6E1D6] dark:border-[#2E2E42] hover:border-[#FFC93C]"
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-bold text-[#1B1B2F] dark:text-[#F4F2EA] mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: I Putu Gede Raditya"
                    className="w-full h-10 px-3 rounded-lg bg-[#F5F2EA] dark:bg-[#14141F] border border-[#E6E1D6] dark:border-[#2E2E42] text-[#1B1B2F] dark:text-[#F4F2EA] text-xs sm:text-sm placeholder:text-[#5A5A70]/50 focus:border-[#D7263D] transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#1B1B2F] dark:text-[#F4F2EA] mb-1">
                  {role === "siswa"
                    ? "NISN / ID Siswa / Email Sekolah"
                    : "NIP / Email Pembimbing"}
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    role === "siswa"
                      ? "Contoh: 0071234567 atau siswa@sekolah.sch.id"
                      : "guru@sekolah.sch.id"
                  }
                  className="w-full h-10 px-3 rounded-lg bg-[#F5F2EA] dark:bg-[#14141F] border border-[#E6E1D6] dark:border-[#2E2E42] text-[#1B1B2F] dark:text-[#F4F2EA] text-xs sm:text-sm placeholder:text-[#5A5A70]/50 focus:border-[#D7263D] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1B1B2F] dark:text-[#F4F2EA] mb-1">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-10 px-3 rounded-lg bg-[#F5F2EA] dark:bg-[#14141F] border border-[#E6E1D6] dark:border-[#2E2E42] text-[#1B1B2F] dark:text-[#F4F2EA] text-xs sm:text-sm placeholder:text-[#5A5A70]/50 focus:border-[#D7263D] transition-colors"
                />
              </div>

              {/* Submit Button */}
              {mode === "login" ? (
                <button
                  type="submit"
                  className="w-full h-11 mt-2 bg-[#D7263D] hover:bg-[#B91C30] text-white font-sans font-bold text-xs sm:text-sm rounded-lg shadow-sm active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Login & Masuk</span>
                  <span className="font-mono text-sm">&rarr;</span>
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full h-11 mt-2 bg-[#FFC93C] hover:bg-[#F5BF2E] text-[#1B1B2F] font-sans font-bold text-xs sm:text-sm rounded-lg shadow-sm border border-[#E6B020]/40 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Buat Akun & Mulai</span>
                  <span className="font-mono text-sm">&rarr;</span>
                </button>
              )}
            </form>

            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E6E1D6] dark:border-[#2E2E42]" />
              </div>
              <span className="relative bg-[#FFFDF8] dark:bg-[#1F1F2E] px-3 text-[10px] font-mono text-[#5A5A70] dark:text-[#A8A8BA] uppercase tracking-wider">
                atau coba tanpa mendaftar
              </span>
            </div>

            {/* Anonymous Guest Button */}
            <button
              onClick={() => onProceedToTest(true, selectedInterests)}
              type="button"
              className="w-full h-11 bg-[#F5F2EA] dark:bg-[#14141F] hover:bg-[#EAE5D8] dark:hover:bg-[#252538] border border-[#E6E1D6] dark:border-[#2E2E42] text-[#1B1B2F] dark:text-[#F4F2EA] font-sans font-bold text-xs rounded-lg transition-all active:scale-99 cursor-pointer flex items-center justify-center"
            >
              Lanjut Mode Tamu Anonim (Tes Langsung)
            </button>

            {/* Micro Privacy Assurance */}
            <p className="mt-3 text-[11px] font-mono text-[#1F7A52] dark:text-[#4CC992] font-semibold text-center leading-normal">
              Privasi Terjamin: Dalam Mode Tamu, tidak ada data identitas yang dikirim ke server.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
