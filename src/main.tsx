import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@fontsource-variable/big-shoulders-display/wght";
import "@fontsource/barlow/latin-400";
import "@fontsource/barlow/latin-500";
import "@fontsource/barlow/latin-600";
import "@fontsource/barlow/latin-700";
import "./styles/global.css";

import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
