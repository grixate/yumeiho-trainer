import Link from "next/link";
import {
  BookOpen,
  Brain,
  ClipboardList,
  Home,
  Library,
  ListChecks,
  Settings,
  Waypoints,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: "/", label: "Главная", icon: Home },
  { href: "/exercises", label: "Приемы", icon: Library },
  { href: "/theory", label: "Знания", icon: BookOpen },
  { href: "/study", label: "Тренировка", icon: Brain },
  { href: "/sequences", label: "Потоки", icon: Waypoints },
  { href: "/practice-log", label: "Практика", icon: ClipboardList },
  { href: "/admin", label: "Управление", icon: Settings },
];

function NavLinks() {
  return (
    <nav className="grid gap-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-950"
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function AppSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-stone-200/70 bg-white/55 px-4 py-5 backdrop-blur lg:block">
      <Link href="/" className="mb-8 flex items-center gap-3 px-2 text-stone-950">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-950 text-white">
          <ListChecks className="h-5 w-5" />
        </span>
        <span>
          <span className="block text-sm font-semibold">Yumeiho Trainer</span>
          <span className="block text-xs text-stone-500">Память последовательностей</span>
        </span>
      </Link>
      <NavLinks />
    </aside>
  );
}

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/82 backdrop-blur lg:hidden">
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold text-stone-950">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-950 text-white">
            <ListChecks className="h-5 w-5" />
          </span>
          Yumeiho Trainer
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              Меню
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="mb-8 text-sm font-semibold text-stone-950">Навигация</div>
            <NavLinks />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
