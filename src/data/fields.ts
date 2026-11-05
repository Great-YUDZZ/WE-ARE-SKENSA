export type FieldGroup = "teknologi" | "manusia" | "alam" | "usaha";

export interface MajorField {
  id: string;
  name: string;
  group: FieldGroup;
  categoryName: string;
  description: string;
  vibeTagline: string;
  institutions: {
    name: string;
    level: string;
    location: string;
    accreditation: string;
  }[];
}

export interface VibeCardItem {
  id: string;
  cardNumber: string;
  vibeTitle: string;
  studentQuote: string;
  activityTags: string[];
  matchedFieldId: string;
  matchedMajor: string;
  matchedCampus: string;
  matchedLocation: string;
  matchPercentage: number;
  group: FieldGroup;
  accentBg: string;
  accentText: string;
}

export const GROUP_CONFIG: Record<
  FieldGroup,
  {
    label: string;
    shortLabel: string;
    colorHex: string;
    colorDarkText?: string;
    bgClass: string;
    borderClass: string;
    textClass: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  teknologi: {
    label: "Teknologi & Rancang Visual",
    shortLabel: "Teknologi & Visual",
    colorHex: "#3B66FF",
    bgClass: "bg-[#3B66FF]",
    borderClass: "border-[#3B66FF]",
    textClass: "text-[#3B66FF]",
    badgeBg: "bg-[#3B66FF]",
    badgeText: "text-white",
  },
  manusia: {
    label: "Manusia, Seni & Budaya",
    shortLabel: "Manusia & Budaya",
    colorHex: "#FF5E4D",
    bgClass: "bg-[#FF5E4D]",
    borderClass: "border-[#FF5E4D]",
    textClass: "text-[#FF5E4D]",
    badgeBg: "bg-[#FF5E4D]",
    badgeText: "text-white",
  },
  alam: {
    label: "Alam, Agrikultur & Laut",
    shortLabel: "Alam & Eco",
    colorHex: "#1AD598",
    colorDarkText: "#0F6E4E",
    bgClass: "bg-[#1AD598]",
    borderClass: "border-[#1AD598]",
    textClass: "text-[#0F6E4E]",
    badgeBg: "bg-[#1AD598]",
    badgeText: "text-[#141413]",
  },
  usaha: {
    label: "Bisnis Kreatif & Hospitality",
    shortLabel: "Bisnis & Wisata",
    colorHex: "#FFBE2E",
    bgClass: "bg-[#FFBE2E]",
    borderClass: "border-[#FFBE2E]",
    textClass: "text-[#141413]",
    badgeBg: "bg-[#FFBE2E]",
    badgeText: "text-[#141413]",
  },
};

