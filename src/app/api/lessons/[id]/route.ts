import { NextRequest, NextResponse } from "next/server";
import { getLessonWithDetails } from "@/lib/repo/learning";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { now, toJson } from "@/lib/utils";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = getLessonWithDetails(id);
  if (!lesson) return NextResponse.json({ error: "Lesson not found." }, { status: 404 });

  let progress = null;
  let bookmarked = false;
  let notes: any[] = [];
  try {
    const user = await requireUser();
    const db = getDb();
    progress = db
      .prepare("SELECT * FROM lesson_progress WHERE user_id = ? AND lesson_id = ?")
      .get(user.id, id);
    bookmarked = !!db
      .prepare("SELECT id FROM lesson_bookmarks WHERE user_id = ? AND lesson_id = ?")
      .get(user.id, id);
    notes = db
      .prepare("SELECT * FROM lesson_notes WHERE user_id = ? AND lesson_id = ? ORDER BY updated_at DESC")
      .all(user.id, id) as any[];
  } catch {
    // not authenticated; return lesson content only
  }

  return NextResponse.json({ lesson, progress, bookmarked, notes });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  if (!["trainer", "admin"].includes(user.role)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const db = getDb();
  const fields: Record<string, any> = {};
  if (body.title) fields.title = body.title;
  if (body.summary !== undefined) fields.summary = body.summary;
  if (body.sections) fields.sections = toJson(body.sections);
  if (body.keyTerms) fields.key_terms = toJson(body.keyTerms);
  if (body.clientLanguage) fields.client_language = toJson(body.clientLanguage);
  if (body.scripts) fields.scripts = toJson(body.scripts);
  if (body.complianceNotes) fields.compliance_notes = toJson(body.complianceNotes);
  if (body.estimatedMinutes !== undefined) fields.estimated_minutes = body.estimatedMinutes;
  const keys = Object.keys(fields);
  if (keys.length) {
    db.prepare(`UPDATE lessons SET ${keys.map((k) => `${k} = ?`).join(", ")} WHERE id = ?`).run(
      ...keys.map((k) => fields[k]),
      id
    );
  }
  const lesson = getLessonWithDetails(id);
  return NextResponse.json({ lesson });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  if (!["trainer", "admin"].includes(user.role)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }
  const { id } = await params;
  const db = getDb();
  db.prepare("UPDATE lessons SET archived_at = ? WHERE id = ?").run(now(), id);
  return NextResponse.json({ ok: true });
}
