import { createRoot } from "react-dom/client";
import "@fontsource-variable/dm-sans";
import "@fontsource/dm-serif-text/latin-400.css";
import Cabecalho from "./components/Cabecalho.jsx";
import Rodape from "./components/Rodape.jsx";
import "./styles/tokens.css";
import "./styles/home.css";
import "./styles/guias-cultivo.css";
import "./styles/conteudo.css";

const { raiz, pagina } = document.body.dataset;

createRoot(document.getElementById("cabecalho")).render(<Cabecalho raiz={raiz} pagina={pagina} />);
createRoot(document.getElementById("rodape")).render(<Rodape raiz={raiz} pagina={pagina} />);

const horta = document.getElementById("guia-horta");
const calendario = document.getElementById("calendario-raiz");
const organizador = document.getElementById("organizador-raiz");

if (horta) {
  Promise.all([import("./features/guias/GuiaHorta.jsx"), import("./data/guias.js")])
    .then(([{ default: GuiaHorta }, { guiaHorta }]) => {
      createRoot(horta).render(<GuiaHorta guia={guiaHorta} raiz={raiz} />);
    });
}

if (calendario) {
  import("./components/Calendario.jsx").then(({ default: Calendario }) => {
    createRoot(calendario).render(<Calendario titulo="Consultar por mês e região" />);
  });
}

if (organizador) {
  import("./features/organizador/OrganizadorHorta.jsx").then(({ default: OrganizadorHorta }) => {
    createRoot(organizador).render(<OrganizadorHorta />);
  });
}
