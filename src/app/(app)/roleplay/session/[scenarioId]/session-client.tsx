"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { Send, ShieldAlert, User, Gem } from "lucide-react";

interface Turn {
  role: "client" | "learner";
  text: string;
  ts: string;
}

export function SessionClient({ scenario, rubric }: { scenario: any; rubric: any }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [transcript, setTranscript] = useState<Turn[]>([
    { role: "client", text: scenario.clientOpening ?? scenario.client_opening, ts: new Date().toISOString() },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const turnIndexRef = useRef(0);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  async function sendMessage() {
    if (!input.trim() || sending || finished) return;
    const learnerTurn: Turn = { role: "learner", text: input.trim(), ts: new Date().toISOString() };
    setTranscript((t) => [...t, learnerTurn]);
    setInput("");
    setSending(true);
    try {
      const res = await fetch("/api/roleplay/converse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: scenario.id,
          turnIndex: turnIndexRef.current,
          learnerMessage: learnerTurn.text,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      turnIndexRef.current += 1;
      setTranscript((t) => [...t, { role: "client", text: data.reply, ts: new Date().toISOString() }]);
      if (data.isResolution) setFinished(true);
    } catch {
      showToast("Something went wrong sending your message.", "error");
    } finally {
      setSending(false);
    }
  }

  async function finishAndScore() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/roleplay/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId: scenario.id, transcript }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast("Role-play complete — feedback ready.", "success");
      router.push(`/roleplay/results/${data.attemptId}`);
    } catch {
      showToast("Could not score this session. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  const learnerTurnsCount = transcript.filter((t) => t.role === "learner").length;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Pill tone="gold">{scenario.category}</Pill>
          <Pill tone="neutral">{scenario.difficulty}</Pill>
        </div>
        <h1 className="font-serif text-2xl text-charcoal-900">{scenario.title}</h1>
        <p className="text-sm text-charcoal-500 mt-1">{scenario.situation}</p>
      </div>

      <div className="rounded-xl border border-warning/40 bg-warning/5 p-3 flex gap-2 text-xs text-charcoal-700">
        <ShieldAlert className="h-4 w-4 text-warning shrink-0 mt-0.5" />
        <p>
          Practice responsibly: avoid unverified appraisal values, financing approvals, legal advice, or
          guarantees. Follow your store policy and local regulations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1" aria-live="polite">
            {transcript.map((turn, i) => (
              <div
                key={i}
                className={`flex gap-2 ${turn.role === "learner" ? "justify-end" : "justify-start"}`}
              >
                {turn.role === "client" && (
                  <div className="h-7 w-7 rounded-full bg-champagne flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-charcoal-700" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-2.5 max-w-[80%] text-sm ${
                    turn.role === "learner"
                      ? "bg-charcoal-900 text-ivory rounded-br-sm"
                      : "bg-ivory-100 text-charcoal-800 rounded-bl-sm"
                  }`}
                >
                  {turn.text}
                </div>
                {turn.role === "learner" && (
                  <div className="h-7 w-7 rounded-full bg-gold flex items-center justify-center shrink-0">
                    <Gem className="h-4 w-4 text-charcoal-900" />
                  </div>
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {!finished ? (
            <form
              className="mt-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
            >
              <label htmlFor="rp-input" className="sr-only">
                Your response
              </label>
              <textarea
                id="rp-input"
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type your response as the associate..."
                className="flex-1 rounded-lg border border-champagne-dark/50 bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
              <Button type="submit" disabled={!input.trim()} loading={sending} aria-label="Send message">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            <div className="mt-4 flex items-center justify-between rounded-lg bg-ivory-100 p-3">
              <p className="text-sm text-charcoal-700">The client conversation has reached a natural close.</p>
              <Button onClick={finishAndScore} loading={submitting}>
                Get feedback
              </Button>
            </div>
          )}

          {!finished && learnerTurnsCount >= 2 && (
            <div className="mt-3 text-right">
              <button
                onClick={finishAndScore}
                disabled={submitting}
                className="text-xs text-charcoal-500 hover:text-charcoal-900 underline"
              >
                End early &amp; get feedback
              </button>
            </div>
          )}
        </CardBody>
      </Card>

      {rubric && (
        <Card>
          <CardHeader>
            <CardTitle>What you&apos;ll be scored on</CardTitle>
          </CardHeader>
          <CardBody className="grid sm:grid-cols-2 gap-2">
            {rubric.criteria.map((c: any) => (
              <div key={c.key} className="text-sm">
                <p className="font-medium text-charcoal-800">{c.label}</p>
                <p className="text-xs text-charcoal-500">{c.description}</p>
              </div>
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
