import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/ids";
import { now } from "@/lib/utils";

export async function GET(req: NextRequest) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const db = getDb();
  const clauses = ["a.archived_at IS NULL"];
  const params: any[] = [];
  if (["store_manager", "trainer", "district_leader", "admin"].includes(user.role) && userId) {
    clauses.push("a.user_id = ?");
    params.push(userId);
  } else if (["store_manager", "trainer", "district_leader", "admin"].includes(user.role) && !userId) {
    // manager sees assignments they created; broader roles could filter more later
    clauses.push("a.assigned_by = ?");
    params.push(user.id);
  } else {
    clauses.push("a.user_id = ?");
    params.push(user.id);
  }
  const assignments = db
    .prepare(
      `SELECT a.*, u.name as user_name FROM learner_assignments a JOIN users u ON a.user_id = u.id
       WHERE ${clauses.join(" AND ")} ORDER BY a.due_date ASC`
    )
    .all(...params);
  return NextResponse.json({ assignments });
}

const schema = z.object({
  userId: z.string(),
  assignmentType: z.enum(["course", "path", "task", "quiz", "roleplay"]),
  refId: z.string(),
  title: z.string().min(1),
  dueDate: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  if (!["store_manager", "trainer", "district_leader", "admin"].includes(user.role)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const db = getDb();
  const id = newId("asg");
  db.prepare(
    `INSERT INTO learner_assignments (id, user_id, assigned_by, assignment_type, ref_id, title, due_date, status, created_at)
     VALUES (?,?,?,?,?,?,?,?,?)`
  ).run(
    id,
    parsed.data.userId,
    user.id,
    parsed.data.assignmentType,
    parsed.data.refId,
    parsed.data.title,
    parsed.data.dueDate ?? null,
    "not_started",
    now()
  );
  const assignment = db.prepare("SELECT * FROM learner_assignments WHERE id = ?").get(id);
  return NextResponse.json({ assignment }, { status: 201 });
}
