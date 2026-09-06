import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/ids";
import { now } from "@/lib/utils";

export async function GET() {
  const db = getDb();
  const organizations = db.prepare("SELECT * FROM organizations WHERE archived_at IS NULL").all();
  return NextResponse.json({ organizations });
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
  if (!body.name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  const db = getDb();
  const id = newId("org");
  db.prepare("INSERT INTO organizations (id, name, description, created_at) VALUES (?,?,?,?)").run(
    id,
    body.name,
    body.description ?? null,
    now()
  );
  const org = db.prepare("SELECT * FROM organizations WHERE id = ?").get(id);
  return NextResponse.json({ organization: org }, { status: 201 });
}
