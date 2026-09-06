import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { findUserById, updateUser, archiveUser } from "@/lib/repo/users";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const { id } = await params;
  const user = findUserById(id);
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
  return NextResponse.json({ user: { ...user, password_hash: undefined } });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let current;
  try {
    current = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const { id } = await params;
  if (current.role !== "admin" && current.id !== id) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const fields: Record<string, any> = {};
  if (body.name !== undefined) fields.name = body.name;
  if (body.title !== undefined) fields.title = body.title;
  if (current.role === "admin") {
    if (body.role !== undefined) fields.role = body.role;
    if (body.locationId !== undefined) fields.location_id = body.locationId;
    if (body.teamId !== undefined) fields.team_id = body.teamId;
  }
  const user = updateUser(id, fields);
  return NextResponse.json({ user: { ...user, password_hash: undefined } });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let current;
  try {
    current = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  if (current.role !== "admin") return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  const { id } = await params;
  archiveUser(id);
  return NextResponse.json({ ok: true });
}
