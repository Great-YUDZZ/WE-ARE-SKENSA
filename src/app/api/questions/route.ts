import { NextResponse } from "next/server";
import { BASE_QUESTIONS, ADAPTIVE_BRANCH_QUESTIONS } from "@/data/questions";

export async function GET() {
  return NextResponse.json({
    version: "2026.1-pilot",
    description: "Bank kuesioner eksploratif KertaMarga Bali (Diadaptasi secara transparan, bukan diagnosis klinis/psikometrik).",
    baseQuestions: BASE_QUESTIONS,
    adaptiveBranches: ADAPTIVE_BRANCH_QUESTIONS,
    totalBaseQuestions: BASE_QUESTIONS.length,
  });
}
