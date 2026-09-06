import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { ContentStudioClient } from "./content-studio-client";

export default async function ContentStudioPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!["trainer", "admin"].includes(user.role)) redirect("/dashboard");

  const db = getDb();
  const courses = db
    .prepare(
      `SELECT c.*, lp.title as path_title,
        (SELECT COUNT(*) FROM modules WHERE course_id = c.id) as module_count,
        (SELECT COUNT(*) FROM course_enrollments WHERE course_id = c.id) as enrollment_count
       FROM courses c LEFT JOIN learning_paths lp ON c.path_id = lp.id
       WHERE c.archived_at IS NULL ORDER BY c.title`
    )
    .all() as any[];

  const paths = db
    .prepare("SELECT * FROM learning_paths WHERE archived_at IS NULL ORDER BY track, order_index")
    .all() as any[];

  const quizzes = db
    .prepare(
      `SELECT q.*, c.title as course_title, (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = q.id) as question_count
       FROM quizzes q LEFT JOIN courses c ON q.course_id = c.id
       WHERE q.archived_at IS NULL ORDER BY q.title`
    )
    .all() as any[];

  const scenarios = db
    .prepare("SELECT * FROM role_play_scenarios WHERE archived_at IS NULL ORDER BY title")
    .all() as any[];

  const toolkitResources = db
    .prepare("SELECT * FROM toolkit_resources WHERE archived_at IS NULL ORDER BY category, title")
    .all() as any[];

  const announcements = db
    .prepare("SELECT * FROM announcements WHERE archived_at IS NULL ORDER BY created_at DESC")
    .all() as any[];

  return (
    <ContentStudioClient
      courses={courses}
      paths={paths}
      quizzes={quizzes}
      scenarios={scenarios}
      toolkitResources={toolkitResources}
      announcements={announcements}
    />
  );
}
