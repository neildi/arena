"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, User } from "lucide-react";
import type { SessionUser } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/roles";

export function Topbar({ user, title }: { user: SessionUser; title?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-champagne bg-ivory/80 backdrop-blur-sm sticky top-0 z-20">
      <div>
        {title ? <h1 className="font-serif text-xl text-charcoal-900">{title}</h1> : null}
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-charcoal-900">{user.name}</p>
          <p className="text-xs text-charcoal-500">{ROLE_LABELS[user.role]}</p>
        </div>
        <div className="h-9 w-9 rounded-full bg-champagne flex items-center justify-center text-charcoal-800">
          <User className="h-4 w-4" />
        </div>
        <button
          onClick={handleLogout}
          disabled={loading}
          aria-label="Sign out"
          className="p-2 rounded-md text-charcoal-500 hover:text-charcoal-900 hover:bg-ivory-200"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
