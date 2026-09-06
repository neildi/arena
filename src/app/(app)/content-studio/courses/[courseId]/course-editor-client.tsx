"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/card";
import { Pill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Textarea } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { EmptyState } from "@/components/ui/empty-state";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Pencil,
} from "lucide-react";

interface KeyTerm {
  term: string;
  definition: string;
}
interface Section {
  heading: string;
  body: string;
}
interface Script {
  title: string;
  dialogue: string;
}

export function CourseEditorClient({ course: initialCourse }: { course: any }) {
  const { showToast } = useToast();
  const [course, setCourse] = useState(initialCourse);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Add module modal
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [moduleTitle, setModuleTitle] = useState("");
  const [savingModule, setSavingModule] = useState(false);

  // Add/edit lesson modal
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [lessonModuleId, setLessonModuleId] = useState<string | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonSummary, setLessonSummary] = useState("");
  const [lessonMinutes, setLessonMinutes] = useState(10);
  const [sections, setSections] = useState<Section[]>([{ heading: "", body: "" }]);
  const [keyTerms, setKeyTerms] = useState<KeyTerm[]>([{ term: "", definition: "" }]);
  const [clientLanguage, setClientLanguage] = useState<string[]>([""]);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [complianceNotes, setComplianceNotes] = useState<string[]>([
    "Follow your store policy and local regulations. Do not make promises about approvals, valuations, or legal requirements.",
  ]);
  const [savingLesson, setSavingLesson] = useState(false);

  function toggleModule(id: string) {
    setExpandedModules((m) => ({ ...m, [id]: !m[id] }));
  }

  async function createModule() {
    if (!moduleTitle.trim()) return;
    setSavingModule(true);
    try {
      const res = await fetch(`/api/courses/${course.id}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: moduleTitle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCourse((c: any) => ({
        ...c,
        modules: [...c.modules, { ...data.module, lessons: [] }],
      }));
      showToast("Module added.", "success");
      setModuleModalOpen(false);
      setModuleTitle("");
    } catch {
      showToast("Could not add module.", "error");
    } finally {
      setSavingModule(false);
    }
  }

  async function archiveModule(moduleId: string) {
    if (!confirm("Archive this module and its lessons?")) return;
    const prev = course;
    setCourse((c: any) => ({ ...c, modules: c.modules.filter((m: any) => m.id !== moduleId) }));
    try {
      const res = await fetch(`/api/modules/${moduleId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Module archived.", "success");
    } catch {
      setCourse(prev);
      showToast("Could not archive module.", "error");
    }
  }

  function openNewLesson(moduleId: string) {
    setEditingLessonId(null);
    setLessonModuleId(moduleId);
    setLessonTitle("");
    setLessonSummary("");
    setLessonMinutes(10);
    setSections([{ heading: "", body: "" }]);
    setKeyTerms([{ term: "", definition: "" }]);
    setClientLanguage([""]);
    setScripts([]);
    setComplianceNotes([
      "Follow your store policy and local regulations. Do not make promises about approvals, valuations, or legal requirements.",
    ]);
    setLessonModalOpen(true);
  }

  function openEditLesson(moduleId: string, lesson: any) {
    setEditingLessonId(lesson.id);
    setLessonModuleId(moduleId);
    setLessonTitle(lesson.title);
    setLessonSummary(lesson.summary || "");
    setLessonMinutes(lesson.estimated_minutes || 10);
    const s = safeParse(lesson.sections, [{ heading: "", body: "" }]);
    setSections(s.length ? s : [{ heading: "", body: "" }]);
    const kt = safeParse(lesson.key_terms, [{ term: "", definition: "" }]);
    setKeyTerms(kt.length ? kt : [{ term: "", definition: "" }]);
    const cl = safeParse(lesson.client_language, [""]);
    setClientLanguage(cl.length ? cl : [""]);
    setScripts(safeParse(lesson.scripts, []));
    const cn = safeParse(lesson.compliance_notes, [
      "Follow your store policy and local regulations. Do not make promises about approvals, valuations, or legal requirements.",
    ]);
    setComplianceNotes(cn.length ? cn : [""]);
    setLessonModalOpen(true);
  }

  function safeParse(value: any, fallback: any) {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : fallback;
      } catch {
        return fallback;
      }
    }
    return fallback;
  }

  async function saveLesson() {
    if (!lessonTitle.trim() || !lessonModuleId) return;
    setSavingLesson(true);
    const payload = {
      title: lessonTitle,
      summary: lessonSummary,
      estimatedMinutes: lessonMinutes,
      sections: sections.filter((s) => s.heading.trim() || s.body.trim()),
      keyTerms: keyTerms.filter((k) => k.term.trim() || k.definition.trim()),
      clientLanguage: clientLanguage.filter((c) => c.trim()),
      scripts: scripts.filter((s) => s.title.trim() || s.dialogue.trim()),
      complianceNotes: complianceNotes.filter((c) => c.trim()),
    };
    try {
      if (editingLessonId) {
        const res = await fetch(`/api/lessons/${editingLessonId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setCourse((c: any) => ({
          ...c,
          modules: c.modules.map((m: any) =>
            m.id === lessonModuleId
              ? { ...m, lessons: m.lessons.map((l: any) => (l.id === editingLessonId ? data.lesson : l)) }
              : m
          ),
        }));
        showToast("Lesson updated.", "success");
      } else {
        const res = await fetch(`/api/modules/${lessonModuleId}/lessons`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setCourse((c: any) => ({
          ...c,
          modules: c.modules.map((m: any) =>
            m.id === lessonModuleId ? { ...m, lessons: [...m.lessons, data.lesson] } : m
          ),
        }));
        showToast("Lesson added.", "success");
        setExpandedModules((m) => ({ ...m, [lessonModuleId]: true }));
      }
      setLessonModalOpen(false);
    } catch {
      showToast("Could not save lesson.", "error");
    } finally {
      setSavingLesson(false);
    }
  }

  async function archiveLesson(moduleId: string, lessonId: string) {
    if (!confirm("Archive this lesson?")) return;
    const prev = course;
    setCourse((c: any) => ({
      ...c,
      modules: c.modules.map((m: any) =>
        m.id === moduleId ? { ...m, lessons: m.lessons.filter((l: any) => l.id !== lessonId) } : m
      ),
    }));
    try {
      const res = await fetch(`/api/lessons/${lessonId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Lesson archived.", "success");
    } catch {
      setCourse(prev);
      showToast("Could not archive lesson.", "error");
    }
  }

  function updateListItem<T>(list: T[], index: number, value: T, setter: (v: T[]) => void) {
    const copy = [...list];
    copy[index] = value;
    setter(copy);
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/content-studio" className="text-sm text-charcoal-500 inline-flex items-center gap-1 mb-2">
          <ArrowLeft className="h-4 w-4" /> Back to Content Studio
        </Link>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="font-serif text-3xl text-charcoal-900">{course.title}</h1>
          <Pill tone="gold">{course.level}</Pill>
        </div>
        <p className="text-sm text-charcoal-500">{course.description}</p>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => setModuleModalOpen(true)}>
          <Plus className="h-4 w-4" /> Add module
        </Button>
      </div>

      {course.modules.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-6 w-6" />}
          title="No modules yet"
          description="Add a module to start building this course's curriculum."
        />
      ) : (
        <div className="space-y-3">
          {course.modules.map((mod: any) => (
            <Card key={mod.id}>
              <CardBody className="p-0">
                <div className="flex items-center justify-between p-4">
                  <button
                    onClick={() => toggleModule(mod.id)}
                    className="flex items-center gap-2 text-left flex-1"
                  >
                    {expandedModules[mod.id] ? (
                      <ChevronDown className="h-4 w-4 text-charcoal-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-charcoal-400" />
                    )}
                    <span className="font-medium text-charcoal-900">{mod.title}</span>
                    <span className="text-xs text-charcoal-400">
                      {mod.lessons.length} lesson{mod.lessons.length === 1 ? "" : "s"}
                    </span>
                  </button>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="outline" onClick={() => openNewLesson(mod.id)}>
                      <Plus className="h-3.5 w-3.5" /> Lesson
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => archiveModule(mod.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {expandedModules[mod.id] && (
                  <div className="border-t border-champagne/60 divide-y divide-champagne/40">
                    {mod.lessons.length === 0 ? (
                      <p className="text-sm text-charcoal-500 p-4">No lessons in this module yet.</p>
                    ) : (
                      mod.lessons.map((lesson: any) => (
                        <div key={lesson.id} className="flex items-center justify-between p-4">
                          <div>
                            <Link
                              href={`/learning/lessons/${lesson.id}`}
                              className="text-charcoal-900 font-medium hover:text-gold-dark"
                            >
                              {lesson.title}
                            </Link>
                            <p className="text-xs text-charcoal-500">{lesson.estimated_minutes} min</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="ghost" onClick={() => openEditLesson(mod.id, lesson)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => archiveLesson(mod.id, lesson.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={moduleModalOpen}
        onClose={() => setModuleModalOpen(false)}
        title="Add module"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModuleModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createModule} loading={savingModule} disabled={!moduleTitle.trim()}>
              Add
            </Button>
          </>
        }
      >
        <div>
          <label htmlFor="module-title" className="block text-sm font-medium text-charcoal-800 mb-1.5">
            Module title
          </label>
          <Input id="module-title" value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} />
        </div>
      </Modal>

      <Modal
        open={lessonModalOpen}
        onClose={() => setLessonModalOpen(false)}
        title={editingLessonId ? "Edit lesson" : "Add lesson"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setLessonModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveLesson} loading={savingLesson} disabled={!lessonTitle.trim()}>
              Save lesson
            </Button>
          </>
        }
      >
        <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
          <div>
            <label htmlFor="lesson-title" className="block text-sm font-medium text-charcoal-800 mb-1.5">
              Title
            </label>
            <Input id="lesson-title" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} />
          </div>
          <div>
            <label htmlFor="lesson-summary" className="block text-sm font-medium text-charcoal-800 mb-1.5">
              Summary
            </label>
            <Textarea id="lesson-summary" value={lessonSummary} onChange={(e) => setLessonSummary(e.target.value)} />
          </div>
          <div>
            <label htmlFor="lesson-minutes" className="block text-sm font-medium text-charcoal-800 mb-1.5">
              Estimated minutes
            </label>
            <Input
              id="lesson-minutes"
              type="number"
              min={1}
              value={lessonMinutes}
              onChange={(e) => setLessonMinutes(Number(e.target.value) || 0)}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm font-medium text-charcoal-800">Sections (full article view)</p>
              <button
                type="button"
                className="text-xs text-gold-dark font-medium"
                onClick={() => setSections((s) => [...s, { heading: "", body: "" }])}
              >
                + Add section
              </button>
            </div>
            <div className="space-y-2">
              {sections.map((s, i) => (
                <div key={i} className="rounded-lg border border-champagne-dark/40 p-3 space-y-2">
                  <Input
                    placeholder="Heading"
                    value={s.heading}
                    onChange={(e) => updateListItem(sections, i, { ...s, heading: e.target.value }, setSections)}
                  />
                  <Textarea
                    placeholder="Body"
                    value={s.body}
                    onChange={(e) => updateListItem(sections, i, { ...s, body: e.target.value }, setSections)}
                  />
                  {sections.length > 1 && (
                    <button
                      type="button"
                      className="text-xs text-danger"
                      onClick={() => setSections(sections.filter((_, idx) => idx !== i))}
                    >
                      Remove section
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm font-medium text-charcoal-800">Key terms</p>
              <button
                type="button"
                className="text-xs text-gold-dark font-medium"
                onClick={() => setKeyTerms((k) => [...k, { term: "", definition: "" }])}
              >
                + Add term
              </button>
            </div>
            <div className="space-y-2">
              {keyTerms.map((k, i) => (
                <div key={i} className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Term"
                    value={k.term}
                    onChange={(e) => updateListItem(keyTerms, i, { ...k, term: e.target.value }, setKeyTerms)}
                  />
                  <Input
                    placeholder="Definition"
                    value={k.definition}
                    onChange={(e) =>
                      updateListItem(keyTerms, i, { ...k, definition: e.target.value }, setKeyTerms)
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm font-medium text-charcoal-800">Client-facing language</p>
              <button
                type="button"
                className="text-xs text-gold-dark font-medium"
                onClick={() => setClientLanguage((c) => [...c, ""])}
              >
                + Add phrase
              </button>
            </div>
            <div className="space-y-2">
              {clientLanguage.map((c, i) => (
                <Input
                  key={i}
                  placeholder="e.g. 'This setting is designed to protect the stone during everyday wear.'"
                  value={c}
                  onChange={(e) => updateListItem(clientLanguage, i, e.target.value, setClientLanguage)}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm font-medium text-charcoal-800">Scripts / dialogues</p>
              <button
                type="button"
                className="text-xs text-gold-dark font-medium"
                onClick={() => setScripts((s) => [...s, { title: "", dialogue: "" }])}
              >
                + Add script
              </button>
            </div>
            <div className="space-y-2">
              {scripts.map((s, i) => (
                <div key={i} className="rounded-lg border border-champagne-dark/40 p-3 space-y-2">
                  <Input
                    placeholder="Script title"
                    value={s.title}
                    onChange={(e) => updateListItem(scripts, i, { ...s, title: e.target.value }, setScripts)}
                  />
                  <Textarea
                    placeholder="Dialogue"
                    value={s.dialogue}
                    onChange={(e) => updateListItem(scripts, i, { ...s, dialogue: e.target.value }, setScripts)}
                  />
                  <button
                    type="button"
                    className="text-xs text-danger"
                    onClick={() => setScripts(scripts.filter((_, idx) => idx !== i))}
                  >
                    Remove script
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-charcoal-800 mb-1.5">Compliance notes</p>
            <div className="space-y-2">
              {complianceNotes.map((c, i) => (
                <Textarea
                  key={i}
                  value={c}
                  onChange={(e) => updateListItem(complianceNotes, i, e.target.value, setComplianceNotes)}
                />
              ))}
            </div>
            <p className="text-xs text-charcoal-400 mt-1">
              Keep the standard compliance language unless your policy team has approved a change.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
