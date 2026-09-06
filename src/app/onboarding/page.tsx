"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { Card, CardBody } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { Gem, ArrowRight, ArrowLeft } from "lucide-react";

const STEPS = [
  "Role & Experience",
  "Retail Environment",
  "Career Goal",
  "Skill Focus",
  "Availability",
];

const RETAIL_ENVIRONMENTS = [
  { value: "independent", label: "Independent Store" },
  { value: "luxury_boutique", label: "Luxury Boutique" },
  { value: "department_counter", label: "Department-Store Counter" },
  { value: "bridal", label: "Bridal Showroom" },
  { value: "cruise_travel", label: "Cruise / Travel Retail" },
  { value: "estate_auction", label: "Estate / Auction" },
  { value: "ecommerce_hybrid", label: "E-commerce / Hybrid" },
];

const CAREER_GOALS = [
  { value: "sales_associate", label: "Sales Associate" },
  { value: "bridal_specialist", label: "Bridal Specialist" },
  { value: "gemologist_seller", label: "Gemologist-Seller" },
  { value: "store_manager", label: "Store Manager" },
  { value: "district_leader", label: "District Leader" },
  { value: "trainer", label: "Trainer" },
];

const SKILL_GOALS = [
  { value: "diamond_gemstone_knowledge", label: "Diamond / Gemstone Knowledge" },
  { value: "sales_conversations", label: "Sales Conversations" },
  { value: "objection_handling", label: "Objection Handling" },
  { value: "clienteling", label: "Clienteling" },
  { value: "bridal", label: "Bridal" },
  { value: "security", label: "Security" },
  { value: "compliance", label: "Compliance" },
  { value: "store_operations", label: "Store Operations" },
  { value: "kpis", label: "KPIs" },
  { value: "coaching", label: "Coaching" },
  { value: "leadership", label: "Leadership" },
];

const EXPERIENCE_LEVELS = ["0-1 years", "1-3 years", "3-5 years", "5+ years"];

export default function OnboardingPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    experienceLevel: "0-1 years",
    retailEnvironment: "luxury_boutique",
    careerGoal: "sales_associate",
    primarySkillGoal: "diamond_gemstone_knowledge",
    weeklyAvailabilityHours: 3,
    region: "",
    market: "",
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function finish() {
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Something went wrong.", "error");
        return;
      }
      showToast("Your personalized learning path is ready!", "success");
      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const isLast = step === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-charcoal-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        <div className="flex items-center gap-2 mb-6 justify-center text-ivory">
          <Gem className="h-6 w-6 text-gold" />
          <span className="font-serif text-xl">Aurelia Fine Jewelry Academy</span>
        </div>
        <Card className="bg-ivory">
          <CardBody>
            <div className="flex items-center gap-1.5 mb-6" aria-label="Onboarding progress">
              {STEPS.map((s, i) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full ${
                    i <= step ? "bg-gold" : "bg-ivory-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs uppercase tracking-wide text-gold-dark font-medium mb-1">
              Step {step + 1} of {STEPS.length}
            </p>
            <h1 className="font-serif text-2xl text-charcoal-900 mb-6">{STEPS[step]}</h1>

            {step === 0 && (
              <div className="space-y-4">
                <Field label="Current experience level" htmlFor="exp">
                  <Select
                    id="exp"
                    value={form.experienceLevel}
                    onChange={(e) => update("experienceLevel", e.target.value)}
                  >
                    {EXPERIENCE_LEVELS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-2">
                <p className="text-sm text-charcoal-500 mb-2">
                  What kind of retail environment do you work in?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {RETAIL_ENVIRONMENTS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => update("retailEnvironment", opt.value)}
                      className={`text-left rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                        form.retailEnvironment === opt.value
                          ? "border-gold bg-champagne/40 text-charcoal-900 font-medium"
                          : "border-champagne-dark/40 hover:bg-ivory-100"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-2">
                <p className="text-sm text-charcoal-500 mb-2">What's your career goal?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CAREER_GOALS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => update("careerGoal", opt.value)}
                      className={`text-left rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                        form.careerGoal === opt.value
                          ? "border-gold bg-champagne/40 text-charcoal-900 font-medium"
                          : "border-champagne-dark/40 hover:bg-ivory-100"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-2">
                <p className="text-sm text-charcoal-500 mb-2">
                  What's your primary skill goal right now?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                  {SKILL_GOALS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => update("primarySkillGoal", opt.value)}
                      className={`text-left rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                        form.primarySkillGoal === opt.value
                          ? "border-gold bg-champagne/40 text-charcoal-900 font-medium"
                          : "border-champagne-dark/40 hover:bg-ivory-100"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <Field label="Weekly study availability (hours)" htmlFor="hours">
                  <Input
                    id="hours"
                    type="number"
                    min={1}
                    max={40}
                    value={form.weeklyAvailabilityHours}
                    onChange={(e) => update("weeklyAvailabilityHours", Number(e.target.value))}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Region (optional)" htmlFor="region">
                    <Input
                      id="region"
                      value={form.region}
                      onChange={(e) => update("region", e.target.value)}
                      placeholder="e.g. North America"
                    />
                  </Field>
                  <Field label="Market (optional)" htmlFor="market">
                    <Input
                      id="market"
                      value={form.market}
                      onChange={(e) => update("market", e.target.value)}
                      placeholder="e.g. Coastal Metro"
                    />
                  </Field>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-8">
              <Button
                variant="ghost"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              {isLast ? (
                <Button onClick={finish} loading={loading}>
                  Build my learning path <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
