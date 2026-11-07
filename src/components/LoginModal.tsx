"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { saveUserToStorage } from "@/lib/useAuth";

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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
    }
  }, [isOpen, initialMode]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            login: identifier.trim() || "0071234567",
            password: password || "password123",
            role,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error ?? "Identifier atau password salah");
          setLoading(false);
          return;
        }
        if (data.user) {
          saveUserToStorage(data.user);
        }
        setLoading(false);
        onProceedToTest(false, selectedInterests);
      } else {
        const emailFallback = identifier.includes("@")
          ? identifier.trim()
          : `${identifier.trim().replace(/[^a-zA-Z0-9]/g, "") || "user"}@siswa.sch.id`;

        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim() || "Siswa Baru",
            identifier: identifier.trim(),
            email: emailFallback,
            password,
            passwordConfirm: password,
            role,
            interests: selectedInterests,
            agreed: true,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error ?? "Gagal mendaftar akun");
          setLoading(false);
          return;
        }
        if (data.user) {
          saveUserToStorage(data.user);
        }
        setLoading(false);
        onProceedToTest(false, selectedInterests);
      }
    } catch {
      setError("Gagal terhubung ke server, coba lagi");
      setLoading(false);
    }
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
            className="fixed inset-0 bg-[#141413]/60"
          />

          {/* Tactile Modal Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", damping: 24, stiffness: 320 }}
            className="relative w-full max-w-lg bg-[#FAF7F2] border-2 border-[#141413] rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_#141413] z-10 max-h-[92vh] overflow-y-auto text-[#141413]"
          >
            {/* Header row */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#141413]">
              <span className="px-2.5 py-1 rounded-lg bg-[#B8F348] border-2 border-[#141413] text-[11px] font-mono font-bold text-[#141413] uppercase">
                {mode === "login"
                  ? "AKSES KERTAMARGA BALI"
                  : "DAFTAR TIKET EKSPLORASI"}
              </span>
              <button
                onClick={onClose}
                type="button"
                className="text-xs font-mono font-bold bg-white border-2 border-[#141413] text-[#141413] hover:bg-[#FF5E4D] hover:text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Tutup [X]
              </button>
            </div>

            {/* Title & Sub */}
            <div className="mt-4 space-y-1.5">
              <h2 className="font-display font-black text-2xl sm:text-3xl text-[#141413] tracking-tight">
                {mode === "login"
                  ? "Masuk ke Studio Minatmu"
                  : "Simpan Profil & Vibe Jurusanmu"}
              </h2>
              <p className="text-xs sm:text-sm text-[#52514E] font-medium leading-relaxed">
                {mode === "login"
                  ? "Buka kembali hasil tes keminatanmu, bandingkan kampus se-Bali, atau konsultasi bersama Guru BK."
                  : "Buat akun gratis dalam 30 detik atau langsung coba pakai Mode Tamu Anonim di bawah."}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="mt-4 p-1 bg-[#F0ECE1] rounded-xl flex gap-1.5 border-2 border-[#141413]">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className={`flex-1 py-1.5 text-xs font-display font-extrabold rounded-lg transition-all cursor-pointer ${
                  mode === "login"
                    ? "bg-[#141413] text-[#B8F348] shadow-[2px_2px_0px_#141413]"
                    : "text-[#52514E] hover:text-[#141413]"
                }`}
              >
                Masuk Akun
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError(null);
                }}
                className={`flex-1 py-1.5 text-xs font-display font-extrabold rounded-lg transition-all cursor-pointer ${
                  mode === "register"
                    ? "bg-[#141413] text-[#B8F348] shadow-[2px_2px_0px_#141413]"
                    : "text-[#52514E] hover:text-[#141413]"
                }`}
              >
                Buat Akun Baru
              </button>
            </div>

            {/* Role Switcher */}
            <div className="mt-3 p-1 bg-white rounded-xl flex gap-1.5 border-2 border-[#141413]">
              <button
                type="button"
                onClick={() => setRole("siswa")}
                className={`flex-1 py-1.5 text-xs font-display font-bold rounded-lg transition-all cursor-pointer ${
                  role === "siswa"
                    ? "bg-[#FFBE2E] border border-[#141413] text-[#141413]"
                    : "text-[#52514E]"
                }`}
              >
                Pelajar SMP / SMA / SMK
              </button>
              <button
                type="button"
                onClick={() => setRole("guru")}
                className={`flex-1 py-1.5 text-xs font-display font-bold rounded-lg transition-all cursor-pointer ${
                  role === "guru"
                    ? "bg-[#FFBE2E] border border-[#141413] text-[#141413]"
                    : "text-[#52514E]"
                }`}
              >
                Guru BK / Orang Tua
              </button>
            </div>

            {/* Chip Minat Awal */}
            {mode === "register" && (
              <div className="mt-4">
                <label className="block text-xs font-mono font-bold text-[#141413] uppercase mb-2">
                  PILIH STIKER MINAT AWALMU:
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                  {INTEREST_CHIPS.map((chip) => {
                    const isSelected = selectedInterests.includes(chip);
                    return (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => toggleInterest(chip)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-display font-bold transition-all cursor-pointer border-2 border-[#141413] ${
                          isSelected
                            ? "bg-[#B8F348] text-[#141413] shadow-[2px_2px_0px_#141413]"
                            : "bg-white text-[#52514E] hover:bg-[#F0ECE1]"
                        }`}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {error && (
              <div role="alert" className="mt-3 border-2 border-[#141413] rounded-xl bg-[#FFE5E0] text-[#7A1A12] text-xs font-bold px-3 py-2">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1">
                    Nama Panggilan / Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Putu Raditya"
                    className="w-full h-10 px-3 rounded-xl bg-white border-2 border-[#141413] text-[#141413] text-xs sm:text-sm font-medium placeholder:text-[#52514E]/60 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1">
                  {role === "siswa"
                    ? "NISN / Email Sekolah"
                    : "NIP / Email Pembimbing"}
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    role === "siswa"
                      ? "Contoh: 0071234567 atau kamu@smk.sch.id"
                      : "guru@sekolah.sch.id"
                  }
                  className="w-full h-10 px-3 rounded-xl bg-white border-2 border-[#141413] text-[#141413] text-xs sm:text-sm font-medium placeholder:text-[#52514E]/60 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full h-10 px-3 rounded-xl bg-white border-2 border-[#141413] text-[#141413] text-xs sm:text-sm font-medium placeholder:text-[#52514E]/60 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="neo-btn w-full h-11 mt-2 bg-[#FF5E4D] hover:bg-[#ff4936] text-white font-display font-extrabold text-xs sm:text-sm rounded-xl cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                <span>
                  {loading
                    ? "Memproses..."
                    : mode === "login"
                    ? "Masuk & Lihat Rekomendasi"
                    : "Simpan Akun & Mulai Tes"}
                </span>
                <span className="font-mono text-sm">&rarr;</span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-[#141413]/20" />
              </div>
              <span className="relative bg-[#FAF7F2] px-3 text-[10px] font-mono font-bold text-[#52514E] uppercase">
                atau langsung tanpa akun
              </span>
            </div>

            {/* Anonymous Guest Button */}
            <button
              onClick={() => onProceedToTest(true, selectedInterests)}
              type="button"
              className="neo-btn w-full h-11 bg-[#B8F348] hover:bg-[#a8e635] text-[#141413] font-display font-extrabold text-xs sm:text-sm rounded-xl cursor-pointer flex items-center justify-center"
            >
              Coba Mode Tamu Anonim (Langsung Tes) &rarr;
            </button>

            <p className="mt-3 text-[11px] font-mono font-bold text-[#0F6E4E] text-center">
              Aman &amp; Privat: Mode Tamu tidak menyimpan data pribadimu di server.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
