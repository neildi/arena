import { getDb } from "../db";
import { fromJson } from "../utils";

export function getQuizWithQuestions(quizId: string) {
  const db = getDb();
  const quiz = db.prepare("SELECT * FROM quizzes WHERE id = ?").get(quizId) as any;
  if (!quiz) return null;
  const questions = db
    .prepare("SELECT * FROM quiz_questions WHERE quiz_id = ? AND archived_at IS NULL ORDER BY order_index")
    .all(quizId) as any[];
  return {
    ...quiz,
    questions: questions.map((q) => ({
      ...q,
      options: fromJson(q.options, []),
      correct_answer: fromJson(q.correct_answer, null),
    })),
  };
}

export function listQuizzes(filters: { courseId?: string } = {}) {
  const db = getDb();
  const clauses = ["archived_at IS NULL"];
  const params: any[] = [];
  if (filters.courseId) {
    clauses.push("course_id = ?");
    params.push(filters.courseId);
  }
  return db
    .prepare(`SELECT * FROM quizzes WHERE ${clauses.join(" AND ")} ORDER BY created_at`)
    .all(...params) as any[];
}

export function listUserAttempts(userId: string) {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT qa.*, q.title as quiz_title, q.course_id
       FROM quiz_attempts qa JOIN quizzes q ON qa.quiz_id = q.id
       WHERE qa.user_id = ? ORDER BY qa.completed_at DESC`
    )
    .all(userId) as any[];
  return rows.map((r) => ({ ...r, answers: fromJson(r.answers, {}) }));
}

export function bestAttemptForQuiz(userId: string, quizId: string) {
  const db = getDb();
  return db
    .prepare(
      `SELECT * FROM quiz_attempts WHERE user_id = ? AND quiz_id = ? ORDER BY score DESC LIMIT 1`
    )
    .get(userId, quizId) as any;
}
