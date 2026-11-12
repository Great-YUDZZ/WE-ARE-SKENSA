/**
 * Automated Smoke Test untuk KertaMarga Bali (Tahap 2 Bali DigiFest 2026)
 * Menjalankan verifikasi halaman utama, endpoint API, dan siklus autentikasi.
 * Penggunaan: BASE_URL=http://127.0.0.1:3000 node tests/smoke.mjs
 */

const BASE_URL = (process.env.BASE_URL || "http://127.0.0.1:3000").replace(/\/+$/, "");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function runCheck(name, fn) {
  try {
    await fn();
    passed += 1;
    console.log(`[PASS] ${name}`);
  } catch (err) {
    failed += 1;
    console.error(`[FAIL] ${name}: ${err instanceof Error ? err.message : String(err)}`);
  }
}

async function main() {
  console.log(`Menjalankan smoke test terhadap ${BASE_URL}\n`);

  const pages = [
    "/",
    "/eksplorasi",
    "/katalog",
    "/peta-bidang",
    "/peta-bidang/informatika",
    "/peta-bidang/tkj",
    "/tes-keminatan",
    "/hasil-analisis",
    "/ai-navigator",
    "/login",
    "/daftar",
  ];

  for (const route of pages) {
    await runCheck(`GET ${route}`, async () => {
      const res = await fetch(`${BASE_URL}${route}`);
      assert(res.status === 200, `Status diharapkan 200, diterima ${res.status}`);
      const html = await res.text();
      assert(html.includes("KertaMarga"), "Konten halaman tidak memuat identitas KertaMarga");
    });
  }

  await runCheck("GET /api/programs", async () => {
    const res = await fetch(`${BASE_URL}/api/programs`);
    assert(res.status === 200, `Status ${res.status}`);
    const data = await res.json();
    assert(Array.isArray(data.programs) && data.programs.length >= 11, "Daftar program tidak lengkap");
  });

  await runCheck("GET /api/programs/tkj/guide", async () => {
    const res = await fetch(`${BASE_URL}/api/programs/tkj/guide?kabupaten=Kota%20Denpasar`);
    assert(res.status === 200, `Status ${res.status}`);
    const data = await res.json();
    assert(data.field && data.field.id === "tkj", "Field tkj tidak ditemukan");
    assert(Array.isArray(data.institutions) && data.institutions.length > 0, "Institusi TKJ kosong");
    assert(data.baliDirectory && Array.isArray(data.baliDirectory.perguruanTinggi) && data.baliDirectory.perguruanTinggi.length > 0, "Direktori PT Bali kosong");
    assert(Array.isArray(data.baliDirectory.smk) && data.baliDirectory.smk.length > 0, "Direktori SMK Bali kosong");
  });

  await runCheck("GET /api/questions", async () => {
    const res = await fetch(`${BASE_URL}/api/questions`);
    assert(res.status === 200, `Status ${res.status}`);
    const data = await res.json();
    assert(Array.isArray(data.baseQuestions) && data.baseQuestions.length > 0, "Pertanyaan dasar kosong");
  });

  await runCheck("GET /api/institutions", async () => {
    const res = await fetch(`${BASE_URL}/api/institutions`);
    assert(res.status === 200, `Status ${res.status}`);
    const data = await res.json();
    assert(Array.isArray(data.institutions) && data.institutions.length >= 10, "Katalog institusi kosong");
  });

  await runCheck("GET /api/institutions?category=all (Bali Full Directory)", async () => {
    const res = await fetch(`${BASE_URL}/api/institutions?category=all&kabupaten=Kab.%20Badung`);
    assert(res.status === 200, `Status ${res.status}`);
    const data = await res.json();
    assert(typeof data.total === "number" && data.total >= 250, `Jumlah direktori Bali diharapkan >= 250, diterima ${data.total}`);
    assert(Array.isArray(data.institutions) && data.institutions[0].mapsUrl.includes("google.com/maps"), "URL Google Maps tidak terbentuk");
  });

  await runCheck("GET /api/institutions?category=perguruan-tinggi & smk", async () => {
    const ptRes = await fetch(`${BASE_URL}/api/institutions?category=perguruan-tinggi`);
    assert(ptRes.status === 200, `PT Status ${ptRes.status}`);
    const ptData = await ptRes.json();
    assert(typeof ptData.total === "number" && ptData.total >= 50, `Jumlah PT diharapkan >= 50, diterima ${ptData.total}`);

    const smkRes = await fetch(`${BASE_URL}/api/institutions?category=smk`);
    assert(smkRes.status === 200, `SMK Status ${smkRes.status}`);
    const smkData = await smkRes.json();
    assert(typeof smkData.total === "number" && smkData.total >= 90, `Jumlah SMK diharapkan >= 90, diterima ${smkData.total}`);
  });

  await runCheck("GET /api/pustaka-modul?field=informatika", async () => {
    const res = await fetch(`${BASE_URL}/api/pustaka-modul?field=informatika`);
    assert(res.status === 200, `Status ${res.status}`);
    const data = await res.json();
    assert(Array.isArray(data.documents) && data.documents.length > 0, "Dokumen pustaka modul kosong");
  });

  await runCheck("GET /api/geo-ip", async () => {
    const res = await fetch(`${BASE_URL}/api/geo-ip`);
    assert(res.status === 200, `Status ${res.status}`);
    const data = await res.json();
    assert(typeof data.ok === "boolean", "Field ok pada /api/geo-ip harus boolean");
    if (data.ok) {
      assert(data.source === "ip", "Field source pada /api/geo-ip harus 'ip'");
      assert(typeof data.coords?.lat === "number" && typeof data.coords?.lng === "number", "Koordinat IP tidak valid");
    } else {
      assert(typeof data.fallbackKabupaten === "string", "Field fallbackKabupaten tidak ditemukan saat IP offline");
    }
  });

  await runCheck("GET /api/geocode (Alamat Manual Bali)", async () => {
    const res = await fetch(
      `${BASE_URL}/api/geocode?q=${encodeURIComponent("Jl. Tukad Yeh Aya, Panjer")}&kabupaten=${encodeURIComponent("Kota Denpasar")}`
    );
    assert(res.status === 200, `Status ${res.status}`);
    const data = await res.json();
    assert(data.ok === true, "Field ok pada /api/geocode harus true");
    assert(
      typeof data.coords?.lat === "number" && typeof data.coords?.lng === "number",
      "Koordinat hasil geocode tidak valid"
    );
    assert(
      data.nearestKabupaten === "Kota Denpasar",
      `Kabupaten terdekat diharapkan Kota Denpasar, diterima ${data.nearestKabupaten}`
    );
  });

  await runCheck("POST /api/assessment/analyze", async () => {
    const res = await fetch(`${BASE_URL}/api/assessment/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentEducation: "SMK",
        homeKabupaten: "Gianyar",
        selectedAnswers: {
          q1_activity: "q1_opt_tech",
          q2_project_type: "q2_opt_app",
        },
        openEndedReflection: "Tertarik membangun sistem pertanian subak pintar di Gianyar.",
        weights: { matchWeight: 80, distanceWeight: 50, costWeight: 65 },
      }),
    });
    assert(res.status === 200, `Status ${res.status}`);
    const data = await res.json();
    assert(Array.isArray(data.topRecommendations) && data.topRecommendations.length > 0, "Rekomendasi kosong");
    assert(typeof data.topRecommendations[0].compositeScore === "number", "Skor komposit tidak valid");
  });

  await runCheck("POST /api/assessment/analyze (homeCoords GPS)", async () => {
    const res = await fetch(`${BASE_URL}/api/assessment/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentEducation: "SMA",
        homeKabupaten: "Kab. Buleleng",
        homeCoords: { lat: -8.112, lng: 115.0882 },
        selectedAnswers: {
          q1_activity: "q1_opt_tech",
          q2_project_type: "q2_opt_app",
        },
        openEndedReflection: "Ingin kuliah teknik informatika dekat Singaraja.",
        weights: { matchWeight: 70, distanceWeight: 85, costWeight: 60 },
      }),
    });
    assert(res.status === 200, `Status ${res.status}`);
    const data = await res.json();
    assert(Array.isArray(data.topRecommendations) && data.topRecommendations.length > 0, "Rekomendasi GPS kosong");
    const firstInst = data.topRecommendations[0]?.matchedInstitutions?.[0];
    assert(firstInst && typeof firstInst.estimatedDistanceKm === "number", "Jarak institusi GPS tidak valid");
  });

  await runCheck("POST /api/navigator-chat", async () => {
    const res = await fetch(`${BASE_URL}/api/navigator-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Saya ingin kuliah informatika di Bali, apa persiapannya?" }],
        userKabupaten: "Kota Denpasar",
        targetLevel: "kuliah",
      }),
    });
    assert(res.status === 200, `Status ${res.status}`);
    const data = await res.json();
    assert(typeof data.reply === "string" && data.reply.trim().length > 20, "Balasan navigator terlalu pendek");
  });

  await runCheck("POST /api/mentor-agent", async () => {
    const res = await fetch(`${BASE_URL}/api/mentor-agent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fieldId: "informatika",
        currentScore: 55,
        targetScore: 75,
        userMessage: "Bagaimana cara mengejar kesiapan modul dan sertifikasi?",
        completedModules: [],
        passedCerts: [],
      }),
    });
    assert(res.status === 200, `Status ${res.status}`);
    const data = await res.json();
    assert(typeof data.replyMessage === "string" && data.replyMessage.trim().length > 20, "Balasan mentor kosong");
  });

  await runCheck("Siklus Auth (Register -> Me -> Login -> Logout)", async () => {
    const suffix = Date.now().toString().slice(-6);
    const identifier = `9900${suffix}`;
    const email = `smoke${suffix}@siswa.sch.id`;
    const password = `TestPass_${suffix}`;

    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Smoke Test Siswa",
        identifier,
        email,
        password,
        passwordConfirm: password,
        role: "siswa",
        interests: ["Rekayasa Perangkat Lunak"],
        agreed: true,
      }),
    });
    assert(regRes.status === 201 || regRes.status === 200, `Register status ${regRes.status}`);
    const setCookie = regRes.headers.get("set-cookie") || "";
    const sessionCookie = setCookie.split(";")[0];
    assert(sessionCookie.includes("kertamarga_session="), "Cookie sesi tidak terbentuk saat register");

    const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: sessionCookie },
    });
    assert(meRes.status === 200, `Me status ${meRes.status}`);
    const meData = await meRes.json();
    assert(meData.user && meData.user.identifier === identifier, "Data user /api/auth/me tidak cocok");

    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        login: identifier,
        password,
        role: "siswa",
      }),
    });
    assert(loginRes.status === 200, `Login status ${loginRes.status}`);

    const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: { Cookie: sessionCookie },
    });
    assert(logoutRes.status === 200, `Logout status ${logoutRes.status}`);
  });

  await runCheck("Siklus Register Email-Only -> Login", async () => {
    const suffix = (Date.now() + 7).toString().slice(-6);
    const email = `emailonly${suffix}@siswa.sch.id`;
    const password = `PassEmail_${suffix}`;

    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Siswa Email Only",
        email,
        password,
        passwordConfirm: password,
        agreed: true,
      }),
    });
    assert(regRes.status === 201 || regRes.status === 200, `Register email-only status ${regRes.status}`);
    const regData = await regRes.json();
    assert(regData.user && regData.user.identifier === email, "Identifier fallback ke email tidak sesuai");

    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        login: email,
        password,
      }),
    });
    assert(loginRes.status === 200, `Login email-only status ${loginRes.status}`);
  });

  console.log(`\nRingkasan: ${passed} lulus, ${failed} gagal`);
  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Smoke test error fatal:", err);
  process.exit(1);
});