export const VIBE_CARDS: VibeCardItem[] = [
  {
    id: "vibe-tech",
    cardNumber: "VIBE #01",
    vibeTitle: "Ngulik Kode, Bikin Game & Eksperimen AI",
    studentQuote: "Aku paling betah kalau udah ngoprek web, bikin bot otomatis, atau beresin masalah teknis pakai logika.",
    activityTags: ["Fullstack Web", "Game Dev", "AI Terapan"],
    matchedFieldId: "informatika",
    matchedMajor: "D4 Rekayasa Perangkat Lunak / S1 Informatika",
    matchedCampus: "Politeknik Negeri Bali (PNB) & SMKN 1 Denpasar",
    matchedLocation: "Jimbaran & Denpasar Utara",
    matchPercentage: 96,
    group: "teknologi",
    accentBg: "#3B66FF",
    accentText: "#FFFFFF",
  },
  {
    id: "vibe-creative",
    cardNumber: "VIBE #02",
    vibeTitle: "Bikin Konten Visual, UI/UX & Ilustrasi Digital",
    studentQuote: "Suka banget ngedit video estetik, bikin poster acara sekolah, atau ngerancang tampilan aplikasi yang keren.",
    activityTags: ["UI/UX Design", "Motion Graphic", "Branding Lokal"],
    matchedFieldId: "dkv",
    matchedMajor: "S1 Desain Komunikasi Visual & Multimedia",
    matchedCampus: "ISI Denpasar & INSTIKI",
    matchedLocation: "Denpasar Timur & Pusat",
    matchPercentage: 94,
    group: "teknologi",
    accentBg: "#B8F348",
    accentText: "#141413",
  },
  {
    id: "vibe-biz",
    cardNumber: "VIBE #03",
    vibeTitle: "Bangun Brand Lokal, Cafe & Hospitality Bali",
    studentQuote: "Pengen punya bisnis sendiri di Bali, jago negosiasi, suka ketemu orang baru, dan ngatur strategi sosmed.",
    activityTags: ["Digital Marketing", "Hospitality", "Brand Builder"],
    matchedFieldId: "pariwisata",
    matchedMajor: "D4 Manajemen Bisnis & Perhotelan Internasional",
    matchedCampus: "Poltekpar Bali Nusa Dua & Undiknas",
    matchedLocation: "Nusa Dua & Denpasar Selatan",
    matchPercentage: 93,
    group: "usaha",
    accentBg: "#FFBE2E",
    accentText: "#141413",
  },
  {
    id: "vibe-culture",
    cardNumber: "VIBE #04",
    vibeTitle: "Peduli Sesama, Kesehatan & Seni Budaya Bali",
    studentQuote: "Senang bantu teman curhat, tertarik dunia medis/psikologi, atau aktif ngayah menari dan nabuh gamelan.",
    activityTags: ["Medical Care", "Psikologi & BK", "Seni Pertunjukan"],
    matchedFieldId: "kesehatan",
    matchedMajor: "S1 Keperawatan / Seni Pertunjukan / Konseling",
    matchedCampus: "Universitas Udayana & Poltekkes Denpasar",
    matchedLocation: "Denpasar & Singaraja",
    matchPercentage: 92,
    group: "manusia",
    accentBg: "#FF5E4D",
    accentText: "#FFFFFF",
  },
  {
    id: "vibe-nature",
    cardNumber: "VIBE #05",
    vibeTitle: "Eksplorasi Alam, Eco-Tech Subak & Kelautan",
    studentQuote: "Lebih suka kegiatan lapangan di alam terbuka, peduli isu lingkungan Bali, kopi organik, dan ekosistem laut.",
    activityTags: ["Smart Subak", "Marine Dive", "Eco-Inovasi"],
    matchedFieldId: "pertanian",
    matchedMajor: "S1 Ilmu Kelautan & Agroteknologi Organik",
    matchedCampus: "Unud Jimbaran & PNB Kampus Tabanan",
    matchedLocation: "Jimbaran & Tabanan",
    matchPercentage: 91,
    group: "alam",
    accentBg: "#1AD598",
    accentText: "#141413",
  },
];

