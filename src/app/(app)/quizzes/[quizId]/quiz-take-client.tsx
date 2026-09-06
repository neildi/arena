"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { CheckCircle2, XCircle, ArrowLeft, RotateCw } from "lucide-react";

export function QuizTakeClient({ quiz }: { quiz: any }) {
  const { showToast } = useToast();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const allAnswered = quiz.questions.every((q: any) => answers[q.id]);

  async function submit() {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/quizzes/${quiz.id}/attempts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
      showToast(data.passed ? "Great work — you passed!" : "Keep practicing — review the explanations below.", data.passed ? "success" : "info");
    } catch {
      showToast("Could not submit quiz. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  function retake() {
    setAnswers({});
    setResult(null);
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide text-gold-dark font-medium mb-1">Quiz Complete</p>
          <h1 className="font-serif text-3xl text-charcoal-900">{quiz.title}</h1>
          <p className="font-serif text-5xl text-charcoal-900 mt-4">
            {result.score}/{result.total}
          </p>
          <Pill tone={result.passed ? "success" : "danger"} className="mt-2">
            {result.passed ? "Passed" : "Not passed — retake anytime"}
          </Pill>
        </div>

        <div className="space-y-3">
          {result.results.map((r: any, i: number) => (
            <Card key={r.questionId}>
              <CardBody>
                <div className="flex items-start gap-2 mb-2">
                  {r.isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm font-medium text-charcoal-900">
                    {i + 1}. {r.prompt}
                  </p>
                </div>
                <p className="text-xs text-charcoal-500 ml-7">
                  Your answer: {r.given ?? "No answer"} {!r.isCorrect && `· Correct: ${r.correct}`}
                </p>
                <p className="text-sm text-charcoal-700 ml-7 mt-1">{r.explanation}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="flex justify-center gap-3">
          <Link href="/quizzes">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4" /> Back to quizzes
            </Button>
          </Link>
          <Button onClick={retake}>
            <RotateCw className="h-4 w-4" /> Retake quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/quizzes" className="text-sm text-charcoal-500 inline-flex items-center gap-1 mb-2">
          <ArrowLeft className="h-4 w-4" /> Back to quizzes
        </Link>
        <h1 className="font-serif text-2xl text-charcoal-900">{quiz.title}</h1>
        <p className="text-sm text-charcoal-500">{quiz.questions.length} questions</p>
      </div>

      <div className="space-y-4">
        {quiz.questions.map((q: any, i: number) => (
          <Card key={q.id}>
            <CardHeader>
              <CardTitle className="text-base">
                {i + 1}. {q.prompt}
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-2">
              {(q.options?.length ? q.options : ["True", "False"]).map((opt: string) => (
                <label
                  key={opt}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                    answers[q.id] === opt
                      ? "border-gold bg-champagne/30"
                      : "border-champagne-dark/40 hover:bg-ivory-100"
                  }`}
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                    className="accent-gold"
                  />
                  {opt}
                </label>
              ))}
            </CardBody>
          </Card>
        ))}
      </div>

      <Button className="w-full" disabled={!allAnswered} loading={submitting} onClick={submit}>
        Submit quiz
      </Button>
    </div>
  );
}
