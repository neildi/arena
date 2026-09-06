import type { Role } from "./auth";

export type NavIconKey =
  | "home"
  | "book-open"
  | "map"
  | "messages-square"
  | "wrench"
  | "clipboard-check"
  | "list-checks"
  | "award"
  | "users"
  | "bar-chart"
  | "pen-square"
  | "settings";

export interface NavItem {
  href: string;
  label: string;
  icon: NavIconKey;
  roles: Role[];
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: "home", roles: ["learner", "store_manager", "trainer", "district_leader", "admin"] },
  { href: "/learning", label: "My Learning", icon: "book-open", roles: ["learner", "store_manager", "trainer", "district_leader", "admin"] },
  { href: "/paths", label: "Learning Paths", icon: "map", roles: ["learner", "store_manager", "trainer", "district_leader", "admin"] },
  { href: "/roleplay", label: "Practice Role-Play", icon: "messages-square", roles: ["learner", "store_manager", "trainer", "district_leader", "admin"] },
  { href: "/toolkit", label: "Floor Toolkit", icon: "wrench", roles: ["learner", "store_manager", "trainer", "district_leader", "admin"] },
  { href: "/quizzes", label: "Quizzes & Drills", icon: "clipboard-check", roles: ["learner", "store_manager", "trainer", "district_leader", "admin"] },
  { href: "/tasks", label: "My Tasks", icon: "list-checks", roles: ["learner", "store_manager", "trainer", "district_leader", "admin"] },
  { href: "/certificates", label: "Certificates & Badges", icon: "award", roles: ["learner", "store_manager", "trainer", "district_leader", "admin"] },
  { href: "/coaching", label: "Team Coaching", icon: "users", roles: ["store_manager", "trainer", "district_leader", "admin"] },
  { href: "/analytics", label: "Analytics", icon: "bar-chart", roles: ["store_manager", "trainer", "district_leader", "admin"] },
  { href: "/content-studio", label: "Content Studio", icon: "pen-square", roles: ["trainer", "admin"] },
  { href: "/organization", label: "Organization Settings", icon: "settings", roles: ["admin"] },
];

export function navForRole(role: Role): NavItem[] {
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}
