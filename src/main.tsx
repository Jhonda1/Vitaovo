import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRouter } from "./routes/index.tsx"; // Ensure the file exports AppRouter as a named export


import "./index.css";
import { ThemeProvider } from "./components/ThemeProvider.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AppRouter />
    </ThemeProvider>
  </StrictMode>
);
