import { CompanyIcon } from "@/components/icon";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import * as motion from "motion/react-client";
import { useApi} from "@/hooks/useApiService";

export const FormEnterprise = () => {
  const [nit, setNit] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false); // Estado para manejar el loading
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores
  const updateNit = useAuthStore((state) => state.updateNit);
  const updateConf = useAuthStore((state) => state.updateConf);
  const { apiService } = useApi();
  
  // console.log(apiService)

  async function validateNit() {
    if (nit != null && nit.length > 0) {
      const appName = import.meta.env.VITE_APP_NAME;
      
      setLoading(true);
      setError(null); // Limpia errores previos
      try {
        // Realiza la petición a la API
        const response = await apiService.post("/auth", { NIT: nit, APPNAME: appName });        
        if (response.data.success) {
          // Si el NIT existe, actualiza el estado global          
          updateNit(nit);
          updateConf(response.data.db_config);
          // console.log("NIT válido");
        } else {
          // Si el NIT no existe, muestra un mensaje de error
          setError("El NIT ingresado no existe.");
        }
      } catch (err) {
        console.error("Error al validar el NIT:", err);
        setError("Ocurrió un error al validar el NIT. Inténtalo nuevamente.");
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    } else {
      setError("Por favor, ingresa un NIT válido.");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: 0.2,
        ease: [0, 0.71, 0.2, 1.01],
      }}
    >
      <Card className="relative w-[350px] h-[350px] overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Login</CardTitle>
        </CardHeader>
        <CardContent className="my-auto">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="nit" className="text-slate-700">
                <CompanyIcon width={20} />
                Nit
              </Label>
              <Input
                id="nit"
                placeholder="Ingrese el número de NIT"
                onChange={(e) => setNit(e.target.value)}
                value={nit}
                disabled={loading} // Deshabilita el input mientras se realiza la petición
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>} {/* Muestra el mensaje de error */}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center items-center">
          <Button
            className="w-4/6 m-0 p-0"
            variant="secondary"
            onClick={validateNit}
            disabled={loading} // Deshabilita el botón mientras se realiza la petición
          >
            {loading ? "Validando..." : "Ingresar"} {/* Cambia el texto del botón mientras carga */}
          </Button>
        </CardFooter>
        <BorderBeam duration={8} size={100} className="from-transparent via-green-500 to-transparent" />
      </Card>
    </motion.div>
  );
};
