export interface SeedToolkitResource {
  title: string;
  category: string;
  resourceType: "guide" | "checklist" | "script" | "comparison" | "reference";
  summary: string;
  content: { heading: string; items: string[] }[];
  tags: string[];
}

export const SEED_TOOLKIT: SeedToolkitResource[] = [
  {
    title: "4Cs Client-Language Explainer",
    category: "Product Knowledge",
    resourceType: "guide",
    summary: "Plain-language talking points for explaining Cut, Color, Clarity, and Carat weight to clients.",
    tags: ["diamonds", "4cs", "client-language"],
    content: [
      { heading: "Cut", items: ["\"This is what creates the sparkle you see across the room.\"", "Lead with cut before other Cs."] },
      { heading: "Color", items: ["\"How white the diamond appears in everyday light.\"", "Avoid reciting the full letter scale unless asked."] },
      { heading: "Clarity", items: ["\"Nearly every diamond has natural characteristics — eye-clean means they're not visible without magnification.\""] },
      { heading: "Carat", items: ["\"Carat is weight, not necessarily size — cut affects how large a stone looks.\""] },
    ],
  },
  {
    title: "Diamond Shape Comparison Guide",
    category: "Product Knowledge",
    resourceType: "comparison",
    summary: "Quick visual/verbal comparison of popular diamond shapes and what they communicate.",
    tags: ["diamonds", "shapes"],
    content: [
      { heading: "Round Brilliant", items: ["Maximum sparkle", "Most classic and versatile choice"] },
      { heading: "Oval / Pear", items: ["Elongates the finger", "Can appear larger for the same carat weight"] },
      { heading: "Cushion / Radiant", items: ["Romantic, softened brilliance", "Strong sparkle with rounded corners"] },
      { heading: "Emerald / Asscher (Step Cuts)", items: ["Hall-of-mirrors clarity effect", "Less sparkle, more clarity showcase"] },
    ],
  },
  {
    title: "Ring Setting Comparison Guide",
    category: "Bridal",
    resourceType: "comparison",
    summary: "Compare prong, bezel, halo, and three-stone settings for lifestyle fit.",
    tags: ["bridal", "settings"],
    content: [
      { heading: "Prong Setting", items: ["Maximizes light and visible stone surface", "Requires periodic prong checks"] },
      { heading: "Bezel Setting", items: ["Best protection for active lifestyles", "Sleeker, more minimal look"] },
      { heading: "Halo Setting", items: ["Adds perceived size and sparkle", "Great for smaller center stones"] },
      { heading: "Three-Stone Setting", items: ["Symbolic: past, present, future", "Popular for anniversary and engagement pieces"] },
    ],
  },
  {
    title: "Metal Comparison: 14k, 18k, Platinum",
    category: "Product Knowledge",
    resourceType: "comparison",
    summary: "Client-friendly comparison of common fine-jewelry metals.",
    tags: ["metals"],
    content: [
      { heading: "14k Gold", items: ["58.3% pure gold, more durable alloy mix", "Good for everyday-wear budgets"] },
      { heading: "18k Gold", items: ["75% pure gold, richer color", "Slightly softer than 14k"] },
      { heading: "Platinum", items: ["Denser, naturally white, hypoallergenic", "Develops a patina over time; higher price point"] },
    ],
  },
  {
    title: "Natural vs. Lab-Grown vs. Simulant Guide",
    category: "Compliance",
    resourceType: "guide",
    summary: "Accurate, disclosure-ready comparison language for stone origin conversations.",
    tags: ["disclosure", "lab-grown", "compliance"],
    content: [
      { heading: "Natural Diamond", items: ["Formed over geologic time within the earth", "Same material as lab-grown, different origin"] },
      { heading: "Lab-Grown Diamond", items: ["Same chemical and optical properties as natural", "Grown in a controlled lab environment"] },
      { heading: "Simulant (CZ, Moissanite)", items: ["Different material entirely", "Must never be described as a diamond"] },
      { heading: "Disclosure Reminder", items: ["Always disclose origin clearly before purchase."] },
    ],
  },
  {
    title: "Treatment-Disclosure Prompts",
    category: "Compliance",
    resourceType: "script",
    summary: "Approved prompts for disclosing gemstone treatments accurately.",
    tags: ["disclosure", "compliance", "colored-stones"],
    content: [
      { heading: "When treatment is documented", items: ["\"Based on what's documented for this piece, this stone has been [treatment]. I want to make sure you have accurate information.\""] },
      { heading: "When treatment is unknown", items: ["\"I don't have documented treatment information for this specific piece — let me check before we go further.\""] },
    ],
  },
  {
    title: "GIA Report Walkthrough Checklist",
    category: "Product Knowledge",
    resourceType: "checklist",
    summary: "Step-by-step checklist for walking a client through a grading report.",
    tags: ["gia", "reports"],
    content: [
      { heading: "Walkthrough Steps", items: [
        "Confirm shape and measurements",
        "Review Cut, Color, Clarity, Carat grades",
        "Explain polish and symmetry briefly",
        "Point to plotting diagram for clarity characteristics",
        "Clarify: report is not an appraisal",
      ] },
    ],
  },
  {
    title: "Colored Stone Care Guide",
    category: "Product Knowledge",
    resourceType: "reference",
    summary: "Everyday care guidance for popular colored gemstones.",
    tags: ["care", "colored-stones"],
    content: [
      { heading: "Softer Stones (Opal, Emerald, Tanzanite)", items: ["Avoid ultrasonic cleaners", "Avoid harsh chemicals and extreme temperature changes"] },
      { heading: "Harder Stones (Sapphire, Ruby)", items: ["More durable, but still avoid harsh chemical exposure and impact"] },
    ],
  },
  {
    title: "Pearl Care Guide",
    category: "Product Knowledge",
    resourceType: "reference",
    summary: "Care instructions for pearls, which require special handling.",
    tags: ["care", "pearls"],
    content: [
      { heading: "Daily Care", items: ["Put pearls on last, after perfume and hairspray", "Wipe with a soft cloth after wear", "Store separately to avoid scratching"] },
    ],
  },
  {
    title: "Discovery Question Bank",
    category: "Sales Conversation",
    resourceType: "script",
    summary: "A bank of open-ended discovery questions for various client scenarios.",
    tags: ["discovery", "sales-conversation"],
    content: [
      { heading: "General Discovery", items: ["\"Tell me about the occasion you're shopping for.\"", "\"What's caught your eye so far?\""] },
      { heading: "Bridal Discovery", items: ["\"What styles have you been drawn to on Pinterest or Instagram?\"", "\"What's most important to you — sparkle, size, or uniqueness?\""] },
    ],
  },
  {
    title: "Objection-Handling Cards",
    category: "Sales Conversation",
    resourceType: "script",
    summary: "Quick-reference reframes for the most common client objections.",
    tags: ["objections"],
    content: [
      { heading: "\"Too expensive\"", items: ["Acknowledge, then explain craftsmanship, verification, and service value."] },
      { heading: "\"Need to think about it\"", items: ["Ask what information would help them feel confident, rather than pressuring."] },
      { heading: "\"Saw it cheaper elsewhere\"", items: ["Stay respectful of competitors; focus on your store's unique value."] },
    ],
  },
  {
    title: "Closing-Question Bank",
    category: "Sales Conversation",
    resourceType: "script",
    summary: "Ethical, pressure-free closing questions for various buying signals.",
    tags: ["closing"],
    content: [
      { heading: "Direct Closes", items: ["\"Would you like me to start the paperwork on this one?\"", "\"Should we get this sized for you today?\""] },
    ],
  },
  {
    title: "Bridal Appointment Checklist",
    category: "Bridal",
    resourceType: "checklist",
    summary: "Preparation checklist for running a great bridal appointment.",
    tags: ["bridal", "appointments"],
    content: [
      { heading: "Before the Appointment", items: [
        "Confirm appointment and review prior CRM notes",
        "Prepare a private, comfortable space",
        "Stage a few pieces based on known preferences",
      ] },
      { heading: "During the Appointment", items: [
        "Clarify decision-maker if multiple people attend",
        "Ask about budget comfort range",
        "Discuss setting and style preferences",
      ] },
    ],
  },
  {
    title: "Clienteling Follow-Up Templates",
    category: "Clienteling",
    resourceType: "script",
    summary: "Templates for thank-you, check-in, and occasion-reminder messages.",
    tags: ["clienteling", "crm"],
    content: [
      { heading: "Thank-You (within 24 hours)", items: ["\"It was wonderful meeting you today — thank you for stopping by Aurelia.\""] },
      { heading: "Check-In (2 weeks)", items: ["\"I wanted to check in and see how you're enjoying your new piece!\""] },
      { heading: "Occasion Reminder", items: ["\"Your anniversary is coming up — would you like to see a few new arrivals?\""] },
    ],
  },
  {
    title: "Store Opening & Closing Checklist",
    category: "Operations",
    resourceType: "checklist",
    summary: "Standard daily opening and closing procedure checklist.",
    tags: ["operations", "security"],
    content: [
      { heading: "Opening", items: ["Two-person verification for safe/case unlock", "Visual case inspection against prior night's count", "Log alarm deactivation", "Team huddle on daily goals"] },
      { heading: "Closing", items: ["Secure all cases and safes", "Complete count reconciliation", "Verify alarm activation", "Document any discrepancies immediately"] },
    ],
  },
  {
    title: "Case-Count & Cycle-Count Checklist",
    category: "Operations",
    resourceType: "checklist",
    summary: "Step-by-step guidance for accurate inventory counts.",
    tags: ["operations", "inventory"],
    content: [
      { heading: "Best Practices", items: [
        "Count with a second person when possible",
        "Use a consistent counting order",
        "Report discrepancies immediately to a manager",
      ] },
    ],
  },
  {
    title: "Manager Daily Huddle Planner",
    category: "Leadership",
    resourceType: "checklist",
    summary: "A simple planner for running an effective pre-shift huddle.",
    tags: ["leadership", "operations"],
    content: [
      { heading: "Huddle Agenda (5–10 min)", items: [
        "Yesterday's wins",
        "Today's goal and focus skill",
        "Any operational updates",
        "Quick motivational close",
      ] },
    ],
  },
  {
    title: "Retail KPI Formula Reference",
    category: "Leadership",
    resourceType: "reference",
    summary: "Sample formulas for common retail KPIs used in training (not live business data).",
    tags: ["kpi", "leadership"],
    content: [
      { heading: "Conversion Rate", items: ["Transactions ÷ Visitors × 100"] },
      { heading: "Average Ticket", items: ["Total Sales ÷ Number of Transactions"] },
      { heading: "Units Per Transaction (UPT)", items: ["Total Units Sold ÷ Number of Transactions"] },
      { heading: "Note", items: ["These are sample training formulas for learning purposes only."] },
    ],
  },
];
