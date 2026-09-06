import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { getDb } from "./db";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "aurelia-fine-jewelry-academy-dev-secret-key-2026"
);
const COOKIE_NAME = "aurelia_session";

export type Role =
  | "learner"
  | "store_manager"
  | "trainer"
  | "district_leader"
  | "admin";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  orgId: string | null;
  locationId: string | null;
  teamId: string | null;
  onboarded: boolean;
  title?: string | null;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET);
}

export async function setSessionCookie(userId: string) {
  const token = await createSessionToken(userId);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export function userRowToSession(row: any): SessionUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    orgId: row.org_id,
    locationId: row.location_id,
    teamId: row.team_id,
    onboarded: !!row.onboarded,
    title: row.title,
  };
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const store = await cookies();
    const token = store.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, SECRET);
    const userId = payload.sub as string;
    const db = getDb();
    const row = db
      .prepare("SELECT * FROM users WHERE id = ? AND archived_at IS NULL")
      .get(userId);
    if (!row) return null;
    return userRowToSession(row);
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export function roleHasAny(role: Role, allowed: Role[]): boolean {
  return allowed.includes(role);
}
