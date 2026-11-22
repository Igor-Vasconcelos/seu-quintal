import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/dm-sans";
import "@fontsource/dm-serif-text/latin-400.css";
import "@fontsource/dm-serif-text/latin-400-italic.css";
import App from "./App.jsx";
import "./styles/tokens.css";
import "./styles/home.css";
import "./styles/editorial.css";
import "./styles/editorial-mockup.css";
import "./styles/home-editorial-v2.css";
import "./styles/guias-cultivo.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

import "./styles/tool-ui-v3.css";

import "./styles/site-raiz-caminho.css";

import "./styles/layout-shell-v5.css";

import "./styles/nav-icons-v2.css";
