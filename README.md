# KertaMarga Bali

Platform Navigasi Penjurusan, Kesiapan Kompetensi, dan Karier Terpadu Berbasis AI untuk Siswa SMP, SMA, dan SMK se-Bali.
Karya Inovasi Tim **WE ARE SKENSA** (SMK Negeri 1 Denpasar) pada **Bali DigiFest 2026: AI Web Innovation Challenge** (*Build with AI, Solve for Bali*).

---

## Description

KertaMarga Bali adalah platform web inovatif yang dirancang untuk memecahkan problematika salah jurusan (*major mismatch*) dan kesenjangan kompetensi vokasi di Provinsi Bali. Mengintegrasikan skoring deterministik multi-faktor berbasis data valid PDDIKTI, BAN-PT, BAN-SM, dan skema BNSP dengan agen penalaran AI yang tangguh dan terbatas cakupan (*topic-scoped AI*), KertaMarga Bali membimbing siswa mulai dari asesmen minat bakat adaptif, pemetaan jarak geografis 284 institusi pendidikan di 9 kabupaten/kota Bali, konsultasi AI Navigator & Agen Pembimbing, hingga pengelolaan Profil & Catatan Pembelajaran pribadi.

---

## Problem & Target User

### Masalah Nyata
1. **Tingginya Angka Salah Jurusan**: Banyak lulusan SMP, SMA, dan SMK mengalami kebingungan menentukan sekolah lanjutan, program studi, dan karier yang selaras dengan potensi diri serta kebutuhan industri daerah Bali.
2. **Disparitas Informasi Pendidikan Antarwilayah di Bali**: Konsentrasi kampus dan sekolah vokasi yang beragam di 9 kabupaten/kota Bali membuat siswa kesulitan membandingkan akreditasi resmi, kecocokan bidang, jarak tempuh dari rumah, serta estimasi biaya kuliah.
3. **Ketiadaan Mentor Akademik & Dokumentasi Belajar Terstruktur**: Rasio beban Guru Bimbingan Konseling (BK) yang tinggi membuat pendampingan kurikulum bertahap, simulasi sertifikasi BNSP, dan pencatatan progres belajar mandiri siswa sulit dipantau secara personal.

### Target Pengguna
* **Siswa SMP**: Memetakan minat awal dan memilih kelanjutan studi SMK/jurusan keahlian di Bali sesuai bakat dan jarak dari rumah.
* **Siswa SMA/SMK**: Menganalisis kesiapan mata kuliah target, menutup selisih skor (*readiness gap*) lewat 33 modul belajar dan simulasi sertifikasi BNSP, serta merencanakan pendaftaran perguruan tinggi.
* **Guru BK & Orang Tua**: Memperoleh rujukan data terstruktur berbasis standar PDDIKTI, BAN-PT, dan BNSP serta mendampingi catatan belajar siswa.

---

## Key Features

1. **Asesmen Minat & Simulator Prioritas Tiga Faktor (`/eksplorasi` & `/tes-keminatan`)**
   * Kuesioner adaptif multi-dimensi dengan bobot dinamis (Kecocokan Minat, Jarak Tempuh GPS/Alamat/Kabupaten, dan Rentang Biaya) serta filter jenjang cerdas (SMP diarahkan ke SMK relevan, SMA/SMK ke Perguruan Tinggi).
2. **Direktori & Radar Peta Pendidikan Se-Bali (`/katalog` & `#peta-kampus`)**
   * Direktori 284 entitas pendidikan Bali (61 Perguruan Tinggi, 108 SMK, 115 SMA) di 9 kabupaten/kota dengan status akreditasi BAN-PT/BAN-SM, jarak Haversine dari lokasi pengguna, serta pratinjau Google Maps interaktif.
3. **Peta Bidang Keilmuan, Quiz Dinamis & Verifikasi Kemampuan (`/peta-bidang` & `/hasil-analisis`)**
   * Eksplorasi 11 bidang keilmuan strategis Bali lengkap dengan modul materi & PDF pembelajaran (`public/pustaka-modul/`), **Tes Sertifikasi Dinamis** yang selalu berganti skenario dan urutan jawaban per percobaan, fitur **Verifikasi Kemampuan AI** yang terbuka setelah seluruh modul & quiz selesai (`POST /api/skill-verification`), kolom catatan praktik, serta **Agen Pembimbing AI** slide-over drawer.
4. **AI Navigator Konsultasi Jurusan (`/ai-navigator`)**
   * Dialog interaktif berbasis AI yang terhubung ke pencocokan institusi real-time sesuai domisili kabupaten dan jenjang target, dilengkapi **AI Scope Guard 2-Lapis** (`src/lib/ai-scope-guard.ts`) agar AI hanya menjawab topik pendidikan/karier Bali sesuai tujuan website.
