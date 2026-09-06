// A rule-based, heuristic conversational simulator for the AI role-play practice area.
// No external LLM is used; instead we analyze learner language for coaching-relevant
// signals (discovery questions, empathy, compliance risk, closing attempts, etc.)
// and generate a scripted-but-responsive client reply, then produce rubric feedback.

export interface RubricCriterion {
  key: string;
  label: string;
  description: string;
  weight: number;
}

export interface TurnAnalysis {
  askedQuestion: boolean;
  discoveryQuestion: boolean;
  empathyLanguage: boolean;
  complianceRisk: boolean;
  complianceRiskPhrases: string[];
  mentionedFeatureBenefit: boolean;
  closingAttempt: boolean;
  plainLanguage: boolean;
  addressedObjection: boolean;
  wordCount: number;
}

const DISCOVERY_MARKERS = [
  "what brings",
  "what are you",
  "tell me about",
  "what's the occasion",
  "what occasion",
  "what style",
  "what matters most",
  "what's important",
  "how would you",
  "what budget",
  "what range",
  "what's caught your eye",
  "how can i help",
];

const EMPATHY_MARKERS = [
  "i understand",
  "that makes sense",
  "totally understandable",
  "i hear you",
  "that's a fair",
  "great question",
  "i can imagine",
  "no worries",
  "of course",
  "i appreciate",
  "thank you for sharing",
  "congratulations",
];

const COMPLIANCE_RISK_MARKERS = [
  "i guarantee",
  "guaranteed",
  "definitely worth",
  "it's worth $",
  "worth at least",
  "you'll definitely be approved",
  "guaranteed approval",
  "100% approved",
  "i promise",
  "legally",
  "this is definitely an investment",
  "will appreciate in value",
  "always increases in value",
];

const FEATURE_BENEFIT_MARKERS = [
  "which means",
  "so you can",
  "so that you",
  "this means",
  "benefit is",
  "that way you",
  "helps you",
];

const CLOSING_MARKERS = [
  "would you like to",
  "shall we",
  "should we get",
  "ready to move forward",
  "start the paperwork",
  "get this sized",
  "make this official",
  "go ahead and",
];

const PLAIN_LANGUAGE_PENALTY_MARKERS = [
  "vvs",
  "vs1",
  "vs2",
  "si1",
  "si2",
  "gia grade",
  "mm total",
  "carat total weight",
];

function includesAny(text: string, markers: string[]): string[] {
  const lower = text.toLowerCase();
  return markers.filter((m) => lower.includes(m));
}

export function analyzeTurn(text: string): TurnAnalysis {
  const lower = text.toLowerCase();
  const complianceHits = includesAny(lower, COMPLIANCE_RISK_MARKERS);
  return {
    askedQuestion: lower.includes("?"),
    discoveryQuestion: includesAny(lower, DISCOVERY_MARKERS).length > 0 && lower.includes("?"),
    empathyLanguage: includesAny(lower, EMPATHY_MARKERS).length > 0,
    complianceRisk: complianceHits.length > 0,
    complianceRiskPhrases: complianceHits,
    mentionedFeatureBenefit: includesAny(lower, FEATURE_BENEFIT_MARKERS).length > 0,
    closingAttempt: includesAny(lower, CLOSING_MARKERS).length > 0,
    plainLanguage: includesAny(lower, PLAIN_LANGUAGE_PENALTY_MARKERS).length === 0,
    addressedObjection:
      includesAny(lower, EMPATHY_MARKERS).length > 0 ||
      includesAny(lower, FEATURE_BENEFIT_MARKERS).length > 0,
    wordCount: text.trim().split(/\s+/).filter(Boolean).length,
  };
}

interface ScenarioScript {
  followUps: string[];
  resolutionPositive: string;
  resolutionNeutral: string;
}

