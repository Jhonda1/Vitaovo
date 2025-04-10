import { create } from 'zustand'

interface State {
  nit: string,
  conf: string,
  isLogged: boolean
  userName: string| null
  userId: string | null
  token: string | null
}

interface Action{
  updateNit: (nit:string) => void
  updateConf: (conf:string) => void
  removeNit: () => void
  onLoginUser: (userName: string, userId: string, token: string) => void
  onLogout: () => void
}
const userDataParsed = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null
export const useAuthStore = create<State & Action>((set) => ({
  nit: localStorage.getItem('nit') || '',
  conf: localStorage.getItem('conf') || '',
  isLogged: userDataParsed?.token ? true : false,
  userName: userDataParsed?.userName || null,
  userId: userDataParsed?.userId || null,
  token: userDataParsed?.token || null,

  updateNit: (nit:string) => {
    localStorage.setItem('nit', nit)
    set({ nit })
  },
  updateConf: (conf:string) => {
    localStorage.setItem('conf', JSON.stringify(conf))
    set({ conf })

  },
  removeNit: () => {
    localStorage.clear()
    set({ nit: '' })
  },
  onLoginUser: (userName, userId, token) => {
    localStorage.setItem('user', JSON.stringify({ userName, userId, token }))
    set({ userName, userId, token, isLogged: true })
  },
  onLogout: () => {
    set({ userName: null, userId: null, token: null, isLogged: false, nit: '', conf: '' });
  
    // Elimina las claves específicas de localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('nit');
    localStorage.removeItem('conf');
  }

}));
