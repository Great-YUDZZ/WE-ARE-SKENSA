import {
  GeoPoint,
  UserLocationOrigin,
  estimateDistanceFromOrigin,
} from "./catalog";

export type BaliEntityCategory = "perguruan-tinggi" | "smk" | "sma";

export interface BaliEducationEntity {
  id: string;
  category: BaliEntityCategory;
  bentuk: string;
  status: string;
  name: string;
  code: string;
  kabupaten: string;
  address: string;
  programs: string[];
  matchedFields: string[];
}

export interface EnrichedBaliEducationEntity extends BaliEducationEntity {
  estimatedDistanceKm: number;
  mapsUrl: string;
}

export function buildGoogleMapsSearchUrl(name: string, address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${address}, Bali`)}`;
}

export function buildGoogleMapsDirectionsUrl(
  name: string,
  address: string,
  origin?: string | GeoPoint | UserLocationOrigin
): string {
  const dest = `${name}, ${address}, Bali`;
  let originStr = "";
  if (typeof origin === "string") {
    originStr = origin.trim();
  } else if (origin && "kabupaten" in origin) {
    if (origin.addressQuery?.trim()) {
      originStr = `${origin.addressQuery.trim()}, ${origin.kabupaten}, Bali`;
    } else if (origin.coords) {
      originStr = `${origin.coords.lat},${origin.coords.lng}`;
    } else if (origin.areaLabel?.trim()) {
      originStr = `${origin.areaLabel.trim()}, Bali`;
    } else if (origin.kabupaten?.trim()) {
      originStr = `${origin.kabupaten.trim()}, Bali`;
    }
  } else if (origin && "lat" in origin && "lng" in origin) {
    originStr = `${origin.lat},${origin.lng}`;
  }

  if (originStr) {
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originStr)}&destination=${encodeURIComponent(dest)}&travelmode=driving`;
  }
  return buildGoogleMapsSearchUrl(name, address);
}

export const BALI_EDUCATION_DIRECTORY: BaliEducationEntity[] = [
  {
    "id": "pt-001013-universitas-udayana-unud",
    "category": "perguruan-tinggi",
    "bentuk": "Universitas",
    "status": "Negeri (PTN)",
    "name": "Universitas Udayana (UNUD)",
    "code": "001013",
    "kabupaten": "Badung",
    "address": "Jl. Kampus Bukit Jimbaran, Kec. Kuta Selatan / Kampus Sudirman Jl. PB Sudirman, Denpasar",
    "programs": [
      "D3 Akuntansi",
      "D3 Perpajakan",
      "S1 Kedokteran",
      "S1 Kedokteran Hewan",
      "S1 Farmasi",
      "S1 Teknik Elektro",
      "S1 Teknik Mesin",
      "S1 Teknik Sipil",
      "S1 Teknologi Informasi",
      "S1 Arsitektur",
      "S1 Hukum",
      "S1 Manajemen",
      "S1 Akuntansi",
      "S1 Ekonomi Pembangunan",
      "S1 Sastra Inggris",
      "S1 Sastra Bali",
      "S1 Ilmu Sejarah",
      "S1 Antropologi",
      "S1 Agroteknologi",
      "S1 Agribisnis",
      "S1 Teknologi Pangan",
      "S1 Ilmu Kelautan",
      "S1 Hubungan Internasional",
      "S1 Ilmu Komunikasi",
      "S1 Sosiologi",
      "S1 Administrasi Publik"
    ],
    "matchedFields": [
      "bisnis",
      "kesehatan",
      "pertanian",
      "arsitektur",
      "informatika",
      "pendidikan",
      "budaya",
      "lingkungan"
    ]
  },
  {
    "id": "pt-001048-universitas-pendidikan-ganesha-u",
    "category": "perguruan-tinggi",
    "bentuk": "Universitas",
    "status": "Negeri (PTN)",
    "name": "Universitas Pendidikan Ganesha (UNDIKSHA)",
    "code": "001048",
    "kabupaten": "Buleleng",
    "address": "Jl. Udayana No. 11, Singaraja, Buleleng",
    "programs": [
      "D3 Bahasa Inggris",
      "D3 Desain Komunikasi Visual",
      "D3 Manajemen Informatika",
      "D3 Kebidanan",
      "D3 Perhotelan",
      "D3 Akuntansi",
      "D4 Teknologi Rekayasa Perangkat Lunak",
      "D4 Kimia Terapan",
      "S1 Kedokteran",
      "S1 Kebidanan",
      "S1 Keperawatan",
      "S1 Ilmu Hukum",
      "S1 Manajemen",
      "S1 Akuntansi",
      "S1 Pendidikan Bahasa & Sastra Indonesia",
      "S1 Pendidikan Bahasa Inggris",
      "S1 Pendidikan Matematika",
      "S1 Pendidikan Biologi",
      "S1 Pendidikan Fisika",
      "S1 Pendidikan Kimia",
      "S1 Pendidikan Informatika",
      "S1 Pendidikan Sejarah",
      "S1 Pendidikan Geografi",
      "S1 Sistem Informasi",
      "S1 Ilmu Komputer"
    ],
    "matchedFields": [
      "pendidikan",
      "dkv",
      "informatika",
      "bisnis",
      "kesehatan",
      "pariwisata"
    ]
  },
  {
    "id": "pt-241001-universitas-hindu-negeri-i-gusti",
    "category": "perguruan-tinggi",
    "bentuk": "Universitas",
    "status": "Negeri (PTKN)",
    "name": "Universitas Hindu Negeri I Gusti Bagus Sugriwa (UHN Sugriwa)",
    "code": "241001",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Ratna No. 51, Tatasan, Denpasar Timur / Kampus Bangli Jl. Nusantara, Kubu, Bangli",
    "programs": [
      "S1 Pendidikan Agama Hindu",
      "S1 Sastra Agama & Pendidikan Bahasa Bali",
      "S1 Pendidikan Guru PAUD Hindu",
      "S1 Penerangan Agama Hindu",
      "S1 Komunikasi Hindu",
      "S1 Filsafat Agama Hindu",
      "S1 Hukum Adat",
      "S1 Pariwisata Budaya & Keagamaan",
      "S1 Kepanditaan"
    ],
    "matchedFields": [
      "pendidikan",
      "budaya",
      "bisnis",
      "pariwisata"
    ]
  },
  {
    "id": "pt-081007-universitas-warmadewa-unwar",
    "category": "perguruan-tinggi",
    "bentuk": "Universitas",
    "status": "Swasta (PTS)",
    "name": "Universitas Warmadewa (UNWAR)",
    "code": "081007",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Terompong No. 24, Tanjung Bungkak, Denpasar Timur",
    "programs": [
      "D3 Akuntansi Terapan",
      "D4 Teknologi Rekayasa Perangkat Lunak",
      "S1 Kedokteran",
      "S1 Profesi Dokter",
      "S1 Ilmu Hukum",
      "S1 Manajemen",
      "S1 Akuntansi",
      "S1 Ekonomi Pembangunan",
      "S1 Teknik Sipil",
      "S1 Teknik Arsitektur",
      "S1 Agroteknologi",
      "S1 Ilmu Peternakan",
      "S1 Sastra Inggris",
      "S1 Ilmu Administrasi Negara",
      "S1 Ilmu Pemerintahan"
    ],
    "matchedFields": [
      "bisnis",
      "informatika",
      "kesehatan",
      "arsitektur",
      "pertanian",
      "pendidikan"
    ]
  },
  {
    "id": "pt-081004-universitas-pendidikan-nasional-",
    "category": "perguruan-tinggi",
    "bentuk": "Universitas",
    "status": "Swasta (PTS)",
    "name": "Universitas Pendidikan Nasional (UNDIKNAS)",
    "code": "081004",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Bedugul No. 39, Sidakarya, Denpasar Selatan",
    "programs": [
      "S1 Manajemen",
      "S1 Akuntansi",
      "S1 Ilmu Hukum",
      "S1 Ilmu Komunikasi",
      "S1 Ilmu Administrasi Negara",
      "S1 Teknik Sipil",
      "S1 Teknik Elektro",
      "S1 Teknologi Informasi"
    ],
    "matchedFields": [
      "bisnis",
      "arsitektur",
      "informatika"
    ]
  },
  {
    "id": "pt-081003-universitas-mahasaraswati-denpas",
    "category": "perguruan-tinggi",
    "bentuk": "Universitas",
    "status": "Swasta (PTS)",
    "name": "Universitas Mahasaraswati Denpasar (UNMAS)",
    "code": "081003",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Kamboja No. 11A, Dangin Puri Kangin, Denpasar Utara",
    "programs": [
      "D3 Farmasi",
      "S1 Kedokteran Gigi",
      "S1 Pendidikan Dokter Gigi",
      "S1 Farmasi",
      "S1 Manajemen",
      "S1 Akuntansi",
      "S1 Ilmu Hukum",
      "S1 Teknik Sipil",
      "S1 Teknik Lingkungan",
      "S1 Agroteknologi",
      "S1 Agribisnis",
      "S1 Pendidikan Bahasa Inggris",
      "S1 Pendidikan Matematika",
      "S1 Pendidikan Biologi",
      "S1 Pendidikan Sejarah",
      "S1 Pendidikan Bahasa Indonesia"
    ],
    "matchedFields": [
      "kesehatan",
      "pendidikan",
      "bisnis",
      "arsitektur",
      "lingkungan",
      "pertanian"
    ]
  },
  {
    "id": "pt-081037-universitas-dhyana-pura-undhira",
    "category": "perguruan-tinggi",
    "bentuk": "Universitas",
    "status": "Swasta (PTS)",
    "name": "Universitas Dhyana Pura (UNDHIRA)",
    "code": "081037",
    "kabupaten": "Badung",
    "address": "Jl. Raya Padang Luwih, Tegaljaya, Dalung, Kuta Utara, Badung",
    "programs": [
      "D3 Manajemen Perhotelan",
      "D3 Pemasaran Digital",
      "D4 Manajemen Perhotelan",
      "S1 Manajemen",
      "S1 Akuntansi",
      "S1 Psikologi",
      "S1 Ilmu Kesejahteraan Sosial",
      "S1 Sastra Inggris",
      "S1 Teknik Informatika",
      "S1 Sistem Informasi",
      "S1 Fisioterapi",
      "S1 Perekam Medis & Informasi Kesehatan",
      "S1 Manajemen Informasi Kesehatan",
      "S1 Biologi",
      "S1 Pendidikan Guru PAUD"
    ],
    "matchedFields": [
      "bisnis",
      "pariwisata",
      "pendidikan",
      "informatika",
      "kesehatan"
    ]
  },
  {
    "id": "pt-081009-universitas-hindu-indonesia-unhi",
    "category": "perguruan-tinggi",
    "bentuk": "Universitas",
    "status": "Swasta (PTS)",
    "name": "Universitas Hindu Indonesia (UNHI)",
    "code": "081009",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Sangalangit, Tembau, Penatih, Denpasar Timur",
    "programs": [
      "D3 Pengobatan Tradisional Bali",
      "S1 Ilmu Hukum",
      "S1 Manajemen",
      "S1 Akuntansi",
      "S1 Teknik Sipil",
      "S1 Perencanaan Wilayah & Kota",
      "S1 Sistem Informasi",
      "S1 Biologi",
      "S1 Pendidikan Agama Hindu",
      "S1 Filsafat Agama Hindu",
      "S1 Ilmu Komunikasi Hindu",
      "S1 Seni Tari Keagamaan"
    ],
    "matchedFields": [
      "kesehatan",
      "bisnis",
      "arsitektur",
      "informatika",
      "pendidikan",
      "budaya"
    ]
  },
  {
    "id": "pt-081002-universitas-ngurah-rai-unr",
    "category": "perguruan-tinggi",
    "bentuk": "Universitas",
    "status": "Swasta (PTS)",
    "name": "Universitas Ngurah Rai (UNR)",
    "code": "081002",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Padma No. 27, Penatih, Denpasar Timur",
    "programs": [
      "S1 Ilmu Hukum",
      "S1 Manajemen",
      "S1 Ilmu Administrasi Publik",
      "S1 Teknik Sipil",
      "S1 Arsitektur"
    ],
    "matchedFields": [
      "bisnis",
      "arsitektur"
    ]
  },
  {
    "id": "pt-081001-universitas-mahendradatta",
    "category": "perguruan-tinggi",
    "bentuk": "Universitas",
    "status": "Swasta (PTS)",
    "name": "Universitas Mahendradatta",
    "code": "081001",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Ken Arok No. 10-12, Peguyangan, Denpasar Utara",
    "programs": [
      "S1 Ilmu Hukum",
      "S1 Manajemen",
      "S1 Akuntansi",
      "S1 Teknik Industri",
      "S1 Ilmu Sejarah",
      "S1 Hubungan Internasional"
    ],
    "matchedFields": [
      "bisnis",
      "arsitektur",
      "pendidikan"
    ]
  },
  {
    "id": "pt-081005-universitas-dwijendra-undwi",
    "category": "perguruan-tinggi",
    "bentuk": "Universitas",
    "status": "Swasta (PTS)",
    "name": "Universitas Dwijendra (UNDWI)",
    "code": "081005",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Kamboja No. 17, Dangin Puri Kangin, Denpasar Utara",
    "programs": [
      "S1 Ilmu Hukum",
      "S1 Arsitektur",
      "S1 Agroteknologi",
      "S1 Agribisnis",
      "S1 Ilmu Komunikasi",
      "S1 Pendidikan Guru Sekolah Dasar (PGSD)",
      "S1 Pendidikan Bahasa & Sastra Indonesia",
      "S1 Pendidikan Bahasa Inggris"
    ],
    "matchedFields": [
      "bisnis",
      "arsitektur",
      "pertanian",
      "pendidikan"
    ]
  },
  {
    "id": "pt-081006-universitas-tabanan-untab",
    "category": "perguruan-tinggi",
    "bentuk": "Universitas",
    "status": "Swasta (PTS)",
    "name": "Universitas Tabanan (UNTAB)",
    "code": "081006",
    "kabupaten": "Tabanan",
    "address": "Jl. Wagimin No. 8, Kediri, Tabanan",
    "programs": [
      "S1 Ilmu Hukum",
      "S1 Manajemen",
      "S1 Ekonomi Pembangunan",
      "S1 Agroteknologi",
      "S1 Agribisnis"
    ],
    "matchedFields": [
      "bisnis",
      "arsitektur",
      "pertanian"
    ]
  },
  {
    "id": "pt-081008-universitas-panji-sakti-unipas",
    "category": "perguruan-tinggi",
    "bentuk": "Universitas",
    "status": "Swasta (PTS)",
    "name": "Universitas Panji Sakti (UNIPAS)",
    "code": "081008",
    "kabupaten": "Buleleng",
    "address": "Jl. Bisma No. 22, Banjar Tegal, Singaraja, Buleleng",
    "programs": [
      "S1 Ilmu Hukum",
      "S1 Manajemen",
      "S1 Agroteknologi",
      "S1 Ilmu Administrasi Publik",
      "S1 Bimbingan & Konseling"
    ],
    "matchedFields": [
      "bisnis",
      "pertanian",
      "pendidikan"
    ]
  },
  {
    "id": "pt-081038-universitas-triatma-mulya-untrim",
    "category": "perguruan-tinggi",
    "bentuk": "Universitas",
    "status": "Swasta (PTS)",
    "name": "Universitas Triatma Mulya (UNTRIM)",
    "code": "081038",
    "kabupaten": "Badung",
    "address": "Jl. Kubu Gunung, Tegaljaya, Dalung, Kuta Utara, Badung",
    "programs": [
      "D3 Perhotelan",
      "D4 Manajemen Perhotelan",
      "D4 Pengelolaan Konvensi & Acara",
      "S1 Manajemen",
      "S1 Akuntansi",
      "S1 Ilmu Hukum",
      "S1 Keperawatan",
      "S1 Kebidanan",
      "S1 Farmasi",
      "S1 Teknik Informatika",
      "S1 Sistem Informasi",
      "S1 Pendidikan Bahasa Inggris"
    ],
    "matchedFields": [
      "pariwisata",
      "bisnis",
      "kesehatan",
      "informatika",
      "pendidikan"
    ]
  },
  {
    "id": "pt-081036-universitas-bali-internasional-u",
    "category": "perguruan-tinggi",
    "bentuk": "Universitas",
    "status": "Swasta (PTS)",
    "name": "Universitas Bali Internasional (UNBI)",
    "code": "081036",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Sidan No. 19, Peguyangan, Denpasar Utara",
    "programs": [
      "D4 Analis Kesehatan (Teknologi Laboratorium Medis)",
      "D4 Manajemen Informasi Kesehatan",
      "S1 Farmasi Klinis",
      "S1 Farmasi Komunitas",
      "S1 Fisioterapi",
      "S1 Administrasi Rumah Sakit",
      "S1 Teknologi Laboratorium Medis",
      "S1 Psikologi",
      "S1 Teknik Biomedis",
      "S1 Bisnis Digital"
    ],
    "matchedFields": [
      "kesehatan",
      "bisnis"
    ]
  },
  {
    "id": "pt-081035-universitas-bali-dwipa-ubd",
    "category": "perguruan-tinggi",
    "bentuk": "Universitas",
    "status": "Swasta (PTS)",
    "name": "Universitas Bali Dwipa (UBD)",
    "code": "081035",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Pulau Flores No. 5, Dauh Puri Kauh, Denpasar Barat",
    "programs": [
      "S1 Farmasi",
      "S1 Psikologi",
      "S1 Gizi",
      "S1 Hubungan Internasional",
      "S1 Hukum",
      "S1 Manajemen Retail",
      "S1 Akuntansi",
      "S1 Teknologi Pangan",
      "S1 Sistem Informasi",
      "S1 Teknik Biomedis"
    ],
    "matchedFields": [
      "kesehatan",
      "bisnis",
      "pertanian",
      "informatika"
    ]
  },
  {
    "id": "pt-081040-universitas-primakara-primakara-",
    "category": "perguruan-tinggi",
    "bentuk": "Universitas",
    "status": "Swasta (PTS)",
    "name": "Universitas Primakara (Primakara University)",
    "code": "081040",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Tukad Badung No. 135, Renon, Denpasar Selatan",
    "programs": [
      "S1 Informatika",
      "S1 Sistem Informasi",
      "S1 Sistem Informasi Akuntansi",
      "S1 Bisnis Digital",
      "S1 Manajemen Talenta",
      "S1 Desain Komunikasi Visual"
    ],
    "matchedFields": [
      "informatika",
      "bisnis",
      "dkv"
    ]
  },
  {
    "id": "pt-081039-universitas-mahadewa-indonesia-u",
    "category": "perguruan-tinggi",
    "bentuk": "Universitas",
    "status": "Swasta (PTS)",
    "name": "Universitas Mahadewa Indonesia (UNMAHADEWA)",
    "code": "081039",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Seroja No. 57, Tonja, Denpasar Utara",
    "programs": [
      "S1 Pendidikan Bahasa & Sastra Indonesia",
      "S1 Pendidikan Bahasa Inggris",
      "S1 Pendidikan Seni Rupa",
      "S1 Pendidikan Sendratasik",
      "S1 Pendidikan Biologi",
      "S1 Pendidikan Matematika",
      "S1 Pendidikan Sejarah",
      "S1 Pendidikan Ekonomi",
      "S1 Pendidikan Jasmani Kesehatan & Rekreasi",
      "S1 Bimbingan Konseling",
      "S1 Manajemen",
      "S1 Sistem Informasi"
    ],
    "matchedFields": [
      "pendidikan",
      "dkv",
      "budaya",
      "bisnis",
      "kesehatan",
      "informatika"
    ]
  },
  {
    "id": "pt-081041-universitas-markandeya-bali",
    "category": "perguruan-tinggi",
    "bentuk": "Universitas",
    "status": "Swasta (PTS)",
    "name": "Universitas Markandeya Bali",
    "code": "081041",
    "kabupaten": "Bangli",
    "address": "Jl. Nusantara No. 54, Kubu, Bangli",
    "programs": [
      "S1 Ilmu Hukum",
      "S1 Manajemen",
      "S1 Agroteknologi",
      "S1 Sistem Informasi",
      "S1 Pendidikan Guru Sekolah Dasar"
    ],
    "matchedFields": [
      "bisnis",
      "pertanian",
      "informatika",
      "pendidikan"
    ]
  },
  {
    "id": "pt-081042-universitas-teknologi-indonesia-",
    "category": "perguruan-tinggi",
    "bentuk": "Universitas",
    "status": "Swasta (PTS)",
    "name": "Universitas Teknologi Indonesia (UTI)",
    "code": "081042",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Tukad Yeh Aya No. 108, Panjer, Denpasar Selatan",
    "programs": [
      "S1 Informatika",
      "S1 Sistem Informasi",
      "S1 Rekayasa Sistem Komputer",
      "S1 Bisnis Digital"
    ],
    "matchedFields": [
      "informatika",
      "tkj",
      "bisnis"
    ]
  },
  {
    "id": "pt-002007-institut-seni-indonesia-denpasar",
    "category": "perguruan-tinggi",
    "bentuk": "Institut",
    "status": "Negeri (PTN)",
    "name": "Institut Seni Indonesia Denpasar (ISI Denpasar)",
    "code": "002007",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Nusa Indah, Sumerta Kauh, Denpasar Timur",
    "programs": [
      "D4 Desain Mode",
      "D4 Animasi",
      "S1 Seni Tari",
      "S1 Seni Karawitan",
      "S1 Seni Pedalangan",
      "S1 Seni Musik",
      "S1 Seni Murni",
      "S1 Desain Komunikasi Visual",
      "S1 Desain Interior",
      "S1 Televisi & Film",
      "S1 Fotografi",
      "S1 Kriya"
    ],
    "matchedFields": [
      "dkv",
      "budaya"
    ]
  },
  {
    "id": "pt-243008-iahn-mpu-kuturan-singaraja",
    "category": "perguruan-tinggi",
    "bentuk": "Institut",
    "status": "Negeri (PTKN)",
    "name": "IAHN Mpu Kuturan Singaraja",
    "code": "243008",
    "kabupaten": "Buleleng",
    "address": "Jl. Kresna No. 2B, Banjar Asri, Singaraja, Buleleng",
    "programs": [
      "S1 Pendidikan Agama Hindu",
      "S1 Pendidikan Guru SD Hindu",
      "S1 Pendidikan Guru PAUD Hindu",
      "S1 Penerangan Agama Hindu",
      "S1 Filsafat Agama Hindu",
      "S1 Teologi Hindu",
      "S1 Ilmu Komunikasi",
      "S1 Hukum Hindu"
    ],
    "matchedFields": [
      "pendidikan",
      "budaya",
      "bisnis"
    ]
  },
  {
    "id": "pt-082008-itb-stikom-bali",
    "category": "perguruan-tinggi",
    "bentuk": "Institut",
    "status": "Swasta (PTS)",
    "name": "ITB STIKOM Bali",
    "code": "082008",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Raya Puputan Renon No. 86, Dangin Puri Klod, Denpasar Timur",
    "programs": [
      "D3 Manajemen Informatika",
      "S1 Sistem Komputer",
      "S1 Sistem Informasi",
      "S1 Teknologi Informasi",
      "S1 Bisnis Digital"
    ],
    "matchedFields": [
      "informatika",
      "bisnis",
      "tkj"
    ]
  },
  {
    "id": "pt-082010-institut-bisnis-dan-teknologi-in",
    "category": "perguruan-tinggi",
    "bentuk": "Institut",
    "status": "Swasta (PTS)",
    "name": "Institut Bisnis dan Teknologi Indonesia (INSTIKI)",
    "code": "082010",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Tukad Pakerisan No. 97, Panjer, Denpasar Selatan",
    "programs": [
      "S1 Teknik Informatika (Computer Science)",
      "S1 Sistem Komputer (IoT)",
      "S1 Rekayasa Perangkat Lunak",
      "S1 Desain Komunikasi Visual (DKV)",
      "S1 Bisnis Digital"
    ],
    "matchedFields": [
      "informatika",
      "tkj",
      "dkv",
      "bisnis"
    ]
  },
  {
    "id": "pt-082011-institut-desain-dan-bisnis-bali-",
    "category": "perguruan-tinggi",
    "bentuk": "Institut",
    "status": "Swasta (PTS)",
    "name": "Institut Desain dan Bisnis Bali (IDB Bali)",
    "code": "082011",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Tukad Batanghari No. 29, Panjer, Denpasar Selatan",
    "programs": [
      "S1 Desain Komunikasi Visual",
      "S1 Desain Interior",
      "S1 Desain Mode Busana",
      "S1 Bisnis Digital"
    ],
    "matchedFields": [
      "dkv",
      "bisnis"
    ]
  },
  {
    "id": "pt-082012-institut-pariwisata-dan-bisnis-i",
    "category": "perguruan-tinggi",
    "bentuk": "Institut",
    "status": "Swasta (PTS)",
    "name": "Institut Pariwisata dan Bisnis Internasional (IPB Internasional)",
    "code": "082012",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Kecak No. 12, Gatot Subroto Timur, Tonja, Denpasar Utara",
    "programs": [
      "D3 Perhotelan",
      "D4 Manajemen Perhotelan",
      "D4 Pengelolaan Konvensi & Acara",
      "S1 Bisnis Digital",
      "S1 Manajemen Usaha Perjalanan Wisata",
      "S1 Pariwisata"
    ],
    "matchedFields": [
      "pariwisata",
      "bisnis"
    ]
  },
  {
    "id": "pt-082009-institut-teknologi-dan-kesehatan",
    "category": "perguruan-tinggi",
    "bentuk": "Institut",
    "status": "Swasta (PTS)",
    "name": "Institut Teknologi dan Kesehatan Bali (ITEKES Bali)",
    "code": "082009",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Tukad Balian No. 180, Renon, Denpasar Selatan",
    "programs": [
      "D3 Keperawatan",
      "D3 Kebidanan",
      "D4 Anastesiologi",
      "D4 Teknologi Laboratorium Medis",
      "S1 Keperawatan & Profesi Ners",
      "S1 Farmasi Klinis",
      "S1 Kebidanan Terapan",
      "S1 Bisnis Digital"
    ],
    "matchedFields": [
      "kesehatan",
      "bisnis"
    ]
  },
  {
    "id": "pt-082013-institut-teknologi-dan-kesehatan",
    "category": "perguruan-tinggi",
    "bentuk": "Institut",
    "status": "Swasta (PTS)",
    "name": "Institut Teknologi dan Kesehatan Bintang Persada",
    "code": "082013",
    "kabupaten": "Badung",
    "address": "Jl. P.B. Sudirman No. 10, Jimbaran, Kuta Selatan, Badung",
    "programs": [
      "S1 Farmasi",
      "S1 Administrasi Kesehatan",
      "S1 Informatika Terapan",
      "S1 Rekayasa Perangkat Lunak"
    ],
    "matchedFields": [
      "kesehatan",
      "bisnis",
      "informatika"
    ]
  },
  {
    "id": "pt-082002-ikip-saraswati-tabanan",
    "category": "perguruan-tinggi",
    "bentuk": "Institut",
    "status": "Swasta (PTS)",
    "name": "IKIP Saraswati Tabanan",
    "code": "082002",
    "kabupaten": "Tabanan",
    "address": "Jl. Pahlawan No. 2, Delod Peken, Tabanan",
    "programs": [
      "S1 Pendidikan Bahasa & Sastra Indonesia",
      "S1 Pendidikan Bahasa Inggris",
      "S1 Pendidikan Biologi",
      "S1 Pendidikan Matematika",
      "S1 Pendidikan Sejarah",
      "S1 Bimbingan & Konseling"
    ],
    "matchedFields": [
      "pendidikan"
    ]
  },
  {
    "id": "pt-082014-institut-sains-dan-teknologi-nah",
    "category": "perguruan-tinggi",
    "bentuk": "Institut",
    "status": "Swasta (PTS)",
    "name": "Institut Sains dan Teknologi Nahdlatul Ulama Bali (ISTNU Bali)",
    "code": "082014",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Pura Demak Gg. IV No. 1, Pemecutan Klod, Denpasar Barat",
    "programs": [
      "S1 Teknik Industri",
      "S1 Teknik Lingkungan",
      "S1 Sistem Informasi",
      "S1 Teknologi Hasil Pertanian"
    ],
    "matchedFields": [
      "arsitektur",
      "lingkungan",
      "informatika",
      "pertanian"
    ]
  },
  {
    "id": "pt-005010-politeknik-negeri-bali-pnb",
    "category": "perguruan-tinggi",
    "bentuk": "Politeknik",
    "status": "Negeri (PTN)",
    "name": "Politeknik Negeri Bali (PNB)",
    "code": "005010",
    "kabupaten": "Badung",
    "address": "Kampus Bukit Jimbaran, Kuta Selatan, Badung",
    "programs": [
      "D3 Teknik Sipil",
      "D3 Teknik Mesin",
      "D3 Teknik Listrik",
      "D3 Akuntansi",
      "D3 Administrasi Bisnis",
      "D3 Usaha Perjalanan Wisata",
      "D3 Perhotelan",
      "D4/Sarjana Terapan Manajemen Rekayasa Konstruksi",
      "D4/Sarjana Terapan Teknik Otomasi",
      "D4/Sarjana Terapan Manajemen Akomodasi Perhotelan",
      "D4/Sarjana Terapan Akuntansi Manajerial",
      "D4/Sarjana Terapan Manajemen Usaha Perjalanan Wisata",
      "D4/Sarjana Terapan Manajemen Bisnis Internasional"
    ],
    "matchedFields": [
      "arsitektur",
      "tkj",
      "bisnis",
      "pariwisata"
    ]
  },
  {
    "id": "pt-385005-politeknik-pariwisata-bali-polte",
    "category": "perguruan-tinggi",
    "bentuk": "Politeknik",
    "status": "Negeri (Kemenparekraf)",
    "name": "Politeknik Pariwisata Bali (POLTEKPAR Bali)",
    "code": "385005",
    "kabupaten": "Badung",
    "address": "Jl. Dharmawangsa, Kampus Nusa Dua, Benoa, Kuta Selatan, Badung",
    "programs": [
      "D3 Tata Hidang (Food & Beverage Service)",
      "D3 Seni Kuliner (Culinary Arts)",
      "D3 Seni Pengolahan Patiseri (Pastry & Bakery)",
      "D3 Divisi Kamar",
      "D4/Sarjana Terapan Manajemen Kepariwisataan",
      "D4/Sarjana Terapan Pengelolaan Konvensi & Acara (MICE)",
      "D4/Sarjana Terapan Destinasi Pariwisata",
      "D4/Sarjana Terapan Manajemen Tata Hidang",
      "D4/Sarjana Terapan Manajemen Divisi Kamar"
    ],
    "matchedFields": [
      "pariwisata",
      "bisnis"
    ]
  },
  {
    "id": "pt-425014-politeknik-transportasi-darat-ba",
    "category": "perguruan-tinggi",
    "bentuk": "Politeknik",
    "status": "Negeri (Kemenhub)",
    "name": "Politeknik Transportasi Darat Bali (POLTRADA Bali)",
    "code": "425014",
    "kabupaten": "Gianyar",
    "address": "Jl. Batuyang No. 109X, Batubulan, Sukawati, Gianyar",
    "programs": [
      "D3 Manajemen Logistik Transportasi Darat",
      "D3 Teknologi Otomotif Lanjutan",
      "D3 Manajemen Transportasi Jalan"
    ],
    "matchedFields": [
      "arsitektur",
      "bisnis"
    ]
  },
  {
    "id": "pt-395009-politeknik-kelautan-dan-perikana",
    "category": "perguruan-tinggi",
    "bentuk": "Politeknik",
    "status": "Negeri (KKP)",
    "name": "Politeknik Kelautan dan Perikanan Jembrana (PKPJ)",
    "code": "395009",
    "kabupaten": "Jembrana",
    "address": "Jl. Pengambengan, Dusun Kelapa Balian, Pengambengan, Negara, Jembrana",
    "programs": [
      "D3 Budidaya Ikan",
      "D3 Penangkapan Ikan",
      "D3 Pengolahan Hasil Laut",
      "D3 Perbenihan Ikan"
    ],
    "matchedFields": [
      "pertanian",
      "lingkungan"
    ]
  },
  {
    "id": "pt-405018-politeknik-kesehatan-kemenkes-de",
    "category": "perguruan-tinggi",
    "bentuk": "Politeknik",
    "status": "Negeri (Kemenkes)",
    "name": "Politeknik Kesehatan Kemenkes Denpasar (Poltekkes Denpasar)",
    "code": "405018",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Sanitasi No. 1, Sidakarya, Denpasar Selatan",
    "programs": [
      "D3 Keperawatan",
      "D3 Kebidanan",
      "D3 Kesehatan Gigi",
      "D3 Gizi",
      "D3 Sanitasi (Kesehatan Lingkungan)",
      "D3 Teknologi Laboratorium Medis",
      "D4/Sarjana Terapan Keperawatan Terapan & Profesi Ners",
      "D4/Sarjana Terapan Kebidanan Terapan",
      "D4/Sarjana Terapan Gizi & Dietetika Terapan",
      "D4/Sarjana Terapan Sanitasi Lingkungan Terapan"
    ],
    "matchedFields": [
      "kesehatan",
      "lingkungan"
    ]
  },
  {
    "id": "pt-085006-politeknik-internasional-bali-pi",
    "category": "perguruan-tinggi",
    "bentuk": "Politeknik",
    "status": "Swasta (PTS)",
    "name": "Politeknik Internasional Bali (PIB)",
    "code": "085006",
    "kabupaten": "Tabanan",
    "address": "Jl. Pantai Nyanyi, Beraban, Kediri, Tabanan",
    "programs": [
      "D3 Seni Kuliner",
      "D4/Sarjana Terapan Manajemen Perhotelan",
      "D4/Sarjana Terapan Pengelolaan Konvensi & Acara (Event Management)",
      "D4/Sarjana Terapan Digital Tourism & Hospitality"
    ],
    "matchedFields": [
      "pariwisata",
      "bisnis"
    ]
  },
  {
    "id": "pt-085002-politeknik-nasional-denpasar-pol",
    "category": "perguruan-tinggi",
    "bentuk": "Politeknik",
    "status": "Swasta (PTS)",
    "name": "Politeknik Nasional Denpasar (Polnas Denpasar)",
    "code": "085002",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Pandu No. 9, Tanjung Bungkak, Denpasar Timur",
    "programs": [
      "D3 Teknik Komputer",
      "D3 Teknik Elektronika",
      "D3 Akuntansi Perpajakan",
      "D3 Usaha Perjalanan Wisata"
    ],
    "matchedFields": [
      "tkj",
      "bisnis",
      "pariwisata"
    ]
  },
  {
    "id": "pt-085005-politeknik-kesehatan-kartini-bal",
    "category": "perguruan-tinggi",
    "bentuk": "Politeknik",
    "status": "Swasta (PTS)",
    "name": "Politeknik Kesehatan Kartini Bali",
    "code": "085005",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Piranha No. 2, Pegok, Sesetan, Denpasar Selatan",
    "programs": [
      "D3 Kebidanan",
      "D3 Rekam Medis & Informasi Kesehatan",
      "D4/Sarjana Terapan Teknologi Laboratorium Medis"
    ],
    "matchedFields": [
      "kesehatan"
    ]
  },
  {
    "id": "pt-085004-politeknik-ganesha-guru",
    "category": "perguruan-tinggi",
    "bentuk": "Politeknik",
    "status": "Swasta (PTS)",
    "name": "Politeknik Ganesha Guru",
    "code": "085004",
    "kabupaten": "Buleleng",
    "address": "Jl. Ahmad Yani No. 117, Singaraja, Buleleng",
    "programs": [
      "D3 Manajemen Informatika",
      "D3 Akuntansi Komputer",
      "D3 Teknik Komputer"
    ],
    "matchedFields": [
      "informatika",
      "bisnis",
      "tkj"
    ]
  },
  {
    "id": "pt-085007-politeknik-omna-trisakti-chandra",
    "category": "perguruan-tinggi",
    "bentuk": "Politeknik",
    "status": "Swasta (PTS)",
    "name": "Politeknik Omna Trisakti Chandra",
    "code": "085007",
    "kabupaten": "Gianyar",
    "address": "Jl. Raya Mas No. 88, Mas, Ubud, Gianyar",
    "programs": [
      "D3 Perhotelan",
      "D3 Usaha Perjalanan Wisata",
      "D4 Manajemen Perhotelan Internasional"
    ],
    "matchedFields": [
      "pariwisata",
      "bisnis"
    ]
  },
  {
    "id": "pt-083110-stikes-kesdam-ix-udayana",
    "category": "perguruan-tinggi",
    "bentuk": "Sekolah Tinggi",
    "status": "Swasta (PTS)",
    "name": "STIKES Kesdam IX/Udayana",
    "code": "083110",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Raya PB Sudirman, Dangin Puri Klod, Denpasar Barat",
    "programs": [
      "D3 Keperawatan",
      "D3 Kebidanan",
      "S1 Administrasi Rumah Sakit",
      "S1 Farmasi"
    ],
    "matchedFields": [
      "kesehatan",
      "bisnis"
    ]
  },
  {
    "id": "pt-083074-stikes-bina-usada-bali",
    "category": "perguruan-tinggi",
    "bentuk": "Sekolah Tinggi",
    "status": "Swasta (PTS)",
    "name": "STIKES Bina Usada Bali",
    "code": "083074",
    "kabupaten": "Badung",
    "address": "Jl. Padang Luwih, Tegaljaya, Dalung, Kuta Utara, Badung",
    "programs": [
      "D3 Kebidanan",
      "S1 Keperawatan & Profesi Ners",
      "S1 Farmasi Klinis"
    ],
    "matchedFields": [
      "kesehatan"
    ]
  },
  {
    "id": "pt-083072-stikes-buleleng",
    "category": "perguruan-tinggi",
    "bentuk": "Sekolah Tinggi",
    "status": "Swasta (PTS)",
    "name": "STIKES Buleleng",
    "code": "083072",
    "kabupaten": "Buleleng",
    "address": "Jl. Raya Air Sanih KM 11, Bungkulan, Sawan, Buleleng",
    "programs": [
      "D3 Kebidanan",
      "S1 Keperawatan & Profesi Ners",
      "S1 Farmasi"
    ],
    "matchedFields": [
      "kesehatan"
    ]
  },
  {
    "id": "pt-083088-stikes-advaita-medika-tabanan",
    "category": "perguruan-tinggi",
    "bentuk": "Sekolah Tinggi",
    "status": "Swasta (PTS)",
    "name": "STIKES Advaita Medika Tabanan",
    "code": "083088",
    "kabupaten": "Tabanan",
    "address": "Jl. Wagimin No. 10, Kediri, Tabanan",
    "programs": [
      "D3 Kebidanan",
      "S1 Keperawatan & Profesi Ners",
      "S1 Administrasi Rumah Sakit"
    ],
    "matchedFields": [
      "kesehatan",
      "bisnis"
    ]
  },
  {
    "id": "pt-083099-sekolah-tinggi-farmasi-mahaganes",
    "category": "perguruan-tinggi",
    "bentuk": "Sekolah Tinggi",
    "status": "Swasta (PTS)",
    "name": "Sekolah Tinggi Farmasi Mahaganesha (STF Mahaganesha)",
    "code": "083099",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Tukad Barito No. 57, Panjer, Denpasar Selatan",
    "programs": [
      "D3 Farmasi",
      "S1 Farmasi & Profesi Apoteker"
    ],
    "matchedFields": [
      "kesehatan"
    ]
  },
  {
    "id": "pt-083008-stia-denpasar",
    "category": "perguruan-tinggi",
    "bentuk": "Sekolah Tinggi",
    "status": "Swasta (PTS)",
    "name": "STIA Denpasar",
    "code": "083008",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Surapati No. 1, Dangin Puri, Denpasar Timur",
    "programs": [
      "S1 Ilmu Administrasi Publik",
      "S1 Ilmu Administrasi Bisnis"
    ],
    "matchedFields": [
      "bisnis"
    ]
  },
  {
    "id": "pt-083015-stba-saraswati-denpasar",
    "category": "perguruan-tinggi",
    "bentuk": "Sekolah Tinggi",
    "status": "Swasta (PTS)",
    "name": "STBA Saraswati Denpasar",
    "code": "083015",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Kamboja No. 11A, Dangin Puri Kangin, Denpasar Utara",
    "programs": [
      "S1 Sastra Inggris",
      "S1 Sastra Jepang"
    ],
    "matchedFields": [
      "pendidikan"
    ]
  },
  {
    "id": "pt-083025-stba-hita-widya-singaraja",
    "category": "perguruan-tinggi",
    "bentuk": "Sekolah Tinggi",
    "status": "Swasta (PTS)",
    "name": "STBA Hita Widya Singaraja",
    "code": "083025",
    "kabupaten": "Buleleng",
    "address": "Jl. Ahmad Yani No. 99, Singaraja, Buleleng",
    "programs": [
      "S1 Sastra Inggris"
    ],
    "matchedFields": [
      "pendidikan"
    ]
  },
  {
    "id": "pt-083030-stie-satya-dharma-singaraja",
    "category": "perguruan-tinggi",
    "bentuk": "Sekolah Tinggi",
    "status": "Swasta (PTS)",
    "name": "STIE Satya Dharma Singaraja",
    "code": "083030",
    "kabupaten": "Buleleng",
    "address": "Jl. Ahmad Yani No. 71, Singaraja, Buleleng",
    "programs": [
      "S1 Manajemen",
      "S1 Akuntansi"
    ],
    "matchedFields": [
      "bisnis"
    ]
  },
  {
    "id": "pt-083020-stispol-wira-bhakti-denpasar",
    "category": "perguruan-tinggi",
    "bentuk": "Sekolah Tinggi",
    "status": "Swasta (PTS)",
    "name": "STISPOL Wira Bhakti Denpasar",
    "code": "083020",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Cempaka No. 8, Dangin Puri Kangin, Denpasar Utara",
    "programs": [
      "S1 Ilmu Administrasi Negara",
      "S1 Ilmu Komunikasi"
    ],
    "matchedFields": [
      "bisnis"
    ]
  },
  {
    "id": "pt-083021-stispol-margarana-tabanan",
    "category": "perguruan-tinggi",
    "bentuk": "Sekolah Tinggi",
    "status": "Swasta (PTS)",
    "name": "STISPOL Margarana Tabanan",
    "code": "083021",
    "kabupaten": "Tabanan",
    "address": "Jl. Majapahit No. 9, Tabanan",
    "programs": [
      "S1 Ilmu Administrasi Negara",
      "S1 Ilmu Sosiatri"
    ],
    "matchedFields": [
      "bisnis",
      "pendidikan"
    ]
  },
  {
    "id": "pt-213009-stai-denpasar",
    "category": "perguruan-tinggi",
    "bentuk": "Sekolah Tinggi",
    "status": "Swasta (PTS)",
    "name": "STAI Denpasar",
    "code": "213009",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Ahmad Yani No. 43, Peguyangan, Denpasar Utara",
    "programs": [
      "S1 Pendidikan Agama Islam",
      "S1 Ekonomi Syariah",
      "S1 Manajemen Pendidikan Islam"
    ],
    "matchedFields": [
      "pendidikan",
      "bisnis"
    ]
  },
  {
    "id": "pt-213010-stit-jembrana",
    "category": "perguruan-tinggi",
    "bentuk": "Sekolah Tinggi",
    "status": "Swasta (PTS)",
    "name": "STIT Jembrana",
    "code": "213010",
    "kabupaten": "Jembrana",
    "address": "Jl. Semangka No. 1, Loloan Barat, Negara, Jembrana",
    "programs": [
      "S1 Pendidikan Agama Islam (PAI)",
      "S1 Manajemen Pendidikan Islam"
    ],
    "matchedFields": [
      "pendidikan",
      "bisnis"
    ]
  },
  {
    "id": "pt-243007-stkip-agama-hindu-amlapura",
    "category": "perguruan-tinggi",
    "bentuk": "Sekolah Tinggi",
    "status": "Swasta (PTS)",
    "name": "STKIP Agama Hindu Amlapura",
    "code": "243007",
    "kabupaten": "Karangasem",
    "address": "Jl. Ahmad Yani, Subagan, Karangasem",
    "programs": [
      "S1 Pendidikan Agama Hindu",
      "S1 Pendidikan Bahasa Daerah (Bali)"
    ],
    "matchedFields": [
      "pendidikan",
      "budaya"
    ]
  },
  {
    "id": "pt-083115-stikes-bali-medika",
    "category": "perguruan-tinggi",
    "bentuk": "Sekolah Tinggi",
    "status": "Swasta (PTS)",
    "name": "STIKES Bali Medika",
    "code": "083115",
    "kabupaten": "Bangli",
    "address": "Jl. Nusantara No. 88, Kubu, Bangli",
    "programs": [
      "D3 Kebidanan",
      "S1 Administrasi Rumah Sakit"
    ],
    "matchedFields": [
      "kesehatan",
      "bisnis"
    ]
  },
  {
    "id": "pt-233005-stt-johanes-calvin-bali",
    "category": "perguruan-tinggi",
    "bentuk": "Sekolah Tinggi",
    "status": "Swasta (PTS)",
    "name": "STT Johanes Calvin Bali",
    "code": "233005",
    "kabupaten": "Badung",
    "address": "Jl. Sunset Road, Seminyak, Kuta, Badung",
    "programs": [
      "S1 Teologi",
      "S1 Pendidikan Keagamaan Kristen"
    ],
    "matchedFields": [
      "pendidikan"
    ]
  },
  {
    "id": "pt-084005-amik-new-media-denpasar",
    "category": "perguruan-tinggi",
    "bentuk": "Akademi",
    "status": "Swasta (PTS)",
    "name": "AMIK New Media Denpasar",
    "code": "084005",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Tukad Batanghari No. 29, Panjer, Denpasar Selatan",
    "programs": [
      "D3 Manajemen Informatika",
      "D3 Komputerisasi Akuntansi"
    ],
    "matchedFields": [
      "informatika",
      "bisnis"
    ]
  },
  {
    "id": "pt-086001-akademi-komunitas-manajemen-perh",
    "category": "perguruan-tinggi",
    "bentuk": "Akademi",
    "status": "Swasta (PTS)",
    "name": "Akademi Komunitas Manajemen Perhotelan Indonesia (AKMPI)",
    "code": "086001",
    "kabupaten": "Badung",
    "address": "Jl. Bypass Ngurah Rai No. 88, Kuta, Badung",
    "programs": [
      "D1 & D2 Tata Hidang",
      "D1 & D2 Tata Boga",
      "D1 & D2 Divisi Kamar Perhotelan"
    ],
    "matchedFields": [
      "pariwisata"
    ]
  },
  {
    "id": "pt-084001-akademi-pariwisata-denpasar-akpa",
    "category": "perguruan-tinggi",
    "bentuk": "Akademi",
    "status": "Swasta (PTS)",
    "name": "Akademi Pariwisata Denpasar (Akpar Denpasar)",
    "code": "084001",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Hayam Wuruk No. 127, Tanjung Bungkak, Denpasar Timur",
    "programs": [
      "D3 Perhotelan",
      "D3 Usaha Perjalanan Wisata"
    ],
    "matchedFields": [
      "pariwisata"
    ]
  },
  {
    "id": "pt-084002-akademi-pariwisata-triatmajaya",
    "category": "perguruan-tinggi",
    "bentuk": "Akademi",
    "status": "Swasta (PTS)",
    "name": "Akademi Pariwisata Triatmajaya",
    "code": "084002",
    "kabupaten": "Badung",
    "address": "Jl. Kubu Gunung, Tegaljaya, Dalung, Kuta Utara, Badung",
    "programs": [
      "D3 Tata Hidang",
      "D3 Akomodasi Perhotelan"
    ],
    "matchedFields": [
      "pariwisata"
    ]
  },
  {
    "id": "pt-084009-bec-academy-bali",
    "category": "perguruan-tinggi",
    "bentuk": "Akademi",
    "status": "Swasta (PTS)",
    "name": "BEC Academy Bali",
    "code": "084009",
    "kabupaten": "Badung",
    "address": "Jl. Raya Kerobokan No. 38, Kerobokan, Kuta Utara, Badung",
    "programs": [
      "D1 & D3 International Hospitality Management",
      "D1 & D3 Culinary & Bar Management"
    ],
    "matchedFields": [
      "pariwisata"
    ]
  },
  {
    "id": "smk-50103118-smkn-1-denpasar",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Denpasar",
    "code": "50103118",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. HOS Cokroaminoto No. 84, Pemecutan Kaja, Denpasar Utara",
    "programs": [
      "Teknik Komputer & Jaringan (TKJ)",
      "Rekayasa Perangkat Lunak (RPL)",
      "Multimedia/DKV",
      "Teknik Kendaraan Ringan",
      "Teknik Instalasi Tenaga Listrik",
      "Teknik Pemesinan",
      "Desain Pemodelan & Informasi Bangunan (DPIB)",
      "Teknik Audio Video",
      "Teknik Elektronika Industri"
    ],
    "matchedFields": [
      "tkj",
      "informatika",
      "dkv",
      "arsitektur"
    ]
  },
  {
    "id": "smk-50103117-smkn-2-denpasar",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 2 Denpasar",
    "code": "50103117",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Pendidikan No. 28, Sidakarya, Denpasar Selatan",
    "programs": [
      "Akuntansi & Keuangan Lembaga",
      "Otomatisasi & Tata Kelola Perkantoran (MPLB)",
      "Bisnis Daring & Pemasaran",
      "Perbankan & Keuangan Mikro",
      "Usaha Layanan Pariwisata (ULP)"
    ],
    "matchedFields": [
      "bisnis",
      "pariwisata"
    ]
  },
  {
    "id": "smk-50103116-smkn-3-denpasar",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 3 Denpasar",
    "code": "50103116",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Tirtanadi No. 19, Sanur Kauh, Denpasar Selatan",
    "programs": [
      "Kuliner (Tata Boga)",
      "Perhotelan (Akomodasi Perhotelan)",
      "Tata Kecantikan Kulit & Rambut",
      "Desain & Produksi Busana (Tata Busana)"
    ],
    "matchedFields": [
      "pariwisata",
      "kesehatan",
      "dkv"
    ]
  },
  {
    "id": "smk-50103115-smkn-4-denpasar",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 4 Denpasar",
    "code": "50103115",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Drupadi No. 5, Sumerta Kelod, Denpasar Timur",
    "programs": [
      "Perhotelan",
      "Kuliner",
      "Tata Busana",
      "Usaha Layanan Wisata"
    ],
    "matchedFields": [
      "pariwisata",
      "dkv"
    ]
  },
  {
    "id": "smk-50103638-smkn-5-denpasar",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 5 Denpasar",
    "code": "50103638",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Ratna No. 17, Sumerta Kauh, Denpasar Timur",
    "programs": [
      "Seni Tari",
      "Seni Karawitan",
      "Seni Pedalangan",
      "Seni Musik Populer",
      "Seni Teater",
      "Seni Lukis/Murni"
    ],
    "matchedFields": [
      "budaya"
    ]
  },
  {
    "id": "smk-70013037-smkn-6-denpasar",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 6 Denpasar",
    "code": "70013037",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. WR Supratman, Kesiman, Denpasar Timur",
    "programs": [
      "Teknologi Farmasi",
      "Asisten Keperawatan",
      "Teknik Laboratorium Medik"
    ],
    "matchedFields": [
      "kesehatan"
    ]
  },
  {
    "id": "smk-70042893-smkn-7-denpasar",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 7 Denpasar",
    "code": "70042893",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Pura Demak Gg. IV, Pemecutan Klod, Denpasar Barat",
    "programs": [
      "Teknik Jaringan Komputer & Telekomunikasi",
      "Desain Komunikasi Visual",
      "Animasi"
    ],
    "matchedFields": [
      "tkj",
      "dkv"
    ]
  },
  {
    "id": "smk-50103869-smk-ti-bali-global-denpasar",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK TI Bali Global Denpasar",
    "code": "50103869",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Tukad Citarum No. 44, Panjer, Denpasar Selatan",
    "programs": [
      "Teknik Komputer Jaringan",
      "Rekayasa Perangkat Lunak",
      "Multimedia / DKV",
      "Animasi"
    ],
    "matchedFields": [
      "tkj",
      "informatika",
      "dkv"
    ]
  },
  {
    "id": "smk-50103635-smk-pariwisata-harapan-denpasar",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK Pariwisata Harapan Denpasar",
    "code": "50103635",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Raya Sesetan No. 62, Sesetan, Denpasar Selatan",
    "programs": [
      "Akomodasi Perhotelan",
      "Tata Boga (Kuliner)",
      "Usaha Layanan Pariwisata"
    ],
    "matchedFields": [
      "pariwisata"
    ]
  },
  {
    "id": "smk-50103642-smk-kertha-wisata-denpasar",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK Kertha Wisata Denpasar",
    "code": "50103642",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Tukad Balian No. 15, Renon, Denpasar Selatan",
    "programs": [
      "Akomodasi Perhotelan",
      "Tata Boga"
    ],
    "matchedFields": [
      "pariwisata"
    ]
  },
  {
    "id": "smk-69948489-smk-penerbangan-cakra-nusantara-",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK Penerbangan Cakra Nusantara Denpasar",
    "code": "69948489",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Tukad Pakerisan No. 25, Panjer, Denpasar Selatan",
    "programs": [
      "Airframe & Powerplant (Pemeliharaan Pesawat)",
      "Electrical Avionic",
      "Otomatisasi Penerbangan",
      "Tata Operasi Darat Pesawat Udara"
    ],
    "matchedFields": [
      "informatika",
      "tkj"
    ]
  },
  {
    "id": "smk-50103146-smk-saraswati-1-denpasar",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK Saraswati 1 Denpasar",
    "code": "50103146",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Kamboja No. 11A, Dangin Puri Kangin, Denpasar Utara",
    "programs": [
      "Teknik Kendaraan Ringan Otomotif",
      "Teknik Komputer & Jaringan",
      "Teknik Instalasi Tenaga Listrik"
    ],
    "matchedFields": [
      "arsitektur",
      "tkj"
    ]
  },
  {
    "id": "smk-50103147-smk-saraswati-2-denpasar",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK Saraswati 2 Denpasar",
    "code": "50103147",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Kamboja No. 11A, Dangin Puri Kangin, Denpasar Utara",
    "programs": [
      "Akuntansi & Keuangan Lembaga",
      "Otomatisasi & Tata Kelola Perkantoran"
    ],
    "matchedFields": [
      "bisnis"
    ]
  },
  {
    "id": "smk-50103148-smk-saraswati-3-denpasar",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK Saraswati 3 Denpasar",
    "code": "50103148",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Kamboja No. 11A, Dangin Puri Kangin, Denpasar Utara",
    "programs": [
      "Akomodasi Perhotelan",
      "Tata Boga (Kuliner)"
    ],
    "matchedFields": [
      "pariwisata"
    ]
  },
  {
    "id": "smk-50103145-smk-farmasi-saraswati-denpasar",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK Farmasi Saraswati Denpasar",
    "code": "50103145",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Kamboja No. 11A, Dangin Puri Kangin, Denpasar Utara",
    "programs": [
      "Farmasi Klinis & Komunitas"
    ],
    "matchedFields": [
      "kesehatan"
    ]
  },
  {
    "id": "smk-50103165-smk-pgri-1-denpasar",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK PGRI 1 Denpasar",
    "code": "50103165",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Merpati No. 46, Monang Maning, Denpasar Barat",
    "programs": [
      "Akuntansi",
      "Bisnis Daring & Pemasaran",
      "Otomatisasi Perkantoran"
    ],
    "matchedFields": [
      "bisnis"
    ]
  },
  {
    "id": "smk-50103166-smk-pgri-2-denpasar",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK PGRI 2 Denpasar",
    "code": "50103166",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Merpati No. 48, Monang Maning, Denpasar Barat",
    "programs": [
      "Teknik Komputer Jaringan",
      "Teknik Kendaraan Ringan",
      "Teknik Sepeda Motor"
    ],
    "matchedFields": [
      "tkj",
      "arsitektur"
    ]
  },
  {
    "id": "smk-50103167-smk-pgri-3-denpasar",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK PGRI 3 Denpasar",
    "code": "50103167",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Drupadi No. 3, Sumerta Kelod, Denpasar Timur",
    "programs": [
      "Akomodasi Perhotelan",
      "Tata Boga"
    ],
    "matchedFields": [
      "pariwisata"
    ]
  },
  {
    "id": "smk-50103168-smk-pgri-4-denpasar",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK PGRI 4 Denpasar",
    "code": "50103168",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Kebo Iwa Selatan No. 8, Padangsambian, Denpasar Barat",
    "programs": [
      "Perhotelan",
      "Tata Boga"
    ],
    "matchedFields": [
      "pariwisata"
    ]
  },
  {
    "id": "smk-50103169-smk-pgri-5-denpasar",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK PGRI 5 Denpasar",
    "code": "50103169",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Swabhuana No. 7, Padangsambian Klod, Denpasar Barat",
    "programs": [
      "Akomodasi Perhotelan",
      "Kuliner"
    ],
    "matchedFields": [
      "pariwisata"
    ]
  },
  {
    "id": "smk-50103906-smk-pgri-6-denpasar",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK PGRI 6 Denpasar",
    "code": "50103906",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Tukad Gerinding No. 21A, Panjer, Denpasar Selatan",
    "programs": [
      "Akomodasi Perhotelan",
      "Kuliner"
    ],
    "matchedFields": [
      "pariwisata"
    ]
  },
  {
    "id": "smk-50103138-smk-rekayasa-denpasar",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK Rekayasa Denpasar",
    "code": "50103138",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Gunung Krakatau No. 15, Pemecutan Klod, Denpasar Barat",
    "programs": [
      "Teknik Mesin",
      "Teknik Otomotif",
      "Teknik Komputer"
    ],
    "matchedFields": [
      "arsitektur",
      "tkj"
    ]
  },
  {
    "id": "smk-50103911-smk-teknologi-nasional-denpasar-",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK Teknologi Nasional Denpasar (SMK Teknas)",
    "code": "50103911",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Tukad Yeh Aya Gg. IIX No. 15A, Panjer, Denpasar Selatan",
    "programs": [
      "Teknik Jaringan Komputer",
      "Rekayasa Perangkat Lunak",
      "Multimedia",
      "Otomotif"
    ],
    "matchedFields": [
      "tkj",
      "informatika",
      "dkv",
      "arsitektur"
    ]
  },
  {
    "id": "smk-50105437-smk-bali-dewata",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK Bali Dewata",
    "code": "50105437",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Ahmad Yani No. 138, Peguyangan, Denpasar Utara",
    "programs": [
      "Akomodasi Perhotelan",
      "Kuliner",
      "Desain Komunikasi Visual",
      "Teknik Komputer & Jaringan"
    ],
    "matchedFields": [
      "pariwisata",
      "dkv",
      "tkj"
    ]
  },
  {
    "id": "smk-50103847-smkn-1-kuta-selatan",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Kuta Selatan",
    "code": "50103847",
    "kabupaten": "Badung",
    "address": "Jl. Gedong Sari, By Pass Ngurah Rai, Mumbul, Benoa, Kuta Selatan",
    "programs": [
      "Akomodasi Perhotelan",
      "Kuliner (Tata Boga)",
      "Usaha Layanan Wisata",
      "Tata Kecantikan",
      "Teknik Kendaraan Ringan"
    ],
    "matchedFields": [
      "pariwisata",
      "kesehatan",
      "arsitektur"
    ]
  },
  {
    "id": "smk-70033390-smkn-2-kuta-selatan",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 2 Kuta Selatan",
    "code": "70033390",
    "kabupaten": "Badung",
    "address": "Jl. Pura Pengulapan, Ungasan, Kuta Selatan, Badung",
    "programs": [
      "Teknik Jaringan Komputer & Telekomunikasi",
      "Rekayasa Perangkat Lunak",
      "Desain Komunikasi Visual"
    ],
    "matchedFields": [
      "tkj",
      "informatika",
      "dkv"
    ]
  },
  {
    "id": "smk-70013038-smkn-1-kuta-utara",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Kuta Utara",
    "code": "70013038",
    "kabupaten": "Badung",
    "address": "Jl. Made Bulet, Dalung, Kuta Utara, Badung",
    "programs": [
      "Perhotelan",
      "Kuliner",
      "Desain Komunikasi Visual"
    ],
    "matchedFields": [
      "pariwisata",
      "dkv"
    ]
  },
  {
    "id": "smk-50103848-smkn-1-petang",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Petang",
    "code": "50103848",
    "kabupaten": "Badung",
    "address": "Jl. Palaga, Pelaga, Kec. Petang, Badung",
    "programs": [
      "Agribisnis Tanaman Pangan & Hortikultura",
      "Agribisnis Ternak",
      "Akomodasi Perhotelan",
      "Teknik Komputer & Jaringan"
    ],
    "matchedFields": [
      "pertanian",
      "bisnis",
      "pariwisata",
      "tkj"
    ]
  },
  {
    "id": "smk-70043100-smkn-1-mengwi",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Mengwi",
    "code": "70043100",
    "kabupaten": "Badung",
    "address": "Jl. Raya Mengwi, Mengwitani, Mengwi, Badung",
    "programs": [
      "Perhotelan",
      "Kuliner",
      "Teknik Kendaraan Ringan"
    ],
    "matchedFields": [
      "pariwisata",
      "arsitektur"
    ]
  },
  {
    "id": "smk-69888806-smk-ti-bali-global-badung",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK TI Bali Global Badung",
    "code": "69888806",
    "kabupaten": "Badung",
    "address": "Jl. Tibung Sari, Kwanji, Dalung, Kuta Utara, Badung",
    "programs": [
      "Teknik Komputer Jaringan",
      "Rekayasa Perangkat Lunak",
      "Multimedia / DKV"
    ],
    "matchedFields": [
      "tkj",
      "informatika",
      "dkv"
    ]
  },
  {
    "id": "smk-69939130-smk-ti-bali-global-jimbaran",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK TI Bali Global Jimbaran",
    "code": "69939130",
    "kabupaten": "Badung",
    "address": "Jl. Raya Kampus Unud, Jimbaran, Kuta Selatan, Badung",
    "programs": [
      "Rekayasa Perangkat Lunak",
      "Desain Komunikasi Visual",
      "Teknik Komputer Jaringan"
    ],
    "matchedFields": [
      "informatika",
      "dkv",
      "tkj"
    ]
  },
  {
    "id": "smk-50101683-smk-pariwisata-dalung",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK Pariwisata Dalung",
    "code": "50101683",
    "kabupaten": "Badung",
    "address": "Jl. Padang Luwih, Dalung, Kuta Utara, Badung",
    "programs": [
      "Akomodasi Perhotelan",
      "Jasa Boga (Kuliner)"
    ],
    "matchedFields": [
      "pariwisata"
    ]
  },
  {
    "id": "smk-50101682-smk-pariwisata-mengwitani",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK Pariwisata Mengwitani",
    "code": "50101682",
    "kabupaten": "Badung",
    "address": "Jl. Raya Denpasar-Gilimanuk KM 15, Mengwitani, Badung",
    "programs": [
      "Akomodasi Perhotelan",
      "Tata Boga"
    ],
    "matchedFields": [
      "pariwisata"
    ]
  },
  {
    "id": "smk-50101681-smk-pariwisata-triatma-jaya-badu",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK Pariwisata Triatma Jaya Badung",
    "code": "50101681",
    "kabupaten": "Badung",
    "address": "Jl. Kubu Gunung, Tegaljaya, Dalung, Kuta Utara, Badung",
    "programs": [
      "Akomodasi Perhotelan",
      "Jasa Boga",
      "Usaha Layanan Wisata"
    ],
    "matchedFields": [
      "pariwisata"
    ]
  },
  {
    "id": "smk-50101688-smk-pgri-1-badung",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK PGRI 1 Badung",
    "code": "50101688",
    "kabupaten": "Badung",
    "address": "Jl. Raya Gerih No. 84, Abiansemal, Badung",
    "programs": [
      "Akuntansi",
      "Perhotelan",
      "Tata Boga"
    ],
    "matchedFields": [
      "bisnis",
      "pariwisata"
    ]
  },
  {
    "id": "smk-50101689-smk-pgri-2-badung",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK PGRI 2 Badung",
    "code": "50101689",
    "kabupaten": "Badung",
    "address": "Jl. I Gusti Ngurah Rai Gg. Cempaka Putih No. 2A, Mengwi, Badung",
    "programs": [
      "Akomodasi Perhotelan",
      "Kuliner"
    ],
    "matchedFields": [
      "pariwisata"
    ]
  },
  {
    "id": "smk-50101690-smk-pgri-3-badung",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK PGRI 3 Badung",
    "code": "50101690",
    "kabupaten": "Badung",
    "address": "Jl. Wayan Gebyag No. 5, Dalung, Kuta Utara, Badung",
    "programs": [
      "Akomodasi Perhotelan",
      "Tata Boga",
      "Multimedia"
    ],
    "matchedFields": [
      "pariwisata",
      "dkv"
    ]
  },
  {
    "id": "smk-50101687-smk-prshanti-nilayam-kuta",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK Prshanti Nilayam Kuta",
    "code": "50101687",
    "kabupaten": "Badung",
    "address": "Jl. Kubu Anyar No. 21, Kuta, Badung",
    "programs": [
      "Akomodasi Perhotelan",
      "Jasa Boga"
    ],
    "matchedFields": [
      "pariwisata"
    ]
  },
  {
    "id": "smk-50101686-smk-kharisma-mengwi",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK Kharisma Mengwi",
    "code": "50101686",
    "kabupaten": "Badung",
    "address": "Jl. Raya Denpasar-Singaraja KM 19, Werdi Bhuwana, Mengwi, Badung",
    "programs": [
      "Akomodasi Perhotelan",
      "Kuliner"
    ],
    "matchedFields": [
      "pariwisata"
    ]
  },
  {
    "id": "smk-50101685-smk-katolik-santo-thomas-aquino-",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK Katolik Santo Thomas Aquino Tangeb",
    "code": "50101685",
    "kabupaten": "Badung",
    "address": "Jl. Raya Tangeb No. 42, Mengwi, Badung",
    "programs": [
      "Akuntansi",
      "Akomodasi Perhotelan",
      "Teknik Komputer & Jaringan"
    ],
    "matchedFields": [
      "bisnis",
      "pariwisata",
      "tkj"
    ]
  },
  {
    "id": "smk-50102146-smkn-1-gianyar",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Gianyar",
    "code": "50102146",
    "kabupaten": "Gianyar",
    "address": "Jl. Raya Ciung Wanara No. 1, Gianyar",
    "programs": [
      "Akuntansi & Keuangan Lembaga",
      "Otomatisasi & Tata Kelola Perkantoran",
      "Bisnis Daring & Pemasaran",
      "Rekayasa Perangkat Lunak",
      "Teknik Komputer & Jaringan",
      "Bisnis Logistik"
    ],
    "matchedFields": [
      "bisnis",
      "informatika",
      "tkj"
    ]
  },
  {
    "id": "smk-50102147-smkn-2-gianyar",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 2 Gianyar",
    "code": "50102147",
    "kabupaten": "Gianyar",
    "address": "Jl. Raya Astina Timur, Samplangan, Gianyar",
    "programs": [
      "Teknik Kendaraan Ringan",
      "Teknik Instalasi Tenaga Listrik",
      "Teknik Pemesinan",
      "Teknik Pengelasan",
      "Teknik Konstruksi & Properti"
    ],
    "matchedFields": [
      "arsitektur",
      "tkj"
    ]
  },
  {
    "id": "smk-50102148-smkn-1-sukawati",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Sukawati",
    "code": "50102148",
    "kabupaten": "Gianyar",
    "address": "Jl. Taak Gede, Batubulan Candi, Sukawati, Gianyar",
    "programs": [
      "Seni Lukis",
      "Kriya Kreatif Keramik",
      "Kriya Kreatif Kayu",
      "Kriya Kreatif Logam",
      "Desain Komunikasi Visual"
    ],
    "matchedFields": [
      "budaya",
      "dkv"
    ]
  },
  {
    "id": "smk-50102149-smkn-2-sukawati",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 2 Sukawati",
    "code": "50102149",
    "kabupaten": "Gianyar",
    "address": "Jl. Raya Sukawati, Sukawati, Gianyar",
    "programs": [
      "Seni Tari Tradisi",
      "Seni Karawitan",
      "Seni Pedalangan",
      "Seni Musik"
    ],
    "matchedFields": [
      "budaya"
    ]
  },
  {
    "id": "smk-50102150-smkn-3-sukawati",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 3 Sukawati",
    "code": "50102150",
    "kabupaten": "Gianyar",
    "address": "Jl. Celuk, Sukawati, Gianyar",
    "programs": [
      "Kriya Logam & Perhiasan (Silver/Gold Craft)",
      "Desain Produk Kriya",
      "DKV"
    ],
    "matchedFields": [
      "budaya",
      "dkv"
    ]
  },
  {
    "id": "smk-50102151-smkn-1-tegallalang",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Tegallalang",
    "code": "50102151",
    "kabupaten": "Gianyar",
    "address": "Jl. Raya Tegallalang, Tegallalang, Gianyar",
    "programs": [
      "Akomodasi Perhotelan",
      "Kuliner",
      "Desain Grafis"
    ],
    "matchedFields": [
      "pariwisata",
      "dkv"
    ]
  },
  {
    "id": "smk-50102152-smkn-1-payangan",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Payangan",
    "code": "50102152",
    "kabupaten": "Gianyar",
    "address": "Jl. Raya Payangan, Kerta, Payangan, Gianyar",
    "programs": [
      "Agribisnis Tanaman Pangan & Hortikultura",
      "Akomodasi Perhotelan",
      "Teknik Sepeda Motor"
    ],
    "matchedFields": [
      "pertanian",
      "bisnis",
      "pariwisata",
      "arsitektur"
    ]
  },
  {
    "id": "smk-50102153-smkn-1-tampaksiring",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Tampaksiring",
    "code": "50102153",
    "kabupaten": "Gianyar",
    "address": "Jl. Raya Tampaksiring, Manukaya, Tampaksiring, Gianyar",
    "programs": [
      "Akomodasi Perhotelan",
      "Kuliner (Tata Boga)",
      "Teknik Komputer & Jaringan"
    ],
    "matchedFields": [
      "pariwisata",
      "tkj"
    ]
  },
  {
    "id": "smk-50102155-smk-pariwisata-kertayasa-ubud",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK Pariwisata Kertayasa Ubud",
    "code": "50102155",
    "kabupaten": "Gianyar",
    "address": "Jl. Raya Mas No. 45, Ubud, Gianyar",
    "programs": [
      "Akomodasi Perhotelan",
      "Jasa Boga",
      "Usaha Layanan Wisata"
    ],
    "matchedFields": [
      "pariwisata"
    ]
  },
  {
    "id": "smk-69786488-smk-ti-bali-global-gianyar",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK TI Bali Global Gianyar",
    "code": "69786488",
    "kabupaten": "Gianyar",
    "address": "Jl. Ciung Wanara No. 8X, Gianyar",
    "programs": [
      "Teknik Komputer Jaringan",
      "Rekayasa Perangkat Lunak",
      "Multimedia/DKV"
    ],
    "matchedFields": [
      "tkj",
      "informatika",
      "dkv"
    ]
  },
  {
    "id": "smk-50102158-smk-pgri-1-gianyar",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK PGRI 1 Gianyar",
    "code": "50102158",
    "kabupaten": "Gianyar",
    "address": "Jl. Majapahit No. 10, Gianyar",
    "programs": [
      "Akomodasi Perhotelan",
      "Akuntansi",
      "Tata Boga"
    ],
    "matchedFields": [
      "pariwisata",
      "bisnis"
    ]
  },
  {
    "id": "smk-50105610-smkn-1-tabanan",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Tabanan",
    "code": "50105610",
    "kabupaten": "Tabanan",
    "address": "Jl. Melati No. 35, Dangin Puri Kauh, Tabanan",
    "programs": [
      "Akuntansi & Keuangan Lembaga",
      "Otomatisasi Perkantoran",
      "Bisnis Daring & Pemasaran",
      "Usaha Layanan Wisata",
      "Desain Komunikasi Visual"
    ],
    "matchedFields": [
      "bisnis",
      "dkv"
    ]
  },
  {
    "id": "smk-50105611-smkn-2-tabanan",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 2 Tabanan",
    "code": "50105611",
    "kabupaten": "Tabanan",
    "address": "Jl. Wisnu Marga, Belayu, Marga, Tabanan",
    "programs": [
      "Teknik Komputer & Jaringan",
      "Rekayasa Perangkat Lunak",
      "Multimedia"
    ],
    "matchedFields": [
      "tkj",
      "informatika",
      "dkv"
    ]
  },
  {
    "id": "smk-50105612-smkn-3-tabanan",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 3 Tabanan",
    "code": "50105612",
    "kabupaten": "Tabanan",
    "address": "Jl. Raya Denpasar-Gilimanuk, Bantas, Selemadeg Timur, Tabanan",
    "programs": [
      "Teknik Kendaraan Ringan",
      "Teknik Instalasi Tenaga Listrik",
      "Teknik Sepeda Motor",
      "Teknik Konstruksi Gedung"
    ],
    "matchedFields": [
      "arsitektur",
      "tkj"
    ]
  },
  {
    "id": "smk-50105613-smkn-1-baturiti",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Baturiti",
    "code": "50105613",
    "kabupaten": "Tabanan",
    "address": "Jl. Raya Baturiti, Perean, Baturiti, Tabanan",
    "programs": [
      "Akomodasi Perhotelan",
      "Tata Boga (Kuliner)",
      "Agribisnis Pengolahan Hasil Pertanian"
    ],
    "matchedFields": [
      "pariwisata",
      "pertanian",
      "bisnis"
    ]
  },
  {
    "id": "smk-69786487-smk-ti-bali-global-tabanan",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK TI Bali Global Tabanan",
    "code": "69786487",
    "kabupaten": "Tabanan",
    "address": "Jl. Kaswari No. 7, Tabanan",
    "programs": [
      "Teknik Komputer Jaringan",
      "Rekayasa Perangkat Lunak",
      "Multimedia / DKV"
    ],
    "matchedFields": [
      "tkj",
      "informatika",
      "dkv"
    ]
  },
  {
    "id": "smk-50105615-smk-pariwisata-restu-tabanan",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK Pariwisata Restu Tabanan",
    "code": "50105615",
    "kabupaten": "Tabanan",
    "address": "Jl. Yeh Gangga No. 2, Tabanan",
    "programs": [
      "Akomodasi Perhotelan",
      "Kuliner"
    ],
    "matchedFields": [
      "pariwisata"
    ]
  },
  {
    "id": "smk-50105616-smk-saraswati-1-tabanan",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK Saraswati 1 Tabanan",
    "code": "50105616",
    "kabupaten": "Tabanan",
    "address": "Jl. Pahlawan No. 4, Tabanan",
    "programs": [
      "Teknik Kendaraan Ringan",
      "Teknik Komputer & Jaringan"
    ],
    "matchedFields": [
      "arsitektur",
      "tkj"
    ]
  },
  {
    "id": "smk-50105617-smk-saraswati-2-tabanan",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK Saraswati 2 Tabanan",
    "code": "50105617",
    "kabupaten": "Tabanan",
    "address": "Jl. Pahlawan No. 4, Tabanan",
    "programs": [
      "Akuntansi",
      "Manajemen Perkantoran",
      "Perhotelan"
    ],
    "matchedFields": [
      "bisnis",
      "pariwisata"
    ]
  },
  {
    "id": "smk-50105618-smk-pgri-1-tabanan",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK PGRI 1 Tabanan",
    "code": "50105618",
    "kabupaten": "Tabanan",
    "address": "Jl. Wagimin No. 2, Tabanan",
    "programs": [
      "Perhotelan",
      "Tata Boga",
      "Akuntansi"
    ],
    "matchedFields": [
      "pariwisata",
      "bisnis"
    ]
  },
  {
    "id": "smk-50101344-smkn-1-singaraja",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Singaraja",
    "code": "50101344",
    "kabupaten": "Buleleng",
    "address": "Jl. Pramuka No. 6, Singaraja, Buleleng",
    "programs": [
      "Akuntansi & Keuangan Lembaga",
      "Otomatisasi & Tata Kelola Perkantoran",
      "Bisnis Daring & Pemasaran",
      "Perbankan Syariah",
      "Usaha Layanan Wisata"
    ],
    "matchedFields": [
      "bisnis"
    ]
  },
  {
    "id": "smk-50101345-smkn-2-singaraja",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 2 Singaraja",
    "code": "50101345",
    "kabupaten": "Buleleng",
    "address": "Jl. Srikandi No. 9, Baktiseraga, Singaraja, Buleleng",
    "programs": [
      "Akomodasi Perhotelan",
      "Kuliner (Tata Boga)",
      "Tata Busana",
      "Tata Kecantikan Kulit & Rambut"
    ],
    "matchedFields": [
      "pariwisata",
      "dkv",
      "kesehatan"
    ]
  },
  {
    "id": "smk-50101346-smkn-3-singaraja",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 3 Singaraja",
    "code": "50101346",
    "kabupaten": "Buleleng",
    "address": "Jl. Gempol, Banyuasri, Singaraja, Buleleng",
    "programs": [
      "Teknik Pemesinan",
      "Teknik Kendaraan Ringan",
      "Teknik Instalasi Tenaga Listrik",
      "Teknik Komputer & Jaringan",
      "Desain Pemodelan Bangunan (DPIB)",
      "Teknik Pengelasan",
      "Multimedia"
    ],
    "matchedFields": [
      "arsitektur",
      "tkj",
      "dkv"
    ]
  },
  {
    "id": "smk-50101347-smkn-1-sukasada",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Sukasada",
    "code": "50101347",
    "kabupaten": "Buleleng",
    "address": "Jl. Jelantik Gingsir, Sukasada, Buleleng",
    "programs": [
      "Seni Kriya Logam",
      "Seni Kriya Kayu",
      "Desain Komunikasi Visual",
      "Seni Tari",
      "Animasi"
    ],
    "matchedFields": [
      "budaya",
      "dkv"
    ]
  },
  {
    "id": "smk-50101348-smkn-2-sukasada",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 2 Sukasada",
    "code": "50101348",
    "kabupaten": "Buleleng",
    "address": "Desa Panji, Sukasada, Buleleng",
    "programs": [
      "Agribisnis Pengolahan Hasil Pertanian",
      "Agribisnis Tanaman Pangan & Hortikultura",
      "Usaha Perjalanan Wisata"
    ],
    "matchedFields": [
      "pertanian",
      "bisnis",
      "pariwisata"
    ]
  },
  {
    "id": "smk-50101349-smkn-1-seririt",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Seririt",
    "code": "50101349",
    "kabupaten": "Buleleng",
    "address": "Jl. Sudirman, Seririt, Buleleng",
    "programs": [
      "Akomodasi Perhotelan",
      "Tata Boga",
      "Akuntansi",
      "Teknik Komputer & Jaringan"
    ],
    "matchedFields": [
      "pariwisata",
      "bisnis",
      "tkj"
    ]
  },
  {
    "id": "smk-50105300-smkn-2-seririt",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 2 Seririt",
    "code": "50105300",
    "kabupaten": "Buleleng",
    "address": "Desa Lokapaksa, Seririt, Buleleng",
    "programs": [
      "Teknik Kendaraan Ringan",
      "Teknik Sepeda Motor",
      "Teknik Pengelasan"
    ],
    "matchedFields": [
      "arsitektur"
    ]
  },
  {
    "id": "smk-50101350-smkn-1-sawan",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Sawan",
    "code": "50101350",
    "kabupaten": "Buleleng",
    "address": "Jl. Raya Sangsit, Menyali, Sawan, Buleleng",
    "programs": [
      "Akomodasi Perhotelan",
      "Kuliner",
      "Teknik Komputer Jaringan"
    ],
    "matchedFields": [
      "pariwisata",
      "tkj"
    ]
  },
  {
    "id": "smk-50101351-smkn-1-gerokgak",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Gerokgak",
    "code": "50101351",
    "kabupaten": "Buleleng",
    "address": "Jl. Raya Singaraja-Gilimanuk, Banyupoh, Gerokgak, Buleleng",
    "programs": [
      "Agribisnis Perikanan Air Payau & Laut",
      "Nautika Kapal Penangkap Ikan",
      "Akomodasi Perhotelan",
      "Akuntansi"
    ],
    "matchedFields": [
      "pertanian",
      "lingkungan",
      "bisnis",
      "pariwisata"
    ]
  },
  {
    "id": "smk-50101352-smkn-1-busungbiu",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Busungbiu",
    "code": "50101352",
    "kabupaten": "Buleleng",
    "address": "Desa Subuk, Busungbiu, Buleleng",
    "programs": [
      "Akomodasi Perhotelan",
      "Agribisnis Tanaman Perkebunan",
      "Teknik Sepeda Motor"
    ],
    "matchedFields": [
      "pariwisata",
      "pertanian",
      "bisnis",
      "arsitektur"
    ]
  },
  {
    "id": "smk-50101353-smkn-1-kubutambahan",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Kubutambahan",
    "code": "50101353",
    "kabupaten": "Buleleng",
    "address": "Jl. Raya Kubutambahan, Kubutambahan, Buleleng",
    "programs": [
      "Akomodasi Perhotelan",
      "Teknik Kendaraan Ringan",
      "Tata Boga",
      "Rekayasa Perangkat Lunak"
    ],
    "matchedFields": [
      "pariwisata",
      "arsitektur",
      "informatika"
    ]
  },
  {
    "id": "smk-50101354-smkn-1-tejakula",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Tejakula",
    "code": "50101354",
    "kabupaten": "Buleleng",
    "address": "Desa Bondalem, Tejakula, Buleleng",
    "programs": [
      "Akomodasi Perhotelan",
      "Kuliner",
      "Agribisnis Perikanan"
    ],
    "matchedFields": [
      "pariwisata",
      "pertanian",
      "bisnis"
    ]
  },
  {
    "id": "smk-69786489-smk-ti-bali-global-singaraja",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK TI Bali Global Singaraja",
    "code": "69786489",
    "kabupaten": "Buleleng",
    "address": "Jl. Ngurah Rai No. 74, Singaraja, Buleleng",
    "programs": [
      "Teknik Komputer Jaringan",
      "Rekayasa Perangkat Lunak",
      "Multimedia/DKV"
    ],
    "matchedFields": [
      "tkj",
      "informatika",
      "dkv"
    ]
  },
  {
    "id": "smk-50101358-smk-pariwisata-triatma-jaya-sing",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK Pariwisata Triatma Jaya Singaraja",
    "code": "50101358",
    "kabupaten": "Buleleng",
    "address": "Jl. Sam Ratulangi No. 19, Penarukan, Singaraja, Buleleng",
    "programs": [
      "Akomodasi Perhotelan",
      "Tata Boga",
      "Usaha Layanan Wisata"
    ],
    "matchedFields": [
      "pariwisata"
    ]
  },
  {
    "id": "smk-69888807-smk-kesehatan-bali-medika-bangli",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK Kesehatan Bali Medika Bangli di Singaraja / Buleleng",
    "code": "69888807",
    "kabupaten": "Buleleng",
    "address": "Jl. Laksamana, Baktiseraga, Singaraja, Buleleng",
    "programs": [
      "Farmasi Klinis",
      "Asisten Keperawatan"
    ],
    "matchedFields": [
      "kesehatan"
    ]
  },
  {
    "id": "smk-50101359-smk-pgri-singaraja",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK PGRI Singaraja",
    "code": "50101359",
    "kabupaten": "Buleleng",
    "address": "Jl. Ahmad Yani No. 80, Singaraja, Buleleng",
    "programs": [
      "Akomodasi Perhotelan",
      "Akuntansi",
      "Tata Boga"
    ],
    "matchedFields": [
      "pariwisata",
      "bisnis"
    ]
  },
  {
    "id": "smk-50102715-smkn-1-negara",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Negara",
    "code": "50102715",
    "kabupaten": "Jembrana",
    "address": "Jl. Ngurah Rai No. 103, Dauhwaru, Negara, Jembrana",
    "programs": [
      "Akuntansi & Keuangan Lembaga",
      "Otomatisasi Perkantoran",
      "Bisnis Daring & Pemasaran",
      "Perbankan",
      "Tata Busana"
    ],
    "matchedFields": [
      "bisnis",
      "dkv"
    ]
  },
  {
    "id": "smk-50102716-smkn-2-negara",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 2 Negara",
    "code": "50102716",
    "kabupaten": "Jembrana",
    "address": "Jl. Sahadewa, Dangintukadaya, Jembrana",
    "programs": [
      "Teknik Kendaraan Ringan Otomotif",
      "Teknik Pemesinan",
      "Teknik Pengelasan",
      "Teknik Instalasi Tenaga Listrik",
      "DPIB"
    ],
    "matchedFields": [
      "arsitektur",
      "tkj"
    ]
  },
  {
    "id": "smk-50102717-smkn-3-negara",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 3 Negara",
    "code": "50102717",
    "kabupaten": "Jembrana",
    "address": "Jl. Gempol, Banjar Tengah, Negara, Jembrana",
    "programs": [
      "Akomodasi Perhotelan",
      "Tata Boga (Kuliner)",
      "Tata Kecantikan"
    ],
    "matchedFields": [
      "pariwisata",
      "kesehatan"
    ]
  },
  {
    "id": "smk-50102718-smkn-4-negara",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 4 Negara",
    "code": "50102718",
    "kabupaten": "Jembrana",
    "address": "Jl. Gatot Subroto, Banyubiru, Negara, Jembrana",
    "programs": [
      "Teknik Komputer Jaringan",
      "Rekayasa Perangkat Lunak",
      "Multimedia/DKV"
    ],
    "matchedFields": [
      "tkj",
      "informatika",
      "dkv"
    ]
  },
  {
    "id": "smk-50105315-smkn-5-negara",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 5 Negara",
    "code": "50105315",
    "kabupaten": "Jembrana",
    "address": "Desa Pengambengan, Negara, Jembrana",
    "programs": [
      "Nautika Kapal Penangkap Ikan",
      "Agribisnis Perikanan Air Payau & Laut",
      "Pengolahan Hasil Laut"
    ],
    "matchedFields": [
      "lingkungan",
      "pertanian",
      "bisnis"
    ]
  },
  {
    "id": "smk-70013039-smkn-1-melaya",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Melaya",
    "code": "70013039",
    "kabupaten": "Jembrana",
    "address": "Jl. Denpasar-Gilimanuk, Melaya, Jembrana",
    "programs": [
      "Agribisnis Pengolahan Hasil Pertanian",
      "Perhotelan",
      "Teknik Sepeda Motor"
    ],
    "matchedFields": [
      "pertanian",
      "bisnis",
      "pariwisata",
      "arsitektur"
    ]
  },
  {
    "id": "smk-69786490-smk-ti-bali-global-negara",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK TI Bali Global Negara",
    "code": "69786490",
    "kabupaten": "Jembrana",
    "address": "Jl. Pahlawan No. 25, Pendem, Jembrana",
    "programs": [
      "Teknik Komputer & Jaringan",
      "Multimedia",
      "Rekayasa Perangkat Lunak"
    ],
    "matchedFields": [
      "tkj",
      "dkv",
      "informatika"
    ]
  },
  {
    "id": "smk-50102720-smk-pgri-1-negara",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK PGRI 1 Negara",
    "code": "50102720",
    "kabupaten": "Jembrana",
    "address": "Jl. Ngurah Rai No. 80, Dauhwaru, Negara, Jembrana",
    "programs": [
      "Akomodasi Perhotelan",
      "Akuntansi",
      "Kuliner"
    ],
    "matchedFields": [
      "pariwisata",
      "bisnis"
    ]
  },
  {
    "id": "smk-50102721-smk-marsudirini-negara",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK Marsudirini Negara",
    "code": "50102721",
    "kabupaten": "Jembrana",
    "address": "Jl. Wijaya Kusuma No. 17, Negara, Jembrana",
    "programs": [
      "Akuntansi",
      "Bisnis Manajemen",
      "Perhotelan"
    ],
    "matchedFields": [
      "bisnis",
      "pariwisata"
    ]
  },
  {
    "id": "smk-50102377-smkn-1-amlapura",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Amlapura",
    "code": "50102377",
    "kabupaten": "Karangasem",
    "address": "Jl. Veteran, Padangkerta, Karangasem",
    "programs": [
      "Akomodasi Perhotelan",
      "Kuliner (Tata Boga)",
      "Akuntansi",
      "Otomatisasi & Tata Kelola Perkantoran",
      "Usaha Layanan Wisata"
    ],
    "matchedFields": [
      "pariwisata",
      "bisnis"
    ]
  },
  {
    "id": "smk-50102378-smkn-2-amlapura",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 2 Amlapura",
    "code": "50102378",
    "kabupaten": "Karangasem",
    "address": "Jl. Untung Surapati, Amlapura, Karangasem",
    "programs": [
      "Teknik Kendaraan Ringan Otomotif",
      "Teknik Komputer & Jaringan",
      "Teknik Instalasi Tenaga Listrik",
      "Teknik Bangunan"
    ],
    "matchedFields": [
      "arsitektur",
      "tkj"
    ]
  },
  {
    "id": "smk-50102379-smkn-1-abang",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Abang",
    "code": "50102379",
    "kabupaten": "Karangasem",
    "address": "Jl. Raya Amed, Culik, Abang, Karangasem",
    "programs": [
      "Akomodasi Perhotelan",
      "Tata Boga",
      "Nautika Kapal Penangkap Ikan"
    ],
    "matchedFields": [
      "pariwisata",
      "lingkungan"
    ]
  },
  {
    "id": "smk-50102380-smkn-1-kubu",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Kubu",
    "code": "50102380",
    "kabupaten": "Karangasem",
    "address": "Jl. Singaraja-Amlapura, Tianyar Barat, Kubu, Karangasem",
    "programs": [
      "Agribisnis Tanaman Perkebunan",
      "Perhotelan",
      "Teknik Sepeda Motor"
    ],
    "matchedFields": [
      "pertanian",
      "bisnis",
      "pariwisata",
      "arsitektur"
    ]
  },
  {
    "id": "smk-50102381-smkn-1-manggis",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Manggis",
    "code": "50102381",
    "kabupaten": "Karangasem",
    "address": "Jl. Raya Manggis, Ulakan, Manggis, Karangasem",
    "programs": [
      "Akomodasi Perhotelan",
      "Kuliner",
      "Teknik Kendaraan Ringan"
    ],
    "matchedFields": [
      "pariwisata",
      "arsitektur"
    ]
  },
  {
    "id": "smk-69786491-smk-ti-bali-global-karangasem",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK TI Bali Global Karangasem",
    "code": "69786491",
    "kabupaten": "Karangasem",
    "address": "Jl. Ahmad Yani No. 100, Subagan, Karangasem",
    "programs": [
      "Teknik Komputer Jaringan",
      "Rekayasa Perangkat Lunak",
      "Multimedia/DKV"
    ],
    "matchedFields": [
      "tkj",
      "informatika",
      "dkv"
    ]
  },
  {
    "id": "smk-50102384-smk-pariwisata-saraswati-karanga",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK Pariwisata Saraswati Karangasem",
    "code": "50102384",
    "kabupaten": "Karangasem",
    "address": "Jl. Sudirman No. 25, Amlapura, Karangasem",
    "programs": [
      "Akomodasi Perhotelan",
      "Tata Boga"
    ],
    "matchedFields": [
      "pariwisata"
    ]
  },
  {
    "id": "smk-50102385-smk-pgri-amlapura",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK PGRI Amlapura",
    "code": "50102385",
    "kabupaten": "Karangasem",
    "address": "Jl. Nenas, Subagan, Amlapura, Karangasem",
    "programs": [
      "Akomodasi Perhotelan",
      "Akuntansi",
      "Kuliner"
    ],
    "matchedFields": [
      "pariwisata",
      "bisnis"
    ]
  },
  {
    "id": "smk-50102283-smkn-1-klungkung",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Klungkung",
    "code": "50102283",
    "kabupaten": "Klungkung",
    "address": "Jl. Flamboyan No. 61, Semarapura Kelod, Klungkung",
    "programs": [
      "Akuntansi & Keuangan Lembaga",
      "Otomatisasi Perkantoran",
      "Bisnis Daring & Pemasaran",
      "Akomodasi Perhotelan",
      "Tata Boga",
      "Tata Busana"
    ],
    "matchedFields": [
      "bisnis",
      "pariwisata",
      "dkv"
    ]
  },
  {
    "id": "smk-50102284-smkn-2-klungkung",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 2 Klungkung",
    "code": "50102284",
    "kabupaten": "Klungkung",
    "address": "Jl. Raya Gunaksa, Dawan, Klungkung",
    "programs": [
      "Teknik Komputer & Jaringan",
      "Rekayasa Perangkat Lunak",
      "Teknik Kendaraan Ringan",
      "Teknik Instalasi Tenaga Listrik"
    ],
    "matchedFields": [
      "tkj",
      "informatika",
      "arsitektur"
    ]
  },
  {
    "id": "smk-50102285-smkn-1-nusa-penida",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Nusa Penida",
    "code": "50102285",
    "kabupaten": "Klungkung",
    "address": "Jl. Batununggul, Nusa Penida, Klungkung",
    "programs": [
      "Akomodasi Perhotelan",
      "Kuliner (Tata Boga)",
      "Nautika Kapal Penangkap Ikan",
      "Teknik Komputer Jaringan"
    ],
    "matchedFields": [
      "pariwisata",
      "lingkungan",
      "tkj"
    ]
  },
  {
    "id": "smk-69786492-smk-ti-bali-global-klungkung",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK TI Bali Global Klungkung",
    "code": "69786492",
    "kabupaten": "Klungkung",
    "address": "Jl. Puputan No. 12, Semarapura, Klungkung",
    "programs": [
      "Teknik Komputer Jaringan",
      "Desain Komunikasi Visual",
      "Rekayasa Perangkat Lunak"
    ],
    "matchedFields": [
      "tkj",
      "dkv",
      "informatika"
    ]
  },
  {
    "id": "smk-50102288-smk-pariwisata-yapparindo-klungk",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK Pariwisata Yapparindo Klungkung",
    "code": "50102288",
    "kabupaten": "Klungkung",
    "address": "Jl. Gusti Ngurah Rai No. 15, Semarapura Tengah, Klungkung",
    "programs": [
      "Akomodasi Perhotelan",
      "Tata Boga",
      "Usaha Layanan Wisata"
    ],
    "matchedFields": [
      "pariwisata"
    ]
  },
  {
    "id": "smk-50102289-smk-pgri-klungkung",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK PGRI Klungkung",
    "code": "50102289",
    "kabupaten": "Klungkung",
    "address": "Jl. Ngurah Rai, Semarapura, Klungkung",
    "programs": [
      "Akomodasi Perhotelan",
      "Akuntansi"
    ],
    "matchedFields": [
      "pariwisata",
      "bisnis"
    ]
  },
  {
    "id": "smk-50102604-smkn-1-bangli",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Bangli",
    "code": "50102604",
    "kabupaten": "Bangli",
    "address": "Jl. Merdeka No. 89, Bangli",
    "programs": [
      "Akuntansi & Keuangan Lembaga",
      "Otomatisasi Perkantoran",
      "Bisnis Daring & Pemasaran",
      "Bisnis Logistik",
      "Usaha Perjalanan Wisata"
    ],
    "matchedFields": [
      "bisnis",
      "pariwisata"
    ]
  },
  {
    "id": "smk-50102605-smkn-2-bangli",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 2 Bangli",
    "code": "50102605",
    "kabupaten": "Bangli",
    "address": "Jl. Raya Kayuambua, Susut, Bangli",
    "programs": [
      "Akomodasi Perhotelan",
      "Kuliner (Tata Boga)",
      "Tata Kecantikan"
    ],
    "matchedFields": [
      "pariwisata",
      "kesehatan"
    ]
  },
  {
    "id": "smk-50102606-smkn-3-bangli",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 3 Bangli",
    "code": "50102606",
    "kabupaten": "Bangli",
    "address": "Jl. Nusantara, Kubu, Bangli",
    "programs": [
      "Teknik Kendaraan Ringan Otomotif",
      "Teknik Komputer Jaringan",
      "Desain Pemodelan Bangunan (DPIB)",
      "Teknik Pengelasan"
    ],
    "matchedFields": [
      "arsitektur",
      "tkj"
    ]
  },
  {
    "id": "smk-50102607-smkn-4-bangli",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 4 Bangli",
    "code": "50102607",
    "kabupaten": "Bangli",
    "address": "Jl. Dr. Ir. Soekarno, Tamanbali, Bangli",
    "programs": [
      "Agribisnis Pengolahan Hasil Pertanian",
      "Agribisnis Ternak Unggas",
      "Kesehatan Hewan"
    ],
    "matchedFields": [
      "pertanian",
      "bisnis",
      "kesehatan"
    ]
  },
  {
    "id": "smk-50102608-smkn-1-kintamani",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Kintamani",
    "code": "50102608",
    "kabupaten": "Bangli",
    "address": "Jl. Raya Kintamani, Bayunggede, Kintamani, Bangli",
    "programs": [
      "Akomodasi Perhotelan",
      "Kuliner",
      "Agribisnis Tanaman Perkebunan (Kopi & Hortikultura)"
    ],
    "matchedFields": [
      "pariwisata",
      "pertanian",
      "bisnis"
    ]
  },
  {
    "id": "smk-70013040-smkn-2-kintamani",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 2 Kintamani",
    "code": "70013040",
    "kabupaten": "Bangli",
    "address": "Desa Songan, Kintamani, Bangli",
    "programs": [
      "Teknik Kendaraan Ringan",
      "Akomodasi Perhotelan"
    ],
    "matchedFields": [
      "arsitektur",
      "pariwisata"
    ]
  },
  {
    "id": "smk-50102609-smkn-1-susut",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Susut",
    "code": "50102609",
    "kabupaten": "Bangli",
    "address": "Desa Sulahan, Susut, Bangli",
    "programs": [
      "Akomodasi Perhotelan",
      "Teknik Komputer & Jaringan",
      "Tata Busana"
    ],
    "matchedFields": [
      "pariwisata",
      "tkj",
      "dkv"
    ]
  },
  {
    "id": "smk-50102610-smkn-1-tembuku",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Negeri",
    "name": "SMKN 1 Tembuku",
    "code": "50102610",
    "kabupaten": "Bangli",
    "address": "Desa Undisan, Tembuku, Bangli",
    "programs": [
      "Akomodasi Perhotelan",
      "Agribisnis Tanaman",
      "Teknik Sepeda Motor"
    ],
    "matchedFields": [
      "pariwisata",
      "pertanian",
      "bisnis",
      "arsitektur"
    ]
  },
  {
    "id": "smk-50102612-smk-pgri-bangli",
    "category": "smk",
    "bentuk": "SMK",
    "status": "Swasta",
    "name": "SMK PGRI Bangli",
    "code": "50102612",
    "kabupaten": "Bangli",
    "address": "Jl. Brigjen Ngurah Rai No. 45, Bangli",
    "programs": [
      "Akomodasi Perhotelan",
      "Akuntansi",
      "Kuliner"
    ],
    "matchedFields": [
      "pariwisata",
      "bisnis"
    ]
  },
  {
    "id": "sma-50103126-sman-1-denpasar",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Denpasar",
    "code": "50103126",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Kamboja No. 4, Dangin Puri Kangin, Denpasar Utara",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50103125-sman-2-denpasar",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 2 Denpasar",
    "code": "50103125",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Jenderal Sudirman No. 3A, Dauh Puri Klod, Denpasar Barat",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50103124-sman-3-denpasar",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 3 Denpasar",
    "code": "50103124",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Nusa Indah No. 20X, Sumerta Kauh, Denpasar Timur",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50103123-sman-4-denpasar",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 4 Denpasar",
    "code": "50103123",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Gunung Rinjani, Monang Maning, Pemecutan Klod, Denpasar Barat",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50103122-sman-5-denpasar",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 5 Denpasar",
    "code": "50103122",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Sanitasi No. 2, Sidakarya, Denpasar Selatan",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50103121-sman-6-denpasar",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 6 Denpasar",
    "code": "50103121",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Raya Sanur / Tukad Nyali, Sanur Kauh, Denpasar Selatan",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50103120-sman-7-denpasar",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 7 Denpasar",
    "code": "50103120",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Kamboja No. 9, Dangin Puri Kangin, Denpasar Utara",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50103634-sman-8-denpasar",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 8 Denpasar",
    "code": "50103634",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Dam Peraupan, Peguyangan Kaja, Denpasar Utara",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-70010419-sman-9-denpasar",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 9 Denpasar",
    "code": "70010419",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. WR Supratman No. 225, Kesiman, Denpasar Timur",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-70010420-sman-10-denpasar",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 10 Denpasar",
    "code": "70010420",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Bypass Ngurah Rai No. 732, Sanur Kauh, Denpasar Selatan",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-70013035-sman-11-denpasar",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 11 Denpasar",
    "code": "70013035",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Tangkuban Perahu, Padangsambian Klod, Denpasar Barat",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-70013036-sman-12-denpasar",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 12 Denpasar",
    "code": "70013036",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Imam Bonjol, Denpasar Barat",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50103176-sma-katolik-santo-yoseph-denpasa",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Swasta",
    "name": "SMA Katolik Santo Yoseph Denpasar",
    "code": "50103176",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. P.B. Sudirman No. 7, Dauh Puri Klod, Denpasar Barat",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50103175-sma-kristen-harapan-denpasar",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Swasta",
    "name": "SMA Kristen Harapan Denpasar",
    "code": "50103175",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Raya Sesetan No. 62, Sesetan, Denpasar Selatan",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50103178-sma-dwijendra-denpasar",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Swasta",
    "name": "SMA Dwijendra Denpasar",
    "code": "50103178",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Kamboja No. 17, Dangin Puri Kangin, Denpasar Utara",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50103170-sma-saraswati-1-denpasar",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Swasta",
    "name": "SMA Saraswati 1 Denpasar",
    "code": "50103170",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Kamboja No. 11A, Dangin Puri Kangin, Denpasar Utara",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50103859-sma-albanna-bali",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Swasta",
    "name": "SMA Albanna Bali",
    "code": "50103859",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Tukad Yeh Ho No. 16, Renon, Denpasar Selatan",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50103174-sma-muhammadiyah-1-denpasar",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Swasta",
    "name": "SMA Muhammadiyah 1 Denpasar",
    "code": "50103174",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Batanta No. 80, Dauh Puri Kauh, Denpasar Barat",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50103868-sma-chis-denpasar",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Swasta",
    "name": "SMA CHIS Denpasar",
    "code": "50103868",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Cut Nyak Dien No. 2, Panjer, Denpasar Selatan",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50103865-sma-dyatmika",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Swasta (SPK)",
    "name": "SMA Dyatmika",
    "code": "50103865",
    "kabupaten": "Kota Denpasar",
    "address": "Jl. Pucuk Bang, Kesiman Kertalangu, Denpasar Timur",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50101695-sman-1-mengwi",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Mengwi",
    "code": "50101695",
    "kabupaten": "Badung",
    "address": "Jl. I Gusti Ngurah Rai, Mengwi, Badung",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50101684-sman-2-mengwi",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 2 Mengwi",
    "code": "50101684",
    "kabupaten": "Badung",
    "address": "Jl. Raya Munggu, Mengwi, Badung",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-70033779-sman-3-mengwi",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 3 Mengwi",
    "code": "70033779",
    "kabupaten": "Badung",
    "address": "Jl. Gatot Kaca, Sembung, Mengwi, Badung",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50101704-sman-1-abiansemal",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Abiansemal",
    "code": "50101704",
    "kabupaten": "Badung",
    "address": "Jl. Majapahit, Blahkiuh, Abiansemal, Badung",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-69990577-sman-2-abiansemal",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 2 Abiansemal",
    "code": "69990577",
    "kabupaten": "Badung",
    "address": "Jl. Denpasar-Abiansemal, Sedang, Abiansemal, Badung",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50101705-sman-1-kuta",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Kuta",
    "code": "50101705",
    "kabupaten": "Badung",
    "address": "Jl. Dewi Saraswati, Seminyak, Kuta, Badung",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50101694-sman-2-kuta",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 2 Kuta",
    "code": "50101694",
    "kabupaten": "Badung",
    "address": "Jl. Pura Dalem Kedonganan, Kuta, Badung",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50101706-sman-1-kuta-selatan",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Kuta Selatan",
    "code": "50101706",
    "kabupaten": "Badung",
    "address": "Jl. Ketut Jetung, Kutuh, Kuta Selatan, Badung",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-69990384-sman-2-kuta-selatan",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 2 Kuta Selatan",
    "code": "69990384",
    "kabupaten": "Badung",
    "address": "Jl. Taman Werdi, Benoa, Kuta Selatan, Badung",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-70033778-sman-3-kuta-selatan",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 3 Kuta Selatan",
    "code": "70033778",
    "kabupaten": "Badung",
    "address": "Jl. Pura Pengulapan, Ungasan, Kuta Selatan, Badung",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50101696-sman-1-kuta-utara",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Kuta Utara",
    "code": "50101696",
    "kabupaten": "Badung",
    "address": "Jl. Made Bulet, Dalung, Kuta Utara, Badung",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-70013200-sman-2-kuta-utara",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 2 Kuta Utara",
    "code": "70013200",
    "kabupaten": "Badung",
    "address": "Jl. Raya Kerobokan, Kerobokan Kaja, Kuta Utara, Badung",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50103610-sman-1-petang",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Petang",
    "code": "50103610",
    "kabupaten": "Badung",
    "address": "Jl. Raya Petang, Petang, Badung",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50101700-sma-katolik-soverdi-tuban",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Swasta",
    "name": "SMA Katolik Soverdi Tuban",
    "code": "50101700",
    "kabupaten": "Badung",
    "address": "Jl. Raya Tuban No. 2, Kuta, Badung",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-69939129-sma-widiatmika-jimbaran",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Swasta",
    "name": "SMA Widiatmika Jimbaran",
    "code": "69939129",
    "kabupaten": "Badung",
    "address": "Jl. Raya Kampus Unud No. 8, Jimbaran, Kuta Selatan, Badung",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50105436-sma-bintang-mandiri-jimbaran",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Swasta",
    "name": "SMA Bintang Mandiri Jimbaran",
    "code": "50105436",
    "kabupaten": "Badung",
    "address": "Jl. Karang Mas No. 1, Jimbaran, Kuta Selatan, Badung",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-69939131-sma-canggu-community-school",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Swasta (SPK)",
    "name": "SMA Canggu Community School",
    "code": "69939131",
    "kabupaten": "Badung",
    "address": "Jl. Subak Sari, Tibubeneng, Kuta Utara, Badung",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-69888805-sma-green-school-bali",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Swasta (SPK)",
    "name": "SMA Green School Bali",
    "code": "69888805",
    "kabupaten": "Badung",
    "address": "Jl. Raya Sibang Kaja, Abiansemal, Badung",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102140-sman-1-gianyar",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Gianyar",
    "code": "50102140",
    "kabupaten": "Gianyar",
    "address": "Jl. Ratna No. 1, Tegal Tugu, Gianyar",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102139-sman-2-gianyar",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 2 Gianyar",
    "code": "50102139",
    "kabupaten": "Gianyar",
    "address": "Jl. Astina Selatan, Gianyar",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102141-sman-1-blahbatuh",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Blahbatuh",
    "code": "50102141",
    "kabupaten": "Gianyar",
    "address": "Jl. Wisnu, Blahbatuh, Gianyar",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102142-sman-1-payangan",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Payangan",
    "code": "50102142",
    "kabupaten": "Gianyar",
    "address": "Jl. Raya Payangan, Kerta, Payangan, Gianyar",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102143-sman-1-sukawati",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Sukawati",
    "code": "50102143",
    "kabupaten": "Gianyar",
    "address": "Jl. Lettu Ngurah Duaji, Sukawati, Gianyar",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102144-sman-2-sukawati",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 2 Sukawati",
    "code": "50102144",
    "kabupaten": "Gianyar",
    "address": "Jl. Taak Gede, Batubulan Candi, Sukawati, Gianyar",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102145-sman-1-tampaksiring",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Tampaksiring",
    "code": "50102145",
    "kabupaten": "Gianyar",
    "address": "Jl. Raya Tampaksiring, Sanding, Tampaksiring, Gianyar",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50103608-sman-1-tegallalang",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Tegallalang",
    "code": "50103608",
    "kabupaten": "Gianyar",
    "address": "Jl. Raya Tegallalang, Tegallalang, Gianyar",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50103609-sman-1-ubud",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Ubud",
    "code": "50103609",
    "kabupaten": "Gianyar",
    "address": "Jl. Suweta, Ubud, Gianyar",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-69786486-sma-bali-hati",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Swasta",
    "name": "SMA Bali Hati",
    "code": "69786486",
    "kabupaten": "Gianyar",
    "address": "Jl. Raya Lodtunduh, Ubud, Gianyar",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102138-sma-pgri-blahbatuh",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Swasta",
    "name": "SMA PGRI Blahbatuh",
    "code": "50102138",
    "kabupaten": "Gianyar",
    "address": "Jl. Raya Blahbatuh, Gianyar",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102434-sman-1-tabanan",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Tabanan",
    "code": "50102434",
    "kabupaten": "Tabanan",
    "address": "Jl. Gunung Agung No. 122, Dajan Peken, Tabanan",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102435-sman-2-tabanan",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 2 Tabanan",
    "code": "50102435",
    "kabupaten": "Tabanan",
    "address": "Jl. Mawar No. 1, Delod Peken, Tabanan",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102436-sman-1-baturiti",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Baturiti",
    "code": "50102436",
    "kabupaten": "Tabanan",
    "address": "Jl. Raya Baturiti, Perean, Baturiti, Tabanan",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102437-sman-1-kediri",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Kediri",
    "code": "50102437",
    "kabupaten": "Tabanan",
    "address": "Jl. Bypass Ngurah Rai, Nyitdah, Kediri, Tabanan",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102438-sman-1-kerambitan",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Kerambitan",
    "code": "50102438",
    "kabupaten": "Tabanan",
    "address": "Jl. Melati No. 10, Kukuh, Kerambitan, Tabanan",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102439-sman-1-marga",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Marga",
    "code": "50102439",
    "kabupaten": "Tabanan",
    "address": "Jl. Wisnu Marga, Marga Dajan Puri, Marga, Tabanan",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102440-sman-1-penebel",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Penebel",
    "code": "50102440",
    "kabupaten": "Tabanan",
    "address": "Jl. Raya Penebel, Pitra, Penebel, Tabanan",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102441-sman-1-pupuan",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Pupuan",
    "code": "50102441",
    "kabupaten": "Tabanan",
    "address": "Jl. Gajah Mada No. 18, Pupuan, Tabanan",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102442-sman-1-selemadeg",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Selemadeg",
    "code": "50102442",
    "kabupaten": "Tabanan",
    "address": "Jl. Raya Denpasar-Gilimanuk, Bajera, Selemadeg, Tabanan",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102445-sma-surya-wisata-tabanan",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Swasta",
    "name": "SMA Surya Wisata Tabanan",
    "code": "50102445",
    "kabupaten": "Tabanan",
    "address": "Jl. Wagimin No. 5, Kediri, Tabanan",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50101322-sman-1-singaraja",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Singaraja",
    "code": "50101322",
    "kabupaten": "Buleleng",
    "address": "Jl. Pramuka No. 4, Singaraja, Buleleng",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50101323-sman-2-singaraja",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 2 Singaraja",
    "code": "50101323",
    "kabupaten": "Buleleng",
    "address": "Jl. Srikandi No. 6, Baktiseraga, Singaraja, Buleleng",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50101324-sman-3-singaraja",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 3 Singaraja",
    "code": "50101324",
    "kabupaten": "Buleleng",
    "address": "Jl. Natuna, Penarukan, Singaraja, Buleleng",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50101325-sman-4-singaraja",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 4 Singaraja",
    "code": "50101325",
    "kabupaten": "Buleleng",
    "address": "Jl. Melati No. 8, Kaliuntu, Singaraja, Buleleng",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50105310-sman-bali-mandara",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN Bali Mandara",
    "code": "50105310",
    "kabupaten": "Buleleng",
    "address": "Jl. Raya Air Sanih, Kubutambahan, Buleleng",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50101326-sman-1-banjar",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Banjar",
    "code": "50101326",
    "kabupaten": "Buleleng",
    "address": "Jl. Raya Banjar, Dencarik, Banjar, Buleleng",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50105311-sman-2-banjar",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 2 Banjar",
    "code": "50105311",
    "kabupaten": "Buleleng",
    "address": "Desa Banyuatis, Banjar, Buleleng",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50101327-sman-1-busungbiu",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Busungbiu",
    "code": "50101327",
    "kabupaten": "Buleleng",
    "address": "Jl. Gajah Mada, Busungbiu, Buleleng",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50105312-sman-2-busungbiu",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 2 Busungbiu",
    "code": "50105312",
    "kabupaten": "Buleleng",
    "address": "Desa Pelapuan, Busungbiu, Buleleng",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50101328-sman-1-gerokgak",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Gerokgak",
    "code": "50101328",
    "kabupaten": "Buleleng",
    "address": "Jl. Singaraja-Gilimanuk, Sanggalangit, Gerokgak, Buleleng",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50105313-sman-2-gerokgak",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 2 Gerokgak",
    "code": "50105313",
    "kabupaten": "Buleleng",
    "address": "Desa Pejarakan, Gerokgak, Buleleng",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50101329-sman-1-kubutambahan",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Kubutambahan",
    "code": "50101329",
    "kabupaten": "Buleleng",
    "address": "Jl. Singaraja-Amlapura, Kubutambahan, Buleleng",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50101330-sman-1-sawan",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Sawan",
    "code": "50101330",
    "kabupaten": "Buleleng",
    "address": "Jl. Raya Sangsit, Menyali, Sawan, Buleleng",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50101331-sman-1-seririt",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Seririt",
    "code": "50101331",
    "kabupaten": "Buleleng",
    "address": "Jl. Sudirman No. 12, Seririt, Buleleng",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50101332-sman-1-sukasada",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Sukasada",
    "code": "50101332",
    "kabupaten": "Buleleng",
    "address": "Jl. Jelantik Gingsir No. 10, Sukasada, Buleleng",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50101333-sman-1-tejakula",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Tejakula",
    "code": "50101333",
    "kabupaten": "Buleleng",
    "address": "Jl. Singaraja-Amlapura, Tejakula, Buleleng",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50101335-sma-laboratorium-undiksha-singar",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Swasta",
    "name": "SMA Laboratorium Undiksha Singaraja",
    "code": "50101335",
    "kabupaten": "Buleleng",
    "address": "Jl. Jatayu No. 4, Kaliuntu, Singaraja, Buleleng",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-69988812-sma-taruna-mandara",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Swasta",
    "name": "SMA Taruna Mandara",
    "code": "69988812",
    "kabupaten": "Buleleng",
    "address": "Desa Kaliasem, Lovina, Buleleng",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50101336-sma-wira-bhakti-singaraja",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Swasta",
    "name": "SMA Wira Bhakti Singaraja",
    "code": "50101336",
    "kabupaten": "Buleleng",
    "address": "Jl. Bakung, Sukasada, Buleleng",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102700-sman-1-negara",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Negara",
    "code": "50102700",
    "kabupaten": "Jembrana",
    "address": "Jl. Ngurah Rai No. 155, Dauhwaru, Negara, Jembrana",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102701-sman-2-negara",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 2 Negara",
    "code": "50102701",
    "kabupaten": "Jembrana",
    "address": "Jl. Sahadewa, Dangintukadaya, Jembrana",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102702-sman-3-negara",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 3 Negara",
    "code": "50102702",
    "kabupaten": "Jembrana",
    "address": "Jl. Gempol, Banjar Tengah, Negara, Jembrana",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102703-sman-1-melaya",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Melaya",
    "code": "50102703",
    "kabupaten": "Jembrana",
    "address": "Jl. Denpasar-Gilimanuk, Melaya, Jembrana",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102704-sman-1-mendoyo",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Mendoyo",
    "code": "50102704",
    "kabupaten": "Jembrana",
    "address": "Jl. Denpasar-Gilimanuk, Pergung, Mendoyo, Jembrana",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50105320-sman-2-mendoyo",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 2 Mendoyo",
    "code": "50105320",
    "kabupaten": "Jembrana",
    "address": "Desa Yehembang, Mendoyo, Jembrana",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102705-sman-1-pekutatan",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Pekutatan",
    "code": "50102705",
    "kabupaten": "Jembrana",
    "address": "Jl. Denpasar-Gilimanuk, Pekutatan, Jembrana",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50105321-man-1-jembrana",
    "category": "sma",
    "bentuk": "MAN",
    "status": "Negeri",
    "name": "MAN 1 Jembrana",
    "code": "50105321",
    "kabupaten": "Jembrana",
    "address": "Jl. Ngurah Rai, Dauhwaru, Negara, Jembrana",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102706-sma-firdaus-negara",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Swasta",
    "name": "SMA Firdaus Negara",
    "code": "50102706",
    "kabupaten": "Jembrana",
    "address": "Jl. Salak No. 10, Loloan Barat, Negara, Jembrana",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102707-sma-diponegoro-negara",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Swasta",
    "name": "SMA Diponegoro Negara",
    "code": "50102707",
    "kabupaten": "Jembrana",
    "address": "Jl. Semangka No. 8, Loloan Barat, Negara, Jembrana",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102360-sman-1-amlapura",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Amlapura",
    "code": "50102360",
    "kabupaten": "Karangasem",
    "address": "Jl. Ngurah Rai No. 34, Karangasem",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102361-sman-2-amlapura",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 2 Amlapura",
    "code": "50102361",
    "kabupaten": "Karangasem",
    "address": "Jl. Untung Surapati, Padangkerta, Karangasem",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102362-sman-3-amlapura",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 3 Amlapura",
    "code": "50102362",
    "kabupaten": "Karangasem",
    "address": "Jl. Veteran No. 1, Padangkerta, Karangasem",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102363-sman-1-abang",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Abang",
    "code": "50102363",
    "kabupaten": "Karangasem",
    "address": "Jl. Raya Abang-Amlapura, Abang, Karangasem",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102364-sman-1-bebandem",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Bebandem",
    "code": "50102364",
    "kabupaten": "Karangasem",
    "address": "Jl. Raya Bebandem, Bebandem, Karangasem",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102365-sman-1-kubu",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Kubu",
    "code": "50102365",
    "kabupaten": "Karangasem",
    "address": "Jl. Singaraja-Amlapura, Tianyar Barat, Kubu, Karangasem",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102366-sman-1-manggis",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Manggis",
    "code": "50102366",
    "kabupaten": "Karangasem",
    "address": "Jl. Raya Ulakan, Manggis, Karangasem",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102367-sman-1-rendang",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Rendang",
    "code": "50102367",
    "kabupaten": "Karangasem",
    "address": "Jl. Raya Besakih, Rendang, Karangasem",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102368-sman-1-selat",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Selat",
    "code": "50102368",
    "kabupaten": "Karangasem",
    "address": "Jl. Raya Selat, Duda, Selat, Karangasem",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102369-sman-1-sidemen",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Sidemen",
    "code": "50102369",
    "kabupaten": "Karangasem",
    "address": "Jl. Raya Klungkung-Sidemen, Telaga Tawang, Sidemen, Karangasem",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102370-man-karangasem",
    "category": "sma",
    "bentuk": "MAN",
    "status": "Negeri",
    "name": "MAN Karangasem",
    "code": "50102370",
    "kabupaten": "Karangasem",
    "address": "Jl. Jenderal Sudirman No. 20, Subagan, Karangasem",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102372-sma-pariwisata-saraswati-selat",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Swasta",
    "name": "SMA Pariwisata Saraswati Selat",
    "code": "50102372",
    "kabupaten": "Karangasem",
    "address": "Jl. Raya Selat, Karangasem",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102268-sman-1-semarapura",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Semarapura",
    "code": "50102268",
    "kabupaten": "Klungkung",
    "address": "Jl. Flamboyan No. 63, Semarapura Kelod, Klungkung",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102269-sman-2-semarapura",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 2 Semarapura",
    "code": "50102269",
    "kabupaten": "Klungkung",
    "address": "Jl. Dewi Sartika No. 1, Semarapura Tengah, Klungkung",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102270-sman-1-banjarangkan",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Banjarangkan",
    "code": "50102270",
    "kabupaten": "Klungkung",
    "address": "Jl. Raya Banjarangkan, Desa Tusan, Banjarangkan, Klungkung",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102271-sman-1-dawan",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Dawan",
    "code": "50102271",
    "kabupaten": "Klungkung",
    "address": "Jl. Raya Gunaksa, Dawan, Klungkung",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102272-sman-1-nusa-penida",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Nusa Penida",
    "code": "50102272",
    "kabupaten": "Klungkung",
    "address": "Jl. Pendidikan, Desa Ped, Nusa Penida, Klungkung",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102273-sman-satu-atap-klumpu",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN Satu Atap Klumpu",
    "code": "50102273",
    "kabupaten": "Klungkung",
    "address": "Banjar Tiagan, Desa Klumpu, Nusa Penida, Klungkung",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102274-sman-satu-atap-lembongan",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN Satu Atap Lembongan",
    "code": "50102274",
    "kabupaten": "Klungkung",
    "address": "Desa Lembongan, Nusa Penida, Klungkung",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102275-sman-satu-atap-nusa-penida-tangl",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN Satu Atap Nusa Penida (Tanglad)",
    "code": "50102275",
    "kabupaten": "Klungkung",
    "address": "Desa Tanglad, Nusa Penida, Klungkung",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102278-sma-pariwisata-saraswati-klungku",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Swasta",
    "name": "SMA Pariwisata Saraswati Klungkung",
    "code": "50102278",
    "kabupaten": "Klungkung",
    "address": "Jl. Puputan No. 10, Semarapura, Klungkung",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102568-sman-1-bangli",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Bangli",
    "code": "50102568",
    "kabupaten": "Bangli",
    "address": "Jl. Brigjen Ngurah Rai No. 49, Kawan, Bangli",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102575-sman-2-bangli",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 2 Bangli",
    "code": "50102575",
    "kabupaten": "Bangli",
    "address": "Jl. Nusantara, Kubu, Bangli",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102578-sman-1-kintamani",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Kintamani",
    "code": "50102578",
    "kabupaten": "Bangli",
    "address": "Jl. Yudistira, Bayunggede, Kintamani, Bangli",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102577-sman-1-susut",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Susut",
    "code": "50102577",
    "kabupaten": "Bangli",
    "address": "Jl. Putra Yudha, Sulahan, Susut, Bangli",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102576-sman-1-tembuku",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Negeri",
    "name": "SMAN 1 Tembuku",
    "code": "50102576",
    "kabupaten": "Bangli",
    "address": "Desa Undisan, Tembuku, Bangli",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  },
  {
    "id": "sma-50102580-smas-gurukula-bangli",
    "category": "sma",
    "bentuk": "SMA",
    "status": "Swasta",
    "name": "SMAS Gurukula Bangli",
    "code": "50102580",
    "kabupaten": "Bangli",
    "address": "Jl. Nusantara, Kubu, Bangli",
    "programs": [
      "Jalur Akademik Persiapan S1/D4 (Kurikulum Merdeka)"
    ],
    "matchedFields": []
  }
];

export function getBaliDirectoryStats() {
  const perguruanTinggi = BALI_EDUCATION_DIRECTORY.filter((e) => e.category === "perguruan-tinggi").length;
  const smk = BALI_EDUCATION_DIRECTORY.filter((e) => e.category === "smk").length;
  const sma = BALI_EDUCATION_DIRECTORY.filter((e) => e.category === "sma").length;
  return {
    perguruanTinggi,
    smk,
    sma,
    total: BALI_EDUCATION_DIRECTORY.length,
  };
}

export function getBaliEntitiesForField(
  fieldId: string,
  origin: string | GeoPoint | UserLocationOrigin = "Kota Denpasar"
): {
  perguruanTinggi: EnrichedBaliEducationEntity[];
  smk: EnrichedBaliEducationEntity[];
  sma: EnrichedBaliEducationEntity[];
} {
  const enrich = (item: BaliEducationEntity): EnrichedBaliEducationEntity => ({
    ...item,
    estimatedDistanceKm: estimateDistanceFromOrigin(
      origin,
      item.kabupaten,
      item.address
    ),
    mapsUrl: buildGoogleMapsDirectionsUrl(item.name, item.address, origin),
  });

  const byDistThenName = (a: EnrichedBaliEducationEntity, b: EnrichedBaliEducationEntity) =>
    a.estimatedDistanceKm - b.estimatedDistanceKm || a.name.localeCompare(b.name, "id");

  return {
    perguruanTinggi: BALI_EDUCATION_DIRECTORY
      .filter((e) => e.category === "perguruan-tinggi" && e.matchedFields.includes(fieldId))
      .map(enrich)
      .sort(byDistThenName),
    smk: BALI_EDUCATION_DIRECTORY
      .filter((e) => e.category === "smk" && e.matchedFields.includes(fieldId))
      .map(enrich)
      .sort(byDistThenName),
    sma: BALI_EDUCATION_DIRECTORY
      .filter((e) => e.category === "sma")
      .map(enrich)
      .sort(byDistThenName),
  };
}
