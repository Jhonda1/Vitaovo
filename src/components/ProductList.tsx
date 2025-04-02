import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Product {
  productId: string; // Identificador único del producto
  name: string; // Nombre del producto
  inventory: number; // Inventario actual del producto
}

interface ProductListProps {
  products: Product[]; // Lista de productos
  onInputChange: (productId: string, value: string) => void; // Función para manejar cambios en los inputs
}

export const ProductList: React.FC<ProductListProps> = ({ products, onInputChange }) => {
  return (
    <div className="flex flex-col gap-4">
      {products.map((product) => (
        <div
          key={product.productId}
          className="flex items-center justify-between gap-3 p-1 border rounded-md"
        >
          {/* Nombre del producto */}
          <div className="flex flex-col">
            <Label className="font-bold">{product.name}</Label>
            <span className="text-sm text-gray-500">Información del producto</span>
          </div>

          {/* Inventario actual */}
          <div className="text-center">
            <Label className="font-bold text-center block">{product.inventory}</Label>
            <span className="text-sm text-gray-500">Inventario actual</span>
          </div>

          {/* Input con placeholder dinámico */}
            <div className="w-1/3">
            <Input
              id={`input-${product.productId}`}
              placeholder={`Consumo ${product.name}`}
              onChange={(e) => onInputChange(product.productId, e.target.value)}
            />
            </div>
        </div>
      ))}
    </div>
  );
};