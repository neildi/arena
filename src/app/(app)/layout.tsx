import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { navForRole } from "@/lib/nav";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Topbar } from "@/components/layout/topbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.onboarded) redirect("/onboarding");

  const items = navForRole(user.role);

  return (
    <div className="flex min-h-screen bg-ivory">
      <div data-app-sidebar>
        <Sidebar items={items} orgName="Aurelia Fine Jewelry Academy" />
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <div data-app-mobile-nav>
          <MobileNav items={items} orgName="Aurelia Fine Jewelry Academy" />
        </div>
        <div data-app-topbar>
          <Topbar user={user} />
        </div>
        <main className="flex-1 px-4 py-5 lg:px-8 lg:py-6 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
