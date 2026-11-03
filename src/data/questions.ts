export type QuestionDimension = "interest" | "readiness" | "preference" | "constraint";

export interface QuestionOption {
  id: string;
  text: string;
  fieldWeights: Record<string, number>; // misal: { informatika: 3, dkv: 2 }
  branchTrigger?: string; // ID pertanyaan cabang lanjutan jika memilih opsi ini
}

export interface AssessmentQuestion {
  id: string;
  stageNumber: number;
  dimension: QuestionDimension;
  title: string;
  subtitle: string;
  options: QuestionOption[];
  isAdaptiveBranch?: boolean;
  canSkip?: boolean;
}

export const BASE_QUESTIONS: AssessmentQuestion[] = [
  // TAHAP 1: MINAT & AKTIVITAS (Interest)
  {
    id: "q1_activity",
    stageNumber: 1,
    dimension: "interest",
    title: "Aktivitas apa yang paling membuatmu bersemangat dan lupa waktu?",
    subtitle: "Pilih satu kegiatan yang paling menggambarkan keseharian idealmu.",
    options: [
      {
        id: "q1_opt_tech",
        text: "Mencari tahu cara kerja aplikasi, coding, game, atau memecahkan teka-teki logika.",
        fieldWeights: { informatika: 4, dkv: 1, arsitektur: 2 },
        branchTrigger: "q_branch_tech",
      },
      {
        id: "q1_opt_visual",
        text: "Menggambar ilustrasi, merancang tata letak, mengedit video, atau fotografi kreatif.",
        fieldWeights: { dkv: 4, arsitektur: 3, budaya: 2 },
        branchTrigger: "q_branch_creative",
      },
      {
        id: "q1_opt_social",
        text: "Mendengarkan curhat teman, membantu orang lain menyelesaikan masalah, atau mengajar adik kelas.",
        fieldWeights: { pendidikan: 4, kesehatan: 3, budaya: 1 },
      },
      {
        id: "q1_opt_biz",
        text: "Menjual produk/jasa, bernegosiasi, merencanakan ide usaha, atau mengamati tren bisnis.",
        fieldWeights: { bisnis: 4, pariwisata: 3, informatika: 1 },
        branchTrigger: "q_branch_biz",
      },
      {
        id: "q1_opt_nature",
        text: "Berkegiatan di alam terbuka, mengamati laut/pantai, merawat tanaman, atau peduli isu lingkungan Bali.",
        fieldWeights: { pertanian: 4, lingkungan: 4, pariwisata: 1 },
        branchTrigger: "q_branch_nature",
      },
    ],
  },
  {
    id: "q2_project_type",
    stageNumber: 1,
    dimension: "interest",
    title: "Jika ditugaskan membuat satu karya besar di sekolah, kamu paling ingin membuat apa?",
    subtitle: "Karya ini akan dipamerkan ke masyarakat umum di Bali.",
    options: [
      {
        id: "q2_opt_app",
        text: "Aplikasi web atau sistem cerdas untuk mempermudah operasional warga lokal.",
        fieldWeights: { informatika: 4, bisnis: 2 },
      },
      {
        id: "q2_opt_brand",
        text: "Identitas visual, logo, dan video kampanye untuk produk perajin khas Bali.",
        fieldWeights: { dkv: 4, budaya: 2 },
      },
      {
        id: "q2_opt_space",
        text: "Maket desain homestay tropis ramah lingkungan berbasis arsitektur tradisional Bali.",
        fieldWeights: { arsitektur: 4, pariwisata: 2 },
      },
      {
        id: "q2_opt_health",
        text: "Buku panduan kesehatan dan posko skrining kesehatan gratis bagi lansia desa.",
        fieldWeights: { kesehatan: 4, pendidikan: 2 },
      },
      {
        id: "q2_opt_art",
        text: "Koreografi tari atau gubahan tabuh gamelan kreasi baru untuk pentas festival.",
        fieldWeights: { budaya: 4, dkv: 1 },
      },
      {
        id: "q2_opt_eco",
        text: "Prototipe sistem pemilah sampah daur ulang atau instalasi hidroponik sayur organik.",
        fieldWeights: { pertanian: 3, lingkungan: 4 },
      },
    ],
  },

  // TAHAP 2: KESIAPAN SAAT INI (Readiness)
  {
    id: "q3_current_readiness",
    stageNumber: 2,
    dimension: "readiness",
    title: "Materi atau keterampilan apa yang saat ini paling nyaman kamu pelajari?",
    subtitle: "Kesiapan ini untuk memetakan titik awal belajarmu, bukan batasan masa depan.",
    options: [
      {
        id: "q3_opt_math",
        text: "Logika matematika, analisis data, rumus, atau pemecahan soal berurutan.",
        fieldWeights: { informatika: 3, arsitektur: 2, bisnis: 2 },
      },
      {
        id: "q3_opt_comm",
        text: "Bahasa (Inggris/Indonesia), komunikasi lisan, presentasi di depan kelas.",
        fieldWeights: { pariwisata: 3, pendidikan: 3, bisnis: 2 },
      },
      {
        id: "q3_opt_craft",
        text: "Praktik tangan langsung, menggambar teknik/seni, memainkan alat musik, atau merakit alat.",
        fieldWeights: { budaya: 3, arsitektur: 2, dkv: 3 },
      },
      {
        id: "q3_opt_science",
        text: "Biologi, IPA lingkungan, fenomena alam, atau pemeliharaan tanaman/hewan.",
        fieldWeights: { pertanian: 3, lingkungan: 3, kesehatan: 3 },
      },
    ],
  },

  // TAHAP 3: PREFERENSI BELAJAR & LINGKUNGAN KERJA (Preference)
  {
    id: "q4_learning_mode",
    stageNumber: 3,
    dimension: "preference",
    title: "Gaya belajar seperti apa yang paling efektif bagimu?",
    subtitle: "Membantu menyeimbangkan pilihan antara jalur Vokasi (SMK/Politeknik) atau Akademik (S1).",
    options: [
      {
        id: "q4_opt_hands_on",
        text: "Langsung praktik di laboratorium/bengkel/lapangan (70% praktik, 30% teori).",
        fieldWeights: { informatika: 2, pariwisata: 3, budaya: 3, pertanian: 2 },
      },
      {
        id: "q4_opt_conceptual",
        text: "Mendalami konsep teoritis, riset literatur, diskusi gagasan, dan analisis mendalam.",
        fieldWeights: { pendidikan: 3, arsitektur: 2, lingkungan: 2, kesehatan: 2 },
      },
      {
        id: "q4_opt_collaborative",
        text: "Bekerja dalam tim dinamis dengan banyak interaksi bersama orang baru setiap hari.",
        fieldWeights: { pariwisata: 3, bisnis: 3, pendidikan: 2 },
      },
      {
        id: "q4_opt_focused",
        text: "Fokus mandiri di depan komputer atau studio kerja yang tenang dan minim distraksi.",
        fieldWeights: { informatika: 3, dkv: 3, arsitektur: 2 },
      },
    ],
  },

  // TAHAP 4: KENDALA & PRIORITAS LOKASI BALI (Constraint)
  {
    id: "q5_mobility_cost",
    stageNumber: 4,
    dimension: "constraint",
    title: "Bagaimana kesiapan mobilitas dan pertimbangan lokasi belajarmu di Bali?",
    subtitle: "Data ini membantu menyesuaikan estimasi jarak kampus/sekolah dari tempat tinggalmu.",
    options: [
      {
        id: "q5_opt_home",
        text: "Mengutamakan institusi yang dekat dari rumah di kabupatenku (bisa pulang-pergi harian).",
        fieldWeights: {},
      },
      {
        id: "q5_opt_ready_kos",
        text: "Siap indekos atau menempuh perjalanan antarkabupaten (misalnya ke Denpasar/Badung/Singaraja).",
        fieldWeights: {},
      },
      {
        id: "q5_opt_affordable",
        text: "Sangat memprioritaskan sekolah/kampus negeri dengan UKT rendah atau peluang beasiswa KIP luas.",
        fieldWeights: {},
      },
    ],
  },
];

