import { useEffect, useState } from "react";
import CaixaDialogo from "./components/CaixaDialogo.jsx";
import Cabecalho from "./components/Cabecalho.jsx";
import Calendario from "./components/Calendario.jsx";
import CartoesGuias from "./components/CartoesGuias.jsx";
import Icone from "./components/Icone.jsx";
import Planejador from "./components/Planejador.jsx";
import Rodape from "./components/Rodape.jsx";
import { guias } from "./data/guias.js";
import { criarTerreno } from "./features/planejador/geometria.js";

const atalhos = [
  { destino: "./horta/", icone: "muda", titulo: "Começar uma horta", resumo: "Escolha plantas para o seu espaço e as horas de sol." },
  { destino: "#planejador", icone: "planta", titulo: "Planejar meu terreno", resumo: "Informe as medidas e desenhe onde vai cada área." },
  { destino: "./meu-quintal/#horta", icone: "calendario", titulo: "Montar uma agenda", resumo: "Planeje os lotes e acompanhe as datas da horta.", novaAba: true },
];

export default function App() {
  const [botaoCreditos, definirBotaoCreditos] = useState(null);

  useEffect(() => {
    const parametros = new URLSearchParams(window.location.search);
    if (criarTerreno(parametros.get("frente"), parametros.get("profundidade"))) {
      window.location.replace(new URL(`./meu-quintal/${window.location.search}`, window.location.href));
      return;
    }
    const destino = document.getElementById(window.location.hash.slice(1));
    destino?.focus({ preventScroll: true });
    destino?.scrollIntoView({ behavior: "instant" });
  }, []);

  return (
    <div className="pagina-home" id="inicio">
      <a className="pular" href="#conteudo">Pular para o conteúdo</a>
      <Cabecalho pagina="inicio" />

      <main id="conteudo" tabIndex={-1}>
        <section className="home-abertura" aria-labelledby="titulo-home">
          <div className="home-miolo home-abertura-grade">
            <div className="home-abertura-texto">
              <h1 id="titulo-home">Cultive e planeje <em>seu quintal.</em></h1>
              <p>Descubra o que plantar na sua região, aprenda a cuidar da horta e organize seus canteiros, do primeiro plantio à colheita.</p>
              <div className="home-acoes">
                <a className="botao" href="#calendario">
                  Ver calendário <Icone nome="seta" />
                </a>
                <a className="botao botao-contorno" href="./meu-quintal/" target="_blank" rel="noopener"
                  aria-label="Abrir Meu Quintal (abre em nova aba)">
                  Meu Quintal <Icone nome="novaAba" />
                </a>
              </div>
            </div>
            <figure className="home-abertura-imagem">
              <img src="./imagens/abertura-horta-1200.webp"
                srcSet="./imagens/abertura-horta-768.webp 768w, ./imagens/abertura-horta-1200.webp 1200w"
                sizes="(max-width: 580px) 92vw, (max-width: 767px) 510px, (max-width: 1200px) 46vw, 550px"
                width="1200" height="900"
                alt="Canteiro de madeira com alfaces verdes e roxas, cebolinha e um vaso de temperos." fetchPriority="high" />
            </figure>
          </div>
        </section>

        <section className="home-miolo home-secao" aria-labelledby="titulo-atalhos">
          <h2 id="titulo-atalhos">O que você quer fazer?</h2>
          <ul className="home-atalhos">
            {atalhos.map(({ destino, icone, titulo, resumo, novaAba }) => (
              <li key={destino}>
                <a className="home-atalho" href={destino} target={novaAba ? "_blank" : undefined}
                  rel={novaAba ? "noopener" : undefined}>
                  <span className="atalho-icone"><Icone nome={icone} /></span>
                  <span className="atalho-texto">
                    <strong>{titulo}</strong>
                    <span>{resumo}</span>
                    {novaAba && <span className="visualmente-oculto"> (abre em nova aba)</span>}
                  </span>
                  <Icone nome={novaAba ? "novaAba" : "seta"} />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-ferramentas" id="ferramentas" aria-labelledby="titulo-ferramentas-home" tabIndex={-1}>
          <div className="home-miolo home-secao">
            <h2 id="titulo-ferramentas-home">Ferramentas do quintal</h2>
            <div className="ferramentas">
              <Calendario nivelTitulo={3} />
              <Planejador />
            </div>
          </div>
        </section>

        <section className="home-miolo home-secao" id="guias" aria-labelledby="titulo-guias" tabIndex={-1}>
          <div className="home-secao-topo">
            <h2 id="titulo-guias">Guias para cultivar</h2>
            <a className="home-link" href="./guias/">Ver todos os guias <Icone nome="seta" /></a>
          </div>
          <CartoesGuias itens={guias.slice(0, 3)} />
          <p className="nota">Quer aprender mais? <a href="./artigos/">Leia nossos artigos sobre horta, animais e planejamento.</a></p>
          <div className="home-temas" id="categorias" tabIndex={-1}>
            <h3>Explore por assunto</h3>
            <ul className="home-categorias">
              {guias.map((guia) => (
                <li key={guia.id}>
                  <a href={`./${guia.destino}`}>
                    <span className="categoria-simbolo" aria-hidden="true">{guia.simbolo}</span>
                    <span>{guia.assunto}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="home-miolo home-secao home-projetos" aria-label="Projetos para o quintal">
          <div className="home-meu-quintal" id="meu-quintal">
            <Icone nome="planta" />
            <h2>Meu Quintal</h2>
            <p>Reabra seus terrenos, veja a agenda e registre suas colheitas. Os dados ficam salvos neste navegador.</p>
            <a className="botao" href="./meu-quintal/" target="_blank" rel="noopener"
              aria-label="Abrir meus planos (abre em nova aba)">
              Abrir meus planos <Icone nome="novaAba" />
            </a>
          </div>
          <div className="home-sisteminha" id="sisteminha">
            <img src="./imagens/sisteminha.webp" width="379" height="104" alt="" loading="lazy" />
            <div>
              <h2>Sisteminha Embrapa</h2>
              <p>Veja como o tanque de peixes, o galinheiro, a horta e a compostagem se conectam num quintal produtivo.</p>
              <a className="home-link" href="./sisteminha.html">Conhecer o ciclo do Sisteminha <Icone nome="seta" /></a>
            </div>
          </div>
        </section>
      </main>

      <Rodape inicio aoVerCreditos={(evento) => definirBotaoCreditos(evento.currentTarget)} />

      {botaoCreditos && <CaixaDialogo titulo="Sobre as imagens" acionador={botaoCreditos} fechar={() => definirBotaoCreditos(null)}>
        <p>A imagem de abertura e os cartões da página inicial foram gerados por IA. Os guias de horta e de compostagem também incluem fotos do Wikimedia Commons, com créditos e licenças nos próprios guias.</p>
      </CaixaDialogo>}

    </div>
  );
}
