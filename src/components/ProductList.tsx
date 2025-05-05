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
                  value={(lote.qtyToAdd !== undefined 
                  ? (product.DecimalesCantidad && product.DecimalesCantidad > 0 
                    ? Number(lote.qtyToAdd) 
                    : Number(lote.qtyToAdd).toString().replace(/,/g, "")) 
                  : (lote.cantidad 
                    ? (product.DecimalesCantidad && product.DecimalesCantidad > 0 
                    ? Number(lote.cantidad).toLocaleString("es-CO") 
                    : Number(lote.cantidad).toString().replace(/,/g, "")) 
                    : ""))}
                  onChange={(e) => {
                  const rawValue = e.target.value;
                  if (rawValue.startsWith("0") && rawValue.length > 1 && !rawValue.startsWith("0.")) {
                    e.target.value = rawValue.substring(1); // Eliminar el cero inicial si no es un decimal
                  }
                  
                  const decimalsAllowed = product.DecimalesCantidad || 0; // Obtener la cantidad de decimales permitidos
                  const regExp = new RegExp(`^\\d+(\\.\\d{0,${decimalsAllowed}})?$`);

                  if (!regExp.test(rawValue)) {
                    // Si no cumple con el formato, eliminar el último carácter ingresado
                    const correctedValue = rawValue.substring(0, rawValue.length - 1);
                    e.target.value = correctedValue;
                    onInputChange(`${product.productId}-${lote.numeroLote}`, correctedValue || "");
                  } else {
                    // Si cumple con el formato, actualizar el estado
                    const numericValue = rawValue;
                    const updatedValue = numericValue ? parseFloat(numericValue) : undefined;
                    onInputChange(`${product.productId}-${lote.numeroLote}`, updatedValue?.toString() || "");
                  }
                  }}
                  onBlur={(e) => {
                    const decimalsAllowed = product.DecimalesCantidad || 0;
                    // Si no se permiten decimales, eliminar las comas al perder el foco
                    if (decimalsAllowed == 0) {
                      const rawValue = e.target.value.replace(/,/g, "");
                      e.target.value = rawValue; // Actualizar visualmente el input
                      onInputChange(`${product.productId}-${lote.numeroLote}`, rawValue || "");
                    }
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
              type="number"
              id={`${product.productId}`}
              placeholder="Cantidad"
              value={product.qtyToAdd !== undefined ? Number(product.qtyToAdd) : (product.cantidad ? Number(product.cantidad).toLocaleString("es-CO") : "")}
              onChange={(e) => {
                console.log("🚀 ~ {products.flatMap ~ e.target.value:", e.target.value);
                const rawValue = e.target.value;
                if (rawValue.startsWith("0") && rawValue.length > 1 && !rawValue.startsWith("0.")) {
                  e.target.value = rawValue.substring(1); // Eliminar el cero inicial si no es un decimal
                }
                const decimalsAllowed = product.DecimalesCantidad || 0; // Obtener la cantidad de decimales permitidos
                const regExp = new RegExp(`^\\d+(\\.\\d{0,${decimalsAllowed}})?$`);
                console.log("🚀 ~ {products.flatMap ~ regExp:", decimalsAllowed,regExp);
                if (!regExp.test(rawValue)) {
                // Si no cumple con el formato o contiene una coma, eliminar la coma y el último carácter ingresado
                const correctedValue = rawValue.substring(0, rawValue.length - 1);
                e.target.value = correctedValue;
                onInputChange(product.productId, correctedValue || "");
                
                } else {
                // Si cumple con el formato, actualizar el estado
                const numericValue = rawValue;
                const updatedValue = numericValue ? parseFloat(numericValue) : undefined;
                onInputChange(product.productId, updatedValue?.toString() || "");
                }
              }}
              onBlur={(e) => {
                const decimalsAllowed = product.DecimalesCantidad || 0;
                // Si no se permiten decimales, eliminar las comas al perder el foco
                if (decimalsAllowed == 0) {
                  const rawValue = e.target.value.replace(/,/g, "");
                  e.target.value = rawValue; // Actualizar visualmente el input
                  onInputChange(product.productId, rawValue || "");
                }
              }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};