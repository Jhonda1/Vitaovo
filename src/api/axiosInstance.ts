import axios, { AxiosInstance, AxiosResponse } from "axios";
import { useAsyncStore } from "../hooks/storeData";
import { toast } from 'sonner';
 // Importa el hook para manejar localStorage

// const { getData, storeData } = useAsyncStore(); // Obtén las funciones del hook

export function createAxiosInstance(URL_API: string): AxiosInstance {
  const axiosInstance = axios.create({
    baseURL: URL_API,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    },
    timeout: 90000, // 1.5 min
  });

  // Interceptor de solicitudes
  axiosInstance.interceptors.request.use(
    async (config) => {
      try {
        // Recupera la configuración de la base de datos desde localStorage
        const conf = localStorage.getItem("conf");
        const parsedConf = conf ? JSON.parse(conf) : null;
        // Si existe la configuración de la base de datos, agrega el encabezado
        if (parsedConf) {
          config.headers["DB-CONFIG"] = parsedConf;
        } else {
          console.warn("No se encontró la configuración de la base de datos en localStorage.");
        }

        return config;
      } catch (error) {
        console.error("Error en el interceptor de solicitudes:", error);
        return Promise.reject(error);
      }
    },
    (error) => {
      return Promise.reject(error)
    }
  );

  // Interceptor de respuestas
  axiosInstance.interceptors.response.use(
    (response) => {
      console.log('Respuesta de la API:', response.data)
      return response
    },
    async (error) => {
      console.log(error)
      console.log('Error de respuesta:', error?.response?.data)
      console.log('statusCode:', error?.response?.status)

      if (error?.response?.status === 500) {
        const errorMessage = error?.response?.data?.message || "Error en la respuesta de la solicitud ❌";
        toast(errorMessage);
      } else if (error?.response?.status === 401) {
        console.log('Error 401: Sesión expirada', error?.response?.data)
        const errorMessage = error?.response?.data?.message || "Sesión expirada, por favor inicie sesión nuevamente ❌";
        toast(errorMessage);
      }

      return Promise.reject({ statusCode: error?.response?.status || 404, message: error?.response?.data?.message || 'Error en la conexión', ...error?.response?.data })
    }
  )

  return axiosInstance;
}