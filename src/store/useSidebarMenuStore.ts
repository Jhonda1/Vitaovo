import { itemsSidebarMenu } from '@/constants/enums'
import { create } from 'zustand'

interface State {
  currentMenu: string,
  itemsSidebarMenu: itemsSidebarMenu[]
}

interface Action{
  setCurrentSidebarMenu: (sideBarMenuname:itemsSidebarMenu) => void
  /* removeNit: () => void
  onLoginUser: (userName: string, userId: string, token: string) => void
  onLogout: () => void */
}

export const useSidebarMenuStore = create<State & Action>((set) => ({
  currentMenu: itemsSidebarMenu.ReportDaily,
  itemsSidebarMenu: Object.values(itemsSidebarMenu),
  setCurrentSidebarMenu: (sideBarMenuname:itemsSidebarMenu) => {
    set({ currentMenu: sideBarMenuname })
  }
  /* updateNit: (nit:string) => {
    localStorage.setItem('nit', nit)
    set({ nit })
  },
  removeNit: () => {
    localStorage.removeItem('nit')
    set({ nit: '' })
  },
  onLoginUser: (userName, userId, token) => {
    set({ userName, userId, token, isLogged: true })
  },
  onLogout: () => {
    set({ userName: null, userId: null, token: null, isLogged: false })
  } */

}));
