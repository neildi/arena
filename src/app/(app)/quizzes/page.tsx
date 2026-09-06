import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { QuizzesClient } from "./quizzes-client";

export default async function QuizzesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const db = getDb();
  const quizzes = db
    .prepare(
      `SELECT q.*, c.title as course_title,
        (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = q.id AND archived_at IS NULL) as question_count
       FROM quizzes q LEFT JOIN courses c ON q.course_id = c.id
       WHERE q.archived_at IS NULL ORDER BY c.title`
    )
    .all() as any[];

  const attempts = db
    .prepare(
      `SELECT qa.*, q.title as quiz_title FROM quiz_attempts qa JOIN quizzes q ON qa.quiz_id = q.id
       WHERE qa.user_id = ? ORDER BY qa.completed_at DESC`
    )
    .all(user.id) as any[];

  const decks = db
    .prepare(
      `SELECT fd.*, c.title as course_title, (SELECT COUNT(*) FROM flashcards WHERE deck_id = fd.id) as card_count
       FROM flashcard_decks fd LEFT JOIN courses c ON fd.course_id = c.id
       WHERE fd.archived_at IS NULL`
    )
    .all() as any[];

  const bestByQuiz: Record<string, any> = {};
  for (const a of attempts) {
    if (!bestByQuiz[a.quiz_id] || a.score > bestByQuiz[a.quiz_id].score) {
      bestByQuiz[a.quiz_id] = a;
    }
  }

  return <QuizzesClient quizzes={quizzes} bestByQuiz={bestByQuiz} decks={decks} attempts={attempts} />;
}
