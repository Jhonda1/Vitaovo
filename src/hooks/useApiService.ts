import { createAxiosInstance } from "@/api/axiosInstance";

export interface ApiServicesConfig {
  headers?: Record<string, string>;
}

export type ApiServiceType = {
  post: (url: string, dataRequest: unknown) => Promise<unknown>;
  get: (url: string) => Promise<unknown>;
};

export const useApi = () => {
  const envieronment = import.meta.env.VITE_URLAPI;
  const urlApi = localStorage.getItem("urlApi")
    ? localStorage.getItem("urlApi")
    : envieronment;
  const api = createAxiosInstance(urlApi);
  
  const apiServices = (): ApiServiceType => {
    const post = (url: string, dataRequest: unknown) => {
      return api.post(url, dataRequest).catch((error: Error) => {
        throw error;
      });
    };

    const get = (url: string) => {
      return api.get(url).catch((error: Error) => {
        throw error;
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
