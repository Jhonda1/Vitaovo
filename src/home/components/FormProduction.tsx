import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormProductionProps {
  id: string;
  label: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  value: string;
  disabled?: boolean;
  vertical?: boolean; // Nueva propiedad para controlar el diseño
}

export function FormProduction({
  id,
  label,
  onChange = () => {},
  value,
  disabled = false,
  vertical = true, // Valor predeterminado: true (vertical)
}: FormProductionProps) {
  return (
    <div
      key={id}
      className={`flex ${vertical ? "flex-col items-start" : "flex-row items-center justify-between"} gap-2`}
    >
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <Input
        type="text"
        placeholder={label}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={`mt-1 ${!vertical ? "w-20 ml-auto" : "w-full"}`} // Ancho fijo y alineación al final si no es vertical
      />
    </div>
  );
}