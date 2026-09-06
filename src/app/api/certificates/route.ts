import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { newId, certUid } from "@/lib/ids";
import { now } from "@/lib/utils";

export async function GET(req: NextRequest) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || user.id;
  // Learners can only see their own certs unless elevated role
  const targetUserId = ["store_manager", "trainer", "district_leader", "admin"].includes(user.role)
    ? userId
    : user.id;
  const db = getDb();
  const certs = db
    .prepare(
      `SELECT c.*, u.name as user_name, co.title as course_title, b.title as badge_title
       FROM certificates c
       JOIN users u ON c.user_id = u.id
       LEFT JOIN courses co ON c.course_id = co.id
       LEFT JOIN badges b ON c.badge_id = b.id
       WHERE c.user_id = ? AND c.archived_at IS NULL
       ORDER BY c.issued_at DESC`
    )
    .all(targetUserId);
  return NextResponse.json({ certificates: certs });
}

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const db = getDb();
  const id = newId("cert");
  const ts = now();
  db.prepare(
    `INSERT INTO certificates (id, cert_uid, user_id, course_id, badge_id, level, title, verification_status, issued_at)
     VALUES (?,?,?,?,?,?,?,?,?)`
  ).run(
    id,
    certUid(),
    user.id,
    body.courseId ?? null,
    body.badgeId ?? null,
    body.level ?? "course_completion",
    body.title ?? "Certificate",
    "issued",
    ts
  );
  db.prepare(
    "INSERT INTO activity_log (id, user_id, activity_type, ref_id, summary, created_at) VALUES (?,?,?,?,?,?)"
  ).run(newId("act"), user.id, "cert_issued", id, `Earned certificate: ${body.title ?? "Certificate"}`, ts);
  const cert = db.prepare("SELECT * FROM certificates WHERE id = ?").get(id);
  return NextResponse.json({ certificate: cert }, { status: 201 });
}
