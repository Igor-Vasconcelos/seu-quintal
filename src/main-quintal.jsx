import { createRoot } from "react-dom/client";
import "@fontsource-variable/dm-sans";
import "@fontsource/dm-serif-text/latin-400.css";
import "@fontsource/dm-serif-text/latin-400-italic.css";
import MeuQuintal from "./features/quintal/MeuQuintal.jsx";
import "./styles/tokens.css";
import "./styles/home.css";
import "./styles/editorial.css";
import "./styles/guias-cultivo.css";
import "./styles/planejador.css";
import "./styles/meu-quintal.css";

createRoot(document.getElementById("quintal-raiz")).render(
  <MeuQuintal />,
);

import "./styles/tool-ui-v3.css";
