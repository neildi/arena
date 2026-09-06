export interface SeedBadge {
  key: string;
  title: string;
  description: string;
  level: "course_completion" | "demonstrated_skill" | "manager_verified";
  icon: string;
  criteria: string;
}

export const SEED_BADGES: SeedBadge[] = [
  { key: "4cs-client-explainer", title: "4Cs Client Explainer", description: "Demonstrated clear, accurate 4Cs explanations using client-friendly language.", level: "demonstrated_skill", icon: "gem", criteria: "Complete 4Cs lesson quiz and floor task." },
  { key: "diamond-report-interpreter", title: "Diamond Report Interpreter", description: "Can confidently walk a client through a grading report.", level: "course_completion", icon: "file-check", criteria: "Complete Diamond & Gemstone Fluency course." },
  { key: "ethical-objection-handler", title: "Ethical Objection Handler", description: "Handles objections with empathy and integrity, without pressure tactics.", level: "demonstrated_skill", icon: "shield-check", criteria: "Score 80+ on an objection-handling role-play." },
  { key: "lab-grown-disclosure-ready", title: "Lab-Grown Disclosure Ready", description: "Accurately and transparently discusses natural vs. lab-grown vs. simulant stones.", level: "demonstrated_skill", icon: "sparkles", criteria: "Pass the lab-grown disclosure role-play and quiz." },
  { key: "bridal-appointment-ready", title: "Bridal Appointment Ready", description: "Prepared to run a full, client-centered bridal appointment.", level: "course_completion", icon: "heart", criteria: "Complete Bridal & Engagement Mastery course." },
  { key: "clienteling-cadence-builder", title: "Clienteling Cadence Builder", description: "Builds strong, consistent client follow-up habits.", level: "demonstrated_skill", icon: "users", criteria: "Log 5 high-quality CRM notes as a floor task." },
  { key: "high-ticket-travel-retail-closer", title: "High-Ticket Travel Retail Closer", description: "Delivers an efficient, ethical experience under time constraints.", level: "manager_verified", icon: "plane", criteria: "Manager-verified travel-retail role-play and floor demonstration." },
  { key: "store-operations-ready", title: "Store Operations Ready", description: "Understands and applies opening, closing, and security procedures.", level: "course_completion", icon: "shield", criteria: "Complete Store Operations & Retail KPIs course." },
  { key: "kpi-dashboard-builder", title: "KPI Dashboard Builder", description: "Confidently reads and applies retail KPI data for coaching.", level: "demonstrated_skill", icon: "bar-chart", criteria: "Complete KPI calculation exercises with a passing score." },
  { key: "coach-roleplay-facilitator", title: "Coach & Role-Play Facilitator", description: "Facilitates effective, psychologically safe role-play coaching sessions.", level: "manager_verified", icon: "graduation-cap", criteria: "Manager/trainer-verified role-play facilitation observation." },
  { key: "gemstone-terminology-master", title: "Gemstone Terminology Master", description: "Fluent in diamond and gemstone terminology.", level: "course_completion", icon: "book-open", criteria: "Score 90+ on the terminology drill." },
  { key: "compliance-aware-associate", title: "Compliance-Aware Associate", description: "Consistently applies compliance-aware language across disclosures.", level: "demonstrated_skill", icon: "check-shield", criteria: "Pass all compliance-flagged quiz questions across courses." },
];
