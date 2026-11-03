import { NextRequest, NextResponse } from "next/server";
import { PROGRAM_FIELDS, INSTITUTIONS_CATALOG, estimateDistanceKm } from "@/data/catalog";

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: Context) {
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const kabupaten = searchParams.get("kabupaten") || "Kota Denpasar";

  const field = PROGRAM_FIELDS.find((p) => p.id === id);

  if (!field) {
    return NextResponse.json(
      { error: "Program atau bidang studi tidak ditemukan dalam katalog." },
      { status: 404 }
    );
  }

  // Cari institusi terkait
  const matchedInstitutions = INSTITUTIONS_CATALOG.filter((inst) => {
    const progLower = inst.programName.toLowerCase();
    if (field.id === "informatika" && (progLower.includes("perangkat lunak") || progLower.includes("jaringan") || progLower.includes("komputer"))) return true;
    if (field.id === "dkv" && (progLower.includes("desain komunikasi visual") || progLower.includes("multimedia"))) return true;
    if (field.id === "arsitektur" && (progLower.includes("arsitektur") || progLower.includes("pemodelan"))) return true;
    if (field.id === "kesehatan" && (progLower.includes("keperawatan") || progLower.includes("kesehatan") || progLower.includes("farmasi"))) return true;
    if (field.id === "pendidikan" && (progLower.includes("pendidikan") || progLower.includes("konseling"))) return true;
    if (field.id === "budaya" && (progLower.includes("karawitan") || progLower.includes("tari") || progLower.includes("seni"))) return true;
    if (field.id === "pertanian" && (progLower.includes("tanaman") || progLower.includes("agribisnis") || progLower.includes("subak"))) return true;
    if (field.id === "lingkungan" && (progLower.includes("maritim") || progLower.includes("kelautan") || progLower.includes("lingkungan"))) return true;
    if (field.id === "bisnis" && (progLower.includes("bisnis") || progLower.includes("manajemen") || progLower.includes("akuntansi"))) return true;
    if (field.id === "pariwisata" && (progLower.includes("perhotelan") || progLower.includes("pariwisata") || progLower.includes("wisata"))) return true;
    return false;
  }).map((inst) => ({
    ...inst,
    estimatedDistanceKm: estimateDistanceKm(kabupaten, inst.kabupaten),
  })).sort((a, b) => a.estimatedDistanceKm - b.estimatedDistanceKm);

  return NextResponse.json({
    field,
    institutions: matchedInstitutions,
    availableFields: PROGRAM_FIELDS.map((f) => ({ id: f.id, name: f.name, group: f.group })),
  });
}
