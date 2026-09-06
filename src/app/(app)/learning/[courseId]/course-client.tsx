"use client";

import Link from "next/link";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Clock, ClipboardCheck, ListChecks, Layers } from "lucide-react";

export function CourseClient({
  course,
  progress,
  lessonProgressMap,
  floorTasks,
}: {
  course: any;
  progress: any;
  lessonProgressMap: Record<string, string>;
  floorTasks: any[];
}) {
  const firstIncompleteLesson = course.modules
    .flatMap((m: any) => m.lessons)
    .find((l: any) => lessonProgressMap[l.id] !== "completed");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <Pill tone="gold" className="w-fit">
          {course.level}
        </Pill>
        <h1 className="font-serif text-3xl text-charcoal-900">{course.title}</h1>
        <p className="text-charcoal-600 max-w-2xl">{course.description}</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {course.skill_tags.map((t: string) => (
            <Pill key={t} tone="neutral">
              {t.replaceAll("_", " ")}
            </Pill>
          ))}
        </div>
      </div>

      <Card>
        <CardBody className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-1 text-sm text-charcoal-600">
              <Clock className="h-4 w-4" /> {course.estimated_minutes} min
            </div>
            <div className="flex-1 max-w-xs">
              <ProgressBar value={progress.progressPercent} />
              <p className="text-xs text-charcoal-500 mt-1">
                {progress.completedLessons}/{progress.totalLessons} lessons complete
              </p>
            </div>
          </div>
          {firstIncompleteLesson ? (
            <Link href={`/learning/lessons/${firstIncompleteLesson.id}`}>
              <Button>{progress.completedLessons > 0 ? "Resume course" : "Start course"}</Button>
            </Link>
          ) : (
            <Pill tone="success">Course complete</Pill>
          )}
        </CardBody>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-gold-dark" /> Course Outcomes
              </CardTitle>
            </CardHeader>
            <CardBody>
              <ul className="space-y-2">
                {course.outcomes.map((o: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-charcoal-700">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    {o}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          {course.modules.map((mod: any) => (
            <Card key={mod.id}>
              <CardHeader>
                <CardTitle>{mod.title}</CardTitle>
              </CardHeader>
              <CardBody className="p-0">
                <ul className="divide-y divide-champagne/60">
                  {mod.lessons.map((lesson: any) => {
                    const status = lessonProgressMap[lesson.id] || "not_started";
                    return (
                      <li key={lesson.id}>
                        <Link
                          href={`/learning/lessons/${lesson.id}`}
                          className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-ivory-100 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {status === "completed" ? (
                              <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                            ) : (
                              <Circle className="h-5 w-5 text-charcoal-300 shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-charcoal-800 truncate">{lesson.title}</p>
                              <p className="text-xs text-charcoal-500">{lesson.estimated_minutes} min</p>
                            </div>
                          </div>
                          <Pill tone={status === "completed" ? "success" : status === "in_progress" ? "warning" : "neutral"}>
                            {status.replace("_", " ")}
                          </Pill>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          {course.quiz && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4 text-gold-dark" /> Final Assessment
                </CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-charcoal-600 mb-3">{course.quiz.title}</p>
                <Link href={`/quizzes/${course.quiz.id}`}>
                  <Button variant="outline" className="w-full">
                    Take assessment
                  </Button>
                </Link>
              </CardBody>
            </Card>
          )}

          {course.flashcardDeck && (
            <Card>
              <CardHeader>
                <CardTitle>Flashcards</CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-charcoal-600 mb-3">Review key terms for this course.</p>
                <Link href={`/quizzes?deck=${course.flashcardDeck.id}`}>
                  <Button variant="outline" className="w-full">
                    Study flashcards
                  </Button>
                </Link>
              </CardBody>
            </Card>
          )}

          {floorTasks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-gold-dark" /> Practical Floor Assignments
                </CardTitle>
              </CardHeader>
              <CardBody className="space-y-2">
                {floorTasks.map((t: any) => (
                  <div key={t.id} className="text-sm text-charcoal-700 border-b border-champagne/50 last:border-0 pb-2 last:pb-0">
                    {t.title}
                  </div>
                ))}
                <Link href="/tasks" className="text-xs text-gold-dark font-medium">
                  Manage in My Tasks
                </Link>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