export const ADAPTIVE_BRANCH_QUESTIONS: Record<string, AssessmentQuestion> = {
  q_branch_tech: {
    id: "q_branch_tech",
    stageNumber: 1,
    dimension: "interest",
    title: "Pertanyaan Lanjutan: Dalam dunia teknologi, bagian mana yang paling memikatmu?",
    subtitle: "Pertanyaan adaptif ini muncul karena kamu memilih ketertarikan pada bidang teknologi.",
    canSkip: true,
    options: [
      {
        id: "q_tech_software",
        text: "Menulis kode program, backend logika, dan membuat fitur aplikasi berfungsi.",
        fieldWeights: { informatika: 4 },
      },
      {
        id: "q_tech_ui",
        text: "Merancang tampilan antarmuka (UI), animasi transisi, dan pengalaman pengguna yang nyaman.",
        fieldWeights: { dkv: 4, informatika: 1 },
      },
      {
        id: "q_tech_hardware",
        text: "Mengutak-atik kabel jaringan, server, mikrotik, atau perangkat keras komputer.",
        fieldWeights: { informatika: 3 },
      },
    ],
  },
  q_branch_creative: {
    id: "q_branch_creative",
    stageNumber: 1,
    dimension: "interest",
    title: "Pertanyaan Lanjutan: Fokus media visual mana yang paling ingin kamu kuasai?",
    subtitle: "Pertanyaan adaptif berdasarkan pilihan ketertarikan seni visual.",
    canSkip: true,
    options: [
      {
        id: "q_creative_branding",
        text: "Branding produk, desain kemasan, dan tipografi publikasi komersial.",
        fieldWeights: { dkv: 4, bisnis: 1 },
      },
      {
        id: "q_creative_architect",
        text: "Desain interior, bentuk bangunan estetis, dan tata letak ruang hidup.",
        fieldWeights: { arsitektur: 4 },
      },
      {
        id: "q_creative_traditional",
        text: "Seni ornamen tradisional, lukisan Bali, atau tata panggung pementasan adat.",
        fieldWeights: { budaya: 4, dkv: 1 },
      },
    ],
  },
  q_branch_biz: {
    id: "q_branch_biz",
    stageNumber: 1,
    dimension: "interest",
    title: "Pertanyaan Lanjutan: Bentuk usaha apa yang paling ingin kamu rintis di Bali?",
    subtitle: "Pertanyaan adaptif berdasarkan ketertarikan pada wirausaha.",
    canSkip: true,
    options: [
      {
        id: "q_biz_online",
        text: "Toko digital mandiri, live shopping, dan strategi ekspor produk lokal.",
        fieldWeights: { bisnis: 4 },
      },
      {
        id: "q_biz_hospitality",
        text: "Kafe unik, villa homestay, atau tur pengalaman desa wisata berkelanjutan.",
        fieldWeights: { pariwisata: 4, bisnis: 1 },
      },
    ],
  },
  q_branch_nature: {
    id: "q_branch_nature",
    stageNumber: 1,
    dimension: "interest",
    title: "Pertanyaan Lanjutan: Isu lingkungan mana yang paling mendesak untuk kamu selesaikan?",
    subtitle: "Pertanyaan adaptif berdasarkan kepedulian pada alam pulau Bali.",
    canSkip: true,
    options: [
      {
        id: "q_nature_farming",
        text: "Ketahanan pangan, regenerasi petani, dan produksi sayur/kopi organik bebas pestisida.",
        fieldWeights: { pertanian: 4 },
      },
      {
        id: "q_nature_ocean",
        text: "Penyelamatan ekosistem laut, terumbu karang, dan penanggulangan sampah pesisir.",
        fieldWeights: { lingkungan: 4 },
      },
    ],
  },
};
