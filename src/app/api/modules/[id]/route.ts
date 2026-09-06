import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { now } from "@/lib/utils";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  if (!["trainer", "admin"].includes(user.role)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const db = getDb();
  const fields: Record<string, any> = {};
  if (body.title) fields.title = body.title;
  if (body.orderIndex !== undefined) fields.order_index = body.orderIndex;
  const keys = Object.keys(fields);
  if (keys.length) {
    db.prepare(`UPDATE modules SET ${keys.map((k) => `${k} = ?`).join(", ")} WHERE id = ?`).run(
      ...keys.map((k) => fields[k]),
      id
    );
  }
  const module_ = db.prepare("SELECT * FROM modules WHERE id = ?").get(id);
  return NextResponse.json({ module: module_ });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  if (!["trainer", "admin"].includes(user.role)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }
  const { id } = await params;
  const db = getDb();
  db.prepare("UPDATE modules SET archived_at = ? WHERE id = ?").run(now(), id);
  db.prepare("UPDATE lessons SET archived_at = ? WHERE module_id = ?").run(now(), id);
  return NextResponse.json({ ok: true });
}
