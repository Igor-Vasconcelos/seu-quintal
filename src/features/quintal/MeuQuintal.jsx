import { lazy, Suspense, useEffect, useState } from "react";
import Cabecalho from "../../components/Cabecalho.jsx";
import Icone from "../../components/Icone.jsx";
import LimiteDaFerramenta from "../../components/LimiteDaFerramenta.jsx";
import Rodape from "../../components/Rodape.jsx";
import PlanejadorQuintal from "./PlanejadorQuintal.jsx";
import BackupDados from "./BackupDados.jsx";

const VisaoGeralQuintal = lazy(() => import("./VisaoGeralQuintal.jsx"));
const HistoricoCultivo = lazy(() => import("../cultivo/HistoricoCultivo.jsx"));
const OrganizadorHorta = lazy(() => import("../organizador/OrganizadorHorta.jsx"));
const PlanejadorVisualCanteiro = lazy(() => import("../organizador/PlanejadorVisualCanteiro.jsx"));
const secoes = {
  geral: { nome: "Visão geral", icone: "outros" },
  terreno: { nome: "Terrenos", icone: "planta" },
  canteiros: { nome: "Meus canteiros", icone: "canteiro" },
  horta: { nome: "Agenda da horta", icone: "calendario" },
  historico: { nome: "Histórico", icone: "historico" },
};
const raiz = "../";

function secaoAtual() {
  const nome = window.location.hash.slice(1);
  return Object.hasOwn(secoes, nome) ? nome : "geral";
}

export default function MeuQuintal() {
  const [secao, definirSecao] = useState(secaoAtual);
  const [menuRecolhido, definirMenuRecolhido] = useState(false);
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
    <div className="pagina pagina-meu-quintal" id="inicio" data-menu-recolhido={menuRecolhido ? "true" : undefined}>
      <a href="#conteudo" className="pular">Pular para o conteúdo</a>
      <Cabecalho raiz={raiz} pagina="meu-quintal" />
      <main className="quintal-pagina" id="conteudo" tabIndex={-1}>
        <header className="quintal-titulo">
          <div className="quintal-titulo-texto">
            <span className="quintal-etiqueta"><Icone nome="muda"/> MEU ESPAÇO DE PLANEJAMENTO</span>
            <h1>Meu Quintal</h1>
            <p>Organize seus terrenos, plantios, canteiros e registros em um só lugar.</p>
          </div>
          <div className="quintal-titulo-acoes">
            <p className="quintal-salvamento"><Icone nome="historico"/>
              Armazenamento neste navegador, sem sincronização automática. Faça backups regularmente.
            </p>
            <div className="quintal-acoes-links">
              <button className="botao botao-contorno" type="button" onClick={() => {
                const painel = document.getElementById("quintal-backup");
                if (!painel) return;
                painel.open = true;
                painel.scrollIntoView({ block: "start" });
                painel.querySelector("summary")?.focus();
              }}>
                <Icone nome="historico"/> Fazer backup
              </button>
            </div>
          </div>
        </header>
        <nav className="quintal-secoes" aria-label="Seções do Meu Quintal">
          <div className="quintal-secoes-topo">
            <span>MEU ESPAÇO</span>
            <button type="button" className="quintal-recolher"
              onClick={() => definirMenuRecolhido((atual) => !atual)}
              aria-label={menuRecolhido ? "Expandir menu lateral" : "Recolher menu lateral"}
              title={menuRecolhido ? "Expandir menu lateral" : "Recolher menu lateral"}
              aria-pressed={menuRecolhido}>
              <Icone nome="chevron-baixo" />
            </button>
          </div>
          <div className="quintal-secoes-links">
            {Object.entries(secoes).map(([id, { nome, icone }]) => (
              <a key={id} href={`#${id}`} aria-controls="quintal-ferramenta"
                aria-label={nome} title={menuRecolhido ? nome : undefined}
                aria-current={secao === id ? "location" : undefined}>
                <span className="quintal-navegacao-icone"><Icone nome={icone}/></span>
                <span className="quintal-navegacao-texto">{nome}</span>
              </a>
            ))}
          </div>
          <div className="quintal-secoes-rodape">
            <Icone nome="historico"/><span>Dados neste navegador</span>
          </div>
        </nav>
        <p className="visualmente-oculto" role="status" aria-live="polite">
          Seção selecionada: {secoes[secao].nome}
        </p>
        <div className="quintal-ferramenta" id="quintal-ferramenta">
          <LimiteDaFerramenta key={secao}>
            <Suspense fallback={<p role="status">Carregando ferramenta…</p>}>
              {secao === "geral" && <VisaoGeralQuintal />}
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
