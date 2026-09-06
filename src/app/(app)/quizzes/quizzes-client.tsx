"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/card";
import { Pill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ClipboardCheck, Layers, RotateCw } from "lucide-react";

const QUIZ_TYPE_LABEL: Record<string, string> = {
  knowledge_check: "Knowledge Check",
  final_assessment: "Final Assessment",
  drill: "Timed Drill",
  gia_reading: "GIA Reading Exercise",
  terminology: "Terminology Challenge",
  kpi_calc: "KPI Calculation",
};

function FlashcardStudy({ deckId, onClose }: { deckId: string; onClose: () => void }) {
  const [cards, setCards] = useState<any[]>([]);
  const [deck, setDeck] = useState<any>(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    fetch(`/api/flashcard-decks/${deckId}`)
      .then((r) => r.json())
      .then((data) => {
        setCards(data.cards || []);
        setDeck(data.deck);
      });
  }, [deckId]);

  if (!deck) return null;
  const card = cards[index];

  return (
    <div className="fixed inset-0 z-[95] bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-ivory rounded-2xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg text-charcoal-900">{deck.title}</h3>
          <button onClick={onClose} className="text-charcoal-500 hover:text-charcoal-900 text-sm">
            Close
          </button>
        </div>
        {card ? (
          <>
            <button
              onClick={() => setFlipped((f) => !f)}
              className="w-full min-h-[180px] rounded-xl border border-champagne-dark/40 bg-white flex items-center justify-center p-6 text-center"
            >
              <p className="text-charcoal-900 text-lg">{flipped ? card.back : card.front}</p>
            </button>
            <p className="text-xs text-charcoal-500 text-center mt-2">
              {index + 1} of {cards.length} · Tap card to flip
            </p>
            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setFlipped(false);
                  setIndex((i) => Math.max(0, i - 1));
                }}
                disabled={index === 0}
              >
                Previous
              </Button>
              <Button
                onClick={() => {
                  setFlipped(false);
                  setIndex((i) => Math.min(cards.length - 1, i + 1));
                }}
                disabled={index === cards.length - 1}
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <p className="text-sm text-charcoal-500">No flashcards in this deck.</p>
        )}
      </div>
    </div>
  );
}

export function QuizzesClient({ quizzes, bestByQuiz, decks, attempts }: any) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeDeck, setActiveDeck] = useState<string | null>(searchParams.get("deck"));

  function closeDeck() {
    setActiveDeck(null);
    router.replace("/quizzes");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-charcoal-900 mb-1">Quizzes &amp; Drills</h1>
        <p className="text-sm text-charcoal-500">
          Test your knowledge, review explanations, and track your scores over time.
        </p>
      </div>

      <section>
        <h2 className="font-serif text-xl text-charcoal-900 mb-3 flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-gold-dark" /> Quizzes
        </h2>
        {quizzes.length === 0 ? (
          <EmptyState title="No quizzes yet" description="Quizzes will appear here once published." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((q: any) => {
              const best = bestByQuiz[q.id];
              return (
                <Card key={q.id} className="h-full flex flex-col">
                  <CardBody className="flex-1 flex flex-col">
                    <Pill tone="gold" className="w-fit mb-2">
                      {QUIZ_TYPE_LABEL[q.quiz_type] || q.quiz_type}
                    </Pill>
                    <h3 className="font-serif text-lg text-charcoal-900 mb-1">{q.title}</h3>
                    <p className="text-xs text-charcoal-500 mb-2">{q.course_title}</p>
                    <p className="text-sm text-charcoal-600 flex-1">{q.question_count} questions</p>
                    {best && (
                      <p className="text-xs text-charcoal-500 mb-2">
                        Best score: {best.score}/{best.total} {best.passed ? "· Passed" : ""}
                      </p>
                    )}
                    <Link href={`/quizzes/${q.id}`}>
                      <Button className="w-full" variant={best ? "outline" : "primary"}>
                        {best ? (
                          <>
                            <RotateCw className="h-4 w-4" /> Retake
                          </>
                        ) : (
                          "Start quiz"
                        )}
                      </Button>
                    </Link>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-serif text-xl text-charcoal-900 mb-3 flex items-center gap-2">
          <Layers className="h-5 w-5 text-gold-dark" /> Flashcard Decks
        </h2>
        {decks.length === 0 ? (
          <EmptyState title="No flashcard decks yet" description="Decks will appear here once published." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((d: any) => (
              <Card key={d.id}>
                <CardBody>
                  <h3 className="font-serif text-lg text-charcoal-900 mb-1">{d.title}</h3>
                  <p className="text-xs text-charcoal-500 mb-3">
                    {d.course_title} · {d.card_count} cards
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => setActiveDeck(d.id)}>
                    Study flashcards
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>

      {attempts.length > 0 && (
        <section>
          <h2 className="font-serif text-xl text-charcoal-900 mb-3">Score History</h2>
          <Card>
            <CardBody className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-charcoal-500 border-b border-champagne">
                    <th className="py-2 pr-4">Quiz</th>
                    <th className="py-2 pr-4">Score</th>
                    <th className="py-2 pr-4">Result</th>
                    <th className="py-2 pr-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((a: any) => (
                    <tr key={a.id} className="border-b border-champagne/50 last:border-0">
                      <td className="py-2 pr-4 text-charcoal-800">{a.quiz_title}</td>
                      <td className="py-2 pr-4">
                        {a.score}/{a.total}
                      </td>
                      <td className="py-2 pr-4">
                        <Pill tone={a.passed ? "success" : "danger"}>{a.passed ? "Passed" : "Not passed"}</Pill>
                      </td>
                      <td className="py-2 pr-4 text-charcoal-500">
                        {a.completed_at ? new Date(a.completed_at).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </section>
      )}

      {activeDeck && <FlashcardStudy deckId={activeDeck} onClose={closeDeck} />}
    </div>
  );
}
