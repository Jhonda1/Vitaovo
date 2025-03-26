import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRouter } from "./routes/index.tsx"; // Ensure the file exports AppRouter as a named export


import "./index.css";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
);
