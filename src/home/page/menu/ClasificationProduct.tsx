import { Button } from "@/components/ui/button";
import { Key, useEffect, useState } from "react";
import { DatePicker } from "@/components/DatePicker";
import { CustomSelect } from "@/components/CustomSelect";
import { Alert } from "@/components/Alert"; // Importa el componente de alerta
import { useApi } from "@/hooks/useApiService";
import { WarehouseService } from "@/services/warehouse";
import { ProductsService } from "@/services/products";
import { FormReportDaily, Product, WarehouseData } from "@/types";
import { AxiosResponse } from "axios";
import { FormProduction } from "@/home/components/FormProduction";
import { ProductionProduct } from "@/components/ProductionProduct";
import { SelectItem } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const initialFormReportDaily: FormReportDaily = {
  'observation' : '',
  'eggs':0,
  'eggs_lining':0,
  'eggs_chopped':0,
  'eggs_broken':0,
}

export function ClasificationProduct() {
  /* STATE */
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedOption, setSelectedOption] = useState<{id: string, name: string}>({id: "", name: ""});
  const [isAlertOpen, setIsAlertOpen] = useState(false); // Estado para controlar la alerta
  const [alertMessage, setAlertMessage] = useState({ title: "", description: "" }); // Mensaje de la alerta
  const [warehousesData, setAlmacenData] = useState<WarehouseData>({}); // Datos relacionados al almacén seleccionado
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );  
  const [formReportDaily, setFormReportDaily] = useState<FormReportDaily>(initialFormReportDaily);
  const [loading, setLoading] = useState(false);
  
  /* HOOKS */
  const { apiService } = useApi();
  const warehouseService = new WarehouseService(apiService);
  const productService = new ProductsService(apiService);
  const nitStore  = useAuthStore(state => state.nit);
  

  /* EFFECTS */
  useEffect(() => {
    // Función para obtener los datos de los almacenes
    const fetchAlmacenes = async () => {
      try {
        setLoading(true);
        const response = await warehouseService.getWarehouses();
        const {data, status} = response as AxiosResponse;
        console.log("Respuesta de la API:", data);
        if(status === 200){
          const almacenes = data.warehouses.map((almacen: {id: string, name: string}) => ({
            value: almacen.id,
            label: almacen.name,
          }));
          setOptions(almacenes);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
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



  // Función para manejar la selección de un almacén
  const handleAlmacenSelect = async (almacenid: string, name: string) => {
    setSelectedOption({id: almacenid, name: name});
    const dateToSend = selectedDate.toISOString().split("T")[0];

    try {
      setLoading(true);
      const response = await productService.getRegisteredProductsByDateAndWarehouse(`${dateToSend}`, `${almacenid}`)
      const {data, status} = response as AxiosResponse;
      console.log("Respuesta de la API:", data);
      if(status === 200){
        setLoading(false);
        setAlmacenData(data.Production);
        const ProductProduction = data.products[0];
        const updatedFormReportDaily = {
          ...initialFormReportDaily, // Mantén los valores iniciales
          eggs: ProductProduction.Huevos || initialFormReportDaily.eggs,
          eggs_lining: ProductProduction.Forro || initialFormReportDaily.eggs_lining,
          eggs_chopped: ProductProduction.Picados || initialFormReportDaily.eggs_chopped,
          eggs_broken: ProductProduction.Quebrados || initialFormReportDaily.eggs_broken,
          observation: ProductProduction.Observacion || initialFormReportDaily.observation,
        };
        setFormReportDaily(updatedFormReportDaily);
        console.log("ProductProduction actualizado:", updatedFormReportDaily);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error al obtener los datos del almacén:", error);
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simula el envío de datos
    console.log("Datos del formulario:", warehousesData?.GrupoIdGranjaProduccion);

    const requestData = {
      nitStore: nitStore,
      fecha: selectedDate.toISOString().split("T")[0],
      warehouseId: selectedOption.id.trim(),
      products: warehousesData?.GrupoIdGranjaProduccion?.map((product) => ({
      productId: product.productId,
      quantity: product.qtyToAdd || 0, // Asegúrate de que qtyToAdd esté definido en el estado
      })) || [],
    };
    console.log("Datos enviados:", requestData);

    try {
      const response = await productService.sendProductClassificationData({ requestData });
      const {data, status} = response as AxiosResponse;
      if(status === 200){
        setLoading(false);
        setIsAlertOpen(true); // Abre la alerta
        setAlertMessage({ title: "Éxito", description: "Datos enviados correctamente." });
      }

    } catch (error) {
      setLoading(false);
      console.error("Error al enviar los datos:", error);
    }
 
  };

    
  let totalEggs = Number(formReportDaily.eggs) + Number(formReportDaily.eggs_lining) + Number(formReportDaily.eggs_chopped) + Number(formReportDaily.eggs_broken);
  if(isNaN(totalEggs)) {
    totalEggs = 0;
  }

  // Función para manejar el cambio de cantidad en los productos
  function handleInputChange(productId: string, value: string, currentDataKey: string): void {
    const newWarehouseDataGroup = [...(warehousesData[currentDataKey as keyof WarehouseData] as Product[])];

    const productOnGroup = newWarehouseDataGroup.find(product => product.productId === productId);

    if (productOnGroup) {
      if (productOnGroup?.invenactua < Number(value)) {
        toast.error(`La cantidad supera el inventario disponible: ${productOnGroup?.invenactua}`);
        productOnGroup.qtyToAdd = parseFloat(Number(productOnGroup?.invenactua).toFixed(2));
      } else {
        productOnGroup.qtyToAdd = parseFloat(value);
      }
    }

    setAlmacenData((prevState) => ({
      ...prevState,
      [currentDataKey]: newWarehouseDataGroup,
    }));
  }

  return (
    <div className="w-full p-4">
      <LoadingSpinner 
        loading={loading} 
        type="bounce" 
        size={55} 
      /> 
      <form className="w-full space-y-4" onSubmit={handleSubmit}>
        <div className="w-full flex space-x-4">
          <div className="w-1/2">
            <DatePicker
              label="Fecha:"
              selectedDate={selectedDate}
              onDateChange={(date) => {
                setSelectedDate(date ?? new Date());
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
                <FormProduction id="Huevos" label="Huevos" value={formReportDaily.eggs.toString()} onChange={(e)=>setFormReportDaily((prevState)=>({...prevState, eggs: e.target.value}))} disabled={true}/>
                <FormProduction id="Picados" label="Picado" value={formReportDaily.eggs_lining.toString()} onChange={(e)=>setFormReportDaily((prevState)=>({...prevState, eggs_lining: Number(e.target.value)}))} disabled={true}/>
                <FormProduction id="Forro" label="Forro" value={formReportDaily.eggs_chopped.toString()} onChange={(e)=>setFormReportDaily((prevState)=>({...prevState, eggs_chopped: Number(e.target.value)}))} disabled={true}/>
                <FormProduction id="Quebrados" label="Quebrado" value={formReportDaily.eggs_broken.toString()} onChange={(e)=>setFormReportDaily((prevState)=>({...prevState, eggs_broken: Number(e.target.value)}))} disabled={true}/>
                <FormProduction id="total" label={`Total`} value={totalEggs.toString()} disabled={true}/>
              </div>
            </div>
          </div>
        </div>

        <div className="">
          <h6 className="text-2xl font-bold mb-4">Clasificación de Producción</h6>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <ProductionProduct
              products={warehousesData?.GrupoIdGranjaProduccion || []}
              onInputChange={(productId, value) => {
          if (!/^\d+$/.test(value)) {
            console.error("Por favor, ingrese un valor numérico válido.");
            return;
          }
          handleQuantityChange(productId, value);
              }}
            />
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