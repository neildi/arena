import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/ids";
import { now } from "@/lib/utils";

const schema = z.object({ content: z.string().min(1).max(4000) });

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
  if (!parsed.success) return NextResponse.json({ error: "Note cannot be empty." }, { status: 400 });
  const db = getDb();
  const ts = now();
  const id = newId("lnote");
  db.prepare(
    "INSERT INTO lesson_notes (id, user_id, lesson_id, content, created_at, updated_at) VALUES (?,?,?,?,?,?)"
  ).run(id, user.id, lessonId, parsed.data.content, ts, ts);
  const note = db.prepare("SELECT * FROM lesson_notes WHERE id = ?").get(id);
  return NextResponse.json({ note }, { status: 201 });
}
