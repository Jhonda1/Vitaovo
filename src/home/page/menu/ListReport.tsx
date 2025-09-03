/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";
import { DatePicker } from "@/components/DatePicker";
import { useApi } from "@/hooks/useApiService";
import { FormReportDaily, WarehouseData } from "@/types";
import { WarehouseService } from "@/services/warehouse";
import { AxiosResponse } from "axios";
import { ProductsService } from "@/services/products";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { FormProduction } from "@/home/components/FormProduction";
import { format, startOfMonth } from "date-fns"; // Importamos `startOfMonth`

const initialFormReportDaily: FormReportDaily = {
  observation: "",
  eggs: 0,
  eggs_lining: 0,
  eggs_chopped: 0,
  eggs_broken: 0,
  AlmacenId: ""
};

export function ListReport() {
  /* STATE */
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(startOfMonth(new Date())); // Primer día del mes actual
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date()); // Fecha actual

  const [, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [warehousesData, setWarehouseData] = useState<WarehouseData>({} as WarehouseData); // Datos relacionados al almacén seleccionado
  const [loading, setLoading] = useState(false);
  const [formReportDaily, setFormReportDaily] = useState<FormReportDaily[]>([]);

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
          const almacenes = data.warehouses.map(
            (almacen: { id: string; name: string }) => ({
              value: almacen.id,
              label: almacen.name,
            })
          );
          setOptions(almacenes);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error al obtener los almacenes fetchAlmacenes:");
        toast.error("Error al obtener los almacenes.");
        throw error; // Lanza el error para que pueda ser capturado por el bloque catch
      }
    };

    fetchAlmacenes();
  }, []);

  // Efecto para cargar los datos automáticamente al ingresar al módulo
  useEffect(() => {
    const fetchInitialData = async () => {
      await handleDateChange(selectedStartDate, selectedEndDate);
    };

    fetchInitialData();
  }, [selectedStartDate, selectedEndDate]);

  // Función para manejar el cambio de fecha
  const handleDateChange = async (startDate: Date, endDate: Date) => {
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);

    if (startDate && endDate) {
      await fetchWarehouseData({ from: startDate, to: endDate });
    } else {
      toast.error("Debe llenar ambas fechas para continuar.");
    }
  };

  const fetchWarehouseData = async (dateRange: { from: Date; to: Date }) => {
    const { from, to } = dateRange;
    const fromSerialize = format(from, "yyyy-MM-dd");
    const toSerialize = format(to, "yyyy-MM-dd");

    try {
      setLoading(true);
      const response = await productService.getReportByDateAndWarehouse(
        fromSerialize,
        toSerialize
      );
      const { data, status } = response as AxiosResponse;
      if (status === 200) {
        setLoading(false);
        setWarehouseData(data.Production);

        interface ProductElement {
          Huevos: number;
          Forro: number;
          Picados: number;
          Quebrados: number;
          Observacion: string;
          AlmacenId: string;
          nombre: string;
        }

        const dataParserProduction = data?.products.map((element: ProductElement) => ({
          ...initialFormReportDaily,
          eggs: element?.Huevos || initialFormReportDaily.eggs,
          eggs_lining: element?.Forro || initialFormReportDaily.eggs_lining,
          eggs_chopped: element?.Picados || initialFormReportDaily.eggs_chopped,
          eggs_broken: element?.Quebrados || initialFormReportDaily.eggs_broken,
          observation:
            element?.Observacion || initialFormReportDaily.observation,
          AlmacenId: element.AlmacenId,
          nombre: element.nombre,
        }));

        setFormReportDaily(dataParserProduction);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error al obtener los datos del almacén fetchWarehouseData:");
      toast.error("Error al obtener los datos del almacén.");
      throw error; // Lanza el error para que pueda ser capturado por el bloque catch
    }
  };

  function sumTotalProduction(warehouseId: string) {
    let result = 0;
    const findData = formReportDaily?.find(
      (element) => element.AlmacenId == warehouseId
    );
    if (findData) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { AlmacenId, nombre, ...rest } = findData;

      result = Object.values(rest)
        .reduce((acc, value) => acc + Number(value), 0)
        .toLocaleString("es-CO");
    }
    return result;
  }
  
  return (
    <div className="w-full p-4 overflow-scroll h-screen">
      <LoadingSpinner loading={loading} type="bounce" size={55} />
      <form className="w-full space-y-4">
        <div className="w-[60vw] flex space-x-4">
          <div className="w-1/2">
            <DatePicker
              label="* Fecha Inicial:"
              selectedDate={selectedStartDate}
              onDateChange={(date) => {
                const newStartDate = date ?? new Date();
                setSelectedStartDate(newStartDate);
                handleDateChange(newStartDate, selectedEndDate);
              }}
            />
          </div>
          <div className="w-1/2">
            <DatePicker
              label="* Fecha Final:"
              selectedDate={selectedEndDate}
              onDateChange={(date) => {
                const newEndDate = date ?? new Date();
                setSelectedEndDate(newEndDate);
                handleDateChange(selectedStartDate, newEndDate);
              }}
            />
          </div>
        </div>

        <div
          className={`w-auto overflow-x-auto flex ${
            Object.entries(warehousesData)?.length > 0 ? "max-w-[100%]" : "w-full"
          }`}
        >
          {Object.entries(warehousesData)?.length > 0 ? (
            Object.entries(warehousesData)?.map(([index, element]) => (
              <div
              className="mx-2 border rounded-2xl border-slate-200 p-4"
              key={index}
              >
                <h3>{formReportDaily.find(element=>element.AlmacenId == index)?.nombre || ''}</h3>
                <div className="min-w-[25rem]">
                  <h6 className="text-2xl font-bold mb-4">Producción</h6>
                  <div className="grid  gap-4">
                    <div className="flex items-center space-x-2 pb-2">
                        <div className="grid grid-cols-1 gap-1 p-2 border rounded-md shadow-sm bg-white w-full">
                        <FormProduction
                        id="Huevos"
                        label="Huevos"
                        value={Number(
                        formReportDaily.find(
                          (element) => element.AlmacenId == index
                        )?.eggs
                        ).toLocaleString("es-CO")}
                        disabled={true}
                        vertical={false}
                        />
                      <FormProduction
                        id="Picados"
                        label="Picado"
                        value={Number(
                        formReportDaily.find(
                          (element) => element.AlmacenId == index
                        )?.eggs_chopped
                        ).toLocaleString("es-CO")}
                        onChange={(e) =>
                        setFormReportDaily((prevState) => ({
                          ...prevState,
                          eggs_chopped: Number(
                          e.target.value.replace(/[^0-9,]/g, "")
                          ),
                        }))}
                        disabled={true}
                        vertical={false}
                      />
                      <FormProduction
                        id="Forro"
                        label="Sucio"
                        value={Number(
                        formReportDaily.find(
                          (element) => element.AlmacenId == index
                        )?.eggs_lining
                        ).toLocaleString("es-CO")}
                        onChange={(e) =>
                        setFormReportDaily((prevState) => ({
                          ...prevState,
                          eggs_lining: Number(
                          e.target.value.replace(/[^0-9,]/g, "")
                          ),
                        }))}
                        disabled={true}
                        vertical={false}
                      />
                      <FormProduction
                        id="Quebrados"
                        label="Quebrado"
                        value={Number(
                        formReportDaily.find(
                          (element) => element.AlmacenId == index
                        )?.eggs_broken
                        ).toLocaleString("es-CO")}
                        onChange={(e) =>
                        setFormReportDaily((prevState) => ({
                          ...prevState,
                          eggs_broken: Number(
                          e.target.value.replace(/[^0-9,]/g, "")
                          ),
                        }))}
                        disabled={true}
                        vertical={false}
                      />
                      <FormProduction
                        id="total"
                        label={`Total`}
                        value={sumTotalProduction(index).toString()}
                        disabled={true}
                        vertical={false}
                      />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="min-w-[25rem]">
                  <h6 className="text-xl font-bold mb-4">Mortalidad</h6>
                  {element?.GrupoIdGranjaAnimales &&
                  element.GrupoIdGranjaAnimales.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {element.GrupoIdGranjaAnimales.map((product: { productId: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; qtyToAdd: any; }) => (
                    <div
                      key={product.productId}
                      className="flex items-center space-x-4"
                    >
                      <label className="w-1/2 text-gray-700">
                      {product.name}
                      </label>
                      <input
                      type="text"
                      value={Number(product.qtyToAdd || 0).toLocaleString(
                        "es-CO"
                      )}
                      disabled
                      className="w-1/2 p-2 border rounded-md bg-gray-100 text-gray-700"
                      />
                    </div>
                    ))}
                  </div>
                  ) : (
                  <p className="text-gray-500">
                    No hay Mortalidad agregado a este reporte.
                  </p>
                  )}
                </div>
                <div className="min-w-[25rem]">
                  <h6 className="text-xl font-bold mb-4">Medicamentos</h6>
                  {element?.GrupoIdGranjaMedicamentos &&
                  element.GrupoIdGranjaMedicamentos.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {element.GrupoIdGranjaMedicamentos.map((product: { productId: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; qtyToAdd: any; }) => (
                    <div
                      key={product.productId}
                      className="flex items-center space-x-4"
                    >
                      <label className="w-1/2 text-gray-700">
                      {product.name}
                      </label>
                      <input
                      type="text"
                      value={Number(product.qtyToAdd || 0).toLocaleString(
                        "es-CO"
                      )}
                      disabled
                      className="w-1/2 p-2 border rounded-md bg-gray-100 text-gray-700"
                      />
                    </div>
                    ))}
                  </div>
                  ) : (
                  <p className="text-gray-500">
                    No hay Medicamentos agregado a este reporte.
                  </p>
                  )}
                </div>
                <div className="min-w-[25rem]">
                  <h6 className="text-xl font-bold mb-4">Alimentos</h6>
                  {element?.GrupoIdGranjaAlimentos &&
                  element.GrupoIdGranjaAlimentos.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {element.GrupoIdGranjaAlimentos.map((product: { productId: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; qtyToAdd: any; }) => (
                    <div
                      key={product.productId}
                      className="flex items-center space-x-4"
                    >
                      <label className="w-1/2 text-gray-700">
                      {product.name}
                      </label>
                      <input
                      type="text"
                      value={Number(product.qtyToAdd || 0).toLocaleString(
                        "es-CO"
                      )}
                      disabled
                      className="w-1/2 p-2 border rounded-md bg-gray-100 text-gray-700"
                      />
                    </div>
                    ))}
                  </div>
                  ) : (
                  <p className="text-gray-500">
                    No hay Alimentos agregado a este reporte.
                  </p>
                  )}
                </div>
                <div className="min-w-[25rem]">
                  <h6 className="text-xl font-bold mb-4">Calcio</h6>
                  {element?.GrupoIdGranjaCalcio &&
                  element.GrupoIdGranjaCalcio.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {element.GrupoIdGranjaCalcio.map((product: { productId: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; qtyToAdd: any; }) => (
                    <div
                      key={product.productId}
                      className="flex items-center space-x-4"
                    >
                      <label className="w-1/2 text-gray-700">
                      {product.name}
                      </label>
                      <input
                      type="text"
                      value={Number(product.qtyToAdd || 0).toLocaleString(
                        "es-CO"
                      )}
                      disabled
                      className="w-1/2 p-2 border rounded-md bg-gray-100 text-gray-700"
                      />
                    </div>
                    ))}
                  </div>
                  ) : (
                  <p className="text-gray-500">
                    No hay calcio agregado a este reporte.
                  </p>
                  )}
                </div>
              </div>
            ))
            ) : (
            <div className="flex justify-center items-center w-full h-full ">
              <div className="p-6 max-w-sm bg-white border border-gray-200 rounded-lg shadow-md">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 text-center">
                Sin Reportes
              </h5>
              <p className="mb-4 font-normal text-gray-700 text-center">
                No hay reportes para el rango de fechas seleccionados.
              </p>
              </div>
            </div>
            )}
        </div>
      </form>
    </div>
  );
}
