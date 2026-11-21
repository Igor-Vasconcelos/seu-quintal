import { lazy, Suspense, useEffect, useState } from "react";
import Cabecalho from "../../components/Cabecalho.jsx";
import Icone from "../../components/Icone.jsx";
import LimiteDaFerramenta from "../../components/LimiteDaFerramenta.jsx";
import Rodape from "../../components/Rodape.jsx";
import PlanejadorQuintal from "./PlanejadorQuintal.jsx";
import BackupDados from "./BackupDados.jsx";

const HistoricoCultivo = lazy(() => import("../cultivo/HistoricoCultivo.jsx"));
const OrganizadorHorta = lazy(() => import("../organizador/OrganizadorHorta.jsx"));
const PlanejadorVisualCanteiro = lazy(() => import("../organizador/PlanejadorVisualCanteiro.jsx"));
const secoes = {
  terreno: { nome: "Terreno", icone: "planta" },
  historico: { nome: "Histórico", icone: "historico" },
  horta: { nome: "Agenda da horta", icone: "calendario" },
  canteiros: { nome: "Meus canteiros", icone: "planta" },
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
          <div className="quintal-titulo-texto">
            <span className="quintal-etiqueta"><Icone nome="muda"/> MEU ESPAÇO DE PLANEJAMENTO</span>
            <h1>Meu Quintal</h1>
            <p>Planeje seu espaço, organize o plantio e registre suas colheitas.</p>
            <p className="quintal-salvamento"><Icone nome="historico"/>
              Dados guardados neste navegador. Faça backup para proteger seus projetos.</p>
          </div>
          <div className="quintal-titulo-acoes">
            <a className="botao botao-contorno" href="#quintal-backup">
              <Icone nome="historico"/> Backup e recuperação
            </a>
            <a className="home-link" href={raiz}><Icone nome="seta"/> Voltar ao início</a>
          </div>
        </header>
        <nav className="quintal-secoes" aria-label="Ferramentas do Meu Quintal">
          {Object.entries(secoes).map(([id, { nome, icone }]) => (
            <a key={id} href={`#${id}`} aria-controls="quintal-ferramenta"
              aria-current={secao === id ? "location" : undefined}>
              <span className="quintal-navegacao-icone"><Icone nome={icone}/></span>
              <span>{nome}</span>
            </a>
          ))}
        </nav>
        <p className="visualmente-oculto" role="status" aria-live="polite">
          Seção selecionada: {secoes[secao].nome}
        </p>
        <div className="quintal-ferramenta" id="quintal-ferramenta">
          <div className="quintal-ferramenta-topo" aria-hidden="true">
            <span>ÁREA DE TRABALHO</span><strong>{secoes[secao].nome}</strong>
          </div>
          <LimiteDaFerramenta key={secao}>
            <Suspense fallback={<p role="status">Carregando ferramenta…</p>}>
              {secao === "terreno" && <PlanejadorQuintal />}
              {secao === "historico" && <HistoricoCultivo nivelTitulo={2} />}
              {secao === "canteiros" && <section aria-label="Meus canteiros">
                <PlanejadorVisualCanteiro />
              </section>}
              {secao === "horta" && <section aria-label="Organizador de horta">
                <h2>Agenda da horta</h2>
                <OrganizadorHorta culturaSugerida={cultura} />
              </section>}
            </Suspense>
          </LimiteDaFerramenta>
        </div>
        <BackupDados />
      </main>
      <Rodape raiz={raiz} pagina="meu-quintal" />
    </div>
  );
}
