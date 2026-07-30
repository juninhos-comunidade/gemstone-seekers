"use client";

import { FaGem } from "react-icons/fa";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SettingsModal } from "@/components/SettingsModal/SettingsModal";
import { NotificationsModal } from "@/components/NotificationsModal/NotificationsModal";
import { useRouter } from "next/navigation";
type DashboardHeaderProps = {
  role: "candidate" | "recruiter";
};

export function DashboardHeader({ role }: DashboardHeaderProps) {
  const roleLabel = role === "candidate" ? "Candidato" : "Recrutador";
  const initials = role === "candidate" ? "CA" : "RE";

  const router = useRouter();

  const handleProfile = () => {
    if (role === "candidate") {
      router.push("/candidate/user");
    } else {
      router.push("/recruiter/user");
    }
  };

  return (
    <header className="bg-background/95 fixed top-0 right-0 left-0 z-50 h-16 border-b backdrop-blur">
      <div className="mx-auto flex h-full max-w-screen-2xl items-center justify-between px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <Link
            href={
              role === "candidate"
                ? "/candidate/dashboard"
                : "/recruiter/dashboard"
            }
            className="hover:text-primary flex shrink-0 items-center gap-2 text-sm font-semibold tracking-tight transition-colors"
          >
            <span className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-xl shadow-sm">
              <FaGem className="size-4" />
            </span>
            <span className="hidden sm:inline">Gemstone Seekers</span>
          </Link>

          <span className="bg-border hidden h-6 w-px sm:block" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              Painel do {roleLabel}
            </p>
            <p className="text-muted-foreground hidden text-xs sm:block">
              Visão geral da sua conta
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <NotificationsModal />
          <div className="hidden sm:inline-flex">
            <SettingsModal />
          </div>
          <Button
            variant="outline"
            size="icon"
            aria-label="Perfil"
            className="ml-1 rounded-full"
            onClick={handleProfile}
          >
            <span className="text-[10px] font-bold">{initials}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
