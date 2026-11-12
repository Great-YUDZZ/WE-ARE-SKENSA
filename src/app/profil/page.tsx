"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import KertaMargaLogo from "@/components/KertaMargaLogo";
import NotesSection from "@/components/profil/NotesSection";
import ProgressSection from "@/components/profil/ProgressSection";
import AccountSettingsSection from "@/components/profil/AccountSettingsSection";
import { saveUserToStorage, useAuth } from "@/lib/useAuth";
import { useBaliLocation } from "@/lib/useBaliLocation";
import {
  buildProfileTestReportHtml,
  downloadHtmlFile,
  openPrintableReport,
} from "@/lib/test-report-download";
import {
  applyFullLearningSnapshotToStorage,
  collectModulePracticeNoteViews,
  exportLearningReportMarkdown,
  mergeLearningSnapshots,
  readFullLearningSnapshot,
  updateModulePracticeNoteInStorage,
  writePersonalNotesToStorage,
  type FullLearningSnapshot,
  type PersonalLearningNote,
  type PersonalNoteCategory,
} from "@/lib/learningProfile";

type ProfileTabId = "catatan" | "progres" | "akun";

const EMPTY_SNAPSHOT: FullLearningSnapshot = {
  personalNotes: [],
  progressByField: {},
  surveyResult: null,
  updatedAt: "",
};

