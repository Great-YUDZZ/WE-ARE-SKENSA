"use client";

import React from "react";

export default function ValueProps() {
  const props = [
    {
      num: "01",
      tag: "INTERAKTIF & ADAPTIF",
      tagColor: "text-terracotta bg-terracotta-light border-terracotta/30",
      title: "Kuesioner Minat Terarah",
      desc: "Hanya 5 menit kuesioner ringkas yang memadukan pilihan minat nyata dan cerita pengalaman tanpa tes rumus atau hafalan yang melelahkan.",
      badge: "Adaptif Gemini 2.5 Flash",
    },
    {
      num: "02",
      tag: "DATA RESMI TERPERIKSA",
      tagColor: "text-emerald bg-emerald-light border-emerald/30",
      title: "Katalog Kampus & SMK Bali",
      desc: "Rujukan prodi, akreditasi, dan biaya kuliah berbasis pangkalan data resmi BAN-PT, PDDIKTI, dan Kemendikdasmen tanpa data karangan AI.",
      badge: "100% Fakta Terverifikasi",
    },
    {
      num: "03",
      tag: "PRIVASI & TRANSPARANSI",
      tagColor: "text-ochre bg-ochre-light border-ochre/30",
      title: "Audit Logika Terbuka",
      desc: "Data pribadi tidak diperjualbelikan (zero PII). Dilengkapi panel audit terbuka agar siswa, guru BK, dan juri dapat memverifikasi dasar keputusan.",
      badge: "Tersedia Mode Tamu Anonim",
    },
  ];

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 border-t border-kborder bg-canvas relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[11px] font-mono font-bold text-terracotta uppercase tracking-widest block mb-1">
            STANDAR KUALITAS INOVASI
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-basalt tracking-tight">
            Tiga Fondasi Integritas KertaMarga Bali
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {props.map((p, idx) => (
            <div
              key={idx}
              className="bg-surface border-2 border-kborder rounded-xl p-6 shadow-crisp hover:shadow-lg hover:-translate-y-1 hover:border-terracotta/60 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Giant decorative watermark number */}
              <span className="absolute -right-2 -bottom-4 text-7xl font-mono font-bold text-kborder/30 select-none pointer-events-none group-hover:text-terracotta/10 transition-colors">
                {p.num}
              </span>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border uppercase tracking-wider ${p.tagColor}`}
                  >
                    {p.tag}
                  </span>
                  <span className="font-mono text-xs font-bold text-basalt-muted">
                    #{p.num}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg sm:text-xl text-basalt mb-2 tracking-tight">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-basalt-muted leading-relaxed">
                  {p.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-kborder flex items-center justify-between text-[11px] font-mono text-basalt font-medium">
                <span className="text-emerald font-semibold">{p.badge}</span>
                <span className="text-basalt-muted group-hover:text-terracotta transition-colors">&rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
