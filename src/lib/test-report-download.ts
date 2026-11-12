import { GROUP_CONFIG, type FieldGroup } from "@/data/fields";
import { getBaliEntitiesForField } from "@/data/bali-institutions";
import type { UserLocationOrigin } from "@/data/catalog";
import {
  MENTOR_CURRICULUM_BY_FIELD,
  type FieldCurriculum,
  type TargetCourse,
} from "@/data/mentorCurriculum";
import type { AssessmentAnalysisResult } from "@/lib/scoring";
import type {
  FieldStudyProgressSnapshot,
  FieldVerificationResult,
  FullLearningSnapshot,
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
  const generatedAt = new Date().toLocaleDateString("id-ID", {
    dateStyle: "long",
  });

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <style>
    @page {
      size: A4;
      margin: 14mm 16mm;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 28px 16px;
      background: #F4F2ED;
      color: #141413;
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13px;
      line-height: 1.55;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .sheet {
      max-width: 780px;
      margin: 0 auto;
      background: #FFFFFF;
      border: 1px solid #DCD7CD;
      border-radius: 12px;
      padding: 32px 36px;
    }
    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      padding-bottom: 18px;
      border-bottom: 2px solid #141413;
      margin-bottom: 20px;
    }
    .brand-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .brand-badge {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #3B66FF;
    }
    h1 {
      margin: 0;
      font-size: 21px;
      line-height: 1.25;
      font-weight: 800;
      letter-spacing: -0.01em;
    }
    .subtitle {
      margin: 4px 0 0;
      color: #52514E;
      font-size: 12.5px;
      font-weight: 500;
    }
    .print-actions {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;
      shrink: 0;
    }
    .btn-print {
      border: 1.5px solid #141413;
      background: #141413;
      color: #FFFFFF;
      border-radius: 8px;
      padding: 8px 14px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
    }
    .btn-print:hover {
      background: #2C2C2A;
    }
    .date-stamp {
      font-size: 11px;
      color: #52514E;
      font-weight: 600;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin-bottom: 20px;
      padding: 12px 14px;
      background: #FAF8F4;
      border: 1px solid #E5E0D8;
      border-radius: 10px;
    }
    .meta-card {
      min-width: 0;
    }
    .meta-label {
      display: block;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 700;
      color: #6B6965;
      margin-bottom: 2px;
    }
    .meta-value {
      font-size: 13px;
      font-weight: 700;
      color: #141413;
      word-break: break-word;
    }
    .section {
      margin-top: 22px;
    }
    .section-title {
      margin: 0 0 10px;
      padding-bottom: 6px;
      border-bottom: 1px solid #E5E0D8;
      font-size: 14px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #141413;
      break-after: avoid;
    }
    .card {
      background: #FFFFFF;
      border: 1px solid #E2DDD4;
      border-left: 3.5px solid #141413;
      border-radius: 8px;
      padding: 14px 16px;
      margin-bottom: 10px;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .card-accent-blue {
      border-left-color: #3B66FF;
    }
    .card-accent-lime {
      border-left-color: #7DB818;
    }
    .card-white {
      background: #FAF8F4;
      border-left-color: #C9C3B8;
    }
    .card-head {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }
    .pill {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 6px;
      border: 1px solid #D5D0C7;
      font-size: 10.5px;
      font-weight: 700;
      background: #FAF8F4;
      color: #141413;
    }
    .pill-lime { background: #E9F9C4; border-color: #A9D948; color: #141413; }
    .pill-blue { background: #EBF0FF; border-color: #B4C6FF; color: #1E44C8; }
    .pill-amber { background: #FFF2CC; border-color: #F2CC60; color: #5C4200; }
    .pill-dark { background: #141413; border-color: #141413; color: #FFFFFF; }
    .score-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 10px;
      margin: 10px 0;
    }
    .score-box {
      background: #FAF8F4;
      border: 1px solid #E5E0D8;
      border-radius: 8px;
      padding: 8px 12px;
    }
    ul {
      margin: 5px 0 0;
      padding-left: 18px;
      font-size: 12.5px;
      color: #2B2A28;
    }
    li { margin-bottom: 3px; }
    .footer-note {
      margin-top: 28px;
      padding-top: 12px;
      border-top: 1px solid #E5E0D8;
      font-size: 10.5px;
      color: #6B6965;
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }
    @media print {
      body {
        background: #FFFFFF;
        padding: 0;
      }
      .sheet {
        border: none;
        border-radius: 0;
        padding: 0;
        max-width: 100%;
      }
      .print-actions .btn-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="topbar">
      <div>
        <div class="brand-row">
          <svg width="20" height="20" viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="88" fill="#FAF7F2" stroke="#141413" stroke-width="14"/>
            <polygon points="100,22 118,82 178,100 118,118 100,178 82,118 22,100 82,82" fill="#3B66FF" stroke="#141413" stroke-width="8"/>
            <circle cx="100" cy="100" r="24" fill="#B8F348" stroke="#141413" stroke-width="8"/>
          </svg>
          <span class="brand-badge">KertaMarga Bali &bull; Laporan Resmi</span>
        </div>
        <h1>${escapeHtml(title)}</h1>
        <p class="subtitle">${escapeHtml(subtitle)}</p>
      </div>
      <div class="print-actions">
        <button type="button" class="btn-print" onclick="window.print()">Simpan / Cetak PDF</button>
        <span class="date-stamp">Tanggal: ${escapeHtml(generatedAt)}</span>
      </div>
    </div>
    ${bodyHtml}
    <div class="footer-note">
      <span>Dokumen ini dihasilkan otomatis oleh KertaMarga Bali</span>
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

export function openPrintableReport(html: string, _fallbackFilename?: string): boolean {
  try {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.visibility = "hidden";
    document.body.appendChild(iframe);

    const cleanup = () => {
      window.setTimeout(() => {
        iframe.remove();
      }, 1000);
    };

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc && iframe.contentWindow) {
      doc.open();
      doc.write(html);
      doc.close();

      const targetWin = iframe.contentWindow;
      targetWin.addEventListener("afterprint", cleanup, { once: true });

      window.setTimeout(() => {
        try {
          targetWin.focus();
          targetWin.print();
        } catch {
          cleanup();
        }
      }, 200);

      // Backup cleanup jika event afterprint tidak terpicu di browser tertentu
      window.setTimeout(cleanup, 60000);
      return true;
    }

    iframe.remove();
  } catch {
    // Lanjut ke fallback tab baru jika iframe gagal
  }

  const win = window.open("", "_blank");
  if (!win) {
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
  const { result, educationLevel, originLabel, userName, userIdentifier } = params;

  const participantText =
    userName && userIdentifier && userIdentifier !== userName
      ? `${userName} (${userIdentifier})`
      : userName || "Pelajar Bali";

  const recommendationsHtml = result.topRecommendations
    .map((rec) => {
      const reasons = rec.reasoningTrace
        .slice(0, 3)
        .map((r) => `<li>${escapeHtml(r)}</li>`)
        .join("");
      const institutions = rec.matchedInstitutions
        .slice(0, 3)
        .map(
          (inst) =>
            `<li><strong>${escapeHtml(inst.institutionName)}</strong> (${escapeHtml(inst.level)}) - ${escapeHtml(inst.programName)}, ${escapeHtml(inst.kabupaten)}</li>`
        )
        .join("");

      return `<div class="card ${rec.rank === 1 ? "card-accent-lime" : "card-accent-blue"}">
        <div class="card-head">
          <div>
            <span class="pill pill-dark">Peringkat ${escapeHtml(rec.rank)}</span>
            <span class="pill">${escapeHtml(rec.field.categoryName)}</span>
          </div>
          <span class="pill pill-lime">Kesesuaian: ${escapeHtml(rec.compositeScore)}%</span>
        </div>
        <h3 style="margin:4px 0 3px;font-size:16px;font-weight:800;">${escapeHtml(rec.field.name)}</h3>
        <p style="margin:0 0 8px;font-size:12px;color:#52514E;">${escapeHtml(rec.field.shortDesc)}</p>
        ${
          reasons
            ? `<div style="margin-top:6px;">
                <strong style="font-size:11.5px;color:#141413;">Alasan Utama:</strong>
                <ul>${reasons}</ul>
              </div>`
            : ""
        }
        ${
          institutions
            ? `<div style="margin-top:8px;">
                <strong style="font-size:11.5px;color:#141413;">Rekomendasi Institusi di Bali:</strong>
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
        <span class="meta-value">${escapeHtml(participantText)}</span>
      </div>
      <div class="meta-card">
        <span class="meta-label">Jenjang Pendidikan</span>
        <span class="meta-value">${escapeHtml(educationLevel)}</span>
      </div>
      <div class="meta-card">
        <span class="meta-label">Domisili Bali</span>
        <span class="meta-value">${escapeHtml(originLabel)}</span>
      </div>
    </div>
    <div class="section">
      <h2 class="section-title">Rekomendasi Bidang Studi</h2>
      ${recommendationsHtml}
    </div>
  `;

  return buildReportShell(
    "Hasil Eksplorasi Minat & Penjurusan",
    "Ringkasan rekomendasi bidang studi dan institusi rujukan di Bali.",
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
  originLabel?: string;
  userName?: string;
  userIdentifier?: string;
}

export type StoredEducationLevel = "SMP" | "SMA" | "SMK" | "Lainnya";

export function getStoredEducationLevel(): StoredEducationLevel | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem("km_assessment_state");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { educationLevel?: unknown };
    if (
      parsed.educationLevel === "SMP" ||
      parsed.educationLevel === "SMA" ||
      parsed.educationLevel === "SMK" ||
      parsed.educationLevel === "Lainnya"
    ) {
      return parsed.educationLevel;
    }
  } catch {
    // Abaikan jika sessionStorage dibatasi
  }
  return null;
}

function buildRecommendedInstitutionsHtml(
  fieldId: string,
  origin: string | UserLocationOrigin = "Kota Denpasar",
  educationLevel?: StoredEducationLevel | null
): string {
  const level = educationLevel ?? getStoredEducationLevel();
  const { smk, sma, perguruanTinggi } = getBaliEntitiesForField(fieldId, origin);

  const formatList = (items: typeof smk) =>
    items
      .map(
        (inst) =>
          `<li><strong>${escapeHtml(inst.name)}</strong> (${escapeHtml(inst.status)}) - ${escapeHtml(inst.kabupaten)}</li>`
      )
      .join("");

  // Jika jenjang SMP: hanya tampilkan SMK/SMA. Jika SMA/SMK/Lainnya: hanya tampilkan Perguruan Tinggi.
  if (level === "SMP") {
    const topSmk = smk.slice(0, 3);
    const topSma = sma.slice(0, 2);
    if (topSmk.length === 0 && topSma.length === 0) return "";
    return `
      <div class="score-grid">
        ${
          topSmk.length > 0
            ? `<div class="card card-white" style="margin-bottom:0;">
                <strong style="font-size:12px;">Rekomendasi SMK Terdekat</strong>
                <ul>${formatList(topSmk)}</ul>
              </div>`
            : ""
        }
        ${
          topSma.length > 0
            ? `<div class="card card-white" style="margin-bottom:0;">
                <strong style="font-size:12px;">Rekomendasi SMA Terdekat</strong>
                <ul>${formatList(topSma)}</ul>
              </div>`
            : ""
        }
      </div>
    `;
  }

  if (level === "SMA" || level === "SMK" || level === "Lainnya") {
    const topPt = perguruanTinggi.slice(0, 3);
    if (topPt.length === 0) return "";
    return `
      <div class="card card-white" style="margin-bottom:0;">
        <strong style="font-size:12px;">Rekomendasi Perguruan Tinggi di Bali</strong>
        <ul>${formatList(topPt)}</ul>
      </div>
    `;
  }

  const topSmk = smk.slice(0, 3);
  const topPt = perguruanTinggi.slice(0, 3);
  if (topSmk.length === 0 && topPt.length === 0) return "";

  return `
    <div class="score-grid">
      ${
        topSmk.length > 0
          ? `<div class="card card-white" style="margin-bottom:0;">
              <strong style="font-size:12px;">Rekomendasi SMK Terdekat</strong>
              <ul>${formatList(topSmk)}</ul>
            </div>`
          : ""
      }
      ${
        topPt.length > 0
          ? `<div class="card card-white" style="margin-bottom:0;">
              <strong style="font-size:12px;">Rekomendasi Perguruan Tinggi</strong>
              <ul>${formatList(topPt)}</ul>
            </div>`
          : ""
      }
    </div>
  `;
}

export function buildSurveyWorkspaceReportHtml(
  params: SurveyWorkspaceReportParams
): string {
  const {
    curriculum,
    targetCourse,
    currentReadinessScore,
    dominantGroup,
    isGroupMismatch,
    progress,
    originLabel,
    userName,
    userIdentifier,
  } = params;

  const dominantLabel = GROUP_CONFIG[dominantGroup]?.label || dominantGroup;
  const gap = Math.max(0, targetCourse.minScore - currentReadinessScore);
  const participantText =
    userName && userIdentifier && userIdentifier !== userName
      ? `${userName} (${userIdentifier})`
      : userName || "Pelajar Bali";

  const completedModsList = curriculum.learningModules
    .filter((m) => progress.completedModules.includes(m.id))
    .map((m) => `<li><strong>${escapeHtml(m.title)}</strong></li>`)
    .join("");

  const passedCertsList = curriculum.certificationDrills
    .filter((c) => progress.passedCertIds.includes(c.id))
    .map((c) => `<li>${escapeHtml(c.certName)}</li>`)
    .join("");

  const verBlock = progress.verification
    ? `<div class="section">
        <h2 class="section-title">Verifikasi Kemampuan AI</h2>
        <div class="card card-accent-blue">
          <div class="card-head">
            <span class="pill ${progress.verification.status === "passed" ? "pill-lime" : "pill-amber"}">
              ${progress.verification.status === "passed" ? "Lulus Terverifikasi" : "Perlu Pendalaman"}
            </span>
            <span class="pill pill-dark">Skor: ${escapeHtml(progress.verification.score)}%</span>
          </div>
          <p style="margin:4px 0 0;font-size:12.5px;">${escapeHtml(progress.verification.summary)}</p>
        </div>
      </div>`
    : "";

  const bodyHtml = `
    <div class="meta-grid">
      <div class="meta-card">
        <span class="meta-label">Peserta</span>
        <span class="meta-value">${escapeHtml(participantText)}</span>
      </div>
      <div class="meta-card">
        <span class="meta-label">Bidang Tujuan</span>
        <span class="meta-value">${escapeHtml(curriculum.fieldName)}</span>
      </div>
      <div class="meta-card">
        <span class="meta-label">Minat Alami</span>
        <span class="meta-value">${escapeHtml(dominantLabel)} (${isGroupMismatch ? "Lintas Minat" : "Selaras"})</span>
      </div>
    </div>

    <div class="card card-accent-lime">
      <div class="card-head">
        <strong style="font-size:14px;">Ringkasan Kesiapan Studi (${escapeHtml(targetCourse.name)})</strong>
        <span class="pill ${gap === 0 ? "pill-lime" : "pill-amber"}">
          ${gap === 0 ? "Memenuhi Standar" : "Perlu Penguatan"}
        </span>
      </div>
      <div class="score-grid">
        <div class="score-box">
          <span class="meta-label">Skor Kesiapan</span>
          <span class="meta-value">${escapeHtml(currentReadinessScore)}%</span>
        </div>
        <div class="score-box">
          <span class="meta-label">Standar Minimum</span>
          <span class="meta-value">${escapeHtml(targetCourse.minScore)}%</span>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Progres Modul &amp; Sertifikasi</h2>
      <div class="card card-white">
        <strong>Modul Materi Selesai (${escapeHtml(progress.completedModules.length)}/${escapeHtml(curriculum.learningModules.length)})</strong>
        ${completedModsList ? `<ul>${completedModsList}</ul>` : `<p style="font-size:12.5px;color:#52514E;margin:6px 0 0;">Belum ada modul yang ditandai selesai.</p>`}
      </div>
      <div class="card card-white">
        <strong>Sertifikasi Lulus (${escapeHtml(progress.passedCertIds.length)}/${escapeHtml(curriculum.certificationDrills.length)})</strong>
        ${passedCertsList ? `<ul>${passedCertsList}</ul>` : `<p style="font-size:12.5px;color:#52514E;margin:6px 0 0;">Belum ada sertifikasi yang lulus.</p>`}
      </div>
    </div>
    ${verBlock}
    ${(() => {
      const recHtml = buildRecommendedInstitutionsHtml(
        curriculum.fieldId,
        originLabel || "Kota Denpasar"
      );
      return recHtml
        ? `<div class="section">
            <h2 class="section-title">Rekomendasi Sekolah &amp; Kampus di Bali</h2>
            ${recHtml}
          </div>`
        : "";
    })()}
  `;

  return buildReportShell(
    "Laporan Kesiapan Studi & Survey",
    `${curriculum.fieldName} - Target: ${targetCourse.certificationAlignment || curriculum.mainCertificationTitle}`,
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
        <h2 class="section-title">Ringkasan Pembahasan Soal</h2>
        ${evaluation.reviews
          .map(
            (rev, idx) => `<div class="card card-white">
              <div class="card-head">
                <span class="pill">Soal ${idx + 1}</span>
                <span class="pill ${rev.isCorrect ? "pill-lime" : "pill-amber"}">${rev.isCorrect ? "Tepat" : "Perlu Tinjauan"}</span>
              </div>
              <p style="margin:4px 0;font-size:12.5px;font-weight:700;">${escapeHtml(rev.question)}</p>
              <p style="margin:3px 0;font-size:12px;">Jawaban Anda: <strong>${
                rev.selectedIndex >= 0
                  ? `${String.fromCharCode(65 + rev.selectedIndex)}. ${escapeHtml(rev.options[rev.selectedIndex])}`
                  : "Belum dipilih"
              }</strong></p>
              ${
                !rev.isCorrect
                  ? `<p style="margin:3px 0;font-size:12px;">Kunci Jawaban: <strong>${String.fromCharCode(65 + rev.correctIndex)}. ${escapeHtml(rev.options[rev.correctIndex])}</strong></p>`
                  : ""
              }
              <p style="margin:5px 0 0;font-size:12px;color:#52514E;">${escapeHtml(rev.explanation)}</p>
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
        <span class="meta-label">Status &amp; Skor</span>
        <span class="meta-value">${status === "passed" ? "Lulus Terverifikasi" : "Perlu Pendalaman"} (${escapeHtml(score)}%)</span>
      </div>
    </div>

    <div class="card ${status === "passed" ? "card-accent-lime" : "card-accent-blue"}">
      <div class="card-head">
        <strong style="font-size:14px;">Evaluasi Pemahaman (${escapeHtml(targetCourse.name)})</strong>
        <span class="pill pill-dark">Benar ${escapeHtml(correctCount)}/${escapeHtml(totalQuestions)}</span>
      </div>
      <p style="margin:4px 0 10px;font-size:12.5px;">${escapeHtml(summary)}</p>
      <div class="score-grid">
        <div class="score-box">
          <span class="meta-label">Kekuatan</span>
          ${strengths.length ? `<ul>${strengths.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>` : `<p style="font-size:12px;margin:4px 0;">Teruskan latihan kasus praktik.</p>`}
        </div>
        <div class="score-box">
          <span class="meta-label">Saran Peningkatan</span>
          ${improvements.length ? `<ul>${improvements.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>` : `<p style="font-size:12px;margin:4px 0;">Pemahaman lintas modul sudah baik.</p>`}
        </div>
      </div>
    </div>
    ${reviewHtml}
  `;

  return buildReportShell(
    "Hasil Verifikasi Kemampuan AI",
    `${curriculum.fieldName} - Evaluasi Pemahaman Lintas Modul`,
    bodyHtml
  );
}

export function buildProfileTestReportHtml(params: {
  snapshot: FullLearningSnapshot;
  user: SafeUser | null;
  originLabel: string;
  origin?: UserLocationOrigin;
}): string {
  const { snapshot, user, originLabel, origin } = params;
  const activeProgress = Object.values(snapshot.progressByField || {}).filter(
    (prog) => Boolean(MENTOR_CURRICULUM_BY_FIELD[prog.fieldId])
  );

  let totalModulesCompleted = 0;
  let totalCertsPassed = 0;
  for (const prog of activeProgress) {
    totalModulesCompleted += prog.completedModules.length;
    totalCertsPassed += prog.passedCertIds.length;
  }

  const surveyCurr = snapshot.surveyResult
    ? MENTOR_CURRICULUM_BY_FIELD[snapshot.surveyResult.fieldId]
    : null;

  const cleanOrigin = originLabel.replace(/,\s*([^,]+)\s*\(\1\)\s*$/, ", $1");
  const participantText = user
    ? user.identifier && user.identifier.toLowerCase() !== user.email.toLowerCase()
      ? `${user.name} (${user.identifier})`
      : user.name
    : "Mode Tamu Browser";

  const surveySectionHtml = snapshot.surveyResult
    ? `<div class="card card-accent-lime">
        <div class="card-head">
          <strong style="font-size:15px;">${escapeHtml(
            surveyCurr?.fieldName || snapshot.surveyResult.fieldId.toUpperCase()
          )}</strong>
          <span class="pill ${snapshot.surveyResult.mismatch ? "pill-amber" : "pill-lime"}">
            ${snapshot.surveyResult.mismatch ? "Jalur Lintas Minat" : "Minat Selaras"}
          </span>
        </div>
        <div class="score-grid">
          <div class="score-box">
            <span class="meta-label">Skor Survey</span>
            <span class="meta-value">${escapeHtml(snapshot.surveyResult.score)}%</span>
          </div>
          <div class="score-box">
            <span class="meta-label">Klaster Minat</span>
            <span class="meta-value">${escapeHtml(
              GROUP_CONFIG[snapshot.surveyResult.dominant]?.label ||
                snapshot.surveyResult.dominant
            )}</span>
          </div>
        </div>
      </div>`
    : `<div class="card card-white">
        <p style="margin:0;font-size:12.5px;color:#52514E;">
          Belum ada hasil Survey Keminatan yang tercatat.
        </p>
      </div>`;

  const fieldsHtml =
    activeProgress.length > 0
      ? activeProgress
          .map((prog) => {
            const curr = MENTOR_CURRICULUM_BY_FIELD[prog.fieldId];
            if (!curr) return "";
            const verBadge = prog.verification
              ? `<span class="pill ${prog.verification.status === "passed" ? "pill-lime" : "pill-amber"}">
                  Verifikasi AI: ${prog.verification.status === "passed" ? "Lulus" : "Perlu Pendalaman"} (${escapeHtml(prog.verification.score)}%)
                </span>`
              : "";
            const doneModItems = curr.learningModules
              .filter((m) => prog.completedModules.includes(m.id))
              .map((m) => `<li>${escapeHtml(m.title)}</li>`)
              .join("");
            const passedCertItems = curr.certificationDrills
              .filter((c) => prog.passedCertIds.includes(c.id))
              .map((c) => `<li>${escapeHtml(c.certName)}</li>`)
              .join("");

            return `<div class="card card-accent-blue">
              <div class="card-head">
                <strong style="font-size:15px;">${escapeHtml(curr.fieldName)}</strong>
                ${verBadge}
              </div>
              <div class="score-grid">
                <div class="score-box">
                  <span class="meta-label">Modul Selesai</span>
                  <span class="meta-value">${escapeHtml(
                    prog.completedModules.length
                  )} / ${escapeHtml(curr.learningModules.length)}</span>
                </div>
                <div class="score-box">
                  <span class="meta-label">Sertifikasi Lulus</span>
                  <span class="meta-value">${escapeHtml(
                    prog.passedCertIds.length
                  )} / ${escapeHtml(curr.certificationDrills.length)}</span>
                </div>
              </div>
              ${
                doneModItems
                  ? `<div style="margin-top:6px;"><strong style="font-size:11.5px;">Modul Terselesaikan:</strong><ul>${doneModItems}</ul></div>`
                  : ""
              }
              ${
                passedCertItems
                  ? `<div style="margin-top:6px;"><strong style="font-size:11.5px;">Sertifikasi Lulus:</strong><ul>${passedCertItems}</ul></div>`
                  : ""
              }
            </div>`;
          })
          .join("")
      : `<div class="card card-white"><p style="margin:0;font-size:12.5px;color:#52514E;">Belum ada progres modul atau sertifikasi yang tercatat.</p></div>`;

  const bodyHtml = `
    <div class="meta-grid">
      <div class="meta-card">
        <span class="meta-label">Peserta</span>
        <span class="meta-value">${escapeHtml(participantText)}</span>
      </div>
      <div class="meta-card">
        <span class="meta-label">Domisili Bali</span>
        <span class="meta-value">${escapeHtml(cleanOrigin)}</span>
      </div>
      <div class="meta-card">
        <span class="meta-label">Ringkasan Progres</span>
        <span class="meta-value">${escapeHtml(totalModulesCompleted)} Modul &bull; ${escapeHtml(totalCertsPassed)} Sertifikasi</span>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">1. Hasil Survey Keminatan</h2>
      ${surveySectionHtml}
    </div>

    <div class="section">
      <h2 class="section-title">2. Progres Belajar &amp; Sertifikasi</h2>
      ${fieldsHtml}
    </div>

    ${(() => {
      const targetRecFieldId =
        snapshot.surveyResult?.fieldId || activeProgress[0]?.fieldId;
      if (!targetRecFieldId) return "";
      const recCurr = MENTOR_CURRICULUM_BY_FIELD[targetRecFieldId];
      const recHtml = buildRecommendedInstitutionsHtml(
        targetRecFieldId,
        origin || originLabel
      );
      if (!recHtml) return "";
      return `<div class="section">
        <h2 class="section-title">3. Rekomendasi Sekolah &amp; Kampus (${escapeHtml(
          recCurr?.fieldName || targetRecFieldId.toUpperCase()
        )})</h2>
        ${recHtml}
      </div>`;
    })()}
  `;

  return buildReportShell(
    "Laporan Profil & Hasil Tes KertaMarga Bali",
    user
      ? `${user.name} (${user.role === "guru" ? "Guru BK" : "Siswa"}) - ${user.email}`
      : "Ringkasan hasil survey keminatan, progres modul, dan sertifikasi.",
    bodyHtml
  );
}
