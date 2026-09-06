import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/ids";
import { now } from "@/lib/utils";

export async function GET() {
  const db = getDb();
  const announcements = db
    .prepare("SELECT * FROM announcements WHERE archived_at IS NULL ORDER BY created_at DESC")
    .all();
  return NextResponse.json({ announcements });
}

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  if (!["trainer", "admin", "store_manager", "district_leader"].includes(user.role))
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  if (!body.title || !body.body) return NextResponse.json({ error: "Title and body are required." }, { status: 400 });
  const db = getDb();
  const id = newId("ann");
  db.prepare(
    "INSERT INTO announcements (id, org_id, title, body, audience_role, created_at) VALUES (?,?,?,?,?,?)"
  ).run(id, user.orgId, body.title, body.body, body.audienceRole ?? "all", now());
  const announcement = db.prepare("SELECT * FROM announcements WHERE id = ?").get(id);
  return NextResponse.json({ announcement }, { status: 201 });
}
