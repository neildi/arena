import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const definitions = db.prepare("SELECT * FROM kpi_definitions WHERE archived_at IS NULL ORDER BY title").all();
  return NextResponse.json({ definitions });
}
