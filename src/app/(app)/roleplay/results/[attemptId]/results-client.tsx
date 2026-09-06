"use client";

import Link from "next/link";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { CheckCircle2, AlertCircle, ArrowRight, User, Gem } from "lucide-react";

export function ResultsClient({ attempt, scenario, rubric, history }: any) {
  const scoreTone = attempt.overall_score >= 80 ? "success" : attempt.overall_score >= 60 ? "warning" : "danger";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <p className="text-xs uppercase tracking-wide text-gold-dark font-medium mb-1">Role-Play Complete</p>
        <h1 className="font-serif text-3xl text-charcoal-900">{scenario?.title}</h1>
      </div>

      <Card>
        <CardBody className="flex flex-col items-center py-8">
          <div className="relative h-32 w-32 rounded-full border-8 border-champagne flex items-center justify-center mb-3">
            <span className="font-serif text-4xl text-charcoal-900">{attempt.overall_score}</span>
          </div>
          <Pill tone={scoreTone}>
            {attempt.overall_score >= 80 ? "Strong performance" : attempt.overall_score >= 60 ? "Good progress" : "Needs practice"}
          </Pill>
        </CardBody>
      </Card>

      {rubric && (
        <Card>
          <CardHeader>
            <CardTitle>Rubric Breakdown</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {rubric.criteria.map((c: any) => {
              const raw = attempt.scores[c.key] ?? 0;
              const pct = Math.round((raw / 10) * 100);
              return (
                <div key={c.key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-charcoal-700">{c.label}</span>
                    <span className="text-xs text-charcoal-500">{raw}/10</span>
                  </div>
                  <ProgressBar value={pct} />
                </div>
              );
            })}
          </CardBody>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <CheckCircle2 className="h-4 w-4" /> Strengths
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-2">
            {attempt.strengths.map((s: string, i: number) => (
              <p key={i} className="text-sm text-charcoal-700">
                • {s}
              </p>
            ))}
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertCircle className="h-4 w-4" /> Improvement Opportunities
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-2">
            {attempt.improvements.map((s: string, i: number) => (
              <p key={i} className="text-sm text-charcoal-700">
                • {s}
              </p>
            ))}
          </CardBody>
        </Card>
      </div>

      <Card className="bg-champagne/30 border-gold/30">
        <CardBody>
          <p className="text-sm font-medium text-charcoal-900 mb-1">Recommended Next Practice</p>
          <p className="text-sm text-charcoal-700">{attempt.recommended_next}</p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conversation Transcript</CardTitle>
        </CardHeader>
        <CardBody className="space-y-3 max-h-96 overflow-y-auto">
          {attempt.transcript.map((turn: any, i: number) => (
            <div key={i} className={`flex gap-2 ${turn.role === "learner" ? "justify-end" : "justify-start"}`}>
              {turn.role === "client" && (
                <div className="h-6 w-6 rounded-full bg-champagne flex items-center justify-center shrink-0">
                  <User className="h-3.5 w-3.5 text-charcoal-700" />
                </div>
              )}
              <div
                className={`rounded-xl px-3 py-2 max-w-[80%] text-sm ${
                  turn.role === "learner" ? "bg-charcoal-900 text-ivory" : "bg-ivory-100 text-charcoal-800"
                }`}
              >
                {turn.text}
              </div>
              {turn.role === "learner" && (
                <div className="h-6 w-6 rounded-full bg-gold flex items-center justify-center shrink-0">
                  <Gem className="h-3.5 w-3.5 text-charcoal-900" />
                </div>
              )}
            </div>
          ))}
        </CardBody>
      </Card>

      {history.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Score History for This Scenario</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="flex gap-2 overflow-x-auto">
              {history.map((h: any) => (
                <div key={h.id} className="shrink-0 rounded-lg border border-champagne px-3 py-2 text-center">
                  <p className="text-lg font-serif text-charcoal-900">{h.overall_score}</p>
                  <p className="text-[10px] text-charcoal-500">{new Date(h.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      <div className="flex justify-center gap-3">
        <Link href="/roleplay">
          <Button variant="outline">Back to scenarios</Button>
        </Link>
        <Link href={`/roleplay/session/${attempt.scenario_id}`}>
          <Button>
            Practice again <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
