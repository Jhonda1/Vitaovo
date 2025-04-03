import { Button } from "@/components/ui/button";
import { useState, useEffect, Key } from "react";
import { DatePicker } from "@/components/DatePicker";
import { CustomSelect } from "@/components/CustomSelect";
import { ProductList } from "@/components/ProductList";
import { ProductionProduct } from "@/components/ProductionProduct";
import { Alert } from "@/components/Alert";
import { useApi } from "@/hooks/useApiService";

export function ReportDaily() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ title: "", description: "" });
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]); // Opciones del select
  const [almacenData, setAlmacenData] = useState<any>(null); // Datos relacionados al almacén seleccionado
  const { apiService } = useApi();


  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (almacenData?.GrupoIdGranjaProduccion) {
      const initialQuantities = almacenData.GrupoIdGranjaProduccion.reduce(
        (acc: { [key: string]: number }, product: { name: string }) => {
          acc[product.name] = 0; // Inicializa todas las cantidades en 0
          return acc;
        },
        {}
      );
      setQuantities(initialQuantities);
    }
  }, [almacenData]);

  // Función para obtener los datos de los almacenes
  useEffect(() => {
    const fetchAlmacenes = async () => {
      try {
        const response = await apiService.get("/warehouses/almacen");
        // console.log("Respuesta de la API:", response.data.warehouses);
        const almacenes = response.data.warehouses.map((almacen: any) => ({
          value: almacen.almacenid,
          label: almacen.nombre,
        }));
        setOptions(almacenes);
      } catch (error) {
        console.error("Error al obtener los almacenes:", error);
      }
    };

    fetchAlmacenes();
  }, []);

  // Función para manejar el cambio de cantidad de producción
  const handleQuantityChange = (productName: string, quantity: number) => {
    console.log(`Cantidad de ${productName} cambiada a: ${quantity}`);
    setQuantities((prev) => ({
      ...prev,
      [productName]: quantity,
    }));
  };

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
    if (almacenData?.GrupoIdGranjaProduccion) {
      const resetQuantities = almacenData.GrupoIdGranjaProduccion.reduce(
      (acc: { [key: string]: number }, product: { name: string }) => {
        acc[product.name] = 0; // Establece la cantidad en 0 para cada producto
        return acc;
      },
      {}
      );
      setQuantities(resetQuantities);
    }
    try {
      const response = await apiService.get(`/products/productgrouped/warehouse/${almacenid}`);
      setAlmacenData(response.data.products); // Guarda los datos relacionados al almacén seleccionado
    } catch (error) {
      console.error("Error al obtener los datos del almacén:", error);
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = selectedDate && selectedOption;
    console.log("isValid:", isValid, selectedDate, selectedOption);

    const observations = (document.querySelector("textarea") as HTMLTextAreaElement)?.value || "";
    const filledInputs = Array.from(document.querySelectorAll("input"))
      .filter((input) => input.value.trim() !== "" && input.offsetParent !== null) // Verifica que el input tenga valor y sea visible
      .map((input) => ({
      id: input.id,
      value: input.value,
      }));

    console.log("Fecha seleccionada:", selectedDate);
    console.log("Lote seleccionado:", selectedOption);
    console.log("Observaciones:", observations);
    console.log("Inputs llenados:", filledInputs);

    const requestData = {
      fecha: selectedDate,
      lote: selectedOption,
      observaciones: observations.trim() ? observations : undefined,
      productos: filledInputs,
    };

    if (!requestData.observaciones) {
      delete requestData.observaciones; // Elimina el campo si está vacío
    }

    try {
      const response = await apiService.post("/products/saveReport", {requestData: requestData});
      console.log("Respuesta de la API:", response.data);
      if (response.status === 200) {
        setAlertMessage({
          title: "¡Éxito!",
          description: "La información se guardó satisfactoriamente.",
        });
        setIsAlertOpen(true);
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setAlertMessage({
      title: "Error",
      description: "Hubo un problema al guardar la información.",
      });
      setIsAlertOpen(true);
      return;
    }
    
  };

  const handleInputChange = (productId: string, value: string) => {
    console.log(`Producto ID: ${productId}, Valor: ${value}`);
    // Aquí puedes manejar el cambio de valor si necesitas actualizar el estado
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

          {almacenData?.GrupoIdGranjaAnimales?.length > 0 && (
            <div className="">
                <h6 className="text-xl font-bold mb-4">Mortalidad</h6>
              <ProductList
                products={almacenData?.GrupoIdGranjaAnimales || []}
                onInputChange={(productId, value) => handleInputChange(productId, value)}
              />
            </div>
          )}
        {almacenData?.GrupoIdGranjaMedicamentos?.length > 0 && (
          <div className="">
            <h6 className="text-xl font-bold mb-4">Medicamentos</h6>
            <ProductList
              products={almacenData?.GrupoIdGranjaMedicamentos || []}
              onInputChange={(productId, value) => handleInputChange(productId, value)}
            />
          </div>
        )}
        {almacenData?.GrupoIdGranjaAlimentos?.length > 0 && (
          <div className="">
            <h6 className="text-xl font-bold mb-4">Alimentos</h6>
            <ProductList
              products={almacenData?.GrupoIdGranjaAlimentos || []}
              onInputChange={(productId, value) => handleInputChange(productId, value)}
            />
          </div>
        )}
        {almacenData?.GrupoIdGranjaCalcio?.length > 0 && (
          <div className="">
            <h6 className="text-xl font-bold mb-4">Calcio</h6>
            <ProductList
              products={almacenData?.GrupoIdGranjaCalcio || []}
              onInputChange={(productId, value) => handleInputChange(productId, value)}
            />
          </div>
        )}

        {almacenData?.GrupoIdGranjaProduccion?.length > 0 && (
          <div className="">
            <h6 className="text-2xl font-bold mb-4">Producción</h6>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {almacenData.GrupoIdGranjaProduccion.map((product: { productId: Key | null | undefined; name: string; }) => (
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

        <div className="">
          <h6 className="text-xl font-bold mb-4">Observaciones</h6>
          <textarea
            className="w-full p-2 border rounded-md"
            rows={4}
            placeholder="Escribe tus observaciones aquí..."
            onChange={(e) => console.log(e.target.value)}
          />
        </div>

        <Button type="submit" variant={"secondary"} className="w-full">
          Enviar
        </Button>
      </form>

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