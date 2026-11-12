import { NextRequest, NextResponse } from "next/server";
import {
  PROGRAM_FIELDS,
  getLevelComparisonSummary,
  getMatchedInstitutionsForField,
} from "@/data/catalog";
import {
  getBaliDirectoryStats,
  getBaliEntitiesForField,
} from "@/data/bali-institutions";

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

  const matchedInstitutions = getMatchedInstitutionsForField(field.id, kabupaten);
  const baliDirectory = getBaliEntitiesForField(field.id, kabupaten);

  return NextResponse.json({
    field,
    institutions: matchedInstitutions,
    levelSummary: getLevelComparisonSummary(field.id),
    baliDirectory: {
      perguruanTinggi: baliDirectory.perguruanTinggi,
      smk: baliDirectory.smk,
      smaCount: baliDirectory.sma.length,
    },
    directoryStats: getBaliDirectoryStats(),
    availableFields: PROGRAM_FIELDS.map((f) => ({ id: f.id, name: f.name, group: f.group })),
  });
}
