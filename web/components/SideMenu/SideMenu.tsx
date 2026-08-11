"use client";

import { FaAward, FaBriefcase, FaCode, FaHome, FaUsers } from "react-icons/fa";
import { LuRadar } from "react-icons/lu";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const menuIcons = {
  award: FaAward,
  briefcase: FaBriefcase,
  code: FaCode,
  home: FaHome,
  users: FaUsers,
  LuRadar,
};

export interface MenuItem {
  label: string;
  href?: string;
  icon?: keyof typeof menuIcons;
}

interface SideMenuProps {
  items: MenuItem[];
  mobile?: boolean;
}

export function SideMenu({ items, mobile = false }: SideMenuProps) {
  const pathname = usePathname();

  const activeHref = items
    .filter((item) => {
      if (!item.href) return false;
      return pathname === item.href || pathname.startsWith(`${item.href}/`);
    })
    .sort((a, b) => (b.href?.length ?? 0) - (a.href?.length ?? 0))[0]?.href;

  return (
    <aside
      className={cn(
        "border-sidebar-border bg-sidebar/95 border-r px-3 py-5 backdrop-blur",
        mobile
          ? "relative top-0 left-0 block h-auto w-full border-0 bg-transparent p-0"
          : "fixed top-16 bottom-0 left-0 z-40 hidden w-72 md:block",
      )}
    >
      <nav
        aria-label="Navegação do painel"
        className={cn("flex h-full flex-col", mobile && "h-auto")}
      >
        <p className="text-muted-foreground px-3 pb-3 text-xs font-semibold tracking-[0.16em] uppercase">
          Menu principal
        </p>

        <ul className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon ? menuIcons[item.icon] : undefined;
            const isActive = item.href ? item.href === activeHref : false;

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
                  <span className="text-sidebar-foreground/70 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium">
                    {Icon && <Icon className="size-4 shrink-0" />}
                    <span>{item.label}</span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        <div
          className={cn(
            "border-sidebar-border bg-background/60 text-muted-foreground mt-auto rounded-xl border p-3 text-xs leading-relaxed",
            mobile && "mt-4",
          )}
        >
          Acesse rapidamente as principais áreas do seu painel.
        </div>
      </nav>
    </aside>
  );
}
