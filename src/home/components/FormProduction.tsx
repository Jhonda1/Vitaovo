import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormProductionProps {
  id: string;
  label: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  disabled?: boolean;
}

export function FormProduction({ id, label, onChange=()=>{}, value, disabled=false }: FormProductionProps) {
  return (
    
      <div key={id} className="flex flex-col items-center">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        <Input
          type="text"
          placeholder={label}
          
          value={value}
          disabled={disabled}
          onChange={onChange}
          className="mt-1"
        />
      </div>
    
  );
}