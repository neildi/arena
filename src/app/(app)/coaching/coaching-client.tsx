"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Textarea, Select, Input } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { EmptyState } from "@/components/ui/empty-state";
import { Users, ShieldCheck, MessageSquareText, ClipboardList, AlertTriangle } from "lucide-react";

function pct(v: number | null) {
  if (v === null || v === undefined) return "—";
  return `${Math.round(v * 100)}%`;
}

export function CoachingClient({
  learnerProgress,
  pendingVerifications: initialVerifications,
  coachingNotes: initialNotes,
  observations,
  assignments,
  teamMembers,
  courses,
}: any) {
  const { showToast } = useToast();
  const [tab, setTab] = useState<"roster" | "verifications" | "notes" | "assignments">("roster");
  const [verifications, setVerifications] = useState(initialVerifications);
  const [notes, setNotes] = useState(initialNotes);

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteLearner, setNoteLearner] = useState("");
  const [noteSkill, setNoteSkill] = useState("");
  const [noteText, setNoteText] = useState("");
  const [noteVisibility, setNoteVisibility] = useState<"manager" | "shared_with_learner">("manager");
  const [savingNote, setSavingNote] = useState(false);

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignLearner, setAssignLearner] = useState("");
  const [assignCourse, setAssignCourse] = useState("");
  const [assignDue, setAssignDue] = useState("");
  const [savingAssign, setSavingAssign] = useState(false);

  async function verifyTask(logId: string) {
    const prev = verifications;
    setVerifications((v: any[]) => v.filter((x) => x.id !== logId));
    try {
      const res = await fetch(`/api/floor-task-logs/${logId}/verify`, { method: "POST" });
      if (!res.ok) throw new Error();
      showToast("Task verified.", "success");
    } catch {
      setVerifications(prev);
      showToast("Could not verify task.", "error");
    }
  }

  async function saveNote() {
    if (!noteLearner || !noteText.trim()) return;
    setSavingNote(true);
    try {
      const res = await fetch("/api/coaching-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          learnerId: noteLearner,
          skillArea: noteSkill,
          note: noteText,
          visibility: noteVisibility,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const learnerName = teamMembers.find((m: any) => m.id === noteLearner)?.name || "";
      setNotes((n: any[]) => [{ ...data.note, learner_name: learnerName }, ...n]);
      showToast("Coaching note saved.", "success");
      setNoteModalOpen(false);
      setNoteText("");
      setNoteSkill("");
    } catch {
      showToast("Could not save note.", "error");
    } finally {
      setSavingNote(false);
    }
  }

  async function saveAssignment() {
    if (!assignLearner || !assignCourse) return;
    setSavingAssign(true);
    try {
      const course = courses.find((c: any) => c.id === assignCourse);
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: assignLearner,
          assignmentType: "course",
          refId: assignCourse,
          title: course?.title || "Course assignment",
          dueDate: assignDue || null,
        }),
      });
      if (!res.ok) throw new Error();
      showToast("Assignment created.", "success");
      setAssignModalOpen(false);
      setAssignDue("");
    } catch {
      showToast("Could not create assignment.", "error");
    } finally {
      setSavingAssign(false);
    }
  }

  const TABS = [
    { id: "roster", label: "Roster", icon: Users },
    { id: "verifications", label: `Verifications${verifications.length ? ` (${verifications.length})` : ""}`, icon: ShieldCheck },
    { id: "notes", label: "Coaching Notes", icon: MessageSquareText },
    { id: "assignments", label: "Assignments", icon: ClipboardList },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-charcoal-900 mb-1">Team Coaching</h1>
          <p className="text-sm text-charcoal-500">Roster, verifications, coaching notes, and assignments.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setNoteModalOpen(true)}>
            Add coaching note
          </Button>
          <Button onClick={() => setAssignModalOpen(true)}>Create assignment</Button>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-champagne">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              tab === t.id
                ? "border-gold text-charcoal-900"
                : "border-transparent text-charcoal-500 hover:text-charcoal-800"
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "roster" &&
        (learnerProgress.length === 0 ? (
          <EmptyState icon={<Users className="h-6 w-6" />} title="No team members yet" description="Learners assigned to your team will appear here." />
        ) : (
          <Card>
            <CardBody className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-charcoal-500 border-b border-champagne">
                    <th className="py-3 px-4">Learner</th>
                    <th className="py-3 px-4">Courses</th>
                    <th className="py-3 px-4">Avg Quiz</th>
                    <th className="py-3 px-4">Avg Role-Play</th>
                    <th className="py-3 px-4">Tasks Done</th>
                    <th className="py-3 px-4">Certs</th>
                  </tr>
                </thead>
                <tbody>
                  {learnerProgress.map((l: any) => (
                    <tr key={l.id} className="border-b border-champagne/50 last:border-0">
                      <td className="py-3 px-4">
                        <p className="font-medium text-charcoal-900">{l.name}</p>
                        <p className="text-xs text-charcoal-500">{l.title}</p>
                      </td>
                      <td className="py-3 px-4 text-charcoal-700">
                        {l.completed_courses}/{l.enrolled_courses}
                      </td>
                      <td className="py-3 px-4 text-charcoal-700">{pct(l.avg_quiz_pct)}</td>
                      <td className="py-3 px-4 text-charcoal-700">
                        {l.avg_roleplay_score ? Math.round(l.avg_roleplay_score) : "—"}
                      </td>
                      <td className="py-3 px-4 text-charcoal-700">{l.completed_tasks}</td>
                      <td className="py-3 px-4 text-charcoal-700">{l.cert_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        ))}

      {tab === "verifications" &&
        (verifications.length === 0 ? (
          <EmptyState icon={<ShieldCheck className="h-6 w-6" />} title="No pending verifications" description="Great — you're all caught up." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {verifications.map((v: any) => (
              <Card key={v.id}>
                <CardBody>
                  <p className="text-xs text-charcoal-500 mb-1">{v.learner_name}</p>
                  <h3 className="font-medium text-charcoal-900 mb-1">{v.task_title}</h3>
                  <Pill tone="warning" className="mb-2">
                    {v.status.replace(/_/g, " ")}
                  </Pill>
                  {v.reflection_notes && (
                    <p className="text-sm text-charcoal-600 mb-3 line-clamp-3">"{v.reflection_notes}"</p>
                  )}
                  <Button size="sm" onClick={() => verifyTask(v.id)}>
                    <ShieldCheck className="h-4 w-4" /> Verify
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        ))}

      {tab === "notes" &&
        (notes.length === 0 ? (
          <EmptyState icon={<MessageSquareText className="h-6 w-6" />} title="No coaching notes yet" description="Add a note to start tracking learner development." />
        ) : (
          <div className="space-y-3">
            {notes.map((n: any) => (
              <Card key={n.id}>
                <CardBody>
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-charcoal-900 text-sm">{n.learner_name}</p>
                    <span className="text-xs text-charcoal-400">
                      {new Date(n.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {n.skill_area && <Pill tone="gold" className="mb-2">{n.skill_area}</Pill>}
                  <p className="text-sm text-charcoal-700">{n.note}</p>
                  {n.visibility === "shared_with_learner" && (
                    <p className="text-xs text-info mt-1">Shared with learner</p>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        ))}

      {tab === "assignments" &&
        (assignments.length === 0 ? (
          <EmptyState icon={<ClipboardList className="h-6 w-6" />} title="No assignments yet" description="Create an assignment to get started." />
        ) : (
          <Card>
            <CardBody className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-charcoal-500 border-b border-champagne">
                    <th className="py-3 px-4">Learner</th>
                    <th className="py-3 px-4">Assignment</th>
                    <th className="py-3 px-4">Due</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((a: any) => (
                    <tr key={a.id} className="border-b border-champagne/50 last:border-0">
                      <td className="py-3 px-4 text-charcoal-800">{a.learner_name}</td>
                      <td className="py-3 px-4 text-charcoal-700">{a.title}</td>
                      <td className="py-3 px-4 text-charcoal-500">
                        {a.due_date ? new Date(a.due_date).toLocaleDateString() : "—"}
                      </td>
                      <td className="py-3 px-4">
                        <Pill
                          tone={
                            a.status === "completed"
                              ? "success"
                              : a.status === "overdue"
                              ? "danger"
                              : "neutral"
                          }
                        >
                          {a.status.replace(/_/g, " ")}
                        </Pill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        ))}

      <Modal
        open={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        title="Add coaching note"
        footer={
          <>
            <Button variant="ghost" onClick={() => setNoteModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveNote} loading={savingNote} disabled={!noteLearner || !noteText.trim()}>
              Save note
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="note-learner" className="block text-sm font-medium text-charcoal-800 mb-1.5">
              Learner
            </label>
            <Select id="note-learner" value={noteLearner} onChange={(e) => setNoteLearner(e.target.value)}>
              <option value="">Select a learner…</option>
              {teamMembers.map((m: any) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label htmlFor="note-skill" className="block text-sm font-medium text-charcoal-800 mb-1.5">
              Skill area (optional)
            </label>
            <Input id="note-skill" value={noteSkill} onChange={(e) => setNoteSkill(e.target.value)} placeholder="e.g. Discovery questions" />
          </div>
          <div>
            <label htmlFor="note-text" className="block text-sm font-medium text-charcoal-800 mb-1.5">
              Note
            </label>
            <Textarea id="note-text" value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="What did you observe?" />
          </div>
          <div>
            <label htmlFor="note-visibility" className="block text-sm font-medium text-charcoal-800 mb-1.5">
              Visibility
            </label>
            <Select id="note-visibility" value={noteVisibility} onChange={(e) => setNoteVisibility(e.target.value as any)}>
              <option value="manager">Manager only</option>
              <option value="shared_with_learner">Shared with learner</option>
            </Select>
          </div>
        </div>
      </Modal>

      <Modal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Create assignment"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveAssignment} loading={savingAssign} disabled={!assignLearner || !assignCourse}>
              Create
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="assign-learner" className="block text-sm font-medium text-charcoal-800 mb-1.5">
              Learner
            </label>
            <Select id="assign-learner" value={assignLearner} onChange={(e) => setAssignLearner(e.target.value)}>
              <option value="">Select a learner…</option>
              {teamMembers.map((m: any) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label htmlFor="assign-course" className="block text-sm font-medium text-charcoal-800 mb-1.5">
              Course
            </label>
            <Select id="assign-course" value={assignCourse} onChange={(e) => setAssignCourse(e.target.value)}>
              <option value="">Select a course…</option>
              {courses.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label htmlFor="assign-due" className="block text-sm font-medium text-charcoal-800 mb-1.5">
              Due date (optional)
            </label>
            <Input id="assign-due" type="date" value={assignDue} onChange={(e) => setAssignDue(e.target.value)} />
          </div>
        </div>
      </Modal>

      {observations.length === 0 && tab === "roster" && (
        <p className="text-xs text-charcoal-400 flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5" /> No manager observations recorded yet.
        </p>
      )}
    </div>
  );
}
