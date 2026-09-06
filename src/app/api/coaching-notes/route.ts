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
  const learnerId = searchParams.get("learnerId") || undefined;
  const db = getDb();
  const clauses = ["cn.archived_at IS NULL"];
  const params: any[] = [];
  if (["store_manager", "trainer", "district_leader", "admin"].includes(user.role)) {
    if (learnerId) {
      clauses.push("cn.learner_id = ?");
      params.push(learnerId);
    } else if (user.role === "store_manager") {
      clauses.push("cn.manager_id = ?");
      params.push(user.id);
    }
  } else {
    clauses.push("cn.learner_id = ? AND cn.visibility = 'shared_with_learner'");
    params.push(user.id);
  }
  const notes = db
    .prepare(
      `SELECT cn.*, l.name as learner_name, m.name as manager_name
       FROM coaching_notes cn
       JOIN users l ON cn.learner_id = l.id
       JOIN users m ON cn.manager_id = m.id
       WHERE ${clauses.join(" AND ")}
       ORDER BY cn.created_at DESC`
    )
    .all(...params);
  return NextResponse.json({ notes });
}

const schema = z.object({
  learnerId: z.string(),
  skillArea: z.string().optional().default(""),
  note: z.string().min(1),
  visibility: z.enum(["manager", "shared_with_learner"]).default("manager"),
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
  const id = newId("note");
  db.prepare(
    "INSERT INTO coaching_notes (id, manager_id, learner_id, skill_area, note, visibility, created_at) VALUES (?,?,?,?,?,?,?)"
  ).run(id, user.id, parsed.data.learnerId, parsed.data.skillArea, parsed.data.note, parsed.data.visibility, now());
  const note = db.prepare("SELECT * FROM coaching_notes WHERE id = ?").get(id);
  return NextResponse.json({ note }, { status: 201 });
}
