import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DatePicker } from "@/components/DatePicker";
import { CustomSelect } from "@/components/CustomSelect";
import { ProductList } from "@/components/ProductList";
import { ProductionProduct } from "@/components/ProductionProduct";
import { Alert } from "@/components/Alert"; // Importa el componente de alerta

export function ReportDaily() {
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

  // Lista de productos con inventario
  const [products, setProducts] = useState([
    { id: "1", name: "Producto A", inventory: 10 },
    { id: "2", name: "Producto B", inventory: 5 },
    { id: "3", name: "Producto C", inventory: 20 },
  ]);

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
              }}
            />
          </div>
        </div>

        <div className="">
          <h6 className="text-xl font-bold mb-4">Mortalidad</h6>
          <ProductList products={products} onInputChange={(id, value) => console.log(id, value)} />
        </div>
        <div className="">
          <h6 className="text-xl font-bold mb-4">Medicamentos</h6>
          <ProductList products={products} onInputChange={(id, value) => console.log(id, value)} />
        </div>
        <div className="">
          <h6 className="text-xl font-bold mb-4">Alimentos</h6>
          <ProductList products={products} onInputChange={(id, value) => console.log(id, value)} />
        </div>
        <div className="">
          <h6 className="text-xl font-bold mb-4">Calcio</h6>
          <ProductList products={products} onInputChange={(id, value) => console.log(id, value)} />
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