import { FIELDS, GROUP_CONFIG, type FieldGroup } from "@/data/fields";
import {
  MENTOR_CURRICULUM_BY_FIELD,
  type FieldCurriculum,
  type TargetCourse,
} from "@/data/mentorCurriculum";
import type { AssessmentAnalysisResult } from "@/lib/scoring";
import {
  collectModulePracticeNoteViews,
  getFieldLabelById,
  type FieldStudyProgressSnapshot,
  type FieldVerificationResult,
  type FullLearningSnapshot,
} from "@/lib/learningProfile";
import type { EvaluatedVerificationResponse } from "@/lib/dynamic-assessment";
import type { SafeUser } from "@/lib/schema";

function escapeHtml(raw: unknown): string {
  const str = String(raw ?? "");
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildReportShell(title: string, subtitle: string, bodyHtml: string): string {
  const generatedAt = new Date().toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 28px 18px;
      background: #FAF7F2;
      color: #141413;
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.55;
    }
    .sheet {
      max-width: 860px;
      margin: 0 auto;
      background: #FFFFFF;
      border: 2px solid #141413;
      border-radius: 20px;
      box-shadow: 6px 6px 0px #141413;
      padding: 28px 30px;
    }
    .topbar {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      padding-bottom: 18px;
      border-bottom: 2px solid #141413;
      margin-bottom: 20px;
    }
    .brand {
      display: inline-block;
      padding: 5px 12px;
      border-radius: 10px;
      background: #B8F348;
      border: 2px solid #141413;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    h1 {
      margin: 0;
      font-size: 24px;
      line-height: 1.25;
      font-weight: 900;
    }
    .subtitle {
      margin: 6px 0 0;
      color: #52514E;
      font-size: 13px;
      font-weight: 600;
    }
    .print-actions {
      display: flex;
      gap: 8px;
    }
    .btn-print {
      border: 2px solid #141413;
      background: #141413;
      color: #B8F348;
      border-radius: 10px;
      padding: 8px 14px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 10px;
      margin-bottom: 22px;
    }
    .meta-card {
      background: #FAF7F2;
      border: 2px solid #141413;
      border-radius: 12px;
      padding: 10px 12px;
    }
    .meta-label {
      display: block;
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      color: #52514E;
      margin-bottom: 2px;
    }
    .meta-value {
      font-size: 14px;
      font-weight: 800;
      color: #141413;
    }
    .section {
      margin-top: 22px;
      padding-top: 16px;
      border-top: 2px solid #141413;
    }
    .section-title {
      margin: 0 0 12px;
      font-size: 16px;
      font-weight: 900;
    }
    .card {
      background: #FAF7F2;
      border: 2px solid #141413;
      border-radius: 14px;
      padding: 14px 16px;
      margin-bottom: 12px;
      page-break-inside: avoid;
    }
    .card-white {
      background: #FFFFFF;
    }
    .card-head {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .pill {
      display: inline-block;
      padding: 3px 9px;
      border-radius: 8px;
      border: 1.5px solid #141413;
      font-size: 11px;
      font-weight: 800;
      background: #FFFFFF;
    }
    .pill-lime { background: #B8F348; color: #141413; }
    .pill-blue { background: #3B66FF; color: #FFFFFF; }
    .pill-amber { background: #FFBE2E; color: #141413; }
    .pill-dark { background: #141413; color: #B8F348; }
    .pill-muted { background: #F0ECE1; color: #52514E; }
    .pill-coral { background: #FF5E4D; color: #FFFFFF; }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin: 12px 0 6px;
    }
    .kpi-card {
      background: #FAF7F2;
      border: 2px solid #141413;
      border-radius: 12px;
      padding: 10px 12px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .kpi-card.kpi-accent { background: #EEF9D4; }
    .kpi-card.kpi-blue { background: #EDF2FF; }
    .kpi-big {
      font-size: 20px;
      font-weight: 900;
      color: #141413;
      line-height: 1.2;
      margin: 2px 0;
    }
    .kpi-sub {
      font-size: 11px;
      color: #52514E;
      font-weight: 600;
    }
    .progress-wrap {
      margin: 8px 0 4px;
    }
    .progress-label-row {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      font-weight: 800;
      margin-bottom: 4px;
    }
    .progress-track {
      width: 100%;
      height: 10px;
      border-radius: 999px;
      border: 1.5px solid #141413;
      background: #FFFFFF;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: #B8F348;
      border-right: 1.5px solid #141413;
    }
    .progress-fill.blue { background: #3B66FF; }
    .report-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
      font-size: 12px;
      background: #FFFFFF;
    }
    .report-table th,
    .report-table td {
      border: 1.5px solid #141413;
      padding: 7px 9px;
      text-align: left;
      vertical-align: top;
    }
    .report-table th {
      background: #F0ECE1;
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 800;
    }
    .report-table tr {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .note-body {
      margin: 6px 0 0;
      padding: 8px 10px;
      border-radius: 8px;
      background: #FFFFFF;
      border: 1px dashed #141413;
      font-size: 12px;
      white-space: pre-wrap;
      color: #141413;
    }
    .coverage-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 8px;
      margin-top: 8px;
    }
    .coverage-item {
      border: 1.5px solid #141413;
      border-radius: 10px;
      padding: 8px 10px;
      background: #FFFFFF;
      font-size: 11.5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }
    .coverage-item.active {
      background: #EEF9D4;
    }
    .score-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 8px;
      margin: 10px 0;
    }
    .score-box {
      background: #FFFFFF;
      border: 1.5px solid #141413;
      border-radius: 10px;
      padding: 8px 10px;
    }
    ul {
      margin: 6px 0 0;
      padding-left: 18px;
      font-size: 13px;
    }
    li { margin-bottom: 4px; }
    .footer-note {
      margin-top: 24px;
      padding-top: 12px;
      border-top: 1.5px dashed #141413;
      font-size: 11px;
      color: #52514E;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 8px;
    }
    @page {
      size: A4 portrait;
      margin: 12mm;
    }
    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      body {
        background: #FFFFFF;
        padding: 0;
      }
      .sheet {
        border: 1.5px solid #141413;
        box-shadow: none;
        border-radius: 0;
        padding: 14px;
        max-width: 100%;
      }
      .print-actions { display: none; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="topbar">
      <div>
        <span class="brand">KertaMarga Bali - Rekap Hasil Pengguna</span>
        <h1>${escapeHtml(title)}</h1>
        <p class="subtitle">${escapeHtml(subtitle)}</p>
      </div>
      <div class="print-actions">
        <button type="button" class="btn-print" onclick="window.print()">Cetak / Simpan PDF</button>
      </div>
    </div>
    ${bodyHtml}
    <div class="footer-note">
      <span>Dicetak dari KertaMarga Bali (${escapeHtml(generatedAt)})</span>
      <span>Navigasi Karier &amp; Penjurusan Pelajar Bali</span>
    </div>
  </div>
</body>
</html>`;
}

export function downloadHtmlFile(filename: string, html: string): void {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function openPrintableReport(html: string, fallbackFilename: string): boolean {
  if (typeof document !== "undefined") {
    try {
      const iframe = document.createElement("iframe");
      iframe.setAttribute("aria-hidden", "true");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      iframe.style.opacity = "0";
      iframe.style.pointerEvents = "none";
      document.body.appendChild(iframe);

      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      const win = iframe.contentWindow;
      if (doc && win) {
        doc.open();
        doc.write(html);
        doc.close();

        const cleanup = () => {
          window.setTimeout(() => {
            if (iframe.parentNode) {
              iframe.parentNode.removeChild(iframe);
            }
          }, 500);
        };

        win.addEventListener("afterprint", cleanup, { once: true });
        window.setTimeout(() => {
          try {
            win.focus();
            win.print();
            window.setTimeout(cleanup, 90_000);
          } catch {
            cleanup();
            downloadHtmlFile(fallbackFilename, html);
          }
        }, 180);
        return true;
      }
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    } catch {
      // Lanjutkan ke fallback window.open di bawah
    }
  }

  const win = window.open("", "_blank");
  if (!win) {
    downloadHtmlFile(fallbackFilename, html);
    return false;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  window.setTimeout(() => {
    try {
      win.focus();
      win.print();
    } catch {
      // Abaikan jika browser membatasi auto-print
    }
  }, 250);
  return true;
}

export interface ExplorationReportParams {
  result: AssessmentAnalysisResult;
  educationLevel: string;
  originLabel: string;
  weights: {
    matchWeight: number;
    distanceWeight: number;
    costWeight: number;
  };
  userName?: string;
  userIdentifier?: string;
}

export function buildExplorationReportHtml(params: ExplorationReportParams): string {
  const { result, educationLevel, originLabel, weights, userName, userIdentifier } = params;

  const signalsHtml =
    result.extractedSignals.length > 0
      ? `<div class="card card-white">
          <span class="meta-label">Sinyal Minat dari Refleksi Terbuka</span>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;">
            ${result.extractedSignals
              .map((sig) => `<span class="pill pill-amber">#${escapeHtml(sig)}</span>`)
              .join("")}
          </div>
        </div>`
      : "";

  const recommendationsHtml = result.topRecommendations
    .map((rec) => {
      const reasons = rec.reasoningTrace
        .map((r) => `<li>${escapeHtml(r)}</li>`)
        .join("");
      const institutions = rec.matchedInstitutions
        .slice(0, 3)
        .map(
          (inst) =>
            `<li><strong>${escapeHtml(inst.institutionName)}</strong> (${escapeHtml(inst.level)}) - ${escapeHtml(inst.programName)} (${escapeHtml(inst.kabupaten)}, ~${escapeHtml(inst.estimatedDistanceKm)} km)</li>`
        )
        .join("");

      return `<div class="card">
        <div class="card-head">
          <div>
            <span class="pill pill-dark">PERINGKAT #${escapeHtml(rec.rank)}</span>
            <span class="pill">${escapeHtml(rec.confidenceBand)}</span>
            <span class="pill">${escapeHtml(rec.field.categoryName)}</span>
          </div>
          <span class="pill pill-lime">Skor Komposit: ${escapeHtml(rec.compositeScore)} / 100</span>
        </div>
        <h3 style="margin:4px 0 4px;font-size:18px;">${escapeHtml(rec.field.name)}</h3>
        <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#3B66FF;">${escapeHtml(rec.field.vibeTagline)}</p>
        <p style="margin:0 0 10px;font-size:13px;color:#52514E;">${escapeHtml(rec.field.shortDesc)}</p>
        <div class="score-grid">
          <div class="score-box">
            <span class="meta-label">Minat &amp; Aktivitas</span>
            <span class="meta-value">${escapeHtml(rec.breakdown.interestScore)}%</span>
          </div>
          <div class="score-box">
            <span class="meta-label">Kesiapan Saat Ini</span>
            <span class="meta-value">${escapeHtml(rec.breakdown.readinessScore)}%</span>
          </div>
          <div class="score-box">
            <span class="meta-label">Preferensi Belajar</span>
            <span class="meta-value">${escapeHtml(rec.breakdown.preferenceScore)}%</span>
          </div>
        </div>
        <div style="margin-top:8px;">
          <strong style="font-size:12px;">Alasan Pencocokan:</strong>
          <ul>${reasons}</ul>
        </div>
        ${
          institutions
            ? `<div style="margin-top:8px;">
                <strong style="font-size:12px;">Institusi Rujukan Terdekat di Bali:</strong>
                <ul>${institutions}</ul>
              </div>`
            : ""
        }
      </div>`;
    })
    .join("");

  const bodyHtml = `
    <div class="meta-grid">
      <div class="meta-card">
        <span class="meta-label">Peserta</span>
        <span class="meta-value">${escapeHtml(userName || "Pelajar Bali (Tamu)")}${userIdentifier ? ` (${escapeHtml(userIdentifier)})` : ""}</span>
      </div>
      <div class="meta-card">
        <span class="meta-label">Jenjang Saat Ini</span>
        <span class="meta-value">${escapeHtml(educationLevel)}</span>
      </div>
      <div class="meta-card">
        <span class="meta-label">Acuan Lokasi Bali</span>
        <span class="meta-value">${escapeHtml(originLabel)}</span>
      </div>
      <div class="meta-card">
        <span class="meta-label">Bobot Prioritas</span>
        <span class="meta-value">Minat ${escapeHtml(weights.matchWeight)}% | Jarak ${escapeHtml(weights.distanceWeight)}% | Biaya ${escapeHtml(weights.costWeight)}%</span>
      </div>
    </div>
    ${signalsHtml}
    <div class="section">
      <h2 class="section-title">Peringkat Bidang Rekomendasi (${escapeHtml(result.totalQuestionsAnswered)} Pertanyaan Terjawab)</h2>
      ${recommendationsHtml}
    </div>
  `;

  return buildReportShell(
    "Hasil Eksplorasi Minat & Penjurusan",
    "Evaluasi objektif berbasis minat, kesiapan awal, preferensi belajar, dan jarak institusi di Bali.",
    bodyHtml
  );
}

export interface SurveyWorkspaceReportParams {
  curriculum: FieldCurriculum;
  targetCourse: TargetCourse;
  baseScore: number;
  moduleBonus: number;
  certBonus: number;
  currentReadinessScore: number;
  dominantGroup: FieldGroup;
  isGroupMismatch: boolean;
  isPreviewMode?: boolean;
  progress: FieldStudyProgressSnapshot;
  userName?: string;
  userIdentifier?: string;
}

export function buildSurveyWorkspaceReportHtml(
  params: SurveyWorkspaceReportParams
): string {
  const {
    curriculum,
    targetCourse,
    baseScore,
    moduleBonus,
    certBonus,
    currentReadinessScore,
    dominantGroup,
    isGroupMismatch,
    isPreviewMode,
    progress,
    userName,
    userIdentifier,
  } = params;

  const dominantLabel = GROUP_CONFIG[dominantGroup]?.label || dominantGroup;
  const fieldGroupLabel = GROUP_CONFIG[curriculum.group]?.label || curriculum.group;
  const gap = Math.max(0, targetCourse.minScore - currentReadinessScore);

  const completedModsList = curriculum.learningModules
    .filter((m) => progress.completedModules.includes(m.id))
    .map(
      (m) =>
        `<li><strong>${escapeHtml(m.moduleCode || "MODUL")}: ${escapeHtml(m.title)}</strong> (+${escapeHtml(m.scoreBoost)}% kesiapan)</li>`
    )
    .join("");

  const passedCertsList = curriculum.certificationDrills
    .filter((c) => progress.passedCertIds.includes(c.id))
    .map(
      (c) =>
        `<li><strong>${escapeHtml(c.competencyCode)}</strong> - ${escapeHtml(c.certName)} (+${escapeHtml(c.scoreBoost)}%)</li>`
    )
    .join("");

  const verBlock = progress.verification
    ? `<div class="section">
        <h2 class="section-title">Hasil Verifikasi Kemampuan Akhir</h2>
        <div class="card">
          <div class="card-head">
            <span class="pill ${progress.verification.status === "passed" ? "pill-lime" : "pill-amber"}">
              ${progress.verification.status === "passed" ? "LULUS TERVERIFIKASI" : "PERLU PENDALAMAN"}
            </span>
            <span class="pill pill-dark">Skor: ${escapeHtml(progress.verification.score)}% (${escapeHtml(progress.verification.correctCount)}/${escapeHtml(progress.verification.totalQuestions)})</span>
          </div>
          <p style="margin:6px 0;font-size:13px;">${escapeHtml(progress.verification.summary)}</p>
        </div>
      </div>`
    : "";

  const bodyHtml = `
    <div class="meta-grid">
      <div class="meta-card">
        <span class="meta-label">Peserta</span>
        <span class="meta-value">${escapeHtml(userName || "Pelajar Bali (Tamu)")}${userIdentifier ? ` (${escapeHtml(userIdentifier)})` : ""}</span>
      </div>
      <div class="meta-card">
        <span class="meta-label">Jurusan / Bidang Tujuan</span>
        <span class="meta-value">${escapeHtml(curriculum.fieldName)}</span>
      </div>
      <div class="meta-card">
        <span class="meta-label">Mata Kuliah Fokus</span>
        <span class="meta-value">${escapeHtml(targetCourse.code)} - ${escapeHtml(targetCourse.name)}</span>
      </div>
      <div class="meta-card">
        <span class="meta-label">Klaster Minat Alami</span>
        <span class="meta-value">${escapeHtml(dominantLabel)} ${isGroupMismatch ? `(Lintas Minat dari ${escapeHtml(fieldGroupLabel)})` : "(Selaras)"}</span>
      </div>
    </div>

    <div class="card">
      <div class="card-head">
        <span class="pill ${isPreviewMode ? "pill-amber" : "pill-blue"}">
          ${isPreviewMode ? "SIMULASI MODE PRATINJAU" : "SKOR SURVEY KEMINATAN TERCATAT"}
        </span>
        <span class="pill ${gap === 0 ? "pill-lime" : "pill-amber"}">
          ${gap === 0 ? `Memenuhi Standar (${escapeHtml(targetCourse.minScore)}%)` : `Perlu +${escapeHtml(gap)} Poin Lagi`}
        </span>
      </div>
      <div class="score-grid">
        <div class="score-box">
          <span class="meta-label">Skor Dasar Survey</span>
          <span class="meta-value">${escapeHtml(baseScore)}%</span>
        </div>
        <div class="score-box">
          <span class="meta-label">Bonus Modul Selesai</span>
          <span class="meta-value">+${escapeHtml(moduleBonus)}%</span>
        </div>
        <div class="score-box">
          <span class="meta-label">Bonus Quiz Sertifikasi</span>
          <span class="meta-value">+${escapeHtml(certBonus)}%</span>
        </div>
        <div class="score-box">
          <span class="meta-label">Skor Kesiapan Total</span>
          <span class="meta-value">${escapeHtml(currentReadinessScore)}% / ${escapeHtml(targetCourse.minScore)}%</span>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Progres Modul &amp; Sertifikasi</h2>
      <div class="card card-white">
        <strong>Modul Materi Selesai (${escapeHtml(progress.completedModules.length)}/${escapeHtml(curriculum.learningModules.length)})</strong>
        ${completedModsList ? `<ul>${completedModsList}</ul>` : `<p style="font-size:13px;color:#52514E;margin:6px 0 0;">Belum ada modul materi yang ditandai selesai.</p>`}
      </div>
      <div class="card card-white">
        <strong>Unit Quiz Sertifikasi Lulus (${escapeHtml(progress.passedCertIds.length)}/${escapeHtml(curriculum.certificationDrills.length)})</strong>
        ${passedCertsList ? `<ul>${passedCertsList}</ul>` : `<p style="font-size:13px;color:#52514E;margin:6px 0 0;">Belum ada unit quiz sertifikasi yang lulus.</p>`}
      </div>
    </div>
    ${verBlock}
  `;

  return buildReportShell(
    "Laporan Hasil Survey & Kesiapan Studi",
    `${curriculum.fieldName} - Target Sertifikasi: ${targetCourse.certificationAlignment || curriculum.mainCertificationTitle}`,
    bodyHtml
  );
}

export function buildVerificationReportHtml(params: {
  curriculum: FieldCurriculum;
  targetCourse: TargetCourse;
  evaluation?: EvaluatedVerificationResponse | null;
  saved?: FieldVerificationResult;
  userName?: string;
}): string {
  const { curriculum, targetCourse, evaluation, saved, userName } = params;
  const status = evaluation?.status || saved?.status || "needs_review";
  const score = evaluation?.score ?? saved?.score ?? 0;
  const correctCount = evaluation?.correctCount ?? saved?.correctCount ?? 0;
  const totalQuestions = evaluation?.totalQuestions ?? saved?.totalQuestions ?? 5;
  const summary = evaluation?.summary || saved?.summary || "";
  const strengths = evaluation?.strengths || saved?.strengths || [];
  const improvements = evaluation?.improvements || saved?.improvements || [];

  const reviewHtml = evaluation?.reviews?.length
    ? `<div class="section">
        <h2 class="section-title">Pembahasan Soal Pilihan Ganda</h2>
        ${evaluation.reviews
          .map(
            (rev, idx) => `<div class="card card-white">
              <div class="card-head">
                <span class="pill">Soal #${idx + 1} (${escapeHtml(rev.competencyCode)})</span>
                <span class="pill ${rev.isCorrect ? "pill-lime" : "pill-amber"}">${rev.isCorrect ? "Tepat" : "Perlu Tinjauan"}</span>
              </div>
              <p style="margin:4px 0;font-size:13px;font-weight:700;">${escapeHtml(rev.question)}</p>
              <p style="margin:4px 0;font-size:12px;">Jawaban Anda: <strong>${
                rev.selectedIndex >= 0
                  ? `${String.fromCharCode(65 + rev.selectedIndex)}. ${escapeHtml(rev.options[rev.selectedIndex])}`
                  : "Belum dipilih"
              }</strong></p>
              ${
                !rev.isCorrect
                  ? `<p style="margin:4px 0;font-size:12px;">Jawaban Tepat: <strong>${String.fromCharCode(65 + rev.correctIndex)}. ${escapeHtml(rev.options[rev.correctIndex])}</strong></p>`
                  : ""
              }
              <p style="margin:6px 0 0;font-size:12px;color:#52514E;">${escapeHtml(rev.explanation)}</p>
            </div>`
          )
          .join("")}
      </div>`
    : "";

  const bodyHtml = `
    <div class="meta-grid">
      <div class="meta-card">
        <span class="meta-label">Peserta</span>
        <span class="meta-value">${escapeHtml(userName || "Pelajar Bali")}</span>
      </div>
      <div class="meta-card">
        <span class="meta-label">Bidang Kurikulum</span>
        <span class="meta-value">${escapeHtml(curriculum.fieldName)}</span>
      </div>
      <div class="meta-card">
        <span class="meta-label">Mata Kuliah Target</span>
        <span class="meta-value">${escapeHtml(targetCourse.code)} - ${escapeHtml(targetCourse.name)}</span>
      </div>
      <div class="meta-card">
        <span class="meta-label">Status Verifikasi</span>
        <span class="meta-value">${status === "passed" ? "LULUS TERVERIFIKASI" : "PERLU PENDALAMAN"} (${escapeHtml(score)}%)</span>
      </div>
    </div>

    <div class="card">
      <div class="card-head">
        <span class="pill ${status === "passed" ? "pill-lime" : "pill-amber"}">Skor Total: ${escapeHtml(score)}%</span>
        <span class="pill pill-dark">Capaian: ${escapeHtml(correctCount)}/${escapeHtml(totalQuestions)}</span>
      </div>
      <p style="margin:6px 0;font-size:13px;">${escapeHtml(summary)}</p>
      <div class="score-grid">
        <div class="score-box">
          <span class="meta-label">Kekuatan Pemahaman</span>
          ${strengths.length ? `<ul>${strengths.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>` : `<p style="font-size:12px;margin:4px 0;">Teruskan latihan kasus praktik.</p>`}
        </div>
        <div class="score-box">
          <span class="meta-label">Saran Peningkatan</span>
          ${improvements.length ? `<ul>${improvements.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>` : `<p style="font-size:12px;margin:4px 0;">Pemahaman lintas modul sudah solid.</p>`}
        </div>
      </div>
    </div>
    ${reviewHtml}
  `;

  return buildReportShell(
    "Hasil Verifikasi Kemampuan Akhir",
    `${curriculum.fieldName} - Evaluasi Lintas Modul & Studi Kasus Bali`,
    bodyHtml
  );
}

export function buildProfileTestReportHtml(params: {
  snapshot: FullLearningSnapshot;
  user: SafeUser | null;
  originLabel: string;
}): string {
  const { snapshot, user, originLabel } = params;
  const allCurricula = Object.values(MENTOR_CURRICULUM_BY_FIELD);
  const totalWebsiteModules = allCurricula.reduce(
    (sum, c) => sum + c.learningModules.length,
    0
  );
  const totalWebsiteCerts = allCurricula.reduce(
    (sum, c) => sum + c.certificationDrills.length,
    0
  );

  const activeProgress = Object.values(snapshot.progressByField || {}).filter(
    (prog) => Boolean(MENTOR_CURRICULUM_BY_FIELD[prog.fieldId])
  );

  let totalModulesCompleted = 0;
  let totalModulesInActiveFields = 0;
  let totalCertsPassed = 0;
  let totalCertsInActiveFields = 0;
  let verifiedFieldsCount = 0;
  let passedVerificationCount = 0;

  for (const prog of activeProgress) {
    const curr = MENTOR_CURRICULUM_BY_FIELD[prog.fieldId];
    if (!curr) continue;
    totalModulesCompleted += prog.completedModules.length;
    totalModulesInActiveFields += curr.learningModules.length;
    totalCertsPassed += prog.passedCertIds.length;
    totalCertsInActiveFields += curr.certificationDrills.length;
    if (prog.verification) {
      verifiedFieldsCount += 1;
      if (prog.verification.status === "passed") {
        passedVerificationCount += 1;
      }
    }
  }

  const practiceNotesViews = collectModulePracticeNoteViews(snapshot);
  const personalNotes = snapshot.personalNotes || [];
  const totalNotesCount = personalNotes.length + practiceNotesViews.length;
  const savedFieldIds = snapshot.savedFieldIds || [];
  const exploration = snapshot.explorationResult || null;
  const survey = snapshot.surveyResult || null;
  const surveyCurr = survey ? MENTOR_CURRICULUM_BY_FIELD[survey.fieldId] : null;

  const moduleCompletionPct =
    totalModulesInActiveFields > 0
      ? Math.round((totalModulesCompleted / totalModulesInActiveFields) * 100)
      : 0;
  const certCompletionPct =
    totalCertsInActiveFields > 0
      ? Math.round((totalCertsPassed / totalCertsInActiveFields) * 100)
      : 0;

  const registeredInterestsHtml =
    user && user.interests && user.interests.length > 0
      ? `<div class="card card-white" style="margin-bottom:14px;">
          <span class="meta-label">Minat Terdaftar pada Akun</span>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;">
            ${user.interests
              .map((interest) => `<span class="pill pill-lime">${escapeHtml(interest)}</span>`)
              .join("")}
          </div>
        </div>`
      : "";

  const kpiDashboardHtml = `
    <div class="kpi-grid">
      <div class="kpi-card ${exploration ? "kpi-accent" : ""}">
        <span class="meta-label">Kuesioner Eksplorasi (/eksplorasi)</span>
        <div class="kpi-big">${
          exploration && exploration.topRecommendations[0]
            ? `${escapeHtml(exploration.topRecommendations[0].compositeScore)} / 100`
            : "Belum Diisi"
        }</div>
        <div class="kpi-sub">${
          exploration && exploration.topRecommendations[0]
            ? `Top #1: ${escapeHtml(exploration.topRecommendations[0].fieldName)}`
            : "Rekomendasi minat belum dijalankan"
        }</div>
      </div>

      <div class="kpi-card ${survey ? "kpi-blue" : ""}">
        <span class="meta-label">Survey Keminatan (/tes-keminatan)</span>
        <div class="kpi-big">${survey ? `${escapeHtml(survey.score)}%` : "Belum Ada"}</div>
        <div class="kpi-sub">${
          survey
            ? `${escapeHtml(surveyCurr?.fieldName || survey.fieldId)} (${escapeHtml(
                GROUP_CONFIG[survey.dominant]?.label || survey.dominant
              )})`
            : "Skor survey dasar belum tercatat"
        }</div>
      </div>

      <div class="kpi-card ${totalModulesCompleted > 0 ? "kpi-accent" : ""}">
        <span class="meta-label">Penyelesaian Modul Belajar</span>
        <div class="kpi-big">${escapeHtml(totalModulesCompleted)} Modul</div>
        <div class="kpi-sub">${
          activeProgress.length > 0
            ? `${escapeHtml(moduleCompletionPct)}% di ${escapeHtml(activeProgress.length)} bidang aktif (${escapeHtml(totalWebsiteModules)} total modul)`
            : `Dari total ${escapeHtml(totalWebsiteModules)} modul tersedia`
        }</div>
      </div>

      <div class="kpi-card ${totalCertsPassed > 0 ? "kpi-accent" : ""}">
        <span class="meta-label">Quiz Latihan Sertifikasi</span>
        <div class="kpi-big">${escapeHtml(totalCertsPassed)} Unit Lulus</div>
        <div class="kpi-sub">${
          activeProgress.length > 0
            ? `${escapeHtml(certCompletionPct)}% di bidang aktif (${escapeHtml(totalWebsiteCerts)} total unit)`
            : `Dari total ${escapeHtml(totalWebsiteCerts)} unit sertifikasi`
        }</div>
      </div>

      <div class="kpi-card ${passedVerificationCount > 0 ? "kpi-blue" : ""}">
        <span class="meta-label">Uji Verifikasi Kemampuan AI</span>
        <div class="kpi-big">${
          verifiedFieldsCount > 0
            ? `${escapeHtml(passedVerificationCount)} / ${escapeHtml(verifiedFieldsCount)} Lulus`
            : "Belum Uji"
        }</div>
        <div class="kpi-sub">${
          verifiedFieldsCount > 0
            ? "Evaluasi soal lintas modul & kasus Bali"
            : "Dapat diikuti di tab Verifikasi"
        }</div>
      </div>

      <div class="kpi-card">
        <span class="meta-label">Catatan &amp; Bidang Favorit</span>
        <div class="kpi-big">${escapeHtml(totalNotesCount)} Catatan</div>
        <div class="kpi-sub">${escapeHtml(personalNotes.length)} jurnal pribadi, ${escapeHtml(practiceNotesViews.length)} praktik modul, ${escapeHtml(savedFieldIds.length)} bidang disimpan</div>
      </div>
    </div>
  `;

  // 1. Kuesioner Eksplorasi Minat (/eksplorasi)
  const explorationSectionHtml = exploration
    ? `<div class="card">
        <div class="card-head">
          <div>
            <span class="pill pill-lime">KUESIONER EKSPLORASI SELESAI</span>
            <span class="pill pill-blue">Jenjang: ${escapeHtml(exploration.educationLevel)}</span>
            <span class="pill">${escapeHtml(exploration.totalQuestionsAnswered)} Pertanyaan Terjawab</span>
          </div>
          <span class="pill pill-dark">${escapeHtml(
            new Date(exploration.completedAt).toLocaleDateString("id-ID", {
              dateStyle: "medium",
            })
          )}</span>
        </div>
        <div class="score-grid">
          <div class="score-box">
            <span class="meta-label">Lokasi Acuan Eksplorasi</span>
            <span class="meta-value">${escapeHtml(exploration.originLabel)}</span>
          </div>
          <div class="score-box">
            <span class="meta-label">Bobot Prioritas</span>
            <span class="meta-value">Minat ${escapeHtml(exploration.weights.matchWeight)}% | Jarak ${escapeHtml(exploration.weights.distanceWeight)}% | Biaya ${escapeHtml(exploration.weights.costWeight)}%</span>
          </div>
        </div>
        ${
          exploration.extractedSignals.length > 0
            ? `<div style="margin-top:8px;">
                <strong style="font-size:12px;">Sinyal Minat Terdeteksi:</strong>
                <div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:4px;">
                  ${exploration.extractedSignals
                    .map((sig) => `<span class="pill pill-amber">#${escapeHtml(sig)}</span>`)
                    .join("")}
                </div>
              </div>`
            : ""
        }
        ${
          exploration.openEndedReflection
            ? `<div style="margin-top:8px;">
                <strong style="font-size:12px;">Refleksi Terbuka Pengguna:</strong>
                <div class="note-body">${escapeHtml(exploration.openEndedReflection)}</div>
              </div>`
            : ""
        }
        <div style="margin-top:10px;">
          <strong style="font-size:12px;">Peringkat Rekomendasi Bidang Teratas:</strong>
          <table class="report-table">
            <thead>
              <tr>
                <th style="width:60px;">Rank</th>
                <th>Bidang Studi</th>
                <th style="width:95px;">Skor Komposit</th>
                <th>Rincian (Minat / Kesiapan / Preferensi)</th>
                <th>Institusi Terdekat</th>
              </tr>
            </thead>
            <tbody>
              ${exploration.topRecommendations
                .map(
                  (rec) => `<tr>
                    <td><span class="pill ${rec.rank === 1 ? "pill-lime" : ""}">#${escapeHtml(rec.rank)}</span></td>
                    <td>
                      <strong>${escapeHtml(rec.fieldName)}</strong><br/>
                      <span style="font-size:11px;color:#52514E;">${escapeHtml(rec.categoryName)} (${escapeHtml(rec.confidenceBand)})</span>
                    </td>
                    <td><strong>${escapeHtml(rec.compositeScore)} / 100</strong></td>
                    <td>${escapeHtml(rec.interestScore)}% / ${escapeHtml(rec.readinessScore)}% / ${escapeHtml(rec.preferenceScore)}%</td>
                    <td>${escapeHtml(rec.topInstitution || "Sesuai direktori Bali")}</td>
                  </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
        ${
          exploration.answersSummary && exploration.answersSummary.length > 0
            ? `<div style="margin-top:10px;">
                <strong style="font-size:12px;">Ringkasan Jawaban Kuesioner Eksplorasi:</strong>
                <table class="report-table">
                  <thead>
                    <tr>
                      <th style="width:45%;">Pertanyaan</th>
                      <th>Pilihan Jawaban Pengguna</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${exploration.answersSummary
                      .map(
                        (ans) => `<tr>
                          <td>${escapeHtml(ans.prompt)}</td>
                          <td>${escapeHtml(ans.answerLabel)}</td>
                        </tr>`
                      )
                      .join("")}
                  </tbody>
                </table>
              </div>`
            : ""
        }
      </div>`
    : `<div class="card card-white">
        <span class="pill pill-amber">BELUM MENGISI KUESIONER EKSPLORASI MINAT</span>
        <p style="margin:8px 0 0;font-size:12.5px;color:#52514E;">
          Peserta belum menyelesaikan kuesioner pemetaan minat 3 tahap pada menu <strong>Eksplorasi Minat (/eksplorasi)</strong>. Setelah diselesaikan, hasil peringkat bidang, refleksi terbuka, dan institusi rujukan Bali akan otomatis tampil pada rekap ini.
        </p>
      </div>`;

  // 2. Survey Keminatan Dasar (/tes-keminatan)
  const surveyCurrTargetCourse = surveyCurr?.targetCourses.find(
    (c) => c.id === survey?.courseId
  ) || surveyCurr?.targetCourses[0];

  const surveySectionHtml = survey
    ? `<div class="card">
        <div class="card-head">
          <div>
            <span class="pill pill-lime">SURVEY KEMINATAN TERCATAT</span>
            <span class="pill ${survey.mismatch ? "pill-amber" : "pill-blue"}">
              ${survey.mismatch ? "Jalur Lintas Minat (Perlu Penguatan)" : "Minat Alami Selaras"}
            </span>
          </div>
          <span class="pill pill-dark">${escapeHtml(
            survey.completedAt
              ? new Date(survey.completedAt).toLocaleDateString("id-ID", {
                  dateStyle: "medium",
                })
              : "Tercatat"
          )}</span>
        </div>
        <h3 style="margin:4px 0 4px;font-size:17px;">${escapeHtml(
          surveyCurr?.fieldName || survey.fieldId.toUpperCase()
        )}</h3>
        ${
          surveyCurrTargetCourse
            ? `<p style="margin:0 0 8px;font-size:12px;color:#52514E;">Mata Kuliah Fokus: <strong>${escapeHtml(surveyCurrTargetCourse.code)} - ${escapeHtml(surveyCurrTargetCourse.name)}</strong> (Target Skor Minimal: ${escapeHtml(surveyCurrTargetCourse.minScore)}%)</p>`
            : ""
        }
        <div class="score-grid">
          <div class="score-box">
            <span class="meta-label">Skor Dasar Survey</span>
            <span class="meta-value">${escapeHtml(survey.score)}%</span>
          </div>
          <div class="score-box">
            <span class="meta-label">Klaster Minat Alami</span>
            <span class="meta-value">${escapeHtml(
              GROUP_CONFIG[survey.dominant]?.label || survey.dominant
            )}</span>
          </div>
          <div class="score-box">
            <span class="meta-label">Target Sertifikasi Utama</span>
            <span class="meta-value">${escapeHtml(
              surveyCurr?.mainCertificationTitle || "Kompetensi Industri"
            )}</span>
          </div>
        </div>
        ${
          survey.answersSummary && survey.answersSummary.length > 0
            ? `<div style="margin-top:8px;">
                <strong style="font-size:12px;">Rincian Jawaban Kuisioner Survey Dasar:</strong>
                <table class="report-table">
                  <thead>
                    <tr>
                      <th style="width:42%;">Pertanyaan Dimensi</th>
                      <th>Pilihan Peserta</th>
                      <th style="width:75px;">Bobot</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${survey.answersSummary
                      .map(
                        (ans) => `<tr>
                          <td>${escapeHtml(ans.dimension)}</td>
                          <td>${escapeHtml(ans.selectedOptionLabel)}</td>
                          <td><strong>${escapeHtml(ans.readinessWeight)}%</strong></td>
                        </tr>`
                      )
                      .join("")}
                  </tbody>
                </table>
              </div>`
            : ""
        }
      </div>`
    : `<div class="card card-white">
        <span class="pill pill-amber">BELUM ADA SKOR SURVEY DASAR</span>
        <p style="margin:8px 0 0;font-size:12.5px;color:#52514E;">
          Peserta belum mengisi kuisioner <strong>Survey Minat (/tes-keminatan)</strong>. Progres modul, quiz sertifikasi, dan verifikasi AI pada bagian di bawah tetap dirangkum lengkap.
        </p>
      </div>`;

  // 3. Rekap Penyelesaian Modul, Quiz Sertifikasi & Verifikasi per Bidang (/hasil-analisis)
  const fieldsHtml =
    activeProgress.length > 0
      ? activeProgress
          .map((prog) => {
            const curr = MENTOR_CURRICULUM_BY_FIELD[prog.fieldId];
            if (!curr) return "";
            const modBonus = curr.learningModules
              .filter((m) => prog.completedModules.includes(m.id))
              .reduce((acc, m) => acc + m.scoreBoost, 0);
            const certBonus = curr.certificationDrills
              .filter((c) => prog.passedCertIds.includes(c.id))
              .reduce((acc, c) => acc + c.scoreBoost, 0);
            const isSurveyField = survey?.fieldId === prog.fieldId;
            const fieldBaseScore = isSurveyField && survey ? survey.score : null;
            const targetMinScore = curr.targetCourses[0]?.minScore ?? 75;
            const modPct = curr.learningModules.length
              ? Math.round((prog.completedModules.length / curr.learningModules.length) * 100)
              : 0;
            const certPct = curr.certificationDrills.length
              ? Math.round((prog.passedCertIds.length / curr.certificationDrills.length) * 100)
              : 0;
            const totalReadiness =
              fieldBaseScore !== null
                ? Math.min(99, fieldBaseScore + modBonus + certBonus)
                : null;

            const moduleRows = curr.learningModules
              .map((m) => {
                const isDone = prog.completedModules.includes(m.id);
                const note = prog.practiceNotes?.[m.id];
                return `<tr>
                  <td><strong>${escapeHtml(m.moduleCode || "MODUL")}</strong></td>
                  <td>
                    <strong>${escapeHtml(m.title)}</strong><br/>
                    <span style="font-size:11px;color:#52514E;">${escapeHtml(m.courseName)} (${escapeHtml(m.level)})</span>
                    ${
                      note && note.trim()
                        ? `<div class="note-body" style="margin-top:4px;font-size:11px;"><strong>Catatan Praktik:</strong> ${escapeHtml(note)}</div>`
                        : ""
                    }
                  </td>
                  <td>+${escapeHtml(m.scoreBoost)}%</td>
                  <td><span class="pill ${isDone ? "pill-lime" : "pill-muted"}">${
                    isDone ? "SELESAI" : "BELUM"
                  }</span></td>
                </tr>`;
              })
              .join("");

            const certRows = curr.certificationDrills
              .map((c) => {
                const isPassed = prog.passedCertIds.includes(c.id);
                return `<tr>
                  <td><strong>${escapeHtml(c.competencyCode)}</strong></td>
                  <td>
                    <strong>${escapeHtml(c.certName)}</strong><br/>
                    <span style="font-size:11px;color:#52514E;">${escapeHtml(c.question)}</span>
                  </td>
                  <td>+${escapeHtml(c.scoreBoost)}%</td>
                  <td><span class="pill ${isPassed ? "pill-lime" : "pill-muted"}">${
                    isPassed ? "LULUS QUIZ" : "BELUM"
                  }</span></td>
                </tr>`;
              })
              .join("");

            const verBlock = prog.verification
              ? `<div class="card card-white" style="margin-top:10px;margin-bottom:0;">
                  <div class="card-head">
                    <div>
                      <span class="pill ${
                        prog.verification.status === "passed" ? "pill-lime" : "pill-amber"
                      }">
                        VERIFIKASI AI: ${
                          prog.verification.status === "passed"
                            ? "LULUS TERVERIFIKASI"
                            : "PERLU PENDALAMAN"
                        }
                      </span>
                      <span class="pill pill-dark">Skor: ${escapeHtml(
                        prog.verification.score
                      )}% (${escapeHtml(prog.verification.correctCount)}/${escapeHtml(
                        prog.verification.totalQuestions
                      )})</span>
                    </div>
                    <span class="pill pill-muted">Percobaan ke-${escapeHtml(
                      prog.verification.attemptCount
                    )} | ${escapeHtml(
                      new Date(prog.verification.verifiedAt).toLocaleDateString("id-ID")
                    )}</span>
                  </div>
                  <p style="margin:4px 0 8px;font-size:12.5px;">${escapeHtml(
                    prog.verification.summary
                  )}</p>
                  <div class="score-grid">
                    <div class="score-box">
                      <span class="meta-label">Kekuatan Pemahaman</span>
                      ${
                        prog.verification.strengths.length > 0
                          ? `<ul>${prog.verification.strengths
                              .map((s) => `<li>${escapeHtml(s)}</li>`)
                              .join("")}</ul>`
                          : `<p style="font-size:12px;margin:4px 0;">Terus pertahankan latihan modul.</p>`
                      }
                    </div>
                    <div class="score-box">
                      <span class="meta-label">Saran Penguatan</span>
                      ${
                        prog.verification.improvements.length > 0
                          ? `<ul>${prog.verification.improvements
                              .map((i) => `<li>${escapeHtml(i)}</li>`)
                              .join("")}</ul>`
                          : `<p style="font-size:12px;margin:4px 0;">Pemahaman lintas modul sudah solid.</p>`
                      }
                    </div>
                  </div>
                </div>`
              : `<div class="card card-white" style="margin-top:10px;margin-bottom:0;">
                  <span class="pill pill-muted">UJI VERIFIKASI AKHIR AI: BELUM DIIKUTI</span>
                  <p style="margin:6px 0 0;font-size:12px;color:#52514E;">
                    Selesaikan evaluasi 5 soal gabungan lintas modul &amp; studi kasus Bali di Workspace Modul untuk memperoleh sertifikat verifikasi kemampuan AI pada bidang ini.
                  </p>
                </div>`;

            return `<div class="card">
              <div class="card-head">
                <div>
                  <span class="pill pill-blue">${escapeHtml(
                    GROUP_CONFIG[curr.group]?.label || curr.group
                  )}</span>
                  ${
                    isSurveyField
                      ? `<span class="pill pill-dark">Bidang Target Survey Utama</span>`
                      : ""
                  }
                </div>
                <span class="pill pill-lime">Bonus Kesiapan Terkumpul: +${escapeHtml(
                  modBonus + certBonus
                )}%</span>
              </div>
              <h3 style="margin:4px 0 6px;font-size:17px;">${escapeHtml(curr.fieldName)}</h3>

              <div class="score-grid">
                <div class="score-box">
                  <span class="meta-label">Modul Materi</span>
                  <span class="meta-value">${escapeHtml(
                    prog.completedModules.length
                  )} / ${escapeHtml(curr.learningModules.length)} (${escapeHtml(modPct)}%)</span>
                </div>
                <div class="score-box">
                  <span class="meta-label">Quiz Sertifikasi</span>
                  <span class="meta-value">${escapeHtml(
                    prog.passedCertIds.length
                  )} / ${escapeHtml(curr.certificationDrills.length)} (${escapeHtml(certPct)}%)</span>
                </div>
                <div class="score-box">
                  <span class="meta-label">Kesiapan Saat Ini</span>
                  <span class="meta-value">${
                    totalReadiness !== null
                      ? `${escapeHtml(totalReadiness)}% / Target ${escapeHtml(targetMinScore)}%`
                      : `+${escapeHtml(modBonus + certBonus)}% Bonus`
                  }</span>
                </div>
                <div class="score-box">
                  <span class="meta-label">Catatan Praktik</span>
                  <span class="meta-value">${escapeHtml(
                    Object.keys(prog.practiceNotes || {}).length
                  )} Modul</span>
                </div>
              </div>

              <div class="progress-wrap">
                <div class="progress-label-row">
                  <span>Ketuntasan Modul Materi</span>
                  <span>${escapeHtml(modPct)}%</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill" style="width:${escapeHtml(modPct)}%;"></div>
                </div>
              </div>
              <div class="progress-wrap">
                <div class="progress-label-row">
                  <span>Kelulusan Quiz Sertifikasi</span>
                  <span>${escapeHtml(certPct)}%</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill blue" style="width:${escapeHtml(certPct)}%;"></div>
                </div>
              </div>

              <div style="margin-top:10px;">
                <strong style="font-size:12px;">Rincian Penyelesaian Modul &amp; Catatan Praktik:</strong>
                <table class="report-table">
                  <thead>
                    <tr>
                      <th style="width:90px;">Kode</th>
                      <th>Modul Materi &amp; Catatan Praktik</th>
                      <th style="width:65px;">Poin</th>
                      <th style="width:90px;">Status</th>
                    </tr>
                  </thead>
                  <tbody>${moduleRows}</tbody>
                </table>
              </div>

              <div style="margin-top:10px;">
                <strong style="font-size:12px;">Rincian Quiz Latihan Sertifikasi:</strong>
                <table class="report-table">
                  <thead>
                    <tr>
                      <th style="width:110px;">Kompetensi</th>
                      <th>Unit Sertifikasi &amp; Topik Uji</th>
                      <th style="width:65px;">Poin</th>
                      <th style="width:100px;">Status</th>
                    </tr>
                  </thead>
                  <tbody>${certRows}</tbody>
                </table>
              </div>

              ${verBlock}
            </div>`;
          })
          .join("")
      : `<div class="card card-white">
          <span class="pill pill-muted">BELUM ADA PROGRES MODUL ATAU QUIZ SERTIFIKASI</span>
          <p style="margin:8px 0 0;font-size:12.5px;color:#52514E;">
            Peserta belum menandai modul materi selesai atau mengerjakan quiz latihan sertifikasi di menu <strong>Modul &amp; Sertifikasi (/hasil-analisis)</strong>.
          </p>
        </div>`;

  // Peta cakupan seluruh 11 bidang di website
  const coverageGridHtml = `
    <div class="card card-white">
      <strong style="font-size:12px;">Peta Cakupan Seluruh Kurikulum Website (11 Bidang Studi Bali):</strong>
      <div class="coverage-grid">
        ${allCurricula
          .map((curr) => {
            const prog = snapshot.progressByField?.[curr.fieldId];
            const doneM = prog ? prog.completedModules.length : 0;
            const doneC = prog ? prog.passedCertIds.length : 0;
            const isActive = Boolean(prog);
            return `<div class="coverage-item ${isActive ? "active" : ""}">
              <div>
                <strong>${escapeHtml(curr.fieldName)}</strong><br/>
                <span style="color:#52514E;font-size:11px;">${escapeHtml(doneM)}/${escapeHtml(curr.learningModules.length)} Modul | ${escapeHtml(doneC)}/${escapeHtml(curr.certificationDrills.length)} Quiz</span>
              </div>
              <span class="pill ${
                prog?.verification?.status === "passed"
                  ? "pill-lime"
                  : isActive
                  ? "pill-blue"
                  : "pill-muted"
              }">${
                prog?.verification?.status === "passed"
                  ? "Terverifikasi"
                  : isActive
                  ? "Aktif"
                  : "Belum"
              }</span>
            </div>`;
          })
          .join("")}
      </div>
    </div>
  `;

  // 4. Jurnal Catatan Belajar Pribadi (/profil)
  const personalNotesHtml =
    personalNotes.length > 0
      ? personalNotes
          .map(
            (n, idx) => `<div class="card card-white">
              <div class="card-head">
                <div>
                  <span class="pill pill-dark">#${idx + 1}</span>
                  <span class="pill pill-blue">${escapeHtml(getFieldLabelById(n.fieldId))}</span>
                  <span class="pill pill-amber">${escapeHtml(n.category)}</span>
                </div>
                <span class="pill pill-muted">${escapeHtml(
                  new Date(n.updatedAt).toLocaleDateString("id-ID", {
                    dateStyle: "medium",
                  })
                )}</span>
              </div>
              <h4 style="margin:2px 0 4px;font-size:15px;">${escapeHtml(n.title)}</h4>
              <div class="note-body">${escapeHtml(n.content)}</div>
            </div>`
          )
          .join("")
      : `<div class="card card-white">
          <p style="margin:0;font-size:12.5px;color:#52514E;">Belum ada jurnal catatan belajar pribadi yang tersimpan di halaman Profil.</p>
        </div>`;

  // 5. Bidang Tersimpan (/peta-bidang) & Langkah Tindak Lanjut
  const savedFieldsHtml =
    savedFieldIds.length > 0
      ? `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;">
          ${savedFieldIds
            .map((fid) => {
              const label =
                FIELDS.find((f) => f.id === fid)?.name ||
                MENTOR_CURRICULUM_BY_FIELD[fid]?.fieldName ||
                fid.toUpperCase();
              return `<span class="pill pill-lime">${escapeHtml(label)}</span>`;
            })
            .join("")}
        </div>`
      : `<p style="margin:6px 0 0;font-size:12.5px;color:#52514E;">Belum ada bidang yang ditandai simpan pada halaman Peta Bidang.</p>`;

  const nextSteps: string[] = [];
  if (!exploration) {
    nextSteps.push(
      "Selesaikan Kuesioner Eksplorasi Minat (/eksplorasi) untuk mendapatkan pemeringkatan jurusan & jarak kampus terdekat di Bali."
    );
  }
  if (!survey) {
    nextSteps.push(
      "Ikuti Survey Keminatan Penjurusan (/tes-keminatan) untuk menetapkan Skor Dasar Survey resmi pada profil Anda."
    );
  }
  if (totalModulesCompleted === 0) {
    nextSteps.push(
      "Pelajari modul materi di Workspace Modul (/hasil-analisis) dan tandai selesai untuk menambah poin kesiapan hingga +25%."
    );
  }
  if (totalCertsPassed === 0) {
    nextSteps.push(
      "Kerjakan Quiz Latihan Sertifikasi untuk menguji penguasaan unit kompetensi industri/BNSP."
    );
  }
  if (verifiedFieldsCount === 0) {
    nextSteps.push(
      "Ikuti Uji Verifikasi Kemampuan Akhir AI pada bidang fokus agar kelulusan tercatat pada transkrip profil."
    );
  }
  if (nextSteps.length === 0) {
    nextSteps.push(
      "Gunakan rekapan ini untuk berdiskusi dengan Guru BK, orang tua, atau konsultasikan rencana kampus di AI Navigator (/ai-navigator)."
    );
  }

  const bodyHtml = `
    <div class="meta-grid">
      <div class="meta-card">
        <span class="meta-label">Nama &amp; Status Peserta</span>
        <span class="meta-value">${escapeHtml(
          user ? user.name : "Mode Tamu Browser"
        )}${user ? ` (${escapeHtml(user.role === "guru" ? "Guru BK" : "Siswa")})` : ""}</span>
      </div>
      <div class="meta-card">
        <span class="meta-label">Identitas / Email</span>
        <span class="meta-value">${
          user
            ? `${escapeHtml(user.identifier)} | ${escapeHtml(user.email)}`
            : "Belum Masuk Akun"
        }</span>
      </div>
      <div class="meta-card">
        <span class="meta-label">Domisili Acuan Bali</span>
        <span class="meta-value">${escapeHtml(originLabel)}</span>
      </div>
      <div class="meta-card">
        <span class="meta-label">Aktivitas Tercatat</span>
        <span class="meta-value">${escapeHtml(activeProgress.length)} / 11 Bidang Aktif</span>
      </div>
    </div>

    ${registeredInterestsHtml}

    <div class="section" style="margin-top:10px;">
      <h2 class="section-title">Ringkasan Capaian Keseluruhan Website</h2>
      ${kpiDashboardHtml}
    </div>

    <div class="section">
      <h2 class="section-title">1. Hasil Kuesioner Eksplorasi Minat &amp; Penjurusan</h2>
      ${explorationSectionHtml}
    </div>

    <div class="section">
      <h2 class="section-title">2. Hasil Kuisioner Survey Keminatan Dasar</h2>
      ${surveySectionHtml}
    </div>

    <div class="section">
      <h2 class="section-title">3. Rekap Penyelesaian Modul, Quiz Sertifikasi &amp; Verifikasi Kemampuan</h2>
      ${fieldsHtml}
      ${coverageGridHtml}
    </div>

    <div class="section">
      <h2 class="section-title">4. Jurnal Catatan Belajar Pribadi (${escapeHtml(personalNotes.length)})</h2>
      ${personalNotesHtml}
    </div>

    <div class="section">
      <h2 class="section-title">5. Bidang Favorit Tersimpan &amp; Rekomendasi Lanjutan</h2>
      <div class="card card-white">
        <strong style="font-size:12px;">Bidang Studi Tersimpan dari Peta Bidang:</strong>
        ${savedFieldsHtml}
        <div style="margin-top:12px;">
          <strong style="font-size:12px;">Rekomendasi Langkah Tindak Lanjut:</strong>
          <ul>
            ${nextSteps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
          </ul>
        </div>
      </div>
    </div>
  `;

  return buildReportShell(
    "Rekapitulasi Hasil & Aktivitas Pengguna KertaMarga Bali",
    user
      ? `${user.name} (${user.role === "guru" ? "Guru BK" : "Siswa Terdaftar"}) - Rangkuman lengkap kuesioner, survey, modul, quiz sertifikasi, verifikasi AI, dan catatan belajar.`
      : "Rangkuman lengkap kuesioner eksplorasi, survey minat, modul materi, quiz sertifikasi, verifikasi AI, dan catatan belajar.",
    bodyHtml
  );
}
