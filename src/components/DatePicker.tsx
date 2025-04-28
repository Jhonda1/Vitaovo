import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Label } from "@/components/ui/label"; // Importa el componente Label

interface DatePickerProps {
  selectedDate?: Date;
  onDateChange: (date: Date | undefined) => void;
  label?: string; // Nuevo prop para el texto del label
  mode?: "single" | "range"
}

export const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onDateChange, label,mode='single' }) => {
  const [date, setDate] = useState<Date | undefined>(selectedDate || new Date()); // Estado para manejar la fecha seleccionada
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar el Popover

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    onDateChange(newDate);
    setIsOpen(false); // Cierra el Popover al seleccionar una fecha
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <Label htmlFor="date">{label}</Label>} {/* Renderiza el Label si se proporciona */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {mode =='single' &&( 
              date  
                ? format(date, "PPP", { locale: es }) 
                :  <span>Selecciona una fecha</span>
              )
            }

            {mode=='range' &&( 
              date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "yyyy-MM-dd")} -{" "}
                    {format(date.to, "yyyy-MM-dd")}
                  </>
                ) : (
                  format(date.from, "yyyy-MM-dd")
                )
              ) : (
                <span>Selecciona una fecha</span>
              ))
            }
            
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode={mode}
            defaultMonth = {date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonth={mode == 'single' ? 1 : 2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};