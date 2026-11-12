# Panduan Persiapan Technical Verification & Q&A Tim (Tahap 2)

Dokumen ini memastikan seluruh anggota tim (**Sabbil Abdillah Ferdyansyah**, **I Made Yuda Pramana**, **Nathanael Joan**) memahami cara kerja aplikasi, source code, keputusan teknis, keamanan, dan siap menjawab uji langsung juri sesuai ketentuan halaman 9 panduan Bali DigiFest 2026.

> Catatan penting: Sesi Technical Verification **bukan presentasi ulang pitch deck**. Fokus juri adalah menguji keaslian produk, membuka source code, mencoba input baru di luar video demo, dan menguji pemahaman semua anggota tim.

---

## 1. Peta Lokasi Source Code Utama (Wajib Dihafal Tim)

| Pertanyaan Juri | File & Fungsi Kunci yang Ditunjukkan |
| :--- | :--- |
| **Di mana proses AI call utama berjalan?** | `src/app/api/mentor-agent/route.ts`, `src/app/api/navigator-chat/route.ts`, dan `src/app/api/skill-verification/route.ts` (endpoint `POST`), seluruhnya memanggil pipeline router di `src/lib/router-client.ts` (`callRouterWithFailover`) serta fallback Google Gemini REST API (`callGeminiDirectWithFailover`, default `gemini-3.5-flash-lite`). |
| **Bagaimana quiz sertifikasi dibuat dinamis & fitur verifikasi kemampuan bekerja?** | `src/lib/dynamic-assessment.ts` (`generateDynamicQuizSet`, `generateCompetencyVerification`, `evaluateCompetencyVerification`) merotasi/men-generate soal baru tiap percobaan, mengunci fitur verifikasi hingga seluruh modul & quiz selesai (`checkVerificationEligibility`), serta mengamankan kunci jawaban dalam token JWT HS256 agar tidak bocor ke klien. |
| **Bagaimana AI dibatasi agar tidak menjawab di luar topik / prompt injection?** | Validasi skema `Zod` ketat pada route AI (menolak `"role": "system"`) digabungkan dengan guard 2-lapis di `src/lib/ai-scope-guard.ts` (`evaluateAiScope`) yang menyaring jailbreak/off-topic sebelum LLM dipanggil dan menyisipkan pembatasan `inScope` di `systemInstruction`. |
| **Di mana rate limit, CORS, & keamanan API diimplementasikan?** | `src/lib/api-security.ts` (`checkSlidingRateLimit`, `acquireAiConcurrencySlot`, `verifyRequestOrigin`, `handleCorsPreflight`, `readBoundedJsonBody`) serta header HTTP & CSP di `next.config.ts` dan `vercel.json`. |
| **Di mana logika skoring, filter jenjang & jarak kampus?** | `src/lib/scoring.ts` (`analyzeAssessment`), dipanggil lewat API `src/app/api/assessment/analyze/route.ts` oleh halaman `src/app/eksplorasi/page.tsx`, serta filter SMP/SMA/SMK & jarak Haversine `estimateDistanceFromOrigin` di `src/data/catalog.ts`. |
| **Bagaimana autentikasi, verifikasi role & penyimpanan profil belajar bekerja?** | `src/lib/auth.ts` (`validatePasswordStrength`, `resolveVerifiedRole`, `checkLoginLockout`, `bcryptjs`, JWT `jose` HS256 cookie `httpOnly`), `src/lib/db.ts` (Drizzle + MySQL fallback JSON), serta `src/app/api/profile/route.ts` & `src/lib/profile-store.ts` untuk catatan pembelajaran di `/profil`. |
| **Di mana antarmuka utama user?** | Landing (`src/app/page.tsx`), Wizard Asesmen (`src/app/eksplorasi/page.tsx`), Bimbingan & Modul (`src/app/hasil-analisis/page.tsx`), Konsultasi AI (`src/app/ai-navigator/page.tsx`), Profil & Catatan (`src/app/profil/page.tsx`), Peta Bidang (`src/app/peta-bidang/page.tsx`, `[id]/page.tsx`), dan Katalog (`src/app/katalog/page.tsx`). |

---

## 2. Jawaban Terstruktur untuk 6 Skenario Pertanyaan Wajib Juri

