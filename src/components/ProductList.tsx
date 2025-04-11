import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Product } from "@/types";
import { formatNumber } from "@/lib/utils";

interface ProductListProps {
  products: Product[]; // Lista de productos
  onInputChange: (productId: string, value: string) => void; // Función para manejar cambios en los inputs
  onSelectChange: (productId: string, selectedLote: string) => void; // Función para manejar cambios en el select
}

export const ProductList: React.FC<ProductListProps> = ({ products, onInputChange, onSelectChange }) => {
  return (
    <div className="flex flex-col gap-4">
      {products.map((product) => (
        <div
          key={product.productId}
          className="grid grid-cols-4 items-center gap-3 p-2 border rounded-md"
        >
          {/* Columna 1: Nombre del producto */}
          <div className="flex flex-col">
            <Label className="font-bold">Información del producto</Label>
            <span className="text-sm text-gray-500">{product.name}</span>
          </div>

          {/* Columna 2: Select para lotes */}
          <div>
            {product.lotes && product.lotes.length > 0 && (
              <div>
                <Label className="font-bold text-sm">Lote</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={
                    product.loteAutomatico === "S" && product.lotes.length > 0
                      ? product.lotes[0].numeroLote // Selecciona automáticamente el primer lote si loteAutomatico es "S"
                      : product.selectedLote || "" // Usa el lote seleccionado o un valor vacío
                  }
                  onChange={(e) => onSelectChange(product.productId, e.target.value)}
                  disabled={product.loteAutomatico === "S"} // Deshabilita el select si es automático
                >
                  {product.lotes.map((lote) => (
                    <option key={lote.numeroLote} value={lote.numeroLote}>
                      {lote.numeroLote}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Columna 3: Inventario actual */}
          <div className="text-center">
            <Label className="font-bold text-center block">Inventario actual</Label>
            <span className="text-sm text-gray-500">{formatNumber(product.invenactua)}</span>
          </div>

          {/* Columna 4: Input con placeholder dinámico */}
          <div>
            <Label className="font-bold text-center block">Cantidad</Label>
            <Input
              type="text"
              id={`${product.productId}`}
              placeholder="Cantidad"
              value={product.qtyToAdd ? Number(product.qtyToAdd).toLocaleString("es-CO") : ""}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/[^0-9,]/g, "");
                const numericValue = rawValue.replace(/,/g, "");
                onInputChange(product.productId, numericValue);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};