const SCENARIO_SCRIPTS: Record<string, ScenarioScript> = {
  "Discovery": {
    followUps: [
      "I guess I am celebrating something, actually — our tenth anniversary is coming up.",
      "I don't want anything too flashy, but it should feel special.",
      "What would you recommend for something meaningful but not over the top?",
    ],
    resolutionPositive:
      "This has been really helpful — I feel a lot more comfortable now. I think I'd like to see a couple of options in that style.",
    resolutionNeutral:
      "Okay, that's good to know. I might come back after I look around a bit more.",
  },
  "Objection Handling": {
    followUps: [
      "I hear you, but it still feels like a lot to spend. What makes it worth it?",
      "Okay... I guess I just want to make sure I'm not overpaying.",
      "That's fair. Can you tell me more about what's included?",
    ],
    resolutionPositive:
      "Okay, that actually makes a lot of sense. I feel better about moving forward.",
    resolutionNeutral:
      "I appreciate you explaining that. I think I still want a little more time to decide.",
  },
  "Product Knowledge": {
    followUps: [
      "Interesting — so how would I know if it's a good quality one?",
      "That actually clears things up a bit. What else should I be looking at?",
      "Got it. I want to make a decision I'll feel confident about.",
    ],
    resolutionPositive:
      "Thank you for explaining that so clearly — it really helps me trust this decision.",
    resolutionNeutral:
      "That's helpful information, thank you. I'll think about it a bit more.",
  },
  "Bridal": {
    followUps: [
      "That's a good idea. I do want them to feel included in the decision.",
      "Okay, I like that plan. What would you suggest as next steps?",
      "I appreciate you being patient with this — it's a big decision for us.",
    ],
    resolutionPositive:
      "This has been such a great experience — I think we're ready to move forward together.",
    resolutionNeutral:
      "Thank you, I think we'll come back once we've talked it over.",
  },
  "Travel Retail": {
    followUps: [
      "Okay, we really do need to be quick — what would you suggest given our time?",
      "That works. Can we make a decision in the next few minutes?",
      "I appreciate you keeping this efficient for us.",
    ],
    resolutionPositive:
      "Perfect, let's do that — thank you for being so efficient with us!",
    resolutionNeutral:
      "We should probably get going, but thank you for your help.",
  },
  "Estate & Trade-In": {
    followUps: [
      "It really does mean a lot to me — I want to make sure it's handled respectfully.",
      "Okay, that process makes sense. What would happen next?",
      "I appreciate you taking the time to explain the process clearly.",
    ],
    resolutionPositive:
      "Thank you for being so thoughtful about this — I'd like to move forward with the evaluation.",
    resolutionNeutral:
      "I think I need a little time to think it over, but thank you for explaining.",
  },
};

function scriptForCategory(category: string): ScenarioScript {
  return SCENARIO_SCRIPTS[category] || SCENARIO_SCRIPTS["Discovery"];
}

export function generateClientReply(
  category: string,
  turnIndex: number,
  analysis: TurnAnalysis
): { reply: string; isResolution: boolean } {
  const script = scriptForCategory(category);
  const maxFollowUps = script.followUps.length;

  // Decide the "warmth" of the client's mood based on the learner's approach.
  const positiveSignal =
    analysis.empathyLanguage || analysis.discoveryQuestion || analysis.mentionedFeatureBenefit;

  if (turnIndex >= maxFollowUps) {
    const reply = positiveSignal ? script.resolutionPositive : script.resolutionNeutral;
    return { reply, isResolution: true };
  }

  let reply = script.followUps[turnIndex];
  if (analysis.complianceRisk) {
    reply =
      "Wait — are you sure about that? That sounds like a pretty big promise. " + reply;
  }
  return { reply, isResolution: false };
}

export interface RolePlayTurnRecord {
  role: "client" | "learner";
  text: string;
  ts: string;
}

