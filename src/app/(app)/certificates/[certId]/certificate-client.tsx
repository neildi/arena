"use client";

import Link from "next/link";
import { Card, CardBody } from "@/components/ui/card";
import { Pill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Award, Printer, ShieldCheck } from "lucide-react";

const LEVEL_LABEL: Record<string, string> = {
  course_completion: "Course Completion",
  demonstrated_skill: "Demonstrated Skill",
  manager_verified: "Manager Verified",
};

export function CertificateClient({ cert }: { cert: any }) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <Link href="/certificates" className="text-sm text-charcoal-500 inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to certificates
        </Link>
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> Print / Save PDF
        </Button>
      </div>

      <Card className="border-2 border-gold/40">
        <CardBody className="p-10 text-center bg-gradient-to-b from-champagne/20 to-transparent">
          <div className="h-16 w-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
            <Award className="h-8 w-8 text-gold-dark" />
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold-dark font-medium mb-2">
            {cert.org_name || "Aurelia Fine Jewelry Academy"}
          </p>
          <h1 className="font-serif text-2xl text-charcoal-900 mb-1">Certificate of {LEVEL_LABEL[cert.level] || cert.level}</h1>
          <p className="text-sm text-charcoal-500 mb-6">This certifies that</p>
          <p className="font-serif text-3xl text-charcoal-900 mb-6">{cert.learner_name}</p>
          <p className="text-sm text-charcoal-600 mb-1">has successfully completed</p>
          <p className="font-serif text-xl text-charcoal-900 mb-6">{cert.title}</p>
          {cert.course_title && cert.course_title !== cert.title && (
            <p className="text-sm text-charcoal-500 mb-4">{cert.course_title}</p>
          )}

          <div className="flex items-center justify-center gap-3 mb-6">
            <Pill tone="gold">{LEVEL_LABEL[cert.level] || cert.level}</Pill>
            {cert.verification_status === "manager_verified" && (
              <Pill tone="success">
                <ShieldCheck className="h-3.5 w-3.5" /> Manager Verified
              </Pill>
            )}
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-charcoal-500 border-t border-champagne pt-6">
            <div>
              <p className="text-xs text-charcoal-400 uppercase tracking-wide">Issued</p>
              <p className="text-charcoal-800">{new Date(cert.issued_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-charcoal-400 uppercase tracking-wide">Certificate ID</p>
              <p className="text-charcoal-800 font-mono">{cert.cert_uid}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <p className="text-xs text-charcoal-400 text-center print:hidden">
        This is a demo credential issued within the Aurelia Fine Jewelry Academy training platform for
        internal learning and development purposes.
      </p>
    </div>
  );
}
