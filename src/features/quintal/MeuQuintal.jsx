import { lazy, Suspense, useEffect, useState } from "react";
import Cabecalho from "../../components/Cabecalho.jsx";
import Icone from "../../components/Icone.jsx";
import Rodape from "../../components/Rodape.jsx";
import PlanejadorQuintal from "./PlanejadorQuintal.jsx";

const HistoricoCultivo = lazy(() => import("../cultivo/HistoricoCultivo.jsx"));
const OrganizadorHorta = lazy(() => import("../organizador/OrganizadorHorta.jsx"));
const secoes = { terreno: "Planejador de terreno", historico: "Histórico de cultivo", horta: "Organizador de horta" };
const raiz = "../";

function secaoAtual() {
  const nome = window.location.hash.slice(1);
  return Object.hasOwn(secoes, nome) ? nome : "terreno";
}

export default function MeuQuintal() {
  const [secao, definirSecao] = useState(secaoAtual);

  useEffect(() => {
    function trocar() {
      const destino = window.location.hash.slice(1);
      if (!destino || Object.hasOwn(secoes, destino)) definirSecao(secaoAtual());
    }
    window.addEventListener("hashchange", trocar);
    return () => window.removeEventListener("hashchange", trocar);
  }, []);

  return (
    <div className="pagina" id="inicio">
      <a href="#conteudo" className="pular">Pular para o conteúdo</a>
      <Cabecalho raiz={raiz} pagina="meu-quintal" />
      <main className="quintal-pagina" id="conteudo" tabIndex={-1}>
        <header className="quintal-titulo">
          <div>
            <h1>Meu Quintal</h1>
            <p>Planeje seu terreno e acompanhe o que você planta e colhe.</p>
          </div>
          <a href={raiz}>Voltar ao Seu Quintal <Icone nome="seta" /></a>
        </header>
        <nav className="quintal-secoes" aria-label="Ferramentas do Meu Quintal">
          {Object.entries(secoes).map(([id, nome]) => (
            <a key={id} href={`#${id}`} className={`botao${secao === id ? "" : " botao-contorno"}`}
              aria-current={secao === id ? "page" : undefined}>{nome}</a>
          ))}
        </nav>
        <div className="quintal-ferramenta">
          <Suspense fallback={<p role="status">Carregando ferramenta…</p>}>
            {secao === "terreno" && <PlanejadorQuintal />}
            {secao === "historico" && <HistoricoCultivo />}
            {secao === "horta" && <section aria-label="Organizador de horta">
              <h2>Organizador de horta</h2>
              <OrganizadorHorta />
            </section>}
          </Suspense>
        </div>
      </main>
      <Rodape raiz={raiz} pagina="meu-quintal" />
    </div>
  );
}
