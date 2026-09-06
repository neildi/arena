import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { listCourses } from "@/lib/repo/learning";
import { PathsClient } from "./paths-client";

export default async function PathsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const db = getDb();
  const paths = db
    .prepare("SELECT * FROM learning_paths WHERE archived_at IS NULL ORDER BY order_index")
    .all() as any[];
  const enrollments = db
    .prepare("SELECT path_id FROM path_enrollments WHERE user_id = ?")
    .all(user.id) as { path_id: string }[];
  const enrolledSet = new Set(enrollments.map((e) => e.path_id));

  const pathsWithCourses = paths.map((p) => ({
    ...p,
    courses: listCourses({ pathId: p.id }),
    enrolled: enrolledSet.has(p.id),
  }));

  return <PathsClient paths={pathsWithCourses} />;
}
