import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { learnerDashboardData, managerDashboardData } from "@/lib/repo/dashboard";
import { LearnerDashboard } from "./learner-dashboard";
import { ManagerDashboard } from "./manager-dashboard";
import { LeadershipDashboard } from "./leadership-dashboard";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (user.role === "learner") {
    const data = learnerDashboardData(user.id);
    return <LearnerDashboard user={user} data={data} />;
  }

  if (user.role === "store_manager") {
    const data = managerDashboardData(user.id, user.teamId);
    return <ManagerDashboard user={user} data={data} />;
  }

  // trainer, district_leader, admin get a leadership-style landing dashboard
  return <LeadershipDashboard user={user} />;
}