5. **Portal Profil & Catatan Pembelajaran (`/profil`)**
   * Halaman terpadu bagi pengguna terdaftar untuk mengedit profil minat, membuat/mengelola catatan belajar pribadi (per kategori & bidang), meninjau catatan praktik modul serta skor asesmen, dan menyinkronkan progres antar perangkat (`/api/profile`).
6. **Autentikasi Aman, Perlindungan API & Mode Tamu Anonim (`/login`, `/daftar`)**
   * Akses penuh Mode Tamu Anonim tanpa login wajib, registrasi/login terlindungi bcrypt + JWT `httpOnly` + validasi kata sandi kuat + lockout brute-force + verifikasi peran Guru BK berbasis NIP 18 digit, serta header keamanan HTTP/CSP & rate limiting per-IP.

---

## Tech Stack

* **Frontend Framework**: Next.js 15 (App Router) + React 19 + TypeScript 5.7
* **Styling & Design System**: Tailwind CSS 3.4 dengan desain Neo-Pop Tactile berkontras tinggi (font `Outfit`, `Inter`, `JetBrains Mono`)
* **Animasi & Peta**: GSAP + `@gsap/react`, Framer Motion, Leaflet, dan Google Maps Embed API
* **Backend & API**: Next.js App Router API Routes (Node.js Runtime) dengan validasi skema ketat `Zod` dan proteksi `src/lib/api-security.ts`
* **Database & Storage**: Drizzle ORM + MySQL / MariaDB (`mysql2`) dengan fallback penyimpanan JSON persisten (`data/users.json`, `data/learning-profiles.json` lokal / `/tmp/kertamarga-data` di serverless)
* **Deployment & Hosting**: Vercel Production (Region `sin1` Singapura, HTTPS otomatis, 24/7 uptime)

---

## AI Implementation

### Model, Gateway, dan Metode
Sistem mengimplementasikan arsitektur *Multi-Tier Resilient AI* yang dibungkus **AI Scope Guard 2-Lapis**:
1. **Pre-LLM Topic & Security Guard (`src/lib/ai-scope-guard.ts` + Zod)**: Memvalidasi role (`user`/`assistant` saja), panjang/ukuran payload, serta menyaring pertanyaan di luar cakupan website maupun upaya *prompt injection* sebelum pemanggilan model AI.
2. **Tier 1 (Primary Gateway)**: 9Router OpenAI-compatible Gateway (`src/lib/router-client.ts`) yang merutekan permintaan ke `ag/gemini-3-flash`, `ag/gemini-3-flash-agent`, `ag/gemini-3.8-flash-low`, dan `openrouter/openrouter/free` lengkap dengan circuit breaker cooldown, jitter, dan in-memory LRU cache.
3. **Tier 2 (Direct LLM Fallback)**: Integrasi langsung ke Google Gemini REST API (`generativelanguage.googleapis.com`) menggunakan model `gemini-3.5-flash-lite` (`GEMINI_MODEL`) dengan fallback berantai ke `gemini-flash-lite-latest` dan `gemini-3.5-flash` dalam mode output JSON terstruktur.
4. **Tier 3 (Deterministic Knowledge Fallback)**: *Deterministic Rule-Based Mentor Engine* dan `src/lib/scoring.ts` berbasis kurasi kurikulum 11 bidang & standar BNSP, menjamin sistem tetap 100% responsif tanpa error meski API eksternal mengalami *timeout* atau batas kuota.

### Alur Input dan Output AI
* **Input**: Riwayat pesan tervalidasi (`user`/`assistant`), domisili kabupaten Bali, jenjang target (`semua`/`smk`/`kuliah`), bidang studi aktif, skor kesiapan awal (%), target skor mata kuliah (%), progres modul selesai, dan sertifikasi lulus.
* **Output**: JSON tervalidasi skema (`inScope`, `reply` / `replyMessage`, `matchedFieldId`, `diagnosisSummary`, `recommendedActionType`, `recommendedItemTitle`, `keyTakeaways`, `encouragementNote`) beserta *disclaimer* edukatif pada antarmuka.

### Alasan Penggunaan AI
AI digunakan secara terukur sebagai asisten penalaran kontekstual yang mengaitkan ribuan kombinasi skor kesiapan, domisili kabupaten Bali, dan silabus modul menjadi bimbingan bertahap, sementara akreditasi, jarak Haversine, dan daftar institusi tetap diambil dari dataset terkurasi agar tidak terjadi halusinasi data fakta.

---

## Architecture / Data Flow

