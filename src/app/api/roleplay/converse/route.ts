import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getScenario } from "@/lib/repo/roleplay";
import { analyzeTurn, generateClientReply } from "@/lib/roleplay-engine";

const schema = z.object({
  scenarioId: z.string(),
  turnIndex: z.number().min(0),
  learnerMessage: z.string().min(1).max(2000),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const scenario = getScenario(parsed.data.scenarioId);
  if (!scenario) return NextResponse.json({ error: "Scenario not found." }, { status: 404 });

  const analysis = analyzeTurn(parsed.data.learnerMessage);
  const { reply, isResolution } = generateClientReply(
    scenario.category,
    parsed.data.turnIndex,
    analysis
  );

  return NextResponse.json({ reply, isResolution, analysis });
}
