"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@/components/ui/card";
import { Pill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Textarea, Select } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { EmptyState } from "@/components/ui/empty-state";
import {
  BookOpen,
  ClipboardCheck,
  MessagesSquare,
  Wrench,
  Megaphone,
  Archive,
  Plus,
  Trash2,
  Pencil,
} from "lucide-react";

const TABS = [
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "quizzes", label: "Quizzes", icon: ClipboardCheck },
  { id: "scenarios", label: "Role-Play", icon: MessagesSquare },
  { id: "toolkit", label: "Toolkit", icon: Wrench },
  { id: "announcements", label: "Announcements", icon: Megaphone },
] as const;

export function ContentStudioClient({
  courses: initialCourses,
  paths,
  quizzes,
  scenarios,
  toolkitResources,
  announcements: initialAnnouncements,
}: any) {
  const { showToast } = useToast();
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("courses");
  const [courses, setCourses] = useState(initialCourses);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);

  // New course modal
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPathId, setNewPathId] = useState("");
  const [newLevel, setNewLevel] = useState("foundations");
  const [savingCourse, setSavingCourse] = useState(false);

  // New announcement modal
  const [annModalOpen, setAnnModalOpen] = useState(false);
  const [annTitle, setAnnTitle] = useState("");
  const [annBody, setAnnBody] = useState("");
  const [annAudience, setAnnAudience] = useState("all");
  const [savingAnn, setSavingAnn] = useState(false);

  async function archiveCourse(id: string) {
    if (!confirm("Archive this course? Learners will no longer see it in the catalog.")) return;
    const prev = courses;
    setCourses((c: any[]) => c.filter((x) => x.id !== id));
    try {
      const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Course archived.", "success");
    } catch {
      setCourses(prev);
      showToast("Could not archive course.", "error");
    }
  }

  async function createCourse() {
    if (!newTitle.trim()) return;
    setSavingCourse(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          pathId: newPathId || null,
          level: newLevel,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCourses((c: any[]) => [{ ...data.course, module_count: 0, enrollment_count: 0 }, ...c]);
      showToast("Course created. Add modules and lessons to build it out.", "success");
      setCourseModalOpen(false);
      setNewTitle("");
      setNewDescription("");
      router.push(`/content-studio/courses/${data.course.id}`);
    } catch {
      showToast("Could not create course.", "error");
    } finally {
      setSavingCourse(false);
    }
  }

  async function createAnnouncement() {
    if (!annTitle.trim() || !annBody.trim()) return;
    setSavingAnn(true);
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: annTitle, body: annBody, audienceRole: annAudience }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAnnouncements((a: any[]) => [data.announcement, ...a]);
      showToast("Announcement published.", "success");
      setAnnModalOpen(false);
      setAnnTitle("");
      setAnnBody("");
    } catch {
      showToast("Could not publish announcement.", "error");
    } finally {
      setSavingAnn(false);
    }
  }

  async function archiveAnnouncement(id: string) {
    const prev = announcements;
    setAnnouncements((a: any[]) => a.filter((x) => x.id !== id));
    try {
      const res = await fetch(`/api/announcements/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Announcement archived.", "success");
    } catch {
      setAnnouncements(prev);
      showToast("Could not archive announcement.", "error");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-charcoal-900 mb-1">Content Studio</h1>
          <p className="text-sm text-charcoal-500">Manage courses, quizzes, role-play scenarios, toolkit resources, and announcements.</p>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-champagne">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              tab === t.id ? "border-gold text-charcoal-900" : "border-transparent text-charcoal-500 hover:text-charcoal-800"
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "courses" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setCourseModalOpen(true)}>
              <Plus className="h-4 w-4" /> New course
            </Button>
          </div>
          {courses.length === 0 ? (
            <EmptyState icon={<BookOpen className="h-6 w-6" />} title="No courses yet" description="Create your first course to get started." />
          ) : (
            <Card>
              <CardBody className="overflow-x-auto p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-charcoal-500 border-b border-champagne">
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Level</th>
                      <th className="py-3 px-4">Path</th>
                      <th className="py-3 px-4">Modules</th>
                      <th className="py-3 px-4">Enrolled</th>
                      <th className="py-3 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((c: any) => (
                      <tr key={c.id} className="border-b border-champagne/50 last:border-0">
                        <td className="py-3 px-4">
                          <Link
                            href={`/content-studio/courses/${c.id}`}
                            className="text-charcoal-900 font-medium hover:text-gold-dark"
                          >
                            {c.title}
                          </Link>
                        </td>
                        <td className="py-3 px-4">
                          <Pill tone="gold">{c.level}</Pill>
                        </td>
                        <td className="py-3 px-4 text-charcoal-600">{c.path_title || "—"}</td>
                        <td className="py-3 px-4 text-charcoal-600">{c.module_count}</td>
                        <td className="py-3 px-4 text-charcoal-600">{c.enrollment_count}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/content-studio/courses/${c.id}`}>
                              <Button size="sm" variant="outline">
                                <Pencil className="h-3.5 w-3.5" /> Edit
                              </Button>
                            </Link>
                            <Button size="sm" variant="ghost" onClick={() => archiveCourse(c.id)}>
                              <Archive className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          )}
        </div>
      )}

      {tab === "quizzes" &&
        (quizzes.length === 0 ? (
          <EmptyState icon={<ClipboardCheck className="h-6 w-6" />} title="No quizzes yet" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((q: any) => (
              <Card key={q.id}>
                <CardBody>
                  <p className="text-xs text-charcoal-500 mb-1">{q.course_title}</p>
                  <h3 className="font-medium text-charcoal-900 mb-2">{q.title}</h3>
                  <Pill tone="gold">{q.quiz_type?.replace(/_/g, " ")}</Pill>
                  <p className="text-xs text-charcoal-500 mt-2">{q.question_count} questions</p>
                </CardBody>
              </Card>
            ))}
          </div>
        ))}

      {tab === "scenarios" &&
        (scenarios.length === 0 ? (
          <EmptyState icon={<MessagesSquare className="h-6 w-6" />} title="No scenarios yet" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {scenarios.map((s: any) => (
              <Card key={s.id}>
                <CardBody>
                  <h3 className="font-medium text-charcoal-900 mb-1">{s.title}</h3>
                  <p className="text-xs text-charcoal-500 mb-2 line-clamp-2">{s.client_opening}</p>
                  <div className="flex gap-1.5">
                    <Pill tone="gold">{s.category}</Pill>
                    <Pill tone="neutral">{s.difficulty}</Pill>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ))}

      {tab === "toolkit" &&
        (toolkitResources.length === 0 ? (
          <EmptyState icon={<Wrench className="h-6 w-6" />} title="No toolkit resources yet" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {toolkitResources.map((r: any) => (
              <Card key={r.id}>
                <CardBody>
                  <h3 className="font-medium text-charcoal-900 mb-1">{r.title}</h3>
                  <p className="text-xs text-charcoal-500 mb-2 line-clamp-2">{r.summary}</p>
                  <Pill tone="gold">{r.category?.replace(/_/g, " ")}</Pill>
                </CardBody>
              </Card>
            ))}
          </div>
        ))}

      {tab === "announcements" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setAnnModalOpen(true)}>
              <Plus className="h-4 w-4" /> New announcement
            </Button>
          </div>
          {announcements.length === 0 ? (
            <EmptyState icon={<Megaphone className="h-6 w-6" />} title="No announcements yet" />
          ) : (
            <div className="space-y-3">
              {announcements.map((a: any) => (
                <Card key={a.id}>
                  <CardBody>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-charcoal-900">{a.title}</h3>
                          <Pill tone="gold">{a.audience_role}</Pill>
                        </div>
                        <p className="text-sm text-charcoal-600">{a.body}</p>
                        <p className="text-xs text-charcoal-400 mt-1">
                          {new Date(a.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => archiveAnnouncement(a.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <Modal
        open={courseModalOpen}
        onClose={() => setCourseModalOpen(false)}
        title="Create new course"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCourseModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createCourse} loading={savingCourse} disabled={!newTitle.trim()}>
              Create
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="course-title" className="block text-sm font-medium text-charcoal-800 mb-1.5">
              Title
            </label>
            <Input id="course-title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Bridal Consultation Essentials" />
          </div>
          <div>
            <label htmlFor="course-desc" className="block text-sm font-medium text-charcoal-800 mb-1.5">
              Description
            </label>
            <Textarea id="course-desc" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="course-path" className="block text-sm font-medium text-charcoal-800 mb-1.5">
                Learning path
              </label>
              <Select id="course-path" value={newPathId} onChange={(e) => setNewPathId(e.target.value)}>
                <option value="">None</option>
                {paths.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label htmlFor="course-level" className="block text-sm font-medium text-charcoal-800 mb-1.5">
                Level
              </label>
              <Select id="course-level" value={newLevel} onChange={(e) => setNewLevel(e.target.value)}>
                <option value="foundations">Foundations</option>
                <option value="specialist">Specialist</option>
                <option value="leadership">Leadership</option>
                <option value="trainer">Trainer</option>
              </Select>
            </div>
          </div>
          <p className="text-xs text-charcoal-500">
            After creating a course, you&apos;ll be taken to its editor to add modules and lessons.
          </p>
        </div>
      </Modal>

      <Modal
        open={annModalOpen}
        onClose={() => setAnnModalOpen(false)}
        title="New announcement"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAnnModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createAnnouncement} loading={savingAnn} disabled={!annTitle.trim() || !annBody.trim()}>
              Publish
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="ann-title" className="block text-sm font-medium text-charcoal-800 mb-1.5">
              Title
            </label>
            <Input id="ann-title" value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} />
          </div>
          <div>
            <label htmlFor="ann-body" className="block text-sm font-medium text-charcoal-800 mb-1.5">
              Message
            </label>
            <Textarea id="ann-body" value={annBody} onChange={(e) => setAnnBody(e.target.value)} />
          </div>
          <div>
            <label htmlFor="ann-audience" className="block text-sm font-medium text-charcoal-800 mb-1.5">
              Audience
            </label>
            <Select id="ann-audience" value={annAudience} onChange={(e) => setAnnAudience(e.target.value)}>
              <option value="all">Everyone</option>
              <option value="learner">Learners</option>
              <option value="store_manager">Store Managers</option>
              <option value="trainer">Trainers</option>
              <option value="district_leader">District Leaders</option>
            </Select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
