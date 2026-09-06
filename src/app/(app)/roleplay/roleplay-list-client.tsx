"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { EmptyState } from "@/components/ui/empty-state";
import { Search, MessagesSquare, TrendingUp } from "lucide-react";

const DIFFICULTY_TONE: Record<string, "success" | "warning" | "danger"> = {
  beginner: "success",
  intermediate: "warning",
  advanced: "danger",
};

export function RoleplayListClient({ scenarios, attempts }: { scenarios: any[]; attempts: any[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(scenarios.map((s) => s.category)))],
    [scenarios]
  );

  const filtered = scenarios.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || s.category === category;
    return matchesSearch && matchesCategory;
  });

  const scoreHistory = attempts.slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-charcoal-900 mb-1">Practice Role-Play</h1>
        <p className="text-sm text-charcoal-500">
          Practice text-based client conversations and get structured coaching feedback.
        </p>
      </div>

      {scoreHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gold-dark" /> Score History
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {scoreHistory.map((a) => (
                <Link
                  key={a.id}
                  href={`/roleplay/results/${a.id}`}
                  className="shrink-0 rounded-lg border border-champagne px-3 py-2 text-center hover:bg-ivory-100"
                >
                  <p className="text-lg font-serif text-charcoal-900">{a.overall_score}</p>
                  <p className="text-[10px] text-charcoal-500 max-w-[100px] truncate">{a.scenario_title}</p>
                </Link>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400" />
          <Input
            placeholder="Search scenarios..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search role-play scenarios"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border ${
                category === c
                  ? "bg-charcoal-900 text-ivory border-charcoal-900"
                  : "bg-white text-charcoal-600 border-champagne-dark/40"
              }`}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<MessagesSquare className="h-6 w-6" />} title="No scenarios found" description="Try a different search or category." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <Card key={s.id} className="h-full flex flex-col">
              <CardBody className="flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <Pill tone={DIFFICULTY_TONE[s.difficulty] || "neutral"}>{s.difficulty}</Pill>
                  <Pill tone="neutral">{s.category}</Pill>
                </div>
                <h3 className="font-serif text-lg text-charcoal-900 mb-2">{s.title}</h3>
                <p className="text-sm text-charcoal-500 flex-1 mb-3">{s.situation}</p>
                <Link href={`/roleplay/session/${s.id}`}>
                  <Button className="w-full">Start practice</Button>
                </Link>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
