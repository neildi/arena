"use client";

import Link from "next/link";
import { Card, CardBody } from "@/components/ui/card";
import { Pill } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Award, Lock, ShieldCheck } from "lucide-react";

const LEVEL_LABEL: Record<string, string> = {
  course_completion: "Course Completion",
  demonstrated_skill: "Demonstrated Skill",
  manager_verified: "Manager Verified",
};

const LEVEL_TONE: Record<string, "gold" | "info" | "success"> = {
  course_completion: "info",
  demonstrated_skill: "gold",
  manager_verified: "success",
};

export function CertificatesClient({
  certificates,
  earnedBadges,
  lockedBadges,
}: {
  certificates: any[];
  earnedBadges: any[];
  lockedBadges: any[];
}) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-charcoal-900 mb-1">Certificates &amp; Badges</h1>
        <p className="text-sm text-charcoal-500">
          Your earned credentials and recognitions across the Aurelia curriculum.
        </p>
      </div>

      <section>
        <h2 className="font-serif text-xl text-charcoal-900 mb-3">Certificates</h2>
        {certificates.length === 0 ? (
          <EmptyState
            icon={<Award className="h-8 w-8" />}
            title="No certificates yet"
            description="Complete a course to earn your first certificate."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((c) => (
              <Link key={c.id} href={`/certificates/${c.id}`}>
                <Card className="h-full border-gold/30 hover:border-gold transition-colors">
                  <CardBody>
                    <div className="flex items-start justify-between mb-3">
                      <Award className="h-8 w-8 text-gold-dark" />
                      <Pill tone={LEVEL_TONE[c.level] || "neutral"}>{LEVEL_LABEL[c.level] || c.level}</Pill>
                    </div>
                    <h3 className="font-serif text-lg text-charcoal-900 mb-1">{c.title}</h3>
                    {c.course_title && <p className="text-xs text-charcoal-500 mb-2">{c.course_title}</p>}
                    <p className="text-xs text-charcoal-500">
                      Issued {new Date(c.issued_at).toLocaleDateString()}
                    </p>
                    {c.verification_status === "manager_verified" && (
                      <p className="text-xs text-success flex items-center gap-1 mt-2">
                        <ShieldCheck className="h-3.5 w-3.5" /> Manager verified
                      </p>
                    )}
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-serif text-xl text-charcoal-900 mb-3">Earned Badges</h2>
        {earnedBadges.length === 0 ? (
          <EmptyState title="No badges yet" description="Keep learning and practicing to earn badges." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {earnedBadges.map((b) => (
              <Card key={b.id}>
                <CardBody className="text-center">
                  <div className="h-12 w-12 rounded-full bg-champagne/50 flex items-center justify-center mx-auto mb-2">
                    <Award className="h-6 w-6 text-gold-dark" />
                  </div>
                  <h3 className="font-medium text-charcoal-900 text-sm mb-1">{b.title}</h3>
                  <p className="text-xs text-charcoal-500">{b.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>

      {lockedBadges.length > 0 && (
        <section>
          <h2 className="font-serif text-xl text-charcoal-900 mb-3">Badges to Earn</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {lockedBadges.map((b) => (
              <Card key={b.id} className="opacity-60">
                <CardBody className="text-center">
                  <div className="h-12 w-12 rounded-full bg-charcoal-100 flex items-center justify-center mx-auto mb-2">
                    <Lock className="h-5 w-5 text-charcoal-400" />
                  </div>
                  <h3 className="font-medium text-charcoal-900 text-sm mb-1">{b.title}</h3>
                  <p className="text-xs text-charcoal-500">{b.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
