import { NextRequest, NextResponse } from "next/server";
import { listQuizzes } from "@/lib/repo/quizzes";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId") || undefined;
  const quizzes = listQuizzes({ courseId });
  const db = getDb();
  const withCourse = quizzes.map((q: any) => {
    const course = q.course_id
      ? db.prepare("SELECT title, slug, level FROM courses WHERE id = ?").get(q.course_id)
      : null;
    const questionCount = db
      .prepare("SELECT COUNT(*) c FROM quiz_questions WHERE quiz_id = ? AND archived_at IS NULL")
      .get(q.id) as any;
    return { ...q, course, questionCount: questionCount.c };
  });
  return NextResponse.json({ quizzes: withCourse });
}
