import { useCallback, useEffect, useState } from "react";
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
import GuiaHorta from "./features/guias/GuiaHorta.jsx";
import PlanejadorComConta from "./features/planejador/PlanejadorComConta.jsx";
import EditorTerreno from "./features/planejador/EditorTerreno.jsx";
import { apiConfigurada } from "./features/planejador/api.js";
import { criarTerreno } from "./features/planejador/geometria.js";

const dimensoesIniciais = criarTerreno("35", "65");
const canteirosVazios = [];
const projetoVazio = { terreno: null, itens: canteirosVazios };
const Editor = apiConfigurada ? PlanejadorComConta : EditorTerreno;
const conteudosGuias = {
  horta: GuiaHorta,
  compostagem: ChecklistCompostagem,
  ferramentas: ComparativoIrrigacao,
};

function chaveDoTerreno(terreno) {
  return `${terreno.largura}x${terreno.comprimento}`;
}

function urlDoTerreno(terreno) {
  const url = new URL(window.location.href);
  url.searchParams.set("frente", String(terreno.largura));
  url.searchParams.set("profundidade", String(terreno.comprimento));
  return url;
}

function terrenoDaUrl() {
  const parametros = new URLSearchParams(window.location.search);
  return criarTerreno(parametros.get("frente") ?? "", parametros.get("profundidade") ?? "");
}

export default function App() {
  const [editor, definirEditor] = useState(terrenoDaUrl);
  const [verHistorico, definirVerHistorico] = useState(false);
  const [dialogo, definirDialogo] = useState(null);
  const [projeto, definirProjeto] = useState(projetoVazio);

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
    window.history.pushState({ editor: true }, "", urlDoTerreno(terreno));
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
  const projetoAtivo = projeto.terreno === chaveTerreno ? projeto : null;
  const itens = projetoAtivo?.itens ?? canteirosVazios;
  const ConteudoGuia = conteudosGuias[dialogo?.id];

  function atualizarProjeto(dados) {
    definirProjeto((anterior) => ({
      ...(anterior.terreno === chaveTerreno ? anterior : { itens: canteirosVazios }),
      terreno: chaveTerreno,
      dimensoes: editor,
      ...dados,
    }));
  }

  const limparProjeto = useCallback(() => definirProjeto(projetoVazio), []);

  function abrirProjeto(salvo, contaId) {
    const terreno = criarTerreno(String(salvo.largura), String(salvo.profundidade));
    window.history.replaceState(window.history.state, "", urlDoTerreno(terreno));
    definirEditor(terreno);
    definirProjeto({
      terreno: chaveDoTerreno(terreno),
      dimensoes: terreno,
      itens: salvo.itens,
      registro: { id: salvo.id, nome: salvo.nome, itens: salvo.itens, contaId },
      abertura: crypto.randomUUID(),
    });
  }

  return (
    <div className="pagina" id="inicio">
      <a className="pular" href="#conteudo">Pular para o conteúdo</a>
      <Cabecalho>
        <button type="button" className="botao"
          onClick={() => abrirEditor(projeto.dimensoes ?? dimensoesIniciais)}>
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
          <Planejador abrirEditor={abrirEditor} />
        </div>

        <section className="guias" id="guias" aria-labelledby="titulo-guias">
          <h2 id="titulo-guias">Guias para começar</h2>
          <ul className="guias-grade">
            {guias.map((guia) => (
              <li key={guia.id}>
                <button className="guia" type="button" onClick={() => definirDialogo(guia)}>
                  <img src={`./imagens/${guia.id}.webp`} width="792" height="396" alt="" loading="lazy" />
                  <span>{guia.titulo}</span>
                </button>
              </li>
            ))}
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

      {editor && <CaixaDialogo titulo="Meu Quintal" fechar={fecharEditor}>
        <div className="acoes-guia secoes-quintal" role="group" aria-label="Seções do Meu Quintal">
          <button className={`botao ${verHistorico ? "botao-contorno" : ""}`} type="button"
            aria-controls="painel-terreno" aria-pressed={!verHistorico} onClick={() => definirVerHistorico(false)}>
            Planejador de terreno
          </button>
          <button className={`botao ${verHistorico ? "" : "botao-contorno"}`} type="button"
            aria-controls="historico-quintal" aria-pressed={verHistorico} onClick={() => definirVerHistorico(true)}>
            Histórico de cultivo
          </button>
        </div>
        <div id="painel-terreno" hidden={verHistorico}>
          <Editor key={apiConfigurada ? undefined : chaveTerreno} chaveEdicao={projetoAtivo?.abertura ?? chaveTerreno}
            terreno={editor} itens={itens} definirItens={(novosItens) => atualizarProjeto({ itens: novosItens })}
            registro={projetoAtivo?.registro} gravarRegistro={(registro) => atualizarProjeto({ registro })}
            abrirProjeto={abrirProjeto} limparProjeto={limparProjeto} />
        </div>
        <div id="historico-quintal" hidden={!verHistorico}>
          <HistoricoCultivo />
        </div>
      </CaixaDialogo>}

      {dialogo === "creditos" && <CaixaDialogo titulo="Sobre as imagens" fechar={() => definirDialogo(null)}>
        <p>As imagens dos cartões da página inicial foram geradas por IA. Os guias de horta e de compostagem também incluem fotos do Wikimedia Commons, com créditos e licenças nos próprios guias.</p>
      </CaixaDialogo>}

      {dialogo?.titulo && <CaixaDialogo titulo={dialogo.titulo} fechar={() => definirDialogo(null)}>
        {dialogo.id !== "horta" && <>
          <img className="foto-dialogo" src={`./imagens/${dialogo.id}.webp`} width="792" height="396" alt="" />
          <p>{dialogo.descricao}</p>
        </>}
        {ConteudoGuia && <ConteudoGuia guia={dialogo} />}
        {dialogo.id !== "horta" && <a className="link-fonte" href={dialogo.url} target="_blank" rel="noreferrer">{dialogo.fonte}</a>}
      </CaixaDialogo>}
    </div>
  );
}