```
[ User (Siswa / Guru BK / Juri) ]
        |
        v (HTTPS + CSP + Origin Guard + Rate Limiter)
[ Frontend (Next.js 15 / React 19 / Tailwind CSS) ]
        |
        +--> [ /eksplorasi & /tes-keminatan ] --> [ POST /api/assessment/analyze ]
        |                                               |
        |                                               v
        |                                  [ Deterministic RIASEC + Haversine Engine ]
        |
        +--> [ /profil & /hasil-analisis ] <---> [ GET/PUT/PATCH /api/profile ]
        |                                               |
        |                                               v
        |                                  [ Database / Storage: Drizzle MySQL / JSON Store ]
        |
        +--> [ /ai-navigator & Mentor Drawer ] --> [ POST /api/navigator-chat & /api/mentor-agent ]
                                                        |
                                                        v
                                           [ Zod Validation + 2-Layer AI Scope Guard ]
                                                        |
                        +-------------------------------+-------------------------------+
                        | (In-Scope & Upstream Aktif)                                   | (Fallback Deterministik / Out-of-Scope)
                        v                                                               v
          [ 9Router Gateway -> Gemini REST API ]                       [ Deterministic Curriculum Engine / Scope Refusal ]
                        |                                                               |
                        +-------------------------------+-------------------------------+
                                                        |
                                                        v (Validated JSON Result + Field Matcher)
                                       [ Result: Bimbingan, Rekomendasi Modul, & Kartu Institusi ]
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
   *Catatan: Pengisian `DB_*` dan API key bersifat opsional saat uji coba lokal. Tanpa MySQL, sistem otomatis memakai fallback JSON store; tanpa API key AI, sistem tetap beroperasi melalui Deterministic Curriculum Engine.*

4. **Jalankan Server Development**:
   ```bash
   npm run dev
   ```
   Aplikasi dapat diakses melalui browser di `http://localhost:3000`.

5. **Build & Verifikasi Produksi**:
   ```bash
   npm run lint
   npm run build
   npm run start
   ```

6. **Jalankan Automated Smoke & Security Test** (pada terminal baru saat server aktif di `http://127.0.0.1:3000`):
   ```bash
   npm run smoke
   ```

---

## Dokumentasi Tahap 2 (Final Submission)

* [Catatan Improvement Tahap 1 ke Tahap 2 & AI Disclosure Final](docs/TAHAP2_IMPROVEMENTS_AND_DISCLOSURE.md)
* [Panduan Verifikasi Teknis & Q&A Tim](docs/TECHNICAL_VERIFICATION_QA.md)

---

## Deployment URL

