import { NextRequest, NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
  userKabupaten?: string;
  targetLevel?: "semua" | "smk" | "kuliah";
}

export interface NavigatorChatResponse {
  reply: string;
  matchedFieldId: string | null;
  sourceMode: "9router-live" | "gemini-live" | "deterministic-qa";
}

// Fallback respons cerdas berbasis aturan tanya jawab jika koneksi AI eksternal offline
function getDeterministicQAReply(
  userQuery: string,
  userKabupaten: string,
  targetLevel: string
): { reply: string; matchedFieldId: string | null } {
  const q = userQuery.toLowerCase();

  if (q.includes("informatika") || q.includes("it") || q.includes("coding") || q.includes("komputer") || q.includes("software") || q.includes("rpl")) {
    return {
      matchedFieldId: "informatika",
      reply: `Untuk kamu yang ingin mengambil program studi Informatika atau Rekayasa Perangkat Lunak, berikut langkah strategis dan konkret yang perlu kamu siapkan:

1. Fondasi Logika dan Pemecahan Masalah
Mulai asah cara berpikir komputasional (computational thinking). Perkuat pemahaman matematika dasar (terutama logika, himpunan, dan aljabar). Cobalah belajar dasar pemrograman yang ramah pemula seperti Python atau JavaScript, atau algoritma logika dasar.

2. Pilih Jalur Pendidikan yang Tepat di Bali:
- Jenjang SMK (Vokasi Menengah): SMK Negeri 1 Denpasar (SKENSA) memiliki jurusan Rekayasa Perangkat Lunak (RPL) dan TKJ dengan akreditasi A, atau SMKN 1 Kuta Selatan.
- Jenjang Perguruan Tinggi: Politeknik Negeri Bali (PNB) di Jimbaran memiliki D4 Terapan TRPL (Unggul) yang sangat berfokus pada praktik industri, Universitas Udayana (S1 TI), Undiksha di Singaraja, atau ITB STIKOM Bali dan Primakara University.

3. Bangun Portofolio Proyek Nyata Sejak Dini
Jangan hanya menghafal teori. Buatlah proyek kecil seperti website profil sederhana, kalkulator interaktif, atau aplikasi mini. Dokumentasikan kode buatanmu di GitHub agar siap menjadi portofolio portir ke perguruan tinggi atau magang industri.

4. Persiapkan Standar Kompetensi dan Sertifikasi
Pelajari silabus kompetensi standar industri, seperti unit kompetensi Pemrograman Web dan Basis Data sesuai standar BNSP.

Saat ini apakah kamu berada di jenjang SMP kelas akhir yang ingin memilih sekolah lanjutan, atau sudah di jenjang SMA/SMK dan bersiap mendaftar kuliah? Bagian mana dari bidang teknologi yang paling kamu minati, coding aplikasi atau infrastruktur jaringan?`,
    };
  }

  if (q.includes("pariwisata") || q.includes("hotel") || q.includes("hospitality") || q.includes("wisata")) {
    return {
      matchedFieldId: "pariwisata",
      reply: `Untuk berhasil masuk dan berkarir gemilang di bidang Pariwisata dan Manajemen Perhotelan modern di Bali, berikut langkah terencana yang harus kamu lakukan:

1. Penguasaan Bahasa Asing dan Komunikasi
Bahasa Inggris aktif adalah syarat mutlak di ekosistem internasional Bali. Mulailah melatih percakapan sehari-hari dan kosa kata hospitality. Nilai tambah besar jika kamu mulai mempelajari bahasa ketiga seperti Mandarin, Jepang, atau Prancis.

2. Pemilihan Institusi Pendidikan Terbaik di Bali:
- Jenjang SMK: SMK Negeri 3 Denpasar (Akreditasi A) dan SMKN 1 Sukawati merupakan rujukan kejuruan perhotelan dan tata boga unggul.
- Jenjang Pendidikan Tinggi: Politeknik Pariwisata Bali (Poltekpar) di Nusa Dua dengan akreditasi Unggul standar UNWTO, atau program pariwisata di Universitas Udayana.

3. Penanaman Sikap Keramahan (Service Excellence) dan Etika Budaya
Pariwisata Bali berakar kuat pada nilai Tri Hita Karana dan keramahan tulus. Latihlah disiplin diri, kerapian penampilan (grooming), dan etika interpersonal.

4. Sertifikasi Profesi Hospitality (BNSP)
Kuasai standar operasional Front Office, Housekeeping, atau Food & Beverage Service yang kelak diuji pada sertifikasi profesi kejuruan.

Apakah kamu lebih tertarik pada manajemen operasional hotel berbintang, culinary arts (tata boga), atau pengembangan destinasi ekowisata berkelanjutan?`,
    };
  }

  if (q.includes("desain") || q.includes("dkv") || q.includes("animasi") || q.includes("gambar") || q.includes("ui") || q.includes("ux")) {
    return {
      matchedFieldId: "dkv",
      reply: `Untuk mempersiapkan diri masuk program studi Desain Komunikasi Visual (DKV), Animasi, atau UI/UX di Bali, ini peta langkah yang perlu kamu ambil:

1. Asah Keterampilan Dasar Seni dan Nirmana
Meskipun industri menggunakan perangkat lunak digital, pemahaman dasar tentang komposisi, warna, tipografi, dan anatomi gambar sketsa manual tetap menjadi fondasi utama tes seleksi bakat.

2. Kuasai Tools Standar Industri Digital
Mulailah membiasakan diri menggunakan Figma (untuk desain antarmuka aplikasi/web) serta Adobe Illustrator/Photoshop atau software open-source seperti Blender dan Krita untuk ilustrasi dan 3D.

3. Opsi Institusi Pendidikan di Bali:
- Jenjang SMK: SMK Negeri 1 Sukawati di Gianyar (pusat seni dan kriya kreatif) atau SMKN 1 Denpasar (Multimedia/Animasi).
- Jenjang Perguruan Tinggi: Institut Seni Indonesia (ISI) Denpasar (Fakultas Seni Rupa dan Desain, akreditasi Unggul), Primakara, atau D4 Desain Media PNB.

4. Kurasi Buku Portofolio (Portofolio Kreatif)
Hampir seluruh jalur seleksi DKV di PTN maupun lamaran magang membutuhkan portofolio minimal 5 sampai 10 karya orisinal terbaikmu.

Apakah fokus minatmu lebih ke arah desain grafis branding, pembuatan animasi karakter, atau perancangan tampilan aplikasi (UI/UX)?`,
    };
  }

  return {
    matchedFieldId: null,
    reply: `Halo! Saya Navigator KertaMarga, konsultan pendidikan dan karier khusus wilayah Provinsi Bali. 

Saya siap membantu menjawab seluruh pertanyaanmu seputar:
1. Rekomendasi penjurusan SMK dan program studi Perguruan Tinggi di 9 Kabupaten/Kota di Bali.
2. Langkah persiapan masuk prodi impian (strategi belajar, jalur seleksi SNBP/SNBT/Mandiri, atau tes vokasi).
3. Informasi akreditasi resmi BAN-PT dan jarak kampus dari domisili kamu (${userKabupaten}).
4. Prospek kerja industri nyata di Bali dan persiapan sertifikasi profesi BNSP.

Silakan ceritakan cita-citamu, jurusan yang sedang kamu pertimbangkan, atau kebingungan apa yang saat ini kamu rasakan?`,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const messages = body.messages || [];
    const userKabupaten = body.userKabupaten || "Kota Denpasar";
    const targetLevel = body.targetLevel || "semua";

    if (!messages.length) {
      return NextResponse.json(
        { error: "Pesan tidak boleh kosong" },
        { status: 400 }
      );
    }

    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === "user")?.content || "";

    const systemInstruction = `Anda adalah Navigator KertaMarga, Agen AI Konsultan Penjurusan, Akademik, dan Karier resmi Provinsi Bali (KertaMarga Bali).
Pengguna adalah siswa SMP, SMA, SMK, atau calon mahasiswa di Provinsi Bali yang sedang berkonsultasi dalam sesi tanya-jawab (Q&A) langsung. Domisili pengguna saat ini: ${userKabupaten}, preferensi jenjang: ${targetLevel}.

Peran & Tanggung Jawab:
1. Anda BERTUGAS AKTIF dalam sesi tanya jawab interaktif:
   - Jawab pertanyaan siswa secara komprehensif, solutif, empatik, terstruktur, dan tuntas.
   - Jika siswa bertanya "apa saja yang harus saya lakukan untuk masuk prodi X" (misal informatika, pariwisata, DKV, kedokteran, bisnis): jelaskan secara sistematis mulai dari (1) Penguatan fondasi materi/logika/keahlian dasar, (2) Eksplorasi bidang spesifik, (3) Pilihan sekolah SMK kejuruan atau kampus di Bali yang relevan beserta akreditasi resminya, (4) Portofolio karya dan persiapan sertifikasi kompetensi BNSP.
   - Berikan referensi nyata institusi di Bali: SMKN 1 Denpasar (SKENSA), Politeknik Negeri Bali (PNB Jimbaran), Universitas Udayana, Undiksha Singaraja, ISI Denpasar, Poltekpar Bali Nusa Dua, ITB STIKOM Bali, Primakara, dll.
2. Setiap kali menjawab, sertakan pertanyaan penutup yang ramah dan memancing dialog dua arah lebih lanjut (tanyakan jenjang kelas saat ini, minat khusus, atau kendala yang dihadapi).
3. Anda WAJIB membalas dalam format JSON murni yang valid tanpa awalan markdown:
{
  "reply": "Teks jawaban lengkap, terstruktur, komunikatif, dan mendalam.",
  "matchedFieldId": "informatika" // string dari: "informatika" | "pariwisata" | "dkv" | "budaya" | "pertanian" | "kelautan" | null jika topik umum
}
4. Aturan Penting:
   - JANGAN gunakan simbol emoji apapun (anti-slop).
   - JANGAN gunakan tanda pisah panjang em-dash (—). Gunakan tanda hubung (-) biasa atau koma.
   - Bahasa: Bahasa Indonesia yang inspiratif, mudah dicerna anak muda, sopan, dan berbobot.`;

    // 1. Coba 9Router Gateway (Primary AI Tier)
    const routerBase = process.env.ROUTER_API_BASE || process.env.NINEROUTER_API_BASE;
    if (routerBase) {
      try {
        const routerKey = process.env.ROUTER_API_KEY || process.env.NINEROUTER_API_KEY || "";
        const routerModel = process.env.ROUTER_MODEL_FAST || "ag/gemini-3.8-flash-low";
        const endpoint = routerBase.replace(/\/+$/, "") + (routerBase.includes("/v1") ? "/chat/completions" : "/v1/chat/completions");

        const promptMessages = [
          { role: "system", content: systemInstruction },
          ...messages.slice(-8).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          { role: "user", content: "Balas murni dalam format JSON sesuai skema." }
        ];

        const routerRes = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(routerKey ? { Authorization: `Bearer ${routerKey}` } : {}),
          },
          body: JSON.stringify({
            model: routerModel,
            stream: false,
            messages: promptMessages,
            response_format: { type: "json_object" },
          }),
        });

        if (routerRes.ok) {
          const rData = await routerRes.json();
          let rText = rData?.choices?.[0]?.message?.content;
          if (rText) {
            rText = rText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
            const parsed = JSON.parse(rText);
            if (parsed.reply) {
              return NextResponse.json({
                reply: parsed.reply,
                matchedFieldId: parsed.matchedFieldId || null,
                sourceMode: "9router-live",
              } satisfies NavigatorChatResponse);
            }
          }
        }
      } catch {
        // Fallback ke tier berikutnya
      }
    }

    // 2. Coba Gemini API Langsung (Secondary AI Tier)
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
        const contents = [
          {
            role: "user",
            parts: [{ text: `${systemInstruction}\n\nPercakapan:\n${messages.map(m => `${m.role}: ${m.content}`).join("\n")}\n\nBalas murni JSON.` }]
          }
        ];

        const geminiRes = await fetch(geminiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            generationConfig: {
              responseMimeType: "application/json",
            },
          }),
        });

        if (geminiRes.ok) {
          const gData = await geminiRes.json();
          let gText = gData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (gText) {
            gText = gText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
            const parsed = JSON.parse(gText);
            if (parsed.reply) {
              return NextResponse.json({
                reply: parsed.reply,
                matchedFieldId: parsed.matchedFieldId || null,
                sourceMode: "gemini-live",
              } satisfies NavigatorChatResponse);
            }
          }
        }
      } catch {
        // Fallback ke tier deterministik
      }
    }

    // 3. Fallback Deterministik Q&A (Fail-Safe Tier)
    const fallback = getDeterministicQAReply(lastUserMessage, userKabupaten, targetLevel);
    return NextResponse.json({
      reply: fallback.reply,
      matchedFieldId: fallback.matchedFieldId,
      sourceMode: "deterministic-qa",
    } satisfies NavigatorChatResponse);
  } catch (error) {
    console.error("Navigator chat error:", error);
    return NextResponse.json(
      {
        reply: "Mohon maaf, sistem sedang menata ulang saluran dialog. Silakan kirimkan kembali pertanyaanmu.",
        matchedFieldId: null,
        sourceMode: "deterministic-qa",
      } satisfies NavigatorChatResponse,
      { status: 200 }
    );
  }
}
