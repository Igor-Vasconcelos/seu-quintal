import { useEffect, useState } from "react";
import CaixaDialogo from "./components/CaixaDialogo.jsx";
import Cabecalho from "./components/Cabecalho.jsx";
import Calendario from "./components/Calendario.jsx";
import Icone from "./components/Icone.jsx";
import Planejador from "./components/Planejador.jsx";
import Rodape from "./components/Rodape.jsx";
import { guias } from "./data/guias.js";
import HistoricoCultivo from "./features/cultivo/HistoricoCultivo.jsx";
import ChecklistCompostagem from "./features/guias/ChecklistCompostagem.jsx";
import ComparativoIrrigacao from "./features/guias/ComparativoIrrigacao.jsx";
import EditorTerreno from "./features/planejador/EditorTerreno.jsx";
import { criarTerreno } from "./features/planejador/geometria.js";
import { chaveDoTerreno, lerProjetos, projetoInicial, salvarProjetos } from "./features/planejador/projetos.js";

const dimensoesIniciais = criarTerreno("35", "65");
const conteudosGuias = {
  compostagem: ChecklistCompostagem,
  ferramentas: ComparativoIrrigacao,
};

function terrenoDaUrl() {
  const parametros = new URLSearchParams(window.location.search);
  return criarTerreno(parametros.get("frente") ?? "", parametros.get("profundidade") ?? "");
}

