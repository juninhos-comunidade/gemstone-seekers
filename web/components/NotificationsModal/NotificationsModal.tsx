import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BellIcon } from "lucide-react";
import { NotificationModel } from "@/components/NotificationModel/NotificationModel";
import { Button } from "@/components/ui/button";

export function NotificationsModal() {
  const _nilce = "NotificationsModal";
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Notificações" />
        }
      >
        <BellIcon className="size-4" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-lg font-semibold tracking-tight">
            Notificações
          </DialogTitle>
        </DialogHeader>

        {/* Ajustado: overflow-y-auto para rolagem vertical e overflow-x-hidden para travar a horizontal */}
        <div className="max-h-[400px] space-y-4 overflow-y-auto overflow-x-hidden py-2 pr-1">
          {/* modelo simples de notificação  */}
          <NotificationModel />
          <NotificationModel />
          <NotificationModel />
          <NotificationModel />
          <NotificationModel />
          <NotificationModel />
          <NotificationModel />
        </div>
      </DialogContent>
    </Dialog>
  );
}
