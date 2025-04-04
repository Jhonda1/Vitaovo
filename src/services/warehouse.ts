import { ApiServiceType } from "@/hooks/useApiService";

export class WarehouseService {
  private apiService;
  constructor(apiService: ApiServiceType) {
    this.apiService = apiService;
  }
  getWarehouses() {
    return this.apiService.get("/warehouses");
  }

  getProductInventory(){
    return fetch("/vitaovo/Products.json")
    .then(response => response.json())
    .catch(error => console.error('Error al obtener los productos:', error));
  }

}
