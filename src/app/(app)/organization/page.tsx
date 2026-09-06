import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { OrganizationClient } from "./organization-client";

export default async function OrganizationPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");

  const db = getDb();
  const organizations = db.prepare("SELECT * FROM organizations WHERE archived_at IS NULL").all();
  const locations = db
    .prepare(
      `SELECT l.*, (SELECT COUNT(*) FROM users WHERE location_id = l.id AND archived_at IS NULL) as user_count
       FROM locations l WHERE l.archived_at IS NULL ORDER BY l.name`
    )
    .all();
  const teams = db
    .prepare(
      `SELECT t.*, l.name as location_name, m.name as manager_name,
        (SELECT COUNT(*) FROM users WHERE team_id = t.id AND archived_at IS NULL) as member_count
       FROM teams t LEFT JOIN locations l ON t.location_id = l.id LEFT JOIN users m ON t.manager_id = m.id
       WHERE t.archived_at IS NULL ORDER BY t.name`
    )
    .all();
  const users = db
    .prepare(
      `SELECT u.id, u.name, u.email, u.role, u.title, u.location_id, u.team_id, l.name as location_name, t.name as team_name
       FROM users u LEFT JOIN locations l ON u.location_id = l.id LEFT JOIN teams t ON u.team_id = t.id
       WHERE u.archived_at IS NULL ORDER BY u.name`
    )
    .all();
  const managers = db
    .prepare("SELECT id, name FROM users WHERE role = 'store_manager' AND archived_at IS NULL ORDER BY name")
    .all();

  return (
    <OrganizationClient
      organizations={organizations}
      locations={locations}
      teams={teams}
      users={users}
      managers={managers}
    />
  );
}
