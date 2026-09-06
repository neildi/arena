import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  if (!["store_manager", "trainer", "district_leader", "admin"].includes(user.role)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get("teamId") || undefined;
  const kpiKey = searchParams.get("kpiKey") || undefined;

  const db = getDb();

  const activeLearners = db
    .prepare("SELECT COUNT(DISTINCT id) c FROM users WHERE role = 'learner' AND archived_at IS NULL")
    .get() as any;
  const courseCompletion = db
    .prepare(
      "SELECT COUNT(*) completed, (SELECT COUNT(*) FROM course_enrollments) total FROM course_enrollments WHERE status = 'completed'"
    )
    .get() as any;
  const avgQuizScore = db
    .prepare("SELECT AVG(CAST(score AS FLOAT) / total) avgPct FROM quiz_attempts WHERE total > 0")
    .get() as any;
  const avgRoleplayScore = db.prepare("SELECT AVG(overall_score) avgScore FROM role_play_attempts").get() as any;
  const certsEarned = db.prepare("SELECT COUNT(*) c FROM certificates WHERE archived_at IS NULL").get() as any;
  const taskCompletion = db
    .prepare(
      "SELECT SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) completed, COUNT(*) total FROM floor_task_logs"
    )
    .get() as any;
  const managerCoachingActivity = db
    .prepare("SELECT COUNT(*) c FROM coaching_notes WHERE archived_at IS NULL")
    .get() as any;

  const teams = db.prepare("SELECT id, name FROM teams WHERE archived_at IS NULL").all() as any[];

  const clauses = [];
  const params: any[] = [];
  if (teamId) {
    clauses.push("team_id = ?");
    params.push(teamId);
  }
  if (kpiKey) {
    clauses.push("kpi_key = ?");
    params.push(kpiKey);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const kpiRecords = db
    .prepare(
      `SELECT tkr.*, t.name as team_name FROM team_kpi_records tkr JOIN teams t ON tkr.team_id = t.id ${where} ORDER BY period`
    )
    .all(...params);

  // Course engagement by role
  const engagementByRole = db
    .prepare(
      `SELECT u.role, COUNT(ce.id) enrollments, SUM(CASE WHEN ce.status = 'completed' THEN 1 ELSE 0 END) completed
       FROM course_enrollments ce JOIN users u ON ce.user_id = u.id GROUP BY u.role`
    )
    .all();

  // Progress by career pathway
  const progressByPath = db
    .prepare(
      `SELECT lp.title, lp.track, COUNT(DISTINCT pe.user_id) enrolled_learners
       FROM path_enrollments pe JOIN learning_paths lp ON pe.path_id = lp.id
       GROUP BY lp.id`
    )
    .all();

  // Skill gap trends: correctness rate by skill tag, derived from stored quiz attempts.
  const allAttempts = db
    .prepare("SELECT quiz_id, answers FROM quiz_attempts")
    .all() as { quiz_id: string; answers: string }[];
  const questionsByQuiz = new Map<string, any[]>();
  const skillTally: Record<string, { correct: number; total: number }> = {};
  for (const attempt of allAttempts) {
    let questions = questionsByQuiz.get(attempt.quiz_id);
    if (!questions) {
      questions = db
        .prepare("SELECT id, skill_tag, correct_answer FROM quiz_questions WHERE quiz_id = ?")
        .all(attempt.quiz_id) as any[];
      questionsByQuiz.set(attempt.quiz_id, questions);
    }
    let answers: Record<string, string> = {};
    try {
      answers = JSON.parse(attempt.answers || "{}");
    } catch {
      answers = {};
    }
    for (const q of questions) {
      const tag = q.skill_tag || "general";
      skillTally[tag] = skillTally[tag] || { correct: 0, total: 0 };
      skillTally[tag].total += 1;
      let correctAnswer = q.correct_answer;
      try {
        correctAnswer = JSON.parse(q.correct_answer);
      } catch {
        // keep raw
      }
      if (answers[q.id] === correctAnswer) {
        skillTally[tag].correct += 1;
      }
    }
  }
  const skillGaps = Object.entries(skillTally).map(([skillTag, v]) => ({
    skillTag,
    attempts: v.total,
    correctnessPct: v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0,
  }));

  return NextResponse.json({
    activeLearners: activeLearners.c,
    courseCompletion,
    avgQuizScorePct: Math.round((avgQuizScore.avgPct || 0) * 100),
    avgRoleplayScore: Math.round(avgRoleplayScore.avgScore || 0),
    certsEarned: certsEarned.c,
    taskCompletion,
    managerCoachingActivity: managerCoachingActivity.c,
    teams,
    kpiRecords,
    engagementByRole,
    progressByPath,
    skillGaps,
  });
}
