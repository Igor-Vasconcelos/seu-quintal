import { createRoot } from "react-dom/client";
import "@fontsource-variable/dm-sans";
import "@fontsource/dm-serif-text/latin-400.css";
import Cabecalho from "./components/Cabecalho.jsx";
import LimiteDaFerramenta, { FalhaAoCarregar } from "./components/LimiteDaFerramenta.jsx";
import Rodape from "./components/Rodape.jsx";
import "./styles/tokens.css";
import "./styles/home.css";
import "./styles/editorial.css";
import "./styles/guias-cultivo.css";
import "./styles/conteudo.css";

const { raiz, pagina } = document.body.dataset;

createRoot(document.getElementById("cabecalho")).render(<Cabecalho raiz={raiz} pagina={pagina} />);
createRoot(document.getElementById("rodape")).render(<Rodape raiz={raiz} pagina={pagina} />);

const horta = document.getElementById("guia-horta");
const canteiroVisual = document.getElementById("canteiro-visual-raiz");
const calendario = document.getElementById("calendario-raiz");
const organizador = document.getElementById("organizador-raiz");
const catalogo = document.getElementById("catalogo-guias");
const guia = document.getElementById("guia-interativo");

async function montarFerramenta(elemento, carregar) {
  const montagem = createRoot(elemento);
  try {
    montagem.render(<LimiteDaFerramenta>{await carregar()}</LimiteDaFerramenta>);
  } catch {
    montagem.render(<FalhaAoCarregar />);
  }
}

if (canteiroVisual) {
  montarFerramenta(canteiroVisual, async () => {
    const { default: PlanejadorVisualCanteiro } = await import("./features/organizador/PlanejadorVisualCanteiro.jsx");
    return <PlanejadorVisualCanteiro />;
  });
}

if (horta) {
  montarFerramenta(horta, async () => {
    const [{ default: GuiaHorta }, { guiaHorta }] = await Promise.all([
      import("./features/guias/GuiaHorta.jsx"), import("./data/guias.js"),
    ]);
    return <GuiaHorta guia={guiaHorta} raiz={raiz} />;
  });
}

if (calendario) {
  montarFerramenta(calendario, async () => {
    const { default: Calendario } = await import("./components/Calendario.jsx");
    return <Calendario titulo="Consultar por mês e região" raiz={raiz} />;
  });
}

if (organizador) {
  montarFerramenta(organizador, async () => {
    const { default: OrganizadorHorta } = await import("./features/organizador/OrganizadorHorta.jsx");
    const cultura = new URLSearchParams(window.location.search).get("cultura");
    return <OrganizadorHorta culturaSugerida={cultura} />;
  });
}

if (catalogo) {
  montarFerramenta(catalogo, async () => {
    const { default: CartoesGuias } = await import("./components/CartoesGuias.jsx");
    return <CartoesGuias raiz={raiz} titulo="h2" />;
  });
}

if (guia) {
  const carregarGuia = pagina === "compostagem"
    ? () => import("./features/guias/ChecklistCompostagem.jsx")
    : () => import("./features/guias/ComparativoIrrigacao.jsx");

  montarFerramenta(guia, async () => {
    const { default: Guia } = await carregarGuia();
    return <Guia raiz={raiz} />;
  });
}
