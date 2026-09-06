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
  if (!["admin", "district_leader"].includes(user.role))
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const db = getDb();
  const fields: Record<string, any> = {};
  if (body.name !== undefined) fields.name = body.name;
  if (body.managerId !== undefined) fields.manager_id = body.managerId;
  if (body.locationId !== undefined) fields.location_id = body.locationId;
  const keys = Object.keys(fields);
  if (keys.length) {
    db.prepare(`UPDATE teams SET ${keys.map((k) => `${k} = ?`).join(", ")} WHERE id = ?`).run(
      ...keys.map((k) => fields[k]),
      id
    );
  }
  const team = db.prepare("SELECT * FROM teams WHERE id = ?").get(id);
  return NextResponse.json({ team });
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
  db.prepare("UPDATE teams SET archived_at = ? WHERE id = ?").run(now(), id);
  return NextResponse.json({ ok: true });
}
