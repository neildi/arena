"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gem } from "lucide-react";
import { clsx } from "clsx";
import type { NavItem } from "@/lib/nav";
import { NavIcon } from "./nav-icon";

export function Sidebar({ items, orgName }: { items: NavItem[]; orgName: string }) {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 shrink-0 bg-charcoal-900 text-ivory h-screen sticky top-0">
      <div className="flex items-center gap-2 px-6 py-6 border-b border-charcoal-700/60">
        <Gem className="h-6 w-6 text-gold" />
        <div>
          <p className="font-serif text-lg leading-tight">Aurelia</p>
          <p className="text-[11px] text-charcoal-400 leading-tight">{orgName}</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-gold/15 text-gold-light font-medium"
                  : "text-charcoal-300 hover:bg-charcoal-800 hover:text-ivory"
              )}
              aria-current={active ? "page" : undefined}
            >
              <NavIcon name={item.icon} className="h-[18px] w-[18px] shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-charcoal-700/60 text-[11px] text-charcoal-500">
        Demo platform · fictional learners &amp; content
      </div>
    </aside>
  );
}
