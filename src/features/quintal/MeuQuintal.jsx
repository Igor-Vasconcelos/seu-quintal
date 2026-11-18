import { lazy, Suspense, useEffect, useState } from "react";
import Cabecalho from "../../components/Cabecalho.jsx";
import Icone from "../../components/Icone.jsx";
import LimiteDaFerramenta from "../../components/LimiteDaFerramenta.jsx";
import Rodape from "../../components/Rodape.jsx";
import PlanejadorQuintal from "./PlanejadorQuintal.jsx";
import BackupDados from "./BackupDados.jsx";

const HistoricoCultivo = lazy(() => import("../cultivo/HistoricoCultivo.jsx"));
const OrganizadorHorta = lazy(() => import("../organizador/OrganizadorHorta.jsx"));
const secoes = {
  terreno: { nome: "Terreno", icone: "planta" },
  historico: { nome: "Histórico", icone: "historico" },
  horta: { nome: "Agenda da horta", icone: "calendario" },
};
const raiz = "../";

function secaoAtual() {
  const nome = window.location.hash.slice(1);
  return Object.hasOwn(secoes, nome) ? nome : "terreno";
}

export default function MeuQuintal() {
  const [secao, definirSecao] = useState(secaoAtual);
  const cultura = new URLSearchParams(window.location.search).get("cultura");

  useEffect(() => {
    function trocar() {
      const destino = window.location.hash.slice(1);
      if (!destino || Object.hasOwn(secoes, destino)) definirSecao(secaoAtual());
    }
    window.addEventListener("hashchange", trocar);
    return () => window.removeEventListener("hashchange", trocar);
  }, []);

  return (
    <div className="pagina pagina-meu-quintal" id="inicio">
      <a href="#conteudo" className="pular">Pular para o conteúdo</a>
      <Cabecalho raiz={raiz} pagina="meu-quintal" />
      <main className="quintal-pagina" id="conteudo" tabIndex={-1}>
        <header className="quintal-titulo">
          <div>
            <h1>Meu Quintal</h1>
            <p>Planeje seu espaço, organize o plantio e registre as colheitas.</p>
            <p className="quintal-salvamento">Seus dados ficam salvos neste navegador.</p>
          </div>
          <a className="home-link" href={raiz}><Icone nome="seta" /> Voltar ao início</a>
        </header>
        <nav className="quintal-secoes" aria-label="Ferramentas do Meu Quintal">
          {Object.entries(secoes).map(([id, { nome, icone }]) => (
            <a key={id} href={`#${id}`} aria-controls="quintal-ferramenta"
              aria-current={secao === id ? "location" : undefined}>
              <Icone nome={icone} />{nome}
            </a>
          ))}
        </nav>
        <BackupDados />
        <div className="quintal-ferramenta" id="quintal-ferramenta">
          <LimiteDaFerramenta key={secao}>
            <Suspense fallback={<p role="status">Carregando ferramenta…</p>}>
              {secao === "terreno" && <PlanejadorQuintal />}
              {secao === "historico" && <HistoricoCultivo nivelTitulo={2} />}
              {secao === "horta" && <section aria-label="Organizador de horta">
                <h2>Agenda da horta</h2>
                <OrganizadorHorta culturaSugerida={cultura} />
              </section>}
            </Suspense>
          </LimiteDaFerramenta>
        </div>
      </main>
      <Rodape raiz={raiz} pagina="meu-quintal" />
    </div>
  );
}
