"use client";

import { FaGem } from "react-icons/fa";
import { LogOut, MenuIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { SettingsModal } from "@/components/SettingsModal/SettingsModal";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SideMenu, type MenuItem } from "@/components/SideMenu/SideMenu";
import { logout } from "@/lib/api/auth";

type userHeaderProps = {
  role: "candidate" | "recruiter";
  menuItems?: MenuItem[];
};

export function UserHeader({ role, menuItems = [] }: userHeaderProps) {
  const roleLabel = role === "candidate" ? "Candidato" : "Recrutador";
  const router = useRouter();

  const handleProfile = () => {
    if (role === "candidate") {
      router.push("/candidate/user");
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-background/95 sticky top-0 z-50 h-16 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-full max-w-screen-2xl items-center justify-between gap-3 px-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-5">
          {menuItems.length > 0 && (
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Abrir menu"
                    className="size-8 md:hidden"
                  />
                }
              >
                <MenuIcon className="size-4" />
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[85vw] max-w-72 p-0"
                showCloseButton
              >
                <SheetHeader className="border-b px-4 py-4">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="p-3">
                  <SideMenu items={menuItems} mobile />
                </div>
              </SheetContent>
            </Sheet>
          )}
          <Link
            href={
              role === "candidate"
                ? "/candidate/dashboard"
                : "/recruiter/dashboard"
            }
            className="hover:text-primary flex min-w-0 shrink items-center gap-2 text-sm font-semibold tracking-tight transition-colors"
          >
            <span className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-xl shadow-sm">
              <FaGem className="size-4" />
            </span>
            <span className="hidden truncate sm:inline">Gemstone Seekers</span>
          </Link>

          <span className="bg-border hidden h-6 w-px md:block" />
          <div className="min-w-0">
            <p className="truncate text-xs font-medium sm:text-sm">
              Painel do {roleLabel}
            </p>
            <p className="text-muted-foreground hidden text-xs md:block">
              Visão geral da sua conta
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <div className="sm:inline-flex">
            <SettingsModal />
          </div>
          {role === "candidate" && (
            <Button
              variant="outline"
              size="icon"
              aria-label="Perfil"
              className="ml-0 rounded-full sm:ml-1"
              onClick={handleProfile}
            >
              <span className="text-[10px] font-bold">CA</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Sair da conta"
            title="Sair da conta"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
