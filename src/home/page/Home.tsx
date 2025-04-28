import { SidebarProvider } from "@/components/ui/sidebar";
import { WrapperHomePages } from "../components/WrapperHomePages";
import { useSidebarMenu } from "@/hooks/useSidebarMenu";

export const Home = () => {
  const { ComponentMenu } = useSidebarMenu();
  return (
    <SidebarProvider>
      <WrapperHomePages>
        <ComponentMenu />
      </WrapperHomePages>
    </SidebarProvider>
  );
};
