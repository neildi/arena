import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/ids";
import { now } from "@/lib/utils";

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  if (!body.pathId) return NextResponse.json({ error: "pathId is required." }, { status: 400 });
  const db = getDb();
  const existing = db
    .prepare("SELECT id FROM path_enrollments WHERE user_id = ? AND path_id = ?")
    .get(user.id, body.pathId);
  if (!existing) {
    db.prepare(
      "INSERT INTO path_enrollments (id, user_id, path_id, created_at) VALUES (?,?,?,?)"
    ).run(newId("penr"), user.id, body.pathId, now());
  }
  return NextResponse.json({ ok: true });
}
