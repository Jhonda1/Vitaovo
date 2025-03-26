import { Login } from "@/auth/page/Login";
import { Home } from "@/home/page/Home";
import { BrowserRouter, Routes, Route } from "react-router";

export const AppRouter = () => {
  return (
    <div className="w-full h-screen">
      <BrowserRouter basename="/vitaovo">
        <Routes>
          {/* <Route path="/" element={<PrivateRoute component={WrappedCalendarPage }/>} /> */}
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<h1>Not found page que trist</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}