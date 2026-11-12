# Panduan Persiapan Technical Verification & Q&A Tim (Tahap 2)

Dokumen ini memastikan seluruh anggota tim (**Sabbil Abdillah Ferdyansyah**, **I Made Yuda Pramana**, **Nathanael Joan**) memahami cara kerja aplikasi, source code, keputusan teknis, dan siap menjawab uji langsung juri sesuai ketentuan halaman 9 panduan Bali DigiFest 2026.

> Catatan penting: Sesi Technical Verification **bukan presentasi ulang pitch deck**. Fokus juri adalah menguji keaslian produk, membuka source code, mencoba input baru di luar video demo, dan menguji pemahaman semua anggota tim.

---

## 1. Peta Lokasi Source Code Utama (Wajib Dihafal Tim)

| Pertanyaan Juri | File & Fungsi Kunci yang Ditunjukkan |
| :--- | :--- |
| **Di mana proses AI call utama berjalan?** | `src/app/api/mentor-agent/route.ts` (endpoint `POST`) dan `src/app/api/navigator-chat/route.ts` (endpoint `POST`), keduanya memanggil pipeline router di `src/lib/router-client.ts` (`callRouterWithFailover`) serta fallback ke Google Gemini REST API. |
| **Di mana logika skoring & jarak kampus?** | `src/lib/scoring.ts` (`analyzeAssessment`), dipanggil lewat API `src/app/api/assessment/analyze/route.ts` oleh halaman `src/app/eksplorasi/page.tsx`, serta perhitungan jarak Haversine `estimateDistanceKm` di `src/data/catalog.ts`. |
| **Di mana matcher rekomendasi panel samping AI Navigator?** | `src/lib/ai-matcher.ts` (`matchNavigator`) yang memetakan kata kunci dan `fieldId` ke 11 bidang keilmuan Bali tanpa mengarang akreditasi. |
| **Bagaimana autentikasi & penyimpanan data user bekerja?** | `src/lib/auth.ts` (hashing `bcryptjs`, JWT `jose` HS256 dalam cookie `httpOnly`), dan `src/lib/db.ts` (Drizzle ORM + MySQL dengan persistent file storage fallback di `data/users.json` / `/tmp`). |
| **Di mana antarmuka utama user?** | Landing page (`src/app/page.tsx`), Wizard Asesmen (`src/app/eksplorasi/page.tsx`), Bimbingan & Modul PDF (`src/app/hasil-analisis/page.tsx`), Konsultasi AI (`src/app/ai-navigator/page.tsx`), Peta Bidang (`src/app/peta-bidang/[id]/page.tsx`), dan Katalog (`src/app/katalog/page.tsx`). |

---

## 2. Jawaban Terstruktur untuk 6 Skenario Pertanyaan Wajib Juri

al dan variabel lingkungan di Vercel (`.env` / Vercel Env Vars) sudah terisi `GEMINI_API_KEY` (dan router jika dipakai) serta `AUTH_SECRET`.
- [ ] Jika menggunakan akun demo khusus juri di luar Mode Tamu, `DEMO_SEED_USERS_JSON` sudah diset di Vercel Env dan kredensial dikirim melalui kanal resmi panitia (bukan di repo publik).
- [ ] `npx tsc --noEmit`, `npm run build`, dan `npm run smoke` lulus 100% pada commit yang di-tag `v2.0-final`.
- [ ] Ketiga anggota tim sudah mencoba langsung alur `/eksplorasi` -> `/hasil-analisis` -> `/ai-navigator` dan mampu membuka masing-masing file kode di atas saat share screen.
