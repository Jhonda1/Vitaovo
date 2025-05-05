import { ApiServiceType } from "@/hooks/useApiService";

export class WarehouseService {
  private apiService;
  constructor(apiService: ApiServiceType) {
    this.apiService = apiService;
  }
  getWarehouses() {
    return this.apiService.get("/warehouses");
  }

}
