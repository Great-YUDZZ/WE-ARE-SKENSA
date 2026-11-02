# Panduan Konteks Agen AI: KertaMarga Bali

Berkas ini adalah instruksi operasional resmi bagi setiap agen AI atau subagent yang bekerja di repositori `/var/www/mega-project`. Baca berkas ini sebelum melakukan perubahan kode atau arsitektur.

---

## 1. Identitas Proyek dan Ajang Lomba

- **Nama Platform:** KertaMarga Bali (AI Career & Educational Navigator)
- **Ajang Lomba:** Bali DigiFest 2026: AI Web Innovation Challenge (*Build with AI, Solve for Bali*)
- **Kategori Lomba:** Pendidikan (Kategori SMA/SMK/sederajat, tim 3 siswa SMK Negeri 1 Denpasar)
- **Tujuan Produk:** Platform navigasi penjurusan dan karier terpadu untuk siswa SMP, SMA, dan SMK se-Bali yang menggabungkan skoring deterministik berbasis data resmi PDDIKTI/BAN-PT dengan analisis penalaran AI transparan.
- **Repositori Git:** `https://github.com/Great-YUDZZ/WE-ARE-SKENSA` (branch `main`)
- **Tautan Konteks Obsidian Vault:** `/home/yudz/Documents/context project/My Project/mega-project/`

---

## 2. Stack Teknologi dan Perkakas

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS dengan sistem token semantik khusus (dilarang menggunakan styling ad-hoc)
- **Animasi & Motion:** Framer Motion (modal, transisi mikro) dan GSAP
- **Mesin AI:** `@google/genai` Gemini SDK dengan skema Structured Output (JSON Schema)
- **Peta Interaktif:** Google Maps Embed URL resmi tanpa kuota API key (konsisten dengan proyek Skensa Jaya)
- **Basis Data:** Drizzle ORM + SQLite
- **Alat Bantu Desain Live:** FigCraft MCP (`/var/www/mega-project/design/kertamarga-bali-digifest.figcraft`)

---

## 3. Aturan Desain & Antarmuka (AetherCraft Protocol)

### Larangan Keras (Anti-Slop)
- Dilarang menggunakan desain glassmorphism (tanpa `backdrop-blur` tebal, tanpa kartu transparan murahan).
- Dilarang menggunakan gradien ungu-biru generic AI slop.
- Dilarang menggunakan emoji pada kode, komentar, antarmuka pengguna, maupun dokumentasi vault.
- Dilarang menggunakan em dash (simbol tanda pisah panjang). Gunakan tanda baca biasa seperti koma, titik, atau titik dua.

### Sistem Token Warna Semantik
Warna digunakan untuk objek penanda (chip, titik peta, langkah alur, badge prodi), bukan untuk badan teks panjang:
1. **Merah (`#D7263D` / `#FF5A6B`):** Tombol aksi utama CTA, kelompok prodi Manusia & Budaya, teks di atasnya putih.
2. **Kuning (`#FFC93C` / `#FFD25E`):** Tombol aksi "Buat akun", chip minat aktif, band penutup CTA, teks di atasnya tinta (`#1B1B2F`), dilarang teks putih di atas kuning.
3. **Biru (`#2D6CDF` / `#6C9BFF`):** Slider kecocokan minat, kelompok prodi Teknologi & Rancang, teks di atasnya putih.
4. **Hijau (`#2E9E6B` / `#4CC992`):** Slider jarak tempuh, status badge aktif, kelompok prodi Alam & Pangan. Varian teks kontras tinggi: `#1F7A52`.
5. **Netral:**
   - Mode Terang: Latar `#FFFDF8`, kartu `#FFFFFF`, tinta `#1B1B2F`, teks sekunder `#5A5A70`, garis border `#E6E1D6`.
   - Mode Gelap: Latar `#14141F`, kartu `#1F1F2E`, tinta `#F4F2EA`, teks sekunder `#A8A8BA`, garis border `#2E2E42`.