export const FIELDS: MajorField[] = [
  // 1. Biru: Teknologi dan rancang
  {
    id: "informatika",
    name: "Informatika & Rekayasa Perangkat Lunak",
    group: "teknologi",
    categoryName: "Teknologi & Rancang Visual",
    vibeTagline: "Cocok buat yang hobi ngulik coding, bikin aplikasi, dan sistem pintar.",
    description: "Mempelajari pembuatan aplikasi web, mobile, sistem database, dan kecerdasan buatan terapan untuk efisiensi bisnis lokal maupun startup di Bali.",
    institutions: [
      { name: "Politeknik Negeri Bali (PNB)", level: "D4 Vokasi", location: "Bukit Jimbaran, Badung", accreditation: "Baik Sekali" },
      { name: "Universitas Udayana (Unud)", level: "S1 Akademik", location: "Jimbaran, Badung", accreditation: "Unggul" },
      { name: "SMKN 1 Denpasar", level: "SMK PPLG", location: "Denpasar Utara", accreditation: "A (Unggul)" },
    ],
  },
  {
    id: "tkj",
    name: "Teknik Jaringan Komputer, Telekomunikasi & Cloud (TKJ / TJKT)",
    group: "teknologi",
    categoryName: "Teknologi dan Rancang",
    description: "Mempelajari arsitektur jaringan komputer (Cisco CCNA & MikroTik MTCNA), infrastruktur fiber optik, administrasi server Linux/Cloud, dan keamanan siber untuk konektivitas perhotelan serta instansi di Bali.",
    institutions: [
      { name: "SMKN 1 Denpasar (SKENSA)", level: "SMK TJKT", location: "Denpasar Utara", accreditation: "A (Unggul)" },
      { name: "Politeknik Negeri Bali (PNB)", level: "D3 / D4 Teknik Komputer & Jaringan", location: "Bukit Jimbaran, Badung", accreditation: "Baik Sekali" },
      { name: "Universitas Pendidikan Ganesha (Undiksha)", level: "S1 Pendidikan Teknik Informatika", location: "Singaraja, Buleleng", accreditation: "Unggul" },
    ],
  },
  {
    id: "dkv",
    name: "Desain Komunikasi Visual & Multimedia",
    group: "teknologi",
    categoryName: "Teknologi & Rancang Visual",
    vibeTagline: "Pas banget buat kreator visual, desainer UI/UX, dan animator muda.",
    description: "Fokus pada kreasi grafis visual, branding produk lokal, ilustrasi digital, UI/UX desain antarmuka, dan animasi konten kreatif berbasis seni Bali.",
    institutions: [
      { name: "ISI Denpasar", level: "S1 Seni & Desain", location: "Denpasar Timur", accreditation: "Unggul" },
      { name: "Institut Bisnis dan Teknologi Indonesia (INSTIKI)", level: "S1 DKV", location: "Denpasar", accreditation: "Baik Sekali" },
      { name: "SMKN 1 Sukawati", level: "SMK DKV", location: "Gianyar", accreditation: "A (Unggul)" },
    ],
  },
  {
    id: "arsitektur",
    name: "Arsitektur & Desain Ruang Berkelanjutan",
    group: "teknologi",
    categoryName: "Teknologi & Rancang Visual",
    vibeTagline: "Buat kamu yang suka merancang ruang estetik, villa tropis, dan bangunan ramah lingkungan.",
    description: "Menggabungkan prinsip arsitektur tradisional Bali (Asta Kosala Kosali) dengan rekayasa bangunan ramah lingkungan dan teknologi pemodelan 3D modern.",
    institutions: [
      { name: "Universitas Udayana (Unud)", level: "S1 Arsitektur", location: "Jimbaran, Badung", accreditation: "Unggul" },
      { name: "Universitas Warmadewa", level: "S1 Arsitektur", location: "Denpasar", accreditation: "Unggul" },
      { name: "SMKN 3 Denpasar", level: "SMK Desain Pemodelan", location: "Denpasar Selatan", accreditation: "A (Unggul)" },
    ],
  },

  // 2. Merah: Manusia dan budaya
  {
    id: "kesehatan",
    name: "Kesehatan Komunitas & Keperawatan",
    group: "manusia",
    categoryName: "Manusia, Seni & Budaya",
    vibeTagline: "Jalur tepat buat yang berempati tinggi dan tertarik dunia medis serta wisata kesehatan.",
    description: "Mempersiapkan tenaga medis dan perawat terampil untuk mendukung layanan rumah sakit rujukan serta fasilitas wisata medis bertaraf internasional di Bali.",
    institutions: [
      { name: "Poltekkes Kemenkes Denpasar", level: "D3 / D4 Kesehatan", location: "Denpasar Selatan", accreditation: "Unggul" },
      { name: "Universitas Udayana", level: "S1 Keperawatan & Kedokteran", location: "Denpasar Barat", accreditation: "Unggul" },
      { name: "SMK Kesehatan Panca Atma Jaya", level: "SMK Farmasi/Perawat", location: "Klungkung", accreditation: "Baik Sekali" },
    ],
  },
  {
    id: "pendidikan",
    name: "Pendidikan & Bimbingan Konseling",
    group: "manusia",
    categoryName: "Manusia, Seni & Budaya",
    vibeTagline: "Cocok buat pendengar yang baik, suka berbagi ilmu, dan tertarik psikologi remaja.",
    description: "Menghasilkan pendidik generasi masa depan dan konselor sekolah yang menguasai psikologi perkembangan anak, teknologi belajar, dan komunikasi empatik.",
    institutions: [
      { name: "Universitas Pendidikan Ganesha (Undiksha)", level: "S1 Kependidikan", location: "Singaraja, Buleleng", accreditation: "Unggul" },
      { name: "Universitas PGRI Mahadewa Indonesia", level: "S1 Bimbingan Konseling", location: "Denpasar", accreditation: "Baik Sekali" },
    ],
  },
  {
    id: "budaya",
    name: "Seni Karawitan, Tari & Budaya Bali",
    group: "manusia",
    categoryName: "Manusia, Seni & Budaya",
    vibeTagline: "Ruang berekspresi buat seniman muda yang ingin membawa tradisi Bali ke panggung dunia.",
    description: "Pusat pelestarian dan inovasi seni pertunjukan, komposisi gamelan kontemporer, koreografi tari, dan kurasi festival budaya Bali berskala internasional.",
    institutions: [
      { name: "Institut Seni Indonesia (ISI) Denpasar", level: "S1 Seni Pertunjukan", location: "Denpasar Timur", accreditation: "Unggul" },
      { name: "SMKN 3 Sukawati (KOKAR)", level: "SMK Seni Musik & Tari", location: "Batubulan, Gianyar", accreditation: "A (Unggul)" },
    ],
  },

  // 3. Hijau: Alam dan pangan
  {
    id: "pertanian",
    name: "Pertanian Organik & Agroteknologi Subak",
    group: "alam",
    categoryName: "Alam, Agrikultur & Laut",
    vibeTagline: "Buat inovator hijau yang ingin memadukan teknologi pertanian modern dengan Subak Bali.",
    description: "Inovasi budidaya tanaman pangan, kopi, dan hortikultura organik yang memperkuat ekosistem Subak Bali serta menyuplai kebutuhan hotel dan restoran premium.",
    institutions: [
      { name: "Universitas Udayana", level: "S1 Agroteknologi & Agribisnis", location: "Jimbaran / Denpasar", accreditation: "Unggul" },
      { name: "Politeknik Negeri Bali (Kampus Tabanan)", level: "D4 Pengelolaan Tanaman", location: "Tabanan", accreditation: "Baik Sekali" },
      { name: "SMKN 1 Petang", level: "SMK Agribisnis Tanaman", location: "Petang, Badung", accreditation: "A (Unggul)" },
    ],
  },
  {
    id: "lingkungan",
    name: "Ilmu Kelautan & Pengelolaan Lingkungan",
    group: "alam",
    categoryName: "Alam, Agrikultur & Laut",
    vibeTagline: "Pas buat pencinta laut, penyelam, dan penggerak solusi daur ulang lingkungan Bali.",
    description: "Konservasi ekosistem terumbu karang pesisir Bali, manajemen pengolahan limbah sirkular, dan teknologi energi bersih untuk masa depan pulau tropis.",
    institutions: [
      { name: "Universitas Udayana", level: "S1 Ilmu Kelautan & Manajemen Sumberdaya", location: "Jimbaran, Badung", accreditation: "Unggul" },
      { name: "Universitas Warmadewa", level: "S1 Manajemen Lingkungan", location: "Denpasar", accreditation: "Baik Sekali" },
      { name: "SMKN 1 Abang", level: "SMK Perikanan & Kelautan", location: "Karangasem", accreditation: "A (Unggul)" },
    ],
  },

  // 4. Kuning: Usaha dan layanan
  {
    id: "bisnis",
    name: "Bisnis Digital & Manajemen E-Commerce",
    group: "usaha",
    categoryName: "Bisnis Kreatif & Hospitality",
    vibeTagline: "Buat calon founder muda yang suka jualan kreatif, bangun brand, dan kelola bisnis digital.",
    description: "Mempelajari strategi pemasaran kreatif, manajemen finansial startup, e-commerce global, dan pengembangan bisnis lokal Bali agar menembus pasar ekspor.",
    institutions: [
      { name: "Politeknik Negeri Bali (PNB)", level: "D4 Manajemen Bisnis Internasional", location: "Jimbaran, Badung", accreditation: "Unggul" },
      { name: "Universitas Pendidikan Nasional (Undiknas)", level: "S1 Manajemen Bisnis", location: "Denpasar Selatan", accreditation: "Unggul" },
      { name: "SMKN 2 Denpasar", level: "SMK Bisnis Daring & Pemasaran", location: "Denpasar", accreditation: "A (Unggul)" },
    ],
  },
  {
    id: "pariwisata",
    name: "Manajemen Perhotelan & Ekowisata Berkelanjutan",
    group: "usaha",
    categoryName: "Bisnis Kreatif & Hospitality",
    vibeTagline: "Karier global di resort bintang lima, event organizer internasional, dan desa wisata kreatif.",
    description: "Tata kelola resort dan perhotelan berstandar global, manajemen acara internasional, serta kurasi pengalaman wisata berkelanjutan khas Bali.",
    institutions: [
      { name: "Politeknik Pariwisata Bali (Poltekpar)", level: "D3 / D4 Perhotelan", location: "Nusa Dua, Badung", accreditation: "Unggul" },
      { name: "Politeknik Negeri Bali (PNB)", level: "D4 Pengelolaan Perhotelan", location: "Jimbaran, Badung", accreditation: "Unggul" },
      { name: "SMKN 3 Denpasar", level: "SMK Perhotelan & Kuliner", location: "Sanur, Denpasar", accreditation: "A (Unggul)" },
    ],
  },
];
