# KertaMarga Bali

Platform Navigasi Penjurusan dan Karier Terpadu Berbasis AI untuk Siswa SMP, SMA, dan SMK se-Bali.
Karya Inovasi Tim Siswa SMK Negeri 1 Denpasar pada Bali DigiFest 2026: AI Web Innovation Challenge (*Build with AI, Solve for Bali*).

---

## Description

KertaMarga Bali adalah platform web inovatif yang dirancang untuk memecahkan problematika salah jurusan (*major mismatch*) dan kesenjangan kompetensi vokasi di Provinsi Bali. Mengintegrasikan skoring deterministik berbasis data valid PDDIKTI, BAN-PT, dan standar BNSP dengan agen penalaran AI transparan, KertaMarga Bali membimbing peserta didik dari asesmen minat bakat, simulasi prioritas geografis 9 kabupaten/kota, hingga rekomendasi silabus belajar terarah menuju Indonesia Emas 2045.

---

## Problem & Target User

### Masalah Nyata
1. **Tingginya Angka Salah Jurusan**: Lebih dari 60% lulusan pendidikan menengah mengalami kebingungan dalam menentukan program studi dan karier lanjutan yang selaras dengan potensi diri serta kebutuhan industri daerah.
2. **Disparitas Akses Informasi Antarwilayah di Bali**: Konsentrasi institusi pendidikan tinggi yang terpusat di Denpasar dan Badung membuat siswa di kabupaten lain (seperti Jembrana, Buleleng, Karangasem) kesulitan memetakan jarak tempuh, perkiraan biaya hidup, dan relevansi keahlian lokal.
3. **Ketiadaan Mentor Akademik Adaptif**: Guru Bimbingan Konseling (BK) di sekolah memiliki rasio beban siswa yang sangat tinggi, sehingga pembimbingan kurikulum secara personal dan bertahap sulit dilakukan secara konsisten.

### Target Pengguna
* **Siswa SMP**: Memilih kelanjutan studi ke SMA atau program keahlian SMK di Bali yang tepat.
* **Siswa SMA/SMK**: Menyiapkan kesiapan kurikulum, portofolio, dan sertifikasi profesi untuk masuk perguruan tinggi vokasi/akademik atau pasar kerja.
* **Guru BK & Orang Tua**: Memperoleh rujukan data berbasis standar resmi PDDIKTI dan BNSP tanpa bias subjektif.

---

## Key Features

1. **Tes Keminatan Multi-Dimensi (Holland RIASEC Adapted)**
   * Kuesioner interaktif terkalibrasi kearifan lokal Bali untuk memetakan kecenderungan minat, tipe kerja, dan orientasi berpikir siswa.
2. **Peta Interaktif Institusi Se-Bali**
   * Integrasi visualisasi lokasi kampus dan sekolah vokasi di 9 kabupaten/kota Bali dengan rincian status akreditasi BAN-PT/BAN-SM.
3. **Simulator Prioritas Tiga Faktor**
   * Perhitungan bobot dinamis yang menyeimbangkan antara faktor Kecocokan Minat, Jarak Tempuh/Geografis, dan Rentang Biaya Pendidikan.
4. **Agen Pembimbing AI & Sertifikasi Kompetensi (Mentor Agent)**
   * Asisten penalaran akademik cerdas yang menganalisis selisih nilai kesiapan siswa, memberikan rekomendasi modul belajar berurutan, dan memandu simulasi soal sertifikasi BNSP.
5. **Pustaka Modul Terbuka & Masterclass**
   * Akses silabus dan dokumen modul standar kompetensi industri yang dapat diunduh langsung untuk pembelajaran mandiri.
6. **Autentikasi Aman & Mode Tamu Anonim**
   * Akses fleksibel dengan perlindungan privasi data siswa: tersedia mode login terdaftar (Siswa/Guru) serta mode Tamu Anonim tanpa pengumpulan data pribadi.

---

## Tech Stack

* **Frontend Framework**: Next.js 15 (App Router) + React 19 + TypeScript
* **Styling & Design System**: Tailwind CSS dengan semantic token AetherCraft Protocol (bebas glassmorphism murahan, kontras tinggi WCAG AAA)
* **Animasi & Interaktivitas**: Framer Motion
* **Backend & API**: Next.js Serverless Edge/Node Runtime
* **Database & ORM**: Drizzle ORM + MySQL / MariaDB (dilengkapi in-memory fallback store untuk keandalan demo offline)
* **Deployment & Hosting**: Vercel Global Edge Network (HTTPS otomatis, 24/7 uptime)