export function scoreConversation(
  criteria: RubricCriterion[],
  learnerTurns: string[],
  guardrails: string[]
): {
  scores: Record<string, number>;
  overall: number;
  strengths: string[];
  improvements: string[];
  recommendedNext: string;
  complianceFlags: string[];
} {
  const analyses = learnerTurns.map(analyzeTurn);
  const any = (pred: (a: TurnAnalysis) => boolean) => analyses.some(pred);
  const count = (pred: (a: TurnAnalysis) => boolean) => analyses.filter(pred).length;

  const complianceFlags = Array.from(
    new Set(analyses.flatMap((a) => a.complianceRiskPhrases))
  );

  const scoreFor: Record<string, number> = {};
  for (const c of criteria) {
    switch (c.key) {
      case "discovery_questions":
        scoreFor[c.key] = clampScore(2 + count((a) => a.discoveryQuestion) * 2.5);
        break;
      case "product_accuracy":
        scoreFor[c.key] = clampScore(complianceFlags.length > 0 ? 4 : 8);
        break;
      case "plain_language":
        scoreFor[c.key] = clampScore(any((a) => !a.plainLanguage) ? 5 : 9);
        break;
      case "empathy_trust":
        scoreFor[c.key] = clampScore(3 + count((a) => a.empathyLanguage) * 2);
        break;
      case "feature_benefit_emotion":
        scoreFor[c.key] = clampScore(3 + count((a) => a.mentionedFeatureBenefit) * 2.5);
        break;
      case "objection_handling":
        scoreFor[c.key] = clampScore(3 + count((a) => a.addressedObjection) * 2);
        break;
      case "ethical_closing":
        scoreFor[c.key] = clampScore(any((a) => a.closingAttempt) ? 8 : 5);
        break;
      case "compliance_awareness":
        scoreFor[c.key] = clampScore(complianceFlags.length > 0 ? 3 : 9);
        break;
      default:
        scoreFor[c.key] = 6;
    }
  }

  const totalWeight = criteria.reduce((s, c) => s + c.weight, 0) || 1;
  const overall = Math.round(
    criteria.reduce((s, c) => s + (scoreFor[c.key] / 10) * c.weight, 0) / totalWeight * 100
  );

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (count((a) => a.discoveryQuestion) > 0) {
    strengths.push("Asked open-ended discovery questions to understand the client's needs.");
  } else {
    improvements.push("Try opening with more open-ended discovery questions before presenting product details.");
  }

  if (count((a) => a.empathyLanguage) > 0) {
    strengths.push("Used empathetic, trust-building language during the conversation.");
  } else {
    improvements.push("Acknowledge the client's feelings or concerns before responding (e.g., \"That's a fair question\").");
  }

  if (count((a) => a.mentionedFeatureBenefit) > 0) {
    strengths.push("Connected product features to tangible client benefits.");
  } else {
    improvements.push("Link product features to a specific benefit or emotional payoff for this client.");
  }

  if (any((a) => a.closingAttempt)) {
    strengths.push("Made a clear, direct next-step or closing attempt.");
  } else {
    improvements.push("Practice recognizing buying signals and offering a direct, low-pressure next step.");
  }

  if (complianceFlags.length > 0) {
    improvements.push(
      "Avoid unverified promises about value, approval, or guarantees — flagged phrase(s): " +
        complianceFlags.join(", ")
    );
  } else {
    strengths.push("Stayed compliance-aware and avoided unverified claims or guarantees.");
  }

  const recommendedNext =
    complianceFlags.length > 0
      ? "Review the compliance-aware language guidance, then retry a scenario involving pricing or guarantees."
      : count((a) => a.discoveryQuestion) === 0
      ? "Practice the 'I'm just looking.' scenario to strengthen your discovery-question habit."
      : "Try a more advanced scenario, such as a travel-retail or estate trade-in conversation.";

  return {
    scores: scoreFor,
    overall: clampScore(overall, 0, 100),
    strengths: strengths.slice(0, 4),
    improvements: improvements.slice(0, 4),
    recommendedNext,
    complianceFlags,
  };
}

function clampScore(n: number, min = 0, max = 10): number {
  return Math.max(min, Math.min(max, Math.round(n * 10) / 10));
}
