import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const badges = db.prepare("SELECT * FROM badges WHERE archived_at IS NULL ORDER BY level, title").all();
  const user = await getCurrentUser();
  let earned: any[] = [];
  if (user) {
    earned = db
      .prepare(
        `SELECT ub.*, b.title, b.description, b.level, b.icon FROM user_badges ub
         JOIN badges b ON ub.badge_id = b.id WHERE ub.user_id = ? ORDER BY ub.earned_at DESC`
      )
      .all(user.id) as any[];
  }
  return NextResponse.json({ badges, earned });
}
