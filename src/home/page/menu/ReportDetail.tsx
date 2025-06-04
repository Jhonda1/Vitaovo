import { useEffect, useState } from "react";
import { DatePicker } from "@/components/DatePicker";
import { useApi } from "@/hooks/useApiService";
import { WarehouseService } from "@/services/warehouse";
import { ProductsService } from "@/services/products";
import { WarehouseData } from "@/types";
import { AxiosResponse } from "axios";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { toast } from "sonner";
import { format, startOfMonth } from "date-fns"; // Importamos `startOfMonth`
import DataTable from "react-data-table-component";
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.print.js';
// Update the import path below if the actual file location is different
import { MultiSelect } from "@/components/MultipleSelect"

interface WarehouseOption {
  value: string;
  label: string;
}

export function ReportDetail() {
  /* STATE */
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(startOfMonth(new Date())); // Primer día del mes actual
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date()); // Fecha actual
  const [options, setOptions] = useState<WarehouseOption[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [warehouseData, setWarehouseData] = useState<WarehouseData>({} as WarehouseData); // Datos relacionados al almacén seleccionado
  const [loading, setLoading] = useState(false);

  /* HOOKS */
  const { apiService } = useApi();
  const warehouseService = new WarehouseService(apiService);
  const productService = new ProductsService(apiService);

  /* configuracion para datatable */
  // ...existing code...

  interface Insumo {
    nombre: string;
    cantidad: number;
  }

  interface Produccion {
    nombre: string;
    cantidad: number;
  }

  interface ReportRow {
    AlmacenId: string;
    fecha: string;
    Insumos: Record<string, Insumo[]>;
    Produccion: Produccion[];
    observacion: string;
    usuario: string;
    fecharegistro: string;
    // Add other fields if needed
  }

  // Define the keys you expect inside Insumos
  const INSUMOS_KEYS = [ "Mortalidad", "Medicamentos", "Alimentos", "Calcio" ] as const;
  const columns = [
    {
      name: "Lote",
      selector: (row: ReportRow) => row.AlmacenId,
      sortable: true,
      wrap: true,
      grow: 1.2,
      style: {
        minWidth: "120px",
        maxWidth: "140px",
        whiteSpace: "pre-line" as React.CSSProperties["whiteSpace"],
        wordBreak: "break-word" as React.CSSProperties["wordBreak"],
        verticalAlign: "middle",
        textAlign: "center" as const,
      },
    },
    {
      name: "Fecha",
      selector: (row: ReportRow) => row.fecha,
      sortable: true,
      wrap: true,
      grow: 1,
      style: {
        minWidth: "110px",
        maxWidth: "130px",
        whiteSpace: "pre-line" as React.CSSProperties["whiteSpace"],
        wordBreak: "break-word" as React.CSSProperties["wordBreak"],
        verticalAlign: "middle",
        textAlign: "center" as const,
      },
    },
    {
      name: "Usuario",
      selector: (row: ReportRow) => row.usuario,
      wrap: true,
      grow: 1,
      style: {
        minWidth: "110px",
        maxWidth: "140px",
        whiteSpace: "pre-line" as React.CSSProperties["whiteSpace"],
        wordBreak: "break-word" as React.CSSProperties["wordBreak"],
        verticalAlign: "middle",
        textAlign: "center" as const,
      },
    },
    {
      name: "Fecha de Registro",
      selector: (row: ReportRow) => row.fecharegistro,
      wrap: true,
      grow: 1.7,
      style: {
        minWidth: "150px",
        maxWidth: "150px",
        whiteSpace: "pre-line" as React.CSSProperties["whiteSpace"],
        wordBreak: "break-word" as React.CSSProperties["wordBreak"],
        verticalAlign: "middle",
        textAlign: "center" as const,
      },
    },
    ...INSUMOS_KEYS.map((key) => ({
      name: key,
      cell: (row: ReportRow) => {
        const items: Insumo[] = row.Insumos?.[key] ?? [];
        return Array.isArray(items) && items.length > 0 ? (
          <ul style={{ paddingLeft: 0, margin: 0, listStyle: "none", textAlign: "left" }}>
            {items.map((insumo: Insumo, idx) => (
              <li key={idx}>
                {insumo.nombre}: {insumo.cantidad}
              </li>
            ))}
          </ul>
        ) : (
          <span style={{ color: "#888" }}></span>
        );
      },
      wrap: true,
      grow: 1.5,
      style: {
        minWidth: "140px",
        maxWidth: "180px",
        whiteSpace: "pre-line" as React.CSSProperties["whiteSpace"],
        wordBreak: "break-word" as React.CSSProperties["wordBreak"],
        fontSize: "13px",
        verticalAlign: "middle",
        textAlign: "center" as const,
      },
    })),
    {
      name: "Producción",
      cell: (row: ReportRow) =>
        Array.isArray(row.Produccion) && row.Produccion.length > 0 ? (
          <ul style={{ paddingLeft: 0, margin: 0, listStyle: "none", textAlign: "left" }}>
            {row.Produccion.map((prod: Produccion, idx) => (
              <li key={idx}>
                {prod.nombre}: {prod.cantidad}
              </li>
            ))}
          </ul>
        ) : (
          <span style={{ color: "#888" }}></span>
        ),
      wrap: true,
      grow: 1.5,
      style: {
        minWidth: "140px",
        maxWidth: "180px",
        whiteSpace: "pre-line" as React.CSSProperties["whiteSpace"],
        wordBreak: "break-word" as React.CSSProperties["wordBreak"],
        verticalAlign: "middle",
        textAlign: "center" as const,
      },
    },
    {
      name: "Observación",
      selector: (row: ReportRow) => row.observacion,
      wrap: true,
      grow: 1.2,
      style: {
        minWidth: "120px",
        maxWidth: "180px",
        whiteSpace: "pre-line" as React.CSSProperties["whiteSpace"],
        wordBreak: "break-word" as React.CSSProperties["wordBreak"],
        verticalAlign: "middle",
        textAlign: "center" as const,
      },
    },
  ];

  const tableData = Array.isArray(warehouseData) ? warehouseData : [];

  /* EFFECTS */
  useEffect(() => {
    // Función para obtener los datos de los almacenes
    const fetchAlmacenes = async () => {
      try {
        setLoading(true);
        const response = await warehouseService.getWarehouses();
        const { data, status } = response as AxiosResponse;
        console.log("Almacenes:", data);
        if (status === 200) {
          const almacenes: WarehouseOption[] = data.warehouses.map(
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

  const filterProducts = async (
    startDate: Date,
    endDate: Date,
    selectedWarehouses: string[]
  ) => {
    if (!startDate || !endDate) {
      toast.error("Debe llenar ambas fechas para continuar.");
      return;
    }
    try {
      setLoading(true);
      const fromSerialize = format(startDate, "yyyy-MM-dd");
      const toSerialize = format(endDate, "yyyy-MM-dd");

      const dataSend = {
        from: fromSerialize,  
        to: toSerialize,
        warehouses: selectedWarehouses,
      };
      
      const response = await productService.getReportByDateAndWarehouseDetail(dataSend);
      const { data, status } = response as AxiosResponse;
      if (status === 200) {
        setWarehouseData(data.data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error al filtrar productos:", error);
      toast.error("Error al filtrar productos.");
    }
  }
  
  return (
    <div className="w-full p-4 overflow-scroll h-screen">
      <LoadingSpinner loading={loading} type="bounce" size={55} />
      <form className="w-full space-y-4">
        <div className="sm:w-[50vw] grid sm:grid-cols-2 md:w-[60vw] lg:w-[70vw] lg:grid-cols-4 gap-4">
          <div>
            <DatePicker
              label="* Fecha Inicial:"
              selectedDate={selectedStartDate}
              onDateChange={(date) => {
                const newStartDate = date ?? new Date();
                setSelectedStartDate(newStartDate);
              }}
            />
          </div>
          <div >
            <DatePicker
              label="* Fecha Final:"
              selectedDate={selectedEndDate}
              onDateChange={(date) => {
                const newEndDate = date ?? new Date();
                setSelectedEndDate(newEndDate);
              }}
            />
          </div>
           <div >
            <label className="block  text-sm font-medium">Lote:</label>
            <MultiSelect
              options={options}
              selected={selected}
              onChange={setSelected}
            />
          </div>
          <div className="mt-4">
            <button
              type="button"
              className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={() => filterProducts(selectedStartDate, selectedEndDate, selected)}
              disabled={loading}
            >
              Filtrar
            </button>
          </div>
        </div>


        <div className="overflow-x-auto w-full">
            <div className="min-w-[500px] md:min-w-0">
            <DataTable
              columns={columns}
              data={tableData}
              pagination
              highlightOnHover
              striped
              responsive
              fixedHeader
              fixedHeaderScrollHeight={`calc(80vh - 20px)`}
              paginationComponentOptions={{
                rowsPerPageText: 'Filas por página',
                rangeSeparatorText: 'de',
                selectAllRowsItem: true,
                selectAllRowsItemText: 'Todos',
              }}
              noDataComponent={
              <div className="text-center text-gray-500 py-8">
                No hay datos para mostrar.
              </div>
              }
            />
            </div>
        </div>


      </form>
    </div>
  );
}
