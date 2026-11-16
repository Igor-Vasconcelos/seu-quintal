import { useEffect, useState } from "react";
import CaixaDialogo from "./components/CaixaDialogo.jsx";
import Cabecalho from "./components/Cabecalho.jsx";
import Calendario from "./components/Calendario.jsx";
import CartoesGuias from "./components/CartoesGuias.jsx";
import Icone from "./components/Icone.jsx";
import Planejador from "./components/Planejador.jsx";
import Rodape from "./components/Rodape.jsx";
import { guias } from "./data/guias.js";
import HistoricoCultivo from "./features/cultivo/HistoricoCultivo.jsx";
import EditorTerreno from "./features/planejador/EditorTerreno.jsx";
import { criarTerreno } from "./features/planejador/geometria.js";
import { chaveDoTerreno, lerProjetos, projetoInicial, salvarProjetos } from "./features/planejador/projetos.js";

const dimensoesIniciais = criarTerreno("35", "65");

function terrenoDaUrl() {
  const parametros = new URLSearchParams(window.location.search);
  return criarTerreno(parametros.get("frente") ?? "", parametros.get("profundidade") ?? "");
}

export default function App() {
  const [editor, definirEditor] = useState(terrenoDaUrl);
  const [verHistorico, definirVerHistorico] = useState(false);
  const [verCreditos, definirVerCreditos] = useState(false);
  const [projetos, definirProjetos] = useState(lerProjetos);
  const [salvouProjeto, definirSalvouProjeto] = useState(true);

  useEffect(() => {
    const destino = document.getElementById(window.location.hash.slice(1));
    destino?.scrollIntoView({ behavior: "instant" });

    function sincronizarEditor() {
      definirVerCreditos(false);
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

  return (
    <div className="pagina-home" id="inicio">
      <a className="pular" href="#conteudo">Pular para o conteúdo</a>
      <Cabecalho pagina="inicio">
        <button type="button" className="botao"
          onClick={() => abrirEditor(ultimoTerreno)}>
          Meu Quintal
        </button>
      </Cabecalho>

      <main id="conteudo" tabIndex={-1}>
        <section className="home-abertura" aria-labelledby="titulo-home">
          <div className="home-miolo home-abertura-grade">
            <div className="home-abertura-texto">
              <h1 id="titulo-home">Tudo para o seu <em>quintal florescer.</em></h1>
              <p>Aprenda a cuidar da horta e dos animais. Descubra o que plantar, organize seu terreno e acompanhe o cultivo.</p>
              <div className="home-acoes">
                <button className="botao" type="button" onClick={() => abrirEditor(ultimoTerreno)}>
                  Abrir Meu Quintal <Icone nome="seta" />
                </button>
                <a className="home-link" href="#guias">Explorar guias <Icone nome="seta" /></a>
              </div>
            </div>
            <figure className="home-abertura-imagem">
              <img src="./imagens/sisteminha/panorama.webp" width="1248" height="832"
                alt="Ilustração de um quintal com canteiros, galinhas e um tanque de peixes." fetchPriority="high" />
            </figure>
          </div>
        </section>

        <section className="home-miolo home-secao" id="categorias" aria-labelledby="titulo-categorias">
          <h2 id="titulo-categorias">Explore por assunto</h2>
          <ul className="home-categorias">
            {guias.map((guia) => (
              <li key={guia.id}>
                <a href={`./${guia.destino}`}>
                  <span className="categoria-simbolo" aria-hidden="true">{guia.simbolo}</span>
                  <span>{guia.assunto}</span>
                  <Icone nome="seta" />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-destaques" id="guias" aria-labelledby="titulo-guias">
          <div className="home-miolo home-secao">
            <div className="home-secao-topo">
              <h2 id="titulo-guias">Guias para começar</h2>
              <a className="home-link" href="./guias/">Ver todos os guias <Icone nome="seta" /></a>
            </div>
            <CartoesGuias itens={guias.slice(0, 3)} />
          </div>
        </section>

        <section className="home-miolo home-secao" id="ferramentas" aria-labelledby="titulo-ferramentas-home">
          <div className="home-secao-topo">
            <h2 id="titulo-ferramentas-home">Planeje seu quintal</h2>
            <a className="home-link" href="./horta/organizador/">Organizador de horta <Icone nome="seta" /></a>
          </div>
          <div className="ferramentas">
            <Calendario />
            <Planejador abrirEditor={abrirEditor} dimensoesIniciais={ultimoTerreno} />
          </div>
        </section>

        <section className="home-miolo home-secao home-projetos" aria-label="Projetos para o quintal">
          <div className="home-meu-quintal" id="meu-quintal">
            <Icone nome="planta" />
            <h2>Meu Quintal</h2>
            <p>Desenhe o terreno, compare layouts e registre o que plantou e colheu.</p>
            <button className="botao" type="button" onClick={() => abrirEditor(ultimoTerreno)}>
              Abrir o painel <Icone nome="seta" />
            </button>
          </div>
          <div className="home-sisteminha" id="sisteminha">
            <img src="./imagens/sisteminha.webp" width="379" height="104" alt="" loading="lazy" />
            <div>
              <h2>Sisteminha Embrapa</h2>
              <p>Veja como peixes, horta e compostagem se conectam.</p>
              <a className="home-link" href="./sisteminha.html">Conhecer o ciclo <Icone nome="seta" /></a>
            </div>
          </div>
        </section>
      </main>

      <Rodape inicio aoVerCreditos={() => definirVerCreditos(true)} />

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

      {verCreditos && <CaixaDialogo titulo="Sobre as imagens" fechar={() => definirVerCreditos(false)}>
        <p>As imagens dos cartões da página inicial foram geradas por IA. Os guias de horta e de compostagem também incluem fotos do Wikimedia Commons, com créditos e licenças nos próprios guias.</p>
      </CaixaDialogo>}

    </div>
  );
}
