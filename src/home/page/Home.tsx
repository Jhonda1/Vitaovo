import { WrapperHomePages } from "../components/WrapperHomePages";
import { useSidebarMenu } from "@/hooks/useSidebarMenu";
import Prosof from "@/assets/prosof.png";


export const Home = () => {
  const {ComponentMenu} = useSidebarMenu()
  return (
    <WrapperHomePages>
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-60%, -60%)',
          opacity: 0.1,
          zIndex: 0,
          pointerEvents: 'none'
        }}>
          <img src={Prosof} alt="Prosof" />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <ComponentMenu />
        </div>
      </div>
    </WrapperHomePages>
  );
};