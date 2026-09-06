import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { now } from "@/lib/utils";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const db = getDb();
  const fields: Record<string, any> = {};
  if (body.status !== undefined) fields.status = body.status;
  if (body.dueDate !== undefined) fields.due_date = body.dueDate;
  if (body.title !== undefined) fields.title = body.title;
  const keys = Object.keys(fields);
  if (keys.length) {
    db.prepare(`UPDATE learner_assignments SET ${keys.map((k) => `${k} = ?`).join(", ")} WHERE id = ?`).run(
      ...keys.map((k) => fields[k]),
      id
    );
  }
  const assignment = db.prepare("SELECT * FROM learner_assignments WHERE id = ?").get(id);
  return NextResponse.json({ assignment });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  if (!["store_manager", "trainer", "district_leader", "admin"].includes(user.role)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }
  const { id } = await params;
  const db = getDb();
  db.prepare("UPDATE learner_assignments SET archived_at = ? WHERE id = ?").run(now(), id);
  return NextResponse.json({ ok: true });
}
