import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useSidebarMenuStore } from "@/store/useSidebarMenuStore";
import { useSidebarMenu } from "@/hooks/useSidebarMenu";
import { itemsSidebarMenu } from "@/constants/enums";
import { useSidebar } from "@/hooks/use-sidebar";

export function WrapperHomePages({ children }: { children: React.ReactNode }) {
  const currentMenu = useSidebarMenuStore((state) => state.currentMenu);
  const { sideBarMenu } = useSidebarMenu();
  const dataMenu = sideBarMenu[currentMenu as itemsSidebarMenu];
  const { open, isMobile } = useSidebar();
  return (
    <>
      <AppSidebar />

      <main className="w-full p-0 m-0">
        <header className="flex h-[2rem] shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-8">
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
        <div className={`px-1 h-[calc(100vh-2rem)] ${
            isMobile
              ? "w-full"
              : open
              ? "w-[calc(100vw-16rem)]"
              : "w-[calc(100vw-4rem)]"
          }`}>
          {children}
        </div>
      </main>
    </>
  );
}
