export type FieldGroup = "teknologi" | "manusia" | "alam" | "usaha";
export type EducationLevel = "SMK" | "D3" | "D4" | "S1";

export interface SourceRecord {
  publisher: string;
  url: string;
  checkDate: string;
  status: "Terverifikasi" | "Dalam Peninjauan";
  notes?: string;
}

export interface InstitutionProgram {
  institutionId: string;
  institutionName: string;
  programName: string;
  level: EducationLevel;
  accreditation: string;
  district: string;
  kabupaten: string;
  tuitionFeeText: string;
  facilitiesText: string;
  source: SourceRecord;
}

export interface BaliKabupatenCoord {
  name: string;
  lat: number;
  lng: number;
}

export interface ProgramField {
  id: string;
  name: string;
  group: FieldGroup;
  categoryName: string;
  shortDesc: string;
  vibeTagline: string;
  whatYouLearn: {
    smk: string[];
    vokasi: string[];
    akademik: string[];
  };
  realProblemsSolvedInBali: string[];
  coreCompetencies: string[];
  readinessBridgeTips: string[];
  careerPaths: string[];
  localEntrepreneurshipIdeas: string[];
  sourceRecords: SourceRecord[];
}

// Koordinat perkiraan pusat tiap kabupaten/kota di Bali untuk estimasi jarak garis lurus
export const BALI_KABUPATEN_COORDS: Record<string, BaliKabupatenCoord> = {
  "Kota Denpasar": { name: "Kota Denpasar", lat: -8.6705, lng: 115.2126 },
  "Badung": { name: "Badung", lat: -8.5833, lng: 115.1833 },
  "Gianyar": { name: "Gianyar", lat: -8.5444, lng: 115.3289 },
  "Tabanan": { name: "Tabanan", lat: -8.5411, lng: 115.1252 },
  "Buleleng": { name: "Buleleng", lat: -8.112, lng: 115.0882 },
  "Klungkung": { name: "Klungkung", lat: -8.5367, lng: 115.4039 },
  "Bangli": { name: "Bangli", lat: -8.4542, lng: 115.3553 },
  "Karangasem": { name: "Karangasem", lat: -8.4489, lng: 115.6128 },
  "Jembrana": { name: "Jembrana", lat: -8.3585, lng: 114.6289 },
};

