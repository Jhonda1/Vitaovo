// components/MultiSelect.tsx
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, ChevronDown } from "lucide-react"

interface Option {
  value: string
  label: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export function MultiSelect({ options, selected, onChange }: MultiSelectProps) {
  const allSelected = options.length > 0 && selected.length === options.length;
  const isIndeterminate = selected.length > 0 && !allSelected;

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const toggleAll = () => {
    if (allSelected) {
      onChange([]);
    } else {
      onChange(options.map((opt) => opt.value));
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex w-full min-w-0 justify-between truncate"
        >
          <span className="truncate">
            {selected.length > 0
              ? `${selected.length} seleccionados`
              : "Seleccionar opciones"}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 opacity-50 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Buscar..." />
          <CommandList>
            {/* Opción Todos */}
            <CommandItem onSelect={toggleAll}>
              <Checkbox
                checked={allSelected}
                className="mr-2"
                ref={el => {
                  if (el) {
                    (el as HTMLInputElement).indeterminate = isIndeterminate;
                  }
                }}
              />
              Todos
              {allSelected && <Check className="ml-auto h-4 w-4 text-primary" />}
            </CommandItem>
            {/* Opciones individuales */}
            {options.map((option) => (
              <CommandItem key={option.value} onSelect={() => toggleOption(option.value)}>
                <Checkbox
                  checked={selected.includes(option.value)}
                  className="mr-2"
                />
                {option.label}
                {selected.includes(option.value) && <Check className="ml-auto h-4 w-4 text-primary" />}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