---

## AI Implementation

### Model, Gateway, dan Metode
Sistem mengimplementasikan arsitektur *Multi-Tier Resilient AI*:
1. **Tier 1 (Primary Router)**: 9Router AI Gateway yang kompatibel dengan protokol OpenAI `/v1/chat/completions`, memanggil model berkinerja tinggi `ag/gemini-3.8-flash-high`.
2. **Tier 2 (Direct Fallback)**: Integrasi langsung ke Google Gemini API via official endpoint dengan Structured Output (JSON Schema).
3. **Tier 3 (Deterministic Verification)**: *Deterministic Rule-Based Mentor Engine* berbasis basis pengetahuan kurikulum resmi. Jika seluruh koneksi jaringan AI eksternal terputus, sistem tetap 100% berfungsi memberikan panduan akurat tanpa pernah mengalami crash.

### Alur Input dan Output AI
* **Input**: Pesan kontekstual siswa, identifikasi bidang keahlian, skor kesiapan awal (%), target ambang kelulusan mata kuliah (%), daftar ID modul belajar yang telah diselesaikan, dan riwayat lulus latihan sertifikasi.
* **Output**: Payload JSON tervalidasi yang mencakup ringkasan diagnosis gap akademik, pesan bimbingan personal, tipe tindakan prioritas (materi/sertifikasi), rekomendasi judul modul, poin konsep kunci (*key takeaways*), dan catatan motivasi terukur.

### Alasan Penggunaan AI
AI difungsikan sebagai fasilitator penalaran personal yang adaptif terhadap ribuan kombinasi kondisi capaian siswa, bukan sebagai penentu vonis mutlak kelulusan.

---

## Architecture / Data Flow

```
[ Pengguna / Siswa ]
        │
        ▼ (HTTPS)
[ Antarmuka Web (Next.js 15 / React 19 / Tailwind) ]
        │
        ├──> [ Asesmen Minat ] ──> [ Skoring Deterministik (RIASEC + Bobot) ]
        │
        └──> [ Konsultasi Mentor ]
                     │
                     ▼
             [ API Route: /api/mentor-agent ]
                     │
         ┌───────────┴────────────────────────┐
         │ (Kondisi 1: Router Aktif)          │ (Kondisi 2 / Fallback Jaringan)
         ▼                                    ▼
   [ 9Router Gateway ]               [ Deterministic Mentor Engine ]
   (OpenAI-Compatible)               (Basis Pengetahuan Kurikulum & BNSP)
         │                                    │
         ▼                                    │
   [ Gemini 3.8 / LLM ]                       │
         │                                    │
         └───────────┬────────────────────────┘
                     │
                     ▼ (Output JSON Terstruktur)
         [ Diagnosis Akademik & Rekomendasi Modul ]
```

---

## Installation / Run Instructions

### Prasyarat
* Node.js versi 20.18.0 atau lebih baru
* npm versi 10.8.0 atau lebih baru
* Git

### Langkah Menjalankan di Komputer Lokal

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/Great-YUDZZ/WE-ARE-SKENSA.git
   cd WE-ARE-SKENSA
   ```

2. **Pasang Dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables**:
   Salin berkas contoh environment:
   ```bash
   cp .env.example .env.local
   ```
   *Catatan: Konfigurasi database dan API key bersifat opsional. Jika dikosongkan, aplikasi otomatis menggunakan mode demo in-memory dan penalaran deterministik.*

4. **Jalankan Server Development**:
   ```bash
   npm run dev
   ```
   Aplikasi dapat diakses melalui browser di `http://localhost:3000`.

5. **Build Versi Produksi**:
   ```bash
   npm run build
   npm run start
   ```

---

## Deployment URL

