import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { itemsSidebarMenu } from "@/constants/enums";
import { useSidebarMenu } from "@/hooks/useSidebarMenu";
import { useSidebarMenuStore } from "@/store/useSidebarMenuStore";
import LogoVitaovo from "../../assets/Logo.png";
import { NavUserSidebar } from "./NavUserSidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { sideBarMenu } = useSidebarMenu();
  const currentMenuDisplayed = useSidebarMenuStore(
    (state) => state.currentMenu
  );
  const setNewSidebarMenu = useSidebarMenuStore(
    (state) => state.setCurrentSidebarMenu
  );
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white shadow text-sidebar-primary-foreground">
                <img src={LogoVitaovo} alt="logo" className="size-6" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Vitaovo</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {Object.entries(sideBarMenu).map(([key, menu]) => {
                return (
                  <SidebarMenuItem key={menu.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={currentMenuDisplayed === key}
                      onClick={() => setNewSidebarMenu(key as itemsSidebarMenu)}
                    >
                      <div className="flex-row">
                        <menu.Icon
                          width={40}
                          color="var(--sidebar-primary)"
                        />
                        <span>{menu.title}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUserSidebar />
      </SidebarFooter>
    </Sidebar>
  );
}
