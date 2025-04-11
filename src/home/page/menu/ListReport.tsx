import { useState, useEffect } from "react";
import { DatePicker } from "@/components/DatePicker";
import { CustomSelect } from "@/components/CustomSelect";
import { useApi } from "@/hooks/useApiService";
import { FormReportDaily, WarehouseData } from "@/types";
import { SelectItem } from "@/components/ui/select";
import { WarehouseService } from "@/services/warehouse";
import { AxiosResponse } from "axios";
import { ProductsService } from "@/services/products";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { FormProduction } from "@/home/components/FormProduction";

const initialFormReportDaily: FormReportDaily = {
    'observation' : '',
    'eggs':0,
    'eggs_lining':0,
    'eggs_chopped':0,
    'eggs_broken':0,
  }

export function ListReport() {
  /* STATE */
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedOption, setSelectedOption] = useState<{ id: string; name: string }>({ id: "", name: "" });
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [warehousesData, setWarehouseData] = useState<WarehouseData>({}); // Datos relacionados al almacén seleccionado
  const [loading, setLoading] = useState(false);
  const [formReportDaily, setFormReportDaily] = useState<FormReportDaily>(initialFormReportDaily);
  
  /* HOOKS */
  const { apiService } = useApi();
  const warehouseService = new WarehouseService(apiService);
  const productService = new ProductsService(apiService);

  /* EFFECTS */
  useEffect(() => {
    // Función para obtener los datos de los almacenes
    const fetchAlmacenes = async () => {
      try {
        setLoading(true);
        const response = await warehouseService.getWarehouses();
        const { data, status } = response as AxiosResponse;
        if (status === 200) {
          const almacenes = data.warehouses.map((almacen: { id: string; name: string }) => ({
            value: almacen.id,
            label: almacen.name,
          }));
          setOptions(almacenes);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error al obtener los almacenes:", error);
        toast.error("Error al obtener los almacenes.");
      }
    };

    fetchAlmacenes();
  }, []);

// Función para manejar la selección de un almacén
  const handleAlmacenSelect = async (almacenid: string, name: string) => {
    setSelectedOption({ id: almacenid, name: name });
    await fetchWarehouseData(almacenid, selectedDate);
  };

  // Función para manejar el cambio de fecha
  const handleDateChange = async (date: Date) => {
    setSelectedDate(date);
    if (selectedOption.id) {
      await fetchWarehouseData(selectedOption.id, date);
    }
  };

  const fetchWarehouseData = async (almacenid: string, date: Date) => {
    const dateToSend = date.toISOString().split("T")[0];

    try {
      setLoading(true);
      const response = await productService.getReportByDateAndWarehouse(`${dateToSend}`, `${almacenid}`);
      const { data, status } = response as AxiosResponse;
      if (status === 200) {
        setLoading(false);
        setWarehouseData(data.Production);

        const ProductProduction = data.products[0];
        const updatedFormReportDaily = {
          ...initialFormReportDaily,
          eggs: ProductProduction?.Huevos || initialFormReportDaily.eggs,
          eggs_lining: ProductProduction?.Forro || initialFormReportDaily.eggs_lining,
          eggs_chopped: ProductProduction?.Picados || initialFormReportDaily.eggs_chopped,
          eggs_broken: ProductProduction?.Quebrados || initialFormReportDaily.eggs_broken,
          observation: ProductProduction?.Observacion || initialFormReportDaily.observation,
        };
        setFormReportDaily(updatedFormReportDaily);
        console.log("ProductProduction actualizado:", updatedFormReportDaily);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error al obtener los datos del almacén:", error);
    }
  };


  let totalEggs = Number(formReportDaily.eggs) + Number(formReportDaily.eggs_lining) + Number(formReportDaily.eggs_chopped) + Number(formReportDaily.eggs_broken);
  if(isNaN(totalEggs)) {
    totalEggs = 0;
  }

  return (
    <div className="w-full p-4 overflow-scroll h-screen">
      <LoadingSpinner loading={loading} type="bounce" size={55} />
      <form className="w-full space-y-4">
      <div className="w-full flex space-x-4">
          <div className="w-1/2">
            <DatePicker
              label="* Fecha:"
              selectedDate={selectedDate}
              onDateChange={(date) => {
                handleDateChange(date ?? new Date());
              }}
            />
          </div>
          <div className="w-1/2">
            <CustomSelect
              label="* Lote:"
              placeholder="Selecciona un lote"
              onChange={(value) => handleAlmacenSelect(value.split('|')[0], value.split('|')[1])}
              defaultChecked={selectedOption.id ? `${selectedOption.id}|${selectedOption.name}` : ''}
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
            <div className="grid grid-cols-1 gap-4">
              {warehousesData.GrupoIdGranjaAnimales.map((product) => (
                <div key={product.productId} className="flex items-center space-x-4">
                  <label className="w-1/2 text-gray-700">{product.name}</label>
                  <input
                    type="text"
                    value={Number(product.qtyToAdd || 0).toLocaleString("es-CO")}
                    disabled
                    className="w-1/2 p-2 border rounded-md bg-gray-100 text-gray-700"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay Mortalidad agregado a este reporte.</p>
          )}
        </div>
        <div className="">
          <h6 className="text-xl font-bold mb-4">Medicamentos</h6>
          {warehousesData?.GrupoIdGranjaMedicamentos && warehousesData.GrupoIdGranjaMedicamentos.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {warehousesData.GrupoIdGranjaMedicamentos.map((product) => (
                <div key={product.productId} className="flex items-center space-x-4">
                  <label className="w-1/2 text-gray-700">{product.name}</label>
                  <input
                    type="text"
                    value={Number(product.qtyToAdd || 0).toLocaleString("es-CO")}
                    disabled
                    className="w-1/2 p-2 border rounded-md bg-gray-100 text-gray-700"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay Medicamentos agregado a este reporte.</p>
          )}
        </div>
        <div className="">
          <h6 className="text-xl font-bold mb-4">Alimentos</h6>
          {warehousesData?.GrupoIdGranjaAlimentos && warehousesData.GrupoIdGranjaAlimentos.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {warehousesData.GrupoIdGranjaAlimentos.map((product) => (
                <div key={product.productId} className="flex items-center space-x-4">
                  <label className="w-1/2 text-gray-700">{product.name}</label>
                  <input
                    type="text"
                    value={Number(product.qtyToAdd || 0).toLocaleString("es-CO")}
                    disabled
                    className="w-1/2 p-2 border rounded-md bg-gray-100 text-gray-700"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay Alimentos agregado a este reporte.</p>
          )}
        </div>
        <div className="">
          <h6 className="text-xl font-bold mb-4">Calcio</h6>
          {warehousesData?.GrupoIdGranjaCalcio && warehousesData.GrupoIdGranjaCalcio.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {warehousesData.GrupoIdGranjaCalcio.map((product) => (
                <div key={product.productId} className="flex items-center space-x-4">
                  <label className="w-1/2 text-gray-700">{product.name}</label>
                  <input
                    type="text"
                    value={Number(product.qtyToAdd || 0).toLocaleString("es-CO")}
                    disabled
                    className="w-1/2 p-2 border rounded-md bg-gray-100 text-gray-700"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay calcio agregado a este reporte.</p>
          )}
        </div>

        <div className="">
            <h6 className="text-2xl font-bold mb-4">Producción</h6>
            <div className="grid  gap-4">
            <div className="flex items-center space-x-2">
                <div className="grid grid-cols-5 gap-4 p-4 border rounded-md shadow-sm bg-white w-full">
                <FormProduction id="Huevos" label="Huevos" value={Number(formReportDaily.eggs).toLocaleString("es-CO")} onChange={(e)=>setFormReportDaily((prevState)=>({...prevState, eggs: e.target.value.replace(/[^0-9,]/g, "")}))} disabled={true}/>
                <FormProduction id="Picados" label="Picado" value={Number(formReportDaily.eggs_lining).toLocaleString("es-CO")} onChange={(e)=>setFormReportDaily((prevState)=>({...prevState, eggs_lining: Number(e.target.value.replace(/[^0-9,]/g, ""))}))} disabled={true}/>
                <FormProduction id="Forro" label="Forro" value={Number(formReportDaily.eggs_chopped).toLocaleString("es-CO")} onChange={(e)=>setFormReportDaily((prevState)=>({...prevState, eggs_chopped: Number(e.target.value.replace(/[^0-9,]/g, ""))}))} disabled={true}/>
                <FormProduction id="Quebrados" label="Quebrado" value={Number(formReportDaily.eggs_broken).toLocaleString("es-CO")} onChange={(e)=>setFormReportDaily((prevState)=>({...prevState, eggs_broken: Number(e.target.value.replace(/[^0-9,]/g, ""))}))} disabled={true}/>
                <FormProduction id="total" label={`Total`} value={Number(totalEggs).toLocaleString("es-CO")} disabled={true}/>
                </div>
            </div>
            </div>
        </div>

        <div className="">
          <h6 className="text-xl font-bold mb-4">Observaciones</h6>
          <textarea
            className="w-full p-2 border rounded-md"
            rows={4}
            maxLength={4000}
            value={formReportDaily.observation}
            disabled={true}
          />
        </div>

      </form>
    </div>
  );
}