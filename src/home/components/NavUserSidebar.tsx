import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent,  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, } from "@/components/ui/sidebar";
import { ChevronsUpDown, LogOut } from "lucide-react";
import UserLogged from '../../assets/Logo.png';
import LogoProsof from '../../assets/Favicon.png';
import { useAuthStore } from "@/store/useAuthStore";
import { useSidebar } from "@/hooks/use-sidebar";
import { useNavigate } from "react-router";
import { useState } from "react";
import { ApiConfigDialog } from "@/components/ApiConfigDialog"; // Importa el componente ApiConfigDialog
// import { ConfigurationGear } from "@/components/icon"


export function NavUserSidebar(){
  const  userName =  useAuthStore((state)=> state.userName)
  const { isMobile } = useSidebar()
  const [showConfigDialog, setShowConfigDialog] = useState(false); // Estado para mostrar el diálogo
  const [apiUrl, setApiUrl] = useState<string>(localStorage.getItem("urlApi") || import.meta.env.VITE_URLAPI || ""); // URL inicial
  const [contingencyUrl, setContingencyUrl] = useState<string>(""); // URL de contingencia
  const [useContingency, setUseContingency] = useState<boolean>(false); // Check de contingencia
  const navigate = useNavigate();

  const handleSaveConfig = (newApiUrl: string, newContingencyUrl: string, newUseContingency: boolean) => {
    setApiUrl(newApiUrl);
    setContingencyUrl(newContingencyUrl);
    setUseContingency(newUseContingency);

    // Guardar en localStorage
    const urlToSave = newUseContingency ? newContingencyUrl : newApiUrl;
    localStorage.setItem("urlApi", urlToSave);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={LogoProsof} alt={userName || 'user'} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{userName}</span>
                
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={UserLogged} alt={userName || 'user'} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{userName}</span>
                  
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem
              onClick={() => setShowConfigDialog(true)} // Abre el diálogo de configuración
            >
              <ConfigurationGear />
              Configuración
            </DropdownMenuItem> */}
            <DropdownMenuItem
              onClick={() => {
              useAuthStore.getState().onLogout(); // Assuming logout is a method in your auth store
                navigate("/"); // Redirect to the homepage
              }}
            >
              <LogOut />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
          <div className="mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              V {import.meta.env.VITE_VERSION || "1.0.0"}
            </span>
          </div>
        </DropdownMenu>
        {/* Dialog de configuración */}
        <ApiConfigDialog
          open={showConfigDialog}
          onClose={() => setShowConfigDialog(false)}
          initialApiUrl={apiUrl}
          initialContingencyUrl={contingencyUrl}
          initialUseContingency={useContingency}
          onSave={handleSaveConfig}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  )
}