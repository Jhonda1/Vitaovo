import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { DatePicker } from "@/components/DatePicker";
import { CustomSelect } from "@/components/CustomSelect";
import { ProductList } from "@/components/ProductList";
import { Alert } from "@/components/Alert";
import { useApi } from "@/hooks/useApiService";
import { FormReportDaily, WarehouseData } from "@/types";
import { FormProduction } from "@/home/components/FormProduction";
import { SelectItem } from "@/components/ui/select";
import { WarehouseService } from "@/services/warehouse";
import { AxiosResponse } from "axios";

const initialFormReportDaily: FormReportDaily = {
  'observation' : '',
  'eggs':'',
  'eggs_lining':'',
  'eggs_chopped':'',
  'eggs_broken':'',
}

export function ReportDaily() {
  /* STATE */
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedOption, setSelectedOption] = useState<{id: string, name: string}>({id: "", name: ""});
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    title: "",
    description: "",
  });
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );
  const [warehousesData, setAlmacenData] = useState<WarehouseData>({}); // Datos relacionados al almacén seleccionado

  const [formReportDaily, setFormReportDaily] = useState<FormReportDaily>(initialFormReportDaily);

 
  /* HOOKS */
  const { apiService } = useApi();

  const warehouseService = new WarehouseService(apiService);

/* EFFECTS */
  useEffect(() => {
    // Función para obtener los datos de los almacenes
    const fetchAlmacenes = async () => {
      try {
        const response = await warehouseService.getWarehouses();
        const {data, status} = response as AxiosResponse;
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
    /* Limpiar los inputs de producción */
    setFormReportDaily(initialFormReportDaily)
  },[selectedOption])


  // Función para manejar la selección de un almacén
  const handleAlmacenSelect = async (almacenid: string, name: string) => {
    setSelectedOption({id: almacenid, name: name});

    try {
      const response = await warehouseService.getDataByWarehouse(almacenid)
      const {data, status} = response as AxiosResponse;
      if(status === 200){
        setAlmacenData(data.products);
      }
    } catch (error) {
      console.error("Error al obtener los datos del almacén:", error);
    }
  };

  /**
   * * Función para manejar el envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    


    const requestData= {
      fecha: selectedDate,
      lote: selectedOption,
      observaciones: formReportDaily.observation.trim() ? formReportDaily.observation : undefined,
    };
    

    try {
      const response = await apiService.post("/products/saveReport", {
        requestData: requestData,
      });
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


  
  let totalEggs = Number(formReportDaily.eggs) + Number(formReportDaily.eggs_lining) + Number(formReportDaily.eggs_chopped) + Number(formReportDaily.eggs_broken);
  if(isNaN(totalEggs)) {
    totalEggs = 0;
  }
  console.log(totalEggs)
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
          <h6 className="text-xl font-bold mb-4">Mortalidad</h6>
          {warehousesData?.GrupoIdGranjaAnimales && warehousesData.GrupoIdGranjaAnimales.length > 0 ? (
            <ProductList
              products={warehousesData.GrupoIdGranjaAnimales}
              onInputChange={(productId, value) =>
                handleInputChange(productId, value)
              }
            />
          ) : (
            <p className="text-gray-500">No hay productos disponibles.</p>
          )}
        </div>
        <div className="">
          <h6 className="text-xl font-bold mb-4">Medicamentos</h6>
          {warehousesData?.GrupoIdGranjaMedicamentos && warehousesData.GrupoIdGranjaMedicamentos.length > 0 ? (
            <ProductList
              products={warehousesData.GrupoIdGranjaMedicamentos || []}
              onInputChange={(productId, value) =>
                handleInputChange(productId, value)
              }
            />
          ) : (
            <p className="text-gray-500">No hay productos disponibles.</p>
          )}
        </div>
        <div className="">
          <h6 className="text-xl font-bold mb-4">Alimentos</h6>
          {warehousesData?.GrupoIdGranjaAlimentos && warehousesData.GrupoIdGranjaAlimentos.length > 0 ? (
            <ProductList
              products={warehousesData.GrupoIdGranjaAlimentos || []}
              onInputChange={(productId, value) =>
                handleInputChange(productId, value)
              }
            />
          ) : (
            <p className="text-gray-500">No hay productos disponibles.</p>
          )}
        </div>
        <div className="">
          <h6 className="text-xl font-bold mb-4">Calcio</h6>
          {warehousesData?.GrupoIdGranjaCalcio && warehousesData.GrupoIdGranjaCalcio.length > 0 ? (
            <ProductList
              products={warehousesData.GrupoIdGranjaCalcio || []}
              onInputChange={(productId, value) =>
                handleInputChange(productId, value)
              }
            />
          ) : (
            <p className="text-gray-500">No hay productos disponibles.</p>
          )}
        </div>

        <div className="">
          <h6 className="text-2xl font-bold mb-4">Producción</h6>
          <div className="grid  gap-4">
            <div className="flex items-center space-x-2">
              <div className="grid grid-cols-5 gap-4 p-4 border rounded-md shadow-sm bg-white w-full">
                <FormProduction id="huevos" label="Huevos" value={formReportDaily.eggs} onChange={(e)=>setFormReportDaily((prevState)=>({...prevState, eggs: e.target.value}))} />
                <FormProduction id="picado" label="Picado" value={formReportDaily.eggs_lining} onChange={(e)=>setFormReportDaily((prevState)=>({...prevState, eggs_lining: e.target.value}))} />
                <FormProduction id="forro" label="Forro" value={formReportDaily.eggs_chopped} onChange={(e)=>setFormReportDaily((prevState)=>({...prevState, eggs_chopped: e.target.value}))} />
                <FormProduction id="quebrado" label="Quebrado" value={formReportDaily.eggs_broken} onChange={(e)=>setFormReportDaily((prevState)=>({...prevState, eggs_broken: e.target.value}))} />
                <FormProduction id="total" label={`Total`} value={totalEggs.toString()} disabled={true}/>
              </div>
            </div>
          </div>
        </div>

        <div className="">
          <h6 className="text-xl font-bold mb-4">Observaciones</h6>
          <textarea
            className="w-full p-2 border rounded-md"
            rows={4}
            value={formReportDaily.observation}
            placeholder="Escribe tus observaciones aquí..."
            onChange={(e) => setFormReportDaily((prevState)=>({...prevState, observation: e.target.value}))}
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
