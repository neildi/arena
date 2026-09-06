import {
  Home,
  BookOpen,
  Map,
  MessagesSquare,
  Wrench,
  ClipboardCheck,
  ListChecks,
  Award,
  Users,
  BarChart3,
  PenSquare,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { NavIconKey } from "@/lib/nav";

const ICONS: Record<NavIconKey, LucideIcon> = {
  home: Home,
  "book-open": BookOpen,
  map: Map,
  "messages-square": MessagesSquare,
  wrench: Wrench,
  "clipboard-check": ClipboardCheck,
  "list-checks": ListChecks,
  award: Award,
  users: Users,
  "bar-chart": BarChart3,
  "pen-square": PenSquare,
  settings: Settings,
};

export function NavIcon({ name, className }: { name: NavIconKey; className?: string }) {
  const Icon = ICONS[name];
  return <Icon className={className} />;
}
