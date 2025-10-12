import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.tw.css";
import App from "./app.tsx";
import { ToastProvider } from "./components/toast.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>
);