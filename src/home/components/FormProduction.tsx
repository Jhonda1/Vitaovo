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

/* 


interface ProductionProductProps {
  productId: string; // ID del producto
  productName: string; // Nombre del producto
  onQuantityChange: (productId: string, quantity: number) => void; // Función para manejar el cambio de cantidad
}

export const ProductionProduct: React.FC<ProductionProductProps> = ({
  productId,
  onQuantityChange,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onQuantityChange(productId, isNaN(value) ? 0 : value); // Llama a la función con el ID del producto y la cantidad ingresada
  };

  return (
    <div className="grid grid-cols-5 gap-4 p-4 border rounded-md shadow-sm bg-white w-full">
      
      {[
      { label: "Huevos", id: "huevos" },
      { label: "Picado", id: "picado" },
      { label: "Forro", id: "forro" },
      { label: "Quebrado", id: "quebrado" },
      { label: "Total Huevos", id: "total" },
      ].map(({ label, id }) => (
      <div key={id} className="flex flex-col items-center">
        <Label
        htmlFor={`input-${productId}-${id}`}
        className="text-sm font-medium text-gray-700"
        >
        {label}
        </Label>
        <Input
        type="text"
        placeholder={label}
        onChange={handleInputChange}
        className="mt-1"
        id={`input-${productId}-${id}`}
        />
      </div>
      ))}
    </div>
  );
}; */
