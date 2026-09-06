"use client";

import { useMemo, useState } from "react";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/field";
import { Pill } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Search, Star, Clock, BookOpenCheck } from "lucide-react";

const TYPE_LABEL: Record<string, string> = {
  guide: "Guide",
  checklist: "Checklist",
  script: "Script",
  comparison: "Comparison",
  reference: "Reference",
};

export function ToolkitClient({ resources: initial, recentResources }: { resources: any[]; recentResources: any[] }) {
  const { showToast } = useToast();
  const [resources, setResources] = useState(initial);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [activeResource, setActiveResource] = useState<any>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(initial.map((r) => r.category)))],
    [initial]
  );

  const filtered = resources.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.summary?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || r.category === category;
    const matchesFav = !showFavoritesOnly || r.isFavorite;
    return matchesSearch && matchesCategory && matchesFav;
  });

  async function toggleFavorite(id: string) {
    setResources((rs) => rs.map((r) => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r)));
    try {
      const res = await fetch(`/api/toolkit/${id}/favorite`, { method: "POST" });
      const data = await res.json();
      showToast(data.favorited ? "Added to favorites." : "Removed from favorites.", "success");
    } catch {
      setResources((rs) => rs.map((r) => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r)));
      showToast("Could not update favorites.", "error");
    }
  }

  function openResource(r: any) {
    setActiveResource(r);
    fetch(`/api/toolkit/${r.id}/view`, { method: "POST" }).catch(() => {});
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-charcoal-900 mb-1">Floor Toolkit</h1>
        <p className="text-sm text-charcoal-500">
          Quick-reference cards, checklists, and scripts for the sales floor.
        </p>
      </div>

      {recentResources.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-wide text-charcoal-500 mb-2 flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> Recently viewed
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {recentResources.map((r: any) => (
              <button
                key={r.id}
                onClick={() => openResource(r)}
                className="shrink-0 rounded-lg border border-champagne-dark/40 bg-white px-3 py-2 text-xs text-charcoal-700 hover:bg-ivory-100"
              >
                {r.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400" />
          <Input
            placeholder="Search the toolkit..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search toolkit"
          />
        </div>
        <button
          onClick={() => setShowFavoritesOnly((f) => !f)}
          className={`shrink-0 rounded-lg border px-3 py-2 text-sm flex items-center gap-1.5 ${
            showFavoritesOnly ? "bg-gold/20 border-gold text-charcoal-900" : "border-champagne-dark/40 text-charcoal-600"
          }`}
        >
          <Star className={`h-4 w-4 ${showFavoritesOnly ? "fill-gold text-gold" : ""}`} /> Favorites
        </button>
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

      {filtered.length === 0 ? (
        <EmptyState icon={<BookOpenCheck className="h-6 w-6" />} title="No resources found" description="Try a different search, category, or clear favorites filter." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <Card key={r.id} className="h-full flex flex-col">
              <CardBody className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <Pill tone="neutral">{TYPE_LABEL[r.resource_type] || r.resource_type}</Pill>
                  <button
                    onClick={() => toggleFavorite(r.id)}
                    aria-pressed={r.isFavorite}
                    aria-label={r.isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Star className={`h-5 w-5 ${r.isFavorite ? "fill-gold text-gold" : "text-charcoal-300"}`} />
                  </button>
                </div>
                <button onClick={() => openResource(r)} className="text-left flex-1 flex flex-col">
                  <h3 className="font-serif text-lg text-charcoal-900 mb-1">{r.title}</h3>
                  <p className="text-sm text-charcoal-500 flex-1">{r.summary}</p>
                  <p className="text-xs text-gold-dark font-medium mt-2">View details</p>
                </button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!activeResource} onClose={() => setActiveResource(null)} title={activeResource?.title ?? ""}>
        {activeResource && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <p className="text-sm text-charcoal-600">{activeResource.summary}</p>
            {activeResource.content.map((section: any, i: number) => (
              <div key={i}>
                <p className="text-sm font-semibold text-charcoal-900 mb-1">{section.heading}</p>
                <ul className="space-y-1">
                  {section.items.map((item: string, j: number) => (
                    <li key={j} className="text-sm text-charcoal-700">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="flex flex-wrap gap-1 pt-2 border-t border-champagne/60">
              {activeResource.tags.map((t: string) => (
                <Pill key={t} tone="neutral">
                  {t}
                </Pill>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleFavorite(activeResource.id)}
              className="w-full"
            >
              <Star className={`h-4 w-4 ${activeResource.isFavorite ? "fill-gold text-gold" : ""}`} />
              {activeResource.isFavorite ? "Remove from favorites" : "Save to favorites"}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
