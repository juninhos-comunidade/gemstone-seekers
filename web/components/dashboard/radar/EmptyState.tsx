import { AlertCircle } from "lucide-react";

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="border-muted text-muted-foreground flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center">
      <AlertCircle className="mb-3 size-8" />
      <p className="max-w-md text-sm">{message}</p>
    </div>
  );
}
