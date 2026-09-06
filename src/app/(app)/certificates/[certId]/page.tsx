import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { CertificateClient } from "./certificate-client";

export default async function CertificateDetailPage({
  params,
}: {
  params: Promise<{ certId: string }>;
}) {
  const { certId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const db = getDb();
  const cert = db
    .prepare(
      `SELECT c.*, co.title as course_title, u.name as learner_name, o.name as org_name
       FROM certificates c
       LEFT JOIN courses co ON c.course_id = co.id
       LEFT JOIN users u ON c.user_id = u.id
       LEFT JOIN organizations o ON u.org_id = o.id
       WHERE c.id = ?`
    )
    .get(certId) as any;

  if (!cert) notFound();
  const elevated = ["store_manager", "trainer", "district_leader", "admin"].includes(user.role);
  if (cert.user_id !== user.id && !elevated) notFound();

  return <CertificateClient cert={cert} />;
}
