import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getLessonWithDetails } from "@/lib/repo/learning";
import { getDb } from "@/lib/db";
import { LessonClient } from "./lesson-client";

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const lesson = getLessonWithDetails(lessonId);
  if (!lesson) notFound();

  const db = getDb();
  const progress = db
    .prepare("SELECT * FROM lesson_progress WHERE user_id = ? AND lesson_id = ?")
    .get(user.id, lessonId) as any;
  const bookmarked = !!db
    .prepare("SELECT id FROM lesson_bookmarks WHERE user_id = ? AND lesson_id = ?")
    .get(user.id, lessonId);
  const notes = db
    .prepare("SELECT * FROM lesson_notes WHERE user_id = ? AND lesson_id = ? ORDER BY updated_at DESC")
    .all(user.id, lessonId);

  // sibling lessons within course for prev/next nav
  const siblingLessons = lesson.module
    ? (db
        .prepare(
          `SELECT l.id, l.title, l.order_index, m.order_index as mod_order FROM lessons l
           JOIN modules m ON l.module_id = m.id
           WHERE m.course_id = ? AND l.archived_at IS NULL
           ORDER BY m.order_index, l.order_index`
        )
        .all(lesson.module.course_id) as any[])
    : [];
  const idx = siblingLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = idx > 0 ? siblingLessons[idx - 1] : null;
  const nextLesson = idx >= 0 && idx < siblingLessons.length - 1 ? siblingLessons[idx + 1] : null;

  const flashcardDeck = lesson.module
    ? (db.prepare("SELECT * FROM flashcard_decks WHERE lesson_id = ?").get(lessonId) as any)
    : null;

  return (
    <LessonClient
      lesson={lesson}
      progress={progress}
      bookmarked={bookmarked}
      notes={notes}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
      flashcardDeck={flashcardDeck}
    />
  );
}
