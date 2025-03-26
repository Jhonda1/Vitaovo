import { FormEnterprise } from "../components/FormEnterprise";
import LogoVitaovo from '../../assets/Logo.png';
import { useAuthStore } from "@/store/useAuthStore";
import { FormUser } from "../components/FormUser";
export const Login = () => {
  const nitStore  = useAuthStore(state => state.nit);
  return (
    <div className="w-full h-full flex items-center justify-center ">
      <div className="grid grid-cols-1 md:grid-cols-3 w-full h-full ">
        <div className="bg-gradient-to-tl from-[#dcf6b5] via-[#92BD4E] to-[#d9e5c6] col-span-1 hidden md:flex items-center justify-center">
          <img src={LogoVitaovo} className="object-cover h-[10%] lg:h-[15%]"/>
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
