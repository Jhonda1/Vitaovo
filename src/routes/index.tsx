import { Login } from "@/auth/page/Login";
import { Toaster } from "@/components/ui/sonner";
import { Home } from "@/home/page/Home";
import { useAuthStore } from "@/store/useAuthStore";
import { CircleCheck, CircleX } from "lucide-react";
import { JSX } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";


const PrivateRoute = ({ component: Component }: { component: JSX.Element }) => {
  const isLogin = useAuthStore((state) => state.isLogged);
  return isLogin ? Component : <Navigate to="/" />;
};

export const AppRouter = () => {
  const RutaFront = '/'+import.meta.env.VITE_RUTA_FRONT;
  return (
    <div className="w-full h-screen overflow-hidden">
      <BrowserRouter basename={RutaFront}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="home" element={<PrivateRoute component={<Home />} />} />
          <Route path="*" element={<h1>Not found page que trist</h1>} />
        </Routes>
      </BrowserRouter>
      <Toaster 
        icons ={{
          error: <CircleX color="red"/>,
          success: <CircleCheck color="green" />,
        }}
      />
    </div>
  );
};