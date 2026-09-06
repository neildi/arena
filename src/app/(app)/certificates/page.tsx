import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { fromJson } from "@/lib/utils";
import { CertificatesClient } from "./certificates-client";

export default async function CertificatesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const db = getDb();
  const certificates = db
    .prepare(
      `SELECT c.*, co.title as course_title FROM certificates c
       LEFT JOIN courses co ON c.course_id = co.id
       WHERE c.user_id = ? AND c.archived_at IS NULL
       ORDER BY c.issued_at DESC`
    )
    .all(user.id) as any[];

  const earnedBadges = db
    .prepare(
      `SELECT ub.*, b.title, b.description, b.level, b.icon, b.criteria FROM user_badges ub
       JOIN badges b ON ub.badge_id = b.id
       WHERE ub.user_id = ?
       ORDER BY ub.earned_at DESC`
    )
    .all(user.id)
    .map((b: any) => ({ ...b, criteria: fromJson(b.criteria, null) })) as any[];

  const allBadges = db
    .prepare("SELECT * FROM badges WHERE archived_at IS NULL ORDER BY title")
    .all() as any[];
  const earnedIds = new Set(earnedBadges.map((b: any) => b.badge_id));
  const lockedBadges = allBadges.filter((b) => !earnedIds.has(b.id));

  return (
    <CertificatesClient
      certificates={certificates}
      earnedBadges={earnedBadges}
      lockedBadges={lockedBadges}
    />
  );
}