export default function App() {
  const [editor, definirEditor] = useState(terrenoDaUrl);
  const [verHistorico, definirVerHistorico] = useState(false);
  const [dialogo, definirDialogo] = useState(null);
  const [projetos, definirProjetos] = useState(lerProjetos);
  const [salvouProjeto, definirSalvouProjeto] = useState(true);

  useEffect(() => {
    function sincronizarEditor() {
      definirDialogo(null);
      definirVerHistorico(false);
      definirEditor(terrenoDaUrl());
    }
    window.addEventListener("popstate", sincronizarEditor);
    return () => window.removeEventListener("popstate", sincronizarEditor);
  }, []);

  function abrirEditor(terreno) {
    const url = new URL(window.location.href);
    url.searchParams.set("frente", String(terreno.largura));
    url.searchParams.set("profundidade", String(terreno.comprimento));
    if (editor) window.history.replaceState(window.history.state, "", url);
    else window.history.pushState({ editor: true }, "", url);
    definirVerHistorico(false);
    definirEditor(terreno);
  }

  function fecharEditor() {
    if (window.history.state?.editor) {
      window.history.back();
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.delete("frente");
    url.searchParams.delete("profundidade");
    window.history.replaceState(null, "", url);
    definirEditor(null);
  }

  const chaveTerreno = editor ? chaveDoTerreno(editor) : null;
  const projeto = projetos.terrenos[chaveTerreno];
  const ultimoTerreno = projetos.ultimoTerreno ?? dimensoesIniciais;

  function atualizarProjeto(novo) {
    const salvos = lerProjetos().terrenos;
    const outros = salvouProjeto
      ? { ...projetos.terrenos, ...salvos }
      : { ...salvos, ...projetos.terrenos };
    const dados = {
      ultimoTerreno: editor,
      terrenos: { ...outros, [chaveTerreno]: novo },
    };
    definirProjetos(dados);
    definirSalvouProjeto(salvarProjetos(dados));
  }

  const ConteudoGuia = conteudosGuias[dialogo?.id];

  return (
    <div className="pagina-home" id="inicio">
      <a className="pular" href="#conteudo">Pular para o conteúdo</a>
      <Cabecalho>
        <button type="button" className="botao"
          onClick={() => abrirEditor(ultimoTerreno)}>
          Meu Quintal
        </button>
      </Cabecalho>

      <main id="conteudo">
        <section className="abertura" aria-labelledby="titulo-home">
          <img className="seu-adao" src="./imagens/seu-adao-home.webp" width="284" height="174"
            alt="Seu Adão acena segurando uma muda." fetchPriority="high" />
          <div className="abertura-texto">
            <h1 id="titulo-home">Da primeira muda ao seu sítio</h1>
            <p>Descubra o que plantar e planeje seu espaço.</p>
          </div>
          <img className="folhagem" src="./imagens/folhagem.webp" width="119" height="119" alt="" />
        </section>

        <nav className="atalhos" aria-label="Atalhos da home">
          <a href="#calendario"><Icone nome="muda" />Calendário</a>
          <a href="#planejador"><Icone nome="planta" />Planejador</a>
          <a href="#guias"><Icone nome="livro" />Guias</a>
        </nav>

        <div className="ferramentas">
          <Calendario />
          <Planejador abrirEditor={abrirEditor} dimensoesIniciais={ultimoTerreno} />
        </div>

        <section className="guias" id="guias" aria-labelledby="titulo-guias">
          <h2 id="titulo-guias">Guias para começar</h2>
          <ul className="guias-grade">
            {guias.map((guia) => {
              const conteudo = <>
                <img src={`./imagens/${guia.id}.webp`} width="792" height="396" alt="" loading="lazy" />
                <span>{guia.titulo}</span>
              </>;

              return (
                <li key={guia.id}>
                  {guia.destino
                    ? <a className="guia" href={guia.destino}>{conteudo}</a>
                    : <button className="guia" type="button" onClick={() => definirDialogo(guia)}>{conteudo}</button>}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="sisteminha" id="sisteminha" aria-labelledby="titulo-sisteminha">
          <img src="./imagens/sisteminha.webp" width="379" height="104" alt="" loading="lazy" />
          <div className="sisteminha-texto">
            <h2 id="titulo-sisteminha">Sisteminha Embrapa</h2>
            <p>Veja como peixes, horta e compostagem se conectam.</p>
          </div>
          <div className="sisteminha-acao">
            <a className="botao botao-terracota" href="./sisteminha.html">
              Conhecer o ciclo <Icone nome="seta" />
            </a>
          </div>
        </section>
      </main>

      <Rodape inicio aoVerCreditos={() => definirDialogo("creditos")} />

      {editor && <CaixaDialogo titulo="Meu Quintal" fechar={fecharEditor} largo>
        <div className="acoes-guia secoes-quintal" role="group" aria-label="Seções do Meu Quintal">
          <button className={`botao ${verHistorico ? "botao-contorno" : ""}`} type="button"
            aria-controls="painel-terreno" aria-pressed={!verHistorico} onClick={() => definirVerHistorico(false)}>
            Planejador de terreno
          </button>
          <button className={`botao ${verHistorico ? "" : "botao-contorno"}`} type="button"
            aria-controls="historico-quintal" aria-pressed={verHistorico} onClick={() => definirVerHistorico(true)}>
            Histórico de cultivo
          </button>
          <a className="botao botao-contorno" href="./horta/organizador/">Organizador de horta</a>
        </div>
        <div id="painel-terreno" hidden={verHistorico}>
          <EditorTerreno key={chaveTerreno} terreno={editor} abrirTerreno={abrirEditor}
            projeto={projeto ?? projetoInicial} definirProjeto={atualizarProjeto}
            salvamento={salvouProjeto ? (projeto ? "Salvo neste navegador" : "Salvamento automático neste navegador") : "Salvamento indisponível. Projeto aberto nesta sessão."} />
        </div>
        <div id="historico-quintal" hidden={!verHistorico}>
          <HistoricoCultivo />
        </div>
      </CaixaDialogo>}

      {dialogo === "creditos" && <CaixaDialogo titulo="Sobre as imagens" fechar={() => definirDialogo(null)}>
        <p>As imagens dos cartões da página inicial foram geradas por IA. Os guias de horta e de compostagem também incluem fotos do Wikimedia Commons, com créditos e licenças nos próprios guias.</p>
      </CaixaDialogo>}

      {dialogo?.titulo && <CaixaDialogo titulo={dialogo.titulo} fechar={() => definirDialogo(null)}>
        <img className="foto-dialogo" src={`./imagens/${dialogo.id}.webp`} width="792" height="396" alt="" />
        <p>{dialogo.descricao}</p>
        {ConteudoGuia && <ConteudoGuia guia={dialogo} />}
        <a className="link-fonte" href={dialogo.url} target="_blank" rel="noreferrer">{dialogo.fonte}</a>
      </CaixaDialogo>}
    </div>
  );
}
