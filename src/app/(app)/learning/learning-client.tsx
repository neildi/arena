"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, CardBody } from "@/components/ui/card";
import { Pill } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Input } from "@/components/ui/field";
import { EmptyState } from "@/components/ui/empty-state";
import { Search, BookOpen, Clock } from "lucide-react";

const LEVEL_LABELS: Record<string, string> = {
  foundations: "Foundations",
  specialist: "Specialist",
  leadership: "Leadership",
  trainer: "Trainer",
};

export function LearningClient({ enrollments, allCourses }: { enrollments: any[]; allCourses: any[] }) {
  const [search, setSearch] = useState("");
  const enrolledCourseIds = new Set(enrollments.map((e) => e.course_id));

  const filteredCourses = useMemo(() => {
    if (!search) return allCourses;
    return allCourses.filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [allCourses, search]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-charcoal-900 mb-1">My Learning</h1>
        <p className="text-sm text-charcoal-500">Track your progress and discover new courses.</p>
      </div>

      <section>
        <h2 className="font-serif text-xl text-charcoal-900 mb-3">In Progress</h2>
        {enrollments.filter((e) => e.status !== "completed").length === 0 ? (
          <EmptyState
            icon={<BookOpen className="h-6 w-6" />}
            title="No courses in progress"
            description="Enroll in a learning path or course to get started."
            action={
              <Link href="/paths" className="text-sm text-gold-dark font-medium">
                Browse learning paths
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments
              .filter((e) => e.status !== "completed")
              .map((e) => (
                <Link key={e.id} href={`/learning/${e.course_id}`}>
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardBody>
                      <Pill tone="gold" className="mb-2">
                        {LEVEL_LABELS[e.level] || e.level}
                      </Pill>
                      <h3 className="font-serif text-lg text-charcoal-900 mb-2">{e.title}</h3>
                      <div className="flex items-center gap-1 text-xs text-charcoal-500 mb-3">
                        <Clock className="h-3.5 w-3.5" /> {e.estimated_minutes} min
                      </div>
                      <ProgressBar value={e.progress_percent} />
                      <p className="text-xs text-charcoal-500 mt-1">{e.progress_percent}% complete</p>
                    </CardBody>
                  </Card>
                </Link>
              ))}
          </div>
        )}
      </section>

      {enrollments.filter((e) => e.status === "completed").length > 0 && (
        <section>
          <h2 className="font-serif text-xl text-charcoal-900 mb-3">Completed</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments
              .filter((e) => e.status === "completed")
              .map((e) => (
                <Link key={e.id} href={`/learning/${e.course_id}`}>
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardBody>
                      <Pill tone="success" className="mb-2">
                        Completed
                      </Pill>
                      <h3 className="font-serif text-lg text-charcoal-900">{e.title}</h3>
                    </CardBody>
                  </Card>
                </Link>
              ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
          <h2 className="font-serif text-xl text-charcoal-900">All Courses</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400" />
            <Input
              placeholder="Search courses..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search courses"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((c) => (
            <Link key={c.id} href={`/learning/${c.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardBody>
                  <div className="flex items-center justify-between mb-2">
                    <Pill tone="gold">{LEVEL_LABELS[c.level] || c.level}</Pill>
                    {enrolledCourseIds.has(c.id) && <Pill tone="info">Enrolled</Pill>}
                  </div>
                  <h3 className="font-serif text-lg text-charcoal-900 mb-1">{c.title}</h3>
                  <p className="text-sm text-charcoal-500 line-clamp-2 mb-2">{c.description}</p>
                  <div className="flex items-center gap-1 text-xs text-charcoal-500">
                    <Clock className="h-3.5 w-3.5" /> {c.estimated_minutes} min
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
        {filteredCourses.length === 0 && (
          <EmptyState title="No courses found" description="Try a different search term." />
        )}
      </section>
    </div>
  );
}
