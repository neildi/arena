import Link from "next/link";
import type { SessionUser } from "@/lib/auth";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { EmptyState } from "@/components/ui/empty-state";
import {
  BookOpen,
  MessagesSquare,
  ClipboardCheck,
  ListChecks,
  Award,
  Star,
  ArrowRight,
  Bookmark,
} from "lucide-react";

function formatDate(d: string | null) {
  if (!d) return "No due date";
  return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function LearnerDashboard({ user, data }: { user: SessionUser; data: any }) {
  const {
    continueLesson,
    currentEnrollments,
    recentQuizzes,
    recentRoleplays,
    upcomingTasks,
    latestBadge,
    savedToolkitItems,
    skillReadiness,
    weeklyGoalProgress,
  } = data;

  const weeklyPct =
    weeklyGoalProgress.total > 0
      ? Math.round((weeklyGoalProgress.completed / weeklyGoalProgress.total) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-charcoal-500">Welcome back,</p>
        <h1 className="font-serif text-3xl text-charcoal-900">{user.name.split(" ")[0]}</h1>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Continue learning card */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-charcoal-900 to-charcoal-800 text-ivory border-none">
          <CardBody>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-wide text-gold">Continue Learning</p>
              <BookOpen className="h-5 w-5 text-gold" />
            </div>
            {continueLesson ? (
              <>
                <h2 className="font-serif text-xl mb-1">{continueLesson.title}</h2>
                <p className="text-sm text-champagne mb-4">{continueLesson.course_title}</p>
                <Link href={`/learning/lessons/${continueLesson.id}`}>
                  <Button variant="secondary">
                    Resume lesson <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm text-champagne mb-4">
                  You haven't started a lesson yet. Explore your learning paths to get going.
                </p>
                <Link href="/paths">
                  <Button variant="secondary">
                    Browse learning paths <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </CardBody>
        </Card>

        {/* Weekly goal */}
        <Card>
          <CardBody>
            <p className="text-xs uppercase tracking-wide text-gold-dark mb-2">Weekly Learning Goal</p>
            <p className="font-serif text-2xl text-charcoal-900 mb-2">
              {weeklyGoalProgress.completed}/{weeklyGoalProgress.total || 0} assignments
            </p>
            <ProgressBar value={weeklyPct} className="mb-3" />
            <p className="text-xs text-charcoal-500">
              Keep going — consistency builds real floor confidence.
            </p>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Current course progress */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Current Course Progress</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            {currentEnrollments.length === 0 ? (
              <EmptyState
                title="No active courses"
                description="Enroll in a learning path to get started."
                action={
                  <Link href="/paths">
                    <Button size="sm">Explore paths</Button>
                  </Link>
                }
              />
            ) : (
              currentEnrollments.map((c: any) => (
                <div key={c.id}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-charcoal-800">{c.title}</p>
                    <span className="text-xs text-charcoal-500">{c.progress_percent}%</span>
                  </div>
                  <ProgressBar value={c.progress_percent} />
                </div>
              ))
            )}
          </CardBody>
        </Card>

        {/* Skill readiness */}
        <Card>
          <CardHeader>
            <CardTitle>Skill-Readiness Breakdown</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {skillReadiness.length === 0 ? (
              <EmptyState
                icon={<MessagesSquare className="h-6 w-6" />}
                title="Practice a role-play"
                description="Your skill readiness builds from role-play practice scores."
                action={
                  <Link href="/roleplay">
                    <Button size="sm">Start practicing</Button>
                  </Link>
                }
              />
            ) : (
              skillReadiness.slice(0, 5).map((s: any) => (
                <div key={s.skill}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-charcoal-700 capitalize">
                      {s.skill.replaceAll("_", " ")}
                    </p>
                    <span className="text-xs text-charcoal-500">{s.avgScore}%</span>
                  </div>
                  <ProgressBar value={s.avgScore} />
                </div>
              ))
            )}
          </CardBody>
        </Card>

        {/* Upcoming floor tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Floor Tasks</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {upcomingTasks.length === 0 ? (
              <EmptyState
                icon={<ListChecks className="h-6 w-6" />}
                title="All caught up"
                description="No pending tasks right now."
              />
            ) : (
              upcomingTasks.map((t: any) => (
                <div key={t.id} className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm text-charcoal-800">{t.title}</p>
                    <p className="text-xs text-charcoal-500">{formatDate(t.due_date)}</p>
                  </div>
                  <Pill tone={t.status === "overdue" ? "danger" : "neutral"}>{t.status.replace("_", " ")}</Pill>
                </div>
              ))
            )}
            <Link href="/tasks" className="text-xs text-gold-dark font-medium inline-flex items-center gap-1">
              View all tasks <ArrowRight className="h-3 w-3" />
            </Link>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-gold-dark" /> Recent Quiz Results
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-2">
            {recentQuizzes.length === 0 ? (
              <p className="text-sm text-charcoal-500">No quizzes taken yet.</p>
            ) : (
              recentQuizzes.map((q: any) => (
                <div key={q.id} className="flex items-center justify-between text-sm">
                  <span className="text-charcoal-700 truncate pr-2">{q.quiz_title}</span>
                  <Pill tone={q.passed ? "success" : "warning"}>
                    {q.score}/{q.total}
                  </Pill>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessagesSquare className="h-4 w-4 text-gold-dark" /> Recent Role-Play Feedback
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-2">
            {recentRoleplays.length === 0 ? (
              <p className="text-sm text-charcoal-500">No role-plays completed yet.</p>
            ) : (
              recentRoleplays.map((r: any) => (
                <Link
                  key={r.id}
                  href={`/roleplay/results/${r.id}`}
                  className="flex items-center justify-between text-sm hover:underline"
                >
                  <span className="text-charcoal-700 truncate pr-2">{r.scenario_title}</span>
                  <Pill tone={r.overall_score >= 80 ? "success" : r.overall_score >= 60 ? "warning" : "danger"}>
                    {r.overall_score}
                  </Pill>
                </Link>
              ))
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-4 w-4 text-gold-dark" /> Latest Badge
            </CardTitle>
          </CardHeader>
          <CardBody>
            {latestBadge ? (
              <div>
                <p className="text-sm font-medium text-charcoal-900">{latestBadge.title}</p>
                <p className="text-xs text-charcoal-500 mt-1">{latestBadge.description}</p>
                <Pill tone="gold" className="mt-2">
                  {latestBadge.level.replaceAll("_", " ")}
                </Pill>
              </div>
            ) : (
              <p className="text-sm text-charcoal-500">Complete a course or role-play to earn your first badge.</p>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-gold-dark" /> Saved Toolkit Items
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-2">
            {savedToolkitItems.length === 0 ? (
              <p className="text-sm text-charcoal-500">Save toolkit resources for quick access.</p>
            ) : (
              savedToolkitItems.map((t: any) => (
                <div key={t.id} className="flex items-center gap-2 text-sm text-charcoal-700">
                  <Star className="h-3.5 w-3.5 text-gold" />
                  {t.title}
                </div>
              ))
            )}
            <Link href="/toolkit" className="text-xs text-gold-dark font-medium inline-flex items-center gap-1">
              Open toolkit <ArrowRight className="h-3 w-3" />
            </Link>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
