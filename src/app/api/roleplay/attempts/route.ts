import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { getScenario, getRubricForScenario, listUserAttempts } from "@/lib/repo/roleplay";
import { scoreConversation } from "@/lib/roleplay-engine";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/ids";
import { now, toJson } from "@/lib/utils";

const transcriptSchema = z.array(
  z.object({
    role: z.enum(["client", "learner"]),
    text: z.string(),
    ts: z.string(),
  })
);

const schema = z.object({
  scenarioId: z.string(),
  transcript: transcriptSchema.min(2),
});

export async function GET() {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const attempts = listUserAttempts(user.id);
  return NextResponse.json({ attempts });
}

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid submission." }, { status: 400 });

  const scenario = getScenario(parsed.data.scenarioId);
  if (!scenario) return NextResponse.json({ error: "Scenario not found." }, { status: 404 });
  const rubric = getRubricForScenario(parsed.data.scenarioId);
  if (!rubric) return NextResponse.json({ error: "Rubric not found for scenario." }, { status: 500 });

  const learnerTurns = parsed.data.transcript
    .filter((t) => t.role === "learner")
    .map((t) => t.text);

  const result = scoreConversation(rubric.criteria, learnerTurns, scenario.guardrails);

  const db = getDb();
  const ts = now();
  const attemptId = newId("rpa");
  db.prepare(
    `INSERT INTO role_play_attempts (id, scenario_id, user_id, transcript, scores, overall_score, strengths, improvements, recommended_next, created_at)
     VALUES (?,?,?,?,?,?,?,?,?,?)`
  ).run(
    attemptId,
    scenario.id,
    user.id,
    toJson(parsed.data.transcript),
    toJson(result.scores),
    result.overall,
    toJson(result.strengths),
    toJson(result.improvements),
    result.recommendedNext,
    ts
  );

  db.prepare(
    "INSERT INTO activity_log (id, user_id, activity_type, ref_id, summary, created_at) VALUES (?,?,?,?,?,?)"
  ).run(newId("act"), user.id, "roleplay_completed", scenario.id, `Completed a role-play with a score of ${result.overall}`, ts);

  return NextResponse.json({ attemptId, ...result });
}
