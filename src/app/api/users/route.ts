import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { listUsers, createUser } from "@/lib/repo/users";

export async function GET(req: NextRequest) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role") || undefined;
  const teamId = searchParams.get("teamId") || undefined;
  const locationId = searchParams.get("locationId") || undefined;
  const search = searchParams.get("search") || undefined;
  const includeArchived = searchParams.get("includeArchived") === "true";

  let effectiveTeamId = teamId;
  if (user.role === "store_manager" && !teamId && !locationId) {
    effectiveTeamId = user.teamId || undefined;
  }

  const users = listUsers({
    role,
    teamId: effectiveTeamId,
    locationId,
    orgId: user.orgId || undefined,
    search,
    includeArchived,
  }).map((u) => ({ ...u, password_hash: undefined }));
  return NextResponse.json({ users });
}

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["learner", "store_manager", "trainer", "district_leader", "admin"]),
  title: z.string().optional().nullable(),
  locationId: z.string().optional().nullable(),
  teamId: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  if (user.role !== "admin") return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const created = await createUser({ ...parsed.data, orgId: user.orgId });
  return NextResponse.json({ user: { ...created, password_hash: undefined } }, { status: 201 });
}
