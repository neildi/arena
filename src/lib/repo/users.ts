import { getDb } from "../db";
import { newId } from "../ids";
import { now } from "../utils";
import { hashPassword } from "../auth";

export function findUserByEmail(email: string) {
  const db = getDb();
  return db
    .prepare("SELECT * FROM users WHERE email = ? AND archived_at IS NULL")
    .get(email.toLowerCase().trim()) as any;
}

export function findUserById(id: string) {
  const db = getDb();
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as any;
}

export function listUsers(filters: {
  role?: string;
  orgId?: string;
  locationId?: string;
  teamId?: string;
  search?: string;
  includeArchived?: boolean;
}) {
  const db = getDb();
  const clauses: string[] = [];
  const params: any[] = [];
  if (!filters.includeArchived) clauses.push("archived_at IS NULL");
  if (filters.role) {
    clauses.push("role = ?");
    params.push(filters.role);
  }
  if (filters.orgId) {
    clauses.push("org_id = ?");
    params.push(filters.orgId);
  }
  if (filters.locationId) {
    clauses.push("location_id = ?");
    params.push(filters.locationId);
  }
  if (filters.teamId) {
    clauses.push("team_id = ?");
    params.push(filters.teamId);
  }
  if (filters.search) {
    clauses.push("(name LIKE ? OR email LIKE ?)");
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  return db
    .prepare(`SELECT * FROM users ${where} ORDER BY created_at DESC`)
    .all(...params) as any[];
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  role: string;
  orgId?: string | null;
  locationId?: string | null;
  teamId?: string | null;
  title?: string | null;
}) {
  const db = getDb();
  const id = newId("usr");
  const ts = now();
  const passwordHash = await hashPassword(input.password);
  db.prepare(
    `INSERT INTO users (id, org_id, location_id, team_id, name, email, password_hash, role, title, avatar_seed, onboarded, created_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,0,?)`
  ).run(
    id,
    input.orgId ?? null,
    input.locationId ?? null,
    input.teamId ?? null,
    input.name,
    input.email.toLowerCase().trim(),
    passwordHash,
    input.role,
    input.title ?? null,
    id,
    ts
  );
  return findUserById(id);
}

export function updateUser(id: string, fields: Record<string, any>) {
  const db = getDb();
  const keys = Object.keys(fields);
  if (!keys.length) return findUserById(id);
  const setClause = keys.map((k) => `${k} = ?`).join(", ");
  db.prepare(`UPDATE users SET ${setClause} WHERE id = ?`).run(
    ...keys.map((k) => fields[k]),
    id
  );
  return findUserById(id);
}

export function archiveUser(id: string) {
  const db = getDb();
  db.prepare("UPDATE users SET archived_at = ? WHERE id = ?").run(now(), id);
}

export function restoreUser(id: string) {
  const db = getDb();
  db.prepare("UPDATE users SET archived_at = NULL WHERE id = ?").run(id);
}
