# Design System Master: Kompas Pendidikan Bali (KertaMarga)

- **Project:** Platform Eksplorasi Jurusan dan Pendidikan (Bali DigiFest 2026)
- **Category:** SMA/SMK/sederajat (3 Anggota)
- **Stack:** Next.js (App Router, React 19, TypeScript) + Tailwind CSS + Framer Motion + GSAP + Drizzle ORM + `@google/genai`
- **Design Read:** Interactive Education & Career Exploration Web App for Bali SMP/SMA/SMK students and DigiFest judges, in a Warm Editorial Terracotta & Deep Volcanic Basalt Cartographic language, dial `ENERGY 2 / RHYTHM 3 / MOTION 2`.

---

## 1. Visual & Interaction Theses

### Visual Thesis
Antarmuka eksplorasi bergaya **Warm Lontar Editorial & Cartographic Precision** dengan dasar kanvas krem lontar (`#F8F6F1`), tipografi kombinasi serif editorial (`Playfair Display` / `Merriweather`) untuk judul naratif dan sans presisi (`Inter`) untuk kuesioner, aksen utama **Bali Terracotta (`#C84B31`)** untuk aksi kunci, serta panel kontras **Volcanic Basalt (`#14181D`)** khusus untuk transparansi audit AI dan jejak sumber data, menggunakan garis tepi tegas `1px` tanpa gradien ungu-biru, tanpa full-screen blur, dan tanpa bayangan mengambang.

### Interaction Thesis
Transisi langkah kuesioner cepat dan taktil (`180-260ms`, `cubic-bezier(0.2, 0, 0, 1)`), perubahan urutan kartu institusi secara instan menggunakan Framer Motion `layout` saat pengguna menggeser slider bobot prioritas, pengungkapan peta bidang bertahap dengan GSAP `ScrollTrigger` (`power2.out`, stagger `0.08s`), tanpa efek memantul (no bounce/elastic) atau animasi berulang tanpa henti (no endless loops), serta degradasi penuh ke perubahan opasitas instan saat `prefers-reduced-motion: reduce` aktif.

---

## 2. Color Tokens & Contrast Verification (WCAG AA/AAA)

| Token Name | Hex | Role & Written Purpose (R-31) | Contrast Verification |
|---|---|---|---|
| `bg.canvas` | `#F8F6F1` | Latar utama kertas lontar hangat agar nyaman dibaca siswa saat mengisi kuesioner panjang | Base surface |
| `bg.surface` | `#FFFFFF` | Permukaan kartu utama, tabel perbandingan institusi, dan kontainer pertanyaan aktif | `1.08:1` vs canvas (dipertegas border `#DFD9CC`) |
| `bg.subtle` | `#EFECE4` | Permukaan well/inset untuk kontrol filter, slider bobot, dan informasi sekunder | Base secondary surface |
| `bg.basalt` | `#14181D` | Permukaan kontras tinggi khusus untuk Drawer Audit AI, Header Navigasi, dan Inspector Juri | `16.4:1` vs `#F8F6F1` (AAA) |
| `bg.basaltCard` | `#1E242B` | Kartu dalam pada Drawer Transparansi AI dan panel skema JSON | `13.2:1` vs `#F8F6F1` (AAA) |
| `text.primary` | `#14181D` | Teks utama (judul, soal kuesioner, nama institusi, alasan rekomendasi) | `16.4:1` on `#F8F6F1`, `17.8:1` on `#FFFFFF` (AAA) |
| `text.secondary` | `#464E59` | Teks penjelasan, deskripsi program, dan rincian metodologi | `7.8:1` on `#F8F6F1`, `8.4:1` on `#FFFFFF` (AAA) |
| `text.muted` | `#626A77` | Metadata tanggal verifikasi, label sumbu, dan petunjuk input | `5.1:1` on `#F8F6F1`, `5.5:1` on `#FFFFFF` (AA) |
| `border.default` | `#DFD9CC` | Garis pemisah struktural 1px antar kartu dan tabel | Structural boundary |
| `border.strong` | `#B8B0A0` | Garis tepi input aktif dan pembatas tabel utama | `3.1:1` UI boundary |
| `accent.terracotta` | `#C84B31` | Satu-satunya warna aksen utama untuk tombol aksi primer dan penanda langkah aktif | `4.86:1` with `#FFFFFF` text (AA) |
| `accent.terracottaSoft` | `#FBECE8` | Latar highlight untuk opsi kuesioner yang sedang dipilih pengguna | `14.1:1` with `#14181D` text |
| `status.verifiedBg` | `#E6F4ED` | Latar lencana sumber data institusi yang telah diverifikasi | Paired with `#14593D` |
| `status.verifiedText` | `#14593D` | Teks lencana `Terverifikasi (Sumber Resmi)` | `7.2:1` on `#E6F4ED` (AAA) |
| `status.cautionBg` | `#FDF2DF` | Latar lencana rentang keyakinan dan ketidakpastian AI | Paired with `#854D0E` |
| `status.cautionText` | `#854D0E` | Teks lencana `Rentang Eksplorasi / Perlu Cek Ulang` | `6.4:1` on `#FDF2DF` (AA) |
| `status.missingBg` | `#EAE6DF` | Latar status faktor institusi yang datanya belum tersedia | Paired with `#3F4752` |
| `status.missingText` | `#3F4752` | Teks lencana `Data Belum Tersedia (Tidak Ditebak AI)` | `7.5:1` on `#EAE6DF` (AAA) |

