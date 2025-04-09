import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { DatePicker } from "@/components/DatePicker";
import { CustomSelect } from "@/components/CustomSelect";
import { ProductList } from "@/components/ProductList";
import { useApi } from "@/hooks/useApiService";
import { FormReportDaily, Product, WarehouseData } from "@/types";
import { FormProduction } from "@/home/components/FormProduction";
import { SelectItem } from "@/components/ui/select";
import { WarehouseService } from "@/services/warehouse";
import { AxiosResponse } from "axios";
import { ProductsService } from "@/services/products";
import { toast } from "sonner";
import { format } from "date-fns";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useAuthStore } from "@/store/useAuthStore";


const initialFormReportDaily: FormReportDaily = {
  'observation': '',
  'eggs': 0,
  'eggs_lining': 0,
  'eggs_chopped': 0,
  'eggs_broken': 0,
}

export function ReportDaily() {
  /* STATE */
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date()); // Estado para manejar la fecha seleccionada
  const [selectedOption, setSelectedOption] = useState<{ id: string, name: string }>({ id: "", name: "" });
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );
  const [warehousesData, setWarehouseData] = useState<WarehouseData>({}); // Datos relacionados al almacén seleccionado
  const [formReportDaily, setFormReportDaily] = useState<FormReportDaily>(initialFormReportDaily);
  const formattedDate = selectedDate ? format(selectedDate, "yyyy/MM/dd") : undefined;
  const [loading, setLoading] = useState(false);
  const nitStore  = useAuthStore(state => state.nit);

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
          const almacenes = data.warehouses.map((almacen: { id: string, name: string }) => ({
            value: almacen.id,
            label: almacen.name,
          }));
          setOptions(almacenes);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error al obtener los almacenes:", error);
        toast.error(error.error, { id: "fetchAlmacenesError" });
      }
    };

    fetchAlmacenes();
  }, []);

  useEffect(() => {
    /* Limpiar los inputs de producción */
    setFormReportDaily(initialFormReportDaily)
  }, [selectedOption])

  // Función para manejar la selección de un almacén
  const handleAlmacenSelect = async (almacenid: string, name: string) => {
    setSelectedOption({ id: almacenid, name: name });

    try {
      setLoading(true);
      const response = await productService.getProductsByWarehouse(`${almacenid}`)
      const { data, status } = response as AxiosResponse;
      if (status === 200) {
        setLoading(false);
        setWarehouseData(data.products);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error al obtener los datos del almacén:", error);
    }
  };

  /**
   * * Función para manejar el envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const requestData = {
      nitStore: nitStore,
      fecha: formattedDate,
      warehouseId: selectedOption.id.trim(),
      observaciones: formReportDaily.observation.trim() ? formReportDaily.observation.trim() : undefined,
      modul: "Report",
      produccion: {
      Huevos: formReportDaily.eggs ? formReportDaily.eggs : undefined,
      Picados: formReportDaily.eggs_lining ? formReportDaily.eggs_lining : undefined,
      Forro: formReportDaily.eggs_chopped ? formReportDaily.eggs_chopped : undefined,
      Quebrado: formReportDaily.eggs_broken ? formReportDaily.eggs_broken : undefined,
      },
      productos: [
      ...(warehousesData?.GrupoIdGranjaAnimales
        ?.filter(product => product.qtyToAdd !== undefined)
        .map(product => ({
        productId: product.productId,
        cantidad: product.qtyToAdd,
        seccion: "Mortalidad",
        })) ?? []),
      ...(warehousesData?.GrupoIdGranjaMedicamentos
        ?.filter(product => product.qtyToAdd !== undefined)
        .map(product => ({
        productId: product.productId,
        cantidad: product.qtyToAdd,
        seccion: "Medicamentos",
        })) ?? []),
      ...(warehousesData?.GrupoIdGranjaAlimentos
        ?.filter(product => product.qtyToAdd !== undefined)
        .map(product => ({
        productId: product.productId,
        cantidad: product.qtyToAdd,
        seccion: "Alimentos",
        })) ?? []),
      ...(warehousesData?.GrupoIdGranjaCalcio
        ?.filter(product => product.qtyToAdd !== undefined)
        .map(product => ({
        productId: product.productId,
        cantidad: product.qtyToAdd,
        seccion: "Calcio",
        })) ?? []),
      ],
    };
    if (!requestData.warehouseId) {
      setLoading(false);
      toast.error("Debe seleccionar un lote.");
      return;
    }

    if ((!requestData.produccion.Huevos &&
        !requestData.produccion.Picados &&
        !requestData.produccion.Forro &&
        !requestData.produccion.Quebrado &&
        requestData.productos.length === 0)
    ) {
      setLoading(false);
      toast.error("Debe ingresar al menos un dato para enviar.");
      return;
    }

    try {
      const response = await productService.inserProductInventari({ requestData });

      const { data, status } = response as AxiosResponse;
      if (status === 200) {
        setLoading(false);
        setSelectedDate(new Date());
        setSelectedOption({ id: "", name: "" });
        setWarehouseData({});
        setFormReportDaily(initialFormReportDaily);
        toast.success("Los datos se guardaron correctamente.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error al enviar los datos:", error);
      toast.error("Ocurrió un error al enviar los datos.");
      return;
    }
  };

  let totalEggs = Number(formReportDaily.eggs) + Number(formReportDaily.eggs_lining) + Number(formReportDaily.eggs_chopped) + Number(formReportDaily.eggs_broken);
  if (isNaN(totalEggs)) {
    totalEggs = 0;
  }
function handleInputChange(productId: string, value: string, currentDataKey: string): void {
  const newWarehouseDateGroup = [...(warehousesData[currentDataKey as keyof WarehouseData] as Product[])]
  
  const productOnGroup = newWarehouseDateGroup.find(product => product.productId == productId)
  
  if(productOnGroup){
    if(productOnGroup?.invenactua < Number(value)) {
      toast.error(`La cantidad supera el inventario disponible: ${productOnGroup?.invenactua}`);
      productOnGroup.qtyToAdd = parseFloat(Number(productOnGroup?.invenactua).toFixed(2));
    }else{
      productOnGroup.qtyToAdd = parseFloat(value);
    }
  }
  setWarehouseData((prevState) =>({
    ...prevState,
    [currentDataKey]: newWarehouseDateGroup
  }))
  
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
                setSelectedDate(date);
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
                <SelectItem key={option.value} value={option.value + '|' + option.label} defaultChecked={option.value === selectedOption.id}>
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
                handleInputChange(productId, value, 'GrupoIdGranjaAnimales')
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
                handleInputChange(productId, value, 'GrupoIdGranjaMedicamentos')
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
                handleInputChange(productId, value, 'GrupoIdGranjaAlimentos')
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
                handleInputChange(productId, value, 'GrupoIdGranjaCalcio')
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
                <FormProduction id="huevos" label="Huevos" value={formReportDaily.eggs.toString()} onChange={(e) => setFormReportDaily((prevState) => ({ ...prevState, eggs: Number(e.target.value) }))} />
                <FormProduction id="picado" label="Picado" value={formReportDaily.eggs_lining.toString()} onChange={(e) => setFormReportDaily((prevState) => ({ ...prevState, eggs_lining: Number(e.target.value) }))} />
                <FormProduction id="forro" label="Forro" value={formReportDaily.eggs_chopped.toString()} onChange={(e) => setFormReportDaily((prevState) => ({ ...prevState, eggs_chopped: Number(e.target.value) }))} />
                <FormProduction id="quebrado" label="Quebrado" value={formReportDaily.eggs_broken.toString()} onChange={(e) => setFormReportDaily((prevState) => ({ ...prevState, eggs_broken: Number(e.target.value) }))} />
                <FormProduction id="total" label={`Total`} value={totalEggs.toString()} disabled={true} />
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
            onChange={(e) => setFormReportDaily((prevState) => ({ ...prevState, observation: e.target.value }))}
          />
        </div>

        <Button type="submit" className="w-full flex items-center justify-center space-x-2">
          <span>Enviar</span>
        </Button>
      </form>
    </div>
  );
}
