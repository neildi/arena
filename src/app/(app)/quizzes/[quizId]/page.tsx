import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getQuizWithQuestions } from "@/lib/repo/quizzes";
import { QuizTakeClient } from "./quiz-take-client";

export default async function QuizPage({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const quiz = getQuizWithQuestions(quizId);
  if (!quiz) notFound();

  const sanitized = {
    ...quiz,
    questions: quiz.questions.map((q: any) => ({
      id: q.id,
      question_type: q.question_type,
      prompt: q.prompt,
      options: q.options,
    })),
  };

  return <QuizTakeClient quiz={sanitized} />;
}
