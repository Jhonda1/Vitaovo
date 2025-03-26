import { PasswordIcon, UserLoginIcon } from "@/components/icon";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Button } from "@/components/ui/button";
import LogoVitaovo from '../../assets/Logo.png';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/useAuthStore";
import * as motion from "motion/react-client";
import { useState } from "react";
import { useNavigate } from "react-router";

export const FormUser = () => {
  /* GLOBAL STATE */
  const removeNitStore = useAuthStore((state) => state.removeNit);
  const onLoginUserStore = useAuthStore((state) => state.onLoginUser);

  /* LOCAL STATE */
  const [loginData, setLoginData] = useState<{ user: string; password: string }>({ user: '', password: '' });
  
  
  
  const navigate = useNavigate();





  function validateUser() {
    console.log("validateUser");
    if(loginData.user != null && loginData.user.length > 0 && loginData.password != null && loginData.password.length > 0){
      console.log('user', loginData.user);
      onLoginUserStore('Prosof ', '1', 'token bearer');
      navigate('/home');
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: 0.2,
        ease: [0, 0.71, 0.2, 1.01],
      }}
    >
      <Card className="w-[350px] h-[350px] relative overflow-hidden">
        <CardHeader>
            <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-primary flex flex-col items-center">
              <img
              src={LogoVitaovo}
              alt="Logo"
              className="object-cover h-[10%] lg:h-[15%] w-15 h-15 md:hidden"
              />
              Ingresa tu Cuenta
            </CardTitle>
            </div>
        </CardHeader>
        <CardContent className="my-auto">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="user" className="text-slate-700">
                <UserLoginIcon />
                Usuario
              </Label>
              <Input id="user" value={loginData.user} onChange={(e)=> setLoginData((prevState)=>({...prevState,user:e.target.value}))}/>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password" className="text-slate-700">
                <PasswordIcon />
                Contraseña
              </Label>
              <Input id="password" value={loginData.password} onChange={(e)=> setLoginData((prevState)=>({...prevState,password:e.target.value}))}/>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="secondary"
            className="w-2/5"
            onClick={removeNitStore}
          >
            Regresar
          </Button>
          <Button className="w-2/5" variant="secondary" onClick={validateUser}>Acceder</Button>
        </CardFooter>
        <BorderBeam
          duration={8}
          size={100}
          className="from-transparent via-green-500 to-transparent"
        />
      </Card>
    </motion.div>
  );
};
