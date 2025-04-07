import { useState, useEffect } from "react";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = user?.token;
    setIsAuthenticated(!!token);
  }, []);

  return { isAuthenticated };
};
