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

export default function App() {
  const [verCreditos, definirVerCreditos] = useState(false);

  useEffect(() => {
    const parametros = new URLSearchParams(window.location.search);
    if (criarTerreno(parametros.get("frente"), parametros.get("profundidade"))) {
      window.location.replace(new URL(`./meu-quintal/${window.location.search}`, window.location.href));
      return;
    }
    document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: "instant" });
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
                <a className="botao" href="./meu-quintal/" target="_blank" rel="noopener">
                  Abrir Meu Quintal <Icone nome="seta" />
                </a>
                <a className="home-link" href="#guias">Explorar guias de cultivo <Icone nome="seta" /></a>
              </div>
            </div>
            <figure className="home-abertura-imagem">
              <img src="./imagens/abertura-horta-1200.webp"
                srcSet="./imagens/abertura-horta-768.webp 768w, ./imagens/abertura-horta-1200.webp 1200w"
                sizes="(max-width: 540px) 92vw, (max-width: 767px) 510px, (max-width: 1240px) 42vw, 520px"
                width="1200" height="900"
                alt="Canteiro de madeira com alfaces verdes e roxas, cebolinha e um vaso de temperos." fetchPriority="high" />
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
            <h2 id="titulo-ferramentas-home">O que plantar e onde plantar</h2>
            <a className="home-link" href="./meu-quintal/#horta" target="_blank" rel="noopener">Organizador de horta <Icone nome="seta" /></a>
          </div>
          <div className="ferramentas">
            <Calendario />
            <Planejador />
          </div>
        </section>

        <section className="home-miolo home-secao home-projetos" aria-label="Projetos para o quintal">
          <div className="home-meu-quintal" id="meu-quintal">
            <Icone nome="planta" />
            <h2>Meu Quintal</h2>
            <p>Desenhe o terreno, compare posições para os canteiros e registre semeaduras e colheitas. Seus planos ficam salvos neste navegador.</p>
            <a className="botao" href="./meu-quintal/" target="_blank" rel="noopener">
              Abrir o painel <Icone nome="seta" />
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

      <Rodape inicio aoVerCreditos={() => definirVerCreditos(true)} />

      {verCreditos && <CaixaDialogo titulo="Sobre as imagens" fechar={() => definirVerCreditos(false)}>
        <p>A imagem de abertura e os cartões da página inicial foram gerados por IA. Os guias de horta e de compostagem também incluem fotos do Wikimedia Commons, com créditos e licenças nos próprios guias.</p>
      </CaixaDialogo>}

    </div>
  );
}
