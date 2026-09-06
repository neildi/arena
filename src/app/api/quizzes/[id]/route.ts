import { NextRequest, NextResponse } from "next/server";
import { getQuizWithQuestions } from "@/lib/repo/quizzes";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quiz = getQuizWithQuestions(id);
  if (!quiz) return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
  // Strip correct answers/explanations for the take-quiz view; client requests answers only after submit.
  const sanitized = {
    ...quiz,
    questions: quiz.questions.map((q: any) => ({
      id: q.id,
      question_type: q.question_type,
      prompt: q.prompt,
      options: q.options,
      order_index: q.order_index,
    })),
  };
  return NextResponse.json({ quiz: sanitized });
}
