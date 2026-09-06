// Generic helpers for straightforward archive-able tables.
import { getDb } from "../db";
import { newId } from "../ids";
import { now } from "../utils";

export interface SimpleTableConfig {
  table: string;
  idPrefix: string;
  archivable?: boolean;
  searchColumns?: string[];
}

export function listSimple(
  cfg: SimpleTableConfig,
  opts: { search?: string; includeArchived?: boolean; extraWhere?: string; extraParams?: any[] } = {}
) {
  const db = getDb();
  const clauses: string[] = [];
  const params: any[] = [];
  if (cfg.archivable && !opts.includeArchived) clauses.push("archived_at IS NULL");
  if (opts.search && cfg.searchColumns?.length) {
    const ors = cfg.searchColumns.map((c) => `${c} LIKE ?`).join(" OR ");
    clauses.push(`(${ors})`);
    cfg.searchColumns.forEach(() => params.push(`%${opts.search}%`));
  }
  if (opts.extraWhere) {
    clauses.push(opts.extraWhere);
    if (opts.extraParams) params.push(...opts.extraParams);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  return db
    .prepare(`SELECT * FROM ${cfg.table} ${where} ORDER BY created_at DESC`)
    .all(...params) as any[];
}

export function getSimple(cfg: SimpleTableConfig, id: string) {
  const db = getDb();
  return db.prepare(`SELECT * FROM ${cfg.table} WHERE id = ?`).get(id) as any;
}

export function createSimple(cfg: SimpleTableConfig, fields: Record<string, any>) {
  const db = getDb();
  const id = newId(cfg.idPrefix);
  const withMeta = { id, created_at: now(), ...fields };
  const keys = Object.keys(withMeta);
  const placeholders = keys.map(() => "?").join(",");
  db.prepare(
    `INSERT INTO ${cfg.table} (${keys.join(",")}) VALUES (${placeholders})`
  ).run(...keys.map((k) => withMeta[k]));
  return getSimple(cfg, id);
}

export function updateSimple(cfg: SimpleTableConfig, id: string, fields: Record<string, any>) {
  const db = getDb();
  const keys = Object.keys(fields);
  if (!keys.length) return getSimple(cfg, id);
  const setClause = keys.map((k) => `${k} = ?`).join(", ");
  db.prepare(`UPDATE ${cfg.table} SET ${setClause} WHERE id = ?`).run(
    ...keys.map((k) => fields[k]),
    id
  );
  return getSimple(cfg, id);
}

export function archiveSimple(cfg: SimpleTableConfig, id: string) {
  const db = getDb();
  db.prepare(`UPDATE ${cfg.table} SET archived_at = ? WHERE id = ?`).run(now(), id);
}

export function restoreSimple(cfg: SimpleTableConfig, id: string) {
  const db = getDb();
  db.prepare(`UPDATE ${cfg.table} SET archived_at = NULL WHERE id = ?`).run(id);
}

export function deleteSimple(cfg: SimpleTableConfig, id: string) {
  const db = getDb();
  db.prepare(`DELETE FROM ${cfg.table} WHERE id = ?`).run(id);
}
