import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatNumber = (number: number) => {
  const numberFormated = Number(number)
  if(isNaN(numberFormated)){
    return 0;
  }
  const formated =  numberFormated.toLocaleString("es-CO",{style: "decimal", minimumFractionDigits: 0, maximumFractionDigits: 2})
  return formated;
}
