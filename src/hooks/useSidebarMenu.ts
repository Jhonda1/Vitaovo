import { ReportDailyIcon, ClasificationProductIcon, ReportListIcon } from "@/components/icon"
import { itemsSidebarMenu } from "../constants/enums"
import { ReportDaily } from "../home/page/menu/ReportDaily"
import { ClasificationProduct } from "../home/page/menu/ClasificationProduct"
import { useSidebarMenuStore } from "@/store/useSidebarMenuStore"
import { ListReport } from "@/home/page/menu/ListReport"

const sideBarMenu = {
  [itemsSidebarMenu.ReportDaily]: {
    Component: ReportDaily,
    title: 'Reporte diario',
    Icon: ReportDailyIcon
  },
  [itemsSidebarMenu.ClasificationProduct]: {
    Component: ClasificationProduct,
    title: 'Clasificación de productos',
    Icon: ClasificationProductIcon
  },
  [itemsSidebarMenu.ListReport]: {
    Component: ListReport,
    title: 'Listado Reportes',
    Icon: ReportListIcon
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