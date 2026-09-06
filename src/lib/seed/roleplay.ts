export interface SeedRolePlay {
  title: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  clientOpening: string;
  situation: string;
  persona: string;
  skillTags: string[];
  guardrails: string[];
}

export const SEED_ROLEPLAYS: SeedRolePlay[] = [
  {
    title: "\"I'm just looking.\"",
    category: "Discovery",
    difficulty: "beginner",
    clientOpening: "I'm just looking, thanks.",
    situation: "A client has just walked into the boutique and gives a common deflecting opener.",
    persona: "A slightly guarded browser who is actually shopping for an anniversary gift but hasn't decided to engage yet.",
    skillTags: ["discovery_questions", "empathy_trust"],
    guardrails: ["Do not pressure the client to buy immediately.", "Do not fabricate urgency or scarcity."],
  },
  {
    title: "\"Why is this more expensive than online?\"",
    category: "Objection Handling",
    difficulty: "intermediate",
    clientOpening: "I saw this exact style online for way less. Why is this so much more expensive here?",
    situation: "A client is comparing an in-store piece to an online listing and is skeptical of the price difference.",
    persona: "A price-conscious but genuinely interested client who wants to understand the value difference.",
    skillTags: ["objection_handling", "product_accuracy"],
    guardrails: ["Do not disparage competitors.", "Do not invent discounts to match an unverified online price."],
  },
  {
    title: "\"I need to think about it.\"",
    category: "Objection Handling",
    difficulty: "beginner",
    clientOpening: "This is beautiful, but I think I need to go home and think about it.",
    situation: "A client has spent significant time with a product and is hesitant to commit today.",
    persona: "An interested but cautious client who dislikes feeling pressured into big decisions.",
    skillTags: ["objection_handling", "ethical_closing"],
    guardrails: ["Do not use high-pressure tactics.", "Do not fabricate limited-time offers."],
  },
  {
    title: "\"Can you give me a better price?\"",
    category: "Objection Handling",
    difficulty: "intermediate",
    clientOpening: "Is this your best price, or can you do better?",
    situation: "A client is negotiating on price directly.",
    persona: "A confident negotiator who has shopped around and wants to feel like they got a good deal.",
    skillTags: ["objection_handling", "ethical_closing"],
    guardrails: ["Do not promise discounts beyond authorized store policy.", "Be honest about current pricing and promotions."],
  },
  {
    title: "\"Is lab-grown a real diamond?\"",
    category: "Product Knowledge",
    difficulty: "beginner",
    clientOpening: "Is lab-grown even a real diamond, or is it fake?",
    situation: "A client is comparing natural and lab-grown diamonds and wants an honest, clear answer.",
    persona: "A curious, slightly skeptical client who wants factual information without sales spin.",
    skillTags: ["product_accuracy", "compliance_awareness"],
    guardrails: ["Disclose accurately that lab-grown diamonds share natural diamonds' properties but differ in origin.", "Do not describe simulants as diamonds."],
  },
  {
    title: "\"My partner needs to approve this.\"",
    category: "Bridal",
    difficulty: "intermediate",
    clientOpening: "I love it, but my partner really needs to see this before we decide.",
    situation: "A bridal client wants to involve a partner in the decision before committing.",
    persona: "An engaged, enthusiastic bridal shopper who values her partner's input.",
    skillTags: ["bridal", "empathy_trust", "ethical_closing"],
    guardrails: ["Do not pressure the client to decide without their partner.", "Offer helpful next steps like scheduling a joint visit or sharing details."],
  },
  {
    title: "\"I saw a similar ring at another store.\"",
    category: "Objection Handling",
    difficulty: "advanced",
    clientOpening: "Honestly, I saw something really similar at another store down the street.",
    situation: "A client is comparison shopping between competitors.",
    persona: "A client testing whether this store offers something meaningfully different.",
    skillTags: ["objection_handling", "feature_benefit_emotion"],
    guardrails: ["Do not disparage competitors.", "Focus on your store's genuine value and service."],
  },
  {
    title: "\"What does this inclusion mean?\"",
    category: "Product Knowledge",
    difficulty: "intermediate",
    clientOpening: "I noticed something inside the stone under the loupe — what does this inclusion mean?",
    situation: "A client is examining a diamond closely and has questions about a visible characteristic.",
    persona: "A detail-oriented client who wants an honest, technical-but-clear explanation.",
    skillTags: ["product_accuracy", "plain_language"],
    guardrails: ["Do not overstate or understate the significance of the inclusion.", "Do not provide a specific appraisal value."],
  },
  {
    title: "\"We only have 20 minutes before boarding.\"",
    category: "Travel Retail",
    difficulty: "advanced",
    clientOpening: "We're actually on a really tight schedule — we only have about 20 minutes before we need to be back on the ship.",
    situation: "A cruise/travel-retail client is time-constrained and needs an efficient, high-quality experience.",
    persona: "A time-pressured but genuinely interested cruise passenger who dislikes feeling rushed or pressured.",
    skillTags: ["discovery_questions", "ethical_closing", "empathy_trust"],
    guardrails: ["Do not use time pressure manipulatively.", "Stay efficient without skipping essential disclosures."],
  },
  {
    title: "\"I want to trade in an inherited ring.\"",
    category: "Estate & Trade-In",
    difficulty: "advanced",
    clientOpening: "This ring belonged to my grandmother. I'd like to see what I could trade it in for toward something new.",
    situation: "A client wants to discuss trading in a sentimental, inherited piece.",
    persona: "An emotionally invested client balancing sentimentality with practical interest in a new piece.",
    skillTags: ["empathy_trust", "compliance_awareness"],
    guardrails: ["Do not state a specific trade-in value without the store's evaluation process.", "Acknowledge sentimental value respectfully."],
  },
];
