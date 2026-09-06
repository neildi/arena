"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { Gem } from "lucide-react";

const DEMO_ACCOUNTS = [
  { label: "Learner — New Associate", email: "mia.alvarez@aureliademo.com" },
  { label: "Store Manager", email: "renee.whitfield@aureliademo.com" },
  { label: "Trainer / L&D Lead", email: "sofia.marchetti@aureliademo.com" },
  { label: "District Leader", email: "marcus.ferreira@aureliademo.com" },
  { label: "Administrator", email: "taylor.kim@aureliademo.com" },
];
const DEMO_PASSWORD = "Aurelia2026!";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to sign in.");
        return;
      }
      showToast("Welcome back to Aurelia Fine Jewelry Academy.", "success");
      router.push(data.user.onboarded ? "/dashboard" : "/onboarding");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(demoEmail: string) {
    setEmail(demoEmail);
    setPassword(DEMO_PASSWORD);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal-900 px-4 py-12">
      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl border border-champagne-dark/30">
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-700 p-10 text-ivory">
          <div className="flex items-center gap-2">
            <Gem className="h-6 w-6 text-gold" />
            <span className="font-serif text-xl">Aurelia</span>
          </div>
          <div>
            <h1 className="font-serif text-3xl leading-tight mb-3">
              Fine Jewelry Academy
            </h1>
            <p className="text-champagne text-sm leading-relaxed">
              Build product knowledge, practice client conversations, and grow
              your fine-jewelry retail career — from the sales floor to store
              leadership.
            </p>
          </div>
          <p className="text-xs text-charcoal-400">
            Demo platform with fictional learners, stores, and training content.
          </p>
        </div>
        <div className="bg-ivory p-8 md:p-10">
          <h2 className="font-serif text-2xl text-charcoal-900 mb-1">Sign in</h2>
          <p className="text-sm text-charcoal-500 mb-6">
            Continue your learning journey.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Field label="Email" htmlFor="email" required>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label="Password" htmlFor="password" required>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            {error ? (
              <p role="alert" className="text-sm text-danger">
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full" loading={loading}>
              Sign in
            </Button>
          </form>
          <p className="text-sm text-charcoal-500 mt-4">
            New here?{" "}
            <Link href="/signup" className="text-gold-dark font-medium hover:underline">
              Create an account
            </Link>
          </p>
          <div className="mt-6 border-t border-champagne pt-4">
            <p className="text-xs font-medium text-charcoal-500 mb-2">
              Quick demo sign-in (password: {DEMO_PASSWORD})
            </p>
            <div className="flex flex-wrap gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => fillDemo(acc.email)}
                  className="text-xs rounded-full border border-champagne-dark/50 bg-white px-3 py-1.5 text-charcoal-700 hover:bg-champagne/40"
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
