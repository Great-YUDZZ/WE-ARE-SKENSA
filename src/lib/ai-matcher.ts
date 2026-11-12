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

interface FieldMatcherEntry {
  fieldId: string;
  title: string;
  group: "teknologi" | "manusia" | "alam" | "usaha";
  badgeName: string;
  baseScore: number;
  keywords: string[];
  reason: string;
  baliAdvantage: string;
  careerOutlooks: string[];
  skillsToImprove: string[];
  institutions: {
    name: string;
    level: string;
    kabupaten: string;
    akreditasi: string;
  }[];
}

const MATCHER_ENTRIES: FieldMatcherEntry[] = [
  {
    fieldId: "informatika",
    title: "Informatika & Rekayasa Perangkat Lunak",
    group: "teknologi",
    badgeName: "Teknologi dan Rancang",
    baseScore: 96,
    keywords: ["informatika", "rpl", "pplg", "coding", "software", "web", "aplikasi", "programmer", "ai", "komputer"],
    reason: "Minat kuat pada pembuatan aplikasi web, pemecahan masalah algoritma, dan rekayasa perangkat lunak modern.",
    baliAdvantage: "Peluang karir remote global dan digital hub di Bali serta transformasi digital UMKM lokal.",
    careerOutlooks: ["Frontend dan Full-stack Developer", "Software Engineer", "Mobile App Developer"],
    skillsToImprove: ["JavaScript dan TypeScript", "Dasar Basis Data SQL", "Version Control Git"],
    institutions: [
      { name: "Politeknik Negeri Bali (PNB) - Jimbaran", level: "D4 Vokasi Terapan", kabupaten: "Badung", akreditasi: "Baik Sekali" },
      { name: "SMK Negeri 1 Denpasar (SKENSA)", level: "SMK PPLG 3 Tahun", kabupaten: "Kota Denpasar", akreditasi: "A (Unggul)" },
      { name: "Universitas Udayana (Unud)", level: "S1 Akademik", kabupaten: "Badung", akreditasi: "Unggul" },
    ],
  },
  {
    fieldId: "tkj",
    title: "Teknik Jaringan Komputer, Telekomunikasi & Cloud (TKJ / TJKT)",
    group: "teknologi",
    badgeName: "Teknologi dan Rancang",
    baseScore: 94,
    keywords: ["tkj", "tjkt", "jaringan", "network", "cisco", "ccna", "mikrotik", "mtcna", "server", "cloud", "cyber", "siber"],
    reason: "Kecenderungan analitis pada arsitektur jaringan komputer, infrastruktur cloud, dan administrasi server.",
    baliAdvantage: "Kebutuhan tinggi tenaga infrastruktur jaringan di resort, rumah sakit, kampus, dan layanan publik Bali.",
    careerOutlooks: ["Network Administrator", "Cloud & DevOps Engineer", "Cyber Security Analyst"],
    skillsToImprove: ["Routing & Switching (CCNA/MTCNA)", "Administrasi Server Linux", "Keamanan Jaringan Dasar"],
    institutions: [
      { name: "SMK Negeri 1 Denpasar (SKENSA)", level: "SMK TJKT", kabupaten: "Kota Denpasar", akreditasi: "A (Unggul)" },
      { name: "Politeknik Negeri Bali (PNB)", level: "D3 / D4 Teknik Komputer & Jaringan", kabupaten: "Badung", akreditasi: "Baik Sekali" },
      { name: "Universitas Pendidikan Ganesha (Undiksha)", level: "S1 Pendidikan Teknik Informatika", kabupaten: "Buleleng", akreditasi: "Unggul" },
    ],
  },
  {
    fieldId: "dkv",
    title: "Desain Komunikasi Visual & Multimedia",
    group: "teknologi",
    badgeName: "Teknologi dan Rancang",
    baseScore: 92,
    keywords: ["dkv", "desain", "ui", "ux", "animasi", "gambar", "ilustrasi", "grafis", "multimedia", "video"],
    reason: "Kombinasi antara kepekaan estetika visual, tipografi, dan perancangan antarmuka digital pengguna.",
    baliAdvantage: "Ekosistem industri kreatif dan agensi digital Bali membutuhkan desainer yang peka terhadap budaya lokal.",
    careerOutlooks: ["UI/UX Product Designer", "Brand Identity Specialist", "Motion Graphic Artist"],
    skillsToImprove: ["Figma Design System", "Dasar Komposisi dan Tipografi", "Prinsip Usability"],
    institutions: [
      { name: "Institut Seni Indonesia (ISI) Denpasar", level: "S1 Seni & Desain", kabupaten: "Kota Denpasar", akreditasi: "Unggul" },
      { name: "Institut Bisnis dan Teknologi Indonesia (INSTIKI)", level: "S1 DKV", kabupaten: "Kota Denpasar", akreditasi: "Baik Sekali" },
      { name: "SMK Negeri 1 Sukawati", level: "SMK DKV", kabupaten: "Gianyar", akreditasi: "A (Unggul)" },
    ],
  },
  {
    fieldId: "arsitektur",
    title: "Arsitektur & Desain Ruang Berkelanjutan",
    group: "teknologi",
    badgeName: "Teknologi dan Rancang",
    baseScore: 91,
    keywords: ["arsitektur", "bangunan", "villa", "interior", "konstruksi", "tata ruang", "cad", "pemodelan"],
    reason: "Minat pada perancangan ruang estetik, struktur bangunan tropis, dan pemodelan visual 3D.",
    baliAdvantage: "Perpaduan arsitektur tradisional Bali (Asta Kosala Kosali) dan desain bangunan hijau ramah lingkungan.",
    careerOutlooks: ["Arsitek Desain Tropis", "Perancang Interior Berkelanjutan", "BIM & CAD Specialist"],
    skillsToImprove: ["Gambar Teknik & CAD 3D", "Material Tropis Berkelanjutan", "Prinsip Tata Ruang Bali"],
    institutions: [
      { name: "Universitas Udayana (Unud)", level: "S1 Arsitektur", kabupaten: "Badung", akreditasi: "Unggul" },
      { name: "Universitas Warmadewa", level: "S1 Arsitektur", kabupaten: "Kota Denpasar", akreditasi: "Unggul" },
      { name: "SMKN 3 Denpasar", level: "SMK Desain Pemodelan", kabupaten: "Kota Denpasar", akreditasi: "A (Unggul)" },
    ],
  },
  {
    fieldId: "kesehatan",
    title: "Kesehatan Komunitas & Keperawatan",
    group: "manusia",
    badgeName: "Manusia dan Budaya",
    baseScore: 93,
    keywords: ["kesehatan", "perawat", "keperawatan", "medis", "kedokteran", "farmasi", "klinik", "rumah sakit"],
    reason: "Empati tinggi serta ketertarikan pada pelayanan kesehatan masyarakat dan ilmu medis terapan.",
    baliAdvantage: "Pengembangan fasilitas layanan medis dan wisata kesehatan bertaraf internasional di Bali.",
    careerOutlooks: ["Perawat Profesional", "Tenaga Farmasi Klinis", "Analis Kesehatan Komunitas"],
    skillsToImprove: ["Dasar Biologi & Anatomi", "Komunikasi Empatik Pasien", "Prosedur Keselamatan Klinis"],
    institutions: [
      { name: "Poltekkes Kemenkes Denpasar", level: "D3 / D4 Kesehatan", kabupaten: "Kota Denpasar", akreditasi: "Unggul" },
      { name: "Universitas Udayana", level: "S1 Keperawatan & Kedokteran", kabupaten: "Kota Denpasar", akreditasi: "Unggul" },
      { name: "SMK Kesehatan Panca Atma Jaya", level: "SMK Farmasi/Perawat", kabupaten: "Klungkung", akreditasi: "Baik Sekali" },
    ],
  },
  {
    fieldId: "pendidikan",
    title: "Pendidikan & Bimbingan Konseling",
    group: "manusia",
    badgeName: "Manusia dan Budaya",
    baseScore: 90,
    keywords: ["pendidikan", "guru", "konseling", "bk", "psikologi", "mengajar", "edukasi", "sekolah"],
    reason: "Ketertarikan membimbing orang lain, menjelaskan konsep kompleks secara sederhana, dan memahami perkembangan remaja.",
    baliAdvantage: "Transformasi sekolah digital di seluruh kabupaten Bali membutuhkan pendidik dan konselor adaptif.",
    careerOutlooks: ["Guru & Pendidik Inovatif", "Konselor Pendidikan (BK)", "Instructional Designer"],
    skillsToImprove: ["Komunikasi Pedagogis", "Psikologi Perkembangan", "Media Pembelajaran Digital"],
    institutions: [
      { name: "Universitas Pendidikan Ganesha (Undiksha)", level: "S1 Kependidikan", kabupaten: "Buleleng", akreditasi: "Unggul" },
      { name: "Universitas PGRI Mahadewa Indonesia", level: "S1 Bimbingan Konseling", kabupaten: "Kota Denpasar", akreditasi: "Baik Sekali" },
    ],
  },
  {
    fieldId: "budaya",
    title: "Seni Karawitan, Tari & Budaya Bali",
    group: "manusia",
    badgeName: "Manusia dan Budaya",
    baseScore: 91,
    keywords: ["budaya", "tari", "karawitan", "gamelan", "adat", "seni", "pertunjukan", "kokar"],
    reason: "Kecintaan mendalam terhadap seni adiluhung Bali, ritme karawitan, dan ekspresi gerak tradisi.",
    baliAdvantage: "Panggung kebudayaan hidup yang aktif dalam kegiatan adat maupun festival seni internasional.",
    careerOutlooks: ["Koreografer Tari Kontemporer", "Seniman Karawitan dan Komposer", "Kurator Festival Budaya"],
    skillsToImprove: ["Teknik Dasar Tari Bali", "Tabuh Gamelan dan Notasi", "Kurasi Seni Pertunjukan"],
    institutions: [
      { name: "Institut Seni Indonesia (ISI) Denpasar", level: "S1 Seni Pertunjukan", kabupaten: "Kota Denpasar", akreditasi: "Unggul" },
      { name: "SMKN 3 Sukawati (KOKAR)", level: "SMK Seni Musik & Tari", kabupaten: "Gianyar", akreditasi: "A (Unggul)" },
    ],
  },
  {
    fieldId: "pertanian",
    title: "Pertanian Organik & Agroteknologi Subak",
    group: "alam",
    badgeName: "Alam dan Pangan",
    baseScore: 90,
    keywords: ["pertanian", "tani", "subak", "organik", "pangan", "agro", "tanaman", "kopi", "agribisnis"],
    reason: "Ketertarikan pada keberlanjutan pangan, teknik budidaya ramah lingkungan, dan modernisasi Subak Bali.",
    baliAdvantage: "Sistem Subak Bali membutuhkan sentuhan agroteknologi dan rantai pasok pangan organik untuk hotel/restoran.",
    careerOutlooks: ["Konsultan Smart Farming", "Manajer Agribisnis Organik", "Peneliti Pertanian Presisi"],
    skillsToImprove: ["Agroklimatologi Tropis", "Budidaya Organik Presisi", "Manajemen Pascapanen"],
    institutions: [
      { name: "Universitas Udayana", level: "S1 Agroteknologi & Agribisnis", kabupaten: "Badung", akreditasi: "Unggul" },
      { name: "Politeknik Negeri Bali (Kampus Tabanan)", level: "D4 Pengelolaan Tanaman", kabupaten: "Tabanan", akreditasi: "Baik Sekali" },
      { name: "SMKN 1 Petang", level: "SMK Agribisnis Tanaman", kabupaten: "Badung", akreditasi: "A (Unggul)" },
    ],
  },
  {
    fieldId: "lingkungan",
    title: "Ilmu Kelautan & Pengelolaan Lingkungan",
    group: "alam",
    badgeName: "Alam dan Pangan",
    baseScore: 90,
    keywords: ["lingkungan", "laut", "kelautan", "pesisir", "maritim", "konservasi", "karang", "sampah", "energi"],
    reason: "Kepedulian kuat pada konservasi ekosistem laut, pengelolaan limbah sirkular, dan ekologi pulau tropis.",
    baliAdvantage: "Pengelolaan wilayah pesisir dan konservasi laut menjadi prioritas utama pariwisata hijau Bali.",
    careerOutlooks: ["Analis Konservasi Pesisir", "Spesialis Pengelolaan Limbah", "Konsultan Keberlanjutan"],
    skillsToImprove: ["Ekologi Pesisir & Terumbu Karang", "Audit Lingkungan Dasar", "Pengolahan Limbah Sirkular"],
    institutions: [
      { name: "Universitas Udayana", level: "S1 Ilmu Kelautan & Manajemen Sumberdaya", kabupaten: "Badung", akreditasi: "Unggul" },
      { name: "Universitas Warmadewa", level: "S1 Manajemen Lingkungan", kabupaten: "Kota Denpasar", akreditasi: "Baik Sekali" },
      { name: "SMKN 1 Abang", level: "SMK Perikanan & Kelautan", kabupaten: "Karangasem", akreditasi: "A (Unggul)" },
    ],
  },
  {
    fieldId: "bisnis",
    title: "Bisnis Digital & Manajemen E-Commerce",
    group: "usaha",
    badgeName: "Usaha dan Layanan",
    baseScore: 92,
    keywords: ["bisnis", "usaha", "umkm", "dagang", "ecommerce", "e-commerce", "marketing", "pemasaran", "startup", "ekonomi"],
    reason: "Jiwa wirausaha, ketertarikan membangun brand lokal, strategi pemasaran digital, dan manajemen keuangan.",
    baliAdvantage: "Potensi produk kriya, fesyen, dan kuliner UMKM Bali sangat besar untuk menembus pasar ekspor digital.",
    careerOutlooks: ["Digital Marketing Strategist", "E-Commerce & Brand Manager", "Founder Startup Lokal"],
    skillsToImprove: ["Analisis Pasar Digital", "Literasi Keuangan UMKM", "Copywriting & Branding"],
    institutions: [
      { name: "Politeknik Negeri Bali (PNB)", level: "D4 Manajemen Bisnis Internasional", kabupaten: "Badung", akreditasi: "Unggul" },
      { name: "Universitas Pendidikan Nasional (Undiknas)", level: "S1 Manajemen Bisnis", kabupaten: "Kota Denpasar", akreditasi: "Unggul" },
      { name: "SMKN 2 Denpasar", level: "SMK Bisnis Daring & Pemasaran", kabupaten: "Kota Denpasar", akreditasi: "A (Unggul)" },
    ],
  },
  {
    fieldId: "pariwisata",
    title: "Manajemen Perhotelan & Ekowisata Berkelanjutan",
    group: "usaha",
    badgeName: "Usaha dan Layanan",
    baseScore: 94,
    keywords: ["pariwisata", "hotel", "perhotelan", "kuliner", "boga", "wisata", "hospitality", "ekowisata", "tour"],
    reason: "Karakteristik kepemimpinan hospitality, etika layanan tinggi, serta kesadaran ekowisata hijau.",
    baliAdvantage: "Ekosistem pariwisata internasional dengan standar sertifikasi profesi global di Bali.",
    careerOutlooks: ["Hospitality Operations Manager", "Sustainable Tourism Consultant", "Event dan MICE Organizer"],
    skillsToImprove: ["Bahasa Inggris dan Bahasa Asing", "Etika Pelayanan Budaya Bali", "Manajemen Operasional"],
    institutions: [
      { name: "Politeknik Pariwisata Bali (Poltekpar)", level: "D3 / D4 Perhotelan", kabupaten: "Badung", akreditasi: "Unggul" },
      { name: "Politeknik Negeri Bali (PNB)", level: "D4 Pengelolaan Perhotelan", kabupaten: "Badung", akreditasi: "Unggul" },
      { name: "SMKN 3 Denpasar", level: "SMK Perhotelan & Kuliner", kabupaten: "Kota Denpasar", akreditasi: "A (Unggul)" },
    ],
  },
];

