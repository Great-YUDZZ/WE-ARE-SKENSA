"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import KertaMargaLogo from "@/components/KertaMargaLogo";
import PdfExportGateModal, {
  type PdfGateReason,
} from "@/components/PdfExportGateModal";
import NotesSection from "@/components/profil/NotesSection";
import ProgressSection from "@/components/profil/ProgressSection";
import AccountSettingsSection from "@/components/profil/AccountSettingsSection";
import { saveUserToStorage, useAuth } from "@/lib/useAuth";
import { useBaliLocation } from "@/lib/useBaliLocation";
import {
  buildProfileTestReportHtml,
  openPrintableReport,
} from "@/lib/test-report-download";
import {
  applyFullLearningSnapshotToStorage,
  collectModulePracticeNoteViews,
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
  const [savedFieldIds, setSavedFieldIds] = useState<string[]>([]);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [pdfGateReason, setPdfGateReason] = useState<PdfGateReason>(null);

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
    try {
      const rawBookmarks = window.localStorage.getItem("kertamarga_saved_fields");
      if (rawBookmarks) {
        const parsed = JSON.parse(rawBookmarks);
        if (Array.isArray(parsed)) {
          setSavedFieldIds(
            parsed.filter((item): item is string => typeof item === "string")
          );
        }
      }
    } catch {
      // Abaikan jika localStorage dibatasi
    }
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
          Boolean(localSnap.surveyResult);
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
    let verifiedFieldsCount = 0;
    for (const prog of Object.values(snapshot.progressByField)) {
      completedModulesCount += prog.completedModules.length;
      passedCertsCount += prog.passedCertIds.length;
      if (prog.verification?.status === "passed") {
        verifiedFieldsCount += 1;
      }
    }
    const totalNotesCount =
      snapshot.personalNotes.length + practiceNoteViews.length;

    return {
      completedModulesCount,
      passedCertsCount,
      verifiedFieldsCount,
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

  const handlePrintTestReportPdf = () => {
    if (!snapshot.surveyResult) {
      setPdfGateReason("no-test");
      return;
    }
    if (!user) {
      setPdfGateReason("need-login");
      return;
    }
    const originLabel =
      origin.areaLabel || origin.addressQuery || origin.kabupaten || "Kota Denpasar";
    const html = buildProfileTestReportHtml({
      snapshot,
      user,
      originLabel,
      origin,
    });
    openPrintableReport(
      html,
      `kertamarga-laporan-profil-${new Date().toISOString().slice(0, 10)}.html`
    );
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

  const rawOriginDisplay =
    origin.areaLabel || origin.addressQuery || origin.kabupaten || "Kota Denpasar";
  const originDisplay = rawOriginDisplay.replace(
    /,\s*([^,]+)\s*\(\1\)\s*$/,
    ", $1"
  );

  const userSubtitle = user
    ? user.identifier && user.identifier.toLowerCase() !== user.email.toLowerCase()
      ? `${user.identifier} | ${user.email}`
      : user.email
    : "Kelola catatan belajar, tugas praktik, hasil survey, dan sertifikasi Anda.";

  return (
    <div className="min-h-screen flex flex-col neopop-canvas-subtle overflow-x-clip">
      <Navbar />

      <PdfExportGateModal
        reason={pdfGateReason}
        onClose={() => setPdfGateReason(null)}
        onDeclineLogin={() =>
          showStatus("Tanpa login, file PDF tidak dapat diunduh.")
        }
      />

      {statusMessage && (
        <div
          role="status"
          className="fixed top-24 right-4 sm:right-8 z-50 px-4 py-2.5 rounded-2xl bg-[#141413] text-white border-2 border-[#141413] shadow-[4px_4px_0px_#B8F348] flex items-center gap-2.5 max-w-sm"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#B8F348] shrink-0" />
          <span className="text-xs font-display font-bold">{statusMessage}</span>
        </div>
      )}

      <main className="flex-1 pt-6 sm:pt-8 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-5">
          {/* Clean Breadcrumb */}
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

          {/* 2-Column Sticky Sidebar + Workspace (Hanya untuk user login) */}
          {!authLoading && !user ? (
            <section className="neo-card rounded-2xl bg-white p-6 sm:p-10 border-2 border-[#141413] shadow-[4px_4px_0px_#141413] max-w-2xl mx-auto text-center space-y-4">
              <span className="inline-block px-3 py-1 rounded-lg bg-[#3B66FF] text-white font-mono font-bold text-xs uppercase">
                Akses Terbatas
              </span>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-[#141413]">
                Login Diperlukan untuk Mengakses Profil
              </h1>
              <p className="text-xs sm:text-sm text-[#52514E] max-w-md mx-auto leading-relaxed">
                Halaman profil, catatan belajar, progres sertifikasi, dan unduhan laporan PDF hanya tersedia untuk akun yang sudah login. Silakan masuk terlebih dahulu melalui tombol username atau halaman login.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href="/login"
                  className="neo-btn min-h-[44px] px-6 rounded-xl bg-[#B8F348] hover:bg-[#a8e635] text-[#141413] border-2 border-[#141413] font-display font-bold text-xs sm:text-sm inline-flex items-center"
                >
                  Masuk Akun &rarr;
                </Link>
                <Link
                  href="/"
                  className="neo-btn min-h-[44px] px-5 rounded-xl bg-[#FAF7F2] hover:bg-[#F0ECE1] text-[#141413] border-2 border-[#141413] font-mono font-bold text-xs inline-flex items-center"
                >
                  Kembali ke Beranda
                </Link>
              </div>
            </section>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Sticky Profile Sidebar */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 neo-card rounded-2xl bg-white p-5 sm:p-6 border-2 border-[#141413] shadow-[4px_4px_0px_#141413] space-y-5">
              {/* Identity Header */}
              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-[#B8F348] border-2 border-[#141413] shadow-[2px_2px_0px_#141413] flex items-center justify-center font-display font-black text-2xl text-[#141413] shrink-0">
                  {(user?.name || "P").charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-[#3B66FF] text-white font-mono font-bold text-[10px] uppercase">
                      {authLoading
                        ? "Memuat"
                        : user
                        ? user.role === "guru"
                          ? "Guru BK"
                          : "Siswa Terdaftar"
                        : "Mode Tamu"}
                    </span>
                    {user && lastSyncedAt && (
                      <span className="px-2 py-0.5 rounded-md bg-[#B8F348]/40 text-[#141413] border border-[#141413]/20 font-mono font-bold text-[10px]">
                        Sinkron {lastSyncedAt}
                      </span>
                    )}
                  </div>

                  <h1 className="font-display font-black text-xl sm:text-2xl text-[#141413] truncate">
                    {user ? user.name : "Profil Belajar"}
                  </h1>
                  <p className="text-xs text-[#52514E] font-medium break-words">
                    {userSubtitle}
                  </p>
                </div>
              </div>

              {/* Domicile & Interests */}
              <div className="pt-3 border-t border-[#141413]/15 space-y-2.5">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-mono font-bold text-[#52514E]">Domisili</span>
                  <span className="font-semibold text-[#141413] text-right truncate">
                    {originDisplay}
                  </span>
                </div>

                {user && user.interests && user.interests.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono font-bold text-[#52514E] block">
                      Minat Penjurusan
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {user.interests.slice(0, 4).map((interest) => (
                        <span
                          key={interest}
                          className="px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#141413]/15 text-[11px] font-semibold text-[#141413]"
                        >
                          {interest}
                        </span>
                      ))}
                      {user.interests.length > 4 && (
                        <span className="px-2 py-0.5 rounded-md bg-[#F0ECE1] text-[11px] font-mono font-bold text-[#52514E]">
                          +{user.interests.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Compact 2x2 Key Metrics (Editorial Neo-Pop: thin border, no heavy shadow) */}
              <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-[#141413]/15">
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#141413]/15 space-y-0.5">
                  <span className="text-[10px] font-mono font-bold text-[#52514E] uppercase block">
                    Catatan
                  </span>
                  <span className="font-display font-black text-xl sm:text-2xl text-[#141413] block">
                    {isStorageReady ? stats.totalNotesCount : "-"}
                  </span>
                  <span className="text-[10px] text-[#52514E] block truncate">
                    {isStorageReady
                      ? `${snapshot.personalNotes.length} jurnal, ${practiceNoteViews.length} praktik`
                      : "Memuat..."}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#B8F348]/20 border border-[#141413]/15 space-y-0.5">
                  <span className="text-[10px] font-mono font-bold text-[#141413] uppercase block">
                    Modul &amp; AI
                  </span>
                  <span className="font-display font-black text-xl sm:text-2xl text-[#141413] block">
                    {isStorageReady ? stats.completedModulesCount : "-"}
                  </span>
                  <span className="text-[10px] text-[#141413]/75 block truncate">
                    {isStorageReady
                      ? `${stats.verifiedFieldsCount} lulus uji AI`
                      : "Memuat..."}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#3B66FF]/10 border border-[#141413]/15 space-y-0.5">
                  <span className="text-[10px] font-mono font-bold text-[#3B66FF] uppercase block">
                    Sertifikasi
                  </span>
                  <span className="font-display font-black text-xl sm:text-2xl text-[#3B66FF] block">
                    {isStorageReady ? stats.passedCertsCount : "-"}
                  </span>
                  <span className="text-[10px] text-[#52514E] block truncate">
                    Unit kompetensi
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#FFBE2E]/20 border border-[#141413]/15 space-y-0.5">
                  <span className="text-[10px] font-mono font-bold text-[#141413] uppercase block">
                    Skor Survey
                  </span>
                  <span className="font-display font-black text-xl sm:text-2xl text-[#141413] block">
                    {isStorageReady ? stats.surveyScore : "-"}
                  </span>
                  <span className="text-[10px] text-[#141413]/75 block truncate">
                    {snapshot.surveyResult ? "Evaluasi akhir" : "Belum tes"}
                  </span>
                </div>
              </div>

              {/* Sidebar Actions */}
              <div className="pt-3 border-t border-[#141413]/15 space-y-2">
                <button
                  type="button"
                  onClick={handlePrintTestReportPdf}
                  className="neo-btn w-full min-h-[42px] px-4 rounded-xl bg-[#141413] hover:bg-[#2C2C2A] text-[#B8F348] border-2 border-[#141413] font-display font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Unduh Laporan PDF</span>
                </button>

                {!user && !authLoading && (
                  <Link
                    href="/login"
                    className="neo-btn w-full min-h-[42px] inline-flex items-center justify-center px-4 rounded-xl bg-[#B8F348] hover:bg-[#a8e635] text-[#141413] border-2 border-[#141413] font-display font-bold text-xs"
                  >
                    Masuk untuk Sinkron Akun
                  </Link>
                )}
              </div>
            </aside>

            {/* Right Main Workspace */}
            <div className="lg:col-span-8 space-y-5 min-w-0">
              {/* 3-Tab Profile Navigation */}
              <div
                role="tablist"
                aria-label="Navigasi Profil Pembelajaran"
                className="p-1.5 rounded-2xl bg-white border-2 border-[#141413] shadow-[3px_3px_0px_#141413] grid grid-cols-1 sm:grid-cols-3 gap-1.5"
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
                      className={`min-h-[44px] px-3.5 py-2 rounded-xl font-display font-bold text-xs sm:text-sm flex items-center justify-between gap-2 transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#141413] text-[#B8F348]"
                          : "bg-transparent text-[#141413] hover:bg-[#FAF7F2]"
                      }`}
                    >
                      <span className="truncate">{tab.label}</span>
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold shrink-0 ${
                          isActive
                            ? "bg-[#B8F348] text-[#141413]"
                            : "bg-[#FAF7F2] text-[#52514E] border border-[#141413]/20"
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
                <div
                  aria-busy="true"
                  aria-label="Memuat data profil"
                  className="neo-card rounded-2xl bg-white p-6 border-2 border-[#141413] space-y-5 animate-pulse"
                >
                  <div className="h-6 w-52 rounded-lg bg-[#F0ECE1]" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="h-10 rounded-xl bg-[#FAF7F2]" />
                    <div className="h-10 rounded-xl bg-[#FAF7F2]" />
                    <div className="h-10 rounded-xl bg-[#FAF7F2]" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-36 rounded-2xl bg-[#FAF7F2]" />
                    <div className="h-36 rounded-2xl bg-[#FAF7F2]" />
                  </div>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    {activeTab === "catatan" && (
                      <NotesSection
                        snapshot={snapshot}
                        practiceNoteViews={practiceNoteViews}
                        onSavePersonalNote={handleSavePersonalNote}
                        onDeletePersonalNote={handleDeletePersonalNote}
                        onSavePracticeNote={handleSavePracticeNote}
                      />
                    )}

                    {activeTab === "progres" && (
                      <ProgressSection
                        snapshot={snapshot}
                        savedFieldIds={savedFieldIds}
                        onDownloadSurveyPdf={handlePrintTestReportPdf}
                      />
                    )}

                    {activeTab === "akun" && (
                      <AccountSettingsSection
                        user={user}
                        authLoading={authLoading}
                        isSavingAccount={isSavingAccount}
                        isSyncingServer={isSyncingServer}
                        lastSyncedAt={lastSyncedAt}
                        onUpdateAccount={handleUpdateAccount}
                        onManualSyncServer={handleManualSync}
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
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
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
