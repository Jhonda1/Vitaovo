interface FormReportDaily {
    observation: string;
    eggs: string;
    eggs_lining: string;
    eggs_chopped: string;
    eggs_broken: string;
}

interface Product {
  value: any;
  productId: string; // Identificador único del producto
  name: string; // Nombre del producto
  inventory: number; // Inventario actual del producto
}


interface WarehouseData{
  GrupoIdGranjaAnimales?: Product[] ;
  GrupoIdGranjaMedicamentos?: Product[];
  GrupoIdGranjaAlimentos?: Product[];
  GrupoIdGranjaCalcio?: Product[];
  GrupoIdGranjaProduccion?: Product[];
}
export type { FormReportDaily,WarehouseData,Product };
