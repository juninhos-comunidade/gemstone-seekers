import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectLevelProps = {
  value?: string;
  onValueChange?: (_value: string) => void;
  disabled?: boolean;
};

const items = [
  { label: "Selecione", value: "" },
  { label: "Estagiário", value: "estagiario" },
  { label: "Júnior", value: "junior" },
  { label: "Pleno", value: "pleno" },
  { label: "Sênior", value: "senior" },
];

export function SelectLevel({
  value,
  onValueChange,
  disabled,
}: SelectLevelProps) {
  return (
    <Select
      items={items}
      value={value ?? null}
      onValueChange={(nextValue) => onValueChange?.(nextValue ?? "")}
    >
      <SelectTrigger
        className="w-full"
        disabled={disabled}
        aria-label="Nível de experiência"
      >
        <SelectValue placeholder="Selecione o nível" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
