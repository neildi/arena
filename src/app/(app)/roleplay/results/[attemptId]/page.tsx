import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getAttempt, getScenario, getRubricForScenario, listUserAttempts } from "@/lib/repo/roleplay";
import { ResultsClient } from "./results-client";

export default async function RoleplayResultsPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const attempt = getAttempt(attemptId);
  if (!attempt) notFound();
  const scenario = getScenario(attempt.scenario_id);
  const rubric = getRubricForScenario(attempt.scenario_id);
  const history = listUserAttempts(user.id).filter((a) => a.scenario_id === attempt.scenario_id);

  return <ResultsClient attempt={attempt} scenario={scenario} rubric={rubric} history={history} />;
}
