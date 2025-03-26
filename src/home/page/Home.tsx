import { WrapperHomePages } from "../components/WrapperHomePages";
import { useSidebarMenu } from "@/hooks/useSidebarMenu";

export const Home = () => {
  const {ComponentMenu} = useSidebarMenu()
  return (
    <WrapperHomePages>
      <ComponentMenu/>
    </WrapperHomePages>
  );
};