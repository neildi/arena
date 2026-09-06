import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { listCourses } from "@/lib/repo/learning";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/ids";
import { now, slugify, toJson } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pathId = searchParams.get("pathId") || undefined;
  const level = searchParams.get("level") || undefined;
  const search = searchParams.get("search") || undefined;
  const includeArchived = searchParams.get("includeArchived") === "true";
  const courses = listCourses({ pathId, level, search, includeArchived });
  return NextResponse.json({ courses });
}

const schema = z.object({
  title: z.string().min(2),
  description: z.string().optional().default(""),
  pathId: z.string().optional().nullable(),
  level: z.string().default("foundations"),
  estimatedMinutes: z.number().default(60),
  outcomes: z.array(z.string()).default([]),
  skillTags: z.array(z.string()).default([]),
  kpiAreas: z.array(z.string()).default([]),
});

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  if (!["trainer", "admin"].includes(user.role)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }
  const db = getDb();
  const id = newId("course");
  const ts = now();
  const maxOrder = db.prepare("SELECT MAX(order_index) m FROM courses").get() as any;
  db.prepare(
    `INSERT INTO courses (id, path_id, title, slug, description, outcomes, estimated_minutes, skill_tags, kpi_areas, level, order_index, created_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
  ).run(
    id,
    parsed.data.pathId || null,
    parsed.data.title,
    slugify(parsed.data.title) + "-" + id.slice(-4),
    parsed.data.description,
    toJson(parsed.data.outcomes),
    parsed.data.estimatedMinutes,
    toJson(parsed.data.skillTags),
    toJson(parsed.data.kpiAreas),
    parsed.data.level,
    (maxOrder?.m || 0) + 1,
    ts
  );
  const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(id);
  return NextResponse.json({ course }, { status: 201 });
}
