import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useParams } from "next/navigation";

export default function TestPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <span className="text-sm font-medium text-muted-foreground">
          Questão 1
        </span>
        <h2 className="mt-2 text-xl font-semibold">
          Qual linguagem é utilizada pelo React?
        </h2>
        <RadioGroup defaultValue="option-one" className="mt-6 space-y-3">
          <div className="flex items-center rounded-lg border p-4 transition-colors hover:bg-muted">
            <RadioGroupItem value="option-one" id="option-one" />
            <Label
              htmlFor="option-one"
              className="ml-3 w-full cursor-pointer"
            >
              JavaScript
            </Label>
          </div>
          <div className="flex items-center rounded-lg border p-4 transition-colors hover:bg-muted">
            <RadioGroupItem value="option-two" id="option-two" />
            <Label
              htmlFor="option-two"
              className="ml-3 w-full cursor-pointer"
            >
              Python
            </Label>
          </div>
          <div className="flex items-center rounded-lg border p-4 transition-colors hover:bg-muted">
            <RadioGroupItem value="option-three" id="option-three" />
            <Label
              htmlFor="option-three"
              className="ml-3 w-full cursor-pointer"
            >
              Java
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
