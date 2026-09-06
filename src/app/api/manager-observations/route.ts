import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/ids";
import { now, toJson } from "@/lib/utils";

export async function GET(req: NextRequest) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const learnerId = searchParams.get("learnerId") || undefined;
  const db = getDb();
  const clauses = ["mo.archived_at IS NULL"];
  const params: any[] = [];
  if (learnerId) {
    clauses.push("mo.learner_id = ?");
    params.push(learnerId);
  } else if (!["store_manager", "trainer", "district_leader", "admin"].includes(user.role)) {
    clauses.push("mo.learner_id = ?");
    params.push(user.id);
  }
  const observations = db
    .prepare(
      `SELECT mo.*, l.name as learner_name, m.name as manager_name FROM manager_observations mo
       JOIN users l ON mo.learner_id = l.id JOIN users m ON mo.manager_id = m.id
       WHERE ${clauses.join(" AND ")} ORDER BY mo.created_at DESC`
    )
    .all(...params);
  return NextResponse.json({ observations });
}

const schema = z.object({
  learnerId: z.string(),
  skill: z.string().min(1),
  score: z.number().min(0).max(100).optional().nullable(),
  notes: z.string().optional().default(""),
  verified: z.boolean().default(false),
  relatedTaskId: z.string().optional().nullable(),
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
  const id = newId("obs");
  db.prepare(
    `INSERT INTO manager_observations (id, manager_id, learner_id, skill, rubric, score, notes, verified, related_task_id, created_at)
     VALUES (?,?,?,?,?,?,?,?,?,?)`
  ).run(
    id,
    user.id,
    parsed.data.learnerId,
    parsed.data.skill,
    toJson({}),
    parsed.data.score ?? null,
    parsed.data.notes,
    parsed.data.verified ? 1 : 0,
    parsed.data.relatedTaskId ?? null,
    now()
  );
  const observation = db.prepare("SELECT * FROM manager_observations WHERE id = ?").get(id);
  return NextResponse.json({ observation }, { status: 201 });
}
