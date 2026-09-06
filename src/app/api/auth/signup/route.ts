import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { findUserByEmail, createUser } from "@/lib/repo/users";
import { setSessionCookie, userRowToSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(["learner", "store_manager", "trainer", "district_leader", "admin"]).default("learner"),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input." },
      { status: 400 }
    );
  }
  const existing = findUserByEmail(parsed.data.email);
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }
  const db = getDb();
  const org = db.prepare("SELECT id FROM organizations LIMIT 1").get() as { id: string } | undefined;
  const user = await createUser({
    name: parsed.data.name,
    email: parsed.data.email,
    password: parsed.data.password,
    role: parsed.data.role,
    orgId: org?.id ?? null,
    title:
      parsed.data.role === "learner"
        ? "Jewelry Associate"
        : parsed.data.role === "store_manager"
        ? "Store Manager"
        : parsed.data.role === "trainer"
        ? "Trainer / L&D Lead"
        : parsed.data.role === "district_leader"
        ? "District Leader"
        : "Administrator",
  });
  await setSessionCookie(user.id);
  return NextResponse.json({ user: userRowToSession(user) });
}
