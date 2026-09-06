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
  if (user.role !== "admin") return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const db = getDb();
  const fields: Record<string, any> = {};
  if (body.name !== undefined) fields.name = body.name;
  if (body.locationType !== undefined) fields.location_type = body.locationType;
  if (body.city !== undefined) fields.city = body.city;
  if (body.region !== undefined) fields.region = body.region;
  const keys = Object.keys(fields);
  if (keys.length) {
    db.prepare(`UPDATE locations SET ${keys.map((k) => `${k} = ?`).join(", ")} WHERE id = ?`).run(
      ...keys.map((k) => fields[k]),
      id
    );
  }
  const location = db.prepare("SELECT * FROM locations WHERE id = ?").get(id);
  return NextResponse.json({ location });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  if (user.role !== "admin") return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  const { id } = await params;
  const db = getDb();
  db.prepare("UPDATE locations SET archived_at = ? WHERE id = ?").run(now(), id);
  return NextResponse.json({ ok: true });
}
