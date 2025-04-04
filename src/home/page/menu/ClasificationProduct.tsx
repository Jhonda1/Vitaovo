import { Button } from "@/components/ui/button";
import { Key, useEffect, useState } from "react";
import { DatePicker } from "@/components/DatePicker";
import { CustomSelect } from "@/components/CustomSelect";
import { Alert } from "@/components/Alert"; // Importa el componente de alerta
import { ProductClasification } from "@/components/ProductClasification"; // Importa el componente de clasificación de productos
import { useApi } from "@/hooks/useApiService";
import { WarehouseService } from "@/services/warehouse";
import { ProductsService } from "@/services/products";
import { FormReportDaily, WarehouseData } from "@/types";
import { AxiosResponse } from "axios";
import { FormProduction } from "@/home/components/FormProduction";
import { ProductionProduct } from "@/components/ProductionProduct";
import { SelectItem } from "@/components/ui/select";

const initialFormReportDaily: FormReportDaily = {
  'observation' : '',
  'eggs':'',
  'eggs_lining':'',
  'eggs_chopped':'',
  'eggs_broken':'',
}

export function ClasificationProduct() {
  /* STATE */
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(); // Estado para manejar la fecha seleccionada
  const [selectedOption, setSelectedOption] = useState<{id: string, name: string}>({id: "", name: ""});
  const [isAlertOpen, setIsAlertOpen] = useState(false); // Estado para controlar la alerta
  const [alertMessage, setAlertMessage] = useState({ title: "", description: "" }); // Mensaje de la alerta
  const [warehousesData, setAlmacenData] = useState<WarehouseData>({}); // Datos relacionados al almacén seleccionado
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );  const [formReportDaily, setFormReportDaily] = useState<FormReportDaily>(initialFormReportDaily);
  
  /* HOOKS */
  const { apiService } = useApi();
  const warehouseService = new WarehouseService(apiService);
  const productService = new ProductsService(apiService);

  /* EFFECTS */
  useEffect(() => {
    // Función para obtener los datos de los almacenes
    const fetchAlmacenes = async () => {
      try {
        const response = await warehouseService.getWarehouses();
        const {data, status} = response as AxiosResponse;
        console.log("Respuesta de la API:", data);
        if(status === 200){

          const almacenes = data.warehouses.map((almacen: {id: string, name: string}) => ({
            value: almacen.id,
            label: almacen.name,
          }));
          setOptions(almacenes);
        }
      } catch (error) {
        console.error("Error al obtener los almacenes:", error);
      }
    };

    fetchAlmacenes();
  }, []);

  useEffect(() => {
    if (selectedOption.id) {
      console.log("almacenid actualizado:", selectedOption.id);
    }
  }, [selectedOption.id]);

  useEffect(() => {
     warehouseService.getProductInventory().then((data) =>{

      const getCantidadById = (id: number) => {
        const item = data.find((d:any) => d.id === id);
        return item ? item.cantidad : 0;
      };
      
      setFormReportDaily({
        eggs: getCantidadById(1),
        eggs_lining: getCantidadById(2),
        eggs_chopped: getCantidadById(3),
        eggs_broken: getCantidadById(4),
        observation: ""
      });
     });
  }, []);


  // Función para manejar la selección de un almacén
  const handleAlmacenSelect = async (almacenid: string, name: string) => {
    // debugger; // Pausa la ejecución para inspeccionar el estado actual
    // if (selectedOption.id === almacenid) return; 
    console.log("almacenid",selectedOption.id , almacenid)
    setSelectedOption({id: almacenid, name: name});

    try {
      const response = await productService.getProductsByWarehouse(`${almacenid}?column[]=GrupoIdGranjaProduccion`)
      const {data, status} = response as AxiosResponse;
      console.log("Respuesta de la API:", data);
      if(status === 200){
        setAlmacenData(data.products);
      }
    } catch (error) {
      console.error("Error al obtener los datos del almacén:", error);
    }
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

    
  let totalEggs = Number(formReportDaily.eggs) + Number(formReportDaily.eggs_lining) + Number(formReportDaily.eggs_chopped) + Number(formReportDaily.eggs_broken);
  if(isNaN(totalEggs)) {
    totalEggs = 0;
  }

  function handleQuantityChange(arg0: string, quantity: string): void {
    throw new Error("Function not implemented.");
  }

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
              placeholder="Selecciona un lote"
              onChange={(value) => handleAlmacenSelect(value.split('|')[0], value.split('|')[1])}
            >
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value+'|'+option.label} defaultChecked={option.value === selectedOption.id}>
                  {option.label}
                </SelectItem>
              ))}
            </CustomSelect>
          </div>
        </div>

        <div className="">
          <h6 className="text-2xl font-bold mb-4">Producción</h6>
          <div className="grid  gap-4">
            <div className="flex items-center space-x-2">
              <div className="grid grid-cols-5 gap-4 p-4 border rounded-md shadow-sm bg-white w-full">
                <FormProduction id="huevos" label="Huevos" value={formReportDaily.eggs} onChange={(e)=>setFormReportDaily((prevState)=>({...prevState, eggs: e.target.value}))} disabled={true}/>
                <FormProduction id="picado" label="Picado" value={formReportDaily.eggs_lining} onChange={(e)=>setFormReportDaily((prevState)=>({...prevState, eggs_lining: e.target.value}))} disabled={true}/>
                <FormProduction id="forro" label="Forro" value={formReportDaily.eggs_chopped} onChange={(e)=>setFormReportDaily((prevState)=>({...prevState, eggs_chopped: e.target.value}))} disabled={true}/>
                <FormProduction id="quebrado" label="Quebrado" value={formReportDaily.eggs_broken} onChange={(e)=>setFormReportDaily((prevState)=>({...prevState, eggs_broken: e.target.value}))} disabled={true}/>
                <FormProduction id="total" label={`Total`} value={totalEggs.toString()} disabled={true}/>
              </div>
            </div>
          </div>
        </div>

        {/* {warehousesData?.GrupoIdGranjaProduccion && warehousesData.GrupoIdGranjaProduccion.length > 0 ? (
          <div className="">
            <h6 className="text-2xl font-bold mb-4">Clasificación de Productos</h6>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {warehousesData?.GrupoIdGranjaProduccion?.map((product: { productId: Key | null | undefined; name: string; }) => (
                <ProductClasification
                  key={product.productId}
                  productName={product.name}
                  quantity={quantities[product.name] || 0}
                  onQuantityChange={(quantity) => handleQuantityChange(product.name, quantity)}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No hay productos disponibles.</p>
        )} */}

        <div className="">
          <h6 className="text-2xl font-bold mb-4">Clasificacion de Producción</h6>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {warehousesData?.GrupoIdGranjaProduccion?.map((product: { productId: Key | null | undefined; name: string; }) => (
            <div key={product.productId} className="flex items-center space-x-2">
              <ProductionProduct
                  productName={product.name}
                  onQuantityChange={(quantity) => handleQuantityChange(product.productId?.toString() || "", quantity)} productId={""}              />
            </div>
            )) || (
            <div className="text-gray-500">
              No hay datos de producción disponibles.
            </div>
            )}
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