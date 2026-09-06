// Seed content: learning paths, courses, modules, lessons, flashcards, quizzes.
// All content is realistic but fictional demo training material for Aurelia Fine Jewelry Academy.

export interface SeedLesson {
  title: string;
  summary: string;
  sections: { heading: string; body: string }[];
  keyTerms: { term: string; definition: string }[];
  clientLanguage: string[];
  floorTaskHints: string[];
  scripts: { title: string; dialogue: string }[];
  complianceNotes: string[];
  estimatedMinutes: number;
}

export interface SeedModule {
  title: string;
  lessons: SeedLesson[];
}

export interface SeedCourse {
  key: string;
  title: string;
  slug: string;
  track: "foundations" | "specialist" | "leadership" | "trainer";
  description: string;
  outcomes: string[];
  skillTags: string[];
  kpiAreas: string[];
  estimatedMinutes: number;
  modules: SeedModule[];
  flashcards: { front: string; back: string }[];
  quizTitle: string;
  quizQuestions: {
    type: "multiple_choice" | "true_false" | "scenario" | "best_response";
    prompt: string;
    options?: string[];
    correct: string;
    explanation: string;
    skillTag: string;
  }[];
}

const COMPLIANCE_GENERIC =
  "Follow your store policy and local regulations. Do not make promises about approvals, valuations, or legal requirements.";