export default function ProfilPage() {
  const { user, loading: authLoading, logout, syncAuth } = useAuth();
  const {
    origin,
    isDetecting: isDetectingLocation,
    isGeocoding: isGeocodingLocation,
    locationNote,
    setManualKabupaten,
    setManualAddress,
    detectLocation,
  } = useBaliLocation("Kota Denpasar");

  const [activeTab, setActiveTab] = useState<ProfileTabId>("catatan");
  const [snapshot, setSnapshot] = useState<FullLearningSnapshot>(EMPTY_SNAPSHOT);
  const [isStorageReady, setIsStorageReady] = useState(false);

  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [isSyncingServer, setIsSyncingServer] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const syncedUserIdRef = useRef<number | null>(null);
  const statusTimerRef = useRef<number | null>(null);

  const showStatus = useCallback((msg: string) => {
    setStatusMessage(msg);
    if (statusTimerRef.current !== null) {
      window.clearTimeout(statusTimerRef.current);
    }
    statusTimerRef.current = window.setTimeout(() => {
      setStatusMessage(null);
    }, 3600);
  }, []);

  useEffect(() => {
    return () => {
      if (statusTimerRef.current !== null) {
        window.clearTimeout(statusTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const initial = readFullLearningSnapshot();
    setSnapshot(initial);
    setIsStorageReady(true);
  }, []);

  const pushSnapshotToServer = useCallback(
    async (nextSnap: FullLearningSnapshot, announce = false) => {
      if (!user) return;
      setIsSyncingServer(true);
      try {
        const res = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            learningProfile: nextSnap,
            syncMode: "replace",
          }),
        });
        if (res.ok) {
          const data = (await res.json()) as { syncedAt?: string };
          const label = new Date(data.syncedAt || Date.now()).toLocaleTimeString(
            "id-ID",
            { hour: "2-digit", minute: "2-digit" }
          );
          setLastSyncedAt(label);
          if (announce) {
            showStatus("Catatan belajar berhasil disinkronkan ke akun.");
          }
        }
      } catch {
        if (announce) {
          showStatus("Gagal menghubungi server; perubahan tetap aman di browser.");
        }
      } finally {
        setIsSyncingServer(false);
      }
    },
    [user, showStatus]
  );

  // Hydrate & merge with account snapshot when logged in
  useEffect(() => {
    if (!isStorageReady || authLoading || !user) return;
    if (syncedUserIdRef.current === user.id) return;

    let active = true;
    syncedUserIdRef.current = user.id;

    fetch("/api/profile", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { user?: unknown; learningProfile?: FullLearningSnapshot } | null) => {
        if (!active || !data?.learningProfile) return;
        const localSnap = readFullLearningSnapshot();
        const merged = mergeLearningSnapshots(localSnap, data.learningProfile);
        applyFullLearningSnapshotToStorage(merged);
        setSnapshot(merged);

        const label = new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        });
        setLastSyncedAt(label);

        const localHadData =
          localSnap.personalNotes.length > 0 ||
          Object.keys(localSnap.progressByField).length > 0 ||
          Boolean(localSnap.surveyResult) ||
          Boolean(localSnap.explorationResult) ||
          (localSnap.savedFieldIds?.length || 0) > 0;
        if (localHadData) {
          void pushSnapshotToServer(merged, false);
        }
      })
      .catch(() => {
        // Biarkan data lokal tetap tampil
      });

    return () => {
      active = false;
    };
  }, [isStorageReady, authLoading, user, pushSnapshotToServer]);

  const practiceNoteViews = useMemo(
    () => collectModulePracticeNoteViews(snapshot),
    [snapshot]
  );

  const stats = useMemo(() => {
    let completedModulesCount = 0;
    let passedCertsCount = 0;
    for (const prog of Object.values(snapshot.progressByField)) {
      completedModulesCount += prog.completedModules.length;
      passedCertsCount += prog.passedCertIds.length;
    }
    const totalNotesCount =
      snapshot.personalNotes.length + practiceNoteViews.length;

    return {
      completedModulesCount,
      passedCertsCount,
      totalNotesCount,
      surveyScore: snapshot.surveyResult ? `${snapshot.surveyResult.score}%` : "Belum Ada",
    };
  }, [snapshot, practiceNoteViews]);

  const handleSavePersonalNote = (noteInput: {
    id?: string;
    title: string;
    fieldId: string;
    category: PersonalNoteCategory;
    content: string;
  }) => {
    const now = new Date().toISOString();
    const currentNotes = [...snapshot.personalNotes];
    let updatedNotes: PersonalLearningNote[];

    if (noteInput.id) {
      updatedNotes = currentNotes.map((n) =>
        n.id === noteInput.id
          ? {
              ...n,
              title: noteInput.title,
              fieldId: noteInput.fieldId,
              category: noteInput.category,
              content: noteInput.content,
              updatedAt: now,
            }
          : n
      );
    } else {
      const newNote: PersonalLearningNote = {
        id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: noteInput.title,
        fieldId: noteInput.fieldId,
        category: noteInput.category,
        content: noteInput.content,
        createdAt: now,
        updatedAt: now,
      };
      updatedNotes = [newNote, ...currentNotes];
    }

    writePersonalNotesToStorage(updatedNotes);
    const nextSnap = readFullLearningSnapshot();
    setSnapshot(nextSnap);
    showStatus(noteInput.id ? "Catatan belajar diperbarui." : "Catatan belajar baru tersimpan.");
    void pushSnapshotToServer(nextSnap, false);
  };

  const handleDeletePersonalNote = (noteId: string) => {
    const filtered = snapshot.personalNotes.filter((n) => n.id !== noteId);
    writePersonalNotesToStorage(filtered);
    const nextSnap = readFullLearningSnapshot();
    setSnapshot(nextSnap);
    showStatus("Catatan belajar dihapus.");
    void pushSnapshotToServer(nextSnap, false);
  };

  const handleSavePracticeNote = (
    fieldId: string,
    moduleId: string,
    noteText: string
  ) => {
    updateModulePracticeNoteInStorage(fieldId, moduleId, noteText);
    const nextSnap = readFullLearningSnapshot();
    setSnapshot(nextSnap);
    showStatus(
      noteText.trim()
        ? "Catatan tugas praktik modul diperbarui."
        : "Catatan tugas praktik dihapus."
    );
    void pushSnapshotToServer(nextSnap, false);
  };

  const handleUpdateAccount = async (payload: {
    name: string;
    interests: string[];
  }) => {
    if (!user) return;
    setIsSavingAccount(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.user) {
        showStatus(data.error || "Gagal memperbarui profil akun.");
        return;
      }
      saveUserToStorage(data.user);
      await syncAuth();
      showStatus("Profil akun berhasil diperbarui.");
    } catch {
      showStatus("Terjadi kendala koneksi saat memperbarui akun.");
    } finally {
      setIsSavingAccount(false);
    }
  };

  const handleManualSync = async () => {
    const currentSnap = readFullLearningSnapshot();
    await pushSnapshotToServer(currentSnap, true);
  };

  const handleExportMarkdown = () => {
    const originLabel =
      origin.areaLabel || origin.addressQuery || origin.kabupaten || "Kota Denpasar";
    const markdown = exportLearningReportMarkdown(snapshot, user, originLabel);
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kertamarga-catatan-belajar-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showStatus("Rekap catatan belajar berhasil diunduh (.md).");
  };

  const handleDownloadTestReportHtml = () => {
    const latestSnap = readFullLearningSnapshot();
    const originLabel =
      origin.areaLabel || origin.addressQuery || origin.kabupaten || "Kota Denpasar";
    const html = buildProfileTestReportHtml({
      snapshot: latestSnap,
      user,
      originLabel,
    });
    downloadHtmlFile(
      `kertamarga-rekap-keseluruhan-${new Date().toISOString().slice(0, 10)}.html`,
      html
    );
    showStatus("Rekap hasil keseluruhan website berhasil diunduh (.html).");
  };

  const handlePrintTestReportPdf = () => {
    const latestSnap = readFullLearningSnapshot();
    const originLabel =
      origin.areaLabel || origin.addressQuery || origin.kabupaten || "Kota Denpasar";
    const html = buildProfileTestReportHtml({
      snapshot: latestSnap,
      user,
      originLabel,
    });
    const opened = openPrintableReport(
      html,
      `kertamarga-rekap-keseluruhan-${new Date().toISOString().slice(0, 10)}.html`
    );
    if (opened) {
      showStatus("Membuka dialog Simpan sebagai PDF untuk rekapan keseluruhan website.");
    } else {
      showStatus("Popup diblokir; rekapan lengkap diunduh sebagai HTML siap cetak PDF.");
    }
  };

  const tabs: { id: ProfileTabId; label: string; badge: string }[] = [
    {
      id: "catatan",
      label: "Catatan Pembelajaran",
      badge: `${stats.totalNotesCount} Catatan`,
    },
    {
      id: "progres",
      label: "Progres & Sertifikasi",
      badge: `${stats.completedModulesCount} Modul`,
    },
    {
      id: "akun",
      label: "Akun, Lokasi & Ekspor",
      badge: user ? "Tersinkron" : "Lokal",
    },
  ];

  const originDisplay =
    origin.areaLabel || origin.addressQuery || origin.kabupaten || "Kota Denpasar";

  return (
    <div className="min-h-screen flex flex-col neopop-canvas-subtle overflow-x-clip">
      <Navbar />

      {statusMessage && (
        <div
          role="status"
          className="fixed top-24 right-4 sm:right-8 z-50 px-4 py-2.5 rounded-2xl bg-[#141413] text-white border-2 border-[#141413] shadow-[4px_4px_0px_#B8F348] flex items-center gap-2.5 max-w-sm"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#B8F348] shrink-0" />
          <span className="text-xs font-display font-bold">{statusMessage}</span>
        </div>
      )}

      <main className="flex-1 pt-8 sm:pt-10 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-[#52514E]"
            >
              <Link href="/" className="hover:text-[#141413] transition-colors">
                Beranda
              </Link>
              <span>/</span>
              <span className="text-[#141413]">Profil &amp; Catatan Pembelajaran</span>
            </nav>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/hasil-analisis"
                className="neo-btn inline-flex items-center min-h-[40px] px-3.5 rounded-xl bg-white border-2 border-[#141413] hover:bg-[#FAF7F2] text-xs font-mono font-bold text-[#141413]"
              >
                Workspace Modul &rarr;
              </Link>
              <Link
                href="/ai-navigator"
                className="neo-btn inline-flex items-center min-h-[40px] px-3.5 rounded-xl bg-[#3B66FF] text-white border-2 border-[#141413] hover:bg-[#2F55DF] text-xs font-mono font-bold"
              >
                AI Navigator &rarr;
              </Link>
            </div>
          </div>

          {/* Profile Hero Summary Card */}
          <section className="neo-card rounded-2xl bg-white p-5 sm:p-6 border-2 border-[#141413] shadow-[4px_4px_0px_#141413] space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#B8F348] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] flex items-center justify-center font-display font-black text-2xl sm:text-3xl text-[#141413] shrink-0">
                  {(user?.name || "P").charAt(0).toUpperCase()}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#3B66FF] text-white border border-[#141413] font-mono font-bold text-[11px] uppercase">
                      {authLoading
                        ? "Memuat Profil"
                        : user
                        ? user.role === "guru"
                          ? "Guru BK"
                          : "Siswa Terdaftar"
                        : "Mode Tamu Browser"}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#FAF7F2] text-[#141413] border border-[#141413] font-mono font-bold text-[11px]">
                      Domisili: {originDisplay}
                    </span>
                  </div>

                  <h1 className="font-display font-black text-2xl sm:text-3xl text-[#141413] truncate">
                    {user ? user.name : "Profil Belajar Pelajar Bali"}
                  </h1>
                  <p className="text-xs sm:text-sm text-[#52514E] font-medium">
                    {user
                      ? `${user.identifier} | ${user.email}`
                      : "Kelola catatan belajar, tugas praktik modul, hasil survey, dan target sertifikasi Anda di satu tempat."}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handlePrintTestReportPdf}
                  className="neo-btn min-h-[42px] px-4 rounded-xl bg-[#B8F348] hover:bg-[#a8e635] text-[#141413] border-2 border-[#141413] shadow-[2px_2px_0px_#141413] font-mono font-bold text-xs cursor-pointer"
                >
                  Unduh Rekap PDF &darr;
                </button>
                <button
                  type="button"
                  onClick={handleDownloadTestReportHtml}
                  className="neo-btn min-h-[42px] px-3.5 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#141413] border-2 border-[#141413] font-mono font-bold text-xs cursor-pointer"
                >
                  Unduh Hasil (.html) &darr;
                </button>
                <button
                  type="button"
                  onClick={handleExportMarkdown}
                  className="neo-btn min-h-[42px] px-3.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F0ECE1] text-[#141413] border-2 border-[#141413] font-mono font-bold text-xs cursor-pointer"
                >
                  Unduh Rekap (.md) &darr;
                </button>
                {!user && !authLoading && (
                  <Link
                    href="/login"
                    className="neo-btn min-h-[42px] inline-flex items-center px-4 rounded-xl bg-[#B8F348] hover:bg-[#a8e635] text-[#141413] border-2 border-[#141413] shadow-[2px_2px_0px_#141413] font-display font-bold text-xs"
                  >
                    Masuk untuk Sinkron Akun
                  </Link>
                )}
              </div>
            </div>

            {/* 4 Key Study Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413]">
                <span className="text-[11px] font-mono font-bold text-[#52514E] uppercase block">
                  Catatan Belajar
                </span>
                <span className="font-display font-black text-2xl sm:text-3xl text-[#141413]">
                  {isStorageReady ? stats.totalNotesCount : "-"}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#B8F348]/25 border-2 border-[#141413]">
                <span className="text-[11px] font-mono font-bold text-[#141413] uppercase block">
                  Modul Selesai
                </span>
                <span className="font-display font-black text-2xl sm:text-3xl text-[#141413]">
                  {isStorageReady ? stats.completedModulesCount : "-"}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#3B66FF]/10 border-2 border-[#141413]">
                <span className="text-[11px] font-mono font-bold text-[#3B66FF] uppercase block">
                  Sertifikasi Lulus
                </span>
                <span className="font-display font-black text-2xl sm:text-3xl text-[#3B66FF]">
                  {isStorageReady ? stats.passedCertsCount : "-"}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFBE2E]/25 border-2 border-[#141413]">
                <span className="text-[11px] font-mono font-bold text-[#141413] uppercase block">
                  Skor Survey Dasar
                </span>
                <span className="font-display font-black text-2xl sm:text-3xl text-[#141413]">
                  {isStorageReady ? stats.surveyScore : "-"}
                </span>
              </div>
            </div>
          </section>

          {/* 3-Tab Profile Navigation */}
          <div
            role="tablist"
            aria-label="Navigasi Profil Pembelajaran"
            className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-h-[48px] px-4 py-2.5 rounded-xl border-2 border-[#141413] font-display font-bold text-xs sm:text-sm flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#141413] text-[#B8F348] shadow-[3px_3px_0px_#3B66FF]"
                      : "bg-white text-[#141413] hover:bg-[#FAF7F2]"
                  }`}
                >
                  <span className="truncate">{tab.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold shrink-0 ${
                      isActive
                        ? "bg-[#B8F348] text-[#141413]"
                        : "bg-[#FAF7F2] text-[#52514E] border border-[#141413]/30"
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Content */}
          {!isStorageReady ? (
            <div className="neo-card rounded-2xl bg-white p-10 border-2 border-[#141413] text-center font-mono font-bold text-xs text-[#52514E]">
              Memuat profil dan catatan pembelajaran Anda...
            </div>
          ) : (
            <>
              {activeTab === "catatan" && (
                <NotesSection
                  snapshot={snapshot}
                  practiceNoteViews={practiceNoteViews}
                  onSavePersonalNote={handleSavePersonalNote}
                  onDeletePersonalNote={handleDeletePersonalNote}
                  onSavePracticeNote={handleSavePracticeNote}
                />
              )}

              {activeTab === "progres" && <ProgressSection snapshot={snapshot} />}

              {activeTab === "akun" && (
                <AccountSettingsSection
                  user={user}
                  authLoading={authLoading}
                  isSavingAccount={isSavingAccount}
                  isSyncingServer={isSyncingServer}
                  lastSyncedAt={lastSyncedAt}
                  onUpdateAccount={handleUpdateAccount}
                  onManualSyncServer={handleManualSync}
                  onExportMarkdown={handleExportMarkdown}
                  onDownloadTestHtml={handleDownloadTestReportHtml}
                  onPrintTestPdf={handlePrintTestReportPdf}
                  onLogout={logout}
                  origin={origin}
                  isDetectingLocation={isDetectingLocation}
                  isGeocodingLocation={isGeocodingLocation}
                  locationNote={locationNote}
                  onChangeManualKabupaten={setManualKabupaten}
                  onSubmitManualAddress={setManualAddress}
                  onDetectLocation={detectLocation}
                />
              )}
            </>
          )}
        </div>
      </main>

      <footer className="w-full bg-white border-t-2 border-[#141413] py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <KertaMargaLogo variant="compact" className="w-7 h-7 shrink-0" />
              <span className="font-display font-black text-sm text-[#141413]">
                KertaMarga Bali
              </span>
            </div>
            <p className="text-xs text-[#52514E] font-medium">
              Inovasi Navigasi Karier &amp; Penjurusan AI untuk Bali DigiFest 2026 (Kategori SMK)
            </p>
          </div>
          <div className="text-xs font-mono font-bold text-[#52514E] flex flex-wrap justify-center gap-4">
            <Link href="/" className="hover:text-[#141413]">
              Beranda
            </Link>
            <Link href="/tes-keminatan" className="hover:text-[#141413]">
              Survey Keminatan
            </Link>
            <Link href="/katalog" className="hover:text-[#141413]">
              Katalog Bali
            </Link>
            <Link href="/hasil-analisis" className="hover:text-[#141413]">
              Modul &amp; Sertifikasi
            </Link>
            <Link href="/ai-navigator" className="hover:text-[#141413]">
              AI Navigator
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
