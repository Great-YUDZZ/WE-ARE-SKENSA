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
    <html lang="id">
      <body className="bg-kmNeutral-latar dark:bg-kmNeutral-darkLatar text-kmNeutral-tinta dark:text-kmNeutral-darkTeks antialiased selection:bg-[#FFC93C] selection:text-[#1B1B2F]">
        {children}
      </body>
    </html>
  );
}
