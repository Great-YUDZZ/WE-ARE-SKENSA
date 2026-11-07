"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PasswordField from "./PasswordField";
import { saveUserToStorage } from "@/lib/useAuth";

const INTEREST_CHIPS = [
  "Rekayasa Perangkat Lunak",
  "Teknik Jaringan (TKJ/CCNA/MTCNA)",
  "Desain Komunikasi Visual",
  "Arsitektur dan Lanskap",
  "Keperawatan dan Kesehatan",
  "Pendidikan dan Konseling",
  "Seni Karawitan dan Budaya",
  "Pertanian Organik Subak",
  "Kelautan dan Konservasi",
  "Bisnis Digital dan E-Commerce",
  "Perhotelan dan Ekowisata",
];

// Form bersama untuk login dan daftar agar perilaku konsisten di kedua halaman
// Mode login hanya butuh identifier dan password, mode daftar tambah nama, email, minat, dan persetujuan privasi
export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [role, setRole] = useState<"siswa" | "guru">("siswa");
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Rekayasa Perangkat Lunak"]);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

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

    // Validasi client side cepat sebelum panggil API
    if (isRegister) {
      if (name.trim().length < 2) return setError("Nama minimal 2 karakter");
      const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
      if (!emailOk) return setError("Format email tidak valid");
      if (password.length < 8) return setError("Password minimal 8 karakter");
      if (password !== passwordConfirm) return setError("Konfirmasi password tidak sama");
      if (!agreed) return setError("Centang persetujuan privasi minim data untuk melanjutkan");
    } else {
      if (password.length < 8) return setError("Password minimal 8 karakter");
    }

    setLoading(true);
    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const payload = isRegister
        ? { name: name.trim(), identifier: identifier.trim(), email: email.trim(), password, passwordConfirm, role, interests: selectedInterests, agreed }
        : { login: identifier.trim(), password, role };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Gagal masuk, coba lagi");
        return;
      }
      if (data.user) {
        saveUserToStorage(data.user);
      }
      // Arahkan ke eksplorasi dengan sesi tersimpan
      router.push("/eksplorasi");
      router.refresh();
    } catch {
      setError("Tidak bisa terhubung ke server, periksa koneksi lalu coba lagi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <span className="inline-flex px-2.5 py-1 rounded-lg bg-[#B8F348] border-2 border-[#141413] text-[11px] font-mono font-bold uppercase">
        {isRegister ? "Daftar Tiket Eksplorasi" : "Akses KertaMarga Bali"}
      </span>
      <h1 className="mt-3 font-display font-black text-2xl sm:text-3xl tracking-tight">
        {isRegister ? "Simpan Profil dan Vibe Jurusanmu" : "Masuk ke Studio Minatmu"}
      </h1>
      <p className="mt-1.5 text-xs sm:text-sm text-[#52514E] font-medium leading-relaxed">
        {isRegister
          ? "Buat akun gratis dalam 30 detik atau langsung coba pakai Mode Tamu Anonim di bawah."
          : "Buka kembali hasil simulasi jurusanmu, cek perbandingan kampus Bali, atau diskusi bareng Guru BK."}
      </p>

      <div className="mt-5 p-1 bg-[#F0ECE1] rounded-xl flex gap-1.5 border-2 border-[#141413]">
        <Link
          href="/login"
          className={`flex-1 py-2 text-xs font-display font-extrabold rounded-lg text-center transition-all ${!isRegister ? "bg-[#141413] text-[#B8F348]" : "text-[#52514E] hover:text-[#141413]"}`}
        >
          Masuk Akun
        </Link>
        <Link
          href="/daftar"
          className={`flex-1 py-2 text-xs font-display font-extrabold rounded-lg text-center transition-all ${isRegister ? "bg-[#141413] text-[#B8F348]" : "text-[#52514E] hover:text-[#141413]"}`}
        >
          Buat Akun Baru
        </Link>
      </div>

      <div className="mt-3 p-1 bg-white rounded-xl flex gap-1.5 border-2 border-[#141413]">
        <button
          type="button"
          onClick={() => setRole("siswa")}
          aria-pressed={role === "siswa"}
          className={`flex-1 py-1.5 text-xs font-display font-bold rounded-lg transition-all ${role === "siswa" ? "bg-[#FFBE2E] border border-[#141413] text-[#141413]" : "text-[#52514E]"}`}
        >
          Pelajar SMP / SMA / SMK
        </button>
        <button
          type="button"
          onClick={() => setRole("guru")}
          aria-pressed={role === "guru"}
          className={`flex-1 py-1.5 text-xs font-display font-bold rounded-lg transition-all ${role === "guru" ? "bg-[#FFBE2E] border border-[#141413] text-[#141413]" : "text-[#52514E]"}`}
        >
          Guru BK / Orang Tua
        </button>
      </div>

      <div className="mt-4">
        <p className="text-xs font-mono font-bold uppercase mb-2">Pilih stiker minat awalmu:</p>
        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
          {INTEREST_CHIPS.map((chip) => {
            const active = selectedInterests.includes(chip);
            return (
              <button
                key={chip}
                type="button"
                onClick={() => toggleInterest(chip)}
                aria-pressed={active}
                className={`text-xs px-2.5 py-1 rounded-lg font-display font-bold border-2 border-[#141413] transition-all ${active ? "bg-[#B8F348] shadow-[2px_2px_0px_#141413]" : "bg-white text-[#52514E] hover:bg-[#F0ECE1]"}`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div role="alert" className="mt-4 border-2 border-[#141413] rounded-xl bg-[#FFE5E0] text-[#7A1A12] text-xs font-bold px-3 py-2.5">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-3" noValidate>
        {isRegister && (
          <>
            <div>
              <label htmlFor="auth-name" className="block text-xs font-bold mb-1.5">
                Nama Panggilan / Lengkap
              </label>
              <input
                id="auth-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Putu Raditya"
                autoComplete="name"
                className="w-full h-11 px-3 rounded-xl bg-white border-2 border-[#141413] text-sm font-medium placeholder:text-[#52514E]/60 focus:outline-none focus:ring-2 focus:ring-[#3B66FF]"
              />
            </div>
            <div>
              <label htmlFor="auth-email" className="block text-xs font-bold mb-1.5">
                Email Aktif
              </label>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kamu@smk.sch.id"
                autoComplete="email"
                className="w-full h-11 px-3 rounded-xl bg-white border-2 border-[#141413] text-sm font-medium placeholder:text-[#52514E]/60 focus:outline-none focus:ring-2 focus:ring-[#3B66FF]"
              />
            </div>
          </>
        )}

        <div>
          <label htmlFor="auth-identifier" className="block text-xs font-bold mb-1.5">
            {isRegister
              ? role === "siswa" ? "NISN" : "NIP / Email Pembimbing"
              : role === "siswa" ? "NISN / Email Sekolah" : "NIP / Email Pembimbing"}
          </label>
          <input
            id="auth-identifier"
            type="text"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={role === "siswa" ? "Contoh: 0071234567 atau kamu@smk.sch.id" : "guru@sekolah.sch.id"}
            autoComplete="username"
            className="w-full h-11 px-3 rounded-xl bg-white border-2 border-[#141413] text-sm font-medium placeholder:text-[#52514E]/60 focus:outline-none focus:ring-2 focus:ring-[#3B66FF]"
          />
        </div>

        <PasswordField id="auth-password" label="Kata Sandi" value={password} onChange={setPassword} autoComplete={isRegister ? "new-password" : "current-password"} />

        {isRegister && (
          <PasswordField id="auth-password-confirm" label="Konfirmasi Kata Sandi" value={passwordConfirm} onChange={setPasswordConfirm} autoComplete="new-password" />
        )}

        {isRegister && (
          <label className="flex items-start gap-2.5 text-xs font-medium text-[#52514E] leading-relaxed cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 shrink-0 accent-[#FF5E4D] border-2 border-[#141413]"
            />
            <span>
              Saya setuju data minim hanya untuk rekomendasi jurusan, tanpa alamat presisi, dan bisa hapus sesi kapan saja via Mode Tamu Anonim.
            </span>
          </label>
        )}

        {!isRegister && (
          <div className="flex justify-end">
            <button type="button" className="text-xs font-bold underline underline-offset-2 decoration-2 hover:text-[#3B66FF]">
              Lupa kata sandi
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 border-2 border-[#141413] shadow-[4px_4px_0px_#141413] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] bg-[#FF5E4D] hover:bg-[#ff4936] text-white font-display font-extrabold text-sm rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:pointer-events-none transition-all"
        >
          {loading ? "Memproses..." : isRegister ? "Simpan Akun dan Mulai Tes" : "Masuk dan Lihat Rekomendasi"}
          <span className="font-mono">&rarr;</span>
        </button>
      </form>

      <div className="relative my-5 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-[#141413]/20" />
        </div>
        <span className="relative bg-[#FAF7F2] px-3 text-[10px] font-mono font-bold text-[#52514E] uppercase">
          atau langsung gas tanpa login
        </span>
      </div>

      <Link
        href="/eksplorasi"
        className="w-full h-11 border-2 border-[#141413] shadow-[4px_4px_0px_#141413] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] bg-[#B8F348] hover:bg-[#a8e635] text-[#141413] font-display font-extrabold text-sm rounded-xl flex items-center justify-center transition-all"
      >
        Coba Mode Tamu Anonim, Langsung Tes &rarr;
      </Link>
      <p className="mt-3 text-[11px] font-mono font-bold text-[#0F6E4E] text-center">
        Aman dan Privat: Mode Tamu tidak menyimpan data pribadimu di server.
      </p>
    </div>
  );
}