export function estimateDistanceKm(fromKabupaten: string, toKabupaten: string): number {
  const from = BALI_KABUPATEN_COORDS[fromKabupaten];
  const to = BALI_KABUPATEN_COORDS[toKabupaten];
  if (!from || !to) return 25; // default estimasi moderat jika tidak spesifik
  if (from.name === to.name) return 6; // dalam kabupaten yang sama

  // Haversine formula sederhana
  const rad = Math.PI / 180;
  const dLat = (to.lat - from.lat) * rad;
  const dLng = (to.lng - from.lng) * rad;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(from.lat * rad) * Math.cos(to.lat * rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const km = 6371 * c;
  return Math.round(km * 10) / 10;
}

export const PROGRAM_FIELDS: ProgramField[] = [
  {
    id: "informatika",
    name: "Informatika & Rekayasa Perangkat Lunak",
    group: "teknologi",
    categoryName: "Teknologi & Rancang Visual",
    shortDesc: "Pengembangan software, aplikasi web, sistem cerdas, dan rekayasa data untuk layanan publik dan bisnis lokal.",
    vibeTagline: "Cocok untuk yang menyukai logika algoritma, ngulik coding, dan memecahkan masalah praktis berbasis teknologi.",
    whatYouLearn: {
      smk: ["Dasar sintaks Python/JS", "Pembuatan website responsif", "Struktur database relasional", "Troubleshooting jaringan dasar"],
      vokasi: ["Pengembangan fullstack web/mobile", "Cloud computing & containerization", "Testing & QA perangkat lunak", "Proyek industri capstone"],
      akademik: ["Analisis kompleksitas algoritma", "Teori komputasi & automasi", "Fondasi kecerdasan buatan & machine learning", "Riset sistem informasi"],
    },
    realProblemsSolvedInBali: [
      "Digitalisasi sistem antrean dan pelaporan layanan desa adat/banjar tanpa ketergantungan kertas.",
      "Sistem pemantauan volume sampah sirkular tingkat banjar dan TPS3R berbasis web terintegrasi.",
      "Platform e-commerce katalog produk perajin ukir dan tenun lokal Bali dengan integrasi pembayaran aman.",
    ],
    coreCompetencies: ["Logika Algoritma", "TypeScript/Python", "Desain Basis Data", "Git Version Control", "Komunikasi Teknis"],
    readinessBridgeTips: [
      "Pelajari dasar-dasar sintaks logika gratis lewat platform terbuka seperti freeCodeCamp atau CS50.",
      "Buat satu proyek portofolio mini seperti aplikasi catatan belanja atau web profil sederhana.",
    ],
    careerPaths: ["Junior/Senior Software Engineer", "Fullstack Web Developer", "AI Engineer Terapan", "Database Administrator"],
    localEntrepreneurshipIdeas: [
      "Agensi solusi digital mikro untuk UMKM kuliner dan kerajinan lokal di Bali.",
      "Layanan software-as-a-service (SaaS) manajemen pembukuan dan kasir banjar/koperasi.",
    ],
    sourceRecords: [
      { publisher: "PDDIKTI Kemendikbudristek", url: "https://pddikti.kemdiktisaintek.go.id", checkDate: "2026-11-02", status: "Terverifikasi" },
      { publisher: "BAN-PT / LAM INFOKOM", url: "https://www.banpt.or.id", checkDate: "2026-11-02", status: "Terverifikasi" },
    ],
  },
  {
    id: "dkv",
    name: "Desain Komunikasi Visual & Multimedia",
    group: "teknologi",
    categoryName: "Teknologi & Rancang Visual",
    shortDesc: "Kreasi grafis visual, antarmuka UI/UX, ilustrasi digital, dan konten animasi kreatif berakar seni Bali.",
    vibeTagline: "Pilihan ideal untuk kreator visual, perancang estetika produk, dan pegiat media digital masa kini.",
    whatYouLearn: {
      smk: ["Prinsip nirmana dan tata letak", "Penguasaan software vektor dan raster", "Fotografi produk dasar", "Motion graphics 2D"],
      vokasi: ["UI/UX design system dan prototyping", "Branding identitas perusahaan", "Video storytelling untuk promosi", "Produksi aset gim"],
      akademik: ["Semiotika visual dan kritik seni", "Metodologi riset desain", "Sosiologi media visual", "Kurasi pameran visual"],
    },
    realProblemsSolvedInBali: [
      "Rebranding kemasan produk pangan lokal (kopi Kintamani, arak Bali legal, garam Kusamba) agar tembus pasar ekspor.",
      "Perancangan antarmuka aplikasi publik desa wisata agar mudah digunakan oleh wisatawan mancanegara dan lokal.",
      "Kampanye visual edukasi pelestarian lingkungan pantai dan sungai di Bali melalui media animasi pendek.",
    ],
    coreCompetencies: ["Figma & Design Systems", "Prinsip Tipografi", "Ilustrasi Digital", "Storyboarding", "Riset Pengguna"],
    readinessBridgeTips: [
      "Kumpulkan 3 karya visual terbaikmu dalam bentuk portofolio daring di Notion atau Behance.",
      "Latih kemampuan kritik desain dengan menganalisis aplikasi populer yang sering kamu pakai.",
    ],
    careerPaths: ["UI/UX Product Designer", "Brand Identity Specialist", "Digital Illustrator", "Motion Graphic Artist"],
    localEntrepreneurshipIdeas: [
      "Studio desain independen yang mengkhususkan diri pada kemasan produk artisan Bali.",
      "Layanan kurasi konten kreatif dan visual untuk resort dan festival seni di Bali.",
    ],
    sourceRecords: [
      { publisher: "PDDIKTI Kemendikbudristek", url: "https://pddikti.kemdiktisaintek.go.id", checkDate: "2026-11-02", status: "Terverifikasi" },
      { publisher: "BAN-PT", url: "https://www.banpt.or.id", checkDate: "2026-11-02", status: "Terverifikasi" },
    ],
  },
  {
    id: "arsitektur",
    name: "Arsitektur & Desain Ruang Berkelanjutan",
    group: "teknologi",
    categoryName: "Teknologi & Rancang Visual",
    shortDesc: "Penyelarasan kearifan tata ruang Bali (Asta Kosala Kosali) dengan rekayasa bangunan tropis hemat energi.",
    vibeTagline: "Tepat untuk kamu yang tertarik menggabungkan estetika bangunan tradisional Bali dengan teknologi CAD hijau.",
    whatYouLearn: {
      smk: ["Gambar teknik dan proyeksi ortogonal", "Pemodelan CAD 2D/3D", "Estimasi biaya material bangunan", "Pengawasan tapak sederhana"],
      vokasi: ["Building Information Modeling (BIM)", "Detail rekayasa konstruksi ramah gempa", "Manajemen proyek konstruksi", "Spesifikasi material hijau"],
      akademik: ["Filosofi Asta Kosala Kosali dan Tri Hita Karana", "Termal dan pencahayaan alami tropis", "Perencanaan tata ruang wilayah pulau", "Kajian sejarah arsitektur nusantara"],
    },
    realProblemsSolvedInBali: [
      "Pencegahan alih fungsi lahan sawah produktif melalui panduan zonasi ruang hijau berbasis kearifan lokal.",
      "Perancangan homestay dan villa mikro hemat energi yang memanfaatkan sirkulasi angin alami tanpa boros pendingin ruangan.",
      "Pemugaran dan pelestarian struktur wantilan serta bale banjar dengan teknik rekayasa tahan gempa.",
    ],
    coreCompetencies: ["CAD & BIM Modeling", "Sketsa Arsitektur", "Analisis Tapak", "Estimasi Biaya Material", "Etika Tata Ruang"],
    readinessBridgeTips: [
      "Latih kemampuan menggambar sketsa ruang bebas dan pelajari pembacaan skala denah rumah.",
      "Amati ornamen arsitektur tradisional di sekitar pura atau wantilan banjarmu.",
    ],
    careerPaths: ["Junior Architect / Draftsperson", "BIM Specialist", "Konsultan Bangunan Hijau", "Site Supervisor"],
    localEntrepreneurshipIdeas: [
      "Biro konsultasi desain homestay ramah lingkungan untuk pengelola desa wisata Bali.",
      "Jasa visualisasi 3D arsitektur dan interior untuk proyek renovasi rumah adat modern.",
    ],
    sourceRecords: [
      { publisher: "PDDIKTI Kemendikbudristek", url: "https://pddikti.kemdiktisaintek.go.id", checkDate: "2026-11-02", status: "Terverifikasi" },
      { publisher: "BAN-PT", url: "https://www.banpt.or.id", checkDate: "2026-11-02", status: "Terverifikasi" },
    ],
  },
  {
    id: "kesehatan",
    name: "Kesehatan Komunitas & Keperawatan",
    group: "manusia",
    categoryName: "Manusia, Seni & Budaya",
    shortDesc: "Pelayanan keperawatan terampil, promosi kesehatan preventif, dan pendukung pariwisata medis di Bali.",
    vibeTagline: "Jalur bagi kamu yang memiliki empati tinggi, ketelitian kerja, dan kepedulian tulus terhadap kesehatan sesama.",
    whatYouLearn: {
      smk: ["Dasar anatomi dan fisiologi manusia", "Tata laksana pertolongan pertama (P3K)", "Etika asisten tenaga kesehatan", "Pencatatan rekam medis dasar"],
      vokasi: ["Keterampilan asuhan keperawatan klinis", "Prosedur sterilisasi dan farmakologi dasar", "Manajemen bangsal dan ruang rawat", "Kedaruratan medis dan bencana"],
      akademik: ["Epidemiologi penyakit tropis", "Metodologi riset kesehatan masyarakat", "Manajemen mutu rumah sakit rujukan", "Etika bioetika kedokteran"],
    },
    realProblemsSolvedInBali: [
      "Peningkatan jangkauan skrining kesehatan lansia di banjar pedesaan yang jauh dari fasilitas RS rujukan.",
      "Penguatan standar higienitas dan respons medis darurat di destinasi wisata petualangan dan pesisir Bali.",
      "Integrasi layanan perawatan holistik berbasis herbal obat tradisional Bali (Usadha) yang terstandarisasi ilmiah.",
    ],
    coreCompetencies: ["Asuhan Keperawatan", "Komunikasi Terapeutik", "Dasar Farmakologi", "Penanganan Gawat Darurat", "Ketelitian Prosedural"],
    readinessBridgeTips: [
      "Perkuat pemahaman dasar biologi sistem tubuh manusia dan latih ketenangan dalam situasi darurat.",
      "Ikuti kegiatan Palang Merah Remaja (PMR) atau pelatihan pertolongan pertama di sekolah.",
    ],
    careerPaths: ["Perawat Rumah Sakit / Puskesmas", "Tenaga Medis Wisata (Medical Tourism)", "Fasilitator Kesehatan Komunitas", "Konsultan Ergonomi"],
    localEntrepreneurshipIdeas: [
      "Layanan home-care profesional untuk lansia ekspatriat dan warga senior di kawasan Sanur/Ubud.",
      "Pusat edukasi dan pelatihan pertolongan pertama bagi staf hotel dan pemandu wisata di Bali.",
    ],
    sourceRecords: [
      { publisher: "PDDIKTI Kemendikbudristek", url: "https://pddikti.kemdiktisaintek.go.id", checkDate: "2026-11-02", status: "Terverifikasi" },
      { publisher: "LAM-PTKes", url: "https://lamptkes.org", checkDate: "2026-11-02", status: "Terverifikasi" },
    ],
  },
  {
    id: "pendidikan",
    name: "Pendidikan & Bimbingan Konseling",
    group: "manusia",
    categoryName: "Manusia, Seni & Budaya",
    shortDesc: "Pengembangan metode belajar kreatif, bimbingan psikososial remaja, dan pedagogi digital berkarakter lokal.",
    vibeTagline: "Sangat pas bagi pendengar yang baik, suka mendampingi orang lain belajar, dan tertarik pada psikologi perkembangan.",
    whatYouLearn: {
      smk: ["Pendidikan sebaya dan dinamika kelompok", "Administrasi kearsipan bimbingan", "Komunikasi interpersonal remaja"],
      vokasi: ["Pengembangan media instruksional digital", "Teknik fasilitasi pelatihan vokasi", "Asesmen kompetensi kerja praktis"],
      akademik: ["Psikologi pendidikan dan perkembangan anak", "Teori bimbingan konseling individual dan kelompok", "Evaluasi kurikulum merdeka", "Metodologi penelitian tindakan kelas"],
    },
    realProblemsSolvedInBali: [
      "Pendampingan kesehatan mental dan mitigasi stres akademik pada siswa SMP/SMA yang bimbang menentukan arah karier.",
      "Pengembangan materi ajar muatan lokal bahasa dan aksara Bali interaktif yang menarik minat generasi digital.",
      "Kolaborasi guru BK dan orang tua dalam mendampingi potensi anak tanpa tekanan memaksakan jurusan tertentu.",
    ],
    coreCompetencies: ["Keterampilan Mendengar Aktif", "Konseling Individual", "Desain Pembelajaran Interaktif", "Fasilitasi Remaja", "Penyusunan Asesmen"],
    readinessBridgeTips: [
      "Latih kemampuan menjadi pendengar yang tidak mudah menghakimi saat temanmu bercerita tentang masalah belajarnya.",
      "Coba buat ringkasan materi sekolah yang mudah dipahami lalu bagikan kepada adik kelas.",
    ],
    careerPaths: ["Guru BK Sekolah", "Konselor Remaja & Karier", "Instructional Designer", "Fasilitator Pelatihan Korporat"],
    localEntrepreneurshipIdeas: [
      "Layanan konsultasi pemilihan peminatan mandiri dan bimbingan belajar terpadu untuk siswa di Bali.",
      "Studio pembuat konten edukasi dan lembar kerja kreatif untuk anak usia dini berbasis kebudayaan Bali.",
    ],
    sourceRecords: [
      { publisher: "PDDIKTI Kemendikbudristek", url: "https://pddikti.kemdiktisaintek.go.id", checkDate: "2026-11-02", status: "Terverifikasi" },
      { publisher: "BAN-PT", url: "https://www.banpt.or.id", checkDate: "2026-11-02", status: "Terverifikasi" },
    ],
  },
  {
    id: "budaya",
    name: "Seni Karawitan, Tari & Budaya Bali",
    group: "manusia",
    categoryName: "Manusia, Seni & Budaya",
    shortDesc: "Pelestarian dan inovasi seni gamelan, komposisi tabuh, koreografi tari, dan kurasi pementasan adat kelas dunia.",
    vibeTagline: "Wadah berekspresi bagi generasi muda yang bangga merawat akar tradisi Bali sekaligus membawanya ke festival global.",
    whatYouLearn: {
      smk: ["Teknik dasar tabuh kendang, ugal, dan gong", "Penguasaan ragam gerak tari Bali dasar", "Perawatan instrumen gamelan", "Tata rias dan busana adat pementasan"],
      vokasi: ["Manajemen produksi seni pertunjukan", "Teknik perekaman audio akustik gamelan", "Kurasi festival seni komunitas", "Kolaborasi musik etnik kontemporer"],
      akademik: ["Etnomusikologi dan sosiologi seni Bali", "Filosofi estetika dan sastra lontar", "Kritik seni pertunjukan", "Dokumentasi arsip seni langka"],
    },
    realProblemsSolvedInBali: [
      "Digitalisasi notasi lontar dan partitur tabuh gamelan kuno agar tidak punah tertelan zaman.",
      "Peningkatan kesejahteraan seniman tradisi melalui tata kelola manajemen hak cipta dan festival profesional.",
      "Pemberdayaan sekaa teruna-teruni desa dalam memproduksi pementasan seni berkualitas tinggi untuk kegiatan ngayah maupun pariwisata.",
    ],
    coreCompetencies: ["Penguasaan Karawitan/Tari", "Koreografi & Komposisi", "Manajemen Acara Seni", "Dokumentasi Audio/Visual", "Pengetahuan Adat"],
    readinessBridgeTips: [
      "Aktif terlibat dalam sekaa gong atau sekaa tari di banjar atau ekstrakurikuler seni sekolah.",
      "Tonton rekaman pementasan Pesta Kesenian Bali (PKB) dan amati struktur dinamika tabuh atau tariannya.",
    ],
    careerPaths: ["Seniman Pertunjukan Profesional", "Koreografer / Komposer Karawitan", "Kurator Festival Budaya", "Guru Seni Budaya"],
    localEntrepreneurshipIdeas: [
      "Event organizer kurasi pementasan adat dan seni budaya Bali untuk perhelatan MICE dan pernikahan internasional.",
      "Studio rekaman dan distribusi musik etnik gamelan modern untuk pasar musik meditasi dan relaksasi global.",
    ],
    sourceRecords: [
      { publisher: "PDDIKTI Kemendikbudristek", url: "https://pddikti.kemdiktisaintek.go.id", checkDate: "2026-11-02", status: "Terverifikasi" },
      { publisher: "BAN-PT", url: "https://www.banpt.or.id", checkDate: "2026-11-02", status: "Terverifikasi" },
    ],
  },
  {
    id: "pertanian",
    name: "Pertanian Organik & Agroteknologi Subak",
    group: "alam",
    categoryName: "Alam, Agrikultur & Laut",
    shortDesc: "Inovasi budidaya tanaman pangan dan hortikultura modern yang memperkuat ketahanan sistem irigasi Subak Bali.",
    vibeTagline: "Tepat untuk calon inovator hijau yang ingin melihat sawah dan kebun Bali menjadi sektor modern bernilai ekonomi tinggi.",
    whatYouLearn: {
      smk: ["Teknik perbanyakan tanaman dan persemaian", "Pembuatan kompos dan pestisida nabati", "Pengoperasian alat mesin pertanian modern", "Panen dan sortasi buah sayur"],
      vokasi: ["Sistem hidroponik dan greenhouse presisi", "Manajemen agribisnis dan rantai dingin pangan", "Sertifikasi organik standar nasional", "Teknologi pengolahan pascapanen"],
      akademik: ["Fisiologi tumbuhan dan bioteknologi tanah", "Ekologi lanskap dan kelembagaan Subak", "Analisis kebijakan ketahanan pangan pulau", "Riset pemuliaan varietas padi lokal"],
    },
    realProblemsSolvedInBali: [
      "Pencegahan krisis regenerasi petani di Bali dengan mengenalkan teknologi greenhouse otomatis dan smart farming.",
      "Penyediaan pasokan sayur dan buah organik berkualitas tinggi secara konsisten untuk rantai pasok hotel dan restoran mewah.",
      "Penyelamatan debit air dan tanah subur di kawasan hulu Bali dari pencemaran pupuk kimia berlebih.",
    ],
    coreCompetencies: ["Agroteknologi Presisi", "Manajemen Hara Tanah", "Kultur Hidroponik", "Rantai Pasok Agribisnis", "Kelembagaan Subak"],
    readinessBridgeTips: [
      "Coba lakukan eksperimen menanam tanaman sayur atau cabai organik di pekarangan rumah menggunakan kompos buatan sendiri.",
      "Kunjungi pekaseh atau pengurus subak di daerahmu untuk memahami cara pembagian air irigasi yang adil.",
    ],
    careerPaths: ["Manajer Perkebunan Modern / Greenhouse", "Konsultan Pertanian Organik", "Agronomist Hotel Supply Chain", "Peneliti Tanaman Pangan"],
    localEntrepreneurshipIdeas: [
      "Usaha greenhouse modern penyuplai selada, tomat ceri, dan microgreens ke restoran fine-dining di Ubud dan Seminyak.",
      "Penyedia pupuk organik cair dan pestisida hayati terstandarisasi untuk komunitas kebun urban Bali.",
    ],
    sourceRecords: [
      { publisher: "PDDIKTI Kemendikbudristek", url: "https://pddikti.kemdiktisaintek.go.id", checkDate: "2026-11-02", status: "Terverifikasi" },
      { publisher: "BAN-PT", url: "https://www.banpt.or.id", checkDate: "2026-11-02", status: "Terverifikasi" },
    ],
  },
  {
    id: "lingkungan",
    name: "Ilmu Kelautan & Pengelolaan Lingkungan",
    group: "alam",
    categoryName: "Alam, Agrikultur & Laut",
    shortDesc: "Konservasi terumbu karang pesisir, pengelolaan limbah sirkular, dan mitigasi perubahan iklim di pulau tropis Bali.",
    vibeTagline: "Pilihan utama bagi penyelam, pencinta pesisir, dan pejuang solusi nyata krisis sampah plastik pulau.",
    whatYouLearn: {
      smk: ["Teknik penangkapan ikan ramah lingkungan", "Pemeliharaan biota tambak pesisir", "Navigasi kapal kecil dan keselamatan laut", "Pengolahan hasil laut sederhana"],
      vokasi: ["Audit lingkungan dan sampling kualitas air", "Teknologi pengolahan limbah cair dan padat", "Teknik transplantasi terumbu karang", "GIS dan pemetaan zonasi pesisir"],
      akademik: ["Oseanografi fisik dan kimiawi", "Biologi konservasi mamalia laut dan penyu", "Analisis dampak lingkungan (AMDAL)", "Kebijakan tata ruang laut pulau kecil"],
    },
    realProblemsSolvedInBali: [
      "Mitigasi abrasi pantai dan pemulihan terumbu karang yang rusak akibat jangkar kapal dan pemanasan suhu laut di Nusa Penida/Amed.",
      "Perancangan sistem daur ulang sampah plastik sirkular agar tidak mencemari muara sungai dan laut Bali.",
      "Pengawasan mutu air tanah dan laut di sekitar kawasan pariwisata padat untuk menjaga keberlanjutan ekosistem.",
    ],
    coreCompetencies: ["Konservasi Terumbu Karang", "Sains Pengolahan Limbah", "GIS & Analisis Spasial Laut", "Audit Kualitas Lingkungan", "Diving & Field Sampling"],
    readinessBridgeTips: [
      "Ikuti kegiatan beach clean-up komunitas lokal di pantai terdekat dan catat jenis sampah terbanyak yang ditemukan.",
      "Pelajari dasar geografi laut dan iklim pulau tropis melalui materi sains populer.",
    ],
    careerPaths: ["Spesialis Konservasi Laut", "Auditor Lingkungan & AMDAL", "Manajer TPS3R / Daur Ulang", "Peneliti Oseanografi"],
    localEntrepreneurshipIdeas: [
      "Startup daur ulang limbah plastik pesisir menjadi material komposit bernilai jual untuk furnitur resort.",
      "Operator ekowisata selam edukatif yang memadukan wisata bahari dengan adopsi transplantasi karang.",
    ],
    sourceRecords: [
      { publisher: "PDDIKTI Kemendikbudristek", url: "https://pddikti.kemdiktisaintek.go.id", checkDate: "2026-11-02", status: "Terverifikasi" },
      { publisher: "BAN-PT", url: "https://www.banpt.or.id", checkDate: "2026-11-02", status: "Terverifikasi" },
    ],
  },
  {
    id: "bisnis",
    name: "Bisnis Digital & Manajemen E-Commerce",
    group: "usaha",
    categoryName: "Bisnis Kreatif & Hospitality",
    shortDesc: "Pemasaran digital, analisis keuangan bisnis mikro, logistik rantai pasok, dan kewirausahaan mandiri anak muda.",
    vibeTagline: "Jalur bagi calon founder yang suka menganalisis pasar, membangun produk bernilai jual, dan mengoptimalkan strategi penjualan.",
    whatYouLearn: {
      smk: ["Operasional toko retail dan etalase digital", "Administrasi transaksi kasir dan inventaris", "Pelayanan pelanggan dan negosiasi", "Pemasaran media sosial dasar"],
      vokasi: ["Manajemen kampanye iklan digital (Ads & SEO)", "Analitik data penjualan dan perilaku konsumen", "Tata kelola supply chain & pergudangan", "Rancangan bisnis model kanvas (BMC)"],
      akademik: ["Ekonomi manajerial dan pasar modal", "Manajemen strategis dan corporate finance", "Hukum bisnis dan perlindungan konsumen digital", "Inovasi model bisnis rintisan (startup)"],
    },
    realProblemsSolvedInBali: [
      "Membantu UMKM kerajinan perak Celuk dan kopi pupuan menjual langsung ke konsumen dunia tanpa potongan tengkulak berlebih.",
      "Penyusunan sistem pembukuan keuangan rapi bagi usaha rintisan anak muda agar layak mendapatkan modal perbankan/investor.",
      "Optimalisasi logistik pengiriman produk olahan pangan lokal antarpulau dengan biaya efisien.",
    ],
    coreCompetencies: ["Digital Marketing & Ads", "Analisis Finansial Dasar", "E-Commerce Operations", "Negosiasi Bisnis", "Customer Journey Mapping"],
    readinessBridgeTips: [
      "Coba kelola penjualan satu produk sederhana secara daring dan buat pencatatan laba-rugi sederhananya.",
      "Pelajari cara menganalisis metrik akun media sosial bisnis untuk melihat konten apa yang paling disukai pembeli.",
    ],
    careerPaths: ["Digital Marketing Lead", "E-Commerce Store Manager", "Business Development Associate", "Wirausahawan Mandiri"],
    localEntrepreneurshipIdeas: [
      "Agensi optimasi toko daring dan live streaming sales khusus untuk perajin dan produk lokal Bali.",
      "Brand fashion ramah lingkungan yang memanfaatkan kain tenun endek sisa potongan konveksi lokal.",
    ],
    sourceRecords: [
      { publisher: "PDDIKTI Kemendikbudristek", url: "https://pddikti.kemdiktisaintek.go.id", checkDate: "2026-11-02", status: "Terverifikasi" },
      { publisher: "BAN-PT", url: "https://www.banpt.or.id", checkDate: "2026-11-02", status: "Terverifikasi" },
    ],
  },
  {
    id: "pariwisata",
    name: "Manajemen Perhotelan & Ekowisata Berkelanjutan",
    group: "usaha",
    categoryName: "Bisnis Kreatif & Hospitality",
    shortDesc: "Tata kelola resort berstandar internasional, pelayanan keramahan khas Bali, dan kurasi desa wisata berbasis Tri Hita Karana.",
    vibeTagline: "Karier global di bidang hospitalitas dunia, manajemen hotel berbintang, dan pengembangan destinasi wisata berbudaya.",
    whatYouLearn: {
      smk: ["Housekeeping dan penataan kamar tamu", "Food & Beverage service berstandar", "Bahasa Inggris perhotelan praktis", "Pengolahan kuliner nusantara dan barat dasar"],
      vokasi: ["Front office & revenue management sistem", "HACCP dan keamanan pangan dapur industri", "Manajemen MICE (Meeting, Incentive, Conference, Exhibition)", "Etika keramahan budaya lintas bangsa"],
      akademik: ["Perencanaan destinasi pariwisata berkelanjutan", "Sosiologi dan antropologi pariwisata", "Manajemen risiko dan krisis pariwisata pulau", "Kajian daya dukung lingkungan wisata"],
    },
    realProblemsSolvedInBali: [
      "Pengembangan model desa wisata berbasis komunitas lokal di Bali utara dan timur agar manfaat ekonomi tidak menumpuk di Bali selatan.",
      "Penerapan standar operasional hotel hijau bebas plastik sekali pakai dan hemat air tanah di seluruh resort.",
      "Pengenalan kuliner tradisional Bali berkualitas tinggi yang higienis dan menarik bagi wisatawan dari berbagai latar belakang budaya.",
    ],
    coreCompetencies: ["Hospitality Operations", "Komunikasi Bahasa Asing", "Revenue & Booking Management", "F&B Production", "Kurasi Pengalaman Wisata"],
    readinessBridgeTips: [
      "Latih kemampuan percakapan bahasa Inggris aktif setiap hari dengan topik seputar pariwisata dan budaya Bali.",
      "Amati bagaimana cara staf hotel atau kafe profesional menyambut dan melayani pelanggan dengan santun.",
    ],
    careerPaths: ["Hotel Operations Executive", "F&B Director", "Desa Wisata Planner", "Event & Wedding Organizer"],
    localEntrepreneurshipIdeas: [
      "Pengembangan operator tur pengalaman autentik (authentic village experience) yang menghormati adat istiadat setempat.",
      "Kafe kuliner sehat dan toko roti artisan yang menggunakan bahan baku organik lokal petani Bali.",
    ],
    sourceRecords: [
      { publisher: "PDDIKTI Kemendikbudristek", url: "https://pddikti.kemdiktisaintek.go.id", checkDate: "2026-11-02", status: "Terverifikasi" },
      { publisher: "TedQual UNWTO / BAN-PT", url: "https://www.banpt.or.id", checkDate: "2026-11-02", status: "Terverifikasi" },
    ],
  },
];

export const INSTITUTIONS_CATALOG: InstitutionProgram[] = [
  // 1. PNB Jimbaran
  {
    institutionId: "pnb-trpl",
    institutionName: "Politeknik Negeri Bali (PNB)",
    programName: "D4 Teknologi Rekayasa Perangkat Lunak",
    level: "D4",
    accreditation: "Baik Sekali",
    district: "Bukit Jimbaran",
    kabupaten: "Badung",
    tuitionFeeText: "UKT Rp 500.000 - Rp 5.500.000 / semester (Tersedia KIP-Kuliah)",
    facilitiesText: "Lab Software House, Cloud Server Lab, Inkubator Bisnis Vokasi",
    source: { publisher: "PDDIKTI & BAN-PT", url: "https://pnb.ac.id", checkDate: "2026-11-02", status: "Terverifikasi" },
  },
  // 2. ISI Denpasar - DKV
  {
    institutionId: "isi-dkv",
    institutionName: "Institut Seni Indonesia (ISI) Denpasar",
    programName: "S1 Desain Komunikasi Visual",
    level: "S1",
    accreditation: "Unggul",
    district: "Denpasar Timur",
    kabupaten: "Kota Denpasar",
    tuitionFeeText: "UKT Rp 500.000 - Rp 4.500.000 / semester (Tersedia Beasiswa Seni)",
    facilitiesText: "Studio Desain Grafis, Lab Komputer Mac, Galeri Pameran Mahasiswa",
    source: { publisher: "PDDIKTI & BAN-PT", url: "https://isi-dps.ac.id", checkDate: "2026-11-02", status: "Terverifikasi" },
  },
  // 3. Poltekpar Nusa Dua
  {
    institutionId: "poltekpar-perhotelan",
    institutionName: "Politeknik Pariwisata Bali (Poltekpar)",
    programName: "D4 Pengelolaan Perhotelan",
    level: "D4",
    accreditation: "Unggul",
    district: "Nusa Dua",
    kabupaten: "Badung",
    tuitionFeeText: "Rp 2.050.000 / semester (Subsidi Kemenparekraf)",
    facilitiesText: "Hotel Praktik Mahasiswa, Kitchen Studio Standar Bintang 5, Lab Bar",
    source: { publisher: "Kemenparekraf / TedQual", url: "https://ppb.ac.id", checkDate: "2026-11-02", status: "Terverifikasi" },
  },
  // 4. SMKN 1 Denpasar (SKENSA)
  {
    institutionId: "smkn1-dps",
    institutionName: "SMK Negeri 1 Denpasar (SKENSA)",
    programName: "SMK Rekayasa Perangkat Lunak & TJKT",
    level: "SMK",
    accreditation: "A (Unggul)",
    district: "Denpasar Utara",
    kabupaten: "Kota Denpasar",
    tuitionFeeText: "Gratis Biaya SPP (BOS Provinsi Bali)",
    facilitiesText: "Teaching Factory RPL, Lab Jaringan Mikrotik, Sertifikasi BNSP",
    source: { publisher: "BAN-SM / Disdikpora Bali", url: "https://smkn1denpasar.sch.id", checkDate: "2026-11-02", status: "Terverifikasi" },
  },
  // 5. Unud Sudirman - Kesehatan
  {
    institutionId: "unud-kesehatan",
    institutionName: "Universitas Udayana (Kampus Sudirman)",
    programName: "S1 Ilmu Keperawatan & Profesi Ners",
    level: "S1",
    accreditation: "Unggul",
    district: "Denpasar Barat",
    kabupaten: "Kota Denpasar",
    tuitionFeeText: "UKT Rp 500.000 - Rp 7.500.000 / semester",
    facilitiesText: "Rumah Sakit Pendidikan Unud, Lab Simulasi Pasien, OSCE Center",
    source: { publisher: "PDDIKTI & LAM-PTKes", url: "https://unud.ac.id", checkDate: "2026-11-02", status: "Terverifikasi" },
  },
  // 6. Poltekkes Kemenkes Denpasar
  {
    institutionId: "poltekkes-dps",
    institutionName: "Poltekkes Kemenkes Denpasar",
    programName: "D4 Keperawatan Komunitas",
    level: "D4",
    accreditation: "Unggul",
    district: "Denpasar Selatan",
    kabupaten: "Kota Denpasar",
    tuitionFeeText: "Rp 2.500.000 - Rp 4.200.000 / semester (Kemenkes)",
    facilitiesText: "Lab Praktik Keperawatan Komunitas, Pusat Kebugaran Lansia",
    source: { publisher: "Kemenkes RI", url: "https://poltekkes-denpasar.ac.id", checkDate: "2026-11-02", status: "Terverifikasi" },
  },
  // 7. Undiknas Denpasar - Bisnis
  {
    institutionId: "undiknas-bisnis",
    institutionName: "Universitas Pendidikan Nasional (Undiknas)",
    programName: "S1 Bisnis Digital & E-Commerce",
    level: "S1",
    accreditation: "Unggul",
    district: "Denpasar Selatan",
    kabupaten: "Kota Denpasar",
    tuitionFeeText: "Rp 6.000.000 - Rp 8.500.000 / semester (Tersedia Beasiswa Yayasan)",
    facilitiesText: "Digital Business Lab, Podcast Studio, Coworking Mahasiswa",
    source: { publisher: "BAN-PT / LLDIKTI VIII", url: "https://undiknas.ac.id", checkDate: "2026-11-02", status: "Terverifikasi" },
  },
  // 8. SMKN 3 Sukawati (KOKAR)
  {
    institutionId: "smkn3-sukawati",
    institutionName: "SMKN 3 Sukawati (KOKAR Gianyar)",
    programName: "SMK Seni Karawitan & Tari Bali",
    level: "SMK",
    accreditation: "A (Unggul)",
    district: "Batubulan, Sukawati",
    kabupaten: "Gianyar",
    tuitionFeeText: "Bebas Biaya SPP Bulanan (BOS)",
    facilitiesText: "Wantilan Pentas Seni Terbuka, 8 Set Gamelan Gong Kebyar, Kostum Tari",
    source: { publisher: "BAN-SM / Disdikpora Bali", url: "https://smkn3sukawati.sch.id", checkDate: "2026-11-02", status: "Terverifikasi" },
  },
  // 9. Undiksha Singaraja - Pendidikan
  {
    institutionId: "undiksha-singaraja",
    institutionName: "Universitas Pendidikan Ganesha (Undiksha)",
    programName: "S1 Bimbingan Konseling & Teknologi Pendidikan",
    level: "S1",
    accreditation: "Unggul",
    district: "Singaraja Kota",
    kabupaten: "Buleleng",
    tuitionFeeText: "UKT Rp 500.000 - Rp 4.200.000 / semester (Tersedia KIP)",
    facilitiesText: "Lab Konseling Mikro, Studio Microteaching Digital, Ruang Observasi",
    source: { publisher: "PDDIKTI & BAN-PT", url: "https://undiksha.ac.id", checkDate: "2026-11-02", status: "Terverifikasi" },
  },
  // 10. PNB Tabanan - Pertanian Subak
  {
    institutionId: "pnb-tabanan",
    institutionName: "Politeknik Negeri Bali (Kampus Tabanan)",
    programName: "D4 Pengelolaan Tanaman Perkebunan Subak",
    level: "D4",
    accreditation: "Baik Sekali",
    district: "Kerambitan",
    kabupaten: "Tabanan",
    tuitionFeeText: "UKT Rp 500.000 - Rp 3.800.000 / semester",
    facilitiesText: "Lahan Riset Organik Mandung, Lab Agroklimat, Green House Modern",
    source: { publisher: "PDDIKTI / PNB PSDKU", url: "https://pnb.ac.id", checkDate: "2026-11-02", status: "Terverifikasi" },
  },
  // 11. SMKN 1 Petang - Agribisnis Badung
  {
    institutionId: "smkn1-petang",
    institutionName: "SMK Negeri 1 Petang",
    programName: "SMK Agribisnis Organik & Tanaman Pangan",
    level: "SMK",
    accreditation: "A (Unggul)",
    district: "Petang",
    kabupaten: "Badung",
    tuitionFeeText: "Bebas Biaya SPP (BOS)",
    facilitiesText: "Kebun Praktik Kopi dan Sayur Dataran Tinggi, Lab Hidroponik",
    source: { publisher: "BAN-SM", url: "https://disdikpora.baliprov.go.id", checkDate: "2026-11-02", status: "Terverifikasi" },
  },
  // 12. SMKN 1 Abang - Kemaritiman Karangasem
  {
    institutionId: "smkn1-abang",
    institutionName: "SMK Negeri 1 Abang",
    programName: "SMK Kemaritiman & Pengolahan Hasil Laut",
    level: "SMK",
    accreditation: "A (Unggul)",
    district: "Abang / Amed",
    kabupaten: "Karangasem",
    tuitionFeeText: "Bebas Biaya SPP (BOS)",
    facilitiesText: "Simulator Navigasi Bahari, Lab Cold Storage & Pengolahan Ikan",
    source: { publisher: "BAN-SM", url: "https://disdikpora.baliprov.go.id", checkDate: "2026-11-02", status: "Terverifikasi" },
  },
  // 13. SMKN 1 Negara - Jembrana
  {
    institutionId: "smkn1-negara",
    institutionName: "SMK Negeri 1 Negara",
    programName: "SMK Teknik Komputer Jaringan & Akuntansi",
    level: "SMK",
    accreditation: "A (Unggul)",
    district: "Negara Kota",
    kabupaten: "Jembrana",
    tuitionFeeText: "Bebas Biaya SPP (BOS)",
    facilitiesText: "Lab Perakitan PC & Fiber Optik, Lab Bank Mini Siswa",
    source: { publisher: "BAN-SM", url: "https://disdikpora.baliprov.go.id", checkDate: "2026-11-02", status: "Terverifikasi" },
  },
  // 14. SMKN 1 Bangli - Bisnis & Ekowisata
  {
    institutionId: "smkn1-bangli",
    institutionName: "SMK Negeri 1 Bangli",
    programName: "SMK Bisnis Manajemen & Ekowisata",
    level: "SMK",
    accreditation: "A (Unggul)",
    district: "Bangli Kota",
    kabupaten: "Bangli",
    tuitionFeeText: "Bebas Biaya SPP (BOS)",
    facilitiesText: "Laboratorium Pemasaran Retail, Lab Komputer Perbankan Syariah/Konven",
    source: { publisher: "BAN-SM", url: "https://disdikpora.baliprov.go.id", checkDate: "2026-11-02", status: "Terverifikasi" },
  },
  // 15. SMK Kesehatan Panca Atma Jaya - Klungkung
  {
    institutionId: "smk-klungkung",
    institutionName: "SMK Kesehatan Panca Atma Jaya",
    programName: "SMK Keperawatan & Farmasi Klinis",
    level: "SMK",
    accreditation: "Baik Sekali",
    district: "Semarapura",
    kabupaten: "Klungkung",
    tuitionFeeText: "Rp 350.000 / bulan (Tersedia Bantuan Keringanan)",
    facilitiesText: "Lab Praktik Simulasi Bed Pasien, Apotek Simulasi Farmasi",
    source: { publisher: "BAN-SM", url: "https://disdikpora.baliprov.go.id", checkDate: "2026-11-02", status: "Terverifikasi" },
  },
];
