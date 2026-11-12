const INDONESIAN_STOPWORDS = new Set([
  "yang",
  "dan",
  "untuk",
  "dengan",
  "pada",
  "dalam",
  "dari",
  "atau",
  "serta",
  "oleh",
  "akan",
  "bisa",
  "dapat",
  "agar",
  "sebagai",
  "adalah",
  "ialah",
  "secara",
  "dasar",
  "tingkat",
  "lanjut",
  "terapan",
  "pengenalan",
  "konsep",
  "sistem",
  "kerja",
  "metode",
  "proses",
  "program",
  "studi",
  "bidang",
  "tahap",
  "langkah",
  "siswa",
  "anda",
  "kamu",
  "saya",
  "juga",
  "tidak",
  "sudah",
  "belum",
  "jika",
  "saat",
  "lebih",
  "cara",
  "mengenai",
  "tentang",
  "kota",
  "awal",
  "hari",
  "buah",
  "ikan",
  "laut",
  "data",
  "code",
  "foto",
  "film",
  "karya",
  "teknik",
  "ruang",
  "utama",
  "lokal",
  "nyata",
  "baru",
  "tahun",
  "bulan",
  "waktu",
  "jenis",
  "media",
  "model",
  "alat",
  "bahan",
  "tujuan",
  "hasil",
  "bali",
  "indonesia",
  "modern",
  "digital",
  "standar",
  "industri",
]);

export type AiEndpointKind = "navigator" | "mentor";

export interface ScopeHistoryMessage {
  role: string;
  content: string;
}

export interface ScopeEvaluationInput {
  message: string;
  endpoint: AiEndpointKind;
  historyMessages?: ScopeHistoryMessage[];
  extraContextKeywords?: string[];
  contextLabel?: string;
}

