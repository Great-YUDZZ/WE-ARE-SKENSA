import { estimateDistanceKm } from "@/data/catalog";

export interface NavigatorResult {
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

export type TargetLevel = "semua" | "smk" | "kuliah";

// Matcher deterministik berbasis kata kunci agar hasil tetap konsisten
// dan tidak mengarang akreditasi, sesuai guardrail AI KertaMarga
export function matchNavigator(inputQuery: string, userKabupaten: string, targetLevel: TargetLevel): NavigatorResult[] {
  const q = inputQuery.toLowerCase();
  const output: NavigatorResult[] = [];

  const hasTech = q.includes("code") || q.includes("coding") || q.includes("it") || q.includes("web") || q.includes("software") || q.includes("rpl") || q.includes("komputer") || q.includes("ai");
  const hasDesign = q.includes("desain") || q.includes("ui") || q.includes("ux") || q.includes("animasi") || q.includes("gambar") || q.includes("dkv") || q.includes("video");
  const hasTourism = q.includes("pariwisata") || q.includes("hotel") || q.includes("kuliner") || q.includes("wisata") || q.includes("hospitality");
  const hasCulture = q.includes("budaya") || q.includes("tari") || q.includes("karawitan") || q.includes("adat") || q.includes("seni");
  const hasAgri = q.includes("tani") || q.includes("pertanian") || q.includes("subak") || q.includes("organik") || q.includes("pangan");
  const hasMarine = q.includes("laut") || q.includes("pesisir") || q.includes("maritim") || q.includes("lingkungan");

  if (hasTech || (!hasTourism && !hasCulture && !hasAgri && !hasMarine)) {
    output.push({
      fieldId: "informatika",
      title: "Teknik Informatika dan Rekayasa Perangkat Lunak",
      group: "teknologi",
      badgeName: "Teknologi dan Rancang",
      matchScore: 96,
      reason: "Minat kuat pada pembuatan aplikasi web, pemecahan masalah algoritma, dan rekayasa perangkat lunak modern.",
      baliAdvantage: "Peluang karir remote global dan digital nomad hub di Sanur, Canggu, serta transformasi digital UMKM Bali.",
      careerOutlooks: ["Frontend dan Full-stack Developer", "Software Engineer", "Mobile App Developer"],
      skillsToImprove: ["JavaScript dan TypeScript", "Dasar Basis Data SQL", "Version Control Git"],
      recommendedInstitutions: [
        { name: "Politeknik Negeri Bali (PNB) - Jimbaran", level: "D4 Vokasi Terapan", kabupaten: "Kabupaten Badung", akreditasi: "Unggul", distanceKm: estimateDistanceKm(userKabupaten, "Kabupaten Badung"), source: "Terverifikasi" },
        { name: "SMK Negeri 1 Denpasar (SKENSA)", level: "SMK Vokasi 3 Tahun", kabupaten: "Kota Denpasar", akreditasi: "A", distanceKm: estimateDistanceKm(userKabupaten, "Kota Denpasar"), source: "Terverifikasi" },
        { name: "Universitas Udayana - Jimbaran", level: "S1 Akademik", kabupaten: "Kabupaten Badung", akreditasi: "Unggul", distanceKm: estimateDistanceKm(userKabupaten, "Kabupaten Badung"), source: "Terverifikasi" },
      ],
    });
  }

  if (hasDesign || hasTech) {
    output.push({
      fieldId: "dkv",
      title: "Desain Komunikasi Visual dan Media Interaktif",
      group: "teknologi",
      badgeName: "Teknologi dan Rancang",
      matchScore: 92,
      reason: "Kombinasi antara kepekaan estetika visual, tipografi, dan perancangan antarmuka digital pengguna.",
      baliAdvantage: "Agensi kreatif internasional di Bali berkembang pesat dan membutuhkan desainer dengan pemahaman budaya lokal.",
      careerOutlooks: ["UI/UX Product Designer", "Brand Identity Specialist", "Motion Graphic Artist"],
      skillsToImprove: ["Figma Design System", "Dasar Komposisi dan Tipografi", "Prinsip Usability"],
      recommendedInstitutions: [
        { name: "Institut Seni Indonesia Denpasar", level: "S1 Seni dan Desain", kabupaten: "Kota Denpasar", akreditasi: "Unggul", distanceKm: estimateDistanceKm(userKabupaten, "Kota Denpasar"), source: "Terverifikasi" },
        { name: "SMK Negeri 1 Sukawati", level: "SMK Seni dan Industri Kreatif", kabupaten: "Kabupaten Gianyar", akreditasi: "A", distanceKm: estimateDistanceKm(userKabupaten, "Kabupaten Gianyar"), source: "Terverifikasi" },
      ],
    });
  }

  if (hasTourism) {
    output.push({
      fieldId: "pariwisata",
      title: "Manajemen Perhotelan dan Ekowisata Berkelanjutan",
      group: "usaha",
      badgeName: "Usaha dan Layanan",
      matchScore: 94,
      reason: "Karakteristik kepemimpinan hospitality, etika layanan tinggi, serta kesadaran ekowisata hijau.",
      baliAdvantage: "Ekosistem pariwisata internasional dengan standar sertifikasi dunia.",
      careerOutlooks: ["Hospitality Operations Manager", "Sustainable Tourism Consultant", "Event dan MICE Organizer"],
      skillsToImprove: ["Bahasa Inggris dan Bahasa Asing Tambahan", "Etika Pelayanan Budaya", "Manajemen Operasional"],
      recommendedInstitutions: [
        { name: "Politeknik Pariwisata Bali - Nusa Dua", level: "D4 Vokasi Pariwisata", kabupaten: "Kabupaten Badung", akreditasi: "Unggul", distanceKm: estimateDistanceKm(userKabupaten, "Kabupaten Badung"), source: "Terverifikasi" },
        { name: "SMK Negeri 3 Denpasar", level: "SMK Pariwisata dan Perhotelan", kabupaten: "Kota Denpasar", akreditasi: "A", distanceKm: estimateDistanceKm(userKabupaten, "Kota Denpasar"), source: "Terverifikasi" },
      ],
    });
  }

  if (hasCulture) {
    output.push({
      fieldId: "budaya",
      title: "Seni Pertunjukan, Tari Tradisi dan Karawitan Bali",
      group: "manusia",
      badgeName: "Manusia dan Budaya",
      matchScore: 91,
      reason: "Kecintaan mendalam terhadap seni adiluhung Bali, ritme karawitan, dan ekspresi gerak tradisi.",
      baliAdvantage: "Panggung kebudayaan hidup yang aktif dalam ritual desa pakraman maupun festival seni.",
      careerOutlooks: ["Koreografer Tari Kontemporer", "Seniman Karawitan dan Komposer Musik Bali", "Kurator Festival Budaya"],
      skillsToImprove: ["Teknik Agem dan Seledet Tari", "Tabuh Gamelan dan Notasi Bali", "Sejarah Kebudayaan Nusantara"],
      recommendedInstitutions: [
        { name: "Institut Seni Indonesia Denpasar", level: "S1 Seni Pertunjukan", kabupaten: "Kota Denpasar", akreditasi: "Unggul", distanceKm: estimateDistanceKm(userKabupaten, "Kota Denpasar"), source: "Terverifikasi" },
        { name: "SMK Negeri 1 Sukawati", level: "SMK Vokasi Seni Pertunjukan", kabupaten: "Kabupaten Gianyar", akreditasi: "A", distanceKm: estimateDistanceKm(userKabupaten, "Kabupaten Gianyar"), source: "Terverifikasi" },
      ],
    });
  }

  if (hasAgri || hasMarine) {
    output.push({
      fieldId: "pertanian",
      title: "Pertanian Regeneratif, Agroteknologi Subak dan Pangan",
      group: "alam",
      badgeName: "Alam dan Pangan",
      matchScore: 90,
      reason: "Ketertarikan pada keberlanjutan pangan, teknik budidaya ramah lingkungan, dan modernisasi subak Bali.",
      baliAdvantage: "Sistem Subak Bali membutuhkan sentuhan IoT dan digitalisasi rantai pasok organik.",
      careerOutlooks: ["Konsultan Smart Farming", "Manajer Agribisnis Organik", "Peneliti Pertanian Presisi"],
      skillsToImprove: ["Agroklimatologi Tropis", "Teknik Pemupukan Organik Presisi", "Manajemen Pascapanen"],
      recommendedInstitutions: [
        { name: "Fakultas Pertanian Universitas Udayana", level: "S1 Agroteknologi", kabupaten: "Kota Denpasar", akreditasi: "Unggul", distanceKm: estimateDistanceKm(userKabupaten, "Kota Denpasar"), source: "Terverifikasi" },
      ],
    });
  }

  let filtered = output;
  if (targetLevel === "smk") {
    filtered = output.map((r) => ({ ...r, recommendedInstitutions: r.recommendedInstitutions.filter((i) => i.level.includes("SMK")) }));
  } else if (targetLevel === "kuliah") {
    filtered = output.map((r) => ({ ...r, recommendedInstitutions: r.recommendedInstitutions.filter((i) => !i.level.includes("SMK")) }));
  }
  return filtered.length > 0 ? filtered : output;
}

export function buildChatIntro(results: NavigatorResult[]): string {
  if (results.length === 0) {
    return "Coba ceritakan minatmu lebih spesifik, misal coding, desain, pariwisata, seni, tani, atau laut. Nanti aku carikan yang paling cocok.";
  }
  const titles = results.map((r, i) => `${i + 1}. ${r.title} (${r.matchScore}%)`).join("\n");
  return `Dari ceritamu, aku dapat ${results.length} pilihan yang paling cocok.\n\n${titles}\n\nLihat kartu di samping untuk instansi dan jaraknya. Mau kugali salah satu lebih dalam?`;
}
