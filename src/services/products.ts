import { ApiServiceType } from "@/hooks/useApiService";


export class ProductsService {
  private apiService;
  constructor(apiService: ApiServiceType) {
    this.apiService = apiService;
  }

  getProductsByWarehouse(warehouseId: string) {
    return this.apiService.get(
      `/products/productgrouped/warehouse/${warehouseId}`
    );
  }

  getClasificationProductsByWarehouse(warehouseId: string) {
    return this.apiService.get(
      `/products/clasificationProducts/warehouse/${warehouseId}`
    );
  }

  getProductsLoadProduction(groupId: string) {
    return this.apiService.get(`/products/${groupId}`);
  }

  inserProductInventari(data: object) {
    return this.apiService.post(`/products/inserProductInventari`, data);
  }

  getRegisteredProductsByDateAndWarehouse(date: string, warehouseId: string) {
    return this.apiService.get(
      `/products/registered-products/${date}/warehouse/${warehouseId}`
    );
  }

  sendProductClassificationData(data: object) {
    return this.apiService.post(`/products/sendProductClassificationData`, data);
  }
}