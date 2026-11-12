# Catatan Improvement Tahap 1 ke Tahap 2 & AI Technology Disclosure Final

Dokumen ini disiapkan sebagai pelengkap Final Submission **Bali DigiFest 2026: AI Web Innovation Challenge** untuk produk **KertaMarga Bali** (Kategori SMA/SMK/Sederajat, Tim **WE ARE SKENSA** - SMK Negeri 1 Denpasar).

---

## 1. Catatan Improvement dari Tahap 1 (`v1.0-submission`) ke Tahap 2 (`v2.0-final`)

Berdasarkan evaluasi pasca penyisihan dan *pentest* menuju penjurian final, peningkatan utama yang diselesaikan pada Tahap 2 meliputi:

1. **Ketahanan Pipeline AI & Failover Multi-Tier (AI Implementation)**
   - Mengembangkan klien router tangguh (`src/lib/router-client.ts`) dengan mekanisme failover berjenjang (`9Router Gateway` -> `Google Gemini REST API` -> `Deterministic Rule Engine`), *circuit breaker cooldown* untuk proteksi batas laju 429, retry jitter, dan in-memory LRU response cache.
   - Menambahkan **Pembatasan Topik AI 2-Lapis (`src/lib/ai-scope-guard.ts`)** beserta *disclaimer* Responsible AI pada antarmuka chat sehingga `/api/navigator-chat` dan `/api/mentor-agent` menolak pertanyaan di luar cakupan edukasi/karier Bali dan upaya *prompt/system-role injection*.

2. **Portal Profil & Catatan Pembelajaran (`/profil` & `/api/profile`)**
   - Membangun halaman `/profil` beserta komponen modular (`AccountSettingsSection`, `NotesSection`, `ProgressSection`) agar siswa dapat menyimpan catatan belajar pribadi per bidang, mencatat hasil praktik modul di `/hasil-analisis`, memantau progres kelulusan modul/sertifikasi BNSP, serta menyinkronkan data profil ke server (`/api/profile` & `src/lib/profile-store.ts`).

3. **Integrasi End-to-End Asesmen, Filter Jenjang SMP/SMA/SMK & Kontinuitas Skor**
   - Menghubungkan wizard `/eksplorasi` dan `/tes-keminatan` langsung ke backend `POST /api/assessment/analyze` dengan pencocokan jenjang cerdas di `src/data/catalog.ts` & `src/lib/scoring.ts` (siswa SMP diarahkan ke SMK relevan, siswa SMA/SMK diarahkan ke Perguruan Tinggi).
   - Meneruskan parameter skor nyata (`field`, `score`, `dominant`, `mismatch`) ke `/hasil-analisis`, serta memperluas `src/lib/ai-matcher.ts` mencakup seluruh 11 bidang keilmuan Bali dari 284 entitas direktori sekolah/kampus.

4. **Hardening Keamanan Menyeluruh (Remediasi Temuan Pentest F-01 s.d. F-09)**
   - Membangun modul keamanan `src/lib/api-security.ts` (rate limit sliding window `15 req/menit` per IP, pembatasan konkurensi paralel AI maks 3, pembatasan payload byte 16 KB, verifikasi Origin/Sec-Fetch-Site, serta CORS eksplisit non-wildcard + handler `OPTIONS`).
   - Memperketat validasi skema `Zod` pada `/api/navigator-chat` dan `/api/mentor-agent` agar menolak injeksi `{"role": "system"}` maupun objek anomali dengan HTTP `400`.
   - Menegakkan kebijakan autentikasi di `src/lib/auth.ts`, `/api/auth/register`, `/api/auth/login`, dan `src/lib/useAuth.ts`: kebijakan kata sandi kuat, *brute-force lockout* (HTTP `429` setelah 5 kali gagal login), verifikasi waktu konstan `bcrypt`, pesan konflik seragam anti-enumerasi, serta validasi server untuk peran `guru` (NIP 18 digit + domain email pendidik resmi).
   - Menambahkan header keamanan penuh pada `next.config.ts` & `vercel.json` (`Strict-Transport-Security`, `X-Frame-Options: DENY` / CSP `frame-ancestors 'none'`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, region `sin1` Singapura), serta menyediakan `public/robots.txt`, `public/sitemap.xml`, dan `public/.well-known/security.txt`.

5. **Reliabilitas UI, 4 Boundary States & Automated Security Regression Testing**
   - Melengkapi 4 *boundary states* (Loading Skeleton, Empty State, Error Boundary dengan tombol Kirim Ulang/Coba Ulang, dan Feedback Toast) di halaman-halaman utama.
   - Memperluas suite uji otomatis `tests/smoke.mjs` (`npm run smoke`) hingga **35 skenario pemeriksaan** yang mencakup seluruh rute halaman, API publik, siklus autentikasi & profil, AI Scope Guard, quiz dinamis & verifikasi kemampuan, serta verifikasi otomatis seluruh perbaikan keamanan F-01 s.d. F-09.

