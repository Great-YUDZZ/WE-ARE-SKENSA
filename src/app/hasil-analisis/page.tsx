"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import KertaMargaLogo from "@/components/KertaMargaLogo";
import LoginModal from "@/components/LoginModal";
import { GROUP_CONFIG, FieldGroup } from "@/data/fields";
import {
  MENTOR_CURRICULUM_BY_FIELD,
  FieldCurriculum,
  TargetCourse,
} from "@/data/mentorCurriculum";
import { getAllPustakaPdfByField } from "@/data/moduleMasterclassExtension";
import type { PustakaDokumenItem } from "@/app/api/pustaka-modul/route";
import type { MentorAgentResponse } from "@/app/api/mentor-agent/route";
import { getCachedUser } from "@/lib/useAuth";
import {
  applyFullLearningSnapshotToStorage,
  mergeLearningSnapshots,
  readFieldProgressFromStorage,
  readFullLearningSnapshot,
  writeFieldProgressToStorage,
  type FullLearningSnapshot,
} from "@/lib/learningProfile";
import WorkspaceHeader, {
  WorkspaceTabId,
} from "@/components/hasil-analisis/WorkspaceHeader";
import StudyPlanTab from "@/components/hasil-analisis/StudyPlanTab";
import ModulesTab from "@/components/hasil-analisis/ModulesTab";
import PustakaPdfTab from "@/components/hasil-analisis/PustakaPdfTab";
import CertificationTab from "@/components/hasil-analisis/CertificationTab";
import MentorDrawer, {
  MentorChatTurn,
} from "@/components/hasil-analisis/MentorDrawer";
import SurveyRequiredGate from "@/components/hasil-analisis/SurveyRequiredGate";

interface SavedSurveyResult {
  fieldId: string;
  courseId?: string;
  score: number;
  dominant: FieldGroup;
  mismatch: boolean;
  completedAt?: string;
}

function HasilAnalisisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const fieldParam = searchParams.get("field");
  const courseParam = searchParams.get("course");
  const rawScoreParam = searchParams.get("score");
  const dominantParam = searchParams.get("dominant") as FieldGroup | null;
  const mismatchParam = searchParams.get("mismatch");
  const previewParam = searchParams.get("preview");

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const [isCheckingSurvey, setIsCheckingSurvey] = useState<boolean>(true);
  const [hasSurveyResult, setHasSurveyResult] = useState<boolean>(false);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [baseScore, setBaseScore] = useState<number>(62);
  const [dominantGroup, setDominantGroup] = useState<FieldGroup>("manusia");
  const [isGroupMismatch, setIsGroupMismatch] = useState<boolean>(false);

  const [targetFieldId, setTargetFieldId] = useState<string>(
    fieldParam && MENTOR_CURRICULUM_BY_FIELD[fieldParam] ? fieldParam : "tkj"
  );

  const curriculum: FieldCurriculum =
    MENTOR_CURRICULUM_BY_FIELD[targetFieldId] || MENTOR_CURRICULUM_BY_FIELD.tkj;

  const [targetCourseId, setTargetCourseId] = useState<string>(
    courseParam && curriculum.targetCourses.some((c) => c.id === courseParam)
      ? courseParam
      : curriculum.targetCourses[0].id
  );

  useEffect(() => {
    const hasExplicitScore =
      rawScoreParam !== null &&
      rawScoreParam.trim() !== "" &&
      !Number.isNaN(Number(rawScoreParam));

    if (hasExplicitScore) {
      const nextField =
        fieldParam && MENTOR_CURRICULUM_BY_FIELD[fieldParam] ? fieldParam : "tkj";
      const nextCurr =
        MENTOR_CURRICULUM_BY_FIELD[nextField] || MENTOR_CURRICULUM_BY_FIELD.tkj;
      const nextCourse =
        courseParam && nextCurr.targetCourses.some((c) => c.id === courseParam)
          ? courseParam
          : nextCurr.targetCourses[0].id;
      const nextScore = Math.max(35, Math.min(95, Number(rawScoreParam)));
      const nextDominant: FieldGroup =
        dominantParam && GROUP_CONFIG[dominantParam] ? dominantParam : nextCurr.group;
      const nextMismatch = mismatchParam === "1";

      setTargetFieldId(nextField);
      setTargetCourseId(nextCourse);
      setBaseScore(nextScore);
      setDominantGroup(nextDominant);
      setIsGroupMismatch(nextMismatch);
      setIsPreviewMode(false);
      setHasSurveyResult(true);
      setIsCheckingSurvey(false);

      try {
        const payload: SavedSurveyResult = {
          fieldId: nextField,
          courseId: nextCourse,
          score: nextScore,
          dominant: nextDominant,
          mismatch: nextMismatch,
          completedAt: new Date().toISOString(),
        };
        window.localStorage.setItem(
          "kertamarga_survey_result",
          JSON.stringify(payload)
        );
      } catch {
        // Ignore storage errors
      }
      return;
    }

    try {
      const raw = window.localStorage.getItem("kertamarga_survey_result");
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SavedSurveyResult>;
        if (typeof parsed.score === "number" && !Number.isNaN(parsed.score)) {
          const savedField =
            fieldParam && MENTOR_CURRICULUM_BY_FIELD[fieldParam]
              ? fieldParam
              : parsed.fieldId && MENTOR_CURRICULUM_BY_FIELD[parsed.fieldId]
              ? parsed.fieldId
              : "tkj";
          const savedCurr =
            MENTOR_CURRICULUM_BY_FIELD[savedField] ||
            MENTOR_CURRICULUM_BY_FIELD.tkj;
          const savedCourse =
            courseParam && savedCurr.targetCourses.some((c) => c.id === courseParam)
              ? courseParam
              : parsed.courseId &&
                savedCurr.targetCourses.some((c) => c.id === parsed.courseId)
              ? parsed.courseId
              : savedCurr.targetCourses[0].id;
          const savedDominant: FieldGroup =
            parsed.dominant && GROUP_CONFIG[parsed.dominant]
              ? parsed.dominant
              : savedCurr.group;

          setTargetFieldId(savedField);
          setTargetCourseId(savedCourse);
          setBaseScore(Math.max(35, Math.min(95, parsed.score)));
          setDominantGroup(savedDominant);
          setIsGroupMismatch(Boolean(parsed.mismatch));
          setIsPreviewMode(false);
          setHasSurveyResult(true);
          setIsCheckingSurvey(false);
          return;
        }
      }
    } catch {
      // Ignore storage errors
    }

    const hasExplicitField = Boolean(
      fieldParam && MENTOR_CURRICULUM_BY_FIELD[fieldParam]
    );
    if (hasExplicitField || previewParam === "1") {
      const previewField =
        fieldParam && MENTOR_CURRICULUM_BY_FIELD[fieldParam] ? fieldParam : "tkj";
      const previewCurr =
        MENTOR_CURRICULUM_BY_FIELD[previewField] || MENTOR_CURRICULUM_BY_FIELD.tkj;
      const previewCourse =
        courseParam && previewCurr.targetCourses.some((c) => c.id === courseParam)
          ? courseParam
          : previewCurr.targetCourses[0].id;

      setTargetFieldId(previewField);
      setTargetCourseId(previewCourse);
      setBaseScore(62);
      setDominantGroup(previewCurr.group);
      setIsGroupMismatch(false);
      setIsPreviewMode(true);
      setHasSurveyResult(true);
      setIsCheckingSurvey(false);
      return;
    }

    setIsPreviewMode(false);
    setHasSurveyResult(false);
    setIsCheckingSurvey(false);
  }, [rawScoreParam, fieldParam, courseParam, dominantParam, mismatchParam, previewParam]);

  const [activeTab, setActiveTab] = useState<WorkspaceTabId>("materi");
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>("ALL");
  const [selectedCertFilter, setSelectedCertFilter] = useState<string>("ALL");
  const [expandedModuleId, setExpandedModuleId] = useState<string>(
    curriculum.learningModules[0]?.id || ""
  );
  const [inlinePdfModuleId, setInlinePdfModuleId] = useState<string>("");

  useEffect(() => {
    const curr =
      MENTOR_CURRICULUM_BY_FIELD[targetFieldId] ||
      MENTOR_CURRICULUM_BY_FIELD.tkj;
    setTargetCourseId((prev) =>
      curr.targetCourses.some((c) => c.id === prev)
        ? prev
        : curr.targetCourses[0].id
    );
    setExpandedModuleId(curr.learningModules[0]?.id || "");
    setSelectedModuleFilter("ALL");
    setSelectedCertFilter("ALL");
    setInlinePdfModuleId("");
  }, [targetFieldId]);

  const targetCourse: TargetCourse =
    curriculum.targetCourses.find((c) => c.id === targetCourseId) ||
    curriculum.targetCourses[0];

  // Centralized PDF Library state
  const [pustakaDocs, setPustakaDocs] = useState<PustakaDokumenItem[]>([]);
  const [pustakaScope, setPustakaScope] = useState<"FIELD" | "ALL_FIELDS">(
    "FIELD"
  );
  const [isPustakaLoading, setIsPustakaLoading] = useState<boolean>(false);
  const [pustakaError, setPustakaError] = useState<string | null>(null);
  const [pustakaReloadTick, setPustakaReloadTick] = useState<number>(0);
  const [activePreviewPdfUrl, setActivePreviewPdfUrl] = useState<string>("");
  const [activePreviewPdfTitle, setActivePreviewPdfTitle] =
    useState<string>("");

  useEffect(() => {
    let isMounted = true;
    setIsPustakaLoading(true);
    setPustakaError(null);
    const query = pustakaScope === "FIELD" ? `?field=${targetFieldId}` : "";
    fetch(`/api/pustaka-modul${query}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        const docs: PustakaDokumenItem[] = data.documents || [];
        setPustakaDocs(docs);
        if (docs.length > 0) {
          setActivePreviewPdfUrl(docs[0].fileUrl);
          setActivePreviewPdfTitle(docs[0].title);
        } else {
          setActivePreviewPdfUrl("");
          setActivePreviewPdfTitle("");
        }
        setIsPustakaLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setPustakaError(
          "Gagal memuat daftar modul dari server, menampilkan cadangan lokal."
        );
        const fallback = getAllPustakaPdfByField(targetFieldId).map((p) => ({
          id: p.id,
          fieldId: targetFieldId,
          folderName: p.folderPath
            .replace("public/pustaka-modul/", "")
            .replace("/", ""),
          filename: p.filename,
          fileUrl: p.fileUrl,
          fileSizeKb: 12.5,
          title: p.title,
          category: "Buku Ajar & Praktikum PDF",
          certStandard: p.certStandard,
          author: "Tim Kurikulum KertaMarga",
          externalSourceUrl: p.externalSourceUrl,
          summary: p.title,
        }));
        setPustakaDocs(fallback);
        if (fallback.length > 0) {
          setActivePreviewPdfUrl(fallback[0].fileUrl);
          setActivePreviewPdfTitle(fallback[0].title);
        }
        setIsPustakaLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [targetFieldId, pustakaScope, pustakaReloadTick]);

  // Progress, Practice Notes & Quiz State (persisted per field in localStorage + account sync)
  const [hydratedFieldId, setHydratedFieldId] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [modulePracticeNotes, setModulePracticeNotes] = useState<
    Record<string, string>
  >({});
  const [selectedCertAnswers, setSelectedCertAnswers] = useState<
    Record<string, number>
  >({});
  const [submittedCertIds, setSubmittedCertIds] = useState<string[]>([]);
  const [passedCertIds, setPassedCertIds] = useState<string[]>([]);

  const targetFieldRef = useRef(targetFieldId);
  targetFieldRef.current = targetFieldId;
  const serverSyncReadyRef = useRef<boolean>(false);

  useEffect(() => {
    const prog = readFieldProgressFromStorage(targetFieldId);
    setCompletedModules(prog.completedModules);
    setPassedCertIds(prog.passedCertIds);
    setModulePracticeNotes(prog.practiceNotes);
    setHydratedFieldId(targetFieldId);
  }, [targetFieldId]);

  useEffect(() => {
    let active = true;
    const cachedUser = getCachedUser();
    if (!cachedUser) {
      serverSyncReadyRef.current = true;
      return;
    }

    fetch("/api/profile", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { user?: unknown; learningProfile?: FullLearningSnapshot } | null) => {
        if (!active) return;
        if (data?.user && data.learningProfile) {
          const merged = mergeLearningSnapshots(
            readFullLearningSnapshot(),
            data.learningProfile
          );
          applyFullLearningSnapshotToStorage(merged);
          const currentProg = merged.progressByField[targetFieldRef.current];
          if (currentProg) {
            setCompletedModules(currentProg.completedModules);
            setPassedCertIds(currentProg.passedCertIds);
            setModulePracticeNotes(currentProg.practiceNotes);
          }
        }
        serverSyncReadyRef.current = true;
      })
      .catch(() => {
        if (active) serverSyncReadyRef.current = true;
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hasSurveyResult || hydratedFieldId !== targetFieldId) return;

    writeFieldProgressToStorage(targetFieldId, {
      completedModules,
      passedCertIds,
      practiceNotes: modulePracticeNotes,
    });

    if (!getCachedUser() || !serverSyncReadyRef.current) return;

    const timer = window.setTimeout(() => {
      const snapshot = readFullLearningSnapshot();
      fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          learningProfile: snapshot,
          syncMode: "replace",
        }),
      }).catch(() => {
        // Abaikan kegagalan sinkronisasi latar belakang
      });
    }, 600);

    return () => window.clearTimeout(timer);
  }, [
    hasSurveyResult,
    hydratedFieldId,
    targetFieldId,
    completedModules,
    passedCertIds,
    modulePracticeNotes,
  ]);

  // Mentor Drawer State
  const [isMentorOpen, setIsMentorOpen] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>("");
  const [isAgentLoading, setIsAgentLoading] = useState<boolean>(false);
  const [agentError, setAgentError] = useState<string | null>(null);
  const [lastFailedAgentPrompt, setLastFailedAgentPrompt] = useState<
    string | null
  >(null);
  const [chatHistory, setChatHistory] = useState<MentorChatTurn[]>([]);

  const moduleBonus = curriculum.learningModules
    .filter((m) => completedModules.includes(m.id))
    .reduce((acc, m) => acc + m.scoreBoost, 0);

  const certBonus = curriculum.certificationDrills
    .filter((c) => passedCertIds.includes(c.id))
    .reduce((acc, c) => acc + c.scoreBoost, 0);

  const currentReadinessScore = Math.min(
    99,
    baseScore + moduleBonus + certBonus
  );
  const scoreGap = Math.max(0, targetCourse.minScore - currentReadinessScore);
  const isNowReady = currentReadinessScore >= targetCourse.minScore;

  const filteredModules = curriculum.learningModules.filter((mod) => {
    if (selectedModuleFilter === "ALL") return true;
    if (selectedModuleFilter === "TARGET_COURSE") {
      return !mod.courseId || mod.courseId === targetCourse.id;
    }
    return mod.courseId === selectedModuleFilter;
  });

  const filteredCertDrills = curriculum.certificationDrills.filter((drill) => {
    if (selectedCertFilter === "ALL") return true;
    if (selectedCertFilter === "TARGET_COURSE") {
      return !drill.courseId || drill.courseId === targetCourse.id;
    }
    return (
      drill.certTrack === selectedCertFilter ||
      drill.certName === selectedCertFilter
    );
  });

  const certTrackOptions =
    curriculum.availableCertTracks && curriculum.availableCertTracks.length > 0
      ? curriculum.availableCertTracks
      : Array.from(
          new Set(
            curriculum.certificationDrills.map(
              (d) => d.certTrack || d.certName
            )
          )
        );

  useEffect(() => {
    const gapNow = Math.max(0, targetCourse.minScore - currentReadinessScore);
    const initialTurn: MentorChatTurn = {
      id: "init-" + targetFieldId + "-" + targetCourse.id,
      sender: "agent",
      text:
        gapNow > 0
          ? `Halo! Saya Agen Pembimbing untuk bidang ${curriculum.fieldName}. Skor kesiapan Anda saat ini ${currentReadinessScore}% untuk mata kuliah '${targetCourse.name}' (standar minimum: ${targetCourse.minScore}%). Selesaikan modul materi dan latihan sertifikasi untuk menaikkan skor Anda.`
          : `Selamat! Skor kesiapan Anda (${currentReadinessScore}%) sudah memenuhi standar minimum (${targetCourse.minScore}%) untuk mata kuliah '${targetCourse.name}'. Anda dapat memperdalam modul atau langsung menguji diri di tab Tes Sertifikasi.`,
      diagnosisSummary:
        gapNow > 0
          ? `Perlu +${gapNow} Poin Menuju ${targetCourse.code}`
          : `Memenuhi Standar ${targetCourse.code}`,
      recommendedActionType: gapNow > 0 ? "materi" : "sertifikasi",
      recommendedItemTitle: curriculum.learningModules[0]?.title,
      keyTakeaways: [
        `Jurusan: ${curriculum.fieldName}`,
        `Matkul: ${targetCourse.code} (Min. ${targetCourse.minScore}%)`,
        `Sertifikasi: ${
          targetCourse.certificationAlignment || curriculum.mainCertificationTitle
        }`,
      ],
    };
    setChatHistory([initialTurn]);
  }, [targetFieldId, targetCourse.id]);

  const handleToggleCompleteModule = (
    moduleId: string,
    moduleTitle: string,
    boost: number
  ) => {
    const alreadyDone = completedModules.includes(moduleId);
    const updated = alreadyDone
      ? completedModules.filter((id) => id !== moduleId)
      : [...completedModules, moduleId];
    setCompletedModules(updated);

    if (!alreadyDone) {
      const newTurn: MentorChatTurn = {
        id: "mod-done-" + Date.now(),
        sender: "agent",
        text: `Bagus! Anda menyelesaikan '${moduleTitle}' dan memperoleh +${boost} poin kesiapan untuk mata kuliah ${targetCourse.name}.`,
        diagnosisSummary: `Progres +${boost}% Kesiapan`,
        recommendedActionType: "sertifikasi",
        recommendedItemTitle:
          targetCourse.certificationAlignment ||
          curriculum.mainCertificationTitle,
      };
      setChatHistory((prev) => [...prev, newTurn]);
    }
  };

  const handleCheckCertAnswer = (
    certId: string,
    correctIndex: number,
    boost: number,
    code: string
  ) => {
    const chosen = selectedCertAnswers[certId];
    if (chosen === undefined) return;

    if (!submittedCertIds.includes(certId)) {
      setSubmittedCertIds([...submittedCertIds, certId]);
    }

    if (chosen === correctIndex && !passedCertIds.includes(certId)) {
      setPassedCertIds([...passedCertIds, certId]);
      const newTurn: MentorChatTurn = {
        id: "cert-pass-" + Date.now(),
        sender: "agent",
        text: `Tepat! Unit kompetensi ${code} terverifikasi dan menambah +${boost} poin kesiapan menuju standar ${curriculum.fieldName}.`,
        diagnosisSummary: `Unit ${code} Kompeten (+${boost}%)`,
        recommendedActionType: "materi",
        recommendedItemTitle: curriculum.mainCertificationTitle,
      };
      setChatHistory((prev) => [...prev, newTurn]);
    }
  };

  const handleSendAgentMessage = async (customPrompt?: string) => {
    const messageToSend = (customPrompt ?? chatInput).trim();
    if (!messageToSend || isAgentLoading) return;

    const studentTurn: MentorChatTurn = {
      id: "user-" + Date.now(),
      sender: "student",
      text: messageToSend,
    };

    setChatHistory((prev) => [...prev, studentTurn]);
    if (!customPrompt) setChatInput("");
    setAgentError(null);
    setLastFailedAgentPrompt(null);
    setIsAgentLoading(true);

    try {
      const res = await fetch("/api/mentor-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fieldId: targetFieldId,
          targetCourseId: targetCourse.id,
          currentScore: currentReadinessScore,
          targetScore: targetCourse.minScore,
          userMessage: messageToSend,
          completedModules,
          passedCerts: passedCertIds,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server merespons status ${res.status}`);
      }

      const data = (await res.json()) as MentorAgentResponse;
      const safeReply =
        typeof data.replyMessage === "string" && data.replyMessage.trim().length > 0
          ? data.replyMessage.trim()
          : `Untuk meningkatkan kesiapan pada ${targetCourse.name} di ${curriculum.fieldName}, pelajari modul '${curriculum.learningModules[0]?.title || curriculum.fieldName}' dan kerjakan latihan sertifikasi ${
              targetCourse.certificationAlignment || curriculum.mainCertificationTitle
            }.`;
      const agentTurn: MentorChatTurn = {
        id: "agent-" + Date.now(),
        sender: "agent",
        text: safeReply,
        diagnosisSummary: data.diagnosisSummary,
        recommendedActionType: data.recommendedActionType,
        recommendedItemTitle: data.recommendedItemTitle,
        keyTakeaways: data.keyTakeaways,
        encouragementNote: data.encouragementNote,
        outOfScope: Boolean(data.outOfScope),
      };
      setChatHistory((prev) => [...prev, agentTurn]);
    } catch {
      setAgentError(
        "Koneksi ke Agen Pembimbing sedang terganggu. Menampilkan panduan lokal."
      );
      setLastFailedAgentPrompt(messageToSend);
      const fallbackTurn: MentorChatTurn = {
        id: "agent-fallback-" + Date.now(),
        sender: "agent",
        text: `Untuk meningkatkan kesiapan pada ${targetCourse.name} di ${curriculum.fieldName}, pelajari modul '${curriculum.learningModules[0]?.title}' dan kerjakan simulasi sertifikasi ${
          targetCourse.certificationAlignment || curriculum.mainCertificationTitle
        }.`,
        diagnosisSummary: "Panduan Lokal Aktif",
      };
      setChatHistory((prev) => [...prev, fallbackTurn]);
    } finally {
      setIsAgentLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col neopop-canvas-subtle overflow-x-clip">
      <Navbar
        onOpenLogin={() => {
          setAuthMode("login");
          setIsLoginModalOpen(true);
        }}
        onOpenRegister={() => {
          setAuthMode("register");
          setIsLoginModalOpen(true);
        }}
      />

      <main className="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {isCheckingSurvey ? (
            <div className="max-w-2xl mx-auto py-14 text-center text-xs font-mono font-bold text-[#52514E]">
              Memeriksa hasil survey keminatan Anda...
            </div>
          ) : !hasSurveyResult ? (
            <SurveyRequiredGate
              targetFieldId={targetFieldId}
              previewFieldName={curriculum.fieldName}
              onStartPreview={() => {
                setIsPreviewMode(true);
                setHasSurveyResult(true);
              }}
            />
          ) : (
            <>
              {isPreviewMode && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FFBE2E]/25 border-2 border-[#141413] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs sm:text-sm text-[#141413] font-medium">
                    <span className="font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#FFBE2E] border border-[#141413] mr-2">
                      Mode Pratinjau
                    </span>
                    Menampilkan simulasi standar dasar ({baseScore}%) untuk{" "}
                    <strong>{curriculum.fieldName}</strong>. Isi Survey Keminatan untuk menghitung skor kesiapan asli Anda.
                  </div>
                  <Link
                    href={`/tes-keminatan?field=${encodeURIComponent(targetFieldId)}`}
                    className="neo-btn inline-flex items-center justify-center min-h-[40px] px-4 rounded-xl bg-[#B8F348] hover:bg-[#a8e635] text-[#141413] border-2 border-[#141413] font-display font-bold text-xs shrink-0"
                  >
                    Hitung Skor Survey Asli &rarr;
                  </Link>
                </div>
              )}

              <WorkspaceHeader
                targetFieldId={targetFieldId}
                onChangeField={setTargetFieldId}
                targetCourse={targetCourse}
                onChangeCourse={setTargetCourseId}
                curriculum={curriculum}
                baseScore={baseScore}
                moduleBonus={moduleBonus}
                certBonus={certBonus}
                currentReadinessScore={currentReadinessScore}
                scoreGap={scoreGap}
                isNowReady={isNowReady}
                isGroupMismatch={isGroupMismatch}
                dominantGroup={dominantGroup}
                activeTab={activeTab}
                onChangeTab={setActiveTab}
                pustakaCount={pustakaDocs.length}
                passedCertCount={passedCertIds.length}
              />

              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
              >
                {activeTab === "rencana" && (
                  <StudyPlanTab
                    curriculum={curriculum}
                    targetCourse={targetCourse}
                    currentReadinessScore={currentReadinessScore}
                    onSelectCourse={setTargetCourseId}
                    onGoToModules={() => setActiveTab("materi")}
                    onGoToCertification={() => setActiveTab("sertifikasi")}
                  />
                )}

                {activeTab === "materi" && (
                  <ModulesTab
                    curriculum={curriculum}
                    filteredModules={filteredModules}
                    selectedModuleFilter={selectedModuleFilter}
                    onChangeFilter={(filterId) => {
                      setSelectedModuleFilter(filterId);
                      if (filterId !== "ALL") {
                        const firstMatch = curriculum.learningModules.find(
                          (mod) => mod.courseId === filterId
                        );
                        if (firstMatch) setExpandedModuleId(firstMatch.id);
                      }
                    }}
                    onSelectCourse={setTargetCourseId}
                    expandedModuleId={expandedModuleId}
                    onToggleExpand={setExpandedModuleId}
                    completedModules={completedModules}
                    onToggleCompleteModule={handleToggleCompleteModule}
                    modulePracticeNotes={modulePracticeNotes}
                    onChangePracticeNote={(modId, note) =>
                      setModulePracticeNotes((prev) => ({
                        ...prev,
                        [modId]: note,
                      }))
                    }
                    inlinePdfModuleId={inlinePdfModuleId}
                    onToggleInlinePdf={(modId) =>
                      setInlinePdfModuleId((prev) =>
                        prev === modId ? "" : modId
                      )
                    }
                    onAskMentorAboutModule={(modTitle, courseName) => {
                      setIsMentorOpen(true);
                      handleSendAgentMessage(
                        `Bantu saya memahami lebih dalam tentang ${modTitle} pada mata kuliah ${courseName}`
                      );
                    }}
                    onGoToPustaka={() => setActiveTab("pustaka")}
                    onGoToCertification={() => setActiveTab("sertifikasi")}
                    pustakaCount={pustakaDocs.length}
                  />
                )}

                {activeTab === "pustaka" && (
                  <PustakaPdfTab
                    curriculum={curriculum}
                    pustakaDocs={pustakaDocs}
                    pustakaScope={pustakaScope}
                    onToggleScope={() =>
                      setPustakaScope((prev) =>
                        prev === "FIELD" ? "ALL_FIELDS" : "FIELD"
                      )
                    }
                    onReload={() => setPustakaReloadTick((t) => t + 1)}
                    isLoading={isPustakaLoading}
                    error={pustakaError}
                    activePreviewPdfUrl={activePreviewPdfUrl}
                    activePreviewPdfTitle={activePreviewPdfTitle}
                    onSelectPdf={(url, title) => {
                      setActivePreviewPdfUrl(url);
                      setActivePreviewPdfTitle(title);
                    }}
                  />
                )}

                {activeTab === "sertifikasi" && (
                  <CertificationTab
                    curriculum={curriculum}
                    targetCourse={targetCourse}
                    filteredCertDrills={filteredCertDrills}
                    selectedCertFilter={selectedCertFilter}
                    onChangeFilter={setSelectedCertFilter}
                    certTrackOptions={certTrackOptions}
                    selectedCertAnswers={selectedCertAnswers}
                    onSelectAnswer={(drillId, optIdx) =>
                      setSelectedCertAnswers((prev) => ({
                        ...prev,
                        [drillId]: optIdx,
                      }))
                    }
                    submittedCertIds={submittedCertIds}
                    passedCertIds={passedCertIds}
                    onCheckAnswer={handleCheckCertAnswer}
                  />
                )}
              </motion.div>
            </>
          )}
        </div>
      </main>

      {hasSurveyResult && (
        <MentorDrawer
          isOpen={isMentorOpen}
          onOpen={() => setIsMentorOpen(true)}
          onClose={() => setIsMentorOpen(false)}
          curriculum={curriculum}
          targetCourse={targetCourse}
          currentReadinessScore={currentReadinessScore}
          chatHistory={chatHistory}
          chatInput={chatInput}
          onChangeInput={setChatInput}
          onSendMessage={handleSendAgentMessage}
          isLoading={isAgentLoading}
          error={agentError}
          lastFailedPrompt={lastFailedAgentPrompt}
          onJumpToTab={setActiveTab}
        />
      )}

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
            <Link href="/ai-navigator" className="hover:text-[#141413]">
              AI Navigator
            </Link>
            <Link href="/profil" className="hover:text-[#141413]">
              Profil &amp; Catatan
            </Link>
          </div>
        </div>
      </footer>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onProceedToTest={() => router.push("/tes-keminatan")}
        initialMode={authMode}
      />
    </div>
  );
}

export default function HasilAnalisisPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center neopop-canvas-subtle text-[#141413] font-mono font-bold text-xs">
          Memuat Halaman Modul &amp; Sertifikasi...
        </div>
      }
    >
      <HasilAnalisisContent />
    </Suspense>
  );
}
