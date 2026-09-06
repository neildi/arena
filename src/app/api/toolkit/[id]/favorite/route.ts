import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/ids";
import { now } from "@/lib/utils";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const { id: resourceId } = await params;
  const body = await req.json().catch(() => ({}));
  const db = getDb();
  const existing = db
    .prepare("SELECT id FROM toolkit_favorites WHERE user_id = ? AND resource_id = ?")
    .get(user.id, resourceId) as any;
  if (existing) {
    db.prepare("DELETE FROM toolkit_favorites WHERE id = ?").run(existing.id);
    return NextResponse.json({ favorited: false });
  }
  db.prepare(
    "INSERT INTO toolkit_favorites (id, user_id, resource_id, note, created_at) VALUES (?,?,?,?,?)"
  ).run(newId("fav"), user.id, resourceId, body.note ?? null, now());
  return NextResponse.json({ favorited: true });
}
