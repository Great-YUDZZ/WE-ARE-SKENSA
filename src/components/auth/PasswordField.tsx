"use client";

import React, { useState } from "react";

// Input password dengan tombol lihat dan sembunyikan untuk meminimalkan salah ketik
export default function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete = "current-password",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold text-[#141413] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          required
          minLength={8}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "Minimal 8 karakter"}
          autoComplete={autoComplete}
          className="w-full h-11 pr-20 px-3 rounded-xl bg-white border-2 border-[#141413] text-sm font-medium placeholder:text-[#52514E]/60 focus:outline-none focus:ring-2 focus:ring-[#3B66FF]"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-2.5 text-[11px] font-bold border-2 border-[#141413] rounded-lg bg-[#F0ECE1] hover:bg-[#B8F348] transition-colors"
        >
          {visible ? "Sembunyikan" : "Lihat"}
        </button>
      </div>
    </div>
  );
}
