interface FormReportDaily {
    AlmacenId: string;
    observation: string;
    eggs: nunmber;
    eggs_lining: number;
    eggs_chopped: number;
    eggs_broken: number;
    nombre?: string;
}

interface Product {
  grupo: unknown;
  ManejaLotes: string;
  selectedLote: string;
  loteAutomatico: string;
  lotes: { 
    numeroLote: string; 
    fechaVence: string | null; 
    invenActua: string; 
    qtyToAdd?:number
    cantidad?:number
  }[];
  productId: string; // Identificador único del producto
  name?: string; // Nombre del producto
  invenactua: number; // Inventario actual del producto
  qtyToAdd?:number
  cantidad?:number
  DecimalesCantidad?: number; // Número de decimales permitidos para la cantidad
}


interface WarehouseData{
  ProductionTotal: any;
  GrupoIdGranjaAnimales?: Product[] ;
  GrupoIdGranjaMedicamentos?: Product[];
  GrupoIdGranjaAlimentos?: Product[];
  GrupoIdGranjaCalcio?: Product[];
  GrupoIdGranjaProduccion?: Product[];
}
interface WarehouseAge{
  weeks?: number;
  days?: number;
}
export type { FormReportDaily,WarehouseData,Product,WarehouseAge };
