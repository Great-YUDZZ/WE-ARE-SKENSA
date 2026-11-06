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
    <html lang="id" className="scroll-smooth">
      <body className="bg-[#FAF7F2] text-[#141413] antialiased selection:bg-[#B8F348] selection:text-[#141413]">
        {children}
      </body>
    </html>
  );
}
