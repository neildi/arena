import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/ids";
import { now } from "@/lib/utils";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const { id: lessonId } = await params;
  const db = getDb();
  const existing = db
    .prepare("SELECT id FROM lesson_bookmarks WHERE user_id = ? AND lesson_id = ?")
    .get(user.id, lessonId) as any;
  if (existing) {
    db.prepare("DELETE FROM lesson_bookmarks WHERE id = ?").run(existing.id);
    return NextResponse.json({ bookmarked: false });
  }
  db.prepare(
    "INSERT INTO lesson_bookmarks (id, user_id, lesson_id, created_at) VALUES (?,?,?,?)"
  ).run(newId("lbm"), user.id, lessonId, now());
  return NextResponse.json({ bookmarked: true });
}
