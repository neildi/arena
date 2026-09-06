"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Gem } from "lucide-react";
import { clsx } from "clsx";
import type { NavItem } from "@/lib/nav";
import { NavIcon } from "./nav-icon";

export function MobileNav({ items, orgName }: { items: NavItem[]; orgName: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-charcoal-900 text-ivory sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Gem className="h-5 w-5 text-gold" />
          <span className="font-serif text-base">Aurelia</span>
        </Link>
        <button
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="p-2 rounded-md hover:bg-charcoal-800"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-30 bg-charcoal-900 text-ivory pt-14 overflow-y-auto">
          <p className="px-4 pb-2 text-xs text-charcoal-400">{orgName}</p>
          <nav className="px-3 pb-6 space-y-0.5">
            {items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={clsx(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm",
                    active ? "bg-gold/15 text-gold-light font-medium" : "text-charcoal-300"
                  )}
                >
                  <NavIcon name={item.icon} className="h-[18px] w-[18px]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
