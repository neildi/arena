import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/ids";
import { now } from "@/lib/utils";

const STATUSES = [
  "not_started",
  "planned",
  "practiced",
  "used_with_client",
  "needs_manager_feedback",
  "completed",
] as const;

const schema = z.object({
  status: z.enum(STATUSES),
  reflectionNotes: z.string().optional().nullable(),
  evidence: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const { id: taskId } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input." }, { status: 400 });

  const db = getDb();
  const ts = now();
  const existing = db
    .prepare(
      "SELECT * FROM floor_task_logs WHERE task_id = ? AND user_id = ? ORDER BY updated_at DESC LIMIT 1"
    )
    .get(taskId, user.id) as any;

  let logId: string;
  if (existing) {
    logId = existing.id;
    db.prepare(
      `UPDATE floor_task_logs SET status = ?, reflection_notes = ?, evidence = ?, due_date = COALESCE(?, due_date), completed_at = ?, updated_at = ? WHERE id = ?`
    ).run(
      parsed.data.status,
      parsed.data.reflectionNotes ?? existing.reflection_notes,
      parsed.data.evidence ?? existing.evidence,
      parsed.data.dueDate ?? null,
      parsed.data.status === "completed" ? ts : existing.completed_at,
      ts,
      logId
    );
  } else {
    logId = newId("ftl");
    db.prepare(
      `INSERT INTO floor_task_logs (id, task_id, user_id, status, reflection_notes, evidence, due_date, completed_at, created_at, updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?)`
    ).run(
      logId,
      taskId,
      user.id,
      parsed.data.status,
      parsed.data.reflectionNotes ?? null,
      parsed.data.evidence ?? null,
      parsed.data.dueDate ?? null,
      parsed.data.status === "completed" ? ts : null,
      ts,
      ts
    );
  }

  if (parsed.data.status === "completed") {
    db.prepare(
      "INSERT INTO activity_log (id, user_id, activity_type, ref_id, summary, created_at) VALUES (?,?,?,?,?,?)"
    ).run(newId("act"), user.id, "task_completed", taskId, "Completed a floor-application task", ts);
  }

  const log = db.prepare("SELECT * FROM floor_task_logs WHERE id = ?").get(logId);
  return NextResponse.json({ log });
}
