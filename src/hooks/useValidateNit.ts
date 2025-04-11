import { useAuthStore } from "@/store/useAuthStore";
import { useApi } from "@/hooks/useApiService";
import { AxiosResponse } from "axios";

export const useValidateNit = () => {
  const updateNit = useAuthStore((state) => state.updateNit);
  const updateConf = useAuthStore((state) => state.updateConf);
  const { apiService } = useApi();

  const validateNit = async (nit: string): Promise<{ success: boolean; error?: string }> => {
    if (!nit || nit.trim() === "") {
      return { success: false, error: "Por favor, ingresa un NIT válido." };
    }

    try {
      const appName = import.meta.env.VITE_APP_NAME;
      const response = await apiService.post("/auth", { NIT: nit, APPNAME: appName });
      const { data, status } = response as AxiosResponse;

      if (status === 200) {
        updateNit(nit); // Actualiza el NIT en el estado global
        updateConf(data.db_config); // Actualiza la configuración de la base de datos
        return { success: true };
      } else {
        return { success: false, error: "El NIT ingresado no existe." };
      }
    } catch (error) {
      console.error("Error al validar el NIT:", error);
      return { success: false, error: "Ocurrió un error al validar el NIT. Inténtalo nuevamente." };
    }
  };

  return { validateNit };
};