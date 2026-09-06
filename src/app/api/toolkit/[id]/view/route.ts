import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/ids";
import { now } from "@/lib/utils";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: true });
  const { id: resourceId } = await params;
  const db = getDb();
  db.prepare(
    "INSERT INTO toolkit_recent_views (id, user_id, resource_id, viewed_at) VALUES (?,?,?,?)"
  ).run(newId("view"), user.id, resourceId, now());
  return NextResponse.json({ ok: true });
}
