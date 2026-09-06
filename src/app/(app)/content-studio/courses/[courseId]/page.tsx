import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getCourseWithDetails } from "@/lib/repo/learning";
import { CourseEditorClient } from "./course-editor-client";

export default async function CourseEditorPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!["trainer", "admin"].includes(user.role)) redirect("/dashboard");

  const course = getCourseWithDetails(courseId);
  if (!course) notFound();

  return <CourseEditorClient course={course} />;
}
