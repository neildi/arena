import { NextRequest, NextResponse } from "next/server";
import { getScenario, getRubricForScenario } from "@/lib/repo/roleplay";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scenario = getScenario(id);
  if (!scenario) return NextResponse.json({ error: "Scenario not found." }, { status: 404 });
  const rubric = getRubricForScenario(id);
  return NextResponse.json({ scenario, rubric });
}
