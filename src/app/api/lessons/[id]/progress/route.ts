import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/ids";
import { now } from "@/lib/utils";

const schema = z.object({
  status: z.enum(["not_started", "in_progress", "completed"]),
  progressPercent: z.number().min(0).max(100).default(0),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const { id: lessonId } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }
  const db = getDb();
  const ts = now();
  const existing = db
    .prepare("SELECT id FROM lesson_progress WHERE user_id = ? AND lesson_id = ?")
    .get(user.id, lessonId) as any;
  if (existing) {
    db.prepare(
      "UPDATE lesson_progress SET status = ?, progress_percent = ?, completed_at = ?, updated_at = ? WHERE id = ?"
    ).run(
      parsed.data.status,
      parsed.data.progressPercent,
      parsed.data.status === "completed" ? ts : null,
      ts,
      existing.id
    );
  } else {
    db.prepare(
      `INSERT INTO lesson_progress (id, user_id, lesson_id, status, progress_percent, completed_at, updated_at)
       VALUES (?,?,?,?,?,?,?)`
    ).run(
      newId("lp"),
      user.id,
      lessonId,
      parsed.data.status,
      parsed.data.progressPercent,
      parsed.data.status === "completed" ? ts : null,
      ts
    );
  }

  if (parsed.data.status === "completed") {
    db.prepare(
      "INSERT INTO activity_log (id, user_id, activity_type, ref_id, summary, created_at) VALUES (?,?,?,?,?,?)"
    ).run(newId("act"), user.id, "lesson_completed", lessonId, "Completed a lesson", ts);

    // update parent course enrollment progress
    const lesson = db.prepare("SELECT module_id FROM lessons WHERE id = ?").get(lessonId) as any;
    if (lesson) {
      const mod = db.prepare("SELECT course_id FROM modules WHERE id = ?").get(lesson.module_id) as any;
      if (mod) {
        const total = db
          .prepare(
            `SELECT COUNT(*) c FROM lessons l JOIN modules m ON l.module_id = m.id WHERE m.course_id = ? AND l.archived_at IS NULL`
          )
          .get(mod.course_id) as any;
        const completed = db
          .prepare(
            `SELECT COUNT(*) c FROM lesson_progress lp JOIN lessons l ON lp.lesson_id = l.id JOIN modules m ON l.module_id = m.id
             WHERE m.course_id = ? AND lp.user_id = ? AND lp.status = 'completed'`
          )
          .get(mod.course_id, user.id) as any;
        const pct = total.c > 0 ? Math.round((completed.c / total.c) * 100) : 0;
        const status = pct >= 100 ? "completed" : pct > 0 ? "in_progress" : "not_started";
        const enrollment = db
          .prepare("SELECT id FROM course_enrollments WHERE user_id = ? AND course_id = ?")
          .get(user.id, mod.course_id) as any;
        if (enrollment) {
          db.prepare(
            "UPDATE course_enrollments SET status = ?, progress_percent = ?, completed_at = ? WHERE id = ?"
          ).run(status, pct, status === "completed" ? ts : null, enrollment.id);
        } else {
          db.prepare(
            `INSERT INTO course_enrollments (id, user_id, course_id, status, progress_percent, started_at, completed_at)
             VALUES (?,?,?,?,?,?,?)`
          ).run(newId("enr"), user.id, mod.course_id, status, pct, ts, status === "completed" ? ts : null);
        }
      }
    }
  }

  const updated = db
    .prepare("SELECT * FROM lesson_progress WHERE user_id = ? AND lesson_id = ?")
    .get(user.id, lessonId);
  return NextResponse.json({ progress: updated });
}
