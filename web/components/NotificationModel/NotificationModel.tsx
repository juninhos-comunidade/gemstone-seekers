import React from "react";
import { Label } from "@/components/ui/label";

export function NotificationModel() {
  return (
    <div className="bg-muted/30 flex items-center justify-between gap-4 rounded-xl border p-4">
      <div className="space-y-1">
        <Label className="text-sm leading-none font-medium">Notificação</Label>
        <p className="text-muted-foreground text-xs">
          Bem-vindo! Em breve você poderá acompanhar suas vagas, testes e
          candidaturas por aqui.
        </p>
      </div>
    </div>
  );
}
