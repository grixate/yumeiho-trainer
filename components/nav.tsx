import Link from "next/link";
import type { ComponentType } from "react";
import {
  BookOpen,
  Brain,
  ClipboardList,
  Home,
  Library,
  ListChecks,
  Menu,
  Settings,
  Waypoints,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const primaryNavItems = [
  { href: "/exercises", label: "Приемы", icon: Library },
  { href: "/sequences", label: "Потоки", icon: Waypoints },
];

const secondaryNavItems = [
  { href: "/", label: "Главная", icon: Home },
  { href: "/theory", label: "Знания", icon: BookOpen },
  { href: "/study", label: "Тренировка", icon: Brain },
  { href: "/practice-log", label: "Практика", icon: ClipboardList },
  { href: "/admin", label: "Управление", icon: Settings },
];

function NavLinks({ includeSecondary = false }: { includeSecondary?: boolean }) {
  return (
    <nav className="grid gap-1">
      {primaryNavItems.map((item) => (
        <NavLink key={item.href} item={item} primary />
      ))}
      {includeSecondary ? (
        <div className="mt-5 border-t border-stone-200 pt-5">
          <div className="mb-2 px-3 text-xs font-bold uppercase tracking-[0.16em] text-stone-400">Еще</div>
          <div className="grid gap-1">
            {secondaryNavItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        </div>
      ) : null}
    </nav>
  );
}

function NavLink({
  item,
  primary,
}: {
  item: { href: string; label: string; icon: ComponentType<{ className?: string }> };
  primary?: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={
        primary
          ? "flex items-center gap-3 rounded-2xl bg-stone-100/70 px-3 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-stone-200/80"
          : "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-950"
      }
    >
      <item.icon className="h-4 w-4" />
      {item.label}
    </Link>
  );
}

export function AppSidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-stone-200/70 bg-white/62 px-4 py-5 backdrop-blur lg:block">
      <Link href="/" className="mb-8 flex items-center gap-3 px-2 text-stone-950">
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-950 text-white">
          <ListChecks className="h-5 w-5" />
        </span>
        <span>
          <span className="block text-sm font-semibold">Yumeiho Trainer</span>
          <span className="block text-xs text-stone-500">Практическая память</span>
        </span>
      </Link>
      <NavLinks />
      <details className="mt-5 border-t border-stone-200 pt-5">
        <summary className="cursor-pointer list-none rounded-xl px-3 py-2 text-sm font-semibold text-stone-500 hover:bg-stone-100 hover:text-stone-950">
          Еще
        </summary>
        <div className="mt-2 grid gap-1">
          {secondaryNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>
      </details>
    </aside>
  );
}

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/88 backdrop-blur lg:hidden">
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold text-stone-950">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-950 text-white">
            <ListChecks className="h-5 w-5" />
          </span>
          Yumeiho Trainer
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-xl bg-white/80">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Меню</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="mb-8 text-sm font-semibold text-stone-950">Навигация</div>
            <NavLinks includeSecondary />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
