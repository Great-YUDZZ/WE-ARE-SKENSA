import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KertaMarga Bali : Navigasi Pendidikan & Karier Masa Depan Bali",
  description: "Platform eksplorasi jurusan dan karier terarah untuk siswa SMP, SMA, dan SMK di Bali dengan analisis AI transparan dan katalog data institusi terverifikasi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark scroll-smooth">
      <body className="bg-[#080A10] text-[#F4F3F8] antialiased selection:bg-white/20 selection:text-white">
        {children}
      </body>
    </html>
  );
}
