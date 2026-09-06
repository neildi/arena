import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getScenario, getRubricForScenario } from "@/lib/repo/roleplay";
import { SessionClient } from "./session-client";

export default async function RoleplaySessionPage({
  params,
}: {
  params: Promise<{ scenarioId: string }>;
}) {
  const { scenarioId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const scenario = getScenario(scenarioId);
  if (!scenario) notFound();
  const rubric = getRubricForScenario(scenarioId);

  return <SessionClient scenario={scenario} rubric={rubric} />;
}
