import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";

interface CustomSelectProps {
  label: string; // Texto del Label
  placeholder?: string; // Placeholder opcional
  onChange: (value: string) => void; // Función para manejar el cambio de valor
  children: React.ReactNode; // Componentes hijos
  defaultChecked?: string; // Valor por defecto
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  placeholder = "Selecciona una opción",
  onChange,
  children,
  defaultChecked,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Select onValueChange={onChange} value={defaultChecked} >
        <SelectTrigger  className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-white">{children}</SelectContent>
      </Select>
    </div>
  );
};
