"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { Gem } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("learner");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to create account.");
        return;
      }
      showToast("Account created — let's personalize your learning path.", "success");
      router.push("/onboarding");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal-900 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-ivory p-8 md:p-10 shadow-2xl border border-champagne-dark/30">
        <div className="flex items-center gap-2 mb-6">
          <Gem className="h-6 w-6 text-gold-dark" />
          <span className="font-serif text-xl text-charcoal-900">Aurelia</span>
        </div>
        <h2 className="font-serif text-2xl text-charcoal-900 mb-1">Create your account</h2>
        <p className="text-sm text-charcoal-500 mb-6">
          Start building your fine-jewelry retail expertise.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Field label="Full name" htmlFor="name" required>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Email" htmlFor="email" required>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Password" htmlFor="password" required hint="At least 8 characters.">
            <Input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <Field label="Your role" htmlFor="role" required>
            <Select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="learner">Learner (Sales Associate / Advisor)</option>
              <option value="store_manager">Store Manager</option>
              <option value="trainer">Trainer / L&amp;D Lead</option>
              <option value="district_leader">District Leader</option>
              <option value="admin">Administrator</option>
            </Select>
          </Field>
          {error ? (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="w-full" loading={loading}>
            Create account
          </Button>
        </form>
        <p className="text-sm text-charcoal-500 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-gold-dark font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
