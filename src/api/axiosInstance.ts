import axios, { AxiosInstance } from "axios";
import { toast } from 'sonner';

export function createAxiosInstance(URL_API: string): AxiosInstance {
  const axiosInstance = axios.create({
    baseURL: URL_API,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
      "X-APPVERSION": import.meta.env.VITE_VERSION,
      "X-APPNAME": import.meta.env.VITE_APP_NAME,
    },
    timeout: 90000, // 1.5 min
  });

  // Interceptor de solicitudes
  axiosInstance.interceptors.request.use(
    async (config) => {
      try {
        // Recupera la configuración de la base de datos desde localStorage
        const conf = await localStorage.getItem("conf");
        const parsedConf = conf ? JSON.parse(conf) : null;
  
        // Si existe la configuración de la base de datos, agrega el encabezado
        if (parsedConf) {
          config.headers["DB-CONFIG"] = parsedConf;
        } else {
          console.warn("No se encontró la configuración de la base de datos en localStorage.");
        }
  
        // Recupera el token desde la clave "user" en localStorage
        const user = await localStorage.getItem("user");
        const parsedUser = user ? JSON.parse(user) : null;
  
        if (parsedUser?.token) {
          config.headers.Authorization = `Bearer ${parsedUser.token}`; // Agrega el token al encabezado
        } else {
          console.warn("No se encontró el token en la clave 'user' de localStorage.");
        }
  
        return config;
      } catch (error) {
        console.error("Error en el interceptor de solicitudes:", error);
        return Promise.reject(error);
      }
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor de respuestas
  axiosInstance.interceptors.response.use(
    (response) => {
      return response
    },
    async (error) => {
      console.log(error)
      console.log('Error de respuesta:', error?.response?.data)
      console.log('statusCode:', error?.response?.status)

      if (error?.response?.status === 500) {
        const errorMessage = error?.response?.data?.message || "Error en la respuesta de la solicitud ❌";
        toast.error(errorMessage);
      } else if (error?.response?.status === 401) {
        console.log('Error 401: Sesión expirada', error?.response?.data)
        const errorMessage = error?.response?.data?.message || "Sesión expirada, por favor inicie sesión nuevamente ❌";
        toast.error(errorMessage);
      }else if (error?.response?.status === 400) {
        console.log('Error 401: Sesión expirada', error?.response?.data)
        const errorMessage = error?.response?.data?.message || "Sesión expirada, por favor inicie sesión nuevamente ❌";
        toast.error(errorMessage);
      }

      return Promise.reject({ statusCode: error?.response?.status || 404, message: error?.response?.data?.message || 'Error en la conexión', ...error?.response?.data })
    }
  )

  return axiosInstance;
}