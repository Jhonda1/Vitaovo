import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DatePicker } from "@/components/DatePicker";
import { CustomSelect } from "@/components/CustomSelect";
import { ProductionProduct } from "@/components/ProductionProduct";
import { Alert } from "@/components/Alert"; // Importa el componente de alerta
import { ProductClasification } from "@/components/ProductClasification"; // Importa el componente de clasificación de productos

export function ClasificationProduct() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(); // Estado para manejar la fecha seleccionada
  const [selectedOption, setSelectedOption] = useState<string>(""); // Estado para manejar la opción seleccionada
  const [isAlertOpen, setIsAlertOpen] = useState(false); // Estado para controlar la alerta
  const [alertMessage, setAlertMessage] = useState({ title: "", description: "" }); // Mensaje de la alerta

  // Opciones para el select de lotes
  const options = [
    { value: "lote1", label: "Lote 1" },
    { value: "lote2", label: "Lote 2" },
    { value: "lote3", label: "Lote 3" },
  ];


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
              onChange={(value) => {
                setSelectedOption(value);
                console.log(value)
                const newQuantities = {
                  "Huevos A": 0,
                  "Huevos B": 0,
                  "Huevos C": 0,
                  "Huevos D": 0,
                  "Huevos E": 0,
                  "Huevos F": 0,
                  ...(value === "lote1"
                    ? {
                        "Huevos A": 10,
                        "Huevos B": 20,
                        "Huevos C": 30,
                        "Huevos D": 40,
                        "Huevos E": 50,
                        "Huevos F": 60,
                      }
                    : value === "lote2"
                    ? {
                        "Huevos A": 15,
                        "Huevos B": 25,
                        "Huevos C": 35,
                        "Huevos D": 45,
                        "Huevos E": 55,
                        "Huevos F": 65,
                      }
                    : value === "lote3"
                    ? {
                        "Huevos A": 5,
                        "Huevos B": 10,
                        "Huevos C": 15,
                        "Huevos D": 20,
                        "Huevos E": 25,
                        "Huevos F": 30,
                      }
                    : {}),
                };

                setQuantities(newQuantities);

                // Disable inputs for non-editable fields
                Object.keys(newQuantities).forEach((productName) => {
                const inputElement = document.getElementById(
                  `input-${productName}`
                ) as HTMLInputElement;
                if (inputElement) {
                  inputElement.value = newQuantities[productName as keyof typeof newQuantities].toString();
                  inputElement.disabled = true;
                }
                });

                 
                }
              }
            />
          </div>
        </div>

        <div className="">
          <h6 className="text-2xl font-bold mb-4">Producción</h6>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.keys(quantities).map((productName) => (
              <div key={productName} className="flex items-center space-x-2">
                <ProductionProduct
                  productName={productName}
                  onQuantityChange={(quantity) => handleQuantityChange(productName, quantity)}
                />
              </div>

            ))}
          </div>
        </div>

        <div className="">
          <h6 className="text-2xl font-bold mb-4">Clasificación de Productos</h6>
          <div className="space-y-4">
            {productsClas.map((product) => (
              <ProductClasification
                key={product.id}
                productName={product.name}
                quantity={product.quantity}
                onQuantityChange={(quantity) => handleQuantityChange(product.id, quantity)}
              />
            ))}
          </div>
        </div>

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