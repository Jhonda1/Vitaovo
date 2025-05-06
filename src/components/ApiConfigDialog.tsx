import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ApiConfigDialogProps {
  open: boolean;
  onClose: () => void;
  initialApiUrl: string;
  initialContingencyUrl: string;
  initialUseContingency: boolean;
  onSave: (apiUrl: string, contingencyUrl: string, useContingency: boolean) => void;
}

export const ApiConfigDialog: React.FC<ApiConfigDialogProps> = ({
  open,
  onClose,
  initialApiUrl,
  initialContingencyUrl,
  initialUseContingency,
  onSave,
}) => {
  const [apiUrl, setApiUrl] = useState<string>(initialApiUrl);
  const [contingencyUrl, setContingencyUrl] = useState<string>(initialContingencyUrl);
  const [useContingency, setUseContingency] = useState<boolean>(initialUseContingency);

  const handleSave = () => {
    if (useContingency && !contingencyUrl.trim()) {
      alert("Por favor, ingresa una URL de contingencia válida.");
      return;
    }

    onSave(apiUrl, contingencyUrl, useContingency);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configuración de la API</DialogTitle>
          <DialogDescription>
            Configura la URL de la API y selecciona si deseas usar una URL de contingencia.
          </DialogDescription>
        </DialogHeader>
        <div className="mb-4">
          <Label htmlFor="apiUrl">URL de la API</Label>
          <Input
            id="apiUrl"
            placeholder="Ingrese la URL de la API"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="contingencyUrl">URL de Contingencia</Label>
          <Input
            id="contingencyUrl"
            placeholder="Ingrese la URL de contingencia"
            value={contingencyUrl}
            onChange={(e) => setContingencyUrl(e.target.value)}
          />
        </div>
        <div className="flex items-center mb-4">
          <Switch
            id="useContingency"
            checked={useContingency}
            onCheckedChange={setUseContingency}
          />
          <Label htmlFor="useContingency" className="ml-2">
            Usar URL de contingencia
          </Label>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Guardar</Button>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};