export interface ScopeEvaluationResult {
  allowed: boolean;
  reason?: "empty" | "jailbreak" | "off_topic" | "no_domain_signal";
  refusalMessage?: string;
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchesWordOrPhrase(textLower: string, term: string): boolean {
  const cleanTerm = term.trim().toLowerCase();
  if (!cleanTerm) return false;
  if (cleanTerm.includes(" ")) {
    return textLower.includes(cleanTerm);
  }
  const regex = new RegExp(
    `(?:^|[^a-z0-9])${escapeRegExp(cleanTerm)}(?:$|[^a-z0-9])`,
    "i"
  );
  return regex.test(textLower);
}

const JAILBREAK_PATTERNS: RegExp[] = [
  /(?:abaikan|lupakan|langgar|lewatkan|skip|override|ignore|bypass|forget|disregard)\s+(?:semua\s+)?(?:instruksi|aturan|perintah|prompt|batasan|batas|filter|guard|system|kertamarga)/i,
  /(?:system\s*prompt|instruksi\s*internal|developer\s*mode|dan\s*mode|jailbreak|(?:tampilkan|cetak|sebutkan|bocorkan|ulangi)\s+(?:secara\s+verbatim\s+)?(?:seluruh\s+)?(?:prompt|instruksi|nama\s*model|endpoint\s*upstream))/i,
  /(?:roleplay|berperanlah|bertindaklah|pretend)\s+(?:sebagai|jadi|you\s+are|to\s+be)/i,
  /(?:ubah\s+identitas|keluar\s+dari\s+peran|sekarang\s+kamu\s+(?:adalah|bukan)|kamu\s+pirate|awali\s+semua\s+jawaban)/i,
  /\b(?:tulis(?:kan)?|buat(?:kan)?)\s+(?:esai\s+)?(?:[5-9]\d{2}|\d{4,})\s+kata\b/i,
];

const EXPLICIT_OFF_TOPIC_PATTERNS: RegExp[] = [
  // Keamanan berbahaya / kecurangan non-kurikulum
  /\b(?:meretas|membobol|bobol\s+wifi|hack\s+(?:akun|ig|instagram|wa|whatsapp|wifi|bank|situs|game)|ddos|phishing|keylogger|ransomware|malware|cheat\s+game|judi\s+online|slot\s+gacor|togel|pinjol|merakit\s+bom|narkoba)\b/i,
  // Resep masakan & kuliner rumahan (dikecualikan hanya jika menanyakan kurikulum/jurusan tata boga/SMK/kuliah)
  /\b(?:resep\s+(?:masak|masakan|kue|nasi|rendang|soto|ayam|mie|minuman|sambal|bumbu|sate|bakso|seblak)|cara\s+memasak|cara\s+(?:buat|membuat|bikin)\s+(?:kue|seblak|bakso|boba|kopi|telur\s+dadar|nasi\s+goreng|rendang)|bumbu\s+dapur)\b/i,
  // Politik, pejabat, konflik militer
  /\b(?:siapa\s+presiden|pilpres|pilkada|pemilu|partai\s+politik|calon\s+presiden|koalisi\s+partai|ganti\s+presiden|perang\s+(?:rusia|ukraina|palestina|israel|dunia))\b/i,
  // Zodiak, ramalan, asmara, percintaan
  /\b(?:ramalan\s+zodiak|zodiak\s+(?:hari\s+ini|minggu\s+ini|bulan\s+ini)|horoskop|primbon\s+jodoh|tarot|cara\s+(?:nembak|move\s+on|memikat)\s+(?:gebetan|pacar|mantan|cewek|cowok)|(?:puisi|pantun)\s+(?:cinta|romantis|gombalan)|gombalan|curhat\s+(?:putus|pacar|cinta))\b/i,
  // Game kasual, hiburan, musik, gosip selebriti, olahraga
  /\b(?:top\s*up\s+(?:diamond|uc|robux)|build\s+item\s+(?:ml|mobile\s+legends|ff|free\s+fire|genshin)|push\s+rank|tier\s+list\s+hero|nonton\s+(?:anime|drakor|film)\s+gratis|sinopsis\s+(?:film|drakor|anime)|film\s+terbaik|daftar\s+lagu|lirik\s+lagu|chord\s+gitar|gosip\s+artis|biodata\s+artis|siapa\s+juara\s+piala\s+dunia|klasemen\s+liga|jadwal\s+bola|prediksi\s+(?:skor|bola))\b/i,
  // Kripto, trading, kurs mata uang, harga barang konsumtif
  /\b(?:sinyal\s+(?:trading|forex|kripto|crypto)|harga\s+(?:bitcoin|btc|eth|emas\s+antam|hp|iphone|motor)\s*(?:hari\s+ini|terbaru)?|kurs\s+(?:dollar|usd|euro|yen)|nilai\s+tukar\s+(?:dollar|rupiah)|prediksi\s+(?:bitcoin|btc|crypto|saham))\b/i,
  // Cuaca, wisata liburan umum, kuliner liburan, trivia umum, hewan peliharaan
  /\b(?:ramalan\s+cuaca|prakiraan\s+cuaca|cuaca\s+(?:hari\s+ini|besok|di)|apakah\s+hari\s+ini\s+hujan|apa\s+ibu\s+kota|ibukota\s+negara|jarak\s+bumi\s+ke|siapa\s+penemu\s+(?:lampu|telepon|listrik|pesawat|radio|televisi|internet)|cara\s+merawat\s+(?:kucing|anjing|ikan\s+cupang|burung)|cara\s+diet|menurunkan\s+berat\s+badan)\b/i,
  // Rekomendasi liburan / wisata / hotel menginap / tempat makan umum
  /\b(?:tempat\s+(?:wisata|makan\s+enak|nongkrong)|makanan\s+enak|restoran\s+enak|hotel\s+murah|villa\s+murah|pantai\s+(?:terbagus|terbaik|hits)|tiket\s+pesawat|sewa\s+motor)\b/i,
  // Permintaan penulisan kreatif umum / terjemahan bebas / kalkulator aritmetika murni
  /\b(?:buatkan|tuliskan|ceritakan)\s+(?:dongeng|cerpen|novel|puisi|pantun|lagu|surat\s+cinta|caption\s+(?:ig|instagram|tiktok)|pidato\s+ulang\s+tahun|lelucon|tebak-tebakan)\b/i,
  /\bterjemahkan\s+(?:teks|kalimat|paragraf|lirik)\s+ini\b/i,
  /^\s*(?:berapa\s+(?:hasil|nilai)\s+)?\d+\s*[\+\-\*\/x]\s*\d+(?:\s*[\+\-\*\/x]\s*\d+)*\s*\??\s*$/i,
];

// Kata kunci wilayah Bali digunakan untuk memperkaya konteks atau follow-up,
// namun tidak membuka akses pertanyaan off-topic sendirian tanpa kata kunci pendidikan/karier.
const BALI_LOCATION_TERMS: string[] = [
  "bali",
  "denpasar",
  "badung",
  "gianyar",
  "tabanan",
  "buleleng",
  "singaraja",
  "klungkung",
  "bangli",
  "karangasem",
  "jembrana",
  "jimbaran",
  "nusa dua",
  "sukawati",
  "ubud",
];

const CORE_WEBSITE_DOMAIN_TERMS: string[] = [
  // Identitas platform & fitur website
  "kertamarga",
  "navigator",
  "mentor",
  "pembimbing",
  "eksplorasi",
  "kuesioner",
  "vibe",
  "katalog",
  "radar",
  "peta bidang",
  "hasil analisis",
  "tes keminatan",
  "keminatan",
  "profil",
  "catatan belajar",
  "catatan pembelajaran",
  "catatan praktik",
  "pustaka",
  // Pendidikan, penjurusan & karier
  "jurusan",
  "penjurusan",
  "prodi",
  "program studi",
  "fakultas",
  "kuliah",
  "kampus",
  "universitas",
  "institut",
  "politeknik",
  "akademi",
  "sekolah",
  "smp",
  "sma",
  "smk",
  "smkn",
  "sman",
  "vokasi",
  "sarjana",
  "diploma",
  "d3",
  "d4",
  "s1",
  "belajar",
  "pembelajaran",
  "pelajaran",
  "matkul",
  "mata kuliah",
  "silabus",
  "kurikulum",
  "modul",
  "pdf",
  "materi",
  "sertifikasi",
  "kompetensi",
  "uji kompetensi",
  "bnsp",
  "lsp",
  "skkni",
  "kesiapan",
  "target skor",
  "skor saya",
  "skor kesiapan",
  "tambah skor",
  "poin kesiapan",
  "langkah pertama",
  "mulai belajar",
  "nilai rapor",
  "nilai ujian",
  "nilai utbk",
  "rapor",
  "ujian",
  "latihan",
  "minat",
  "bakat",
  "karier",
  "karir",
  "prospek",
  "pekerjaan",
  "profesi",
  "magang",
  "pkl",
  "portofolio",
  "lulusan",
  "alumni",
  "siswa",
  "mahasiswa",
  "guru bk",
  "konselor",
  "konseling",
  "bimbingan",
  // Informasi kampus/sekolah & penerimaan
  "beasiswa",
  "ukt",
  "spp",
  "biaya kuliah",
  "biaya sekolah",
  "akreditasi",
  "ban-pt",
  "ban-sm",
  "snbp",
  "snbt",
  "utbk",
  "ppdb",
  "spmb",
  "jalur masuk",
  "pendaftaran",
  "daftar kuliah",
  "daftar smk",
  "daftar kampus",
  "domisili",
  "kabupaten",
  // Institusi Pendidikan Bali
  "unud",
  "udayana",
  "undiksha",
  "pnb",
  "poltekpar",
  "isi denpasar",
  "institut seni indonesia",
  "stikom",
  "instiki",
  "primakara",
  "warmadewa",
  "undiknas",
  "unmas",
  "unhi",
  "unbi",
  "poltekkes",
  "skensa",
  "kokar",
  "smkn 1 petang",
  "smkn 1 abang",
  // 11 Bidang Keilmuan & Keterampilan Inti KertaMarga Bali
  "tkj",
  "tjkt",
  "jaringan",
  "mikrotik",
  "mtcna",
  "cisco",
  "ccna",
  "vlan",
  "ospf",
  "routing",
  "subnet",
  "subnetting",
  "server",
  "linux",
  "ubuntu",
  "cloud",
  "keamanan siber",
  "cyber security",
  "firewall",
  "informatika",
  "rpl",
  "pplg",
  "trpl",
  "coding",
  "pemrograman",
  "programmer",
  "software",
  "perangkat lunak",
  "algoritma",
  "struktur data",
  "basis data",
  "database",
  "sql",
  "python",
  "javascript",
  "typescript",
  "dkv",
  "desain grafis",
  "desain komunikasi visual",
  "ilustrasi",
  "animasi",
  "multimedia",
  "tipografi",
  "nirmana",
  "figma",
  "ui/ux",
  "ui ux",
  "arsitektur",
  "teknik bangunan",
  "konstruksi",
  "desain interior",
  "lanskap",
  "tata ruang",
  "autocad",
  "sketchup",
  "bim",
  "asta kosala kosali",
  "kesehatan",
  "keperawatan",
  "perawat",
  "kedokteran",
  "farmasi",
  "klinis",
  "anatomi",
  "biologi",
  "kimia",
  "pendidikan",
  "psikologi",
  "pedagogi",
  "bimbingan konseling",
  "karawitan",
  "gamelan",
  "seni pertunjukan",
  "seni tari",
  "pertanian",
  "agroteknologi",
  "agribisnis",
  "subak",
  "organik",
  "hidroponik",
  "smart farming",
  "lingkungan",
  "kelautan",
  "maritim",
  "pesisir",
  "konservasi",
  "terumbu karang",
  "ekologi",
  "tps3r",
  "energi bersih",
  "bisnis digital",
  "umkm",
  "ecommerce",
  "e-commerce",
  "pemasaran",
  "digital marketing",
  "manajemen",
  "akuntansi",
  "keuangan",
  "wirausaha",
  "startup",
  "pariwisata",
  "perhotelan",
  "hospitality",
  "ekowisata",
  "tata boga",
  "front office",
  "housekeeping",
  // Kata bahasa Inggris umum dalam diskusi jurusan/kampus
  "major",
  "campus",
  "university",
  "vocational",
  "career",
  "scholarship",
  "tuition",
  "certification",
];

const GREETING_TERMS: string[] = [
  "halo",
  "hai",
  "hello",
  "hi",
  "selamat pagi",
  "selamat siang",
  "selamat sore",
  "selamat malam",
  "terima kasih",
  "makasih",
  "thanks",
  "siapa kamu",
  "apa yang bisa",
  "bisa bantu apa",
  "mulai dari mana",
  "bantu saya",
  "butuh saran",
  "mau tanya",
  "mau konsultasi",
];

export function extractContextKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 4 && !INDONESIAN_STOPWORDS.has(w));
  return Array.from(new Set(words));
}

