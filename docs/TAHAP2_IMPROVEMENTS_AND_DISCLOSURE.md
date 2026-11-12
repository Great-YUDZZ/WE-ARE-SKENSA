# Catatan Improvement Tahap 1 ke Tahap 2 & AI Technology Disclosure Final

Dokumen ini disiapkan sebagai pelengkap Final Submission **Bali DigiFest 2026: AI Web Innovation Challenge** untuk produk **KertaMarga Bali** (Kategori SMA/SMK/Sederajat, Tim SMK Negeri 1 Denpasar).

---

## 1. Catatan Singkat Improvement dari Tahap 1 (`v1.0-submission`) ke Tahap 2

Berdasarkan evaluasi pasca penyisihan dan persiapan menuju penjurian final, peningkatan utama yang dilakukan pada Tahap 2 meliputi:

1. **Ketahanan Pipeline AI & Failover Multi-Tier (AI Implementation)**:
   - Menambahkan klien router tangguh (`src/lib/router-client.ts`) dengan mekanisme failover berjenjang, circuit breaker/cooldown untuk proteksi rate-limit 429, jitter, serta in-memory LRU response cache dengan TTL.
   - Menghubungkan `/api/navigator-chat` dan `/api/mentor-agent` ke arsitektur multi-tier (Gateway Router -> Google Gemini API -> Deterministic Rule Engine) agar layanan tetap merespons terstruktur meski salah satu provider mengalami gangguan.
   - *(Catatan sinkronisasi tim: detail final model/provider AI akan dikunci bersama commit AI terakhir sebelum pembuatan tag `v2.0-final`).*

2. **Integrasi End-to-End Alur Asesmen & Kontinuitas Skor**:
   - Menghubungkan wizard `/eksplorasi` secara langsung ke endpoint backend `POST /api/assessment/analyze`, tidak lagi hanya kalkulasi lokal di browser.
   - Meneruskan parameter skor kesiapan nyata (`field`, `score`, `dominant`, `mismatch`) dari hasil `/eksplorasi` ke halaman bimbingan `/hasil-analisis`, sehingga diagnosis agen pembimbing konsisten dengan hasil kuesioner siswa.
   - Memperluas `src/lib/ai-matcher.ts` dari 5 bidang menjadi seluruh 11 bidang keilmuan dan kejuruan Bali serta memperbaiki normalisasi nama kabupaten pada `estimateDistanceKm()` di `src/data/catalog.ts` agar estimasi jarak antar 9 kabupaten/kota Bali terhitung akurat.

3. **Reliabilitas UI, 4 Boundary States, & Kepatuhan Keamanan**:
   - Melengkapi 4 boundary states (Loading Skeleton, Empty State, Error Boundary dengan tombol Coba Ulang, dan Feedback Toast) di `/eksplorasi`, `/ai-navigator`, dan `/hasil-analisis`.
   - Menghapus seluruh kredensial demo hardcoded dari source code publik (`src/components/LoginModal.tsx` dan `src/lib/db.ts`) dan memindahkannya ke konfigurasi opsional Environment Variables (`DEMO_SEED_USERS_JSON`), sementara Mode Tamu Anonim tetap tersedia tanpa login.
   - Memperbaiki sinkronisasi state Navbar autentikasi (`src/lib/useAuth.ts`, `src/components/Navbar.tsx`) serta persistent storage fallback (`data/users.json` / `/tmp`) untuk lingkungan tanpa MySQL aktif.

4. **Reproducibility & Automated Smoke Testing**:
   - Menambahkan skrip uji otomatis `tests/smoke.mjs` (`npm run smoke`) yang memverifikasi seluruh rute halaman utama, API katalog/asesmen/pustaka/AI, dan siklus autentikasi (Register -> Me -> Login -> Logout), serta memperbaiki `npm run lint` (`tsc --noEmit`) agar berjalan non-interaktif.

---

## 2. AI & Technology Disclosure (Versi Final - Lampiran C)

| Komponen | Isi Peserta |
| :--- | :--- |
| **Nama Produk** | KertaMarga Bali (AI Career & Educational Navigator) |
| **Framework / Frontend** | Next.js 15 (App Router), React 19, TypeScript 5.7, Tailwind CSS 3.4 |
| **Backend / Runtime** | Next.js App Router API Routes (Node.js Runtime) |
| **Database / Storage** | Drizzle ORM + MySQL (`mysql2`) dengan fallback persistent JSON store (`data/users.json` / `/tmp`) dan in-memory cache |
| **Hosting / Deployment** | Vercel Production (HTTPS aktif 24/7) |
| **AI Model / API / Method** | Multi-tier pipeline: 9Router OpenAI-compatible gateway (`ag/gemini-3-flash`, `ag/gemini-3-flash-agent`, `openrouter/openrouter/free`) + Google Gemini REST API (`gemini-3.5-flash-lite` / `gemini-flash-lite-latest`) + Skoring Deterministik Multi-Dimensi (`src/lib/scoring.ts`) & Deterministic Fallback Engine |
| **Peran AI dalam Produk** | Menganalisis kesenjangan kesiapan akademik siswa dan merekomendasikan modul/latihan sertifikasi di `/api/mentor-agent`, serta konsultasi interaktif jurusan dan institusi Bali di `/api/navigator-chat` |
| **Dataset / Data Source** | Data program studi & akreditasi PDDIKTI, BAN-PT, BAN-SM; standar kompetensi BNSP; koordinat geografis 9 kabupaten/kota Bali (284 institusi direktori pendidikan Bali + 15 sorotan program audit = 285 katalog terpadu dalam 11 bidang program) |
| **Open-source Libraries** | `next`, `react`, `react-dom`, `framer-motion`, `gsap`, `@gsap/react`, `lucide-react`, `drizzle-orm`, `mysql2`, `zod`, `jose`, `bcryptjs`, `leaflet`, `clsx`, `tailwind-merge`, `typescript`, `tailwindcss` |
| **Template / Boilerplate** | Tidak memakai template jadi; struktur dasar dibuat dari `create-next-app` lalu dirancang khusus sesuai arsitektur AetherCraft & Neo-Pop KertaMarga Bali |
| **AI Coding Assistant** | Antigravity AI, Claude, Gemini (digunakan untuk refactoring modular, type safety TypeScript, penyusunan test smoke, dan review kualitas kode) |
| **Pre-existing Components** | Tidak ada komponen produk komersial pra-kompetisi; seluruh fitur dikembangkan untuk Bali DigiFest 2026 |
| **Third-party Assets / Credits** | Integrasi Google Maps Embed & Geocoding Nominatim/ipwho.is (+ peta fallback Leaflet), Google Fonts (Outfit & Inter), dokumen modul belajar mandiri pada `public/pustaka-modul/` |

Pernyataan: Kami menyatakan bahwa informasi di atas benar dan lengkap. Kami bertanggung jawab atas penggunaan teknologi, source code, data, library, API, model AI, dan aset yang digunakan pada produk.
