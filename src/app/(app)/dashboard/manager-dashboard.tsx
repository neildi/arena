import Link from "next/link";
import type { SessionUser } from "@/lib/auth";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Users, AlertCircle, CheckCircle2, ArrowRight, Award } from "lucide-react";

function pct(n: number | null) {
  if (n === null || n === undefined || isNaN(n)) return 0;
  return Math.round(n * 100);
}

export function ManagerDashboard({ user, data }: { user: SessionUser; data: any }) {
  const {
    teamMembers,
    learnerProgress,
    pendingVerifications,
    coachingNotes,
    roleplayTrend,
    certifications,
    overdueAssignments,
    upcomingAssignments,
  } = data;

  // Simple skill-gap heat map: bucket learners by avg quiz pct
  const heat = learnerProgress.map((l: any) => ({
    name: l.name,
    quizPct: pct(l.avg_quiz_pct),
    roleplay: Math.round(l.avg_roleplay_score || 0),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-charcoal-500">Store Manager</p>
          <h1 className="font-serif text-3xl text-charcoal-900">Team Overview</h1>
        </div>
        <Link href="/coaching">
          <span className="text-sm text-gold-dark font-medium inline-flex items-center gap-1">
            Go to Team Coaching <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardBody className="flex items-center gap-3">
            <Users className="h-8 w-8 text-gold-dark" />
            <div>
              <p className="text-2xl font-serif text-charcoal-900">{teamMembers.length}</p>
              <p className="text-xs text-charcoal-500">Team members</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-warning" />
            <div>
              <p className="text-2xl font-serif text-charcoal-900">{pendingVerifications.length}</p>
              <p className="text-xs text-charcoal-500">Pending verifications</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-success" />
            <div>
              <p className="text-2xl font-serif text-charcoal-900">{certifications.length}</p>
              <p className="text-xs text-charcoal-500">Team certificates</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-danger" />
            <div>
              <p className="text-2xl font-serif text-charcoal-900">{overdueAssignments.length}</p>
              <p className="text-xs text-charcoal-500">Overdue assignments</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Team Learning Progress</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
              <table className="w-full text-sm hidden sm:table">
                <thead>
                  <tr className="text-left text-xs text-charcoal-500 border-b border-champagne">
                    <th className="py-2 pr-4">Learner</th>
                    <th className="py-2 pr-4">Courses</th>
                    <th className="py-2 pr-4">Quiz Avg</th>
                    <th className="py-2 pr-4">Role-Play Avg</th>
                    <th className="py-2 pr-4">Tasks Done</th>
                  </tr>
                </thead>
                <tbody>
                  {learnerProgress.map((l: any) => (
                    <tr key={l.id} className="border-b border-champagne/50 last:border-0">
                      <td className="py-2 pr-4 text-charcoal-800">{l.name}</td>
                      <td className="py-2 pr-4">
                        {l.completed_courses}/{l.enrolled_courses}
                      </td>
                      <td className="py-2 pr-4">{pct(l.avg_quiz_pct)}%</td>
                      <td className="py-2 pr-4">{Math.round(l.avg_roleplay_score || 0)}</td>
                      <td className="py-2 pr-4">{l.completed_tasks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="sm:hidden space-y-3">
                {learnerProgress.map((l: any) => (
                  <div key={l.id} className="rounded-lg border border-champagne/60 p-3">
                    <p className="font-medium text-charcoal-800 text-sm mb-1">{l.name}</p>
                    <div className="grid grid-cols-2 gap-1 text-xs text-charcoal-500">
                      <span>Courses: {l.completed_courses}/{l.enrolled_courses}</span>
                      <span>Quiz avg: {pct(l.avg_quiz_pct)}%</span>
                      <span>Role-play: {Math.round(l.avg_roleplay_score || 0)}</span>
                      <span>Tasks done: {l.completed_tasks}</span>
                    </div>
                  </div>
                ))}
              </div>
              {learnerProgress.length === 0 && (
                <EmptyState title="No team members yet" description="Assign learners to your team to see progress here." />
              )}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skill-Gap Heat Map</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {heat.length === 0 ? (
              <EmptyState title="No data yet" description="Heat map populates as learners complete quizzes and role-plays." />
            ) : (
              heat.map((h: any) => (
                <div key={h.name} className="flex items-center gap-3">
                  <span className="text-sm text-charcoal-700 w-28 truncate">{h.name}</span>
                  <div className="flex-1 flex gap-1">
                    <div
                      className="h-6 rounded flex-1 flex items-center justify-center text-[10px] text-white font-medium"
                      style={{
                        backgroundColor: heatColor(h.quizPct),
                      }}
                      title={`Quiz avg ${h.quizPct}%`}
                    >
                      Q {h.quizPct}%
                    </div>
                    <div
                      className="h-6 rounded flex-1 flex items-center justify-center text-[10px] text-white font-medium"
                      style={{ backgroundColor: heatColor(h.roleplay) }}
                      title={`Role-play avg ${h.roleplay}`}
                    >
                      RP {h.roleplay}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Pending Manager Verifications</CardTitle>
          </CardHeader>
          <CardBody className="space-y-2">
            {pendingVerifications.length === 0 ? (
              <p className="text-sm text-charcoal-500">Nothing pending — great job staying current.</p>
            ) : (
              pendingVerifications.slice(0, 6).map((v: any) => (
                <div key={v.id} className="text-sm flex items-center justify-between">
                  <span className="text-charcoal-700 truncate pr-2">
                    {v.learner_name} — {v.task_title}
                  </span>
                  <Pill tone="warning">{v.status.replace(/_/g, " ")}</Pill>
                </div>
              ))
            )}
            <Link href="/coaching" className="text-xs text-gold-dark font-medium inline-flex items-center gap-1">
              Review in Team Coaching <ArrowRight className="h-3 w-3" />
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Coaching Notes</CardTitle>
          </CardHeader>
          <CardBody className="space-y-2">
            {coachingNotes.length === 0 ? (
              <p className="text-sm text-charcoal-500">No coaching notes recorded yet.</p>
            ) : (
              coachingNotes.slice(0, 4).map((n: any) => (
                <div key={n.id} className="text-sm">
                  <p className="text-charcoal-800 font-medium">{n.learner_name}</p>
                  <p className="text-charcoal-500 text-xs line-clamp-2">{n.note}</p>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-4 w-4 text-gold-dark" /> Team Certification Progress
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-2">
            {certifications.length === 0 ? (
              <p className="text-sm text-charcoal-500">No certificates issued yet.</p>
            ) : (
              certifications.slice(0, 5).map((c: any) => (
                <div key={c.id} className="text-sm flex items-center justify-between">
                  <span className="text-charcoal-700 truncate pr-2">
                    {c.learner_name} — {c.title}
                  </span>
                  <Pill tone={c.verification_status === "manager_verified" ? "success" : "gold"}>
                    {c.verification_status.replace(/_/g, " ")}
                  </Pill>
                </div>
              ))
            )}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Due Dates</CardTitle>
        </CardHeader>
        <CardBody className="space-y-2">
          {upcomingAssignments.length === 0 ? (
            <p className="text-sm text-charcoal-500">No upcoming due dates.</p>
          ) : (
            upcomingAssignments.map((a: any) => (
              <div key={a.id} className="flex items-center justify-between text-sm">
                <span className="text-charcoal-700">
                  {a.learner_name} — {a.title}
                </span>
                <span className="text-xs text-charcoal-500">
                  {a.due_date ? new Date(a.due_date).toLocaleDateString() : "No due date"}
                </span>
              </div>
            ))
          )}
        </CardBody>
      </Card>
    </div>
  );
}

function heatColor(pctVal: number) {
  if (pctVal >= 80) return "#2f7a4f";
  if (pctVal >= 60) return "#b6812c";
  return "#a13a3a";
}
