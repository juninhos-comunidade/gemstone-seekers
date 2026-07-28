import React from "react";
import { SettingsIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ThemeDropdown } from "@/components/ThemeDropdown/ThemeDropdown";

export function SettingsModal() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Configurações" />
        }
      >
        <SettingsIcon className="size-4" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-lg font-semibold tracking-tight">
            Configurações
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between gap-4 rounded-xl border p-4 bg-muted/30">
            <div className="space-y-1">
              <Label className="text-sm font-medium leading-none">
                Aparência
              </Label>
              <p className="text-xs text-muted-foreground">
                Personalize o tema da interface
              </p>
            </div>

            <ThemeDropdown />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