---

## 3. Typography Scale & Purpose (R-06, R-31)

- **Heading Serif (`Merriweather` / `Playfair Display`):** Dipilih untuk memberi kesan buku panduan akademik yang tepercaya dan manusiawi, membedakan bagian naratif dari kontrol formulir.
  - `Display Hero`: `40px` / line-height `48px` / Bold
  - `Page Title (H1)`: `28px` / line-height `36px` / Bold
  - `Section Title (H2)`: `22px` / line-height `30px` / Bold
- **UI & Body Sans (`Inter`):** Dipilih karena keterbacaan tinggi pada ukuran 14px-18px untuk kuesioner, kartu program, dan tabel perbandingan.
  - `Card Title (H3)`: `18px` / line-height `26px` / SemiBold
  - `Body Default`: `16px` / line-height `26px` / Regular (lebar baris dibatasi 65-72 karakter)
  - `Body Compact / Table`: `14px` / line-height `22px` / Regular & Medium
- **Technical Mono (`Liberation Mono` / `JetBrains Mono`):** Hanya digunakan untuk angka bobot rumus deterministik, tanggal audit sumber (`Verified: 2026-11-02`), serta tampilan payload JSON di Drawer Transparansi AI.
  - `Code / Metric`: `12px-13px` / line-height `18px` / Regular

---

## 4. Spacing, Radii, Elevation & 4 Boundary States

- **Spacing Scale:** `4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px`
- **Radius Hierarchy (R-11):**
  - `4px`: Badge status teknis & tag sumber
  - `8px`: Tombol, input teks, opsi kuesioner, dan slider bar
  - `12px`: Kartu institusi, panel kuesioner, dan kontainer utama
  - **Dilarang** menggunakan `9999px` (pill shape) secara seragam di semua komponen.
- **Elevation (R-12):** Hanya menggunakan border `1px solid #DFD9CC` untuk kartu standar. Bayangan tipis (`0 4px 12px rgba(20,24,29,0.06)`) hanya diberikan pada modal perbandingan dan Drawer Inspector yang mengambang di atas halaman.
- **4 Mandatory Boundary States:**
  1. **Loading Skeleton State:** Menampilkan progres 3 langkah secara jujur (`1. Menghitung Skor Deterministik -> 2. Mengekstrak Bukti Jawaban via Gemini Schema -> 3. Mencocokkan Katalog Pilot Bali`).
  2. **Empty Filter State:** Muncul saat filter kabupaten/kota atau batas biaya menghasilkan 0 institusi, lengkap dengan tombol `Reset Filter Kabupaten/Biaya`.
  3. **Error / Deterministic Fallback State:** Muncul saat Gemini API timeout/offline; sistem tetap menampilkan hasil dari mesin aturan deterministik dengan banner jelas bahwa sintesis esai AI sedang dilewati.
  4. **Feedback Toast State:** Konfirmasi non-intrusif saat bobot prioritas diperbarui, tautan sumber dibuka, atau sesi lokal dihapus.
