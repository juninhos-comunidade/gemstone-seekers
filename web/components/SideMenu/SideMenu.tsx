"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseIcon, CodeIcon, HomeIcon, UsersIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const menuIcons = {
  briefcase: BriefcaseIcon,
  code: CodeIcon,
  home: HomeIcon,
  users: UsersIcon,
};

export interface MenuItem {
  label: string;
  href?: string;
  icon?: keyof typeof menuIcons;
}

interface SideMenuProps {
  items: MenuItem[];
}

export default function SideMenu({ items }: SideMenuProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed top-16 bottom-0 left-0 z-40 hidden w-72 border-r border-sidebar-border bg-sidebar/95 px-3 py-5 backdrop-blur md:block">
      <nav aria-label="Navegação do painel" className="flex h-full flex-col">
        <p className="px-3 pb-3 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          Menu principal
        </p>

        <ul className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon ? menuIcons[item.icon] : undefined;
            const isActive = item.href
              ? pathname === item.href || pathname.startsWith(`${item.href}/`)
              : false;

            return (
              <li key={item.label}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    {Icon && (
                      <Icon className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                    )}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70">
                    {Icon && <Icon className="size-4 shrink-0" />}
                    <span>{item.label}</span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-auto rounded-xl border border-sidebar-border bg-background/60 p-3 text-xs leading-relaxed text-muted-foreground">
          Acesse rapidamente as principais áreas do seu painel.
        </div>
      </nav>
    </aside>
  );
}
