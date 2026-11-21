import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// Întâi stilurile globale, apoi componentele: așa regulile din *.module.css
// au prioritate față de cele globale, la aceeași specificitate.
import "./index.css";
import App from "./App.jsx";
import LimbaProvider from "./i18n/LimbaProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <LimbaProvider>
        <App />
      </LimbaProvider>
    </BrowserRouter>
  </StrictMode>
);
