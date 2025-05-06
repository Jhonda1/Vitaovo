import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useApi } from "@/hooks/useApiService";
import { AxiosResponse } from "axios";
import { FormUser } from "./FormUser";
import { ApiConfigDialog } from "@/components/ApiConfigDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CompanyIcon } from "@/components/icon";
import { BorderBeam } from "@/components/magicui/border-beam";
import * as motion from "motion/react-client";

export const FormEnterprise = () => {
  const [nit, setNit] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isNitValid, setIsNitValid] = useState<boolean>(false);
  const [showConfigDialog, setShowConfigDialog] = useState<boolean>(false);
  const [apiUrl, setApiUrl] = useState<string>(import.meta.env.VITE_URLAPI || "");
  const [contingencyUrl, setContingencyUrl] = useState<string>("");
  const [useContingency, setUseContingency] = useState<boolean>(false);

  const updateNit = useAuthStore((state) => state.updateNit);
  const updateurlApi = useAuthStore((state) => state.updateurlApi);
  const updateConf = useAuthStore((state) => state.updateConf);
  const { apiService } = useApi();

  let clickTimer: NodeJS.Timeout;

  // Verificar si el NIT ya está en localStorage al cargar el componente
  useEffect(() => {
    const storedNit = localStorage.getItem("nit");
    const storedApiUrl = localStorage.getItem("urlApi");

    if (storedNit) {
      setNit(storedNit);
      setIsNitValid(true); // Redirige automáticamente al formulario de usuario
      updateNit(storedNit);
      if (storedApiUrl) {
        updateurlApi(storedApiUrl);
      }
    }
  }, [updateNit, updateurlApi]);

  async function validateNit() {
    if (nit != null && nit.length > 0) {
      const appName = import.meta.env.VITE_APP_NAME;

      setLoading(true);
      setError(null);
      try {
        const response = await apiService.post("/auth", { NIT: nit, APPNAME: appName });
        const { data, status } = response as AxiosResponse;

        if (status === 200) {
          updateNit(nit);
          updateurlApi(useContingency ? contingencyUrl : apiUrl);
          updateConf(data.db_config);
          setIsNitValid(true);

          // Guardar NIT y URL en localStorage
          localStorage.setItem("nit", nit);
          localStorage.setItem("urlApi", useContingency ? contingencyUrl : apiUrl);
        } else {
          setError("El NIT ingresado no existe.");
        }
      } catch (err) {
        console.error("Error al validar el NIT:", err);
        setError("Ocurrió un error al validar el NIT. Inténtalo nuevamente.");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Por favor, ingresa un NIT válido.");
    }
  }

  const handleSaveConfig = (newApiUrl: string, newContingencyUrl: string, newUseContingency: boolean) => {
    setApiUrl(newApiUrl);
    setContingencyUrl(newContingencyUrl);
    setUseContingency(newUseContingency);

    // Guardar en localStorage
    const urlToSave = newUseContingency ? newContingencyUrl : newApiUrl;
    localStorage.setItem("urlApi", urlToSave);
  };

  if (isNitValid) {
    return <FormUser />;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
          ease: [0, 0.71, 0.2, 1.01],
        }}
      >
        <Card className="relative w-[350px] h-[370px] overflow-hidden">
          <CardHeader>
            <CardTitle
              className="text-2xl font-bold text-primary"
              onMouseDown={() => {
                clickTimer = setTimeout(() => setShowConfigDialog(true), 2000);
              }}
              onMouseUp={() => clearTimeout(clickTimer)}
            >
              Login
            </CardTitle>
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
                  disabled={loading}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center items-center">
            <Button
              className="w-4/6 m-0 p-0"
              onClick={validateNit}
              disabled={loading}
            >
              {loading ? "Validando..." : "Ingresar"}
            </Button>
          </CardFooter>
          <div className="text-center text-xs text-gray-500 mt-2">
            Servicio al Cliente (606) 3151720 - Movil 320 632 1074
            <br />
            Copyright (c) By Prosof S.A.S
          </div>
          <BorderBeam duration={8} size={100} className="from-transparent via-green-500 to-transparent" />
        </Card>
      </motion.div>

      <ApiConfigDialog
        open={showConfigDialog}
        onClose={() => setShowConfigDialog(false)}
        initialApiUrl={apiUrl}
        initialContingencyUrl={contingencyUrl}
        initialUseContingency={useContingency}
        onSave={handleSaveConfig}
      />
    </>
  );
};