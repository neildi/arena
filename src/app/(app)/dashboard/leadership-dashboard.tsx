import Link from "next/link";
import type { SessionUser } from "@/lib/auth";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { getDb } from "@/lib/db";
import { ArrowRight, Users, BookOpen, Award, MessagesSquare } from "lucide-react";
import { ROLE_LABELS } from "@/lib/roles";

export function LeadershipDashboard({ user }: { user: SessionUser }) {
  const db = getDb();
  const activeLearners = db
    .prepare("SELECT COUNT(*) c FROM users WHERE role = 'learner' AND archived_at IS NULL")
    .get() as any;
  const totalCourses = db.prepare("SELECT COUNT(*) c FROM courses WHERE archived_at IS NULL").get() as any;
  const certsIssued = db.prepare("SELECT COUNT(*) c FROM certificates WHERE archived_at IS NULL").get() as any;
  const roleplayAttempts = db.prepare("SELECT COUNT(*) c FROM role_play_attempts").get() as any;
  const recentAnnouncements = db
    .prepare("SELECT * FROM announcements WHERE archived_at IS NULL ORDER BY created_at DESC LIMIT 3")
    .all();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-charcoal-500">{ROLE_LABELS[user.role]}</p>
        <h1 className="font-serif text-3xl text-charcoal-900">Welcome back, {user.name.split(" ")[0]}</h1>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardBody className="flex items-center gap-3">
            <Users className="h-8 w-8 text-gold-dark" />
            <div>
              <p className="text-2xl font-serif text-charcoal-900">{activeLearners.c}</p>
              <p className="text-xs text-charcoal-500">Active learners</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-gold-dark" />
            <div>
              <p className="text-2xl font-serif text-charcoal-900">{totalCourses.c}</p>
              <p className="text-xs text-charcoal-500">Published courses</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-3">
            <Award className="h-8 w-8 text-gold-dark" />
            <div>
              <p className="text-2xl font-serif text-charcoal-900">{certsIssued.c}</p>
              <p className="text-xs text-charcoal-500">Certificates issued</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-3">
            <MessagesSquare className="h-8 w-8 text-gold-dark" />
            <div>
              <p className="text-2xl font-serif text-charcoal-900">{roleplayAttempts.c}</p>
              <p className="text-xs text-charcoal-500">Role-play attempts</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Where to go next</CardTitle>
          </CardHeader>
          <CardBody className="grid sm:grid-cols-2 gap-3">
            <Link href="/analytics" className="rounded-xl border border-champagne p-4 hover:bg-ivory-100 transition-colors">
              <p className="font-medium text-charcoal-900 mb-1">Analytics</p>
              <p className="text-sm text-charcoal-500">
                View learning performance, skill-gap trends, and certification data.
              </p>
              <span className="text-xs text-gold-dark inline-flex items-center gap-1 mt-2">
                Open <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
            <Link href="/content-studio" className="rounded-xl border border-champagne p-4 hover:bg-ivory-100 transition-colors">
              <p className="font-medium text-charcoal-900 mb-1">Content Studio</p>
              <p className="text-sm text-charcoal-500">
                Create and manage courses, lessons, quizzes, and role-play scenarios.
              </p>
              <span className="text-xs text-gold-dark inline-flex items-center gap-1 mt-2">
                Open <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
            <Link href="/coaching" className="rounded-xl border border-champagne p-4 hover:bg-ivory-100 transition-colors">
              <p className="font-medium text-charcoal-900 mb-1">Team Coaching</p>
              <p className="text-sm text-charcoal-500">
                Review coaching notes, observations, and verification requests.
              </p>
              <span className="text-xs text-gold-dark inline-flex items-center gap-1 mt-2">
                Open <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
            <Link href="/organization" className="rounded-xl border border-champagne p-4 hover:bg-ivory-100 transition-colors">
              <p className="font-medium text-charcoal-900 mb-1">Organization Settings</p>
              <p className="text-sm text-charcoal-500">
                Manage users, locations, teams, and platform settings.
              </p>
              <span className="text-xs text-gold-dark inline-flex items-center gap-1 mt-2">
                Open <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {recentAnnouncements.length === 0 ? (
              <p className="text-sm text-charcoal-500">No announcements yet.</p>
            ) : (
              (recentAnnouncements as any[]).map((a) => (
                <div key={a.id}>
                  <p className="text-sm font-medium text-charcoal-800">{a.title}</p>
                  <p className="text-xs text-charcoal-500 line-clamp-2">{a.body}</p>
                </div>
              ))
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
