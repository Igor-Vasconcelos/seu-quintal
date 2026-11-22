import { useEffect, useState } from "react";
import CaixaDialogo from "./components/CaixaDialogo.jsx";
import Cabecalho from "./components/Cabecalho.jsx";
import Calendario from "./components/Calendario.jsx";
import CartoesGuias from "./components/CartoesGuias.jsx";
import Icone from "./components/Icone.jsx";
import Planejador from "./components/Planejador.jsx";
import Rodape from "./components/Rodape.jsx";
import { guias } from "./data/guias.js";
import artigosPublicados from "./data/artigos-publicados.json";
import { criarTerreno } from "./features/planejador/geometria.js";

const atalhos = [
  { destino: "./horta/", icone: "muda", titulo: "Começar uma horta", resumo: "Escolha plantas para o seu espaço e as horas de sol." },
  { destino: "#planejador", icone: "planta", titulo: "Planejar meu terreno", resumo: "Informe as medidas e desenhe onde vai cada área." },
  { destino: "./horta/organizador/", icone: "calendario", titulo: "Montar uma agenda", resumo: "Planeje os lotes e acompanhe as datas da horta." },
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
              <span className="home-hero-selo"><Icone nome="muda"/> SEU QUINTAL, SUAS POSSIBILIDADES</span>
              <h1 id="titulo-home">Cultive seu espaço, <em>do primeiro vaso ao sítio.</em></h1>
              <p>Da primeira muda ao seu sítio: artigos confiáveis, ferramentas gratuitas e planejamento para aproveitar melhor o espaço que você tem.</p>
              <div className="home-acoes">
                <a className="botao" href="#ferramentas">
                  Explorar ferramentas <Icone nome="seta" />
                </a>
                <a className="botao botao-contorno" href="./artigos/">
                  Ler artigos
                </a>
              </div>
              <span className="home-hero-garantia"><Icone nome="muda"/> Ferramentas gratuitas e sem cadastro</span>
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


        <nav className="home-trilhas home-miolo" aria-label="Explorar assuntos">
          <a href="./artigos/" className="home-trilha-atual"><Icone nome="muda" /> Todos os conteúdos</a>
          <a href="./horta/"><Icone nome="muda" /> Horta</a>
          <a href="./ferramentas/calculadora-peixes/"><Icone nome="peixe" /> Peixes</a>
          <a href="./sisteminha.html#galinheiro"><Icone nome="planta" /> Aves</a>
          <a href="./ferramentas/calculadora-codornas/">Codornas</a>
          <a href="./ferramentas/planejador-de-pomar/"><Icone nome="arvore" /> Pomar</a>
          <a href="./guias/compostagem/">Compostagem</a>
          <a href="./guias/irrigacao/">Irrigação</a>
          <a href="./meu-quintal/">Planejamento</a>
          <a href="./sisteminha.html">Sisteminha</a>
        </nav>

        <section className="home-editorial home-miolo" id="guias" aria-label="Guias, artigos e ferramentas">
          <div className="home-editorial-coluna">
            <section aria-labelledby="titulo-guias">
              <div className="home-secao-topo">
                <div>
                  <h2 id="titulo-guias"><Icone nome="muda" /> Comece por aqui</h2>
                  <p className="home-secao-descricao">Guias práticos para aprender, planejar e colocar a mão na terra.</p>
                </div>
                <a className="home-link" href="./guias/">Ver todos os guias <Icone nome="seta" /></a>
              </div>
              <CartoesGuias itens={guias.slice(0, 4)} />
            </section>
            <section className="home-editorial-artigos" id="artigos" aria-labelledby="titulo-artigos">
              <div className="home-secao-topo">
                <div>
                  <h2 id="titulo-artigos"><Icone nome="muda" /> Artigos mais recentes</h2>
                  <p className="home-secao-descricao">Dúvidas do dia a dia e soluções para seu quintal.</p>
                </div>
                <a className="home-link" href="./artigos/">Ver todos os artigos <Icone nome="seta" /></a>
              </div>
              <ul className="home-artigos-grade">
                {artigosPublicados.slice(0, 4).map((artigo) => (
                  <li key={artigo.slug}>
                    <a className="home-artigo-cartao" href={`./artigos/${artigo.slug}/`}>
                      <img src={`.${artigo.imagem}`} width="792" height="446" alt="" loading="lazy" />
                      <div>
                        <span className="home-artigo-categoria">{artigo.categoria}</span>
                        <h3>{artigo.titulo}</h3>
                        <p>{artigo.descricao}</p>
                        <span className="home-artigo-acao">Ler artigo <Icone nome="seta" /></span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <aside className="home-editorial-ferramentas" aria-labelledby="titulo-ferramentas-rapidas">
            <h2 id="titulo-ferramentas-rapidas"><Icone nome="planta" /> Ferramentas para aplicar</h2>
            <p>Planeje, calcule e organize sua produção com ferramentas gratuitas.</p>
            <ul>
              {[
                { titulo: "Planejador de canteiros", descricao: "Organize suas culturas.", href: "./horta/canteiros/" },
                { titulo: "Calendário de plantio", descricao: "Saiba o que plantar.", href: "./horta/calendario-de-plantio/" },
                { titulo: "Calculadora de peixes", descricao: "Volume e planejamento.", href: "./ferramentas/calculadora-peixes/" },
                { titulo: "Calculadora de codornas", descricao: "Ovos, corte e consumo.", href: "./ferramentas/calculadora-codornas/" },
                { titulo: "Planejador de pomar", descricao: "Espaçamento e frutíferas.", href: "./ferramentas/planejador-de-pomar/" },
                { titulo: "Meu Quintal", descricao: "Organize sua propriedade.", href: "./meu-quintal/" },
              ].map(item => (
                <li key={item.href}><a href={item.href}><span><strong>{item.titulo}</strong><small>{item.descricao}</small></span><Icone nome="seta" /></a></li>
              ))}
            </ul>
            <a className="botao" href="./ferramentas/">Ver todas as ferramentas <Icone nome="seta" /></a>
          </aside>
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
            <div className="home-secao-topo">
              <div>
                <p className="home-sobretitulo">GRATUITAS E SEM CADASTRO</p>
                <h2 id="titulo-ferramentas-home">Ferramentas para planejar</h2>
                <p className="home-secao-descricao">Experimente o calendário de plantio e o planejador antes de criar qualquer conta.</p>
              </div>
            </div>
            <div className="ferramentas">
              <Calendario nivelTitulo={3} />
              <Planejador />
            </div>
            <p className="nota">Também pode <a href="./horta/canteiros/">desenhar um canteiro</a>,
              <a href="./ferramentas/calculadora-peixes/"> calcular volume e biomassa dos peixes</a>
              <a href="./ferramentas/calculadora-codornas/"> simular ovos, corte e ração das codornas</a>
              ou <a href="./ferramentas/planejador-de-pomar/">planejar o espaço das frutíferas</a> —
              gratuito e sem cadastro.</p>
          </div>
        </section>

        <section className="home-miolo home-secao home-projetos" aria-label="Projetos para o quintal">
          <div className="home-meu-quintal" id="meu-quintal">
            <Icone nome="planta" />
            <h2>Meu Quintal</h2>
            <p>Guarde seus terrenos, organize tarefas e acompanhe as colheitas. Por enquanto, os dados ficam salvos neste navegador e podem ser exportados por backup.</p>
            <a className="botao" href="./meu-quintal/">
              Abrir Meu Quintal <Icone nome="seta" />
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
