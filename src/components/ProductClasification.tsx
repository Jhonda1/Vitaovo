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

  return (
    <div className="flex items-center justify-between p-4 border rounded-md shadow-sm bg-white">
      {/* Nombre del producto */}
      <Label className="text-sm font-medium text-gray-700 col-span-1">{productName}</Label>

      {/* Input para la cantidad */}
        <Input
          type="number"
          value={quantity ? Number(quantity).toLocaleString("es-CO") : ""}
          onChange={(e) => {
            const rawValue = e.target.value.replace(/[^0-9,]/g, "");
            const numericValue = rawValue.replace(/,/g, "");
            onQuantityChange(productId, numericValue ? parseInt(numericValue, 10) : 0);
          }}
          className="mt-1 col-span-3"
          placeholder="Cantidad"
        />
    </div>
  );
};