6. **Quiz Sertifikasi Dinamis & Verifikasi Kemampuan Berbasis Generate AI (`/api/skill-verification`)**
   - Mengubah mekanisme soal pada tab **Tes Sertifikasi** (`/hasil-analisis`) dari statis menjadi **dinamis** (`src/lib/dynamic-assessment.ts` + `CertificationTab.tsx`): pertanyaan, skenario studi kasus Bali, dan urutan pilihan jawaban A-D terus berotasi/di-generate baru setiap percobaan atau tombol *Acak & Buat Soal Baru*.
   - Menambahkan tab baru **Verifikasi Kemampuan** (`VerificationTab.tsx`) yang terbuka otomatis setelah siswa menyelesaikan **seluruh modul materi dan seluruh unit quiz sertifikasi** pada bidang aktif. Sistem men-generate 4 soal analisis lintas modul serta 1 studi kasus uraian dari catatan praktik siswa, mengevaluasi jawaban secara terverifikasi JWT/HMAC tanpa membocorkan kunci jawaban ke klien, lalu menyimpan lencana skor ke `/profil` dan `/api/profile`.

---

## 2. AI & Technology Disclosure (Versi Final - Lampiran C)

| Komponen | Isi Peserta |
| :--- | :--- |
| **Nama Produk** | KertaMarga Bali (AI Career & Educational Navigator) |
| **Framework / Frontend** | Next.js 15 (App Router), React 19, TypeScript 5.7, Tailwind CSS 3.4 |
| **Backend / Runtime** | Next.js App Router API Routes (Node.js Runtime) + `Zod` & `src/lib/api-security.ts` |
| **Database / Storage** | Drizzle ORM + MySQL / MariaDB (`mysql2`), Persistent JSON Fallback (`data/users.json`, `data/learning-profiles.json` lokal / `/tmp/kertamarga-data`), Browser `localStorage` Sync |
| **Hosting / Deployment** | Vercel Production (Region `sin1` Singapura, HTTPS aktif 24/7) |
| **AI Model / API / Method** | Multi-tier pipeline: 9Router Gateway (`ag/gemini-3-flash`, `ag/gemini-3-flash-agent`, `ag/gemini-3.8-flash-low`, `openrouter/openrouter/free`), Google Gemini REST API (`gemini-3.5-flash-lite`, `gemini-flash-lite-latest`, `gemini-3.5-flash`), AI Scope Guard 2-Lapis (`src/lib/ai-scope-guard.ts`), Skoring Deterministik Multi-Dimensi (`src/lib/scoring.ts`) & Deterministic Fallback Engine |
| **Peran AI dalam Produk** | Menganalisis kesenjangan kesiapan akademik siswa dan merekomendasikan modul/latihan sertifikasi di `/api/mentor-agent`, serta konsultasi interaktif jurusan dan institusi Bali yang dibatasi cakupan topik di `/api/navigator-chat` |
| **Dataset / Data Source** | Data program studi & akreditasi PDDIKTI, BAN-PT, BAN-SM; standar kompetensi BNSP; koordinat geografis 9 kabupaten/kota Bali (284 entitas direktori pendidikan Bali: 61 PT, 108 SMK, 115 SMA + 15 sorotan program katalog = 285 katalog terpadu dalam 11 bidang program) |
| **Open-source Libraries** | `next`, `react`, `react-dom`, `framer-motion`, `gsap`, `@gsap/react`, `lucide-react`, `drizzle-orm`, `mysql2`, `zod`, `jose`, `bcryptjs`, `leaflet`, `@types/leaflet`, `clsx`, `tailwind-merge`, `typescript`, `tailwindcss`, `postcss`, `autoprefixer` |
| **Template / Boilerplate** | Tidak memakai template jadi; struktur dasar dibuat dari `create-next-app` lalu dirancang khusus sesuai arsitektur visual KertaMarga Bali |
| **AI Coding Assistant** | Antigravity AI, Claude, Gemini (digunakan untuk refactoring modular, audit keamanan, type safety TypeScript, penyusunan automated smoke test, dan review kualitas kode) |
| **Pre-existing Components** | Tidak ada komponen produk komersial pra-kompetisi; seluruh fitur dikembangkan khusus untuk Bali DigiFest 2026 |
| **Third-party Assets / Credits** | Integrasi Google Maps Embed API, Geocoding Nominatim OpenStreetMap, `ipwho.is`, Leaflet, Google Fonts (`Outfit`, `Inter`, `JetBrains Mono`), Lucide Icons, serta dokumen modul belajar mandiri pada `public/pustaka-modul/` |

Pernyataan: Kami menyatakan bahwa informasi di atas benar dan lengkap. Kami bertanggung jawab atas penggunaan teknologi, source code, data, library, API, model AI, dan aset yang digunakan pada produk.
