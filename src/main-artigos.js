import "@fontsource-variable/dm-sans";
import "@fontsource/dm-serif-text/latin-400.css";
import "./styles/tokens.css";
import "./styles/artigos.css";
import "./styles/editorial-pages-v3.css";
import "./styles/catalogos-v4.css";

import "./styles/site-raiz-caminho.css";

import "./styles/layout-shell-v5.css";

import "./styles/artigos-leitura-v5.css";
import "./styles/artigos-guias-v6.css";
import "./styles/artigos-template-v7.css";
import { iniciarCompartilhamentoArtigo } from "./features/artigos/compartilharArtigo.js";
import { iniciarIndiceAtivo } from "./features/artigos/indiceAtivo.js";

if (document.querySelector(".sq-article")) {
  iniciarIndiceAtivo();
  iniciarCompartilhamentoArtigo();
}
