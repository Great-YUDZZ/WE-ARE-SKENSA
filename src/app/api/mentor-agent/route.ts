import { NextRequest, NextResponse } from "next/server";
import { MENTOR_CURRICULUM_BY_FIELD } from "@/data/mentorCurriculum";

interface MentorRequestPayload {
  fieldId: string;
  targetCourseId?: string;
  currentScore: number;
  targetScore: number;
  userMessage: string;
  completedModules: string[];
  passedCerts: string[];
}

export interface MentorAgentResponse {
  agentTitle: string;
  diagnosisSummary: string;
  replyMessage: string;
  recommendedActionType: "materi" | "sertifikasi" | "portofolio" | "siap";
  recommendedItemTitle: string;
  keyTakeaways: string[];
  encouragementNote: string;
  sourceMode: "gemini-structured" | "deterministic-verified";
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as MentorRequestPayload;
    const fieldId = body.fieldId || "informatika";
    const curriculum =
      MENTOR_CURRICULUM_BY_FIELD[fieldId] || MENTOR_CURRICULUM_BY_FIELD.informatika;

    const targetCourse =
      curriculum.targetCourses.find((c) => c.id === body.targetCourseId) ||
      curriculum.targetCourses[0];

    const currentScore = Number(body.currentScore) || 55;
    const targetScore = Number(body.targetScore) || targetCourse.minScore;
    const gap = Math.max(0, targetScore - currentScore);
    const msgLower = (body.userMessage || "").toLowerCase();

    // Find next uncompleted learning module & certification drill
    const nextModule =
      curriculum.learningModules.find(
        (m) => !(body.completedModules || []).includes(m.id)
      ) || curriculum.learningModules[0];

    const nextCert =
      curriculum.certificationDrills.find(
        (c) => !(body.passedCerts || []).includes(c.id)
      ) || curriculum.certificationDrills[0];

