import {
  Select as UiSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  items: SelectOption[];
  value?: string;
  onValueChange?: (_value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  ariaLabel?: string;
};

export function SelectFilter({
  items,
  value,
  onValueChange,
  placeholder = "Selecione",
  disabled = false,
  className,
  triggerClassName = "w-full",
  ariaLabel,
}: SelectProps) {
  return (
    <UiSelect
      items={items}
      value={value ?? null}
      onValueChange={(nextValue) => onValueChange?.(nextValue ?? "")}
      disabled={disabled}
    >
      <SelectTrigger
        className={triggerClassName}
        aria-label={ariaLabel ?? placeholder}
      >
        <SelectValue placeholder={placeholder} className={className} />
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
    </UiSelect>
  );
}

export type { SelectOption, SelectProps };
