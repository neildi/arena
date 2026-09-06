import { NextResponse } from "next/server";
import { listScenarios } from "@/lib/repo/roleplay";

export async function GET() {
  const scenarios = listScenarios();
  return NextResponse.json({ scenarios });
}