    // Optional Gemini API integration if GEMINI_API_KEY is available
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const systemInstruction = `Anda adalah Agen Pembimbing Akademik & Sertifikasi KertaMarga Bali.
Tugas Anda membimbing siswa SMP/SMA/SMK di Bali yang hasil tes keminatan atau nilai awalnya (${currentScore}%) masih di bawah standar jurusan "${curriculum.fieldName}" atau mata kuliah "${targetCourse.name}" (target minimal ${targetScore}%).
Aturan ketat:
1. Jangan gunakan simbol emoji atau tanda pisah panjang (em dash).
2. Berikan langkah konkret berbasis materi modul: "${nextModule.title}" dan latihan sertifikasi "${curriculum.mainCertificationTitle}".
3. Balas dalam format JSON sesuai skema.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemInstruction }] },
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `Pertanyaan siswa: "${body.userMessage}". Skor saat ini: ${currentScore}%, Target: ${targetScore}%, Modul selesai: ${(body.completedModules || []).length}/${curriculum.learningModules.length}, Soal sertifikasi lulus: ${(body.passedCerts || []).length}/${curriculum.certificationDrills.length}.`,
                    },
                  ],
                },
              ],
              generationConfig: {
                responseMimeType: "application/json",
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            return NextResponse.json({
              agentTitle: parsed.agentTitle || `Agen Pembimbing ${curriculum.fieldName}`,
              diagnosisSummary:
                parsed.diagnosisSummary ||
                `Selisih kesiapan saat ini ${gap} poin menuju ambang batas mata kuliah ${targetCourse.name}.`,
              replyMessage: parsed.replyMessage || parsed.message || "",
              recommendedActionType: parsed.recommendedActionType || "materi",
              recommendedItemTitle: parsed.recommendedItemTitle || nextModule.title,
              keyTakeaways: Array.isArray(parsed.keyTakeaways)
                ? parsed.keyTakeaways
                : nextModule.keyConcepts.slice(0, 3),
              encouragementNote:
                parsed.encouragementNote ||
                "Setiap modul dan latihan sertifikasi yang Anda tuntaskan akan meningkatkan kesiapan akademik secara terukur.",
              sourceMode: "gemini-structured",
            } satisfies MentorAgentResponse);
          }
        }
      } catch {
        // Fallback deterministik aktif secara otomatis sesuai AGENT.md
      }
    }

    // Deterministic Rule-Based Mentor Engine (100% reliable fallback)
    let replyMessage = "";
    let recommendedActionType: "materi" | "sertifikasi" | "portofolio" | "siap" = "materi";
    let recommendedItemTitle = nextModule.title;
    let keyTakeaways = nextModule.keyConcepts.slice(0, 3);

    if (
      msgLower.includes("sertifikasi") ||
      msgLower.includes("bnsp") ||
      msgLower.includes("ujian") ||
      msgLower.includes("soal") ||
      msgLower.includes("latihan")
    ) {
      recommendedActionType = "sertifikasi";
      recommendedItemTitle = `${nextCert.certName} (${nextCert.competencyCode})`;
      replyMessage = `Untuk memperkuat bukti keahlian di bidang ${curriculum.fieldName} dan menutup kekurangan nilai rapor, Anda sangat disarankan menguasai ${curriculum.mainCertificationTitle} dari ${curriculum.certificationBody}. Fokuslah pada unit kompetensi ${nextCert.competencyCode}. Silakan buka tab 'Latihan Sertifikasi' di samping untuk mengerjakan simulasi soal beserta pembahasannya hingga skor Anda bertambah +${nextCert.scoreBoost} poin per soal.`;
      keyTakeaways = [
        `Standar Sertifikasi: ${curriculum.mainCertificationTitle}`,
        `Unit Kompetensi Fokus: ${nextCert.competencyCode}`,
        `Target Penguasaan: Minimal 80% jawaban benar untuk validasi portofolio`,
      ];
    } else if (
      msgLower.includes("lintas") ||
      msgLower.includes("beda jurusan") ||
      msgLower.includes("tidak sesuai") ||
      msgLower.includes("nol") ||
      msgLower.includes("kecil") ||
      msgLower.includes("rendah")
    ) {
      recommendedActionType = "materi";
      recommendedItemTitle = nextModule.title;
      replyMessage = `${curriculum.mismatchBridgeAdvice} Saat ini skor kesiapan Anda berada di angka ${currentScore}% (masih kurang ${gap} poin dari target ${targetScore}% untuk mata kuliah ${targetCourse.name}). Jangan khawatir, langkah pertama yang wajib Anda lakukan adalah mempelajari '${nextModule.title}' dan mengerjakan tugas praktiknya: "${nextModule.practiceTask}".`;
      keyTakeaways = [
        curriculum.remedialActionPlan[0].title,
        curriculum.remedialActionPlan[1].title,
        `Peningkatan Skor: +${nextModule.scoreBoost} poin setelah menuntaskan modul ini`,
      ];
    } else if (
      msgLower.includes("matkul") ||
      msgLower.includes("mata kuliah") ||
      msgLower.includes("materi") ||
      msgLower.includes("belajar") ||
      msgLower.includes("jelaskan")
    ) {
      recommendedActionType = "materi";
      recommendedItemTitle = `${targetCourse.code} - ${targetCourse.name}`;
      replyMessage = `Pada mata kuliah '${targetCourse.name}' (${targetCourse.sks} SKS), kompetensi inti yang diuji adalah ${targetCourse.coreCompetency}. Ringkasan materi yang perlu Anda kuasai sekarang: ${nextModule.studyMaterial} Contoh penerapannya di Bali: ${nextModule.baliCaseStudy}`;
      keyTakeaways = nextModule.keyConcepts;
    } else if (currentScore >= targetScore) {
      recommendedActionType = "siap";
      recommendedItemTitle = `Portofolio Akhir & Verifikasi ${curriculum.mainCertificationTitle}`;
      replyMessage = `Selamat! Skor kesiapan Anda saat ini telah mencapai ${currentScore}%, melampaui batas minimum ${targetScore}% untuk mata kuliah ${targetCourse.name} di bidang ${curriculum.fieldName}. Langkah terakhir Anda adalah menyusun dokumentasi tugas praktik mandiri sebagai portofolio pendaftaran ke kampus atau SMK rujukan di Bali.`;
      keyTakeaways = [
        `Kesiapan Akademik Tercapai (${currentScore}% >= ${targetScore}%)`,
        `Siap mengikuti seleksi di institusi terverifikasi Bali`,
        `Pertahankan latihan pada simulasi sertifikasi ${curriculum.certificationBody}`,
      ];
    } else {
      recommendedActionType =
        (body.completedModules || []).length < curriculum.learningModules.length
          ? "materi"
          : "sertifikasi";
      recommendedItemTitle =
        recommendedActionType === "materi"
          ? nextModule.title
          : `${nextCert.certName} (${nextCert.competencyCode})`;
      replyMessage = `Berdasarkan analisis diagnostik, skor kesiapan Anda untuk jurusan ${curriculum.fieldName} (khususnya mata kuliah ${targetCourse.name}) adalah ${currentScore}%, sedangkan standar aman berada di angka ${targetScore}%. Untuk menutup selisih ${gap} poin ini, saya telah menyiapkan peta bimbingan bertahap: selesaikan modul '${nextModule.title}' terlebih dahulu, lalu lanjutkan dengan simulasi '${curriculum.mainCertificationTitle}'.`;
      keyTakeaways = [
        `Prioritas 1: Pelajari ${nextModule.title} (+${nextModule.scoreBoost}% kesiapan)`,
        `Prioritas 2: Kerjakan latihan ${nextCert.certName} (+${nextCert.scoreBoost}% kesiapan)`,
        `Prioritas 3: Praktikkan studi kasus lokal Bali (${nextModule.courseName})`,
      ];
    }

    const responseData: MentorAgentResponse = {
      agentTitle: `Agen Pembimbing ${curriculum.fieldName}`,
      diagnosisSummary:
        gap > 0
          ? `Skor Kesiapan ${currentScore}% (Kurang ${gap} poin dari standar ${targetScore}% mata kuliah ${targetCourse.code})`
          : `Skor Kesiapan ${currentScore}% (Telah Memenuhi Target >= ${targetScore}% mata kuliah ${targetCourse.code})`,
      replyMessage,
      recommendedActionType,
      recommendedItemTitle,
      keyTakeaways,
      encouragementNote:
        gap > 0
          ? "Nilai awal yang kecil bukan penghalang mutlak. Tuntaskan modul materi dan latihan sertifikasi di bawah untuk menaikkan skor kesiapan Anda secara nyata."
          : "Anda telah membuktikan penguasaan materi dan kesiapan sertifikasi pada bidang yang dituju.",
      sourceMode: "deterministic-verified",
    };

    return NextResponse.json(responseData);
  } catch {
    return NextResponse.json(
      {
        error: "Gagal memproses permintaan bimbingan agen.",
      },
      { status: 500 }
    );
  }
}
