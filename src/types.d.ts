interface FormReportDaily {
    observation: string;
    eggs: nunmber;
    eggs_lining: number;
    eggs_chopped: number;
    eggs_broken: number;
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
