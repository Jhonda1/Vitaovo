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
      {products.flatMap((product) => {
        // Si el producto tiene lotes, generar una entrada por cada lote
        if (product.lotes && product.lotes.length > 0) {
          return product.lotes.map((lote) => (
            <div
              key={`${product.productId}-${lote.numeroLote}`}
              className="flex items-center justify-between gap-3 p-1 border rounded-md"
            >
              {/* Nombre del producto con el lote */}
              <div className="flex flex-col w-1/3">
                <Label className="font-bold">Información del producto</Label>
                <span className="text-sm text-gray-500">
                  {product.name} - Lote: {lote.numeroLote}
                </span>
              </div>

              {/* Inventario actual del lote */}
              <div className="text-center w-1/2">
                <Label className="font-bold text-center block">Inventario actual</Label>
                <span className="text-sm text-gray-500">{formatNumber(Number(lote.invenActua))}</span>
              </div>

              {/* Input con placeholder dinámico */}
              <div className="w-1/3">
                <Label className="font-bold text-center block">Cantidad</Label>
                <Input
                  type="number"
                  id={`${product.productId}-${lote.numeroLote}`}
                  placeholder="Cantidad"
                  value={(lote.qtyToAdd !== undefined ? Number(lote.qtyToAdd).toLocaleString("es-CO") : (lote.cantidad? Number(lote.cantidad).toLocaleString("es-CO") : ""))}
                  onChange={(e) => {
                    console.log("🚀 ~ {products.flatMap ~ e.target.value:", e.target.value)
                    const rawValue = e.target.value.replace(/[^0-9,]/g, ""); // Filtrar solo números y comas
                    const numericValue = rawValue.replace(/,/g, ""); // Eliminar comas
                    const updatedValue = numericValue ? parseFloat(numericValue) : undefined;

                    // Actualizar el estado del lote correspondiente
                    onInputChange(`${product.productId}-${lote.numeroLote}`, updatedValue?.toString() || "");
                  }}
                />
              </div>
            </div>
          ));
        }

        // Si el producto no tiene lotes, mostrarlo como está
        return (
          <div
            key={product.productId}
            className="flex items-center justify-between gap-3 p-1 border rounded-md"
          >
            {/* Nombre del producto */}
            <div className="flex flex-col w-1/3">
              <Label className="font-bold">Información del producto</Label>
              <span className="text-sm text-gray-500">{product.name}</span>
            </div>

            {/* Inventario actual */}
            <div className="text-center w-1/2">
              <Label className="font-bold text-center block">Inventario actual</Label>
              <span className="text-sm text-gray-500">{formatNumber(product.invenactua)}</span>
            </div>

            {/* Input con placeholder dinámico */}
            <div className="w-1/3">
              <Label className="font-bold text-center block">Cantidad</Label>
              <Input
                type="text"
                id={`${product.productId}`}
                placeholder="Cantidad"
                value={product.qtyToAdd ? Number(product.qtyToAdd).toLocaleString("es-CO") : (product.cantidad? Number(product.cantidad).toLocaleString("es-CO") : "")}
                onChange={(e) => {
                  console.log("🚀 ~ {products.flatMap ~ e.target.value:", e.target.value)
                  const rawValue = e.target.value.replace(/[^0-9,]/g, "");
                  const numericValue = rawValue.replace(/,/g, "");
                  onInputChange(product.productId, numericValue);
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};