import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProductClasificationProps {
  productId: string; // ID único del producto
  productName: string; // Nombre del producto
  quantity: number; // Cantidad inicial del producto
  onQuantityChange: (productId: string, quantity: number) => void; // Función para manejar el cambio de cantidad
}

export const ProductClasification: React.FC<ProductClasificationProps> = ({
  productId,
  productName,
  quantity,
  onQuantityChange,
}) => {
  const handleInputChangeProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onQuantityChange(productId, isNaN(value) ? 0 : value); // Llama a la función con el ID y la cantidad ingresada
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-md shadow-sm bg-white">
      {/* Nombre del producto */}
      <Label className="text-sm font-medium text-gray-700 col-span-1">{productName}</Label>

      {/* Input para la cantidad */}
      <Input
        type="text"
        value={quantity}
        onChange={handleInputChangeProduct}
        className="mt-1 col-span-3"
        placeholder="Cantidad"
      />
    </div>
  );
};