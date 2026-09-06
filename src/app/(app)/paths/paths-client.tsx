"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { Gem, Users, TrendingUp, GraduationCap, Clock } from "lucide-react";

const TRACK_ICON: Record<string, any> = {
  foundations: Gem,
  specialist: TrendingUp,
  leadership: Users,
  trainer: GraduationCap,
};

const TRACK_COLOR: Record<string, string> = {
  foundations: "text-sapphire-accent",
  specialist: "text-ruby-accent",
  leadership: "text-emerald-accent",
  trainer: "text-gold-dark",
};

export function PathsClient({ paths }: { paths: any[] }) {
  const { showToast } = useToast();
  const [enrolledMap, setEnrolledMap] = useState<Record<string, boolean>>(
    Object.fromEntries(paths.map((p) => [p.id, p.enrolled]))
  );
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function enroll(pathId: string) {
    setLoadingId(pathId);
    setEnrolledMap((m) => ({ ...m, [pathId]: true })); // optimistic
    try {
      const res = await fetch("/api/paths/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathId }),
      });
      if (!res.ok) throw new Error();
      showToast("Enrolled in learning path.", "success");
    } catch {
      setEnrolledMap((m) => ({ ...m, [pathId]: false }));
      showToast("Could not enroll. Please try again.", "error");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-charcoal-900 mb-1">Learning Paths</h1>
        <p className="text-sm text-charcoal-500">
          Structured tracks for every stage of your fine-jewelry retail career.
        </p>
      </div>

      <div className="space-y-8">
        {paths.map((path) => {
          const Icon = TRACK_ICON[path.track] || Gem;
          return (
            <section key={path.id}>
              <div className="flex items-center gap-3 mb-3">
                <Icon className={`h-6 w-6 ${TRACK_COLOR[path.track]}`} />
                <h2 className="font-serif text-2xl text-charcoal-900">{path.title}</h2>
                {enrolledMap[path.id] ? (
                  <Pill tone="success">Enrolled</Pill>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => enroll(path.id)}
                    loading={loadingId === path.id}
                  >
                    Enroll in path
                  </Button>
                )}
              </div>
              <p className="text-sm text-charcoal-500 mb-4 max-w-2xl">{path.description}</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {path.courses.map((c: any) => (
                  <Link key={c.id} href={`/learning/${c.id}`}>
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardBody>
                        <h3 className="font-serif text-lg text-charcoal-900 mb-1">{c.title}</h3>
                        <p className="text-sm text-charcoal-500 line-clamp-2 mb-2">{c.description}</p>
                        <div className="flex items-center gap-1 text-xs text-charcoal-500">
                          <Clock className="h-3.5 w-3.5" /> {c.estimated_minutes} min
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
                {path.courses.length === 0 && (
                  <p className="text-sm text-charcoal-400 italic">No courses published in this track yet.</p>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
