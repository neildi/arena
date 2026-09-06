import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/ids";
import { now, slugify, toJson } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(2),
  summary: z.string().optional().default(""),
  sections: z
    .array(z.object({ heading: z.string(), body: z.string() }))
    .optional()
    .default([]),
  keyTerms: z
    .array(z.object({ term: z.string(), definition: z.string() }))
    .optional()
    .default([]),
  clientLanguage: z.array(z.string()).optional().default([]),
  scripts: z
    .array(z.object({ title: z.string(), dialogue: z.string() }))
    .optional()
    .default([]),
  complianceNotes: z.array(z.string()).optional().default([]),
  estimatedMinutes: z.number().optional().default(10),
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
  const { id: moduleId } = await params;
  const db = getDb();
  const mod = db.prepare("SELECT id FROM modules WHERE id = ?").get(moduleId);
  if (!mod) return NextResponse.json({ error: "Module not found." }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });

  const maxOrder = db
    .prepare("SELECT MAX(order_index) m FROM lessons WHERE module_id = ?")
    .get(moduleId) as any;
  const id = newId("lsn");
  const ts = now();
  db.prepare(
    `INSERT INTO lessons (id, module_id, title, slug, summary, sections, key_terms, client_language, floor_tasks, scripts, compliance_notes, estimated_minutes, order_index, created_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
  ).run(
    id,
    moduleId,
    parsed.data.title,
    slugify(parsed.data.title) + "-" + id.slice(-4),
    parsed.data.summary,
    toJson(parsed.data.sections),
    toJson(parsed.data.keyTerms),
    toJson(parsed.data.clientLanguage),
    toJson([]),
    toJson(parsed.data.scripts),
    toJson(parsed.data.complianceNotes),
    parsed.data.estimatedMinutes,
    (maxOrder?.m ?? -1) + 1,
    ts
  );

  const lesson = db.prepare("SELECT * FROM lessons WHERE id = ?").get(id);
  return NextResponse.json({ lesson }, { status: 201 });
}
