import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { TasksClient } from "./tasks-client";

export default async function TasksPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const db = getDb();
  const tasks = db
    .prepare(
      `SELECT ft.*, c.title as course_title,
        (SELECT id FROM floor_task_logs WHERE task_id = ft.id AND user_id = ? ORDER BY updated_at DESC LIMIT 1) as log_id,
        (SELECT status FROM floor_task_logs WHERE task_id = ft.id AND user_id = ? ORDER BY updated_at DESC LIMIT 1) as log_status,
        (SELECT reflection_notes FROM floor_task_logs WHERE task_id = ft.id AND user_id = ? ORDER BY updated_at DESC LIMIT 1) as log_notes,
        (SELECT manager_verified_at FROM floor_task_logs WHERE task_id = ft.id AND user_id = ? ORDER BY updated_at DESC LIMIT 1) as verified_at
       FROM floor_tasks ft LEFT JOIN courses c ON ft.course_id = c.id
       WHERE ft.archived_at IS NULL
       ORDER BY ft.created_at`
    )
    .all(user.id, user.id, user.id, user.id) as any[];

  const assignments = db
    .prepare(
      `SELECT * FROM learner_assignments WHERE user_id = ? AND archived_at IS NULL ORDER BY due_date ASC`
    )
    .all(user.id) as any[];

  return <TasksClient tasks={tasks} assignments={assignments} />;
}
