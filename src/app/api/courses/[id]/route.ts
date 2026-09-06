import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getCourseWithDetails } from "@/lib/repo/learning";
import { getDb } from "@/lib/db";
import { now, toJson } from "@/lib/utils";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = getCourseWithDetails(id);
  if (!course) return NextResponse.json({ error: "Course not found." }, { status: 404 });
  return NextResponse.json({ course });
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
  if (body.description !== undefined) fields.description = body.description;
  if (body.outcomes) fields.outcomes = toJson(body.outcomes);
  if (body.skillTags) fields.skill_tags = toJson(body.skillTags);
  if (body.kpiAreas) fields.kpi_areas = toJson(body.kpiAreas);
  if (body.estimatedMinutes) fields.estimated_minutes = body.estimatedMinutes;
  if (body.level) fields.level = body.level;
  const keys = Object.keys(fields);
  if (keys.length) {
    db.prepare(`UPDATE courses SET ${keys.map((k) => `${k} = ?`).join(", ")} WHERE id = ?`).run(
      ...keys.map((k) => fields[k]),
      id
    );
  }
  const course = getCourseWithDetails(id);
  return NextResponse.json({ course });
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
  db.prepare("UPDATE courses SET archived_at = ? WHERE id = ?").run(now(), id);
  return NextResponse.json({ ok: true });
}
