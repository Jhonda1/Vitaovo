import { createAxiosInstance } from "@/api/axiosInstance";
import { toast } from 'sonner';


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
        .catch((e) => {
            console.log(e.message)
          if(e?.message ){
            toast(e.message)

          }
          throw e;
        });
    };

    const get = (url: any) => {
      return api
        .get(url)
        .catch((e) => {
          if (e?.statusCode === 401) {
            /* sessionEnd() */
          }
          if(e?.message ){
            toast(e.message)

          }
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