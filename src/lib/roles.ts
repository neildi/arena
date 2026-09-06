import type { Role } from "./auth";

export const ROLE_LABELS: Record<Role, string> = {
  learner: "Learner",
  store_manager: "Store Manager",
  trainer: "Trainer / L&D Lead",
  district_leader: "District Leader",
  admin: "Administrator",
};
