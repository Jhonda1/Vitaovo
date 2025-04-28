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
import { format } from "date-fns";

const initialFormReportDaily: FormReportDaily = {
  observation: "",
  eggs: 0,
  eggs_lining: 0,
  eggs_chopped: 0,
  eggs_broken: 0,
};

export function ListReport() {
  /* STATE */
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedOption, setSelectedOption] = useState<{
    id: string;
    name: string;
  }>({ id: "", name: "" });
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );
  const [warehousesData, setWarehouseData] = useState<WarehouseData>({}); // Datos relacionados al almacén seleccionado
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

    await fetchWarehouseData(date);
  };

  const fetchWarehouseData = async (date: Date) => {
    console.log(date);
    const { from, to } = date;
    const fromSerialize = format(from, "yyyy-MM-dd");
    const toSerialize = format(to, "yyyy-MM-dd");
    console.log({ fromSerialize, toSerialize });

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
        console.log(data);
        const dataParserProduction = data?.products.map((element) => {
          return {
            ...initialFormReportDaily,
            eggs: element?.Huevos || initialFormReportDaily.eggs,
            eggs_lining: element?.Forro || initialFormReportDaily.eggs_lining,
            eggs_chopped:
              element?.Picados || initialFormReportDaily.eggs_chopped,
            eggs_broken:
              element?.Quebrados || initialFormReportDaily.eggs_broken,
            observation:
              element?.Observacion || initialFormReportDaily.observation,
            AlmacenId: element.AlmacenId,
            nombre:element.nombre
          };
        });
        /* const updatedFormReportDaily = {
          ...initialFormReportDaily,
          eggs: ProductProduction?.Huevos || initialFormReportDaily.eggs,
          eggs_lining:
            ProductProduction?.Forro || initialFormReportDaily.eggs_lining,
          eggs_chopped:
            ProductProduction?.Picados || initialFormReportDaily.eggs_chopped,
          eggs_broken:
            ProductProduction?.Quebrados || initialFormReportDaily.eggs_broken,
          observation:
            ProductProduction?.Observacion ||
            initialFormReportDaily.observation,
        }; */
        setFormReportDaily(dataParserProduction);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error al obtener los datos del almacén:", error);
    }
  };

  console.log({ formReportDaily });

  function sumTotalProduction(warehouseId){

    let result = 0
    const findData =formReportDaily?.find((element) => element.AlmacenId == warehouseId )
    if(findData){
      const {AlmacenId,nombre,...rest} = findData
      
      result = Object.values(rest).reduce((acc, value) => acc + Number(value), 0)
        .toLocaleString("es-CO")
    }
    return result
      
    
  }
  return (
    <div className="w-full p-4 overflow-scroll h-screen">
      <LoadingSpinner loading={loading} type="bounce" size={55} />
      <form className="w-full space-y-4">
        <div className="w-[60vw] flex space-x-4">
          <div className="w-1/2">
            <DatePicker
              label="* Fecha:"
              mode="range"
              selectedDate={selectedDate}
              onDateChange={(date) => {
                handleDateChange(date ?? new Date());
              }}
            />
          </div>
          {/* <div className="w-1/2">
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
          </div> */}
        </div>

        <div className="w-auto overflow-x-auto flex">
          {Object.entries(warehousesData)?.map(([index, element]) => (
            <div
              className="mx-2 border rounded-2xl border-slate-200 p-4"
              key={index}
            >
              <div className="min-w-[50rem]">
                <h2>{formReportDaily.find(element=>element.AlmacenId == index)?.nombre || ''}</h2>
                <h6 className="text-xl font-bold mb-4">Mortalidad</h6>
                {element?.GrupoIdGranjaAnimales &&
                element.GrupoIdGranjaAnimales.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {element.GrupoIdGranjaAnimales.map((product) => (
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
              <div className="">
                <h6 className="text-xl font-bold mb-4">Medicamentos</h6>
                {element?.GrupoIdGranjaMedicamentos &&
                element.GrupoIdGranjaMedicamentos.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {element.GrupoIdGranjaMedicamentos.map((product) => (
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
              <div className="">
                <h6 className="text-xl font-bold mb-4">Alimentos</h6>
                {element?.GrupoIdGranjaAlimentos &&
                element.GrupoIdGranjaAlimentos.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {element.GrupoIdGranjaAlimentos.map((product) => (
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
              <div className="">
                <h6 className="text-xl font-bold mb-4">Calcio</h6>
                {element?.GrupoIdGranjaCalcio &&
                element.GrupoIdGranjaCalcio.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {element.GrupoIdGranjaCalcio.map((product) => (
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
              <div className="">
                <h6 className="text-2xl font-bold mb-4">Producción</h6>
                <div className="grid  gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="grid grid-cols-5 gap-4 p-4 border rounded-md shadow-sm bg-white w-full">
                      <FormProduction
                        id="Huevos"
                        label="Huevos"
                        value={Number(
                          formReportDaily.find(
                            (element) => element.AlmacenId == index
                          )?.eggs
                        ).toLocaleString("es-CO")}
                        disabled={true}
                      />
                      <FormProduction
                        id="Picados"
                        label="Picado"
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
                          }))
                        }
                        disabled={true}
                      />
                      <FormProduction
                        id="Forro"
                        label="Forro"
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
                          }))
                        }
                        disabled={true}
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
                          }))
                        }
                        disabled={true}
                      />
                      <FormProduction
                        id="total"
                        label={`Total`}
                        value={sumTotalProduction(index)}
                        disabled={true}
                      />
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
                  value={
                    formReportDaily.find(
                      (element) => element.AlmacenId == index
                    )?.observation
                  }
                  disabled={true}
                />
              </div>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}
