import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getCourseWithDetails, getUserCourseProgress } from "@/lib/repo/learning";
import { getDb } from "@/lib/db";
import { CourseClient } from "./course-client";

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const course = getCourseWithDetails(courseId);
  if (!course) notFound();

  const progress = getUserCourseProgress(user.id, courseId);

  const db = getDb();
  const lessonProgress = db
    .prepare(
      `SELECT lp.lesson_id, lp.status FROM lesson_progress lp
       JOIN lessons l ON lp.lesson_id = l.id JOIN modules m ON l.module_id = m.id
       WHERE m.course_id = ? AND lp.user_id = ?`
    )
    .all(courseId, user.id) as { lesson_id: string; status: string }[];
  const progressMap: Record<string, string> = {};
  lessonProgress.forEach((lp) => (progressMap[lp.lesson_id] = lp.status));

  const floorTasks = db
    .prepare("SELECT * FROM floor_tasks WHERE course_id = ? AND archived_at IS NULL")
    .all(courseId);

  return (
    <CourseClient
      course={course}
      progress={progress}
      lessonProgressMap={progressMap}
      floorTasks={floorTasks}
    />
  );
}
