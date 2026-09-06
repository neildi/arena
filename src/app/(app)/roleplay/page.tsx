import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { listScenarios, listUserAttempts } from "@/lib/repo/roleplay";
import { RoleplayListClient } from "./roleplay-list-client";

export default async function RoleplayPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const scenarios = listScenarios();
  const attempts = listUserAttempts(user.id);

  return <RoleplayListClient scenarios={scenarios} attempts={attempts} />;
}
