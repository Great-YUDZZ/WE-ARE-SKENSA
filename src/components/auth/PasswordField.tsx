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
  minLength = 8,
  tabIndex,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  minLength?: number;
  tabIndex?: number;
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
          minLength={minLength}
          tabIndex={tabIndex}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? `Minimal ${minLength} karakter`}
          autoComplete={autoComplete}
          className="w-full h-11 pr-12 px-3 rounded-xl bg-[#FAF7F2] border-2 border-[#141413] text-sm font-medium placeholder:text-[#52514E]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B66FF]"
        />
        <button
          type="button"
          tabIndex={tabIndex}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          aria-pressed={visible}
          title={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-[#52514E] hover:text-[#141413] hover:bg-[#141413]/8 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3B66FF]"
        >
          {visible ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-[18px] h-[18px]"
            >
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-[18px] h-[18px]"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
