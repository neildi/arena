import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { updateUser } from "@/lib/repo/users";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/ids";
import { now } from "@/lib/utils";

const schema = z.object({
  experienceLevel: z.string().min(1),
  retailEnvironment: z.string().min(1),
  careerGoal: z.string().min(1),
  primarySkillGoal: z.string().min(1),
  weeklyAvailabilityHours: z.number().min(1).max(40),
  region: z.string().optional().default(""),
  market: z.string().optional().default(""),
});

const SKILL_TO_TRACK: Record<string, string> = {
  diamond_gemstone_knowledge: "foundations",
  sales_conversations: "foundations",
  objection_handling: "foundations",
  clienteling: "foundations",
  bridal: "specialist",
  security: "foundations",
  compliance: "foundations",
  store_operations: "leadership",
  kpis: "leadership",
  coaching: "leadership",
  leadership: "leadership",
};

const GOAL_TO_TRACK: Record<string, string> = {
  sales_associate: "foundations",
  bridal_specialist: "specialist",
  gemologist_seller: "specialist",
  store_manager: "leadership",
  district_leader: "leadership",
  trainer: "trainer",
};

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input." }, { status: 400 });
  }
  const {
    experienceLevel,
    retailEnvironment,
    careerGoal,
    primarySkillGoal,
    weeklyAvailabilityHours,
    region,
    market,
  } = parsed.data;

  updateUser(user.id, {
    experience_level: experienceLevel,
    retail_environment: retailEnvironment,
    career_goal: careerGoal,
    primary_skill_goal: primarySkillGoal,
    weekly_availability_hours: weeklyAvailabilityHours,
    region,
    market,
    onboarded: 1,
  });

  // Recommend + enroll in learning path(s)
  const db = getDb();
  const tracks = new Set<string>();
  tracks.add(SKILL_TO_TRACK[primarySkillGoal] || "foundations");
  tracks.add(GOAL_TO_TRACK[careerGoal] || "foundations");

  const recommended: any[] = [];
  for (const track of tracks) {
    const path = db
      .prepare("SELECT * FROM learning_paths WHERE track = ?")
      .get(track) as any;
    if (!path) continue;
    recommended.push(path);
    const already = db
      .prepare("SELECT id FROM path_enrollments WHERE user_id = ? AND path_id = ?")
      .get(user.id, path.id);
    if (!already) {
      db.prepare(
        "INSERT INTO path_enrollments (id, user_id, path_id, created_at) VALUES (?,?,?,?)"
      ).run(newId("penr"), user.id, path.id, now());
    }
  }

  return NextResponse.json({ ok: true, recommendedPaths: recommended });
}
