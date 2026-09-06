import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/ids";
import { now } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(2),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  if (!["trainer", "admin"].includes(user.role)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }
  const { id: courseId } = await params;
  const db = getDb();
  const course = db.prepare("SELECT id FROM courses WHERE id = ?").get(courseId);
  if (!course) return NextResponse.json({ error: "Course not found." }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });

  const maxOrder = db
    .prepare("SELECT MAX(order_index) m FROM modules WHERE course_id = ?")
    .get(courseId) as any;
  const id = newId("mod");
  const ts = now();
  db.prepare(
    "INSERT INTO modules (id, course_id, title, order_index, created_at) VALUES (?,?,?,?,?)"
  ).run(id, courseId, parsed.data.title, (maxOrder?.m ?? -1) + 1, ts);

  const module_ = db.prepare("SELECT * FROM modules WHERE id = ?").get(id);
  return NextResponse.json({ module: module_ }, { status: 201 });
}
