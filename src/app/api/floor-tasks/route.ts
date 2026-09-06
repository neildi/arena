import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId") || undefined;
  const db = getDb();
  const clauses = ["ft.archived_at IS NULL"];
  const params: any[] = [];
  if (courseId) {
    clauses.push("ft.course_id = ?");
    params.push(courseId);
  }
  const tasks = db
    .prepare(
      `SELECT ft.*, c.title as course_title,
        (SELECT status FROM floor_task_logs WHERE task_id = ft.id AND user_id = ? ORDER BY updated_at DESC LIMIT 1) as my_status,
        (SELECT id FROM floor_task_logs WHERE task_id = ft.id AND user_id = ? ORDER BY updated_at DESC LIMIT 1) as my_log_id
       FROM floor_tasks ft LEFT JOIN courses c ON ft.course_id = c.id
       WHERE ${clauses.join(" AND ")}
       ORDER BY ft.created_at`
    )
    .all(user.id, user.id, ...params);
  return NextResponse.json({ tasks });
}
