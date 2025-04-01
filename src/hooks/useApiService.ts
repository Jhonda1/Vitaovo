import { createAxiosInstance } from "@/api/axiosInstance";
export interface ApiServicesConfig {
  headers?: {};
}

export const useApi = () => {
    const envieronment = import.meta.env.VITE_URLAPI;
    const urlApi = localStorage.getItem('urlApi') ? localStorage.getItem('urlApi') : envieronment;
    const api = createAxiosInstance(urlApi);
    const apiServices = () => {
    const post = (url: any, dataRequest: any) => {
      return api
        .post(url, dataRequest)
        .catch((e: any) => {
          throw e;
        });
    };

    const get = (url: any) => {
      return api
        .get(url)
        .catch((e: any) => {
          throw e;
        });
    };

    return {
      post,
      get,
    };
  };

  return {
    apiService: apiServices(),
  };
};