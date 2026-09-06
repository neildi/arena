import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { getQuizWithQuestions } from "@/lib/repo/quizzes";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/ids";
import { now, toJson } from "@/lib/utils";

const schema = z.object({
  answers: z.record(z.string(), z.string()),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const { id: quizId } = await params;
  const quiz = getQuizWithQuestions(quizId);
  if (!quiz) return NextResponse.json({ error: "Quiz not found." }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid submission." }, { status: 400 });

  let score = 0;
  const results = quiz.questions.map((q: any) => {
    const given = parsed.data.answers[q.id];
    const isCorrect = given === q.correct_answer;
    if (isCorrect) score += 1;
    return {
      questionId: q.id,
      prompt: q.prompt,
      given: given ?? null,
      correct: q.correct_answer,
      isCorrect,
      explanation: q.explanation,
      skillTag: q.skill_tag,
    };
  });
  const total = quiz.questions.length;
  const passed = total > 0 && (score / total) * 100 >= (quiz.passing_score || 70);

  const db = getDb();
  const ts = now();
  const attemptId = newId("qa");
  db.prepare(
    `INSERT INTO quiz_attempts (id, quiz_id, user_id, score, total, answers, passed, started_at, completed_at)
     VALUES (?,?,?,?,?,?,?,?,?)`
  ).run(attemptId, quizId, user.id, score, total, toJson(parsed.data.answers), passed ? 1 : 0, ts, ts);

  db.prepare(
    "INSERT INTO activity_log (id, user_id, activity_type, ref_id, summary, created_at) VALUES (?,?,?,?,?,?)"
  ).run(newId("act"), user.id, "quiz_completed", quizId, `Scored ${score}/${total} on ${quiz.title}`, ts);

  return NextResponse.json({
    attemptId,
    score,
    total,
    passed,
    results,
  });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const { id: quizId } = await params;
  const db = getDb();
  const attempts = db
    .prepare("SELECT * FROM quiz_attempts WHERE quiz_id = ? AND user_id = ? ORDER BY completed_at DESC")
    .all(quizId, user.id);
  return NextResponse.json({ attempts });
}
