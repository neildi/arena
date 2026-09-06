import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AnalyticsClient } from "./analytics-client";
import { getDb } from "@/lib/db";

const ELEVATED = ["store_manager", "trainer", "district_leader", "admin"];

export default async function AnalyticsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!ELEVATED.includes(user.role)) redirect("/dashboard");

  const db = getDb();
  const kpiDefinitions = db.prepare("SELECT * FROM kpi_definitions ORDER BY title").all();

  return <AnalyticsClient kpiDefinitions={kpiDefinitions} />;
}
