export type FieldGroup = "teknologi" | "manusia" | "alam" | "usaha";

export interface MajorField {
  id: string;
  name: string;
  group: FieldGroup;
  categoryName: string;
  description: string;
  institutions: {
    name: string;
    level: string;
    location: string;
    accreditation: string;
  }[];
}

export const GROUP_CONFIG: Record<
  FieldGroup,
  {
    label: string;
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
    label: "Teknologi dan Rancang",
    colorHex: "#2D6CDF",
    bgClass: "bg-[#2D6CDF]",
    borderClass: "border-[#2D6CDF]",
    textClass: "text-[#2D6CDF]",
    badgeBg: "bg-[#2D6CDF]/10 dark:bg-[#6C9BFF]/20",
    badgeText: "text-[#2D6CDF] dark:text-[#6C9BFF]",
  },
  manusia: {
    label: "Manusia dan Budaya",
    colorHex: "#D7263D",
    bgClass: "bg-[#D7263D]",
    borderClass: "border-[#D7263D]",
    textClass: "text-[#D7263D]",
    badgeBg: "bg-[#D7263D]/10 dark:bg-[#FF5A6B]/20",
    badgeText: "text-[#D7263D] dark:text-[#FF5A6B]",
  },
  alam: {
    label: "Alam dan Pangan",
    colorHex: "#2E9E6B",
    colorDarkText: "#1F7A52",
    bgClass: "bg-[#2E9E6B]",
    borderClass: "border-[#2E9E6B]",
    textClass: "text-[#1F7A52] dark:text-[#4CC992]",
    badgeBg: "bg-[#2E9E6B]/15 dark:bg-[#4CC992]/20",
    badgeText: "text-[#1F7A52] dark:text-[#4CC992]",
  },
  usaha: {
    label: "Usaha dan Layanan",
    colorHex: "#FFC93C",
    bgClass: "bg-[#FFC93C]",
    borderClass: "border-[#FFC93C]",
    textClass: "text-[#1B1B2F] dark:text-[#FFD25E]",
    badgeBg: "bg-[#FFC93C]/20 dark:bg-[#FFD25E]/20",
    badgeText: "text-[#1B1B2F] dark:text-[#FFD25E]",
  },
};

export const FIELDS: MajorField[] = [
  // 1. Biru: Teknologi dan rancang
  {
    id: "informatika",
    name: "Informatika & Rekayasa Perangkat Lunak",
    group: "teknologi",
    categoryName: "Teknologi dan Rancang",
    description: "Mempelajari pengembangan aplikasi web, mobile, sistem informasi database, dan kecerdasan buatan terapan untuk efisiensi UMKM serta layanan publik di Bali.",
    institutions: [
      { name: "Politeknik Negeri Bali (PNB)", level: "D4 Vokasi", location: "Bukit Jimbaran, Badung", accreditation: "Baik Sekali" },
      { name: "Universitas Udayana (Unud)", level: "S1 Akademik", location: "Jimbaran, Badung", accreditation: "Unggul" },
      { name: "SMKN 1 Denpasar", level: "SMK PPLG", location: "Denpasar Utara", accreditation: "A (Unggul)" },
    ],
  },
  {
    id: "dkv",
    name: "Desain Komunikasi Visual & Multimedia",
    group: "teknologi",
    categoryName: "Teknologi dan Rancang",
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
    categoryName: "Teknologi dan Rancang",
    description: "Menggabungkan prinsip arsitektur tradisional Bali (Asta Kosala Kosali) dengan rekayasa bangunan ramah lingkungan dan teknologi CAD modern.",
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
    categoryName: "Manusia dan Budaya",
    description: "Mempersiapkan tenaga medis dan perawat terampil untuk mendukung layanan puskesmas, rumah sakit rujukan, dan fasilitas wisata medis (medical tourism) di Bali.",
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
    categoryName: "Manusia dan Budaya",
    description: "Menghasilkan pendidik generasi masa depan dan konselor sekolah yang menguasai psikologi perkembangan anak, pedagogi digital, dan nilai budi pekerti lokal.",
    institutions: [
      { name: "Universitas Pendidikan Ganesha (Undiksha)", level: "S1 Kependidikan", location: "Singaraja, Buleleng", accreditation: "Unggul" },
      { name: "Universitas PGRI Mahadewa Indonesia", level: "S1 Bimbingan Konseling", location: "Denpasar", accreditation: "Baik Sekali" },
    ],
  },
  {
    id: "budaya",
    name: "Seni Karawitan, Tari & Budaya Bali",
    group: "manusia",
    categoryName: "Manusia dan Budaya",
    description: "Pusat pelestarian dan pengembangan seni pertunjukan, tabuh gamelan, sastra lontar, dan tata kelola upacara adat Bali yang diakui dunia.",
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
    categoryName: "Alam dan Pangan",
    description: "Inovasi budidaya tanaman pangan dan hortikultura bebas pestisida kimia yang memperkuat kearifan sistem irigasi Subak Bali dan rantai pasok hotel/restoran.",
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
    categoryName: "Alam dan Pangan",
    description: "Konservasi ekosistem terumbu karang pesisir Bali, manajemen pengolahan sampah sirkular, dan mitigasi perubahan iklim di pulau tropis.",
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
    categoryName: "Usaha dan Layanan",
    description: "Mempelajari strategi pemasaran digital, manajemen keuangan toko online, logistik terpadu, dan kewirausahaan mandiri untuk produk kerajinan serta kopi Bali.",
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
    categoryName: "Usaha dan Layanan",
    description: "Tata kelola akomodasi wisata berstandar internasional, kurasi pengalaman desa wisata lokal, dan pelayanan keramahan (hospitality) khas Bali berprinsip Tri Hita Karana.",
    institutions: [
      { name: "Politeknik Pariwisata Bali (Poltekpar)", level: "D3 / D4 Perhotelan", location: "Nusa Dua, Badung", accreditation: "Unggul" },
      { name: "Politeknik Negeri Bali (PNB)", level: "D4 Pengelolaan Perhotelan", location: "Jimbaran, Badung", accreditation: "Unggul" },
      { name: "SMKN 3 Denpasar", level: "SMK Perhotelan & Kuliner", location: "Sanur, Denpasar", accreditation: "A (Unggul)" },
    ],
  },
];
