import React, { useEffect } from "react";
import { cn } from "@/lib/utils";

interface AlertProps {
  title: string; // Título de la alerta
  description: string; // Descripción o mensaje de la alerta
  type: "success" | "error"; // Tipo de alerta (éxito o error)
  isOpen: boolean; // Estado para controlar si la alerta está visible
  onClose: () => void; // Función para cerrar la alerta
  duration?: number; // Duración en milisegundos antes de que la alerta desaparezca automáticamente
}

export const Alert: React.FC<AlertProps> = ({
  title,
  description,
  type,
  isOpen,
  onClose,
  duration = 1000, // Valor por defecto de 1 segundo
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose(); // Llama a la función para cerrar la alerta después del tiempo especificado
      }, duration);

      return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta o cambia
    }
  }, [isOpen, onClose, duration]);

  if (!isOpen) return null; // No renderiza nada si la alerta no está abierta

  return (
    <div
      className={cn(
      "fixed bottom-4 right-4 z-50 p-4 rounded-md shadow-lg",
      type === "success" ? "bg-green-100 border border-green-500" : "bg-red-100 border border-red-500"
      )}
    >
      <div className="flex items-start">
      <div className="flex-1">
        <h4 className={cn("font-bold", type === "success" ? "text-green-700" : "text-red-700")}>
        {title}
        </h4>
        <p className="text-sm text-gray-700">{description}</p>
      </div>
      </div>
    </div>
  );
};