export function getOutOfScopeRefusal(
  endpoint: AiEndpointKind,
  contextLabel?: string
): string {
  if (endpoint === "mentor") {
    return `Maaf, Agen Pembimbing KertaMarga hanya dirancang untuk membantu pertanyaan seputar tujuan website ini, yaitu bimbingan materi modul, mata kuliah target, latihan sertifikasi, dan peningkatan skor kesiapan di bidang ${
      contextLabel || "jurusan Anda"
    }. Silakan ajukan pertanyaan tentang materi belajar, strategi menutup selisih skor, atau persiapan uji kompetensi.`;
  }

  return "Maaf, AI Navigator KertaMarga Bali hanya dapat merespons pertanyaan yang sesuai dengan tujuan website ini: konsultasi pemilihan jurusan SMK/SMA/Kuliah di Bali, informasi institusi pendidikan dan akreditasi di Bali, simulasi keminatan, persiapan modul dan sertifikasi, serta prospek karier 11 bidang KertaMarga.\n\nSilakan tanyakan seputar jurusan, kampus atau SMK di Bali, biaya pendidikan, maupun langkah persiapan studi Anda.";
}

export function evaluateAiScope(
  input: ScopeEvaluationInput
): ScopeEvaluationResult {
  const clean = (input.message || "").trim();
  if (!clean) {
    return {
      allowed: false,
      reason: "empty",
      refusalMessage: getOutOfScopeRefusal(input.endpoint, input.contextLabel),
    };
  }

  const lower = clean.toLowerCase();

  if (JAILBREAK_PATTERNS.some((rx) => rx.test(lower))) {
    return {
      allowed: false,
      reason: "jailbreak",
      refusalMessage: getOutOfScopeRefusal(input.endpoint, input.contextLabel),
    };
  }

  if (EXPLICIT_OFF_TOPIC_PATTERNS.some((rx) => rx.test(lower))) {
    const hasExplicitEducationIntent =
      /\b(?:jurusan|prodi|kurikulum|modul|smk|smkn|kuliah|kampus|universitas|politeknik|poltekpar|tata boga|sertifikasi|karier|karir|prospek|pelajaran|ekowisata)\b/i.test(
        lower
      );
    if (!hasExplicitEducationIntent) {
      return {
        allowed: false,
        reason: "off_topic",
        refusalMessage: getOutOfScopeRefusal(input.endpoint, input.contextLabel),
      };
    }
  }

  const hasCoreSignal = CORE_WEBSITE_DOMAIN_TERMS.some((term) =>
    matchesWordOrPhrase(lower, term)
  );
  if (hasCoreSignal) {
    return { allowed: true };
  }

  if (
    input.extraContextKeywords &&
    input.extraContextKeywords.some((kw) => matchesWordOrPhrase(lower, kw))
  ) {
    return { allowed: true };
  }

  const wordCount = lower.split(/\s+/).filter(Boolean).length;

  // Sapaan/bantuan meta hanya diizinkan jika berupa sapaan singkat atau pertanyaan tentang peran asisten
  const isPureMetaHelp =
    /\b(?:siapa\s+kamu|apa\s+yang\s+bisa|bisa\s+bantu\s+apa|mulai\s+dari\s+mana)\b/i.test(
      lower
    );
  const isShortGreetingOnly =
    wordCount <= 5 &&
    GREETING_TERMS.some((greet) => matchesWordOrPhrase(lower, greet));
  if (isPureMetaHelp || isShortGreetingOnly) {
    return { allowed: true };
  }

  // Izinkan pertanyaan lanjutan pendek (<= 10 kata) atau pertanyaan wilayah Bali lanjutan
  // bila riwayat percakapan sebelumnya valid di topik website
  const priorUsers = (input.historyMessages || []).filter(
    (m) => m.role === "user" && m.content.trim() !== clean
  );
  const lastAssistant = [...(input.historyMessages || [])]
    .reverse()
    .find((m) => m.role === "assistant");
  const lastWasRefusal = Boolean(
    lastAssistant?.content.includes(
      "hanya dapat merespons pertanyaan yang sesuai dengan tujuan website ini"
    ) ||
      lastAssistant?.content.includes(
        "hanya dirancang untuk membantu pertanyaan seputar tujuan website ini"
      )
  );

  const hasLocationFollowUp = BALI_LOCATION_TERMS.some((loc) =>
    matchesWordOrPhrase(lower, loc)
  );

  if (
    (wordCount <= 8 || (hasLocationFollowUp && wordCount <= 12)) &&
    priorUsers.length > 0 &&
    !lastWasRefusal
  ) {
    const hasPriorDomainTurn = priorUsers.some((m) => {
      const prevLower = m.content.toLowerCase();
      return CORE_WEBSITE_DOMAIN_TERMS.some((term) =>
        matchesWordOrPhrase(prevLower, term)
      );
    });
    if (hasPriorDomainTurn) {
      return { allowed: true };
    }
  }

  return {
    allowed: false,
    reason: "no_domain_signal",
    refusalMessage: getOutOfScopeRefusal(input.endpoint, input.contextLabel),
  };
}