* **URL Produksi Resmi**: [https://kertamarga-bali.vercel.app](https://kertamarga-bali.vercel.app)
* **Status**: Aktif 24/7 di Vercel Production dengan dukungan enkripsi SSL/TLS HTTPS.

---

## Demo Account

Aplikasi dirancang agar juri dapat langsung melakukan pengujian tanpa proses registrasi yang rumit:

1. **Mode Tamu (Direkomendasikan untuk Juri)**:
   * Buka aplikasi pada URL di atas.
   * Klik tombol **Masuk sebagai Tamu** pada navigasi atau modal login.
   * Juri langsung mendapatkan akses penuh ke seluruh fitur asesmen, peta, dan mentor AI tanpa perlu kata sandi.

2. **Mode Akun Terdaftar (Uji Fitur Autentikasi)**:
   * **Role Siswa**: Buka menu Daftar, daftarkan akun baru, atau gunakan akun uji coba lokal.
   * Sistem registrasi menyimpan data hash password secara aman menggunakan algoritma bcrypt (cost factor 10).

*(Sesuai aturan keamanan lomba, tidak ada kredensial atau password sensitif yang disimpan pada repositori publik ini).*

---

## Known Limitations

1. **Cakupan Katalog Institusi**: Saat ini difokuskan pada 15 institusi percontohan di 9 kabupaten/kota Bali dan 10 bidang keahlian vokasi prioritas daerah. Penambahan data kampus swasta lainnya akan terus diperluas pada tahap rilis lanjutan.
2. **Sifat Rekomendasi AI**: Rekomendasi yang dihasilkan bersifat analitik dan edukatif untuk memetakan kesiapan kurikulum, bukan pengganti mutlak konseling psikologi klinis tatap muka.

---

## Third-party Resources / Credits

* **Data Institusi & Program Studi**: Pangkalan Data Pendidikan Tinggi (PDDIKTI) Kemendikbudristek RI, Badan Akreditasi Nasional Perguruan Tinggi (BAN-PT), dan BAN-SM.
* **Standar Kompetensi & Sertifikasi**: Skema Baku Sertifikasi Profesi dari Badan Nasional Sertifikasi Profesi (BNSP).
* **Pemetaan Lokasi**: Google Maps Platform Embed API.
* **Pustaka Open Source**: Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Lucide React, Drizzle ORM, Zod, Jose, Bcryptjs, Leaflet.

---

## Team Members

Karya ini dikembangkan oleh Tim Siswa **SMK Negeri 1 Denpasar (SKENSA)**:

1. **Sabbil Abdillah Ferdyansyah** - *Team Leader & AI*
2. **I Made Yuda Pramana** - *Fullstack*
3. **Nathanael Joan** - *UI/UX & Data Research*

---

## Lampiran: AI & Technology Disclosure

Formulir pengungkapan teknologi resmi sesuai ketentuan Bali DigiFest 2026:

| Komponen | Isi Peserta |
| :--- | :--- |
| **Nama Produk** | KertaMarga Bali (AI Career & Educational Navigator) |
| **Framework / Frontend** | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS |
| **Backend / Runtime** | Next.js Serverless Edge & Node.js Runtime |
| **Database / Storage** | Drizzle ORM, MySQL / MariaDB, In-Memory Resilient Cache |
| **Hosting / Deployment** | Vercel (Produksi Web & API), Cloudflare Infrastructure |
| **AI Model / API / Method** | 9Router Gateway, Google Gemini 3.8 Flash, Multi-Tier Deterministic Rule Engine |
| **Peran AI dalam Produk** | Mendiagnosis selisih kesiapan akademik siswa, merekomendasikan urutan modul belajar, serta memandu simulasi sertifikasi BNSP |
| **Dataset / Data Source** | Data resmi PDDIKTI, data akreditasi BAN-PT, skema sertifikasi BNSP, data geografis 9 kabupaten/kota Bali |
| **Open-source Libraries** | `next`, `react`, `framer-motion`, `lucide-react`, `drizzle-orm`, `zod`, `jose`, `bcryptjs`, `leaflet`, `clsx`, `tailwind-merge` |
| **Template / Boilerplate** | Tidak menggunakan template jadi; dibangun dari awal (*scratch*) menggunakan Create Next App dasar |
| **AI Coding Assistant** | Antigravity AI, Claude, Gemini (digunakan untuk refactoring komponen, penulisan tipe data TypeScript, dan perancangan arsitektur fail-safe) |
| **Pre-existing Components** | Tidak ada (proyek orisinal yang dibangun dari awal khusus untuk kompetisi ini) |
| **Third-party Assets / Credits** | Google Maps Platform Embed, Icon Lucide, Font Google Outfit dan Inter |

---

*Pernyataan: Kami menyatakan bahwa informasi di atas benar dan lengkap. Kami bertanggung jawab atas penggunaan teknologi, source code, data, library, API, model AI, dan aset yang digunakan pada produk.*
