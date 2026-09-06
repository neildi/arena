import { getDb } from "../db";
import { fromJson } from "../utils";

export function listScenarios(includeArchived = false) {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT * FROM role_play_scenarios ${includeArchived ? "" : "WHERE archived_at IS NULL"} ORDER BY created_at`
    )
    .all() as any[];
  return rows.map(mapScenario);
}

export function getScenario(id: string) {
  const db = getDb();
  const row = db.prepare("SELECT * FROM role_play_scenarios WHERE id = ?").get(id) as any;
  return row ? mapScenario(row) : null;
}

function mapScenario(row: any) {
  return {
    ...row,
    skill_tags: fromJson(row.skill_tags, []),
    guardrails: fromJson(row.guardrails, []),
  };
}

export function getRubricForScenario(scenarioId: string) {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM role_play_rubrics WHERE scenario_id = ? AND archived_at IS NULL")
    .get(scenarioId) as any;
  if (!row) return null;
  return { ...row, criteria: fromJson(row.criteria, []) };
}

export function listUserAttempts(userId: string) {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT a.*, s.title as scenario_title, s.category
       FROM role_play_attempts a JOIN role_play_scenarios s ON a.scenario_id = s.id
       WHERE a.user_id = ? ORDER BY a.created_at DESC`
    )
    .all(userId) as any[];
  return rows.map((r) => ({
    ...r,
    transcript: fromJson(r.transcript, []),
    scores: fromJson(r.scores, {}),
    strengths: fromJson(r.strengths, []),
    improvements: fromJson(r.improvements, []),
  }));
}

export function getAttempt(id: string) {
  const db = getDb();
  const row = db.prepare("SELECT * FROM role_play_attempts WHERE id = ?").get(id) as any;
  if (!row) return null;
  return {
    ...row,
    transcript: fromJson(row.transcript, []),
    scores: fromJson(row.scores, {}),
    strengths: fromJson(row.strengths, []),
    improvements: fromJson(row.improvements, []),
  };
}
