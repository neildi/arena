import { getDb } from "../db";
import { fromJson } from "../utils";

export function learnerDashboardData(userId: string) {
  const db = getDb();

  const continueLesson = db
    .prepare(
      `SELECT l.*, m.course_id, c.title as course_title, c.slug as course_slug
       FROM lesson_progress lp
       JOIN lessons l ON lp.lesson_id = l.id
       JOIN modules m ON l.module_id = m.id
       JOIN courses c ON m.course_id = c.id
       WHERE lp.user_id = ? AND lp.status = 'in_progress'
       ORDER BY lp.updated_at DESC LIMIT 1`
    )
    .get(userId) as any;

  const currentEnrollments = db
    .prepare(
      `SELECT ce.*, c.title, c.slug, c.estimated_minutes, c.skill_tags
       FROM course_enrollments ce JOIN courses c ON ce.course_id = c.id
       WHERE ce.user_id = ? AND ce.status = 'in_progress'
       ORDER BY ce.started_at DESC`
    )
    .all(userId) as any[];

  const recentQuizzes = db
    .prepare(
      `SELECT qa.*, q.title as quiz_title FROM quiz_attempts qa JOIN quizzes q ON qa.quiz_id = q.id
       WHERE qa.user_id = ? ORDER BY qa.completed_at DESC LIMIT 3`
    )
    .all(userId) as any[];

  const recentRoleplays = db
    .prepare(
      `SELECT rpa.*, s.title as scenario_title FROM role_play_attempts rpa
       JOIN role_play_scenarios s ON rpa.scenario_id = s.id
       WHERE rpa.user_id = ? ORDER BY rpa.created_at DESC LIMIT 3`
    )
    .all(userId) as any[];

  const upcomingTasks = db
    .prepare(
      `SELECT a.* FROM learner_assignments a
       WHERE a.user_id = ? AND a.archived_at IS NULL AND a.status != 'completed'
       ORDER BY a.due_date ASC LIMIT 5`
    )
    .all(userId) as any[];

  const latestBadge = db
    .prepare(
      `SELECT ub.*, b.title, b.description, b.level, b.icon FROM user_badges ub
       JOIN badges b ON ub.badge_id = b.id WHERE ub.user_id = ? ORDER BY ub.earned_at DESC LIMIT 1`
    )
    .get(userId) as any;

  const savedToolkitItems = db
    .prepare(
      `SELECT tf.*, tr.title, tr.category FROM toolkit_favorites tf
       JOIN toolkit_resources tr ON tf.resource_id = tr.id
       WHERE tf.user_id = ? ORDER BY tf.created_at DESC LIMIT 5`
    )
    .all(userId) as any[];

  // Skill readiness: average role-play criterion scores by skill mapping
  const attempts = db
    .prepare("SELECT scores FROM role_play_attempts WHERE user_id = ?")
    .all(userId) as any[];
  const skillTotals: Record<string, { sum: number; count: number }> = {};
  for (const a of attempts) {
    const scores = fromJson<Record<string, number>>(a.scores, {});
    for (const [key, val] of Object.entries(scores)) {
      skillTotals[key] = skillTotals[key] || { sum: 0, count: 0 };
      skillTotals[key].sum += val;
      skillTotals[key].count += 1;
    }
  }
  const skillReadiness = Object.entries(skillTotals).map(([key, v]) => ({
    skill: key,
    avgScore: Math.round((v.sum / v.count) * 10),
  }));

  const totalAssignments = db
    .prepare("SELECT COUNT(*) c FROM learner_assignments WHERE user_id = ? AND archived_at IS NULL")
    .get(userId) as any;
  const completedAssignments = db
    .prepare(
      "SELECT COUNT(*) c FROM learner_assignments WHERE user_id = ? AND archived_at IS NULL AND status = 'completed'"
    )
    .get(userId) as any;

  return {
    continueLesson,
    currentEnrollments,
    recentQuizzes,
    recentRoleplays,
    upcomingTasks,
    latestBadge,
    savedToolkitItems,
    skillReadiness,
    weeklyGoalProgress: {
      completed: completedAssignments.c,
      total: totalAssignments.c,
    },
  };
}

export function managerDashboardData(managerId: string, teamId: string | null) {
  const db = getDb();

  const teamMembers = teamId
    ? (db.prepare("SELECT * FROM users WHERE team_id = ? AND archived_at IS NULL").all(teamId) as any[])
    : [];
  const teamMemberIds = teamMembers.map((m) => m.id);

  const learnerProgress = teamMemberIds.length
    ? (db
        .prepare(
          `SELECT u.id, u.name, u.title,
            (SELECT COUNT(*) FROM course_enrollments WHERE user_id = u.id) as enrolled_courses,
            (SELECT COUNT(*) FROM course_enrollments WHERE user_id = u.id AND status = 'completed') as completed_courses,
            (SELECT AVG(CAST(score as FLOAT)/total) FROM quiz_attempts WHERE user_id = u.id) as avg_quiz_pct,
            (SELECT AVG(overall_score) FROM role_play_attempts WHERE user_id = u.id) as avg_roleplay_score,
            (SELECT COUNT(*) FROM floor_task_logs WHERE user_id = u.id AND status = 'completed') as completed_tasks
           FROM users u WHERE u.id IN (${teamMemberIds.map(() => "?").join(",")})`
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
       WHERE cn.manager_id = ? AND cn.archived_at IS NULL ORDER BY cn.created_at DESC LIMIT 8`
    )
    .all(managerId) as any[];

  const roleplayTrend = teamMemberIds.length
    ? (db
        .prepare(
          `SELECT rpa.overall_score, rpa.created_at, u.name as learner_name FROM role_play_attempts rpa
           JOIN users u ON rpa.user_id = u.id
           WHERE rpa.user_id IN (${teamMemberIds.map(() => "?").join(",")})
           ORDER BY rpa.created_at DESC LIMIT 10`
        )
        .all(...teamMemberIds) as any[])
    : [];

  const certifications = teamMemberIds.length
    ? (db
        .prepare(
          `SELECT c.*, u.name as learner_name FROM certificates c JOIN users u ON c.user_id = u.id
           WHERE c.user_id IN (${teamMemberIds.map(() => "?").join(",")}) AND c.archived_at IS NULL
           ORDER BY c.issued_at DESC`
        )
        .all(...teamMemberIds) as any[])
    : [];

  const overdueAssignments = teamMemberIds.length
    ? (db
        .prepare(
          `SELECT a.*, u.name as learner_name FROM learner_assignments a JOIN users u ON a.user_id = u.id
           WHERE a.user_id IN (${teamMemberIds.map(() => "?").join(",")}) AND a.archived_at IS NULL
             AND a.status != 'completed' AND a.due_date < date('now')
           ORDER BY a.due_date ASC`
        )
        .all(...teamMemberIds) as any[])
    : [];

  const upcomingAssignments = teamMemberIds.length
    ? (db
        .prepare(
          `SELECT a.*, u.name as learner_name FROM learner_assignments a JOIN users u ON a.user_id = u.id
           WHERE a.user_id IN (${teamMemberIds.map(() => "?").join(",")}) AND a.archived_at IS NULL
             AND a.status != 'completed' AND (a.due_date IS NULL OR a.due_date >= date('now'))
           ORDER BY a.due_date ASC LIMIT 6`
        )
        .all(...teamMemberIds) as any[])
    : [];

  return {
    teamMembers,
    learnerProgress,
    pendingVerifications,
    coachingNotes,
    roleplayTrend,
    certifications,
    overdueAssignments,
    upcomingAssignments,
  };
}
