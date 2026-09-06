import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { managerDashboardData } from "@/lib/repo/dashboard";
import { getDb } from "@/lib/db";
import { CoachingClient } from "./coaching-client";

const ELEVATED = ["store_manager", "trainer", "district_leader", "admin"];

export default async function CoachingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!ELEVATED.includes(user.role)) redirect("/dashboard");

  const db = getDb();

  // District leaders / admins / trainers without a team_id: show all learners in their org.
  let teamMemberIds: string[] = [];
  let teamMembers: any[] = [];

  if (user.teamId) {
    const data = managerDashboardData(user.id, user.teamId);
    teamMembers = data.teamMembers;
  } else if (user.orgId) {
    teamMembers = db
      .prepare(
        "SELECT * FROM users WHERE org_id = ? AND role = 'learner' AND archived_at IS NULL"
      )
      .all(user.orgId) as any[];
  }
  teamMemberIds = teamMembers.map((m) => m.id);

  const learnerProgress = teamMemberIds.length
    ? (db
        .prepare(
          `SELECT u.id, u.name, u.title, u.avatar_seed,
            (SELECT COUNT(*) FROM course_enrollments WHERE user_id = u.id) as enrolled_courses,
            (SELECT COUNT(*) FROM course_enrollments WHERE user_id = u.id AND status = 'completed') as completed_courses,
            (SELECT AVG(CAST(score as FLOAT)/total) FROM quiz_attempts WHERE user_id = u.id) as avg_quiz_pct,
            (SELECT AVG(overall_score) FROM role_play_attempts WHERE user_id = u.id) as avg_roleplay_score,
            (SELECT COUNT(*) FROM floor_task_logs WHERE user_id = u.id AND status = 'completed') as completed_tasks,
            (SELECT COUNT(*) FROM certificates WHERE user_id = u.id AND archived_at IS NULL) as cert_count
           FROM users u WHERE u.id IN (${teamMemberIds.map(() => "?").join(",")})
           ORDER BY u.name`
        )
        .all(...teamMemberIds) as any[])
    : [];

  const pendingVerifications = teamMemberIds.length
    ? (db
        .prepare(
          `SELECT ftl.*, u.name as learner_name, ft.title as task_title FROM floor_task_logs ftl
           JOIN users u ON ftl.user_id = u.id
           JOIN floor_tasks ft ON ftl.task_id = ft.id
           WHERE ftl.user_id IN (${teamMemberIds.map(() => "?").join(",")})
             AND ftl.status IN ('needs_manager_feedback','used_with_client','completed')
             AND ftl.manager_verified_at IS NULL
           ORDER BY ftl.updated_at DESC`
        )
        .all(...teamMemberIds) as any[])
    : [];

  const coachingNotes = db
    .prepare(
      `SELECT cn.*, l.name as learner_name FROM coaching_notes cn JOIN users l ON cn.learner_id = l.id
       WHERE cn.manager_id = ? AND cn.archived_at IS NULL ORDER BY cn.created_at DESC LIMIT 20`
    )
    .all(user.id) as any[];

  const observations = teamMemberIds.length
    ? (db
        .prepare(
          `SELECT mo.*, l.name as learner_name FROM manager_observations mo JOIN users l ON mo.learner_id = l.id
           WHERE mo.learner_id IN (${teamMemberIds.map(() => "?").join(",")}) AND mo.archived_at IS NULL
           ORDER BY mo.created_at DESC LIMIT 20`
        )
        .all(...teamMemberIds) as any[])
    : [];

  const assignments = teamMemberIds.length
    ? (db
        .prepare(
          `SELECT a.*, u.name as learner_name FROM learner_assignments a JOIN users u ON a.user_id = u.id
           WHERE a.user_id IN (${teamMemberIds.map(() => "?").join(",")}) AND a.archived_at IS NULL
           ORDER BY a.due_date ASC`
        )
        .all(...teamMemberIds) as any[])
    : [];

  const courses = db.prepare("SELECT id, title FROM courses WHERE archived_at IS NULL ORDER BY title").all();

  return (
    <CoachingClient
      learnerProgress={learnerProgress}
      pendingVerifications={pendingVerifications}
      coachingNotes={coachingNotes}
      observations={observations}
      assignments={assignments}
      teamMembers={teamMembers}
      courses={courses}
    />
  );
}
