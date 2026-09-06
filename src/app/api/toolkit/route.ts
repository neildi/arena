import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { fromJson } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const db = getDb();
  const clauses = ["archived_at IS NULL"];
  const params: any[] = [];
  if (search) {
    clauses.push("(title LIKE ? OR summary LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }
  if (category) {
    clauses.push("category = ?");
    params.push(category);
  }
  const rows = db
    .prepare(`SELECT * FROM toolkit_resources WHERE ${clauses.join(" AND ")} ORDER BY category, title`)
    .all(...params) as any[];

  const user = await getCurrentUser();
  let favoriteIds = new Set<string>();
  let recentIds: string[] = [];
  if (user) {
    const favs = db
      .prepare("SELECT resource_id FROM toolkit_favorites WHERE user_id = ?")
      .all(user.id) as any[];
    favoriteIds = new Set(favs.map((f) => f.resource_id));
    const recents = db
      .prepare(
        "SELECT DISTINCT resource_id FROM toolkit_recent_views WHERE user_id = ? ORDER BY viewed_at DESC LIMIT 6"
      )
      .all(user.id) as any[];
    recentIds = recents.map((r) => r.resource_id);
  }

  const resources = rows.map((r) => ({
    ...r,
    content: fromJson(r.content, []),
    tags: fromJson(r.tags, []),
    isFavorite: favoriteIds.has(r.id),
  }));

  return NextResponse.json({ resources, recentIds });
}
