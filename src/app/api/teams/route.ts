import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/ids";
import { now } from "@/lib/utils";

export async function GET() {
  const db = getDb();
  const teams = db
    .prepare(
      `SELECT t.*, l.name as location_name, m.name as manager_name FROM teams t
       LEFT JOIN locations l ON t.location_id = l.id
       LEFT JOIN users m ON t.manager_id = m.id
       WHERE t.archived_at IS NULL ORDER BY t.name`
    )
    .all();
  return NextResponse.json({ teams });
}

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  if (!["admin", "district_leader"].includes(user.role))
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  if (!body.name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  const db = getDb();
  const id = newId("team");
  db.prepare(
    "INSERT INTO teams (id, org_id, location_id, name, manager_id, created_at) VALUES (?,?,?,?,?,?)"
  ).run(id, user.orgId, body.locationId ?? null, body.name, body.managerId ?? null, now());
  const team = db.prepare("SELECT * FROM teams WHERE id = ?").get(id);
  return NextResponse.json({ team }, { status: 201 });
}
