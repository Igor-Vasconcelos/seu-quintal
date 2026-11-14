import { useEffect, useState } from "react";
import CaixaDialogo from "./components/CaixaDialogo.jsx";
import Calendario from "./components/Calendario.jsx";
import Icone from "./components/Icone.jsx";
import Planejador from "./components/Planejador.jsx";
import { guias } from "./data/guias.js";
import HistoricoCultivo from "./features/cultivo/HistoricoCultivo.jsx";
import ChecklistCompostagem from "./features/guias/ChecklistCompostagem.jsx";
import ComparativoIrrigacao from "./features/guias/ComparativoIrrigacao.jsx";
import GuiaHorta from "./features/guias/GuiaHorta.jsx";
import EditorTerreno from "./features/planejador/EditorTerreno.jsx";
import { criarTerreno } from "./features/planejador/geometria.js";

const dimensoesIniciais = criarTerreno("35", "65");
const fonteSisteminha = "https://www.embrapa.br/web/meio-norte/sisteminha";
const conteudosGuias = {
  horta: GuiaHorta,
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
  const [projeto, definirProjeto] = useState({ terreno: null, itens: [] });

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
    window.history.pushState({ editor: true }, "", url);
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

  const chaveTerreno = editor ? `${editor.largura}x${editor.comprimento}` : null;
  const itens = projeto.terreno === chaveTerreno ? projeto.itens : [];
  const ConteudoGuia = conteudosGuias[dialogo?.id];

  return (
    <div className="pagina" id="inicio">
      <a className="pular" href="#conteudo">Pular para o conteúdo</a>
      <header className="topo">
        <a href="#inicio" className="marca"><Icone nome="muda" />Seu Quintal</a>
        <nav className="menu" aria-label="Menu principal">
          <a href="#calendario">Calendário</a>
          <a href="#guias">Guias</a>
          <a href="#sisteminha">Sisteminha Embrapa</a>
        </nav>
        <button type="button" className="botao botao-contorno"
          onClick={() => abrirEditor(projeto.dimensoes ?? dimensoesIniciais)}>
          Meu Quintal
        </button>
      </header>

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
            <p>Veja o que avaliar antes de montar.</p>
          </div>
          <div className="sisteminha-acao">
            <button className="botao botao-terracota" type="button" onClick={() => definirDialogo("sisteminha")}>
              Conhecer as etapas <Icone nome="seta" />
            </button>
          </div>
        </section>
      </main>

      <footer className="rodape">
        <a href="#inicio">Seu Quintal</a>
        <button type="button" onClick={() => definirDialogo("creditos")}>Sobre as imagens</button>
      </footer>

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
          <EditorTerreno key={chaveTerreno} terreno={editor} itens={itens}
            definirItens={(novosItens) => definirProjeto({ terreno: chaveTerreno, dimensoes: editor, itens: novosItens })} />
        </div>
        <div id="historico-quintal" hidden={!verHistorico}>
          <HistoricoCultivo />
        </div>
      </CaixaDialogo>}

      {dialogo === "sisteminha" && <CaixaDialogo titulo="Sisteminha Embrapa" fechar={() => definirDialogo(null)}>
        <p>O Sisteminha Embrapa/UFU/Fapemig combina módulos de produção de alimentos para pequenos espaços.</p>
        <ol className="etapas">
          <li><strong>Observe o espaço.</strong> Identifique onde há água e área disponível para os módulos.</li>
          <li><strong>Conheça o tanque de peixes.</strong> A Embrapa apresenta o tanque como o primeiro módulo.</li>
          <li><strong>Conheça os outros módulos.</strong> Consulte os materiais oficiais e avalie o que sua família consegue cuidar.</li>
        </ol>
        <a className="link-fonte" href={fonteSisteminha} target="_blank" rel="noreferrer">Ver materiais e vídeos da Embrapa</a>
      </CaixaDialogo>}

      {dialogo === "creditos" && <CaixaDialogo titulo="Sobre as imagens" fechar={() => definirDialogo(null)}>
        <p>As quatro imagens dos cartões dos guias foram geradas por IA. O checklist de compostagem também inclui fotos do Wikimedia Commons com créditos e licenças junto a cada foto.</p>
      </CaixaDialogo>}

      {dialogo?.titulo && <CaixaDialogo titulo={dialogo.titulo} fechar={() => definirDialogo(null)}>
        <img className="foto-dialogo" src={`./imagens/${dialogo.id}.webp`} width="792" height="396" alt="" />
        <p>{dialogo.descricao}</p>
        {ConteudoGuia && <ConteudoGuia />}
        <a className="link-fonte" href={dialogo.url} target="_blank" rel="noreferrer">{dialogo.fonte}</a>
      </CaixaDialogo>}
    </div>
  );
}
