import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { fromJson } from "@/lib/utils";
import { ToolkitClient } from "./toolkit-client";

export default async function ToolkitPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM toolkit_resources WHERE archived_at IS NULL ORDER BY category, title")
    .all() as any[];
  const favs = db
    .prepare("SELECT resource_id FROM toolkit_favorites WHERE user_id = ?")
    .all(user.id) as any[];
  const favSet = new Set(favs.map((f) => f.resource_id));
  const recents = db
    .prepare(
      "SELECT DISTINCT resource_id FROM toolkit_recent_views WHERE user_id = ? ORDER BY viewed_at DESC LIMIT 6"
    )
    .all(user.id) as any[];

  const resources = rows.map((r) => ({
    ...r,
    content: fromJson(r.content, []),
    tags: fromJson(r.tags, []),
    isFavorite: favSet.has(r.id),
  }));

  const recentResources = recents
    .map((r) => resources.find((res) => res.id === r.resource_id))
    .filter(Boolean);

  return <ToolkitClient resources={resources} recentResources={recentResources} />;
}
