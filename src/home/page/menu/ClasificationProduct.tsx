import { Button } from "@/components/ui/button";
import { Key, useEffect, useState } from "react";
import { DatePicker } from "@/components/DatePicker";
import { CustomSelect } from "@/components/CustomSelect";
import { useApi } from "@/hooks/useApiService";
import { WarehouseService } from "@/services/warehouse";
import { ProductsService } from "@/services/products";
import { FormReportDaily, WarehouseData } from "@/types";
import { AxiosResponse } from "axios";
import { FormProduction } from "@/home/components/FormProduction";
import { SelectItem } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { ProductClasification } from "@/components/ProductClasification";

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
  const [warehousesData, setWarehouseData] = useState<WarehouseData>({}); // Datos relacionados al almacén seleccionado
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );  
  const [formReportDaily, setFormReportDaily] = useState<FormReportDaily>(initialFormReportDaily);
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  
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
      const response = await productService.getRegisteredProductsByDateAndWarehouse(`${dateToSend}`, `${almacenid}`);
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

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!selectedDate || !selectedOption.id) {
      setLoading(false);
      toast.error("Por favor, selecciona una fecha y un lote antes de enviar.");
      return;
    }

    const filteredProducts = Object.entries(quantities)
      .filter(([_, quantity]) => quantity > 0)
      .map(([productId, quantity]) => ({
        productId,
      cantidad: quantity,
      seccion: 'Produccion'
    }));

    if (filteredProducts.length === 0) {
      setLoading(false);
      toast.error("No hay datos para enviar.");
      return;
    }

    const requestData = {
      nitStore: nitStore,
      fecha: selectedDate.toISOString().split("T")[0],
      warehouseId: selectedOption.id.trim(),
      productos: filteredProducts,
      modul: "Clasification",
    };
    console.log("Datos enviados:", requestData);

    try {
      const response = await productService.inserProductInventari({ requestData });
      const {data, status} = response as AxiosResponse;
      if(status === 200){
        setLoading(false);
        setSelectedDate(new Date());
        setSelectedOption({ id: "", name: "" });
        setWarehouseData({});
        setFormReportDaily(initialFormReportDaily);
        setQuantities({});
        toast.success("Los datos se guardaron correctamente.");
      }

    } catch (error) {
      setLoading(false);
      console.error("Error al enviar los datos:", error);
      toast.error("Error al guardar los datos.");
    }
 
  };

  let totalEggs = Number(formReportDaily.eggs) + Number(formReportDaily.eggs_lining) + Number(formReportDaily.eggs_chopped) + Number(formReportDaily.eggs_broken);
  if(isNaN(totalEggs)) {
    totalEggs = 0;
  }

  function handleInputChangeProd(productId: string, value: string, arg2: string) {
    throw new Error("Function not implemented.");
  }

  const handleQuantityChange = (productName: string, quantity: number) => {
    console.log("Cantidad actualizada:", productName, quantity);
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productName]: quantity,
    }));
  };

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
                handleDateChange(date ?? new Date());
              }}
            />
          </div>
          <div className="w-1/2">
            <CustomSelect
              label="Lote:"
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

        <h6 className="text-2xl font-bold mb-4">Clasificación de Productos</h6>
        {warehousesData?.GrupoIdGranjaProduccion && warehousesData.GrupoIdGranjaProduccion.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {warehousesData?.GrupoIdGranjaProduccion?.map((product: { productId: Key | null | undefined; name: string; }) => (
              <ProductClasification
                key={product.productId}
                productId={product.productId as string} // Aseguramos que productId sea una cadena
                productName={product.name}
                quantity={quantities[product.productId as string] || 0} // Usamos productId como clave para cantidades
                onQuantityChange={(productId, quantity) => handleQuantityChange(productId, quantity)} // Pasamos productId y cantidad
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No hay productos disponibles.</p>
        )}

        <Button type="submit" className="w-full">
          Enviar
        </Button>
      </form>
    </div>
  );
}