import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const deck = db.prepare("SELECT * FROM flashcard_decks WHERE id = ?").get(id) as any;
  if (!deck) return NextResponse.json({ error: "Deck not found." }, { status: 404 });
  const cards = db
    .prepare("SELECT * FROM flashcards WHERE deck_id = ? AND archived_at IS NULL ORDER BY order_index")
    .all(id);
  return NextResponse.json({ deck, cards });
}
