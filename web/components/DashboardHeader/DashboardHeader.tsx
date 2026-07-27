"use client";
import { GemIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import SettingsModal from "../SettingsModal/SettingsModal";
import NotificationsModal from "../NotifcationsModal/NotificationsModal";

type DashboardHeaderProps = {
  role: "candidate" | "recruiter";
};

export default function DashboardHeader({ role }: DashboardHeaderProps) {
  const roleLabel = role === "candidate" ? "Candidato" : "Recrutador";
  const initials = role === "candidate" ? "CA" : "RE";

  return (
    <header className="fixed top-0 right-0 left-0 z-50 h-16 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-full max-w-screen-2xl items-center justify-between px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 text-sm font-semibold tracking-tight transition-colors hover:text-primary"
          >
            <span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <GemIcon className="size-4" />
            </span>
            <span className="hidden sm:inline">Gemstone Seekers</span>
          </Link>

          <span className="hidden h-6 w-px bg-border sm:block" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              Painel do {roleLabel}
            </p>
            <p className="hidden text-xs text-muted-foreground sm:block">
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
          >
            <span className="text-[10px] font-bold">{initials}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
