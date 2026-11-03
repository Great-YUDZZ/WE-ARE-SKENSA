import { NextResponse } from "next/server";
import { PROGRAM_FIELDS } from "@/data/catalog";

export async function GET() {
  return NextResponse.json({
    total: PROGRAM_FIELDS.length,
    programs: PROGRAM_FIELDS.map((p) => ({
      id: p.id,
      name: p.name,
      group: p.group,
      categoryName: p.categoryName,
      shortDesc: p.shortDesc,
      vibeTagline: p.vibeTagline,
      careerCount: p.careerPaths.length,
      entrepreneurshipCount: p.localEntrepreneurshipIdeas.length,
    })),
  });
}
