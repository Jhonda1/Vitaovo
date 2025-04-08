import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Product } from "@/types";


interface ProductionProductProps {
  products: Product[]; // Lista de productos
  onInputChange: (productId: string, value: string) => void; // Función para manejar cambios en los inputs
}

export const ProductionProduct: React.FC<ProductionProductProps> = ({ products, onInputChange }) => {

  return (
    <div className="flex flex-col gap-4">
      {products.map((product) => (
      <div
        key={product.productId}
        className=""
      >
        {/* Nombre del producto */}
        <Label className="text-xs font-medium text-gray-700 w-1/2 text-balance">
        {product.name}
        </Label>

        {/* Input para la cantidad */}
        <Input
        type="text"
        placeholder={`Cant ${product.name}`}
        onChange={(e) => onInputChange(product.productId, e.target.value)}
        className="mt-1 w-1/2 text-xs"
        id={`input-${product.productId}`}
        />
      </div>
      ))}
    </div>
  );
};