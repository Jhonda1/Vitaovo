import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { useAsyncStore } from "../hooks/storeData"; // Importa el hook para manejar localStorage

const { getData, storeData } = useAsyncStore(); // Obtén las funciones del hook

export function createAxiosInstance(URL_API: string): AxiosInstance {
  const axiosInstance = axios.create({
    baseURL: URL_API,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    },
    withCredentials: true,
    timeout: 90000, // 1.5 min
  });

  // Interceptor de solicitudes
  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const confDb = await getData("configDevice"); // Recupera la configuración desde localStorage
      if (confDb?.db_conf != null) {
        config.headers.set("X-Encrypted-Config", confDb.db_conf);
        config.headers.set("X-User-Id", confDb.user?.id);
        config.headers.set("X-Nit", confDb.nit);
        config.headers.set("Authorization", confDb.token);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor de respuestas
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error) => {
      const config = error.config;
      console.error("Error en la URL:", config.url);
      console.error("Error de respuesta:", error?.response?.data);
      console.error("StatusCode:", error?.response?.status);

      if (!config.__retryCount) {
        config.__retryCount = 0;
      }

      if (error?.response?.status === 500) {
        return Promise.reject({
          statusCode: error.response.status,
          message: error?.response?.data?.message || "Error interno",
          ...error?.response?.data,
        });
      } else if (error?.response?.status === 401) {
        // Unauthorized
        const confDb = await getData("configDevice");
        await storeData("configDevice", {
          ...confDb,
          db_conf: null,
          token: null,
        });

        // Reintentar solicitud (máximo 2 veces)
        if (config.__retryCount > 2) {
          return Promise.reject({
            statusCode: error.response.status,
            message:
              error?.response?.data?.message ||
              "Sesión vencida, inicie sesión nuevamente",
            ...error?.response?.data,
          });
        }
        config.__retryCount += 1;
        return axiosInstance.request(config);
      } else if (error?.response?.status === 426) {
        // Update required
        const confDb = await getData("configDevice");
        await storeData("configDevice", {
          ...confDb,
          db_conf: null,
          token: null,
        });

        // Reintentar solicitud (máximo 2 veces)
        if (config.__retryCount > 2) {
          return Promise.reject({
            statusCode: error.response.status,
            message:
              error?.response?.data?.message ||
              "Error en la configuración de conexión",
            ...error?.response?.data,
          });
        }
        config.__retryCount += 1;
        return axiosInstance.request(config);
      }

      return Promise.reject({
        statusCode: error?.response?.status || 404,
        message:
          error?.response?.data?.message ||
          "Error en la conexión, verifica la ruta de la API o el estado de la conexión",
        ...error?.response?.data,
      });
    }
  );

  return axiosInstance;
}