* **URL Produksi Resmi**: [https://kertamarga-bali.vercel.app](https://kertamarga-bali.vercel.app)
* **Region Hosting**: Vercel Singapore (`sin1`) dengan enkripsi SSL/TLS HTTPS 24/7.

---

## Demo Account

Aplikasi dirancang agar juri dapat menguji seluruh alur utama tanpa hambatan:

1. **Mode Tamu Anonim (Direkomendasikan untuk Uji Cepat Juri)**:
   * Buka `https://kertamarga-bali.vercel.app`.
   * Langsung jalankan `/eksplorasi`, `/tes-keminatan`, `/ai-navigator`, `/katalog`, dan `/hasil-analisis` tanpa perlu login.
2. **Mode Akun Terdaftar (Uji Fitur Profil, Catatan Belajar, & Autentikasi)**:
   * Klik tombol **Masuk** atau buka `/daftar` untuk membuat akun siswa baru (kata sandi minimal 8 karakter kombinasi huruf dan angka).
   * Setelah masuk, buka menu **Profil & Catatan** (`/profil`) atau klik lencana akun di pojok kanan atas Navbar untuk mencatat progres belajar dan refleksi studi.
   * Kredensial akun demo khusus juri (bila diperlukan terpisah) dikirimkan melalui formulir resmi panitia dan tidak disimpan di repositori publik.

*(Selaras dengan aturan keamanan Bali DigiFest 2026, tidak ada API key, token, atau password sensitif yang ditanam di repositori ini).*

---

## Known Limitations

1. **Penyimpanan Fallback Serverless Tanpa DB Eksternal**: Jika `DB_HOST` tidak dihubungkan ke instance MySQL/MariaDB persisten, penyimpanan akun dan profil di lingkungan serverless Vercel menggunakan fallback file sementara (`/tmp/kertamarga-data`) ditambah sinkronisasi `localStorage` pada browser pengguna.
2. **Cakupan Data Geografis & Institusi**: Katalog saat ini memetakan 284 entitas pendidikan Bali (61 PT, 108 SMK, 115 SMA) beserta 15 sorotan program keilmuan dalam 11 klaster bidang strategis. Pembaruan kuota/biaya semester mengikuti rilis berkala institusi masing-masing.
3. **Sifat Rekomendasi AI**: Seluruh saran AI bersifat pendampingan edukatif untuk orientasi studi dan tidak menggantikan konseling resmi Guru BK atau kebijakan seleksi institusi pendidikan.

---

## Third-party Resources / Credits

* **Data Institusi & Program Studi**: Pangkalan Data Pendidikan Tinggi (PDDIKTI) Kemendikbudristek RI, Badan Akreditasi Nasional Perguruan Tinggi (BAN-PT), dan BAN-SM.
* **Standar Kompetensi & Sertifikasi**: Skema Baku Sertifikasi Profesi dari Badan Nasional Sertifikasi Profesi (BNSP).
* **Pemetaan Lokasi & Geocoding**: Google Maps Embed API, Nominatim OpenStreetMap Geocoding, `ipwho.is`, dan Leaflet.
* **Tipografi & Ikon**: Google Fonts (`Outfit`, `Inter`, `JetBrains Mono`) dan `lucide-react`.
* **Pustaka Open Source**: Next.js, React, TypeScript, Tailwind CSS, GSAP, `@gsap/react`, Framer Motion, Drizzle ORM, `mysql2`, Zod, Jose, Bcryptjs, `clsx`, `tailwind-merge`.

---

## Team Members

Karya ini dikembangkan oleh Tim **WE ARE SKENSA** — **SMK Negeri 1 Denpasar**:

1. **Sabbil Abdillah Ferdyansyah** - *Team Leader & AI*
2. **I Made Yuda Pramana** - *Fullstack*
3. **Nathanael Joan** - *UI/UX & Data Research*

---

## Lampiran: AI & Technology Disclosure

Formulir pengungkapan teknologi resmi sesuai Lampiran C Panduan Bali DigiFest 2026:

| Komponen | Isi Peserta |
| :--- | :--- |
| **Nama Produk** | KertaMarga Bali (AI Career & Educational Navigator) |
| **Framework / Frontend** | Next.js 15 (App Router), React 19, TypeScript 5.7, Tailwind CSS 3.4 |
| **Backend / Runtime** | Next.js App Router API Routes (Node.js Runtime) dengan `Zod` & `src/lib/api-security.ts` |
| **Database / Storage** | Drizzle ORM + MySQL / MariaDB (`mysql2`), Persistent JSON Fallback (`data/users.json`, `data/learning-profiles.json` / `/tmp/kertamarga-data`), Browser `localStorage` Sync |
| **Hosting / Deployment** | Vercel Production (Region `sin1` Singapura, HTTPS) |
| **AI Model / API / Method** | Multi-tier pipeline: 9Router Gateway (`ag/gemini-3-flash`, `ag/gemini-3-flash-agent`, `ag/gemini-3.8-flash-low`, `openrouter/openrouter/free`), Google Gemini REST API (`gemini-3.5-flash-lite`, `gemini-flash-lite-latest`, `gemini-3.5-flash`), AI Scope Guard 2-Lapis (`src/lib/ai-scope-guard.ts`), serta Skoring Deterministik (`src/lib/scoring.ts`) & Deterministic Rule Engine |
| **Peran AI dalam Produk** | Menganalisis selisih kesiapan akademik siswa dan merekomendasikan modul/sertifikasi BNSP (`/api/mentor-agent`), serta melayani konsultasi penjurusan dan institusi Bali yang dibatasi cakupan tujuan website (`/api/navigator-chat`) |
| **Dataset / Data Source** | Data resmi PDDIKTI, data akreditasi BAN-PT & BAN-SM, standar sertifikasi BNSP, serta direktori 284 entitas pendidikan Bali + koordinat geografis 9 kabupaten/kota Bali |
| **Open-source Libraries** | `next`, `react`, `react-dom`, `framer-motion`, `gsap`, `@gsap/react`, `lucide-react`, `drizzle-orm`, `mysql2`, `zod`, `jose`, `bcryptjs`, `leaflet`, `@types/leaflet`, `clsx`, `tailwind-merge`, `typescript`, `tailwindcss`, `postcss`, `autoprefixer` |
| **Template / Boilerplate** | Tidak menggunakan template jadi; struktur dasar dibuat dari `create-next-app` dan dirancang khusus untuk KertaMarga Bali |
| **AI Coding Assistant** | Antigravity AI, Claude, Gemini (digunakan untuk refactoring komponen, audit keamanan & type safety TypeScript, penyusunan automated smoke test, dan perancangan arsitektur fail-safe) |
| **Pre-existing Components** | Tidak ada komponen komersial pra-kompetisi; seluruh produk dikembangkan khusus untuk Bali DigiFest 2026 |
| **Third-party Assets / Credits** | Google Maps Embed API, Leaflet, Nominatim OpenStreetMap, `ipwho.is`, Google Fonts (`Outfit`, `Inter`, `JetBrains Mono`), Lucide Icons, dan materi pustaka modul pada `public/pustaka-modul/` |

*Pernyataan: Kami menyatakan bahwa informasi di atas benar dan lengkap. Kami bertanggung jawab atas penggunaan teknologi, source code, data, library, API, model AI, dan aset yang digunakan pada produk.*
