import React from "react";
import { Label } from "../ui/label";

export default function NotificationModel() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border p-4 bg-muted/30">
      <div className="space-y-1">
        <Label className="text-sm font-medium leading-none">Notificação</Label>
        <p className="text-xs text-muted-foreground">
          Bem-vindo! Em breve você poderá acompanhar suas vagas, testes e
          candidaturas por aqui.
        </p>
      </div>
    </div>
  );
}
