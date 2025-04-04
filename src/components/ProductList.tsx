import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Product } from "@/types";
import { formatNumber } from "@/lib/utils";



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
            <Label className="font-bold">Información del producto</Label>
            
            <span className="text-sm text-gray-500">{product.name}</span>
          </div>

          {/* Inventario actual */}
          <div className="text-center">
            <Label className="font-bold text-center block">Inventario actual</Label>
            <span className="text-sm text-gray-500">{formatNumber(product.inventory)}</span>
            
          </div>

          {/* Input con placeholder dinámico */}
          
            <div className="w-1/3">
              <Label className="font-bold text-center block">Cantidad</Label>
              <Input
              id={`${product.productId}`}
              placeholder={`${product.name}`}
              value={product.qtyToAdd || ""}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                
                onInputChange(product.productId, e.target.value);
                /* if (!isNaN(value) && value <= product.inventory) {
                } else if (isNaN(value)) {
                  onInputChange(product.productId, "");
                } */
              }}
              />
            </div>
        </div>
      ))}
    </div>
  );
};