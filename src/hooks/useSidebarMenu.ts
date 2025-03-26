import { ReportDailyIcon, ClasificationProductIcon } from "@/components/icon"
import { itemsSidebarMenu } from "../constants/enums"
import { ReportDaily } from "../home/page/menu/ReportDayli"
import { ClasificationProduct } from "../home/page/menu/ClasificationProduct"
import { useSidebarMenuStore } from "@/store/useSidebarMenuStore"

const sideBarMenu = {
  [itemsSidebarMenu.ReportDaily]: {
    Component: ReportDaily,
    title: 'Reporte diario',
    Icon: ReportDailyIcon
  },
  [itemsSidebarMenu.ClasificationProduct]: {
    Component: ClasificationProduct,
    title: 'Clasificacion de productos',
    Icon: ClasificationProductIcon
  }
}
export function useSidebarMenu(){
  const currentMenu =  useSidebarMenuStore((state)=> state.currentMenu)
  const ComponentMenu = sideBarMenu[currentMenu as itemsSidebarMenu].Component
  return {
    currentMenu,
    ComponentMenu,
    sideBarMenu
  }
}