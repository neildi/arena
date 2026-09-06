import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { listUserEnrollments } from "@/lib/repo/learning";
import { listCourses } from "@/lib/repo/learning";
import { LearningClient } from "./learning-client";

export default async function LearningPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const enrollments = listUserEnrollments(user.id);
  const allCourses = listCourses();

  return <LearningClient enrollments={enrollments} allCourses={allCourses} />;
}
