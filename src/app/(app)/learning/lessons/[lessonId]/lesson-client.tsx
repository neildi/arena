"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
  ListChecks,
  Quote,
} from "lucide-react";

export function LessonClient({
  lesson,
  progress,
  bookmarked: initialBookmarked,
  notes: initialNotes,
  prevLesson,
  nextLesson,
  flashcardDeck,
}: {
  lesson: any;
  progress: any;
  bookmarked: boolean;
  notes: any[];
  prevLesson: any;
  nextLesson: any;
  flashcardDeck: any;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [view, setView] = useState<"short" | "full">("short");
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [completed, setCompleted] = useState(progress?.status === "completed");
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState(initialNotes);
  const [savingNote, setSavingNote] = useState(false);
  const [marking, setMarking] = useState(false);

  async function toggleBookmark() {
    setBookmarked((b) => !b); // optimistic
    try {
      const res = await fetch(`/api/lessons/${lesson.id}/bookmark`, { method: "POST" });
      const data = await res.json();
      setBookmarked(data.bookmarked);
      showToast(data.bookmarked ? "Lesson bookmarked." : "Bookmark removed.", "success");
    } catch {
      setBookmarked((b) => !b);
      showToast("Could not update bookmark.", "error");
    }
  }

  async function markComplete() {
    setMarking(true);
    setCompleted(true); // optimistic
    try {
      const res = await fetch(`/api/lessons/${lesson.id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed", progressPercent: 100 }),
      });
      if (!res.ok) throw new Error();
      showToast("Lesson marked as complete.", "success");
      router.refresh();
    } catch {
      setCompleted(false);
      showToast("Could not update progress.", "error");
    } finally {
      setMarking(false);
    }
  }

  async function saveNote() {
    if (!noteText.trim()) return;
    setSavingNote(true);
    const optimisticNote = { id: `temp-${Date.now()}`, content: noteText, updated_at: new Date().toISOString() };
    setNotes((n) => [optimisticNote, ...n]);
    const text = noteText;
    setNoteText("");
    try {
      const res = await fetch(`/api/lessons/${lesson.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setNotes((n) => [data.note, ...n.filter((x) => x.id !== optimisticNote.id)]);
      showToast("Note saved.", "success");
    } catch {
      setNotes((n) => n.filter((x) => x.id !== optimisticNote.id));
      showToast("Could not save note.", "error");
    } finally {
      setSavingNote(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between text-sm">
        <Link href={`/learning/${lesson.module?.course_id}`} className="text-charcoal-500 hover:text-charcoal-900 inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> {lesson.course?.title}
        </Link>
        <button
          onClick={toggleBookmark}
          aria-pressed={bookmarked}
          aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
          className="text-gold-dark hover:text-gold flex items-center gap-1 text-sm"
        >
          {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          {bookmarked ? "Bookmarked" : "Bookmark"}
        </button>
      </div>

      <div>
        <h1 className="font-serif text-3xl text-charcoal-900 mb-2">{lesson.title}</h1>
        <p className="text-charcoal-600">{lesson.summary}</p>
        <div className="flex items-center gap-2 mt-3">
          <Pill tone={completed ? "success" : "neutral"}>
            {completed ? "Completed" : `${lesson.estimated_minutes} min read`}
          </Pill>
          <div className="inline-flex rounded-lg border border-champagne-dark/40 overflow-hidden text-xs">
            <button
              onClick={() => setView("short")}
              className={`px-3 py-1.5 ${view === "short" ? "bg-charcoal-900 text-ivory" : "bg-white text-charcoal-600"}`}
            >
              Short view
            </button>
            <button
              onClick={() => setView("full")}
              className={`px-3 py-1.5 ${view === "full" ? "bg-charcoal-900 text-ivory" : "bg-white text-charcoal-600"}`}
            >
              Full article
            </button>
          </div>
        </div>
      </div>

      {lesson.compliance_notes?.length > 0 && (
        <div className="rounded-xl border border-warning/40 bg-warning/5 p-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-charcoal-900">Compliance Reminder</p>
            {lesson.compliance_notes.map((c: string, i: number) => (
              <p key={i} className="text-sm text-charcoal-700">
                {c}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-5">
        {lesson.sections.map((s: any, i: number) => (
          <Card key={i}>
            <CardBody>
              <h3 className="font-serif text-lg text-charcoal-900 mb-2">{s.heading}</h3>
              <p className="text-charcoal-700 leading-relaxed">
                {view === "short" && s.body.length > 220 ? s.body.slice(0, 220) + "…" : s.body}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>

      {lesson.key_terms?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-gold-dark" /> Key Terms
            </CardTitle>
          </CardHeader>
          <CardBody className="grid sm:grid-cols-2 gap-3">
            {lesson.key_terms.map((kt: any, i: number) => (
              <div key={i} className="rounded-lg bg-ivory-100 p-3">
                <p className="text-sm font-semibold text-charcoal-900">{kt.term}</p>
                <p className="text-xs text-charcoal-600 mt-1">{kt.definition}</p>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {lesson.client_language?.length > 0 && (
        <Card className="border-sapphire-accent/30 bg-sapphire-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sapphire-accent">
              <MessageCircle className="h-4 w-4" /> Client-Facing Language
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-2">
            {lesson.client_language.map((c: string, i: number) => (
              <p key={i} className="text-sm text-charcoal-700 italic flex gap-2">
                <Quote className="h-4 w-4 text-sapphire-accent shrink-0 mt-0.5" />
                {c}
              </p>
            ))}
          </CardBody>
        </Card>
      )}

      {lesson.scripts?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sales Scripts &amp; Example Dialogue</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            {lesson.scripts.map((s: any, i: number) => (
              <div key={i}>
                <p className="text-sm font-medium text-charcoal-900 mb-1">{s.title}</p>
                <pre className="whitespace-pre-wrap font-sans text-sm text-charcoal-700 bg-ivory-100 rounded-lg p-3 leading-relaxed">
                  {s.dialogue}
                </pre>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {lesson.floor_tasks?.length > 0 && (
        <Card className="border-emerald-accent/30 bg-emerald-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-accent">
              <ListChecks className="h-4 w-4" /> On the Floor This Week
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-2">
            {lesson.floor_tasks.map((t: string, i: number) => (
              <p key={i} className="text-sm text-charcoal-700">
                • {t}
              </p>
            ))}
            <Link href="/tasks" className="text-xs text-emerald-accent font-medium inline-block mt-1">
              Log this in My Tasks
            </Link>
          </CardBody>
        </Card>
      )}

      {flashcardDeck && (
        <Card>
          <CardBody className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal-900">Flashcards available</p>
              <p className="text-xs text-charcoal-500">Review key terms from this lesson.</p>
            </div>
            <Link href={`/quizzes?deck=${flashcardDeck.id}`}>
              <Button variant="outline" size="sm">
                Study
              </Button>
            </Link>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>My Notes</CardTitle>
        </CardHeader>
        <CardBody className="space-y-3">
          <Textarea
            placeholder="Add a personal note or highlight for this lesson..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            aria-label="Lesson note"
          />
          <Button size="sm" onClick={saveNote} loading={savingNote} disabled={!noteText.trim()}>
            Save note
          </Button>
          {notes.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-champagne/60">
              {notes.map((n: any) => (
                <div key={n.id} className="text-sm text-charcoal-700 bg-ivory-100 rounded-lg p-3">
                  {n.content}
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <div className="flex items-center justify-between pt-4 border-t border-champagne">
        <div>
          {prevLesson ? (
            <Link href={`/learning/lessons/${prevLesson.id}`} className="text-sm text-charcoal-600 inline-flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> Previous
            </Link>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          {!completed && (
            <Button onClick={markComplete} loading={marking}>
              <CheckCircle2 className="h-4 w-4" /> Mark complete
            </Button>
          )}
          {nextLesson ? (
            <Link href={`/learning/lessons/${nextLesson.id}`}>
              <Button variant={completed ? "primary" : "outline"}>
                Next lesson <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
