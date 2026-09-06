export interface SeedFloorTask {
  title: string;
  description: string;
  skillTag: string;
  courseKey?: string;
}

export const SEED_FLOOR_TASKS: SeedFloorTask[] = [
  { title: "Practice a discovery opener with three clients", description: "Use an open-ended discovery question with at least three different clients during your shift.", skillTag: "discovery_questions", courseKey: "fine-jewelry-sales-conversation" },
  { title: "Explain the 4Cs using two products from the case", description: "Choose two different diamonds and explain the 4Cs to a client or teammate using plain client language.", skillTag: "diamond_gemstone_knowledge", courseKey: "diamond-gemstone-fluency" },
  { title: "Use approved natural-vs-lab-grown comparison language", description: "The next time a client asks about lab-grown diamonds, use the approved comparison language from the toolkit.", skillTag: "compliance_awareness", courseKey: "diamond-gemstone-fluency" },
  { title: "Record five high-quality CRM client notes", description: "Log five CRM notes capturing occasion, preferences, and next steps for real client interactions.", skillTag: "clienteling", courseKey: "fine-jewelry-sales-conversation" },
  { title: "Use one ethical closing technique", description: "Practice recognizing a buying signal and use a direct, pressure-free closing question.", skillTag: "ethical_closing", courseKey: "fine-jewelry-sales-conversation" },
  { title: "Complete a bridal appointment-preparation checklist", description: "Before your next bridal appointment, complete the full preparation checklist from the toolkit.", skillTag: "bridal", courseKey: "bridal-engagement-mastery" },
  { title: "Perform a cycle-count task with a manager", description: "Complete a scheduled cycle count alongside your manager, following the checklist.", skillTag: "store_operations", courseKey: "store-operations-retail-kpis" },
  { title: "Lead a pre-shift huddle", description: "Use the manager daily huddle planner to lead a team huddle before your shift.", skillTag: "leadership", courseKey: "store-operations-retail-kpis" },
  { title: "Practice the ring-setting comparison with a bridal client", description: "Use the ring-setting comparison guide to help a bridal client choose between two settings.", skillTag: "bridal", courseKey: "bridal-engagement-mastery" },
  { title: "Give pearl or colored-stone care guidance", description: "Share pearl or colored-stone care talking points with a client during a purchase or service visit.", skillTag: "diamond_gemstone_knowledge", courseKey: "diamond-gemstone-fluency" },
  { title: "Handle a live price objection", description: "Use the objection-handling cards to navigate a real price-related question from a client.", skillTag: "objection_handling", courseKey: "fine-jewelry-sales-conversation" },
  { title: "Walk a client through a GIA report", description: "Use the GIA Report Walkthrough Checklist with an actual client this week.", skillTag: "product_accuracy", courseKey: "diamond-gemstone-fluency" },
  { title: "Complete a treatment-disclosure conversation", description: "Use the treatment-disclosure prompts accurately with a colored-stone client.", skillTag: "compliance_awareness", courseKey: "diamond-gemstone-fluency" },
  { title: "Calculate your store's daily conversion rate", description: "Using the KPI formula reference, calculate your store's conversion rate for a sample day.", skillTag: "kpis", courseKey: "store-operations-retail-kpis" },
  { title: "Complete an opening or closing checklist walkthrough", description: "Shadow or lead a full opening or closing procedure using the checklist.", skillTag: "security", courseKey: "store-operations-retail-kpis" },
  { title: "Have a budget-comfort conversation", description: "Practice the budget-comfort discovery question with a real bridal client.", skillTag: "bridal", courseKey: "bridal-engagement-mastery" },
  { title: "Introduce the custom design process", description: "Introduce a client to the custom design process when off-the-shelf options don't fit.", skillTag: "bridal", courseKey: "bridal-engagement-mastery" },
  { title: "Facilitate a peer role-play session", description: "Run a role-play practice session for a teammate and give SBI-model feedback.", skillTag: "coaching", courseKey: "training-design-roleplay-facilitation" },
  { title: "Draft a new coaching rubric", description: "Draft a rubric with specific, observable criteria for a role-play scenario.", skillTag: "coaching", courseKey: "training-design-roleplay-facilitation" },
  { title: "Review a team member's KPI trend", description: "Identify one coaching opportunity using a team member's KPI data and the GROW model.", skillTag: "coaching", courseKey: "store-operations-retail-kpis" },
];

export interface SeedKpiDefinition {
  key: string;
  title: string;
  description: string;
  formula: string;
  unit: string;
}

export const SEED_KPI_DEFINITIONS: SeedKpiDefinition[] = [
  { key: "conversion", title: "Conversion Rate", description: "Percentage of visitors who complete a purchase.", formula: "Transactions ÷ Visitors × 100", unit: "%" },
  { key: "average_ticket", title: "Average Ticket", description: "Average dollar value of a completed transaction.", formula: "Total Sales ÷ Number of Transactions", unit: "$" },
  { key: "units_per_transaction", title: "Units per Transaction (UPT)", description: "Average number of items sold per completed sale.", formula: "Total Units Sold ÷ Number of Transactions", unit: "units" },
  { key: "client_book_growth", title: "Client Book Growth", description: "Growth rate of an associate's active client relationships.", formula: "(New Clients − Lost Clients) ÷ Starting Clients × 100", unit: "%" },
  { key: "appointment_conversion", title: "Appointment Conversion", description: "Percentage of scheduled appointments resulting in a sale.", formula: "Appointments Converted ÷ Appointments Held × 100", unit: "%" },
  { key: "bridal_conversion", title: "Bridal Conversion", description: "Percentage of bridal consultations resulting in a sale.", formula: "Bridal Sales ÷ Bridal Consultations × 100", unit: "%" },
  { key: "band_attachment", title: "Band Attachment Rate", description: "Percentage of engagement ring sales that include a wedding band.", formula: "Band Attachments ÷ Engagement Ring Sales × 100", unit: "%" },
  { key: "repeat_client_rate", title: "Repeat Client Rate", description: "Percentage of sales made to returning clients.", formula: "Repeat Client Sales ÷ Total Sales × 100", unit: "%" },
  { key: "sales_vs_plan", title: "Sales vs. Plan", description: "Actual sales performance compared to plan/target.", formula: "Actual Sales ÷ Planned Sales × 100", unit: "%" },
  { key: "shrink", title: "Shrink", description: "Inventory loss as a percentage of total inventory value.", formula: "Inventory Loss ÷ Total Inventory Value × 100", unit: "%" },
  { key: "staff_turnover", title: "Staff Turnover", description: "Rate of staff departures over a period.", formula: "Departures ÷ Average Headcount × 100", unit: "%" },
  { key: "role_play_readiness", title: "Role-Play Readiness Score", description: "Average role-play rubric score, indicating client-conversation readiness.", formula: "Average of Role-Play Rubric Scores", unit: "score" },
];
