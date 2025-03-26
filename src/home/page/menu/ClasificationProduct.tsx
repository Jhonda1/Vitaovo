import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DatePicker } from "@/components/DatePicker";
import { CustomSelect } from "@/components/CustomSelect";
import { ProductList } from "@/components/ProductList";
import { ProductionProduct } from "@/components/ProductionProduct";

export function ClasificationProduct() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedOption, setSelectedOption] = useState<string>("");

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

    return (
      <div className="w-full p-4">
      <form className="w-full space-y-4">
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

         <div className="mt-8">
          <h2 className="text-xl font-bold">Resumen de Producción</h2>
          <ul className="mt-4">
            {Object.entries(quantities).map(([productName, quantity]) => (
              <li key={productName} className="text-sm">
                {productName}: {quantity} unidades
              </li>
            ))}
          </ul>
        </div>

        
        <Button type="submit" variant={'secondary'} className="w-full">Enviar</Button>
      </form>
    </div>
    );
  }