1. **"Apa yang terjadi jika koneksi API AI (9Router atau Gemini) mengalami gangguan atau rate limit saat demo?"**
   - Pipeline di `src/lib/router-client.ts` menerapkan budget waktu ketat per permintaan (mencegah timeout serverless 504), circuit breaker cooldown per model, dan fallback multi-tier: `9Router` -> `Google Gemini REST API (gemini-3.5-flash-lite)` -> `Deterministic Rule Engine` terverifikasi di `/api/mentor-agent` dan `/api/navigator-chat`. Siswa tetap memperoleh jawaban terstruktur tanpa crash.

2. **"Bagaimana cara membuktikan AI tidak mengarang data akreditasi sekolah/kampus atau jarak?"**
   - AI LLM hanya menghasilkan narasi konsultasi/bimbingan (`reply` / `replyMessage`) dan tag `matchedFieldId`. Seluruh nama kampus, akreditasi resmi BAN-PT/BAN-SM, prodi, dan koordinat diambil langsung dari dataset deterministik (`src/data/bali-institutions.ts` & `src/data/catalog.ts`, 284 entitas + sorotan prodi = 285 katalog terkurasi), serta jarak dihitung matematis dengan formula Haversine (`estimateDistanceFromOrigin`).

3. **"Bagaimana produk mencegah penyalahgunaan AI untuk pertanyaan di luar konteks atau prompt injection?"**
   - Permintaan ke `/api/navigator-chat` dan `/api/mentor-agent` disaring terlebih dahulu oleh skema `Zod` (hanya menerima `role: "user" | "assistant"`, menolak `"role": "system"`), pembatasan ukuran body 16 KB, rate limit 15 req/menit per IP + maks 3 request paralel, serta 2-Layer Scope Guard (`src/lib/ai-scope-guard.ts`) sehingga pertanyaan non-pendidikan/jailbreak langsung ditolak sopan sebelum membakar kuota LLM.

4. **"Mengapa skor kecocokan bisa berubah sesuai bobot, jenjang, dan lokasi user?"**
   - Pada `src/lib/scoring.ts` (`analyzeAssessment`), tiap jawaban kuesioner dan refleksi teks memberi kontribusi poin per klaster bidang, difilter sesuai jenjang saat ini (SMP diarahkan ke SMK relevan, SMA/SMK ke PT), lalu digabung dengan pembobotan dinamis prioritas siswa (`matchWeight`, `distanceWeight`, `costWeight`) dan jarak riil ke institusi terkait di Bali.

5. **"Bagaimana alur keamanan akun & privasi data siswa SMP/SMA/SMK?"**
   - Mode Tamu Anonim tersedia di seluruh fitur utama tanpa mewajibkan login. Untuk pengguna terdaftar (`/api/auth/register` & `/api/auth/login`), kata sandi di-hash dengan `bcryptjs`, sesi memakai cookie `httpOnly` JWT HS256 (`jose`), eskalasi peran `guru` diverifikasi server dengan NIP 18 digit + email institusi resmi, percobaan gagal berulang dikunci (lockout HTTP 429), dan seluruh respons web dilindungi CSP + `X-Frame-Options: DENY`.

6. **"Bagaimana cara memverifikasi kualitas kode & keamanan sebelum rilis ke produksi?"**
   - Menggunakan TypeScript strict check (`npm run lint` / `tsc --noEmit`), production Next.js build (`npm run build`), serta suite uji otomatis end-to-end **35 pemeriksaan** (`npm run smoke` di `tests/smoke.mjs`) yang memvalidasi seluruh halaman, API fungsional, AI Scope Guard, quiz dinamis & verifikasi kemampuan, serta regresi keamanan pentest F-01 s.d. F-09.

---

## 3. Checklist Kesiapan Sebelum Live Demo & Technical Verification

- [x] `npm run lint` (`npx tsc --noEmit`), `npm run build`, dan `npm run smoke` (35/35 checks) lulus 100% pada rilis final.
- [x] `.env.example` bersih tanpa secret asli, namun seluruh nama variabel lingkungan terdokumentasi lengkap.
- [ ] Variabel lingkungan di Vercel (`GEMINI_API_KEY`, `AUTH_SECRET`, `ROUTER_API_BASE` jika aktif) terisi di dashboard Vercel (tidak pernah di repo GitHub).
- [ ] Ketiga anggota tim sudah mencoba langsung alur `/eksplorasi` -> `/hasil-analisis` -> `/ai-navigator` -> `/profil` dan mampu menunjukkan masing-masing file kode di atas saat *share screen*.
