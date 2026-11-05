import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export interface PustakaDokumenItem {
  id: string;
  fieldId: string;
  folderName: string;
  courseId?: string;
  courseCode?: string;
  filename: string;
  fileUrl: string;
  fileSizeKb: number;
  title: string;
  category: string;
  certStandard: string;
  author: string;
  externalSourceUrl?: string;
  summary: string;
  isAutoDetected?: boolean;
}

const FOLDER_TO_FIELD: Record<string, string> = {
  "01-tkj": "tkj",
  "02-informatika": "informatika",
  "03-dkv": "dkv",
  "04-arsitektur": "arsitektur",
  "05-kesehatan": "kesehatan",
  "06-pendidikan": "pendidikan",
  "07-budaya": "budaya",
  "08-pertanian": "pertanian",
  "09-lingkungan": "lingkungan",
  "10-bisnis": "bisnis",
  "11-pariwisata": "pariwisata",
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fieldFilter = searchParams.get("field");

    const pustakaRoot = path.join(process.cwd(), "public", "pustaka-modul");
    const catalogPath = path.join(pustakaRoot, "katalog-pustaka.json");

    let catalogItems: PustakaDokumenItem[] = [];
    if (fs.existsSync(catalogPath)) {
      const raw = fs.readFileSync(catalogPath, "utf-8");
      catalogItems = JSON.parse(raw);
    }

    const catalogByFilename = new Map<string, PustakaDokumenItem>();
    for (const item of catalogItems) {
      catalogByFilename.set(`${item.folderName}/${item.filename}`, item);
    }

    const combinedItems: PustakaDokumenItem[] = [...catalogItems];

    // Scan all subfolders inside public/pustaka-modul so administrator-added PDFs are auto-discovered
    if (fs.existsSync(pustakaRoot)) {
      const entries = fs.readdirSync(pustakaRoot, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const folderName = entry.name;
        const mappedFieldId = FOLDER_TO_FIELD[folderName] || folderName;
        const folderPath = path.join(pustakaRoot, folderName);
        const files = fs.readdirSync(folderPath);

        for (const file of files) {
          if (!file.match(/\.(pdf|docx|pptx|xlsx|md|txt)$/i)) continue;
          const key = `${folderName}/${file}`;
          const filePath = path.join(folderPath, file);
          const stat = fs.statSync(filePath);
          const sizeKb = Math.round((stat.size / 1024) * 10) / 10;

          if (catalogByFilename.has(key)) {
            const existing = catalogByFilename.get(key)!;
            existing.fileSizeKb = sizeKb;
          } else {
            const cleanTitle = file
              .replace(/\.[a-z0-9]+$/i, "")
              .replace(/[-_]+/g, " ");
            combinedItems.push({
              id: `auto-${folderName}-${file}`,
              fieldId: mappedFieldId,
              folderName,
              filename: file,
              fileUrl: `/pustaka-modul/${folderName}/${encodeURIComponent(file)}`,
              fileSizeKb: sizeKb,
              title: cleanTitle,
              category: "Modul Tambahan Administrator",
              certStandard: "Referensi Kompetensi Jurusan",
              author: "Administrator Pustaka KertaMarga",
              summary: `Dokumen pembelajaran tambahan (${file}) yang ditempatkan pada folder terpusat public/pustaka-modul/${folderName}/.`,
              isAutoDetected: true,
            });
          }
        }
      }
    }

    const filtered = fieldFilter
      ? combinedItems.filter((item) => item.fieldId === fieldFilter)
      : combinedItems;

    return NextResponse.json({
      folderRoot: "public/pustaka-modul/",
      totalDocuments: filtered.length,
      documents: filtered,
    });
  } catch (error) {
    console.error("Failed to read pustaka-modul:", error);
    return NextResponse.json(
      { folderRoot: "public/pustaka-modul/", totalDocuments: 0, documents: [] },
      { status: 200 }
    );
  }
}
