import { PasswordIcon, UserLoginIcon } from "@/components/icon";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Button } from "@/components/ui/button";
import LogoVitaovo from '../../assets/Logo.png';
import LogoProsof from '../../assets/Prosof.png';
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
import { useApi } from "@/hooks/useApiService";
import { toast } from 'sonner';
import { LoadingSpinner } from "@/components/LoadingSpinner";


export const FormUser = () => {
  /* GLOBAL STATE */
  const removeNitStore = useAuthStore((state) => state.removeNit);
  const onLoginUserStore = useAuthStore((state) => state.onLoginUser);
  const { apiService } = useApi();
  
  /* LOCAL STATE */
  const [loginData, setLoginData] = useState<{ user: string; password: string }>({ user: '', password: '' });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function validateUser() {
    if (loginData.user && loginData.password) {
      setLoading(true);
      try {
        const response = await apiService.post("/login", { user: loginData.user, password: loginData.password, usuarios: true });
        if (response.data && response.data.success) {
          const user = response.data.user;
          const token = response.data.token;
          onLoginUserStore(user.name, user.id, token);
          navigate('/home');
        } 
      } catch (error) {
        setLoading(false);
      }
    } else {
      setLoading(false);
      toast.info('Por favor, complete todos los campos');
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
      <LoadingSpinner 
        loading={loading} 
        type="bounce" 
        size={55} 
      />
      <Card className="w-[350px] h-[370px] relative overflow-hidden">
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
              <Input type="text" id="user" value={loginData.user} onChange={(e)=> setLoginData((prevState)=>({...prevState,user:e.target.value}))}/>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password" className="text-slate-700">
              <PasswordIcon />
              Contraseña
              </Label>
              <Input
              id="password"
              type="password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData((prevState) => ({
                ...prevState,
                password: e.target.value,
                }))
              }
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            
            className="w-2/5"
            onClick={removeNitStore}
          >
            Regresar
          </Button>
          <Button className="w-2/5"  onClick={validateUser}>Acceder</Button>
        </CardFooter>
        <div className="text-center text-xs text-gray-500 mt-2">
            Servicio al Cliente (606) 3151720 - Movil 320 632 1074<br />
            Copyright (c) By Prosof S.A.S
          </div>
        <BorderBeam
          duration={8}
          size={100}
          className="from-transparent via-green-500 to-transparent"
        />
      </Card>
    </motion.div>
  );
};
