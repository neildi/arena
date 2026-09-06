import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/ids";
import { now } from "@/lib/utils";

export async function GET() {
  const db = getDb();
  const locations = db
    .prepare(
      `SELECT l.*, o.name as org_name FROM locations l LEFT JOIN organizations o ON l.org_id = o.id
       WHERE l.archived_at IS NULL ORDER BY l.name`
    )
    .all();
  return NextResponse.json({ locations });
}

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  if (user.role !== "admin") return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  if (!body.name || !body.locationType)
    return NextResponse.json({ error: "Name and location type are required." }, { status: 400 });
  const db = getDb();
  const id = newId("loc");
  db.prepare(
    "INSERT INTO locations (id, org_id, name, location_type, city, region, created_at) VALUES (?,?,?,?,?,?,?)"
  ).run(id, user.orgId, body.name, body.locationType, body.city ?? null, body.region ?? null, now());
  const location = db.prepare("SELECT * FROM locations WHERE id = ?").get(id);
  return NextResponse.json({ location }, { status: 201 });
}
