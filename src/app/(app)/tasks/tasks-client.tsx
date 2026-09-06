"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Textarea, Select } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { EmptyState } from "@/components/ui/empty-state";
import { ListChecks, CheckCircle2, ShieldCheck } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "not_started", label: "Not started" },
  { value: "planned", label: "Planned" },
  { value: "practiced", label: "Practiced" },
  { value: "used_with_client", label: "Used with a client" },
  { value: "needs_manager_feedback", label: "Needs manager feedback" },
  { value: "completed", label: "Completed" },
];

const STATUS_TONE: Record<string, "neutral" | "warning" | "success" | "info"> = {
  not_started: "neutral",
  planned: "info",
  practiced: "info",
  used_with_client: "warning",
  needs_manager_feedback: "warning",
  completed: "success",
};

export function TasksClient({ tasks: initialTasks, assignments }: { tasks: any[]; assignments: any[] }) {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState<any>(null);
  const [status, setStatus] = useState("not_started");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  function openTask(task: any) {
    setActiveTask(task);
    setStatus(task.log_status || "not_started");
    setNotes(task.log_notes || "");
  }

  async function save() {
    if (!activeTask) return;
    setSaving(true);
    const prevTasks = tasks;
    setTasks((ts) =>
      ts.map((t) => (t.id === activeTask.id ? { ...t, log_status: status, log_notes: notes } : t))
    ); // optimistic
    try {
      const res = await fetch(`/api/floor-tasks/${activeTask.id}/logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reflectionNotes: notes }),
      });
      if (!res.ok) throw new Error();
      showToast("Task updated.", "success");
      setActiveTask(null);
    } catch {
      setTasks(prevTasks);
      showToast("Could not update task.", "error");
    } finally {
      setSaving(false);
    }
  }

  const grouped = {
    active: tasks.filter((t) => (t.log_status || "not_started") !== "completed"),
    completed: tasks.filter((t) => t.log_status === "completed"),
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-charcoal-900 mb-1">My Tasks</h1>
        <p className="text-sm text-charcoal-500">
          Apply what you&apos;re learning during real shifts and track your progress.
        </p>
      </div>

      {assignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>My Assignments</CardTitle>
          </CardHeader>
          <CardBody className="space-y-2">
            {assignments.map((a) => (
              <div key={a.id} className="flex items-center justify-between text-sm">
                <span className="text-charcoal-700">{a.title}</span>
                <div className="flex items-center gap-2">
                  {a.due_date && (
                    <span className="text-xs text-charcoal-500">
                      Due {new Date(a.due_date).toLocaleDateString()}
                    </span>
                  )}
                  <Pill tone={a.status === "completed" ? "success" : a.status === "overdue" ? "danger" : "neutral"}>
                    {a.status.replace(/_/g, " ")}
                  </Pill>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      <section>
        <h2 className="font-serif text-xl text-charcoal-900 mb-3 flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-gold-dark" /> Floor-Application Tasks
        </h2>
        {grouped.active.length === 0 ? (
          <EmptyState title="All tasks complete" description="Nice work — check back after your next lesson." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {grouped.active.map((t) => (
              <Card key={t.id}>
                <CardBody>
                  <p className="text-xs text-charcoal-500 mb-1">{t.course_title}</p>
                  <h3 className="font-medium text-charcoal-900 mb-2">{t.title}</h3>
                  <p className="text-sm text-charcoal-500 mb-3 line-clamp-2">{t.description}</p>
                  <div className="flex items-center justify-between">
                    <Pill tone={STATUS_TONE[t.log_status || "not_started"]}>
                      {(t.log_status || "not_started").replace(/_/g, " ")}
                    </Pill>
                    <Button size="sm" variant="outline" onClick={() => openTask(t)}>
                      Update
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>

      {grouped.completed.length > 0 && (
        <section>
          <h2 className="font-serif text-xl text-charcoal-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" /> Completed
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {grouped.completed.map((t) => (
              <Card key={t.id}>
                <CardBody>
                  <h3 className="font-medium text-charcoal-900 mb-1">{t.title}</h3>
                  <div className="flex items-center gap-2">
                    <Pill tone="success">Completed</Pill>
                    {t.verified_at && (
                      <Pill tone="info">
                        <ShieldCheck className="h-3 w-3" /> Manager verified
                      </Pill>
                    )}
                  </div>
                  <button
                    onClick={() => openTask(t)}
                    className="text-xs text-gold-dark mt-2 font-medium"
                  >
                    View / edit
                  </button>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
      )}

      <Modal
        open={!!activeTask}
        onClose={() => setActiveTask(null)}
        title={activeTask?.title ?? ""}
        footer={
          <>
            <Button variant="ghost" onClick={() => setActiveTask(null)}>
              Cancel
            </Button>
            <Button onClick={save} loading={saving}>
              Save
            </Button>
          </>
        }
      >
        {activeTask && (
          <div className="space-y-4">
            <p className="text-sm text-charcoal-600">{activeTask.description}</p>
            <div>
              <label htmlFor="task-status" className="block text-sm font-medium text-charcoal-800 mb-1.5">
                Status
              </label>
              <Select id="task-status" value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label htmlFor="task-notes" className="block text-sm font-medium text-charcoal-800 mb-1.5">
                Reflection notes (optional)
              </label>
              <Textarea
                id="task-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What did you try? How did the client respond?"
              />
            </div>
            {status === "needs_manager_feedback" && (
              <p className="text-xs text-charcoal-500">
                Your manager will be notified to review and verify this task in Team Coaching.
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
