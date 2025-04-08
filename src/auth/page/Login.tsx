import { FormEnterprise } from "../components/FormEnterprise";
import LogoVitaovo from '../../assets/Prosof.png';
import { useAuthStore } from "@/store/useAuthStore";
import { FormUser } from "../components/FormUser";
import { Navigate } from "react-router";
export const Login = () => {
  const nitStore  = useAuthStore(state => state.nit);
  const isLogin = useAuthStore((state) => state.isLogged);
  if (isLogin) return <Navigate to="Home" />;

  return (
    <div className="w-full h-full flex items-center justify-center ">
      <div className="grid grid-cols-1 md:grid-cols-3 w-full h-full ">
        <div className="bg-gradient-to-tl from-[#dcf6b5]  to-[#d9e5c6] col-span-1 hidden md:flex items-center justify-center">
          <img src={LogoVitaovo} className="object-cover h-[10%]  sm:h-[5%] lg:h-[10%] "/>
        </div>
        <div className="col-span-3 md:col-span-2 flex items-center justify-center  mx-4">
          {
            nitStore === '' ? <FormEnterprise /> : <FormUser />
          }
        </div>
      </div>
    </div>
  );
};
