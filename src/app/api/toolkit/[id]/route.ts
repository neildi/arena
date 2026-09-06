import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { fromJson } from "@/lib/utils";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const row = db.prepare("SELECT * FROM toolkit_resources WHERE id = ?").get(id) as any;
  if (!row) return NextResponse.json({ error: "Resource not found." }, { status: 404 });
  return NextResponse.json({
    resource: { ...row, content: fromJson(row.content, []), tags: fromJson(row.tags, []) },
  });
}
