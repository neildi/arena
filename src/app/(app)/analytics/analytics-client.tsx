"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/field";
import {
  Users,
  BookOpen,
  Award,
  MessagesSquare,
  ListChecks,
  MessageSquareText,
  AlertTriangle,
  Download,
  Printer,
} from "lucide-react";
import { ROLE_LABELS } from "@/lib/roles";

const KPI_LABELS: Record<string, string> = {
  conversion: "Conversion Rate",
  average_ticket: "Average Ticket",
  units_per_transaction: "Units per Transaction (UPT)",
  client_book_growth: "Client Book Growth",
  appointment_conversion: "Appointment Conversion",
  bridal_conversion: "Bridal Conversion",
  band_attachment: "Band Attachment Rate",
  repeat_client_rate: "Repeat Client Rate",
  sales_vs_plan: "Sales vs. Plan",
  shrink: "Shrink",
  staff_turnover: "Staff Turnover",
  role_play_readiness: "Role-Play Readiness Score",
};

function Bar({ label, value, max, suffix = "%" }: { label: string; value: number; max: number; suffix?: string }) {
  const width = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs text-charcoal-600 mb-1">
        <span>{label}</span>
        <span className="font-medium text-charcoal-900">
          {value}
          {suffix}
        </span>
      </div>
      <div className="h-2 rounded-full bg-ivory-200 overflow-hidden">
        <div className="h-full bg-gold rounded-full" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export function AnalyticsClient({ kpiDefinitions }: { kpiDefinitions: any[] }) {
  const [data, setData] = useState<any>(null);
  const [teamId, setTeamId] = useState("");
  const [loading, setLoading] = useState(true);

  const kpiFormulaByKey: Record<string, { title: string; formula: string; unit: string }> = {};
  for (const def of kpiDefinitions) {
    kpiFormulaByKey[def.key] = { title: def.title, formula: def.formula, unit: def.unit };
  }

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- kicking off an async fetch, not mirroring props/state
    setLoading(true);
    const qs = teamId ? `?teamId=${teamId}` : "";
    fetch(`/api/analytics${qs}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [teamId]);

  if (loading && !data) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 bg-ivory-200 rounded animate-pulse" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-ivory-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const groupedKpis: Record<string, any[]> = {};
  for (const r of data.kpiRecords) {
    groupedKpis[r.kpi_key] = groupedKpis[r.kpi_key] || [];
    groupedKpis[r.kpi_key].push(r);
  }

  function downloadCsv(filename: string, rows: (string | number)[][]) {
    const csv = rows
      .map((row) =>
        row
          .map((cell) => {
            const value = String(cell ?? "");
            return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
          })
          .join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function exportSummaryCsv() {
    const rows: (string | number)[][] = [
      ["Metric", "Value"],
      ["Active learners", data.activeLearners],
      ["Course completions", `${data.courseCompletion.completed}/${data.courseCompletion.total}`],
      ["Avg quiz score (%)", data.avgQuizScorePct],
      ["Avg role-play score", data.avgRoleplayScore],
      ["Certificates earned", data.certsEarned],
      ["Floor tasks completed", `${data.taskCompletion.completed}/${data.taskCompletion.total}`],
      ["Coaching notes logged", data.managerCoachingActivity],
      [],
      ["Skill Gap", "Attempts", "Correctness %"],
      ...data.skillGaps.map((s: any) => [s.skillTag, s.attempts, s.correctnessPct]),
      [],
      ["Role", "Enrollments", "Completed"],
      ...data.engagementByRole.map((e: any) => [e.role, e.enrollments, e.completed]),
      [],
      ["Learning Path", "Track", "Enrolled Learners"],
      ...data.progressByPath.map((p: any) => [p.title, p.track, p.enrolled_learners]),
      [],
      ["Demo KPI (sample data, not live)", "Period", "Value", "Target"],
      ...data.kpiRecords.map((r: any) => [
        KPI_LABELS[r.kpi_key] || r.kpi_key,
        r.period,
        r.value,
        r.target ?? "",
      ]),
    ];
    downloadCsv(`aurelia-analytics-${new Date().toISOString().slice(0, 10)}.csv`, rows);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3 print:block">
        <div>
          <h1 className="font-serif text-3xl text-charcoal-900 mb-1">Analytics</h1>
          <p className="text-sm text-charcoal-500">Learning performance and readiness across the organization.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <Select value={teamId} onChange={(e) => setTeamId(e.target.value)} className="w-48">
            <option value="">All teams</option>
            {data.teams.map((t: any) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
          <Button variant="outline" onClick={exportSummaryCsv}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Print report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardBody className="flex items-center gap-3">
            <Users className="h-8 w-8 text-gold-dark" />
            <div>
              <p className="text-2xl font-serif text-charcoal-900">{data.activeLearners}</p>
              <p className="text-xs text-charcoal-500">Active learners</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-gold-dark" />
            <div>
              <p className="text-2xl font-serif text-charcoal-900">
                {data.courseCompletion.completed}/{data.courseCompletion.total}
              </p>
              <p className="text-xs text-charcoal-500">Course completions</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-3">
            <ListChecks className="h-8 w-8 text-gold-dark" />
            <div>
              <p className="text-2xl font-serif text-charcoal-900">{data.avgQuizScorePct}%</p>
              <p className="text-xs text-charcoal-500">Avg quiz score</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-3">
            <MessagesSquare className="h-8 w-8 text-gold-dark" />
            <div>
              <p className="text-2xl font-serif text-charcoal-900">{data.avgRoleplayScore}</p>
              <p className="text-xs text-charcoal-500">Avg role-play score</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-3">
            <Award className="h-8 w-8 text-gold-dark" />
            <div>
              <p className="text-2xl font-serif text-charcoal-900">{data.certsEarned}</p>
              <p className="text-xs text-charcoal-500">Certificates earned</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-3">
            <ListChecks className="h-8 w-8 text-gold-dark" />
            <div>
              <p className="text-2xl font-serif text-charcoal-900">
                {data.taskCompletion.completed}/{data.taskCompletion.total}
              </p>
              <p className="text-xs text-charcoal-500">Floor tasks completed</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-3">
            <MessageSquareText className="h-8 w-8 text-gold-dark" />
            <div>
              <p className="text-2xl font-serif text-charcoal-900">{data.managerCoachingActivity}</p>
              <p className="text-xs text-charcoal-500">Coaching notes logged</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Skill-Gap Trends</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {data.skillGaps.length === 0 ? (
              <p className="text-sm text-charcoal-500">Not enough quiz data yet.</p>
            ) : (
              data.skillGaps
                .sort((a: any, b: any) => a.correctnessPct - b.correctnessPct)
                .map((s: any) => (
                  <Bar key={s.skillTag} label={s.skillTag.replace(/_/g, " ")} value={s.correctnessPct} max={100} />
                ))
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement by Role</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {data.engagementByRole.map((e: any) => (
              <div key={e.role} className="flex items-center justify-between text-sm">
                <span className="text-charcoal-700">{ROLE_LABELS[e.role as keyof typeof ROLE_LABELS] || e.role}</span>
                <span className="text-charcoal-900 font-medium">
                  {e.completed}/{e.enrollments} completed
                </span>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progress by Learning Path</CardTitle>
          </CardHeader>
          <CardBody className="space-y-2">
            {data.progressByPath.length === 0 ? (
              <p className="text-sm text-charcoal-500">No path enrollments yet.</p>
            ) : (
              data.progressByPath.map((p: any) => (
                <div key={p.title} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-charcoal-800">{p.title}</span>
                    <Pill tone="gold" className="ml-2">
                      {p.track}
                    </Pill>
                  </div>
                  <span className="text-charcoal-900 font-medium">{p.enrolled_learners} enrolled</span>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Demo Store KPIs</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-xs text-charcoal-400 flex items-start gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              Sample / demo data only — not connected to any live POS or CRM system.
            </p>
            {Object.keys(groupedKpis).length === 0 ? (
              <p className="text-sm text-charcoal-500">No KPI records yet.</p>
            ) : (
              Object.entries(groupedKpis).map(([key, records]) => {
                const latest = records[records.length - 1];
                const def = kpiFormulaByKey[key];
                return (
                  <div key={key} className="border-b border-champagne/50 pb-2 last:border-0">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-charcoal-700">{KPI_LABELS[key] || key.replace(/_/g, " ")}</span>
                      <div className="text-right">
                        <span className="text-charcoal-900 font-medium">
                          {def?.unit === "$" ? `$${latest.value}` : latest.value}
                        </span>
                        {latest.target != null && (
                          <span className="text-xs text-charcoal-400 ml-1">/ target {latest.target}</span>
                        )}
                      </div>
                    </div>
                    {def?.formula && <p className="text-xs text-charcoal-400 mt-0.5">{def.formula}</p>}
                  </div>
                );
              })
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
