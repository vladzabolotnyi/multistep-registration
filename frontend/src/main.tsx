import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { RegistrationPage } from "./pages/RegistrationPage.tsx";

// TODO: Add router and lazy loading of page component
//
// TODO: Remove Strict Mode after development

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RegistrationPage />
  </StrictMode>,
);
