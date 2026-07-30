import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaBell } from "react-icons/fa";
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
        <FaBell className="size-4" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-lg font-semibold tracking-tight">
            Notificações
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[400px] space-y-4 overflow-x-hidden overflow-y-auto py-2 pr-1">
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
