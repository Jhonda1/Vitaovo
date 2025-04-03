import { Button } from "@/components/ui/button";
import { Key, useEffect, useState } from "react";
import { DatePicker } from "@/components/DatePicker";
import { CustomSelect } from "@/components/CustomSelect";
import { ProductionProduct } from "@/components/ProductionProduct";
import { Alert } from "@/components/Alert"; // Importa el componente de alerta
import { ProductClasification } from "@/components/ProductClasification"; // Importa el componente de clasificación de productos
import { useApi } from "@/hooks/useApiService";
import { setDefaultOptions } from "date-fns";

export function ClasificationProduct() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(); // Estado para manejar la fecha seleccionada
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isAlertOpen, setIsAlertOpen] = useState(false); // Estado para controlar la alerta
  const [alertMessage, setAlertMessage] = useState({ title: "", description: "" }); // Mensaje de la alerta
  const { apiService } = useApi();
  const [warehousesData, setAlmacenData] = useState<any>(null); // Datos relacionados al almacén seleccionado
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]); // Opciones del select

  // Función para obtener los datos de los almacenes
  useEffect(() => {
    const fetchAlmacenes = async () => {
      try {
        const response = await apiService.get("/warehouses");
        // console.log("Respuesta de la API:", response.data.warehouses);
        const almacenes = response.data.warehouses.map((almacen: any) => ({
          value: almacen.id,
          label: almacen.name,
        }));
        setOptions(almacenes);
      } catch (error) {
        console.error("Error al obtener los almacenes:", error);
      }
    };

    fetchAlmacenes();
  }, []);

  // Función para manejar la selección de un almacén
  const handleAlmacenSelect = async (almacenid: string) => {
    setSelectedOption(almacenid);

    // Limpiar todos los inputs visibles
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
      if (input.offsetParent !== null) {
      input.value = "";
      }
    });

    // Limpiar las cantidades de producción basadas en los productos de producción disponibles
    if (warehousesData?.GrupoIdGranjaProduccion) {
      const resetQuantities = warehousesData.GrupoIdGranjaProduccion.reduce(
      (acc: { [key: string]: number }, product: { name: string }) => {
        acc[product.name] = 0; // Establece la cantidad en 0 para cada producto
        return acc;
      },
      {}
      );
      setQuantities(resetQuantities);
    }
    try {
      const response = await apiService.get(`/products/clasificationProducts/warehouse/${almacenid}`);
      setAlmacenData(response.data.products); // Guarda los datos relacionados al almacén seleccionado
    } catch (error) {
      console.error("Error al obtener los datos del almacén:", error);
    }
  };


  // Estado para manejar las cantidades de producción
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({
    "Huevos A": 0,
    "Huevos B": 0,
    "Huevos C": 0,
    "Huevos D": 0,
    "Huevos E": 0,
    "Huevos F": 0,
  });

  // Función para manejar el cambio de cantidad de producción
  const handleQuantityChange = (productName: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productName]: quantity,
    }));
  };

  const [productsClas, setProductsClas] = useState([
    { id: "1", name: "Producto A", quantity: 0 },
    { id: "2", name: "Producto B", quantity: 0 },
    { id: "3", name: "Producto C", quantity: 0 },
  ]);

  const handleQuantityChangeProduct = (id: string, quantity: number) => {
    setProductsClas((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, quantity } : product
      )
    );
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simula el envío de datos
    const isValid = true; // Aquí puedes agregar validaciones si es necesario

    if (isValid) {
      setAlertMessage({
        title: "¡Éxito!",
        description: "La información se guardó satisfactoriamente.",
      });
      setIsAlertOpen(true); // Muestra la alerta
    } else {
      setAlertMessage({
        title: "¡Error!",
        description: "Ocurrió un problema al guardar la información.",
      });
      setIsAlertOpen(true); // Muestra la alerta
    }
  };

  return (
    <div className="w-full p-4">
      <form className="w-full space-y-4" onSubmit={handleSubmit}>
        <div className="w-full flex space-x-4">
          <div className="w-1/2">
            <DatePicker
              label="Fecha:"
              selectedDate={selectedDate}
              onDateChange={(date) => {
                setSelectedDate(date);
              }}
            />
          </div>
          <div className="w-1/2">
            <CustomSelect
              label="Lote:"
              id="almacenid"
              options={options}
              placeholder="Selecciona un lote"
              onChange={(value) => handleAlmacenSelect(value)}
            />
          </div>
        </div>

        {warehousesData?.GrupoIdGranjaProduccion?.length > 0 && (
            <div className="">
              <h6 className="text-2xl font-bold mb-4">Producción</h6>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {warehousesData.GrupoIdGranjaProduccion.map((product: { productId: Key | null | undefined; name: string; }) => (
            <div key={product.productId} className="flex items-center space-x-2">
              <ProductionProduct
                productName={product.name}
                onQuantityChange={(quantity) => handleQuantityChange(product.name, Number(quantity))}
                productId={product.productId?.toString() || ""}
              />
            </div>
                ))}
              </div>
            </div>
          )}

        {warehousesData?.GrupoIdGranjaProduccion?.length > 0 && (
          <div className="">
            <h6 className="text-2xl font-bold mb-4">Clasificación de Productos</h6>
            <div className="space-y-4">
              {warehousesData.GrupoIdGranjaProduccion.map((product: { productId: Key | null | undefined; name: string; }) => (
          <ProductClasification
            key={product.productId}
            productName={product.name}
            quantity={quantities[product.name] || 0}
            onQuantityChange={(quantity) => handleQuantityChange(product.name, quantity)}
          />
              ))}
            </div>
          </div>
        )}

        <Button type="submit" variant={"secondary"} className="w-full">
          Enviar
        </Button>
      </form>

      {/* Alerta reutilizable */}
      <Alert
        title={alertMessage.title}
        description={alertMessage.description}
        type="success"
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
      />
    </div>
  );
}