# Panduan Persiapan Technical Verification & Q&A Tim (Tahap 2)

Dokumen ini memastikan seluruh anggota tim (**Sabbil Abdillah Ferdyansyah**, **I Made Yuda Pramana**, **Nathanael Joan**) memahami cara kerja aplikasi, source code, keputusan teknis, dan siap menjawab uji langsung juri sesuai ketentuan halaman 9 panduan Bali DigiFest 2026.

> Catatan penting: Sesi Technical Verification **bukan presentasi ulang pitch deck**. Fokus juri adalah menguji keaslian produk, membuka source code, mencoba input baru di luar video demo, dan menguji pemahaman semua anggota tim.

---

## 1. Peta Lokasi Source Code Utama (Wajib Dihafal Tim)

| Pertanyaan Juri | File & Fungsi Kunci yang Ditunjukkan |
| :--- | :--- |
| **Di mana proses AI call utama berjalan?** | `src/app/api/mentor-agent/route.ts` (endpoint `POST`) dan `src/app/api/navigator-chat/route.ts` (endpoint `POST`), keduanya memanggil pipeline router di `src/lib/router-client.ts` (`callRouterWithFailover`) serta fallback ke Google Gemini REST API (`gemini-3.5-flash-lite`). |
| **Di mana logika skoring & jarak kampus?** | `src/lib/scoring.ts` (`analyzeAssessment`), dipanggil lewat API `src/app/api/assessment/analyze/route.ts` oleh halaman `src/app/eksplorasi/page.tsx`, serta perhitungan jarak Haversine `estimateDistanceFromOrigin` dan `estimateDistanceKm` di `src/data/catalog.ts`. |
| **Di mana matcher rekomendasi panel samping AI Navigator?** | `src/lib/ai-matcher.ts` (`matchNavigator`) yang memetakan kata kunci batas kata (word-boundary) dan `fieldId` ke 11 bidang keilmuan Bali tanpa mengarang akreditasi. |
| **Bagaimana autentikasi & penyimpanan data user bekerja?** | `src/lib/auth.ts` (hashing `bcryptjs`, JWT `jose` HS256 dalam cookie `httpOnly`), dan `src/lib/db.ts` (Drizzle ORM + MySQL dengan timeout koneksi cepat `connectTimeout` dan persistent file storage fallback di `data/users.json` / `/tmp`). |
| **Di mana antarmuka utama user?** | Landing page (`src/app/page.tsx`), Wizard Asesmen (`src/app/eksplorasi/page.tsx`), Bimbingan & Modul PDF (`src/app/hasil-analisis/page.tsx`), Konsultasi AI (`src/app/ai-navigator/page.tsx`), Peta Bidang (`src/app/peta-bidang/page.tsx`, `src/app/peta-bidang/[id]/page.tsx`), dan Katalog (`src/app/katalog/page.tsx`). |

---

## 2. Jawaban Terstruktur untuk 6 Skenario Pertanyaan Wajib Juri

1. **"Apa yang terjadi jika koneksi API AI (9Router atau Gemini) mengalami gangguan atau rate limit saat demo?"**
   - Pipeline di `src/lib/router-client.ts` menerapkan budget waktu ketat per permintaan (mencegah timeout serverless 504), circuit breaker/cooldown otomatis per model, dan fallback multi-tier: `9Router` -> `Google Gemini REST API (gemini-3.5-flash-lite)` -> `Deterministic Rule Engine` terverifikasi di `/api/mentor-agent` dan `/api/navigator-chat`. Siswa tetap memperoleh jawaban terstruktur tanpa crash.

2. **"Bagaimana cara membuktikan AI tidak mengarang data akreditasi sekolah/kampus atau jarak?"**
   - AI LLM hanya menghasilkan narasi konsultasi/bimbingan (`reply` / `replyMessage`) dan tag `matchedFieldId`. Seluruh nama kampus, akreditasi resmi BAN-PT/BAN-SM, prodi, dan koordinat diambil langsung dari dataset deterministik (`src/data/bali-institutions.ts` & `src/data/catalog.ts`, 284 entitas + 1 program showcase = 285 katalog terkurasi), serta jarak dihitung secara matematis dengan formula Haversine (`estimateDistanceFromOrigin`).

3. **"Mengapa skor kecocokan bisa berubah sesuai bobot dan lokasi user?"**
   - Pada `src/lib/scoring.ts` (`analyzeAssessment`), tiap jawaban kuesioner dan refleksi teks memberi kontribusi poin per klaster bidang, lalu digabung dengan pembobotan dinamis prioritas siswa (`matchWeight`, `distanceWeight`, `costWeight`) dan jarak riil ke institusi terkait di 9 kabupaten/kota Bali.

4. **"Bagaimana alur keamanan akun & privasi data siswa SMP/SMA/SMK?"**
   - Mode Tamu Anonim tersedia di seluruh fitur eksplorasi, hasil analisis, dan AI Navigator tanpa mewajibkan login. Jika siswa membuat akun (`/api/auth/register`), password di-hash dengan `bcryptjs`, validasi skema menggunakan `zod`, sesi disimpan via cookie `httpOnly` JWT HS256 (`jose`), dan tidak ada kredensial demo tertanam di repositori publik.

5. **"Bagaimana aplikasi menangani perangkat lambat atau MySQL yang tidak aktif?"**
   - Klien database (`src/lib/db.ts`) memakai `connectTimeout: 2500` agar otomatis turun ke fallback file JSON persisten (`data/users.json` lokal atau `/tmp/kertamarga-data` di serverless) tanpa menahan respons login/register. Semua halaman utama juga dilengkapi loading skeleton, error boundary dengan tombol muat ulang, dan mode responsif mobile/desktop.

6. **"Bagaimana cara memverifikasi kualitas kode sebelum rilis ke produksi?"**
   - Menggunakan TypeScript strict check (`npm run lint` / `tsc --noEmit`), production Next.js build (`npm run build`), serta suite uji otomatis end-to-end 26 pemeriksaan (`npm run smoke` di `tests/smoke.mjs`).

---

## 3. Checklist Kesiapan Sebelum Live Demo & Technical Verification

- [ ] File `.env.local` dan variabel lingkungan di Vercel Env Vars sudah terisi `GEMINI_API_KEY` (serta `ROUTER_API_BASE` publik / `ROUTER_MODEL` bila router aktif) dan `AUTH_SECRET`.
- [ ] Jika menggunakan akun demo khusus juri di luar Mode Tamu, `DEMO_SEED_USERS_JSON` sudah diset di Vercel Env dan kredensial dikirim melalui kanal resmi panitia (bukan di repo publik).
- [ ] `npm run lint` (`npx tsc --noEmit`), `npm run build`, dan `npm run smoke` lulus 100% pada commit rilis final.
- [ ] Ketiga anggota tim sudah mencoba langsung alur `/eksplorasi` -> `/hasil-analisis` -> `/ai-navigator` dan mampu membuka masing-masing file kode di atas saat share screen.
