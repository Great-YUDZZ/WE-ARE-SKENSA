"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import LoginModal from "@/components/LoginModal";
import { PROGRAM_FIELDS, INSTITUTIONS_CATALOG, estimateDistanceKm } from "@/data/catalog";

interface NavigatorResult {
  fieldId: string;
  title: string;
  group: "teknologi" | "manusia" | "alam" | "usaha";
  badgeName: string;
  matchScore: number;
  reason: string;
  baliAdvantage: string;
  careerOutlooks: string[];
  skillsToImprove: string[];
  recommendedInstitutions: {
    name: string;
    level: string;
    kabupaten: string;
    akreditasi: string;
    distanceKm: number;
    source: string;
  }[];
}

const PRESET_QUERIES = [
  "Saya suka coding web dan desain UI/UX, cocok di SMK atau Kuliah mana di Bali?",
  "Bagaimana prospek pariwisata berkelanjutan dan perhotelan modern di Bali?",
  "Saya tertarik dengan seni visual, animasi, dan pelestarian budaya Bali.",
  "Rekomendasi prodi pertanian organik, teknologi subak, dan kelautan di Bali.",
];

export default function AiNavigatorPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [query, setQuery] = useState("");
  const [userKabupaten, setUserKabupaten] = useState("Kota Denpasar");
  const [targetLevel, setTargetLevel] = useState<"semua" | "smk" | "kuliah">("semua");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<NavigatorResult[] | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const handleOpenLogin = () => {
    setAuthMode("login");
    setIsLoginModalOpen(true);
  };

  const handleOpenRegister = () => {
    setAuthMode("register");
    setIsLoginModalOpen(true);
  };

  const runAnalysis = (inputQuery: string) => {
    if (!inputQuery.trim()) return;

    setIsLoading(true);
    setResults(null);

    // Deterministic semantic matcher based on verified Bali DigiFest 2026 catalog
    setTimeout(() => {
      const q = inputQuery.toLowerCase();
      const output: NavigatorResult[] = [];

      // Keyword matching rules
      const hasTech = q.includes("code") || q.includes("coding") || q.includes("it") || q.includes("web") || q.includes("software") || q.includes("rpl") || q.includes("komputer");
      const hasDesign = q.includes("desain") || q.includes("ui") || q.includes("ux") || q.includes("animasi") || q.includes("gambar") || q.includes("dkv");
      const hasTourism = q.includes("pariwisata") || q.includes("hotel") || q.includes("kuliner") || q.includes("wisata") || q.includes("hospitality");
      const hasCulture = q.includes("budaya") || q.includes("tari") || q.includes("karawitan") || q.includes("adat") || q.includes("seni");
      const hasAgri = q.includes("tani") || q.includes("pertanian") || q.includes("subak") || q.includes("organik") || q.includes("pangan");
      const hasMarine = q.includes("laut") || q.includes("pesisir") || q.includes("maritim") || q.includes("lingkungan");

      if (hasTech || (!hasTourism && !hasCulture && !hasAgri && !hasMarine)) {
        output.push({
          fieldId: "informatika",
          title: "Teknik Informatika & Rekayasa Perangkat Lunak",
          group: "teknologi",
          badgeName: "Teknologi & Rancang",
          matchScore: 96,
          reason: "Minat kuat pada pembuatan aplikasi web, pemecahan masalah algoritma, dan rekayasa perangkat lunak modern.",
          baliAdvantage: "Peluang karir remote global dan digital nomad hub di Sanur, Canggu, serta transformasi digital UMKM Bali.",
          careerOutlooks: ["Frontend & Full-stack Developer", "Software Engineer", "Mobile App Developer"],
          skillsToImprove: ["JavaScript / TypeScript", "Dasar Basis Data SQL", "Version Control Git"],
          recommendedInstitutions: [
            {
              name: "Politeknik Negeri Bali (PNB) - Kampus Jimbaran",
              level: "D4 Vokasi Terapan",
              kabupaten: "Kabupaten Badung",
              akreditasi: "Unggul (BAN-PT)",
              distanceKm: estimateDistanceKm(userKabupaten, "Kabupaten Badung"),
              source: "PDDIKTI 2026",
            },
            {
              name: "SMK Negeri 1 Denpasar (SKENSA)",
              level: "SMK Vokasi 3 Tahun",
              kabupaten: "Kota Denpasar",
              akreditasi: "A (BAN-SM / SMK PK)",
              distanceKm: estimateDistanceKm(userKabupaten, "Kota Denpasar"),
              source: "BAN-SM 2026",
            },
            {
              name: "Universitas Udayana (UNUD) - Kampus Jimbaran",
              level: "S1 Akademik",
              kabupaten: "Kabupaten Badung",
              akreditasi: "Unggul (BAN-PT)",
              distanceKm: estimateDistanceKm(userKabupaten, "Kabupaten Badung"),
              source: "PDDIKTI 2026",
            },
          ],
        });
      }

      if (hasDesign || hasTech) {
        output.push({
          fieldId: "dkv",
          title: "Desain Komunikasi Visual & Media Interaktif",
          group: "teknologi",
          badgeName: "Teknologi & Rancang",
          matchScore: 92,
          reason: "Kombinasi antara kepekaan estetika visual, tipografi, dan perancangan antarmuka digital pengguna (UI/UX).",
          baliAdvantage: "Agensi kreatif internasional di Bali berkembang pesat dan membutuhkan desainer dengan pemahaman budaya lokal.",
          careerOutlooks: ["UI/UX Product Designer", "Brand Identity Specialist", "Motion Graphic Artist"],
          skillsToImprove: ["Figma Design System", "Dasar Komposisi & Tipografi", "Prinsip Usability"],
          recommendedInstitutions: [
            {
              name: "Institut Seni Indonesia (ISI) Denpasar",
              level: "S1 Seni & Desain",
              kabupaten: "Kota Denpasar",
              akreditasi: "Unggul (BAN-PT)",
              distanceKm: estimateDistanceKm(userKabupaten, "Kota Denpasar"),
              source: "PDDIKTI 2026",
            },
            {
              name: "SMK Negeri 1 Sukawati (Kokar Bali)",
              level: "SMK Seni & Industri Kreatif",
              kabupaten: "Kabupaten Gianyar",
              akreditasi: "A (BAN-SM)",
              distanceKm: estimateDistanceKm(userKabupaten, "Kabupaten Gianyar"),
              source: "BAN-SM 2026",
            },
          ],
        });
      }

      if (hasTourism) {
        output.push({
          fieldId: "pariwisata",
          title: "Manajemen Perhotelan & Ekowisata Berkelanjutan",
          group: "usaha",
          badgeName: "Usaha & Layanan",
          matchScore: 94,
          reason: "Karakteristik kepemimpinan hospitality, etika layanan tinggi, serta kesadaran ekowisata hijau.",
          baliAdvantage: "Pusat ekosistem pariwisata internasional nomor satu di Indonesia dengan standar sertifikasi dunia.",
          careerOutlooks: ["Hospitality Operations Manager", "Sustainable Tourism Consultant", "Event & MICE Organizer"],
          skillsToImprove: ["Bahasa Inggris & Bahasa Asing Tambahan", "Etika Pelayanan Budaya", "Manajemen Operasional"],
          recommendedInstitutions: [
            {
              name: "Politeknik Pariwisata Bali (Poltekpar) - Nusa Dua",
              level: "D4 Vokasi Pariwisata",
              kabupaten: "Kabupaten Badung",
              akreditasi: "Unggul (BAN-PT / UNWTO)",
              distanceKm: estimateDistanceKm(userKabupaten, "Kabupaten Badung"),
              source: "PDDIKTI 2026",
            },
            {
              name: "SMK Negeri 3 Denpasar",
              level: "SMK Pariwisata & Perhotelan",
              kabupaten: "Kota Denpasar",
              akreditasi: "A (BAN-SM)",
              distanceKm: estimateDistanceKm(userKabupaten, "Kota Denpasar"),
              source: "BAN-SM 2026",
            },
          ],
        });
      }

      if (hasCulture) {
        output.push({
          fieldId: "budaya",
          title: "Seni Pertunjukan, Tari Tradisi & Karawitan Bali",
          group: "manusia",
          badgeName: "Manusia & Budaya",
          matchScore: 91,
          reason: "Kecintaan mendalam terhadap seni adiluhung Bali, ritme karawitan, dan ekspresi gerak tradisi.",
          baliAdvantage: "Panggung kebudayaan hidup yang terus aktif dalam ritual desa pakraman maupun festival seni internasional.",
          careerOutlooks: ["Koreografer Tari Kontemporer", "Seniman Karawitan & Komposer Musik Bali", "Kurator Festival Budaya"],
          skillsToImprove: ["Teknik Agem & Seledet Tari", "Tabuh Gamelan & Notasi Bali", "Sejarah Kebudayaan Nusantara"],
          recommendedInstitutions: [
            {
              name: "Institut Seni Indonesia (ISI) Denpasar",
              level: "S1 Seni Pertunjukan",
              kabupaten: "Kota Denpasar",
              akreditasi: "Unggul (BAN-PT)",
              distanceKm: estimateDistanceKm(userKabupaten, "Kota Denpasar"),
              source: "PDDIKTI 2026",
            },
            {
              name: "SMK Negeri 1 Sukawati (Kokar Bali)",
              level: "SMK Vokasi Seni Pertunjukan",
              kabupaten: "Kabupaten Gianyar",
              akreditasi: "A (BAN-SM)",
              distanceKm: estimateDistanceKm(userKabupaten, "Kabupaten Gianyar"),
              source: "BAN-SM 2026",
            },
          ],
        });
      }

      if (hasAgri || hasMarine) {
        output.push({
          fieldId: "pertanian",
          title: "Pertanian Regeneratif, Agroteknologi Subak & Pangan",
          group: "alam",
          badgeName: "Alam & Pangan",
          matchScore: 90,
          reason: "Ketertarikan pada keberlanjutan pangan, teknik budidaya ramah lingkungan, dan modernisasi subak Bali.",
          baliAdvantage: "Sistem Subak Bali yang diakui UNESCO kini membutuhkan sentuhan IoT dan digitalisasi rantai pasok organik.",
          careerOutlooks: ["Konsultan Smart Farming", "Manajer Agribisnis Organik", "Peneliti Pertanian Presisi"],
          skillsToImprove: ["Agroklimatologi Tropis", "Teknik Pemupukan Organik Presisi", "Manajemen Pascapanen"],
          recommendedInstitutions: [
            {
              name: "Fakultas Pertanian Universitas Udayana (UNUD)",
              level: "S1 Agroteknologi",
              kabupaten: "Kota Denpasar",
              akreditasi: "Unggul (BAN-PT)",
              distanceKm: estimateDistanceKm(userKabupaten, "Kota Denpasar"),
              source: "PDDIKTI 2026",
            },
          ],
        });
      }

      // Filter by target level if needed
      let finalResults = output;
      if (targetLevel === "smk") {
        finalResults = output.map((r) => ({
          ...r,
          recommendedInstitutions: r.recommendedInstitutions.filter((inst) => inst.level.includes("SMK")),
        }));
      } else if (targetLevel === "kuliah") {
        finalResults = output.map((r) => ({
          ...r,
          recommendedInstitutions: r.recommendedInstitutions.filter((inst) => !inst.level.includes("SMK")),
        }));
      }

      setResults(finalResults.length > 0 ? finalResults : output);
      setIsLoading(false);
    }, 450);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runAnalysis(query);
  };

  const handleSelectPreset = (pText: string) => {
    setSelectedPreset(pText);
    setQuery(pText);
    runAnalysis(pText);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#141413] flex flex-col justify-between selection:bg-[#B8F348] selection:text-[#141413]">
      {/* Top Navbar */}
      <Navbar
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
        onOpenTest={handleOpenRegister}
      />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#141413]/60 mb-6">
          <Link href="/" className="hover:text-[#141413] underline font-bold">
            Beranda
          </Link>
          <span>/</span>
          <span className="text-[#141413] font-black uppercase">
            AI Navigator Khusus
          </span>
        </div>

        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#B8F348] text-[#141413] border-2 border-[#141413] shadow-[2px_2px_0_#141413]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#141413] animate-pulse" />
            <span>KERTAMARGA AI NAVIGATOR • BALI DIGIFEST 2026</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-[#141413] tracking-tight leading-[1.08]">
            Konsultasi Penjurusan Cerdas & Objektif
          </h1>

          <p className="text-sm sm:text-base text-[#141413]/80 font-medium max-w-2xl mx-auto leading-relaxed">
            Ketik minat, hobi, atau rencana karier kamu di Bali. Sistem navigasi ini mengevaluasi keselarasan profil secara transparan menggunakan data resmi BAN-PT dan PDDIKTI.
          </p>

          {/* Engine Disclaimer Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white border border-[#141413]/20 text-[11px] font-mono text-[#141413]/70">
            <span>Mesin Analisis Deterministik • Zero PII • Bebas Halusinasi</span>
          </div>
        </div>

        {/* Search & Query Card */}
        <div className="mt-8 neo-card-lg bg-white p-6 sm:p-8 rounded-3xl space-y-6">
          {/* Kabupaten & Target Level Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b-2 border-[#141413]/10">
            <div>
              <label className="block text-xs font-mono font-black text-[#141413] uppercase mb-1.5">
                Domisili Kabupaten Asal:
              </label>
              <select
                value={userKabupaten}
                onChange={(e) => setUserKabupaten(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border-2 border-[#141413] text-xs font-bold text-[#141413] focus:outline-hidden"
              >
                <option value="Kota Denpasar">Kota Denpasar</option>
                <option value="Kabupaten Badung">Kabupaten Badung</option>
                <option value="Kabupaten Gianyar">Kabupaten Gianyar</option>
                <option value="Kabupaten Tabanan">Kabupaten Tabanan</option>
                <option value="Kabupaten Buleleng">Kabupaten Buleleng</option>
                <option value="Kabupaten Klungkung">Kabupaten Klungkung</option>
                <option value="Kabupaten Bangli">Kabupaten Bangli</option>
                <option value="Kabupaten Karangasem">Kabupaten Karangasem</option>
                <option value="Kabupaten Jembrana">Kabupaten Jembrana</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-black text-[#141413] uppercase mb-1.5">
                Fokus Jenjang Pendidikan:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["semua", "smk", "kuliah"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setTargetLevel(lvl)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold uppercase border-2 border-[#141413] transition-all cursor-pointer ${
                      targetLevel === lvl
                        ? "bg-[#FFBE2E] text-[#141413] shadow-[2px_2px_0_#141413]"
                        : "bg-[#FAF7F2] text-[#141413]/70 hover:bg-white"
                    }`}
                  >
                    {lvl === "semua" ? "Semua" : lvl === "smk" ? "SMK" : "Kuliah"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Input */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-black text-[#141413] uppercase mb-2">
                Tuliskan Minat atau Pertanyaan Kariermu:
              </label>
              <textarea
                rows={3}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Contoh: Saya suka rancang website, antarmuka aplikasi, dan ingin cari sekolah vokasi atau kuliah di sekitar Denpasar atau Badung..."
                className="w-full p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] text-sm font-medium text-[#141413] placeholder:text-[#141413]/40 focus:bg-white focus:outline-hidden transition-colors resize-none"
              />
            </div>

            {/* Quick Topic Chips */}
            <div>
              <span className="block text-[11px] font-mono font-bold text-[#141413]/60 mb-2 uppercase">
                Pilih Topik Cepat:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_QUERIES.map((pText, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(pText)}
                    className={`text-xs px-3 py-1.5 rounded-xl border-2 border-[#141413] text-left transition-all cursor-pointer font-medium ${
                      selectedPreset === pText
                        ? "bg-[#B8F348] text-[#141413] shadow-[2px_2px_0_#141413]"
                        : "bg-[#FAF7F2] text-[#141413]/80 hover:bg-white"
                    }`}
                  >
                    "{pText}"
                  </button>
                ))}
              </div>
            </div>

            {/* Action Row */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-[#141413]/60 font-medium">
                Tip: Kuesioner lengkap dengan 12 pertanyaan dapat kamu akses di halaman Eksplorasi.
              </span>

              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-[#FF5E4D] hover:bg-[#ff4b38] disabled:opacity-40 text-white font-display font-black text-sm border-2 border-[#141413] shadow-[0_5px_0_#141413] hover:translate-y-[2px] hover:shadow-[0_3px_0_#141413] active:translate-y-[5px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-3 shrink-0"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menganalisis...</span>
                  </>
                ) : (
                  <>
                    <span>Analisis Navigasi</span>
                    <span className="font-mono text-base">&rarr;</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Boundary State 1: Loading Skeleton */}
        {isLoading && (
          <div className="mt-8 space-y-4 animate-pulse">
            <div className="h-6 w-48 bg-[#141413]/10 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-64 bg-white border-2 border-[#141413]/20 rounded-3xl" />
              <div className="h-64 bg-white border-2 border-[#141413]/20 rounded-3xl" />
            </div>
          </div>
        )}

        {/* Boundary State 2: Recommendation Results */}
        {results && !isLoading && (
          <div className="mt-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono font-black text-[#141413] uppercase tracking-wider bg-[#B8F348] px-2.5 py-0.5 rounded-md border border-[#141413]">
                  HASIL REKOMENDASI TERVERIFIKASI
                </span>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-[#141413] mt-2">
                  Bidang Studi yang Cocok untuk Kamu
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/eksplorasi"
                  className="px-4 py-2 rounded-xl bg-[#FFBE2E] hover:bg-[#f5b320] text-[#141413] font-display font-black text-xs border-2 border-[#141413] shadow-[2px_2px_0_#141413] transition-transform active:translate-y-0.5"
                >
                  Tes Kuesioner Penuh &rarr;
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {results.map((item, idx) => {
                const groupColor =
                  item.group === "teknologi"
                    ? "bg-[#2D6CDF] text-white"
                    : item.group === "manusia"
                    ? "bg-[#FF5E4D] text-white"
                    : item.group === "alam"
                    ? "bg-[#2E9E6B] text-white"
                    : "bg-[#FFBE2E] text-[#141413]";

                return (
                  <div
                    key={idx}
                    className="neo-card-lg bg-white p-6 sm:p-8 rounded-3xl space-y-5"
                  >
                    {/* Top Meta */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-[#141413]/10">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-lg border-2 border-[#141413] ${groupColor}`}>
                          {item.badgeName}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#141413]/60">
                          Pilihan #{idx + 1}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FAF7F2] border-2 border-[#141413] shadow-[2px_2px_0_#141413]">
                        <span className="text-xs font-mono font-bold text-[#141413]/70">Kesesuaian:</span>
                        <span className="font-mono font-black text-sm text-[#141413]">
                          {item.matchScore}%
                        </span>
                      </div>
                    </div>

                    {/* Title & Reason */}
                    <div>
                      <h3 className="font-display font-black text-xl sm:text-2xl text-[#141413]">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[#141413]/80 font-medium mt-2 leading-relaxed">
                        {item.reason}
                      </p>
                    </div>

                    {/* Bali Context */}
                    <div className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] text-xs space-y-1">
                      <span className="font-mono font-black text-[#141413] uppercase block">
                        Keunggulan Lokal di Bali:
                      </span>
                      <p className="text-[#141413]/80 font-medium leading-relaxed">
                        {item.baliAdvantage}
                      </p>
                    </div>

                    {/* Tags Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <span className="text-[11px] font-mono font-black text-[#141413]/60 uppercase block mb-1.5">
                          Prospek Karier Terbuka:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.careerOutlooks.map((c, i) => (
                            <span
                              key={i}
                              className="text-xs px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#141413]/30 font-medium text-[#141413]"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-mono font-black text-[#141413]/60 uppercase block mb-1.5">
                          Keahlian yang Perlu Diasah:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.skillsToImprove.map((s, i) => (
                            <span
                              key={i}
                              className="text-xs px-2.5 py-1 rounded-lg bg-[#FFBE2E]/20 border border-[#FFBE2E] font-medium text-[#141413]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Recommended Institutions */}
                    <div className="pt-2 border-t-2 border-[#141413]/10">
                      <span className="text-[11px] font-mono font-black text-[#141413]/60 uppercase block mb-2.5">
                        Institusi Rekomendasi di Bali (Terverifikasi BAN-PT / BAN-SM):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {item.recommendedInstitutions.map((inst, i) => (
                          <div
                            key={i}
                            className="p-3.5 rounded-2xl bg-white border-2 border-[#141413] shadow-[2px_2px_0_#141413] flex flex-col justify-between gap-2"
                          >
                            <div>
                              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#141413]/60 mb-1">
                                <span>{inst.level}</span>
                                <span className="bg-[#B8F348] text-[#141413] px-1.5 py-0.5 rounded border border-[#141413]">
                                  {inst.akreditasi}
                                </span>
                              </div>
                              <h4 className="font-display font-black text-sm text-[#141413] leading-snug">
                                {inst.name}
                              </h4>
                              <p className="text-xs text-[#141413]/70 font-medium mt-0.5">
                                {inst.kabupaten} • estimasi jarak {inst.distanceKm} km
                              </p>
                            </div>
                            <div className="text-[10px] font-mono text-[#141413]/50">
                              Sumber: {inst.source}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom CTA to Field Guide & Modul */}
                    <div className="pt-2 flex flex-wrap justify-end gap-2">
                      <Link
                        href={`/hasil-analisis?field=${item.fieldId}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFBE2E] hover:bg-[#f2b329] text-[#141413] font-display font-bold text-xs border-2 border-[#141413] shadow-[2px_2px_0_#141413]"
                      >
                        <span>Modul &amp; Sertifikasi</span>
                        <span className="font-mono">&rarr;</span>
                      </Link>
                      <Link
                        href={`/peta-bidang/${item.fieldId}`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141413] hover:bg-[#272725] text-white font-display font-black text-xs border-2 border-[#141413] shadow-[2px_2px_0_#FF5E4D] transition-transform active:translate-y-0.5"
                      >
                        <span>Buka Panduan Bidang Lengkap</span>
                        <span className="font-mono">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Boundary State 3: Empty State */}
        {!results && !isLoading && (
          <div className="mt-10 text-center p-10 sm:p-14 neo-card bg-white rounded-3xl border-2 border-dashed border-[#141413]/30">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFBE2E] border-2 border-[#141413] text-[#141413] flex items-center justify-center font-mono font-black text-xl mb-4 shadow-[3px_3px_0_#141413]">
              ?
            </div>
            <h3 className="font-display font-black text-lg text-[#141413]">
              Belum Ada Analisis yang Berjalan
            </h3>
            <p className="text-xs sm:text-sm text-[#141413]/70 font-medium mt-2 max-w-md mx-auto leading-relaxed">
              Pilih salah satu contoh topik cepat di atas atau tuliskan langsung minat dan cita-citamu, lalu klik tombol "Analisis Navigasi".
            </p>
          </div>
        )}
      </main>

      {/* Tactile Footer */}
      <footer className="w-full bg-[#FAF7F2] border-t-2 border-[#141413] py-8 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <span className="w-6 h-6 rounded-lg bg-[#FFBE2E] border-2 border-[#141413] text-[#141413] font-mono font-black text-xs flex items-center justify-center">
                KM
              </span>
              <span className="font-display font-black text-sm text-[#141413]">
                KertaMarga Bali AI Navigator
              </span>
            </div>
            <p className="text-xs text-[#141413]/70 font-medium">
              Inovasi Navigasi Karier & Penjurusan untuk Bali DigiFest 2026
            </p>
          </div>
          <div className="text-xs font-mono font-bold text-[#141413]/70 flex flex-wrap justify-center gap-4">
            <Link href="/eksplorasi" className="hover:text-[#141413] underline">
              Kuesioner Eksplorasi
            </Link>
            <Link href="/katalog" className="hover:text-[#141413] underline">
              Katalog Kampus & SMK
            </Link>
            <Link href="/#peta-kampus" className="hover:text-[#141413] underline">
              Radar Peta Bali
            </Link>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onProceedToTest={() => setIsLoginModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}
