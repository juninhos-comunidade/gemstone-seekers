import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LuX } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function QuizCloseModal({ onCancel }: { onCancel?: () => void }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleConfirmExit = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push("/candidate/dashboard/tests");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <button
          className="hover:text-destructive hover:border-destructive hover:bg-destructive/10 flex h-7 w-7 items-center justify-center rounded-lg border-2 border-white bg-transparent p-0 transition-all duration-200"
          aria-label="Fechar quiz"
        >
          <LuX className="!h-5 !w-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Fechar Quiz</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-muted-foreground text-sm">
            Deseja sair? Isso irá cancelar o quiz e você perderá seu progresso.
          </p>
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Não
          </Button>
          <Button variant="destructive" onClick={handleConfirmExit}>
            Sim
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
