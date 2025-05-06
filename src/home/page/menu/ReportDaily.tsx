import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { DatePicker } from "@/components/DatePicker";
import { CustomSelect } from "@/components/CustomSelect";
import { ProductList } from "@/components/ProductList";
import { useApi } from "@/hooks/useApiService";
import { FormReportDaily, Product, WarehouseData, WarehouseAge } from "@/types";
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
  'AlmacenId': ""
}

export function ReportDaily() {
  /* STATE */
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date()); // Estado para manejar la fecha seleccionada
  const [selectedOption, setSelectedOption] = useState<{ id: string, name: string }>({ id: "", name: "" });
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );
  const [warehousesData, setWarehouseData] = useState<WarehouseData>({} as WarehouseData); // Datos relacionados al almacén seleccionado
  const [warehouseAge, setWarehouseAge] = useState<WarehouseAge>({}); // Edad del lote seleccionado
  const [gramsBirdDay, setGramsBirdDay] = useState<number | null>(0); // valor total de alimento consumido en gramos
  const [gramsCalcioDay, setGramsCalcioDay] = useState<number | null>(0); // valor total de calcio consumido en gramos
  const [mortality, setMortality] = useState<number | null>(); // total de aves - mortalidad
  const [birdsNumber, setBirdsNumber] = useState<number | null>(); // inventario de aves del lote seleccionado
  const [edit, setEdit] = useState<boolean>(false); // editar reporte diario
  const [formReportDaily, setFormReportDaily] = useState<FormReportDaily>(initialFormReportDaily);
  const formattedDate = selectedDate ? format(selectedDate, "yyyy/MM/dd") : undefined;
  const [loading, setLoading] = useState(false);
  const nitStore = useAuthStore(state => state.nit);
  const [initialized, setInitialized] = useState(false);

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
        const errorMessage = error instanceof Error ? error.message : "Error desconocido";
        toast.error(errorMessage, { id: "fetchAlmacenesError" });
      }
    };

    fetchAlmacenes();
  }, []);

  useEffect(() => {
    /* Limpiar los inputs de producción */
    setFormReportDaily(initialFormReportDaily)
  }, [selectedOption])

  useEffect(() => {
    if (edit && warehousesData && !initialized) {
      Object.entries(warehousesData).forEach(([groupName, groupProducts]) => {
        groupProducts.forEach((product: { ManejaLotes: string; lotes: ArrayLike<unknown> | { [s: string]: unknown; }; productId: string; cantidad: { toString: () => any; }; }) => {
          if (product.ManejaLotes === 'S') {
            Object.values(product.lotes).forEach(value => {
              handleInputChange(
                `${product.productId}-${(value as { numeroLote: string }).numeroLote}`,
                (value as { cantidad?: number }).cantidad?.toString() || "",
                groupName
              );
            });
          } else {
            handleInputChange(
              product.productId,
              product.cantidad?.toString() || "",
              groupName
            );
          }
        });
      });

      setInitialized(true);
    }
  }, [edit, warehousesData, initialized]);


  const getProductsByWarehouse = async (date: string, almacenid: string) => {
    setEdit(false);
    try {
      setLoading(true);
      const response = await productService.getProductsByWarehouse(date, almacenid, nitStore);
      const { data, status } = response as AxiosResponse;
      if (status === 200) {
        setLoading(false);
        setWarehouseData(data.products);
        setWarehouseAge(data.warehouseAge);
        setEdit(data.edit);

        // Este paso es clave: reinicia la bandera al cambiar de almacén
        setInitialized(false);

        if (data.edit) {
          const production = {
            AlmacenId: selectedOption.id, // Ensure AlmacenId is included
            observation: data.production?.Observacion,
            eggs: data.production?.Huevos,
            eggs_lining: data.production?.Picados,
            eggs_chopped: data.production?.Forro,
            eggs_broken: data.production?.Quebrados,
          };
          setFormReportDaily(production);
        } else {
          setFormReportDaily(initialFormReportDaily);
        }

        const birdsSum = getTotalInveActua(data.products.GrupoIdGranjaAnimales);
        setBirdsNumber(birdsSum);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error al obtener los datos del almacén:", error);
    }
  };

  // Función para manejar la selección de un almacén
  const handleAlmacenSelect = async (almacenid: string, name: string) => {
    setGramsBirdDay(0);
    setGramsCalcioDay(0);
    setSelectedOption({ id: almacenid, name: name });
    const dateToSend = selectedDate?.toISOString().split("T")[0];
    if (dateToSend) {
      await getProductsByWarehouse(dateToSend, almacenid);
    } else {
      console.error("dateToSend is undefined");
    }
  };

  // Función para manejar el cambio de fecha
  const handleDateChange = async (date: Date) => {
    setSelectedDate(date);
    setGramsBirdDay(0);
    setGramsCalcioDay(0);
    const dateToSend = date.toISOString().split("T")[0];
    if (selectedOption.id) {
      await getProductsByWarehouse(dateToSend, selectedOption.id);
    }
  };

  const getTotalInveActua = (array: { invenactua: string }[]) => {
    return array.reduce((total, item) => {
      if (item.ManejaLotes === "S" && Array.isArray(item.lotes)) {
        const lotesSum = item.lotes.reduce((acc, lote) => {
          const cantidadLote = parseFloat(lote.invenActua || "0");
          return acc + (cantidadLote > 0 ? cantidadLote : 0);
        }, 0);
        return total + lotesSum;
      } else {
        const cantidad = parseFloat(item.invenactua || "0");
        return total + (cantidad > 0 ? cantidad : 0);
      }
    }, 0);
  };

  /**
   * * Función para manejar el envío del formulario
   */

  const grupoNombreMap: Record<string, string> = {
    "15001": "Mortalidad",
    "15003": "Alimentos",
    "15004": "Medicamentos",
    "15005": "Calcio",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const productos = [
      ...(warehousesData?.GrupoIdGranjaAnimales ?? []),
      ...(warehousesData?.GrupoIdGranjaMedicamentos ?? []),
      ...(warehousesData?.GrupoIdGranjaAlimentos ?? []),
      ...(warehousesData?.GrupoIdGranjaCalcio ?? []),
    ].flatMap(producto => {
      const seccion = grupoNombreMap[producto.grupo as keyof typeof grupoNombreMap] || "Otro";
      if (producto.ManejaLotes === "S") {
        return (producto.lotes ?? [])
          .filter(lote => lote)
          .map(lote => ({
            productId: producto.productId,
            cantidad: lote.qtyToAdd || 0,
            seccion,
            numeroLote: lote.numeroLote,
          }));
      } else {
        return [{
          productId: producto.productId,
          cantidad: producto.qtyToAdd || 0,
          seccion,
          numeroLote: ""
        }];
      }
    });

    const requestData = {
      nitStore: nitStore,
      fecha: formattedDate,
      warehouseId: selectedOption.id.trim(),
      observaciones: formReportDaily.observation.trim()
        ? formReportDaily.observation.trim()
        : undefined,
      modul: "Report",
      produccion: {
        Huevos: formReportDaily.eggs ? formReportDaily.eggs : undefined,
        Picados: formReportDaily.eggs_lining ? formReportDaily.eggs_lining : undefined,
        Forro: formReportDaily.eggs_chopped ? formReportDaily.eggs_chopped : undefined,
        Quebrado: formReportDaily.eggs_broken ? formReportDaily.eggs_broken : undefined,
      },
      productos,
    };

    if (!requestData.warehouseId) {
      setLoading(false);
      toast.error("Debe seleccionar un lote.");
      return;
    }

    if (
      !requestData.produccion.Huevos &&
      !requestData.produccion.Picados &&
      !requestData.produccion.Forro &&
      !requestData.produccion.Quebrado &&
      requestData.productos.length === 0
    ) {
      setLoading(false);
      toast.error("Debe ingresar almenos un dato para enviar.");
      return;
    }

    try {
      const response = await productService.inserProductInventari({ requestData });
      
      const { status } = response as AxiosResponse;
      if (status === 200) {
        setLoading(false);
        setEdit(false);
        setWarehouseAge({});
        setSelectedDate(new Date());
        setSelectedOption({ id: "", name: "" });
        setWarehouseData({} as WarehouseData);
        setFormReportDaily(initialFormReportDaily);
        toast.success("Los datos se guardaron correctamente.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error al enviar los datos:", error);
      return;
    }
  };

  let totalEggs = Number(formReportDaily.eggs) + Number(formReportDaily.eggs_lining) + Number(formReportDaily.eggs_chopped) + Number(formReportDaily.eggs_broken);
  if (isNaN(totalEggs)) {
    totalEggs = 0;
  }
  /**
   * * Función para manejar el cambio de valor en los inputs de productos
   * @param productId ID del producto
   * @param value Valor ingresado por el usuario
   * @param currentDataKey Clave del objeto de datos del almacén
   */
  function handleInputChange(productId: string, value: string, currentDataKey: string): void {
    const newWarehouseDataGroup = [...(warehousesData[currentDataKey as keyof WarehouseData] as Product[])];

    // Buscar el producto o lote correspondiente
    const productOrLote = newWarehouseDataGroup.find(product => {
      if (product.lotes && product.lotes.length > 0) {
        return product.lotes.some(lote => `${product.productId}-${lote.numeroLote}` === productId);
      }
      return product.productId === productId;
    });

    const parsedValue = parseFloat(value.replace(/,/g, ''));
    const safeValue = isNaN(parsedValue) ? 0 : parsedValue;


    if (productOrLote) {
      if (productOrLote.lotes && productOrLote.lotes.length > 0) {
        // Si es un lote, actualizar el lote específico
        const loteToUpdate = productOrLote.lotes.find(lote => `${productOrLote.productId}-${lote.numeroLote}` === productId);
        if (loteToUpdate) {
          const maxValue = parseFloat(loteToUpdate.invenActua);
          if (maxValue < safeValue) {
            toast.error(`La cantidad supera el inventario disponible: ${maxValue.toLocaleString()}`);
            loteToUpdate.qtyToAdd = maxValue;
          } else {
            loteToUpdate.qtyToAdd = safeValue;
          }
        }
      } else {
        // Si no es un lote, actualizar el producto directamente
        const maxValue = productOrLote.invenactua;
        if (maxValue < safeValue) {
          toast.error(`La cantidad supera el inventario disponible: ${maxValue.toLocaleString()}`);
          productOrLote.qtyToAdd = maxValue;
        } else {
          productOrLote.qtyToAdd = safeValue;
        }

      }
    }
    // Actualizar la mortalidad dinámicamente
    if (currentDataKey === 'GrupoIdGranjaAnimales') {
      const totalQtyToAdd = newWarehouseDataGroup.reduce((acc, product) => {
        if (product.lotes && product.lotes.length > 0) {
          return acc + product.lotes.reduce((loteAcc, lote) => {
            const qty = typeof lote.qtyToAdd === 'number' ? lote.qtyToAdd : 0;
            return loteAcc + qty;
          }, 0);
        }
        const qty = typeof product.qtyToAdd === 'number' ? product.qtyToAdd : 0;
        return acc + qty;
      }, 0);

      const updatedMortality = (birdsNumber ?? 0) - totalQtyToAdd;
      setMortality(updatedMortality);
    }

    // Actualizar la Alimento dinámicamente
    if (currentDataKey === 'GrupoIdGranjaAlimentos') {
      const totalQtyToAdd = newWarehouseDataGroup.reduce((acc, product) => {
        if (product.lotes && product.lotes.length > 0) {
          return acc + product.lotes.reduce((loteAcc, lote) => {
            const qty = typeof lote.qtyToAdd === 'number' ? lote.qtyToAdd : 0;
            return loteAcc + qty;
          }, 0);
        }
        const qty = typeof product.qtyToAdd === 'number' ? product.qtyToAdd : 0;
        return acc + qty;
      }, 0);

      const updatedGrams = totalQtyToAdd * 1000;
      setGramsBirdDay(updatedGrams);
    }

    // Actualizar el Calcio dinámicamente
    if (currentDataKey === 'GrupoIdGranjaCalcio') {
      const totalQtyToAdd = newWarehouseDataGroup.reduce((acc, product) => {
        if (product.lotes && product.lotes.length > 0) {
          return acc + product.lotes.reduce((loteAcc, lote) => {
            const qty = typeof lote.qtyToAdd === 'number' ? lote.qtyToAdd : 0;
            return loteAcc + qty;
          }, 0);
        }
        const qty = typeof product.qtyToAdd === 'number' ? product.qtyToAdd : 0;
        return acc + qty;
      }, 0);

      const updatedGrams = totalQtyToAdd * 1000;
      setGramsCalcioDay(updatedGrams);
    }

    // Actualizar el estado del almacén
    setWarehouseData((prevState) => ({
      ...prevState,
      [currentDataKey]: newWarehouseDataGroup,
    }));
  }

  const editReport = async () => {
    setLoading(true);
    const productos = [
      ...(warehousesData?.GrupoIdGranjaAnimales ?? []),
      ...(warehousesData?.GrupoIdGranjaMedicamentos ?? []),
      ...(warehousesData?.GrupoIdGranjaAlimentos ?? []),
      ...(warehousesData?.GrupoIdGranjaCalcio ?? []),
    ].flatMap(producto => {
      const seccion = grupoNombreMap[producto.grupo as string] || "Otro";
      if (producto.ManejaLotes === "S") {
        return (producto.lotes ?? [])
          .filter(lote => lote.qtyToAdd !== undefined)
          .map(lote => ({
            productoid: producto.productId,
            cantidad: lote.qtyToAdd,
            seccion,
            numeroLote: lote.numeroLote,
          }));
      } else if (producto.qtyToAdd !== undefined) {
        return [{
          productoid: producto.productId,
          cantidad: producto.qtyToAdd,
          seccion,
          numeroLote: ""
        }];
      }

      return [];
    });

    const requestData = {
      fechaAnterior: format(new Date(), 'yyyy/MM/dd'),
      nitStore: nitStore,
      fecha: selectedDate,
      warehouseId: selectedOption.id.trim(),
      observaciones: formReportDaily.observation.trim()
        ? formReportDaily.observation.trim()
        : undefined,
      produccion: {
        Huevos: formReportDaily.eggs ? formReportDaily.eggs : undefined,
        Picados: formReportDaily.eggs_lining ? formReportDaily.eggs_lining : undefined,
        Forro: formReportDaily.eggs_chopped ? formReportDaily.eggs_chopped : undefined,
        Quebrado: formReportDaily.eggs_broken ? formReportDaily.eggs_broken : undefined,
      },
      productos,
    };

    try {
      const response = await productService.editDailyReport({ requestData });
      
      const { status, data } = response as AxiosResponse;
      if (status === 200) {
        setLoading(false);
        setEdit(false);
        setWarehouseAge({});
        setSelectedDate(new Date());
        setSelectedOption({ id: "", name: "" });
        setWarehouseData({} as WarehouseData);
        setFormReportDaily(initialFormReportDaily);
        setGramsBirdDay(0);
        setGramsCalcioDay(0);
        toast.success(data.message || "Registro editado correctamente.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error al enviar los datos:", error);
      return;
    }
    
  }

  return (
    <div className="w-full p-4 overflow-scroll h-screen">
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
            {(warehouseAge.weeks !== undefined && warehouseAge.days !== undefined) ?
              <div className="mt-2 text-sm text-gray-700">
                Edad: {warehouseAge.weeks} semanas {warehouseAge.days} días
              </div> : ''
            }
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
            <div>
              <ProductList
                products={warehousesData.GrupoIdGranjaAlimentos || []}
                onInputChange={(productId, value) =>
                  handleInputChange(productId, value, 'GrupoIdGranjaAlimentos')
                }
              />
              <div className="mt-2 text-lg text-gray-700">
                {gramsBirdDay !== null && gramsBirdDay !== undefined && birdsNumber !== null && birdsNumber !== undefined
                  ? (mortality <= 0
                    ? 'Gramos ave por día: ' + 0
                    : 'Gramos ave por día: ' + (gramsBirdDay / (mortality || birdsNumber)).toFixed(2))
                  : 'Datos no disponibles'}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No hay productos disponibles.</p>
          )}
        </div>
        <div className="">
          <h6 className="text-xl font-bold mb-4">Calcio</h6>
          {warehousesData?.GrupoIdGranjaCalcio && warehousesData.GrupoIdGranjaCalcio.length > 0 ? (
            <div>
              <ProductList
                products={warehousesData.GrupoIdGranjaCalcio || []}
                onInputChange={(productId, value) =>
                  handleInputChange(productId, value, 'GrupoIdGranjaCalcio')
                }
              />
              <div className="mt-2 text-lg text-gray-700">
                {gramsCalcioDay !== null && gramsCalcioDay !== undefined && birdsNumber !== null && birdsNumber !== undefined
                  ? (mortality <= 0
                    ? 'Gramos ave por día: ' + 0
                    : 'Gramos ave por día: ' + (gramsCalcioDay / (mortality || birdsNumber)).toFixed(2))
                  : 'Datos no disponibles'}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No hay productos disponibles.</p>
          )}
        </div>

        <div className="">
          <h6 className="text-2xl font-bold mb-4">Producción</h6>
          <div className="grid  gap-4">
            <div className="flex items-center space-x-2">
              <div className="grid grid-cols-5 gap-4 p-4 border rounded-md shadow-sm bg-white w-full">
                <FormProduction id="huevos" label="Huevos" value={Number(formReportDaily.eggs).toLocaleString("es-CO")} onChange={(e) => setFormReportDaily((prevState) => ({ ...prevState, eggs: Number(e.target.value.replace(/[^0-9,]/g, "")) }))} />
                <FormProduction id="picado" label="Picado" value={Number(formReportDaily.eggs_lining).toLocaleString("es-CO")} onChange={(e) => setFormReportDaily((prevState) => ({ ...prevState, eggs_lining: Number(e.target.value.replace(/[^0-9,]/g, "")) }))} />
                <FormProduction id="forro" label="Sucio" value={Number(formReportDaily.eggs_chopped).toLocaleString("es-CO")} onChange={(e) => setFormReportDaily((prevState) => ({ ...prevState, eggs_chopped: Number(e.target.value.replace(/[^0-9,]/g, "")) }))} />
                <FormProduction id="quebrado" label="Quebrado" value={Number(formReportDaily.eggs_broken).toLocaleString("es-CO")} onChange={(e) => setFormReportDaily((prevState) => ({ ...prevState, eggs_broken: Number(e.target.value.replace(/[^0-9,]/g, "")) }))} />
                <FormProduction id="total" label={`Total`} value={Number(totalEggs).toLocaleString("es-CO")} disabled={true} />
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
            placeholder="Escribe tus observaciones aquí..."
            onChange={(e) => setFormReportDaily((prevState) => ({ ...prevState, observation: e.target.value }))}
          />
        </div>

        {edit ?
          <Button type="button" onClick={() => editReport()} className="w-full flex items-center justify-center space-x-2 mb-10">
            <span>Editar</span>
          </Button>
          : <Button type="submit" className="w-full flex items-center justify-center space-x-2 mb-10">
            <span>Enviar</span>
          </Button>
        }

      </form>
    </div>
  );
}