function toNavigatorResult(entry: FieldMatcherEntry, userKabupaten: string): NavigatorResult {
  return {
    fieldId: entry.fieldId,
    title: entry.title,
    group: entry.group,
    badgeName: entry.badgeName,
    matchScore: entry.baseScore,
    reason: entry.reason,
    baliAdvantage: entry.baliAdvantage,
    careerOutlooks: entry.careerOutlooks,
    skillsToImprove: entry.skillsToImprove,
    recommendedInstitutions: entry.institutions.map((inst) => ({
      ...inst,
      distanceKm: estimateDistanceKm(userKabupaten, inst.kabupaten),
      source: "Terverifikasi",
    })),
  };
}

// Matcher deterministik berbasis kata kunci dan fieldId agar hasil tetap konsisten
// dan tidak mengarang akreditasi, sesuai guardrail AI KertaMarga
export function matchNavigator(
  inputQuery: string,
  userKabupaten: string,
  targetLevel: TargetLevel
): NavigatorResult[] {
  const q = inputQuery.trim().toLowerCase();

  // Cocokkan langsung jika input adalah fieldId eksplisit dari API
  const exactField = MATCHER_ENTRIES.find((entry) => entry.fieldId === q);
  let matchedEntries: FieldMatcherEntry[];

  if (exactField) {
    matchedEntries = [exactField];
  } else {
    matchedEntries = MATCHER_ENTRIES.filter((entry) =>
      entry.keywords.some((kw) => q.includes(kw))
    );
    if (matchedEntries.length === 0) {
      matchedEntries = MATCHER_ENTRIES.slice(0, 2);
    }
  }

  const output = matchedEntries.slice(0, 3).map((e) => toNavigatorResult(e, userKabupaten));

  let filtered = output;
  if (targetLevel === "smk") {
    filtered = output
      .map((r) => ({
        ...r,
        recommendedInstitutions: r.recommendedInstitutions.filter((i) =>
          i.level.toUpperCase().includes("SMK")
        ),
      }))
      .filter((r) => r.recommendedInstitutions.length > 0);
  } else if (targetLevel === "kuliah") {
    filtered = output
      .map((r) => ({
        ...r,
        recommendedInstitutions: r.recommendedInstitutions.filter(
          (i) => !i.level.toUpperCase().includes("SMK")
        ),
      }))
      .filter((r) => r.recommendedInstitutions.length > 0);
  }

  return filtered.length > 0 ? filtered : output;
}

export function buildChatIntro(results: NavigatorResult[]): string {
  if (results.length === 0) {
    return "Coba ceritakan minatmu lebih spesifik, misal coding, jaringan, desain, kesehatan, pertanian, bisnis, atau pariwisata. Nanti aku carikan yang paling cocok.";
  }
  const titles = results.map((r, i) => `${i + 1}. ${r.title} (${r.matchScore}%)`).join("\n");
  return `Dari ceritamu, aku dapat ${results.length} pilihan yang paling cocok.\n\n${titles}\n\nLihat kartu di samping untuk instansi dan jaraknya. Mau kugali salah satu lebih dalam?`;
}
