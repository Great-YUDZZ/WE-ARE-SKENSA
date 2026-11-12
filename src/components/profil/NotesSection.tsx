"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { FIELDS } from "@/data/fields";
import {
  NOTE_CATEGORIES,
  getFieldLabelById,
  type FullLearningSnapshot,
  type ModulePracticeNoteView,
  type PersonalLearningNote,
  type PersonalNoteCategory,
} from "@/lib/learningProfile";

interface NotesSectionProps {
  snapshot: FullLearningSnapshot;
  practiceNoteViews: ModulePracticeNoteView[];
  onSavePersonalNote: (noteInput: {
    id?: string;
    title: string;
    fieldId: string;
    category: PersonalNoteCategory;
    content: string;
  }) => void;
  onDeletePersonalNote: (noteId: string) => void;
  onSavePracticeNote: (fieldId: string, moduleId: string, noteText: string) => void;
}

export default function NotesSection({
  snapshot,
  practiceNoteViews,
  onSavePersonalNote,
  onDeletePersonalNote,
  onSavePracticeNote,
}: NotesSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterField, setFilterField] = useState("ALL");
  const [filterCategory, setFilterCategory] = useState("ALL");

  // Composer state for Personal Journal Notes
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteFieldId, setNoteFieldId] = useState("umum");
  const [noteCategory, setNoteCategory] =
    useState<PersonalNoteCategory>("Ringkasan Materi");
  const [noteContent, setNoteContent] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Inline edit state for Module Practice Notes
  const [editingPracticeKey, setEditingPracticeKey] = useState<string | null>(null);
  const [practiceDraft, setPracticeDraft] = useState("");

  const openCreateForm = () => {
    setEditingNoteId(null);
    setNoteTitle("");
    setNoteFieldId(filterField !== "ALL" ? filterField : "umum");
    setNoteCategory("Ringkasan Materi");
    setNoteContent("");
    setFormError(null);
    setIsFormOpen(true);
  };

  const openEditForm = (note: PersonalLearningNote) => {
    setEditingNoteId(note.id);
    setNoteTitle(note.title);
    setNoteFieldId(note.fieldId);
    setNoteCategory(note.category);
    setNoteContent(note.content);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleSubmitNote = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = noteTitle.trim();
    const cleanContent = noteContent.trim();
    if (cleanTitle.length < 3) {
      setFormError("Judul catatan minimal 3 karakter.");
      return;
    }
    if (cleanContent.length < 5) {
      setFormError("Isi catatan pembelajaran minimal 5 karakter.");
      return;
    }

    onSavePersonalNote({
      id: editingNoteId || undefined,
      title: cleanTitle,
      fieldId: noteFieldId,
      category: noteCategory,
      content: cleanContent,
    });

    setIsFormOpen(false);
    setEditingNoteId(null);
    setNoteTitle("");
    setNoteContent("");
    setFormError(null);
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredPersonalNotes = useMemo(() => {
    return snapshot.personalNotes.filter((note) => {
      if (filterField !== "ALL" && note.fieldId !== filterField) return false;
      if (filterCategory !== "ALL" && note.category !== filterCategory) return false;
      if (normalizedQuery) {
        const hay = `${note.title} ${note.content} ${getFieldLabelById(note.fieldId)} ${note.category}`.toLowerCase();
        if (!hay.includes(normalizedQuery)) return false;
      }
      return true;
    });
  }, [snapshot.personalNotes, filterField, filterCategory, normalizedQuery]);

  const filteredPracticeNotes = useMemo(() => {
    return practiceNoteViews.filter((item) => {
      if (filterField !== "ALL" && filterField !== "umum" && item.fieldId !== filterField) {
        return false;
      }
      if (normalizedQuery) {
        const hay = `${item.moduleTitle} ${item.moduleCode} ${item.courseName} ${item.fieldName} ${item.noteText}`.toLowerCase();
        if (!hay.includes(normalizedQuery)) return false;
      }
      return true;
    });
  }, [practiceNoteViews, filterField, normalizedQuery]);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter & Quick Create Bar */}
      <div className="neo-card rounded-2xl bg-white p-4 sm:p-5 border-2 border-[#141413] shadow-[4px_4px_0px_#141413] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono font-bold text-[#3B66FF] uppercase">
              Catatan Pembelajaran Saya
            </span>
            <h2 className="font-display font-black text-xl sm:text-2xl text-[#141413]">
              Jurnal Belajar &amp; Catatan Tugas Modul
            </h2>
          </div>

          <button
            type="button"
            onClick={() => (isFormOpen ? setIsFormOpen(false) : openCreateForm())}
            className="neo-btn min-h-[44px] px-4 py-2 rounded-xl bg-[#B8F348] hover:bg-[#a8e635] text-[#141413] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] font-display font-black text-xs sm:text-sm cursor-pointer shrink-0"
          >
            {isFormOpen ? "Tutup Form Catatan" : "+ Tambah Catatan Belajar"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul materi, topik, atau isi catatan..."
            aria-label="Cari catatan pembelajaran"
            className="w-full min-h-[44px] px-3.5 rounded-xl bg-[#FAF7F2] border-2 border-[#141413] text-xs sm:text-sm font-medium text-[#141413] placeholder:text-[#52514E] focus:outline-none focus:ring-2 focus:ring-[#3B66FF]"
          />

          <select
            value={filterField}
            onChange={(e) => setFilterField(e.target.value)}
            aria-label="Filter bidang catatan"
            className="w-full min-h-[44px] px-3 rounded-xl bg-[#FAF7F2] border-2 border-[#141413] text-xs sm:text-sm font-bold text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#3B66FF] cursor-pointer"
          >
            <option value="ALL">Semua Bidang Studi</option>
            <option value="umum">Catatan Umum Studi</option>
            {FIELDS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            aria-label="Filter kategori catatan"
            className="w-full min-h-[44px] px-3 rounded-xl bg-[#FAF7F2] border-2 border-[#141413] text-xs sm:text-sm font-bold text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#3B66FF] cursor-pointer"
          >
            <option value="ALL">Semua Kategori Jurnal</option>
            {NOTE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inline Note Composer / Editor */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmitNote}
          className="neo-card rounded-2xl bg-[#FAF7F2] p-5 sm:p-6 border-2 border-[#141413] shadow-[4px_4px_0px_#3B66FF] space-y-4"
        >
          <div className="flex items-center justify-between gap-2 pb-3 border-b-2 border-[#141413]">
            <h3 className="font-display font-black text-lg text-[#141413]">
              {editingNoteId ? "Edit Catatan Pembelajaran" : "Tulis Catatan Pembelajaran Baru"}
            </h3>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-[#3B66FF] text-white border border-[#141413]">
              Jurnal Pribadi
            </span>
          </div>

          {formError && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-[#FFE5E0] border-2 border-[#141413] text-xs font-bold text-[#7A1A12]"
            >
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="sm:col-span-1 block space-y-1">
              <span className="text-xs font-mono font-bold text-[#52514E] block">
                Judul Catatan
              </span>
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Cth: Rangkuman Subnetting IPv4 /24"
                maxLength={160}
                className="w-full min-h-[44px] px-3 rounded-xl bg-white border-2 border-[#141413] text-xs sm:text-sm font-bold text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#3B66FF]"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-xs font-mono font-bold text-[#52514E] block">
                Bidang Studi
              </span>
              <select
                value={noteFieldId}
                onChange={(e) => setNoteFieldId(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-xl bg-white border-2 border-[#141413] text-xs sm:text-sm font-bold text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#3B66FF] cursor-pointer"
              >
                <option value="umum">Catatan Umum Studi</option>
                {FIELDS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-1">
              <span className="text-xs font-mono font-bold text-[#52514E] block">
                Kategori
              </span>
              <select
                value={noteCategory}
                onChange={(e) => setNoteCategory(e.target.value as PersonalNoteCategory)}
                className="w-full min-h-[44px] px-3 rounded-xl bg-white border-2 border-[#141413] text-xs sm:text-sm font-bold text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#3B66FF] cursor-pointer"
              >
                {NOTE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block space-y-1">
            <span className="text-xs font-mono font-bold text-[#52514E] block">
              Isi Catatan Pembelajaran
            </span>
            <textarea
              rows={5}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              maxLength={4000}
              placeholder="Tuliskan poin penting materi, rumus, target prodi SNBP/SNBT, hal yang masih perlu dipelajari, atau catatan bimbingan..."
              className="w-full p-3.5 rounded-xl bg-white border-2 border-[#141413] text-xs sm:text-sm text-[#141413] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#3B66FF]"
            />
          </label>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="min-h-[44px] px-4 rounded-xl bg-white border-2 border-[#141413] hover:bg-[#F0ECE1] font-mono font-bold text-xs text-[#141413] cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="neo-btn min-h-[44px] px-5 rounded-xl bg-[#B8F348] hover:bg-[#a8e635] text-[#141413] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] font-display font-black text-xs sm:text-sm cursor-pointer"
            >
              {editingNoteId ? "Simpan Perubahan" : "Simpan Catatan"}
            </button>
          </div>
        </form>
      )}

      {/* Part A: Personal Study Journal Notes */}
      <section className="neo-card rounded-2xl bg-white p-5 sm:p-6 border-2 border-[#141413] shadow-[4px_4px_0px_#141413] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-[#141413]">
          <div>
            <h3 className="font-display font-black text-lg sm:text-xl text-[#141413]">
              1. Jurnal Catatan Belajar Pribadi ({filteredPersonalNotes.length})
            </h3>
            <p className="text-xs text-[#52514E] font-medium">
              Simpan ringkasan modul, target kampus Bali, catatan konsultasi Guru BK, dan poin latihan ujian.
            </p>
          </div>
        </div>

        {filteredPersonalNotes.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border-2 border-dashed border-[#141413]/40 text-center space-y-3">
            <p className="font-display font-bold text-sm sm:text-base text-[#141413]">
              {snapshot.personalNotes.length === 0
                ? "Belum ada jurnal catatan pembelajaran yang tersimpan."
                : "Tidak ada catatan yang sesuai dengan kata kunci atau filter aktif."}
            </p>
            <p className="text-xs text-[#52514E] max-w-md mx-auto">
              Catat materi penting selama belajar di modul KertaMarga agar progres pemahamanmu selalu terekam rapi.
            </p>
            {snapshot.personalNotes.length === 0 && (
              <button
                type="button"
                onClick={openCreateForm}
                className="neo-btn px-4 py-2.5 rounded-xl bg-[#B8F348] text-[#141413] border-2 border-[#141413] shadow-[2px_2px_0px_#141413] font-display font-bold text-xs cursor-pointer"
              >
                + Tulis Catatan Pertama
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPersonalNotes.map((note) => (
              <article
                key={note.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] flex flex-col justify-between gap-3"
              >
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#FFBE2E] text-[#141413] border border-[#141413] font-mono font-bold text-[11px]">
                      {note.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-white text-[#3B66FF] border border-[#141413] font-mono font-bold text-[11px]">
                      {getFieldLabelById(note.fieldId)}
                    </span>
                  </div>

                  <h4 className="font-display font-black text-base text-[#141413] leading-snug">
                    {note.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-[#141413]/90 leading-relaxed whitespace-pre-line break-words">
                    {note.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#141413]/20 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-[#52514E]">
                    Diperbarui: {formatDate(note.updatedAt)}
                  </span>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {note.fieldId !== "umum" && (
                      <Link
                        href={`/hasil-analisis?field=${encodeURIComponent(note.fieldId)}`}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#B8F348]/40 border border-[#141413] text-[11px] font-mono font-bold text-[#141413]"
                      >
                        Modul &rarr;
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => openEditForm(note)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#F0ECE1] border border-[#141413] text-[11px] font-mono font-bold text-[#141413] cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeletePersonalNote(note.id)}
                      className="px-2.5 py-1 rounded-lg bg-[#FFE5E0] hover:bg-[#ffd0c7] border border-[#141413] text-[11px] font-mono font-bold text-[#7A1A12] cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Part B: Integrated Module Practice Notes from Workspace */}
      <section className="neo-card rounded-2xl bg-white p-5 sm:p-6 border-2 border-[#141413] shadow-[4px_4px_0px_#141413] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-[#141413]">
          <div>
            <h3 className="font-display font-black text-lg sm:text-xl text-[#141413]">
              2. Catatan Tugas Praktik Modul ({filteredPracticeNotes.length})
            </h3>
            <p className="text-xs text-[#52514E] font-medium">
              Tersinkron langsung dengan jawaban latihan mandiri yang Anda tulis di halaman Modul &amp; Sertifikasi.
            </p>
          </div>
          <Link
            href="/hasil-analisis"
            className="neo-btn px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#B8F348]/40 border-2 border-[#141413] text-xs font-mono font-bold text-[#141413]"
          >
            Buka Workspace Modul &rarr;
          </Link>
        </div>

        {filteredPracticeNotes.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border-2 border-dashed border-[#141413]/40 text-center space-y-2.5">
            <p className="font-display font-bold text-sm sm:text-base text-[#141413]">
              Belum ada catatan tugas praktik modul yang diisi.
            </p>
            <p className="text-xs text-[#52514E] max-w-lg mx-auto">
              Buka salah satu modul di halaman Modul &amp; Sertifikasi lalu isi kolom &quot;Tugas Praktik Mandiri&quot; agar catatan Anda muncul di sini.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredPracticeNotes.map((item) => {
              const practiceKey = `${item.fieldId}:${item.moduleId}`;
              const isEditing = editingPracticeKey === practiceKey;

              return (
                <article
                  key={practiceKey}
                  className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#3B66FF] text-white border border-[#141413] font-bold">
                        {item.moduleCode}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-white text-[#141413] border border-[#141413] font-bold">
                        {item.fieldName}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-lg border border-[#141413] font-bold ${
                          item.isCompleted
                            ? "bg-[#B8F348] text-[#141413]"
                            : "bg-[#FFBE2E] text-[#141413]"
                        }`}
                      >
                        {item.isCompleted ? `Selesai (+${item.scoreBoost}%)` : "Dalam Progres"}
                      </span>
                    </div>

                    <Link
                      href={`/hasil-analisis?field=${encodeURIComponent(item.fieldId)}`}
                      className="text-xs font-mono font-bold text-[#3B66FF] hover:underline shrink-0"
                    >
                      Buka di Workspace &rarr;
                    </Link>
                  </div>

                  <div>
                    <h4 className="font-display font-black text-base text-[#141413]">
                      {item.moduleTitle}
                    </h4>
                    <p className="text-xs text-[#52514E] font-medium mt-0.5">
                      Matkul {item.courseCode}: {item.courseName}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#141413]/30 text-xs text-[#52514E]">
                    <span className="font-mono font-bold text-[#141413] uppercase block mb-0.5">
                      Instruksi Tugas Praktik:
                    </span>
                    {item.practiceTask}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2.5">
                      <textarea
                        rows={3}
                        value={practiceDraft}
                        onChange={(e) => setPracticeDraft(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white border-2 border-[#141413] text-xs sm:text-sm text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#3B66FF]"
                      />
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingPracticeKey(null)}
                          className="px-3 py-1.5 rounded-xl bg-white border-2 border-[#141413] text-xs font-mono font-bold text-[#141413] cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onSavePracticeNote(item.fieldId, item.moduleId, practiceDraft);
                            setEditingPracticeKey(null);
                          }}
                          className="neo-btn px-4 py-1.5 rounded-xl bg-[#B8F348] border-2 border-[#141413] text-xs font-display font-bold text-[#141413] cursor-pointer"
                        >
                          Simpan Jawaban Praktik
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="p-3.5 rounded-xl bg-white border-2 border-[#141413] text-xs sm:text-sm text-[#141413] whitespace-pre-line break-words leading-relaxed">
                        {item.noteText}
                      </div>

                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPracticeKey(practiceKey);
                            setPracticeDraft(item.noteText);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#F0ECE1] border border-[#141413] text-xs font-mono font-bold text-[#141413] cursor-pointer"
                        >
                          Edit Jawaban
                        </button>
                        <button
                          type="button"
                          onClick={() => onSavePracticeNote(item.fieldId, item.moduleId, "")}
                          className="px-3 py-1.5 rounded-lg bg-[#FFE5E0] hover:bg-[#ffd0c7] border border-[#141413] text-xs font-mono font-bold text-[#7A1A12] cursor-pointer"
                        >
                          Hapus Catatan
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
