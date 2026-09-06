import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const cert = db
    .prepare(
      `SELECT c.*, u.name as user_name, co.title as course_title, b.title as badge_title
       FROM certificates c
       JOIN users u ON c.user_id = u.id
       LEFT JOIN courses co ON c.course_id = co.id
       LEFT JOIN badges b ON c.badge_id = b.id
       WHERE c.id = ? OR c.cert_uid = ?`
    )
    .get(id, id);
  if (!cert) return NextResponse.json({ error: "Certificate not found." }, { status: 404 });
  return NextResponse.json({ certificate: cert });
}
