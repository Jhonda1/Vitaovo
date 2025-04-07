import { Login } from "@/auth/page/Login";
import { Toaster } from "@/components/ui/sonner";
import { Home } from "@/home/page/Home";
import { useAuthStore } from "@/store/useAuthStore";
import { JSX } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";


const PrivateRoute = ({ component: Component }: { component: JSX.Element }) => {
  const isLogin = useAuthStore((state) => state.isLogged);
  return isLogin ? Component : <Navigate to="/" />;
};

export const AppRouter = () => {
  return (
    <div className="w-full h-screen">
      <BrowserRouter basename="/vitaovo">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="home" element={<PrivateRoute component={<Home />} />} />
          <Route path="*" element={<h1>Not found page que trist</h1>} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
};