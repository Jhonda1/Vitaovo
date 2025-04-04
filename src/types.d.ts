interface FormReportDaily {
    observation: string;
    eggs: string;
    eggs_lining: string;
    eggs_chopped: string;
    eggs_broken: string;
}

interface Product {
  productId: string; // Identificador único del producto
  name: string; // Nombre del producto
  invenactua: number; // Inventario actual del producto
  qtyToAdd?:number
}


interface WarehouseData{
  GrupoIdGranjaAnimales?: Product[] ;
  GrupoIdGranjaMedicamentos?: Product[];
  GrupoIdGranjaAlimentos?: Product[];
  GrupoIdGranjaCalcio?: Product[];
  GrupoIdGranjaProduccion?: Product[];
}
export type { FormReportDaily,WarehouseData,Product };
