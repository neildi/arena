import { getDb } from "../db";
import { fromJson } from "../utils";

export function getCourseWithDetails(courseId: string) {
  const db = getDb();
  const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(courseId) as any;
  if (!course) return null;
  const modules = db
    .prepare("SELECT * FROM modules WHERE course_id = ? AND archived_at IS NULL ORDER BY order_index")
    .all(courseId) as any[];
  const moduleIds = modules.map((m) => m.id);
  const lessons = moduleIds.length
    ? (db
        .prepare(
          `SELECT * FROM lessons WHERE module_id IN (${moduleIds.map(() => "?").join(",")}) AND archived_at IS NULL ORDER BY order_index`
        )
        .all(...moduleIds) as any[])
    : [];
  const lessonsByModule: Record<string, any[]> = {};
  for (const l of lessons) {
    lessonsByModule[l.module_id] = lessonsByModule[l.module_id] || [];
    lessonsByModule[l.module_id].push(l);
  }
  const quiz = db.prepare("SELECT * FROM quizzes WHERE course_id = ?").get(courseId) as any;
  const deck = db.prepare("SELECT * FROM flashcard_decks WHERE course_id = ?").get(courseId) as any;
  return {
    ...course,
    outcomes: fromJson(course.outcomes, []),
    skill_tags: fromJson(course.skill_tags, []),
    kpi_areas: fromJson(course.kpi_areas, []),
    modules: modules.map((m) => ({ ...m, lessons: lessonsByModule[m.id] || [] })),
    quiz,
    flashcardDeck: deck,
  };
}

export function listCourses(filters: { pathId?: string; level?: string; search?: string; includeArchived?: boolean } = {}) {
  const db = getDb();
  const clauses: string[] = [];
  const params: any[] = [];
  if (!filters.includeArchived) clauses.push("c.archived_at IS NULL");
  if (filters.pathId) {
    clauses.push("c.path_id = ?");
    params.push(filters.pathId);
  }
  if (filters.level) {
    clauses.push("c.level = ?");
    params.push(filters.level);
  }
  if (filters.search) {
    clauses.push("(c.title LIKE ? OR c.description LIKE ?)");
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const rows = db
    .prepare(
      `SELECT c.*, p.title as path_title, p.track as path_track
       FROM courses c LEFT JOIN learning_paths p ON c.path_id = p.id
       ${where} ORDER BY c.order_index`
    )
    .all(...params) as any[];
  return rows.map((r) => ({
    ...r,
    outcomes: fromJson(r.outcomes, []),
    skill_tags: fromJson(r.skill_tags, []),
    kpi_areas: fromJson(r.kpi_areas, []),
  }));
}

export function getLessonWithDetails(lessonId: string) {
  const db = getDb();
  const lesson = db.prepare("SELECT * FROM lessons WHERE id = ?").get(lessonId) as any;
  if (!lesson) return null;
  const mod = db.prepare("SELECT * FROM modules WHERE id = ?").get(lesson.module_id) as any;
  const course = mod ? (db.prepare("SELECT * FROM courses WHERE id = ?").get(mod.course_id) as any) : null;
  return {
    ...lesson,
    sections: fromJson(lesson.sections, []),
    key_terms: fromJson(lesson.key_terms, []),
    client_language: fromJson(lesson.client_language, []),
    floor_tasks: fromJson(lesson.floor_tasks, []),
    scripts: fromJson(lesson.scripts, []),
    compliance_notes: fromJson(lesson.compliance_notes, []),
    module: mod,
    course,
  };
}

export function getUserCourseProgress(userId: string, courseId: string) {
  const db = getDb();
  const enrollment = db
    .prepare("SELECT * FROM course_enrollments WHERE user_id = ? AND course_id = ?")
    .get(userId, courseId) as any;
  const totalLessons = db
    .prepare(
      `SELECT COUNT(*) c FROM lessons l JOIN modules m ON l.module_id = m.id WHERE m.course_id = ? AND l.archived_at IS NULL`
    )
    .get(courseId) as any;
  const completedLessons = db
    .prepare(
      `SELECT COUNT(*) c FROM lesson_progress lp
       JOIN lessons l ON lp.lesson_id = l.id
       JOIN modules m ON l.module_id = m.id
       WHERE m.course_id = ? AND lp.user_id = ? AND lp.status = 'completed'`
    )
    .get(courseId, userId) as any;
  const pct = totalLessons.c > 0 ? Math.round((completedLessons.c / totalLessons.c) * 100) : 0;
  return {
    enrollment,
    totalLessons: totalLessons.c,
    completedLessons: completedLessons.c,
    progressPercent: pct,
  };
}

export function listUserEnrollments(userId: string) {
  const db = getDb();
  return db
    .prepare(
      `SELECT ce.*, c.title, c.slug, c.estimated_minutes, c.level, c.skill_tags
       FROM course_enrollments ce JOIN courses c ON ce.course_id = c.id
       WHERE ce.user_id = ? ORDER BY ce.status = 'in_progress' DESC, ce.started_at DESC`
    )
    .all(userId) as any[];
}
