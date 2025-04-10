import { itemsSidebarMenu } from '@/constants/enums'
import { create } from 'zustand'

interface State {
  currentMenu: string,
  itemsSidebarMenu: itemsSidebarMenu[]
}

interface Action{
  setCurrentSidebarMenu: (sideBarMenuname:itemsSidebarMenu) => void
}

export const useSidebarMenuStore = create<State & Action>((set) => ({
  currentMenu: itemsSidebarMenu.ReportDaily,
  itemsSidebarMenu: Object.values(itemsSidebarMenu),
  setCurrentSidebarMenu: (sideBarMenuname:itemsSidebarMenu) => {
    set({ currentMenu: sideBarMenuname })
  }
}));
