# Panduan Administrator: Pemeliharaan Pustaka Modul PDF & Dokumen Eksternal

Seluruh berkas modul pembelajaran tambahan (PDF, buku saku, panduan praktikum, dan standar sertifikasi) disimpan di dalam **satu direktori khusus terpusat** agar tidak tersebar dan mudah dikelola oleh Administrator:

```text
public/pustaka-modul/
├── PANDUAN-ADMIN-MAINTENANCE.md   <-- Dokumentasi pemeliharaan administrator ini
├── katalog-pustaka.json           <-- Katalog indeks otomatis seluruh berkas PDF
├── 01-tkj/                        <-- Modul PDF Teknik Komputer & Jaringan
├── 02-informatika/                <-- Modul PDF Teknik Informatika & Ilmu Komputer
├── 03-dkv/                        <-- Modul PDF Desain Komunikasi Visual & Seni Digital
├── 04-arsitektur/                 <-- Modul PDF Arsitektur & Perencanaan Wilayah
├── 05-kesehatan/                  <-- Modul PDF Ilmu Kesehatan, Keperawatan & Farmasi
├── 06-pendidikan/                 <-- Modul PDF Ilmu Pendidikan, Keguruan & Psikologi
├── 07-budaya/                     <-- Modul PDF Sastra, Seni Pertunjukan & Kajian Budaya
├── 08-pertanian/                  <-- Modul PDF Pertanian Berkelanjutan & Agroteknologi
├── 09-lingkungan/                 <-- Modul PDF Ilmu Lingkungan, Kelautan & Energi Terbarukan
├── 10-bisnis/                     <-- Modul PDF Manajemen Bisnis, Kewirausahaan & E-Commerce
└── 11-pariwisata/                 <-- Modul PDF Pariwisata, Perhotelan & Kuliner
```

## Cara Menambah atau Mengganti Modul PDF Baru (Zero-Downtime Maintenance)

1. **Menambahkan Berkas PDF Secara Langsung (Otomatis Terdeteksi):**
   - Cukup salin atau unggah berkas `.pdf` baru ke dalam subfolder jurusan yang sesuai di `public/pustaka-modul/<kode-folder-jurusan>/`.
   - Gunakan format penamaan berkas yang rapi, misalnya:
     `MODUL-TKJ-04-Judul-Materi-Baru.pdf`
   - Endpoint `/api/pustaka-modul` akan otomatis memindai isi folder `public/pustaka-modul/` dan menampilkannya pada halaman `/hasil-analisis` tanpa perlu mengubah tata letak halaman.

2. **Menambahkan Metadata Lengkap (Opsional):**
   - Jika Anda ingin menambahkan deskripsi kustom, pemetaan kode mata kuliah spesifik (`courseId`), atau tautan referensi eksternal, Anda dapat memperbarui daftar pada `src/data/pustakaModulData.ts` atau `public/pustaka-modul/katalog-pustaka.json`.
