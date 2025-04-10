import { ApiServiceType } from "@/hooks/useApiService";

export class WarehouseService {
  private apiService;
  constructor(apiService: ApiServiceType) {
    this.apiService = apiService;
  }
  getWarehouses() {
    const nit = localStorage.getItem("nit");
    return this.apiService.get(nit ? `/warehouses?nit=${nit}` : "/warehouses");
  }

}