export const SEED_COURSES: SeedCourse[] = [
  {
    key: "diamond-gemstone-fluency",
    title: "Diamond & Gemstone Fluency",
    slug: "diamond-gemstone-fluency",
    track: "foundations",
    description:
      "Build confident, accurate product knowledge across diamonds and colored gemstones so you can explain quality factors in plain, client-friendly language.",
    outcomes: [
      "Explain the 4Cs using client-facing, plain language",
      "Compare diamond shapes and cuts with confidence",
      "Walk a client through a GIA report without overpromising",
      "Discuss natural, lab-grown, and simulant stones accurately",
      "Give basic colored-stone and pearl care guidance",
    ],
    skillTags: [
      "diamond_gemstone_knowledge",
      "product_accuracy",
      "compliance_awareness",
    ],
    kpiAreas: ["conversion", "average_ticket", "units_per_transaction"],
    estimatedMinutes: 95,
    modules: [
      {
        title: "The 4Cs and Grading Reports",
        lessons: [
          {
            title: "The 4Cs Client-Language Explainer",
            summary:
              "Translate cut, color, clarity, and carat weight into language clients actually understand and care about.",
            sections: [
              {
                heading: "Why the 4Cs matter to a client, not just a jeweler",
                body: "Clients don't buy grading terminology — they buy sparkle, meaning, and confidence. Your job is to translate the 4Cs (Cut, Color, Clarity, Carat weight) into what the client will actually notice and feel. Lead with Cut, because it has the greatest impact on the brilliance a client sees across the room.",
              },
              {
                heading: "Cut: the C that creates the sparkle",
                body: "Cut refers to how well a diamond's facets interact with light — not just its shape. A well-cut stone returns more brilliance and fire. When describing cut, use plain words like 'sparkle,' 'brilliance,' and 'light performance' before introducing the grading term.",
              },
              {
                heading: "Color and clarity in plain language",
                body: "Color grades run from colorless to light yellow; most clients cannot distinguish between adjacent grades with the naked eye, so focus on 'how white it appears in everyday light' rather than reciting the alphabet scale. Clarity describes internal and surface characteristics; explain that nearly every diamond has some natural characteristics, and that 'eye-clean' means they aren't visible without magnification.",
              },
              {
                heading: "Carat weight is not the whole story",
                body: "Carat weight measures mass, not size or beauty. Two diamonds of the same carat weight can look different sizes depending on cut proportions. Help clients see that balancing all 4Cs against their budget delivers the best-looking stone for their money, rather than chasing carat weight alone.",
              },
            ],
            keyTerms: [
              { term: "Cut", definition: "How well a diamond's proportions and facets allow it to reflect light." },
              { term: "Color grade", definition: "A scale describing the presence or absence of color in a white diamond, from colorless to light yellow." },
              { term: "Clarity", definition: "A measure of internal and external characteristics (inclusions and blemishes)." },
              { term: "Carat", definition: "A unit of weight equal to 0.2 grams, used to describe a gemstone's mass." },
              { term: "Eye-clean", definition: "A diamond whose inclusions are not visible to the unaided eye." },
            ],
            clientLanguage: [
              "\"This cut is what creates that bright sparkle you're seeing — it's often the single biggest factor in how a diamond looks in person.\"",
              "\"Every diamond has some natural characteristics from how it was formed — what matters is whether they're visible to the eye.\"",
              "\"Carat weight tells us the size, but the cut tells us how alive it looks.\"",
            ],
            floorTaskHints: [
              "Explain the 4Cs using two products from the case with a real client or teammate.",
            ],
            scripts: [
              {
                title: "Opening the 4Cs conversation",
                dialogue:
                  "Associate: \"A lot of people ask me what actually makes one diamond look different from another — would it help if I walked you through what to look for?\"\nClient: \"Sure, I've heard of the 4Cs but don't really get it.\"\nAssociate: \"Happy to break it down simply — let's start with the one that affects sparkle the most...\"",
              },
            ],
            complianceNotes: [
              COMPLIANCE_GENERIC,
              "Do not state or imply a specific resale or appraisal value when discussing grading factors.",
            ],
            estimatedMinutes: 12,
          },
          {
            title: "Diamond Shapes & Cuts Comparison",
            summary:
              "Learn the visual and lifestyle differences between popular diamond shapes so you can guide clients toward the right fit.",
            sections: [
              {
                heading: "Shape vs. cut — a common client mix-up",
                body: "Clients often use 'cut' and 'shape' interchangeably. Shape refers to the outline (round, oval, cushion, emerald, etc.), while cut refers to light performance. Clarify this gently early in the conversation.",
              },
              {
                heading: "Popular shapes and what they communicate",
                body: "Round brilliant maximizes sparkle and is the most classic choice. Oval and pear elongate the finger. Cushion and radiant offer a romantic, softened look with strong brilliance. Emerald and asscher (step cuts) show off clarity with a hall-of-mirrors effect rather than intense sparkle.",
              },
              {
                heading: "Matching shape to lifestyle and hand",
                body: "Ask about daily activities, hand shape, and existing jewelry style before recommending a shape. An active lifestyle may favor a low-profile setting regardless of shape; a client who loves vintage aesthetics may gravitate to step cuts or old-mine cushion shapes.",
              },
            ],
            keyTerms: [
              { term: "Shape", definition: "The outline of a diamond, such as round, oval, or emerald." },
              { term: "Brilliant cut", definition: "A faceting style designed to maximize light return and sparkle." },
              { term: "Step cut", definition: "A faceting style with long, rectangular facets that emphasize clarity over sparkle." },
            ],
            clientLanguage: [
              "\"Shape is about the outline you love — cut is about how it performs with light. You can have a beautifully cut diamond in almost any shape.\"",
              "\"An oval can make the finger look longer, while a cushion has that romantic, softened sparkle.\"",
            ],
            floorTaskHints: [
              "Compare two diamond shapes side-by-side with a client and note their reaction.",
            ],
            scripts: [
              {
                title: "Guiding a shape decision",
                dialogue:
                  "Client: \"I can't decide between round and oval.\"\nAssociate: \"Both are beautiful — round gives you that classic maximum-sparkle look, while oval tends to look larger for the same carat weight and can elongate the finger. Do you tend to prefer classic or a little more unique?\"",
              },
            ],
            complianceNotes: [COMPLIANCE_GENERIC],
            estimatedMinutes: 10,
          },
          {
            title: "Reading a GIA Report With Confidence",
            summary:
              "Walk clients through a grading report step by step without overstating what the report guarantees.",
            sections: [
              {
                heading: "What a grading report is — and isn't",
                body: "A GIA (or equivalent gemological lab) report is an independent, unbiased description of a diamond's characteristics. It is not an appraisal and does not state a monetary value. Always clarify this distinction with clients.",
              },
              {
                heading: "Walking the report top to bottom",
                body: "Start with shape and measurements, then move to the 4Cs grades, then additional details like polish, symmetry, and fluorescence. Point to the plotting diagram to show (in general terms) where characteristics are located, without claiming to identify the exact stone from memory.",
              },
              {
                heading: "What to say — and what to avoid",
                body: "Say: 'This report was issued by an independent lab and describes this stone's specific characteristics.' Avoid: any statement suggesting the report guarantees investment value, resale price, or insurance value — those require a separate, qualified appraisal.",
              },
            ],
            keyTerms: [
              { term: "Grading report", definition: "An independent document describing a diamond's characteristics, issued by a gemological laboratory." },
              { term: "Plotting diagram", definition: "A map on a grading report showing the approximate location of clarity characteristics." },
              { term: "Fluorescence", definition: "The visible glow some diamonds emit under ultraviolet light." },
            ],
            clientLanguage: [
              "\"This report comes from an independent lab, so it's not our opinion — it's a documented, third-party description of this stone.\"",
              "\"If you'd like a value for insurance purposes, that's a separate appraisal step we can help you arrange.\"",
            ],
            floorTaskHints: [
              "Practice a full GIA report walkthrough with a colleague using the toolkit checklist.",
            ],
            scripts: [
              {
                title: "Explaining a report is not an appraisal",
                dialogue:
                  "Client: \"So this report says it's worth $8,000?\"\nAssociate: \"Good question — a grading report actually describes the stone's characteristics rather than assigning a dollar value. For insurance purposes, we can help you arrange a separate appraisal.\"",
              },
            ],
            complianceNotes: [
              COMPLIANCE_GENERIC,
              "Never state or imply an appraisal value based on a grading report alone.",
            ],
            estimatedMinutes: 14,
          },
        ],
      },
      {
        title: "Beyond Diamonds",
        lessons: [
          {
            title: "Natural, Lab-Grown & Simulant: An Honest Conversation Guide",
            summary:
              "Give clients accurate, non-judgmental comparisons between natural diamonds, lab-grown diamonds, and simulants like cubic zirconia or moissanite.",
            sections: [
              {
                heading: "Same material, different origin",
                body: "Lab-grown diamonds have essentially the same chemical, physical, and optical properties as natural diamonds — the difference is origin (grown in a controlled lab environment vs. formed naturally over geologic time). Simulants like cubic zirconia and moissanite are different materials entirely that merely resemble diamond.",
              },
              {
                heading: "Disclosure is non-negotiable",
                body: "Always clearly disclose whether a stone is natural, lab-grown, or a simulant — this is a compliance requirement in most markets, not just good practice. Never let a client leave uncertain about what they purchased.",
              },
              {
                heading: "Presenting options without judgment",
                body: "Some clients prioritize rarity and natural origin; others prioritize value or values-based reasons for choosing lab-grown. Present the facts evenly and let the client decide — avoid language that shames either choice.",
              },
            ],
            keyTerms: [
              { term: "Lab-grown diamond", definition: "A diamond grown in a controlled laboratory environment with the same essential properties as a natural diamond." },
              { term: "Simulant", definition: "A stone such as cubic zirconia or moissanite that visually resembles a diamond but has different material properties." },
              { term: "Disclosure", definition: "Clearly informing a client of a product's material origin and treatments." },
            ],
            clientLanguage: [
              "\"Is lab-grown a real diamond?\" — \"Yes — lab-grown diamonds have the same chemical and optical properties as natural diamonds. The difference is where they were formed: a controlled lab versus deep within the earth over billions of years.\"",
              "\"A simulant like moissanite or cubic zirconia looks similar but is a different material altogether — I'll always be upfront about which one you're looking at.\"",
            ],
            floorTaskHints: [
              "Use the approved natural-vs-lab-grown comparison language with an actual client this week.",
            ],
            scripts: [
              {
                title: "Answering 'Is lab-grown a real diamond?'",
                dialogue:
                  "Client: \"Is lab-grown even a real diamond?\"\nAssociate: \"Great question — yes, it is a real diamond chemically and optically. The only difference is where it was created. Would it help if I showed you both side by side?\"",
              },
            ],
            complianceNotes: [
              COMPLIANCE_GENERIC,
              "Always disclose stone origin and any treatments. Do not describe a simulant as a diamond.",
            ],
            estimatedMinutes: 12,
          },
          {
            title: "Colored Gemstone & Pearl Care Essentials",
            summary:
              "Learn the care basics for popular colored stones and pearls so you can set clients up for long-term satisfaction.",
            sections: [
              {
                heading: "Treatments and disclosure",
                body: "Many colored gemstones (such as most sapphires and emeralds) are commonly treated to improve color or clarity. Always disclose known treatments using approved store language, and avoid guessing about a specific stone's treatment status if it isn't documented.",
              },
              {
                heading: "Everyday care guidance",
                body: "Softer stones (opal, pearl, emerald, tanzanite) need gentler handling — avoid ultrasonic cleaners and harsh chemicals. Harder stones (sapphire, ruby) tolerate more, but should still avoid harsh chemical exposure and impact.",
              },
              {
                heading: "Pearls need special attention",
                body: "Pearls are organic and can be damaged by perfume, hairspray, and perspiration. Recommend clients put pearls on last when getting ready and wipe them with a soft cloth after wear.",
              },
            ],
            keyTerms: [
              { term: "Treatment", definition: "A process applied to a gemstone to enhance its color, clarity, or durability." },
              { term: "Mohs hardness", definition: "A relative scale used to describe a gemstone's resistance to scratching." },
              { term: "Nacre", definition: "The lustrous organic substance that forms a pearl." },
            ],
            clientLanguage: [
              "\"Many colored gemstones are treated to bring out their color — I'll always let you know what's documented for the piece you're considering.\"",
              "\"Pearls love to go on last and come off first — perfume and hairspray aren't their friends.\"",
            ],
            floorTaskHints: [
              "Give a client the pearl care guide talking points during a purchase or service visit.",
            ],
            scripts: [
              {
                title: "Disclosing a treatment",
                dialogue:
                  "Client: \"Is this sapphire treated?\"\nAssociate: \"That's an important question. Based on what's documented for this piece, [state known treatment status]. I want to make sure you have accurate information before you decide.\"",
              },
            ],
            complianceNotes: [
              COMPLIANCE_GENERIC,
              "Only state treatment information that is documented for the specific piece — do not guess.",
            ],
            estimatedMinutes: 11,
          },
        ],
      },
    ],
    flashcards: [
      { front: "What are the 4Cs of diamond quality?", back: "Cut, Color, Clarity, and Carat weight." },
      { front: "Which C most affects a diamond's sparkle?", back: "Cut — it determines how well the stone returns light." },
      { front: "What does 'eye-clean' mean?", back: "Inclusions are not visible to the unaided eye." },
      { front: "What is a grading report?", back: "An independent lab document describing a diamond's characteristics — not an appraisal." },
      { front: "What is fluorescence?", back: "A visible glow some diamonds emit under UV light." },
      { front: "Name two step-cut diamond shapes.", back: "Emerald cut and Asscher cut." },
      { front: "What is the essential difference between natural and lab-grown diamonds?", back: "Origin — lab-grown diamonds share the same chemical and optical properties but are grown in a controlled lab." },
      { front: "Name two common diamond simulants.", back: "Cubic zirconia and moissanite." },
      { front: "Why should ultrasonic cleaners be avoided on some stones?", back: "Softer or treated stones (like opal, pearl, emerald) can be damaged by vibration and heat." },
      { front: "What should clients do with pearls before applying perfume?", back: "Nothing — pearls should go on last, after perfume and hairspray are applied." },
    ],
    quizTitle: "Diamond & Gemstone Fluency: Final Assessment",
    quizQuestions: [
      { type: "multiple_choice", prompt: "Which of the 4Cs most directly affects a diamond's sparkle?", options: ["Carat", "Cut", "Color", "Clarity"], correct: "Cut", explanation: "Cut governs how well the diamond's facets return light, making it the primary driver of sparkle.", skillTag: "diamond_gemstone_knowledge" },
      { type: "true_false", prompt: "A GIA grading report states a diamond's monetary value.", options: ["True", "False"], correct: "False", explanation: "A grading report describes characteristics; it does not assign a dollar value. Appraisals are separate.", skillTag: "compliance_awareness" },
      { type: "multiple_choice", prompt: "Which diamond shape is a 'step cut'?", options: ["Round", "Emerald", "Cushion", "Pear"], correct: "Emerald", explanation: "Emerald cut uses long rectangular step facets rather than brilliant faceting.", skillTag: "diamond_gemstone_knowledge" },
      { type: "scenario", prompt: "A client asks if lab-grown diamonds are 'fake.' What is the most accurate response?", options: ["Yes, they are imitation diamonds", "They are chemically and optically the same as natural diamonds; the difference is origin", "They are only used in inexpensive jewelry", "There is no way to tell them apart from natural diamonds"], correct: "They are chemically and optically the same as natural diamonds; the difference is origin", explanation: "Lab-grown diamonds share the same fundamental properties as natural diamonds; origin is the distinguishing factor and must be disclosed.", skillTag: "compliance_awareness" },
      { type: "true_false", prompt: "Carat weight alone determines how large a diamond appears.", options: ["True", "False"], correct: "False", explanation: "Cut proportions significantly affect perceived size; two diamonds of equal carat weight can look different sizes.", skillTag: "diamond_gemstone_knowledge" },
      { type: "multiple_choice", prompt: "What should you always do when selling a treated gemstone?", options: ["Avoid mentioning treatment unless asked", "Disclose known, documented treatments", "Assume all sapphires are untreated", "Estimate the treatment type visually"], correct: "Disclose known, documented treatments", explanation: "Disclosure of documented treatments is an ethical and often legal requirement.", skillTag: "compliance_awareness" },
      { type: "best_response", prompt: "A client asks 'What is this inclusion?' while looking at a loupe image. What is the best response?", options: ["\"It's nothing to worry about, ignore it.\"", "\"That's a natural characteristic formed when the diamond was created — let me show you where it is on the report and what it means for how the stone looks.\"", "\"I'm not sure, but it won't affect value.\"", "\"Only cheap diamonds have inclusions.\""], correct: "\"That's a natural characteristic formed when the diamond was created — let me show you where it is on the report and what it means for how the stone looks.\"", explanation: "This response is accurate, transparent, and client-friendly without overstating or dismissing the client's question.", skillTag: "product_accuracy" },
      { type: "multiple_choice", prompt: "Which organic gem material is especially sensitive to perfume and hairspray?", options: ["Sapphire", "Pearl", "Ruby", "Diamond"], correct: "Pearl", explanation: "Pearls are organic and porous, making them vulnerable to chemical exposure.", skillTag: "diamond_gemstone_knowledge" },
      { type: "true_false", prompt: "Moissanite is a type of diamond.", options: ["True", "False"], correct: "False", explanation: "Moissanite is a distinct mineral (silicon carbide) used as a diamond simulant, not a diamond.", skillTag: "product_accuracy" },
      { type: "multiple_choice", prompt: "On a grading report, what does the plotting diagram show?", options: ["The diamond's price history", "The approximate location of clarity characteristics", "The store's return policy", "The diamond's carat weight only"], correct: "The approximate location of clarity characteristics", explanation: "The plotting diagram maps inclusions and blemishes referenced in the clarity grade.", skillTag: "product_accuracy" },
    ],
  },
  {
    key: "fine-jewelry-sales-conversation",
    title: "Fine-Jewelry Sales Conversation",
    slug: "fine-jewelry-sales-conversation",
    track: "foundations",
    description:
      "Master the art of a client-centered jewelry sales conversation — from warm discovery through empathetic objection handling to an ethical close.",
    outcomes: [
      "Open conversations with genuine discovery questions",
      "Present features, benefits, and emotional value together",
      "Handle common objections with empathy and confidence",
      "Close ethically without pressure tactics",
      "Log high-quality CRM notes for future follow-up",
    ],
    skillTags: ["sales_conversations", "objection_handling", "clienteling"],
    kpiAreas: ["conversion", "average_ticket", "client_book_growth", "repeat_client_rate"],
    estimatedMinutes: 90,
    modules: [
      {
        title: "Discovery & Connection",
        lessons: [
          {
            title: "Discovery Questions That Build Trust",
            summary:
              "Learn open-ended discovery questions that uncover what a client truly values before you present a single product.",
            sections: [
              {
                heading: "Why discovery comes first",
                body: "Jumping straight to product recommendations before understanding the client's occasion, budget comfort, and style preferences often leads to mismatched suggestions and lost trust. Discovery signals that you care about the person, not just the sale.",
              },
              {
                heading: "Open-ended vs. closed questions",
                body: "Open-ended questions ('What's the story behind this piece you're looking for?') invite richer answers than closed ones ('Do you like gold?'). Use open questions early, and closed questions later to confirm details.",
              },
              {
                heading: "Listening for emotional cues",
                body: "Clients often reveal the real motivation indirectly — an anniversary, a promotion, a personal milestone. Reflect back what you hear ('It sounds like this is a meaningful moment for you') to build connection before moving to product.",
              },
            ],
            keyTerms: [
              { term: "Discovery question", definition: "An open-ended question used to understand a client's needs, occasion, and preferences." },
              { term: "Active listening", definition: "Fully concentrating on and reflecting back what a client says to build rapport." },
            ],
            clientLanguage: [
              "\"Tell me a little about the occasion — is this for a special milestone?\"",
              "\"What's caught your eye so far, and what do you love about it?\"",
            ],
            floorTaskHints: ["Practice a discovery opener with three clients this week."],
            scripts: [
              {
                title: "Opening with discovery",
                dialogue:
                  "Associate: \"Welcome in! Are you shopping for something specific today, or just exploring for now?\"\nClient: \"Just looking, thanks.\"\nAssociate: \"Of course — take your time. If it's helpful, I'm happy to point out a few pieces people love this season, no pressure at all.\"",
              },
            ],
            complianceNotes: [COMPLIANCE_GENERIC],
            estimatedMinutes: 11,
          },
          {
            title: "Feature-Benefit-Emotion Presentation",
            summary:
              "Present products in a structure that connects a technical feature to a tangible benefit and an emotional payoff.",
            sections: [
              {
                heading: "The three-part structure",
                body: "Feature: what it is (e.g., 'This is a bezel setting'). Benefit: what it does for the client ('It protects the stone edges from daily bumps'). Emotion: what it means to them ('So you can wear it every day without worry, even during your morning workouts').",
              },
              {
                heading: "Avoiding feature-dumping",
                body: "Reciting a list of specifications without tying them to the client's stated needs feels like a lecture. Always link back to something the client shared during discovery.",
              },
            ],
            keyTerms: [
              { term: "Feature-benefit-emotion", definition: "A presentation technique linking a product attribute to a practical benefit and an emotional outcome." },
            ],
            clientLanguage: [
              "\"Since you mentioned you're active, this bezel setting protects the stone so you can wear it worry-free every day.\"",
            ],
            floorTaskHints: ["Present one product using the feature-benefit-emotion structure with a real client."],
            scripts: [
              {
                title: "Feature-benefit-emotion in action",
                dialogue:
                  "Associate: \"This band has a slightly domed profile — that means it will sit comfortably against your other rings, so you can stack them without any gaps bothering you day to day.\"",
              },
            ],
            complianceNotes: [COMPLIANCE_GENERIC],
            estimatedMinutes: 10,
          },
        ],
      },
      {
        title: "Handling Objections & Closing",
        lessons: [
          {
            title: "Objection Handling With Empathy",
            summary:
              "Reframe common objections ('too expensive,' 'need to think about it') as requests for more information, not rejections.",
            sections: [
              {
                heading: "Acknowledge before you respond",
                body: "Always acknowledge the objection first ('That's a fair question') before offering perspective. Rushing to counter an objection can feel dismissive.",
              },
              {
                heading: "Common objections and reframes",
                body: "'Why is this more expensive than online?' → Explain craftsmanship, service, and verification value. 'I need to think about it' → Ask what additional information would help them feel confident, rather than pressuring for an immediate decision.",
              },
              {
                heading: "Price objections without being pushy",
                body: "If a client asks for a better price, acknowledge the request and explain your store's pricing and any current promotions honestly — never fabricate discounts or urgency that doesn't exist.",
              },
            ],
            keyTerms: [
              { term: "Objection", definition: "A concern or hesitation a client raises before deciding to purchase." },
              { term: "Reframe", definition: "Responding to an objection by offering a new, helpful perspective rather than arguing." },
            ],
            clientLanguage: [
              "\"That's a fair question — a lot of our value comes from in-person verification, personalized sizing, and service after the sale.\"",
              "\"Totally understandable — what information would help you feel confident moving forward?\"",
            ],
            floorTaskHints: ["Use one ethical closing technique with a client this week."],
            scripts: [
              {
                title: "Handling a price comparison objection",
                dialogue:
                  "Client: \"Why is this more expensive than online?\"\nAssociate: \"That's a fair question. Here, you're getting hands-on verification of quality, personalized sizing, and support if anything ever needs service — a lot of that value isn't visible in an online price.\"",
              },
            ],
            complianceNotes: [COMPLIANCE_GENERIC, "Never invent discounts, urgency, or scarcity that does not exist."],
            estimatedMinutes: 12,
          },
          {
            title: "Ethical Closing Techniques",
            summary:
              "Close sales with confidence and integrity, without pressure tactics or false urgency.",
            sections: [
              {
                heading: "What ethical closing means",
                body: "An ethical close helps a ready client make a confident decision — it never manufactures pressure, fake scarcity, or misleading information to force a sale.",
              },
              {
                heading: "Reading buying signals",
                body: "Signals like trying on a piece multiple times, asking about sizing or care, or asking 'what would this look like with...' often indicate readiness. Use a simple, direct closing question rather than continuing to sell past the decision point.",
              },
              {
                heading: "Sample ethical closing questions",
                body: "'Would you like me to start the paperwork on this one?' or 'Should we get this sized for you today?' are direct, respectful, and pressure-free.",
              },
            ],
            keyTerms: [
              { term: "Buying signal", definition: "A verbal or behavioral cue suggesting a client is ready to decide." },
              { term: "Ethical close", definition: "A closing approach that helps a ready client decide without pressure or misleading claims." },
            ],
            clientLanguage: [
              "\"It sounds like this one checks all your boxes — would you like me to go ahead and get this ready for you?\"",
            ],
            floorTaskHints: ["Practice recognizing a buying signal and using a direct closing question."],
            scripts: [
              {
                title: "An ethical close",
                dialogue:
                  "Client: \"I keep coming back to this one.\"\nAssociate: \"It does seem to be the one that keeps catching your eye. Would you like me to go ahead and start getting it ready for you?\"",
              },
            ],
            complianceNotes: [COMPLIANCE_GENERIC],
            estimatedMinutes: 10,
          },
          {
            title: "Clienteling & CRM Follow-Up",
            summary:
              "Build long-term client relationships with high-quality CRM notes and thoughtful follow-up cadences.",
            sections: [
              {
                heading: "What makes a CRM note useful",
                body: "A high-quality note captures the occasion, preferences (metal, style, budget comfort), important dates, and next steps — written so any teammate could pick up the relationship seamlessly.",
              },
              {
                heading: "Follow-up cadence",
                body: "A simple cadence might be: thank-you message within 24 hours, a check-in around 2 weeks for major purchases, and an occasion reminder near an anniversary or birthday noted in the CRM.",
              },
              {
                heading: "Personal without being intrusive",
                body: "Reference specifics the client shared, but avoid overly personal or presumptive language. Respect opt-outs and communication preferences at all times.",
              },
            ],
            keyTerms: [
              { term: "Clienteling", definition: "The practice of building long-term, personalized relationships with clients using notes and follow-up." },
              { term: "CRM", definition: "Customer Relationship Management — the system used to track client preferences and history." },
            ],
            clientLanguage: [
              "\"It was wonderful meeting you today — I've made a note of your preferences so our next conversation picks up right where we left off.\"",
            ],
            floorTaskHints: ["Record five high-quality CRM client notes this week."],
            scripts: [
              {
                title: "A strong CRM note example",
                dialogue:
                  "\"Met Jordan R. today — exploring anniversary gift (10th, in 3 months). Prefers yellow gold, minimalist styles. Budget comfort around mid-range. Follow up in 6 weeks with new arrivals in that style.\"",
              },
            ],
            complianceNotes: [COMPLIANCE_GENERIC, "Only record information the client is comfortable sharing, and follow opt-out preferences."],
            estimatedMinutes: 11,
          },
        ],
      },
    ],
    flashcards: [
      { front: "What should come before product presentation?", back: "Discovery — understanding the client's occasion, style, and comfort level." },
      { front: "What is the feature-benefit-emotion structure?", back: "Linking a product attribute to a practical benefit and an emotional payoff." },
      { front: "What is the first step in handling an objection?", back: "Acknowledge it before responding." },
      { front: "What is an ethical close?", back: "Helping a ready client decide without pressure or false urgency." },
      { front: "Name one common buying signal.", back: "Trying on a piece multiple times or asking about sizing/care." },
      { front: "What makes a CRM note high quality?", back: "It captures occasion, preferences, dates, and next steps clearly." },
      { front: "How soon should you follow up after a major purchase?", back: "A thank-you within 24 hours, then a check-in around two weeks." },
      { front: "What should you avoid when responding to a price objection?", back: "Inventing discounts or false urgency." },
      { front: "What is active listening?", back: "Fully concentrating on and reflecting back what a client says." },
      { front: "Give an example of an open-ended discovery question.", back: "\"Tell me about the occasion you're shopping for.\"" },
    ],
    quizTitle: "Fine-Jewelry Sales Conversation: Final Assessment",
    quizQuestions: [
      { type: "multiple_choice", prompt: "What should typically happen before presenting specific products?", options: ["Discuss pricing", "Discovery questions", "Close the sale", "Offer financing"], correct: "Discovery questions", explanation: "Discovery uncovers needs and builds trust before product presentation.", skillTag: "sales_conversations" },
      { type: "best_response", prompt: "A client says 'I'm just looking.' What is the best initial response?", options: ["\"Okay, let me know if you need anything.\" and walk away", "\"No worries — take your time. I'm happy to point out a few favorites if that's helpful, no pressure.\"", "\"Are you sure? We have a sale today.\"", "Ignore the comment and start presenting products anyway"], correct: "\"No worries — take your time. I'm happy to point out a few favorites if that's helpful, no pressure.\"", explanation: "This response respects the client's stated preference while keeping the door open for engagement.", skillTag: "sales_conversations" },
      { type: "true_false", prompt: "Feature-dumping (listing specs without context) is an effective sales technique.", options: ["True", "False"], correct: "False", explanation: "Presenting features without linking them to client needs feels like a lecture rather than a conversation.", skillTag: "sales_conversations" },
      { type: "scenario", prompt: "A client says 'I need to think about it.' What is the most empathetic next step?", options: ["Apply pressure to decide today", "Ask what additional information would help them feel confident", "Assume they are not interested and stop engaging", "Offer a discount immediately"], correct: "Ask what additional information would help them feel confident", explanation: "This reframes the objection as a request for more information rather than a rejection.", skillTag: "objection_handling" },
      { type: "multiple_choice", prompt: "Which is an example of an ethical closing question?", options: ["\"This won't be here tomorrow, you need to decide now.\"", "\"Would you like me to start the paperwork on this one?\"", "\"Everyone is buying this today.\"", "\"I can't guarantee this price later.\""], correct: "\"Would you like me to start the paperwork on this one?\"", explanation: "This is direct and respectful without manufacturing false urgency.", skillTag: "objection_handling" },
      { type: "true_false", prompt: "A high-quality CRM note should include the client's occasion, preferences, and next steps.", options: ["True", "False"], correct: "True", explanation: "This allows any teammate to pick up the relationship seamlessly.", skillTag: "clienteling" },
      { type: "multiple_choice", prompt: "What is the recommended first follow-up step after a major purchase?", options: ["Wait one month", "A thank-you message within 24 hours", "No follow-up needed", "Ask for a review immediately"], correct: "A thank-you message within 24 hours", explanation: "A prompt, genuine thank-you reinforces the relationship.", skillTag: "clienteling" },
      { type: "best_response", prompt: "A client says 'Can you give me a better price?' What is the best response?", options: ["\"No, our prices are fixed, sorry.\"", "\"Let me see what I can do — acknowledge the ask honestly and explain current pricing or promotions available.\"", "\"Sure, I'll just make something up.\"", "Ignore the question."], correct: "\"Let me see what I can do — acknowledge the ask honestly and explain current pricing or promotions available.\"", explanation: "This acknowledges the request while staying honest about actual pricing and promotions.", skillTag: "objection_handling" },
      { type: "true_false", prompt: "It's acceptable to invent a discount to close a sale faster.", options: ["True", "False"], correct: "False", explanation: "Inventing discounts or urgency is unethical and against compliance guidance.", skillTag: "compliance_awareness" },
      { type: "multiple_choice", prompt: "What is a 'buying signal'?", options: ["A client asking for the store's return policy only", "A verbal or behavioral cue suggesting the client is ready to decide", "A discount code", "A CRM system alert"], correct: "A verbal or behavioral cue suggesting the client is ready to decide", explanation: "Recognizing buying signals helps associates know when to move to a close.", skillTag: "sales_conversations" },
    ],
  },
  {
    key: "bridal-engagement-mastery",
    title: "Bridal & Engagement Mastery",
    slug: "bridal-engagement-mastery",
    track: "specialist",
    description:
      "Deliver an exceptional bridal experience from the first appointment through the proposal and beyond, including sensitive budget and custom-design conversations.",
    outcomes: [
      "Prepare and run a structured bridal appointment",
      "Guide clients through ring-setting and style options",
      "Navigate budget and financing conversations with care",
      "Discuss custom design and trade-ins appropriately",
      "Close a bridal sale with confidence and warmth",
    ],
    skillTags: ["bridal", "clienteling", "compliance_awareness"],
    kpiAreas: ["bridal_conversion", "average_ticket", "appointment_conversion", "band_attachment"],
    estimatedMinutes: 100,
    modules: [
      {
        title: "The Bridal Appointment",
        lessons: [
          {
            title: "Preparing the Bridal Appointment",
            summary:
              "Set the stage for a memorable, low-pressure bridal appointment with proper preparation and a warm environment.",
            sections: [
              {
                heading: "Before the client arrives",
                body: "Confirm the appointment, review any prior notes (ring size guesses, style board, budget comfort range if shared), and prepare a private, comfortable space. Have a few relevant pieces staged based on any known preferences.",
              },
              {
                heading: "Setting a relaxed tone",
                body: "Bridal shopping can be emotional and stressful. Greet warmly, offer water or a seat, and let the client know there's no pressure to decide on the spot — especially for a first visit.",
              },
              {
                heading: "Involving a partner or family member thoughtfully",
                body: "When someone attends with the client (partner, parent, friend), acknowledge everyone and ask who is the primary decision-maker, without excluding others from the conversation.",
              },
            ],
            keyTerms: [
              { term: "Bridal appointment", definition: "A scheduled, often more personalized consultation focused on engagement or wedding jewelry." },
              { term: "Style board", definition: "A collection of reference images or notes capturing a client's aesthetic preferences." },
            ],
            clientLanguage: [
              "\"Welcome — this is your time, so let's go at whatever pace feels comfortable for you.\"",
            ],
            floorTaskHints: ["Complete a bridal appointment-preparation checklist before your next scheduled appointment."],
            scripts: [
              {
                title: "Warm bridal greeting",
                dialogue:
                  "Associate: \"Congratulations on this exciting step! Before we dive in, is there anything specific you've already fallen in love with, or would you like to explore a few different directions together?\"",
              },
            ],
            complianceNotes: [COMPLIANCE_GENERIC],
            estimatedMinutes: 12,
          },
          {
            title: "Ring Setting & Style Consultation",
            summary:
              "Compare popular ring settings and help clients choose a style that matches their lifestyle and taste.",
            sections: [
              {
                heading: "Common setting types",
                body: "Prong settings maximize light and show off the stone; bezel settings offer more protection for active lifestyles; halo settings add perceived size and sparkle; three-stone settings carry symbolic meaning (past, present, future).",
              },
              {
                heading: "Matching settings to lifestyle",
                body: "Ask about occupation and hobbies — a client who works with their hands often benefits from a low-profile or bezel setting, while a client who prioritizes maximum sparkle may prefer a classic prong or halo.",
              },
              {
                heading: "Talking about durability honestly",
                body: "Be honest about maintenance needs (e.g., prongs should be checked periodically) without making guarantees about how a specific setting will hold up over time.",
              },
            ],
            keyTerms: [
              { term: "Prong setting", definition: "A setting using metal claws to hold a stone in place while maximizing visible surface area." },
              { term: "Bezel setting", definition: "A setting that surrounds the stone with a metal rim for extra protection." },
              { term: "Halo setting", definition: "A setting surrounding a center stone with smaller accent stones to enhance size and sparkle." },
            ],
            clientLanguage: [
              "\"Since you mentioned you're active, a bezel or low-profile setting might feel more worry-free day to day.\"",
            ],
            floorTaskHints: ["Compare two ring settings with a client using the setting comparison guide."],
            scripts: [
              {
                title: "Setting recommendation",
                dialogue:
                  "Client: \"I love how much sparkle the halo has, but I work with my hands a lot.\"\nAssociate: \"Totally understandable — we could look at a halo with a slightly lower profile, or a protective bezel style that still has beautiful presence.\"",
              },
            ],
            complianceNotes: [COMPLIANCE_GENERIC],
            estimatedMinutes: 11,
          },
        ],
      },
      {
        title: "Bridal Conversations",
        lessons: [
          {
            title: "Talking Budget & Financing With Care",
            summary:
              "Discuss budget comfort and financing options honestly, without pressure or promises about approval.",
            sections: [
              {
                heading: "Asking about budget comfortably",
                body: "Frame budget questions around comfort rather than a hard number: 'What range feels comfortable for you to explore today?' This reduces awkwardness and helps you curate appropriately.",
              },
              {
                heading: "Financing conversations",
                body: "You may describe available financing programs in general terms, but you must never promise approval or specific terms — those are determined by the financing provider, not the associate.",
              },
              {
                heading: "Respecting financial boundaries",
                body: "If a client indicates a lower budget than expected, respond with the same warmth and options as any other client. Budget should never affect service quality.",
              },
            ],
            keyTerms: [
              { term: "Budget comfort range", definition: "The price range a client feels comfortable exploring, framed without pressure." },
              { term: "Financing program", definition: "A third-party or store credit option that may allow clients to pay over time, subject to approval." },
            ],
            clientLanguage: [
              "\"What range feels comfortable for you to explore today, so I can show you pieces that fit well?\"",
              "\"We do have financing options available — approval and terms are determined by the provider, but I'm happy to share the general details.\"",
            ],
            floorTaskHints: ["Practice a budget-comfort discovery question with a client this week."],
            scripts: [
              {
                title: "Financing without overpromising",
                dialogue:
                  "Client: \"Will I definitely get approved for financing?\"\nAssociate: \"That's determined by the financing provider, not by us — I can share the general program details and next steps if you'd like to apply.\"",
              },
            ],
            complianceNotes: [
              COMPLIANCE_GENERIC,
              "Never promise financing approval or specific credit terms.",
            ],
            estimatedMinutes: 11,
          },
          {
            title: "Custom Design & Trade-In Conversations",
            summary:
              "Introduce custom design options and handle trade-in or inherited-piece conversations with sensitivity.",
            sections: [
              {
                heading: "Introducing custom design",
                body: "When off-the-shelf options don't fit a client's vision, introduce the custom design process: consultation, rendering/sketch approval, and production timeline. Set realistic expectations about timelines.",
              },
              {
                heading: "Handling inherited or trade-in pieces with sensitivity",
                body: "Inherited jewelry often carries emotional significance. Acknowledge the sentimental value first, then explain your store's trade-in or redesign process without stating a specific value on the spot unless your store policy allows an immediate estimate.",
              },
              {
                heading: "What not to promise",
                body: "Never state a definitive trade-in or appraisal value without the appropriate evaluation process — always refer to your store's official process.",
              },
            ],
            keyTerms: [
              { term: "Custom design", definition: "A process where a client's vision is used to create a one-of-a-kind piece." },
              { term: "Trade-in", definition: "The process of exchanging an existing piece of jewelry toward a new purchase, subject to evaluation." },
            ],
            clientLanguage: [
              "\"This piece clearly means a lot to you — let's talk through the options for redesigning it or exploring a trade-in.\"",
            ],
            floorTaskHints: ["Practice introducing the custom design process to a client with a unique request."],
            scripts: [
              {
                title: "Trade-in conversation opener",
                dialogue:
                  "Client: \"I want to trade in an inherited ring.\"\nAssociate: \"That's a meaningful piece — thank you for trusting us with it. Let's walk through our evaluation process so you have clear next steps.\"",
              },
            ],
            complianceNotes: [
              COMPLIANCE_GENERIC,
              "Do not state a trade-in or appraisal value without following the store's official evaluation process.",
            ],
            estimatedMinutes: 12,
          },
          {
            title: "Closing the Bridal Sale",
            summary:
              "Bring the bridal appointment to a warm, confident close while setting up excellent post-sale follow-through.",
            sections: [
              {
                heading: "Recognizing bridal-specific buying signals",
                body: "In bridal, buying signals include repeated visits to the same piece, involving family in a video call, or asking detailed sizing/insurance questions.",
              },
              {
                heading: "Closing with warmth",
                body: "Bridal closes benefit from acknowledging the emotional milestone: 'This is such an exciting moment — would you like to move forward with this one today?'",
              },
              {
                heading: "Setting up the next steps",
                body: "Confirm sizing, timelines, care instructions, and schedule a follow-up (e.g., ring inspection or insurance conversation) before the client leaves.",
              },
            ],
            keyTerms: [
              { term: "Post-sale follow-through", definition: "The steps taken after a sale to ensure a smooth experience, such as sizing, care guidance, and scheduling follow-ups." },
            ],
            clientLanguage: [
              "\"This is such an exciting moment — would you like to move forward with this one today?\"",
            ],
            floorTaskHints: ["Complete a bridal appointment-preparation checklist and log the outcome."],
            scripts: [
              {
                title: "Warm bridal close",
                dialogue:
                  "Associate: \"You've lit up every time you've tried this one on — would you like to make this the one today?\"\nClient: \"Yes, let's do it!\"\nAssociate: \"Wonderful — let's get you sized and walk through next steps.\"",
              },
            ],
            complianceNotes: [COMPLIANCE_GENERIC],
            estimatedMinutes: 10,
          },
        ],
      },
    ],
    flashcards: [
      { front: "What should you confirm before a bridal appointment?", back: "Prior notes, ring size guesses, style preferences, and a prepared private space." },
      { front: "What is a halo setting?", back: "A setting surrounding a center stone with smaller accent stones for added sparkle and size." },
      { front: "How should you ask about budget?", back: "Frame it around comfort: \"What range feels comfortable for you to explore today?\"" },
      { front: "Can an associate promise financing approval?", back: "No — approval and terms are determined by the financing provider." },
      { front: "How should inherited jewelry be treated in conversation?", back: "Acknowledge sentimental value first, then explain the store's evaluation process." },
      { front: "What is a bezel setting good for?", back: "Protecting the stone for clients with active lifestyles." },
      { front: "Name one bridal-specific buying signal.", back: "Repeated visits to the same piece or detailed sizing/insurance questions." },
      { front: "What should happen before a client leaves after a bridal sale?", back: "Confirm sizing, timelines, care instructions, and schedule follow-up." },
      { front: "What is custom design?", back: "A process creating a one-of-a-kind piece based on the client's vision." },
      { front: "What must you avoid stating during a trade-in conversation?", back: "A definitive value without following the official evaluation process." },
    ],
    quizTitle: "Bridal & Engagement Mastery: Final Assessment",
    quizQuestions: [
      { type: "multiple_choice", prompt: "What should be prepared before a bridal appointment?", options: ["Nothing, walk-ins are treated the same", "Prior notes, staged pieces, and a private space", "A hard sales pitch", "A discount code"], correct: "Prior notes, staged pieces, and a private space", explanation: "Preparation creates a smoother, more personalized experience.", skillTag: "bridal" },
      { type: "true_false", prompt: "An associate can guarantee a client will be approved for financing.", options: ["True", "False"], correct: "False", explanation: "Approval is determined by the financing provider, never the associate.", skillTag: "compliance_awareness" },
      { type: "best_response", prompt: "A client says 'My partner needs to approve this.' What is the best response?", options: ["\"That's fine, but you should really decide today.\"", "\"Of course — would it help to schedule a time for them to see it, or would photos and details be useful to share?\"", "\"We can't hold items for you.\"", "Ignore the comment and keep pushing to close."], correct: "\"Of course — would it help to schedule a time for them to see it, or would photos and details be useful to share?\"", explanation: "This respects the client's process and offers a helpful next step.", skillTag: "objection_handling" },
      { type: "multiple_choice", prompt: "Which setting offers the most protection for an active lifestyle?", options: ["Prong setting", "Bezel setting", "Halo setting", "Pavé setting"], correct: "Bezel setting", explanation: "A bezel setting surrounds the stone with metal, offering more protection.", skillTag: "bridal" },
      { type: "scenario", prompt: "A client wants to trade in an inherited ring. What is the appropriate first step?", options: ["State an immediate dollar value", "Acknowledge the sentimental value and explain the store's evaluation process", "Refuse to discuss trade-ins", "Assume the client wants cash only"], correct: "Acknowledge the sentimental value and explain the store's evaluation process", explanation: "This is respectful and compliant with proper evaluation procedures.", skillTag: "compliance_awareness" },
      { type: "true_false", prompt: "Budget conversations should only happen with clients who appear to have a high budget.", options: ["True", "False"], correct: "False", explanation: "All clients deserve the same quality of service regardless of budget.", skillTag: "bridal" },
      { type: "multiple_choice", prompt: "What is a three-stone ring setting meant to symbolize?", options: ["Past, present, and future", "Three different metals", "Three carats", "Three payment installments"], correct: "Past, present, and future", explanation: "Three-stone rings carry traditional symbolic meaning.", skillTag: "bridal" },
      { type: "best_response", prompt: "What should happen immediately after a bridal client agrees to purchase?", options: ["Nothing further is needed", "Confirm sizing, timelines, and care instructions, and schedule follow-up", "Immediately move on to the next client", "Ask for a review before they leave"], correct: "Confirm sizing, timelines, and care instructions, and schedule follow-up", explanation: "This ensures a smooth post-sale experience.", skillTag: "bridal" },
      { type: "true_false", prompt: "Custom design timelines should be described with realistic expectations.", options: ["True", "False"], correct: "True", explanation: "Setting accurate expectations avoids disappointment and builds trust.", skillTag: "bridal" },
      { type: "multiple_choice", prompt: "What is the best way to involve a partner attending a bridal appointment?", options: ["Ignore them and speak only to the primary client", "Acknowledge everyone and clarify who the primary decision-maker is", "Ask them to wait outside", "Address only the person paying"], correct: "Acknowledge everyone and clarify who the primary decision-maker is", explanation: "This is respectful and clarifies the conversation flow.", skillTag: "bridal" },
    ],
  },
  {
    key: "store-operations-retail-kpis",
    title: "Store Operations & Retail KPIs",
    slug: "store-operations-retail-kpis",
    track: "leadership",
    description:
      "Build operational excellence and data fluency for store leaders — covering daily procedures, security, and the KPIs that drive coaching decisions.",
    outcomes: [
      "Run consistent opening and closing procedures",
      "Perform accurate case counts and cycle counts",
      "Apply core loss-prevention practices",
      "Read and explain core retail KPIs",
      "Use KPI data to guide coaching conversations",
    ],
    skillTags: ["store_operations", "security", "kpis", "coaching"],
    kpiAreas: ["shrink", "sales_vs_plan", "conversion", "staff_turnover"],
    estimatedMinutes: 95,
    modules: [
      {
        title: "Daily Operations",
        lessons: [
          {
            title: "Opening & Closing Procedures",
            summary:
              "Follow a consistent, secure routine for opening and closing the store each day.",
            sections: [
              {
                heading: "Why consistency matters",
                body: "Consistent opening and closing routines reduce security risk, ensure accurate inventory counts, and set the tone for the day. Deviating from the checklist — even under time pressure — increases risk.",
              },
              {
                heading: "Opening checklist essentials",
                body: "Two-person verification when unlocking cases and safes, visual case inspection against the prior night's count, alarm deactivation logging, and a brief team huddle to align on daily goals.",
              },
              {
                heading: "Closing checklist essentials",
                body: "Secure all cases and safes, complete count reconciliation, verify alarm activation, and document any discrepancies immediately rather than waiting until the next shift.",
              },
            ],
            keyTerms: [
              { term: "Two-person verification", definition: "A security practice requiring two employees to be present for sensitive actions like opening a safe." },
              { term: "Reconciliation", definition: "Comparing physical counts to recorded inventory to identify discrepancies." },
            ],
            clientLanguage: [],
            floorTaskHints: ["Lead or observe a pre-shift huddle using the daily huddle planner."],
            scripts: [],
            complianceNotes: [
              COMPLIANCE_GENERIC,
              "Follow your store's documented security procedures exactly — do not skip steps under time pressure.",
            ],
            estimatedMinutes: 12,
          },
          {
            title: "Case Counts & Cycle Counts",
            summary:
              "Perform accurate, consistent inventory counts to protect the business and maintain trust.",
            sections: [
              {
                heading: "Case counts vs. cycle counts",
                body: "Case counts are typically daily spot checks of high-traffic cases; cycle counts are a scheduled rotation through all inventory over a set period (e.g., monthly) to ensure full coverage without a disruptive full closure.",
              },
              {
                heading: "Best practices for accuracy",
                body: "Always count with a second person when possible, use consistent counting order (left to right, top to bottom), and document discrepancies immediately with a manager rather than adjusting records unilaterally.",
              },
            ],
            keyTerms: [
              { term: "Cycle count", definition: "A scheduled, rotating inventory count covering all merchandise over a set period." },
              { term: "Discrepancy", definition: "A difference between the physical count and recorded inventory." },
            ],
            clientLanguage: [],
            floorTaskHints: ["Perform a cycle-count task with a manager this week."],
            scripts: [],
            complianceNotes: [COMPLIANCE_GENERIC],
            estimatedMinutes: 10,
          },
          {
            title: "Security & Loss Prevention Fundamentals",
            summary:
              "Apply everyday loss-prevention habits that protect both merchandise and staff.",
            sections: [
              {
                heading: "Everyday LP habits",
                body: "Never leave cases unlocked or unattended, always use trays for case-to-case movement, and maintain awareness of how many pieces are out for a client at once.",
              },
              {
                heading: "Handling suspicious behavior calmly",
                body: "Loss-prevention concerns should be handled calmly and per store policy — never confront a suspected shoplifter directly or make accusations. Follow your store's escalation process.",
              },
              {
                heading: "Cash and high-value transaction awareness",
                body: "Follow your store's documented procedures for cash handling and high-value transactions exactly; these procedures exist to protect both the client and the business.",
              },
            ],
            keyTerms: [
              { term: "Loss prevention (LP)", definition: "Practices and procedures designed to reduce theft and inventory shrinkage." },
              { term: "Shrink", definition: "Inventory loss due to theft, error, or damage." },
            ],
            clientLanguage: [],
            floorTaskHints: ["Review the case-count and cycle-count checklist with your team."],
            scripts: [],
            complianceNotes: [
              COMPLIANCE_GENERIC,
              "Never confront a suspected shoplifter directly — follow your store's escalation procedures.",
            ],
            estimatedMinutes: 11,
          },
        ],
      },
      {
        title: "Leading With KPIs",
        lessons: [
          {
            title: "Retail KPI Fundamentals",
            summary:
              "Understand the core KPIs used to evaluate store and individual performance in fine-jewelry retail.",
            sections: [
              {
                heading: "Core KPIs explained",
                body: "Conversion rate measures the percentage of visitors who make a purchase. Average ticket is the average transaction value. Units per transaction (UPT) measures how many items are sold per sale. These are sample training metrics used throughout this course.",
              },
              {
                heading: "Bridal and relationship KPIs",
                body: "Bridal conversion tracks how many bridal appointments result in a sale. Client-book growth and repeat-client rate measure the health of long-term relationships built through clienteling.",
              },
              {
                heading: "Using KPIs responsibly",
                body: "KPIs are tools for coaching and improvement, not tools for shaming. Always pair a KPI conversation with specific, actionable next steps.",
              },
            ],
            keyTerms: [
              { term: "Conversion rate", definition: "The percentage of store visitors who complete a purchase." },
              { term: "Average ticket", definition: "The average dollar value of a completed transaction." },
              { term: "Units per transaction (UPT)", definition: "The average number of items sold per completed transaction." },
            ],
            clientLanguage: [],
            floorTaskHints: ["Calculate your store's conversion rate for a sample day using the KPI formula reference."],
            scripts: [],
            complianceNotes: [
              "These are sample training metrics for learning purposes and do not reflect live POS or CRM data.",
            ],
            estimatedMinutes: 12,
          },
          {
            title: "Coaching With Data",
            summary:
              "Turn KPI trends into specific, supportive coaching conversations with your team.",
            sections: [
              {
                heading: "From data to conversation",
                body: "Rather than saying 'your numbers are low,' identify a specific pattern (e.g., low UPT) and connect it to a coachable skill (e.g., suggesting a complementary piece before closing).",
              },
              {
                heading: "The GROW-style coaching structure",
                body: "Goal (what are we working toward), Reality (what does the data show), Options (what could help), Will (what will the associate commit to trying this week) — a simple structure for productive coaching conversations.",
              },
              {
                heading: "Recognizing progress",
                body: "Celebrate incremental improvement, not just hitting a final target — this builds motivation and trust in the coaching relationship.",
              },
            ],
            keyTerms: [
              { term: "GROW model", definition: "A coaching framework: Goal, Reality, Options, Will." },
            ],
            clientLanguage: [],
            floorTaskHints: ["Use the KPI dashboard to identify one coaching opportunity for a team member."],
            scripts: [],
            complianceNotes: [
              "These are sample training metrics for learning purposes and do not reflect live POS or CRM data.",
            ],
            estimatedMinutes: 11,
          },
        ],
      },
    ],
    flashcards: [
      { front: "What is two-person verification?", back: "A security practice requiring two employees present for sensitive actions like opening a safe." },
      { front: "What is the difference between case counts and cycle counts?", back: "Case counts are daily spot checks; cycle counts rotate through all inventory over a set period." },
      { front: "What should you do if you find a count discrepancy?", back: "Document it immediately and report to a manager rather than adjusting records unilaterally." },
      { front: "What is shrink?", back: "Inventory loss due to theft, error, or damage." },
      { front: "What should you do if you notice suspicious behavior?", back: "Stay calm and follow your store's escalation procedures — never confront directly." },
      { front: "What is conversion rate?", back: "The percentage of store visitors who complete a purchase." },
      { front: "What is UPT?", back: "Units per transaction — the average number of items sold per sale." },
      { front: "What does the GROW coaching model stand for?", back: "Goal, Reality, Options, Will." },
      { front: "Why should KPI conversations include actionable next steps?", back: "KPIs are tools for coaching and improvement, not for shaming." },
      { front: "What does average ticket measure?", back: "The average dollar value of a completed transaction." },
    ],
    quizTitle: "Store Operations & Retail KPIs: Final Assessment",
    quizQuestions: [
      { type: "multiple_choice", prompt: "What is the purpose of two-person verification?", options: ["To speed up opening", "To provide a security check for sensitive actions", "To reduce staffing costs", "To track sales"], correct: "To provide a security check for sensitive actions", explanation: "Having two people present for sensitive actions like opening a safe reduces risk.", skillTag: "security" },
      { type: "true_false", prompt: "Cycle counts cover all inventory over a scheduled rotation period.", options: ["True", "False"], correct: "True", explanation: "Cycle counts rotate through all merchandise over time rather than all at once.", skillTag: "store_operations" },
      { type: "scenario", prompt: "You notice a customer behaving suspiciously near a case. What should you do?", options: ["Confront them directly and accuse them", "Stay calm and follow your store's escalation procedure", "Ignore it completely", "Lock the store immediately"], correct: "Stay calm and follow your store's escalation procedure", explanation: "Direct confrontation can escalate risk; following store policy is safest.", skillTag: "security" },
      { type: "multiple_choice", prompt: "What does 'conversion rate' measure?", options: ["Average transaction value", "Percentage of visitors who purchase", "Number of items per sale", "Employee turnover"], correct: "Percentage of visitors who purchase", explanation: "Conversion rate tracks the percentage of visitors who complete a purchase.", skillTag: "kpis" },
      { type: "multiple_choice", prompt: "What does UPT stand for?", options: ["Units Per Transaction", "Unified Pricing Table", "Units Purchased Total", "Under Performance Tracker"], correct: "Units Per Transaction", explanation: "UPT measures the average number of items sold per completed sale.", skillTag: "kpis" },
      { type: "true_false", prompt: "KPI conversations with team members should always include specific, actionable next steps.", options: ["True", "False"], correct: "True", explanation: "Pairing data with action turns a KPI review into effective coaching.", skillTag: "coaching" },
      { type: "best_response", prompt: "A team member's average ticket has dropped. What is the best coaching approach?", options: ["\"Your numbers are bad, fix it.\"", "Identify a specific coachable pattern and discuss options together using a structure like GROW", "Ignore it since sales vary", "Publicly compare them to top performers"], correct: "Identify a specific coachable pattern and discuss options together using a structure like GROW", explanation: "Specific, structured coaching is more effective and respectful than vague criticism.", skillTag: "coaching" },
      { type: "multiple_choice", prompt: "What does the 'G' in the GROW coaching model stand for?", options: ["Growth", "Goal", "Guidance", "Group"], correct: "Goal", explanation: "GROW stands for Goal, Reality, Options, Will.", skillTag: "coaching" },
      { type: "true_false", prompt: "It's acceptable to adjust inventory records yourself if you find a discrepancy, without reporting it.", options: ["True", "False"], correct: "False", explanation: "Discrepancies should always be documented and reported to a manager.", skillTag: "store_operations" },
      { type: "multiple_choice", prompt: "Demo KPI metrics used in this course are best described as:", options: ["Live POS data", "Sample training metrics for learning purposes", "Legally binding figures", "Real client data"], correct: "Sample training metrics for learning purposes", explanation: "This course uses fictional, sample metrics that do not reflect live POS/CRM integration.", skillTag: "compliance_awareness" },
    ],
  },
  {
    key: "training-design-roleplay-facilitation",
    title: "Training Design & Role-Play Facilitation",
    slug: "training-design-roleplay-facilitation",
    track: "trainer",
    description:
      "Learn to design effective jewelry sales training, facilitate powerful role-play practice, build coaching rubrics, and measure training impact.",
    outcomes: [
      "Design a jewelry sales training curriculum",
      "Build clear, fair coaching rubrics",
      "Facilitate engaging role-play practice sessions",
      "Give specific, actionable feedback",
      "Measure the impact of training on floor performance",
    ],
    skillTags: ["coaching", "leadership"],
    kpiAreas: ["role_play_readiness", "certifications_earned", "manager_coaching_activity"],
    estimatedMinutes: 90,
    modules: [
      {
        title: "Designing Training",
        lessons: [
          {
            title: "Designing a Jewelry Sales Curriculum",
            summary:
              "Structure training content so it builds skills progressively and stays connected to real floor performance.",
            sections: [
              {
                heading: "Start with the floor, not the content",
                body: "Effective curriculum design starts by identifying the specific floor behaviors you want to change, then works backward to the knowledge and practice needed to support that behavior.",
              },
              {
                heading: "Layering knowledge, practice, and application",
                body: "Good courses layer three elements: knowledge (lessons, key terms), practice (role-play, quizzes), and real-world application (floor tasks with manager verification).",
              },
              {
                heading: "Pacing for retail schedules",
                body: "Retail associates have unpredictable schedules — design lessons in short, mobile-friendly chunks (8–15 minutes) that can be completed between client interactions.",
              },
            ],
            keyTerms: [
              { term: "Curriculum design", definition: "The intentional structuring of learning content to build skills progressively." },
              { term: "Floor application", definition: "A practical task that lets a learner apply a skill during a real shift." },
            ],
            clientLanguage: [],
            floorTaskHints: ["Draft one new lesson outline using the knowledge-practice-application structure."],
            scripts: [],
            complianceNotes: [COMPLIANCE_GENERIC],
            estimatedMinutes: 12,
          },
          {
            title: "Building Coaching Rubrics",
            summary:
              "Create clear, consistent rubrics that make coaching and role-play feedback fair and specific.",
            sections: [
              {
                heading: "What makes a rubric useful",
                body: "A good rubric defines specific, observable criteria (e.g., 'asked at least two open-ended discovery questions') rather than vague categories like 'good communication.'",
              },
              {
                heading: "Weighting criteria",
                body: "Not all criteria are equally important — weight criteria based on what matters most for the specific scenario (e.g., compliance awareness may carry extra weight in a financing role-play).",
              },
              {
                heading: "Calibrating across evaluators",
                body: "Multiple managers or trainers scoring the same role-play should reach similar scores. Regular calibration sessions help keep scoring consistent and fair.",
              },
            ],
            keyTerms: [
              { term: "Rubric", definition: "A scoring guide with specific, observable criteria used to evaluate performance." },
              { term: "Calibration", definition: "The process of aligning multiple evaluators' scoring standards." },
            ],
            clientLanguage: [],
            floorTaskHints: ["Draft a rubric for a new role-play scenario using the criteria and weighting guidance."],
            scripts: [],
            complianceNotes: [COMPLIANCE_GENERIC],
            estimatedMinutes: 11,
          },
        ],
      },
      {
        title: "Facilitation & Impact",
        lessons: [
          {
            title: "Facilitating Role-Play Practice",
            summary:
              "Run role-play sessions that feel safe, engaging, and genuinely useful for building skill.",
            sections: [
              {
                heading: "Creating psychological safety",
                body: "Learners practice best when they know mistakes are expected and welcomed. Frame role-play as a rehearsal space, not a test, especially in early stages.",
              },
              {
                heading: "Structuring a role-play session",
                body: "Set the scenario clearly, let the learner attempt it fully before interrupting, then debrief using the rubric — starting with what went well before addressing improvement areas.",
              },
              {
                heading: "Rotating scenario difficulty",
                body: "Progress learners from straightforward scenarios to more complex, emotionally charged ones (e.g., time-pressured cruise scenarios) as their confidence builds.",
              },
            ],
            keyTerms: [
              { term: "Psychological safety", definition: "An environment where learners feel safe to take risks and make mistakes without fear of judgment." },
              { term: "Debrief", definition: "A structured conversation after a practice session reviewing what happened and what to improve." },
            ],
            clientLanguage: [],
            floorTaskHints: ["Facilitate a role-play practice session for a teammate and debrief using a rubric."],
            scripts: [],
            complianceNotes: [COMPLIANCE_GENERIC],
            estimatedMinutes: 12,
          },
          {
            title: "Giving Actionable Feedback",
            summary:
              "Deliver feedback that is specific, balanced, and immediately useful for the learner's next attempt.",
            sections: [
              {
                heading: "The SBI feedback model",
                body: "Situation (what was happening), Behavior (what the person specifically did), Impact (what effect it had) — a simple structure for clear, non-judgmental feedback.",
              },
              {
                heading: "Balancing strengths and growth areas",
                body: "Always identify genuine strengths before growth areas, and limit growth areas to one or two per session so the learner isn't overwhelmed.",
              },
              {
                heading: "Ending with a clear next step",
                body: "Every feedback conversation should end with a specific, practiceable next action — not just a summary of what went wrong.",
              },
            ],
            keyTerms: [
              { term: "SBI model", definition: "Situation-Behavior-Impact — a structured feedback framework." },
            ],
            clientLanguage: [],
            floorTaskHints: ["Use the SBI model to give feedback after a teammate's role-play attempt."],
            scripts: [],
            complianceNotes: [COMPLIANCE_GENERIC],
            estimatedMinutes: 10,
          },
          {
            title: "Measuring Training Impact",
            summary:
              "Track whether training is actually changing floor behavior and business results, using sample training metrics.",
            sections: [
              {
                heading: "Leading vs. lagging indicators",
                body: "Leading indicators (course completion, quiz scores, role-play readiness) predict future performance; lagging indicators (conversion, average ticket) confirm whether the training worked, with a time delay.",
              },
              {
                heading: "Connecting training to floor tasks",
                body: "Floor-application tasks with manager verification create a bridge between training completion and actual floor behavior — track completion rates as a mid-point indicator.",
              },
              {
                heading: "Using sample metrics responsibly",
                body: "This platform's KPI dashboards use sample training metrics to teach the connection between learning and performance — always clarify to stakeholders when metrics are for training/demo purposes rather than live business data.",
              },
            ],
            keyTerms: [
              { term: "Leading indicator", definition: "A metric that predicts future performance, such as course completion." },
              { term: "Lagging indicator", definition: "A metric that confirms results after the fact, such as sales conversion." },
            ],
            clientLanguage: [],
            floorTaskHints: ["Review a team's floor-task completion rate and connect it to a leading indicator."],
            scripts: [],
            complianceNotes: [
              "These are sample training metrics for learning purposes and do not reflect live POS or CRM data.",
            ],
            estimatedMinutes: 11,
          },
        ],
      },
    ],
    flashcards: [
      { front: "What should curriculum design start with?", back: "The specific floor behaviors you want to change." },
      { front: "What are the three layers of a good course?", back: "Knowledge, practice, and real-world application." },
      { front: "What makes a rubric useful?", back: "Specific, observable criteria rather than vague categories." },
      { front: "What is calibration in coaching?", back: "Aligning multiple evaluators' scoring standards." },
      { front: "What is psychological safety in role-play?", back: "An environment where learners feel safe to make mistakes without judgment." },
      { front: "What does SBI stand for?", back: "Situation, Behavior, Impact." },
      { front: "How many growth areas should feedback typically focus on?", back: "One or two, so the learner isn't overwhelmed." },
      { front: "What is a leading indicator?", back: "A metric that predicts future performance, like course completion." },
      { front: "What is a lagging indicator?", back: "A metric that confirms results after the fact, like sales conversion." },
      { front: "How should a debrief begin?", back: "With what went well, before addressing improvement areas." },
    ],
    quizTitle: "Training Design & Role-Play Facilitation: Final Assessment",
    quizQuestions: [
      { type: "multiple_choice", prompt: "Effective curriculum design should start with:", options: ["The trainer's favorite topics", "The specific floor behaviors to change", "The longest possible content", "Random topic selection"], correct: "The specific floor behaviors to change", explanation: "Starting with desired floor behavior ensures training is relevant and actionable.", skillTag: "leadership" },
      { type: "true_false", prompt: "A good rubric uses vague categories like 'good communication.'", options: ["True", "False"], correct: "False", explanation: "Good rubrics use specific, observable criteria.", skillTag: "coaching" },
      { type: "multiple_choice", prompt: "What does SBI stand for in feedback delivery?", options: ["Skill, Behavior, Impact", "Situation, Behavior, Impact", "Situation, Belief, Improvement", "Sales, Business, Impact"], correct: "Situation, Behavior, Impact", explanation: "SBI is a structured, non-judgmental feedback framework.", skillTag: "coaching" },
      { type: "scenario", prompt: "A trainer wants role-play to feel safe for beginners. What should they emphasize?", options: ["Strict scoring from the very first attempt", "Psychological safety and framing role-play as rehearsal", "Public comparison between learners", "Skipping debriefs to save time"], correct: "Psychological safety and framing role-play as rehearsal", explanation: "Early practice should feel safe to build confidence before formal evaluation.", skillTag: "coaching" },
      { type: "multiple_choice", prompt: "Which is a leading indicator of training impact?", options: ["Course completion rate", "Quarterly sales revenue", "Annual shrink percentage", "Staff turnover"], correct: "Course completion rate", explanation: "Leading indicators like completion rates predict future performance.", skillTag: "leadership" },
      { type: "true_false", prompt: "Lagging indicators confirm results after the fact.", options: ["True", "False"], correct: "True", explanation: "Lagging indicators like sales conversion show outcomes with a time delay.", skillTag: "leadership" },
      { type: "best_response", prompt: "A trainer is giving feedback after a role-play. What is the best approach?", options: ["List every mistake in detail", "Start with genuine strengths, then one or two growth areas, then a clear next step", "Only mention what went wrong", "Compare the learner unfavorably to a top performer"], correct: "Start with genuine strengths, then one or two growth areas, then a clear next step", explanation: "Balanced, focused feedback is most useful and motivating.", skillTag: "coaching" },
      { type: "multiple_choice", prompt: "Why should retail training lessons be short (8–15 minutes)?", options: ["Because long lessons are illegal", "To fit into unpredictable retail schedules", "Because learners dislike jewelry", "To reduce content quality"], correct: "To fit into unpredictable retail schedules", explanation: "Short, mobile-friendly lessons fit better into retail associates' schedules.", skillTag: "leadership" },
      { type: "true_false", prompt: "Calibration ensures multiple evaluators score similarly on the same role-play.", options: ["True", "False"], correct: "True", explanation: "Calibration keeps scoring fair and consistent across evaluators.", skillTag: "coaching" },
      { type: "multiple_choice", prompt: "What should you clarify when presenting KPI dashboards built on sample data?", options: ["Nothing, present as real data", "That metrics are for training/demo purposes, not live business data", "That metrics are guaranteed accurate", "That metrics come from a live POS integration"], correct: "That metrics are for training/demo purposes, not live business data", explanation: "Transparency about sample data avoids misleading stakeholders.", skillTag: "compliance_awareness" },
    ],
  },
];
