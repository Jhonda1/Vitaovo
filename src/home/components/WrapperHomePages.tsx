import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useSidebarMenuStore } from "@/store/useSidebarMenuStore";
import { useSidebarMenu } from "@/hooks/useSidebarMenu";
import { itemsSidebarMenu } from "@/constants/enums";

export function WrapperHomePages({ children }: { children: React.ReactNode }) {
  const currentMenu =  useSidebarMenuStore((state)=> state.currentMenu)
  const { sideBarMenu } = useSidebarMenu();
  const dataMenu =  sideBarMenu[currentMenu as itemsSidebarMenu]
  return (
    <SidebarProvider>
      <AppSidebar />
      
        <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{dataMenu.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-12 flex-col gap-4 p-4 pt-0 ">
          {children}
        </div>
      </SidebarInset>
      
    </SidebarProvider>
  );
}
