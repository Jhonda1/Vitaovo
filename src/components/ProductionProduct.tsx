import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProductionProductProps {
  productName: string; // Nombre del producto (por ejemplo, "Huevos A")
  onQuantityChange: (quantity: number) => void; // Función para manejar el cambio de cantidad
}

export const ProductionProduct: React.FC<ProductionProductProps> = ({
  productName,
  onQuantityChange,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onQuantityChange(isNaN(value) ? 0 : value); // Llama a la función con la cantidad ingresada
  };

  return (
    <div className=" p-1 border rounded-md shadow-sm">
      {/* Nombre del producto */}
      <Label className="text-sm font-medium text-gray-700 col-span-1">{productName}</Label>

      {/* Input para la cantidad */}
      <Input
        type="text"
        placeholder={`Can ${productName}`}
        onChange={handleInputChange}
        className="mt-1 col-span-3"
      />
    </div>
  );
};