### Tipografi
- Display / Headings: `Outfit`
- Body Text: `Inter`
- Code / Data Label / Akreditasi: `JetBrains Mono`

---

## 4. Peta Struktur Berkas dan Komponen

```
/var/www/mega-project/
├── AGENT.md                       # Panduan konteks utama agen AI (berkas ini)
├── package.json                   # Dependensi Next.js, React, Tailwind, Framer Motion
├── tailwind.config.ts             # Definisi token semantik dan font family
├── design/                        # Berkas automasi FigCraft & aset export PNG
├── design-system/                 # Dokumentasi token sistem desain Master
└── src/
    ├── app/
    │   ├── layout.tsx             # Root layout dengan konfigurasi font dan token latar
    │   ├── globals.css            # Variabel CSS tema terang dan gelap
    │   ├── page.tsx               # Halaman utama (Landing Page Youform-style)
    │   └── ai-navigator/
    │       └── page.tsx           # Halaman khusus konsultasi dan penalaran AI
    ├── components/
    │   ├── Navbar.tsx             # Navbar solid Youform (Logo Jepun, link, AI shortcut, Login, Buat Akun)
    │   ├── ThemeToggle.tsx        # Toggle mode gelap dan terang
    │   ├── LoginModal.tsx         # Modal autentikasi dengan mode Login, Buat Akun, dan Tamu Anonim
    │   ├── BaliInteractiveMap.tsx # Peta Google Maps terintegrasi 15 institusi 9 kabupaten/kota Bali
    │   ├── HowItWorksSection.tsx  # Alur cara kerja 4 langkah dengan token 4 warna
    │   ├── PrioritySimulatorSection.tsx # Simulator prioritas bobot (Kecocokan, Jarak, Biaya)
    │   ├── ClosingCtaBand.tsx     # Band penutup kuning hangat dengan CTA
    │   └── JepunMascot.tsx        # Maskot interaktif Bunga Jepun Bali
    └── data/
        └── fields.ts              # Dataset 10 bidang keahlian dan 15 institusi di Bali
```

---

## 5. Metodologi AI dan Batasan Etis (Guardrails)

1. **AI adalah Fasilitator Eksplorasi, Bukan Hakim:** Sistem tidak mendiagnosis kepribadian siswa atau menentukan kelulusan secara mutlak.
2. **Katalog Bersumber Resmi:** Akreditasi, fakultas, dan nama jurusan ditarik dari data resmi PDDIKTI, BAN-PT, dan BAN-SM. AI dilarang mengarang akreditasi institusi.
3. **Structured Output:** Seluruh respon analitik dari model Gemini diolah melalui format JSON terstruktur yang tervalidasi skemanya sebelum disajikan ke pengguna.
4. **Fallback Deterministik:** Jika API AI tidak merespon atau terjadi gangguan jaringan, aplikasi tetap berfungsi normal menggunakan kalkulasi aturan terstruktur (rule-based recommendation).
5. **Privasi Siswa:** Tidak meminta alamat rumah presisi atau data pribadi sensitif. Opsi mode tamu anonim selalu tersedia.

---

## 6. Prosedur Kerja Agen AI (Workflow Protocol)

1. **Baca Konteks Sebelum Eksekusi:** Selalu periksa `AGENT.md` dan catatan konteks di Obsidian Vault sebelum memulai tugas baru.
2. **Verifikasi Build:** Setiap kali memodifikasi kode TypeScript atau styling, wajib menjalankan `npm run build` untuk memastikan tidak ada kesalahan kompilasi atau regresi tampilan.
3. **Sinkronisasi Git:** Lakukan commit dengan pesan terstruktur (*Conventional Commits*) dan push ke remote `origin main` setelah tugas selesai.
4. **Catat Balik ke Vault:** Dokumentasikan keputusan teknis penting ke dalam Obsidian Vault di `/home/yudz/Documents/context project/My Project/mega-project/`.
