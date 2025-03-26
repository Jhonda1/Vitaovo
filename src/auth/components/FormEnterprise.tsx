import { CompanyIcon } from "@/components/icon";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Button } from "@/components/ui/button";
import { Card, CardContent,  CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import * as motion from "motion/react-client";

export const FormEnterprise = () => {
  const [nit, setNit] = useState<string>('');
  const updateNit = useAuthStore(state => state.updateNit);
  async function validateNit (){
    if(nit != null && nit.length > 0){
      console.log('nit', nit);
      updateNit(nit);
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
    <Card className="relative w-[350px] h-[350px] overflow-hidden">
      <CardHeader >
        <CardTitle className="text-2xl font-bold text-primary">Login</CardTitle>
      </CardHeader>
      <CardContent className="my-auto">
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="nit" className="text-slate-700"><CompanyIcon width={20}/>Nit</Label>
            <Input id="nit" placeholder="Ingrese el número de NIT" onChange={(e) => setNit(e.target.value)} value={nit} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center items-center   ">
        <Button className="w-4/6 m-0 p-0" variant="secondary" onClick={validateNit}>Ingresar</Button>
        
        
      </CardFooter>
      <BorderBeam duration={8} size={100}  className="from-transparent via-green-500 to-transparent"/>
      
    </Card>
    </motion.div>
  );
};
