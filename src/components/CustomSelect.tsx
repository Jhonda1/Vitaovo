import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface CustomSelectProps {
  label: string; // Texto del Label
  id: string; // ID para asociar el Label con el Select
  options: { value: string; label: string }[]; // Opciones del Select
  placeholder?: string; // Placeholder opcional
  onChange: (value: string) => void; // Función para manejar el cambio de valor
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ label, id, options, placeholder = "Selecciona una opción", onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Select onValueChange={onChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};