import { StrictMode, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/dm-sans";
import "@fontsource/dm-serif-text/latin-400.css";
import Cabecalho from "./components/Cabecalho.jsx";
import CaixaDialogo from "./components/CaixaDialogo.jsx";
import Icone from "./components/Icone.jsx";
import Rodape from "./components/Rodape.jsx";
import Galinheiro from "./features/galinheiro/Galinheiro.jsx";
import FluxoSisteminha from "./features/sisteminha/FluxoSisteminha.jsx";
import EsquemaModulo from "./features/sisteminha/EsquemaModulo.jsx";
import SaibaMaisModulo from "./features/sisteminha/SaibaMaisModulo.jsx";
import FerramentasModulo from "./features/sisteminha/FerramentasModulo.jsx";
import { fichasSisteminha, etapasImplantacao, materiaisOficiais } from "./features/sisteminha/dadosSisteminha.js";
import "./styles/tokens.css";
import "./styles/home.css";
import "./styles/editorial.css";
import "./styles/sisteminha.css";
import "./styles/editorial-mockup.css";

const modulos = {
  tanque: {
    titulo: "Tanque de peixes",
    imagem: "sisteminha/tanque.webp",
    descricaoImagem: "Tanque circular com peixes e tubulação à beira da água.",
    conexao: ["horta", "Ver horta"],
    resumo: "Fornece peixes e água rica em nutrientes para o cultivo.",
    explicacao: "A água circula pelo sistema de filtragem. O sedimentador ajuda a separar resíduos sólidos, que podem seguir para a compostagem. Parte da água rica em nutrientes pode ser aproveitada na irrigação.",
  },
  compostagem: {
    titulo: "Compostagem",
    imagem: "compostagem.webp",
    descricaoImagem: "Mãos segurando composto ao lado de uma composteira de madeira.",
    conexao: ["minhocario", "Ver minhocário"],
    resumo: "Transforma matéria orgânica em composto.",
    explicacao: "Resíduos do tanque, restos vegetais e material do galinheiro podem ser aproveitados na composteira conforme o manejo de cada material. O composto pode nutrir o solo, e parte do material já processado pode seguir para o minhocário.",
  },
  minhocario: {
    titulo: "Minhocário",
    imagem: "sisteminha/minhocario.webp",
    descricaoImagem: "Minhocas sobre húmus em um minhocário.",
    conexao: ["horta", "Ver horta"],
    resumo: "Produz húmus para adubar os canteiros.",
    explicacao: "As minhocas transformam material orgânico previamente preparado em húmus. O húmus pode ser incorporado ao solo para fornecer nutrientes às plantas. O minhocário complementa a compostagem.",
  },
  horta: {
    titulo: "Horta",
    imagem: "horta.webp",
    descricaoImagem: "Canteiros com hortaliças cultivadas no quintal.",
    conexao: ["compostagem", "Ver compostagem"],
    resumo: "Integra hortaliças e, quando há espaço, frutíferas ao aproveitamento de água e composto.",
    explicacao: "Os canteiros podem receber água do tanque para irrigação e usar composto ou húmus no solo. Depois da colheita, restos vegetais adequados podem voltar à composteira, dando continuidade ao aproveitamento dos resíduos.",
  },
  galinheiro: {
    titulo: "Galinheiro",
    imagem: "animais.webp",
    resumo: "Fornece ovos e material para a compostagem.",
    explicacao: "Além dos ovos, o galinheiro fornece cama usada, uma mistura de material de forração e dejetos que pode seguir para compostagem com manejo adequado.",
  },
};

// Navegação por hash: preserva links existentes. URLs próprias para cada módulo
// serão uma evolução de SEO, com páginas HTML indexáveis.
const nomesDasAbas = [
  ["ciclo", "Visão geral"],
  ["tanque", "Tanque de peixes"],
  ["galinheiro", "Galinheiro"],
  ["horta", "Horta e pomar"],
  ["compostagem", "Compostagem"],
  ["minhocario", "Minhocário"],
  ["integracao", "Como integrar"],
  ["materiais", "Materiais e fontes"],
];
const idsDasAbas = new Set(nomesDasAbas.map(([id]) => id));
const iconesAbas = {
  ciclo: "ciclo", tanque: "peixe", galinheiro: "galinha",
  horta: "muda", compostagem: "recycle", minhocario: "minhoca",
  integracao: "rede", materiais: "livro",
};

function abaPelaHash() {
  const hash = window.location.hash.slice(1);
  if (hash === "fontes") return "materiais";
  if (idsDasAbas.has(hash)) return hash;
  if (["calculadora-galinheiro", "consumo-galinheiro", "cuidados-galinheiro"].includes(hash)) return "galinheiro";
  return "ciclo";
}

function DetalheModulo({ id, modulo }) {
  const ficha = fichasSisteminha[id];
  const [destino, rotulo] = modulo.conexao;

  return (
    <article className="sisteminha-detalhe sisteminha-modulo" id={id}
      tabIndex={-1} aria-labelledby={"titulo-" + id}>
      <div className="sisteminha-modulo-midia">
        <figure className="sisteminha-foto">
          <a href={"./imagens/" + modulo.imagem} target="_blank" rel="noopener noreferrer"
            aria-label={"Abrir ilustração de " + modulo.titulo + " em tamanho original"}>
            <img className="sisteminha-modulo-imagem" src={"./imagens/" + modulo.imagem}
              alt={modulo.descricaoImagem} loading="lazy" decoding="async" />
          </a>
          <figcaption>Ilustração gerada por IA. <span>Toque para ver no tamanho original.</span></figcaption>
        </figure>
        <EsquemaModulo modulo={id}/>
      </div>

      <div className="sisteminha-modulo-conteudo">
        <header>
          <h3 id={"titulo-" + id}>{modulo.titulo}</h3>
          <p className="sisteminha-modulo-resumo">{modulo.resumo}</p>
        </header>
        <p className="sisteminha-modulo-explicacao">{modulo.explicacao}</p>

        <div className="sisteminha-ficha">
          <section>
            <h4>Para que serve?</h4>
            <p>{ficha.objetivo}</p>
          </section>
          <section>
            <h4>O que é necessário?</h4>
            <ul>{ficha.materiais.map(texto => <li key={texto}>{texto}</li>)}</ul>
          </section>
          <section>
            <h4>Manejo e cuidados</h4>
            <p>{ficha.manejo}</p>
            <p>{ficha.cuidados}</p>
          </section>
          <section>
            <h4>Como se conecta?</h4>
            <p>{ficha.ligacoes}</p>
          </section>
        </div>

        <SaibaMaisModulo modulo={id}/>
        <div className="sisteminha-modulo-acoes">
          {ficha.links.filter(link => link.href.startsWith("https://")).map(link => (
            <a key={link.href} className="botao botao-contorno" href={link.href}
              {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              {link.titulo} <Icone nome="seta"/>
            </a>
          ))}
          <a className="sisteminha-voltar" href={"#" + destino}>{rotulo} <Icone nome="seta"/></a>
          <a className="sisteminha-voltar sisteminha-link-ciclo" href="#ciclo">
            <Icone nome="seta"/> Voltar ao ciclo
          </a>
        </div>
      </div>
    </article>
  );
}

function IntegracaoSisteminha() {
  return (
    <section className="sisteminha-secao" id="integracao" aria-labelledby="titulo-integracao" tabIndex={-1}>
      <div className="sisteminha-secao-intro">
        <p className="sisteminha-kicker">DA IDEIA AO QUINTAL</p>
        <h2 id="titulo-integracao">Como integrar os módulos</h2>
        <p>Não é necessário instalar tudo ao mesmo tempo. O objetivo é aproveitar recursos e produzir alimentos,
          respeitando o tamanho do espaço, a rotina e os cuidados com os animais.</p>
      </div>
      <ol className="sisteminha-etapas-integracao">
        {etapasImplantacao.map((etapa, indice) => (
          <li key={etapa.titulo}>
            <span className="sisteminha-numero">{String(indice + 1).padStart(2, "0")}</span>
            <div><h3>{etapa.titulo}</h3><p>{etapa.explicacao}</p></div>
          </li>
        ))}
      </ol>
      <div className="sisteminha-integracao-recado">
        <h3>O que não fazer</h3>
        <p>Não trate a água do tanque como água potável, não aplique dejetos animais frescos na horta e
          não dimensione tanques ou instalações somente por fotografias. Procure a orientação técnica da Embrapa
          e das instituições locais antes de construir.</p>
      </div>
      <div className="sisteminha-acoes-externas">
        <a className="botao" href="./meu-quintal/">Planejar o espaço no Meu Quintal</a>
        <a className="botao botao-contorno" href="#materiais">Consultar materiais oficiais</a>
      </div>
    </section>
  );
}

function MateriaisSisteminha() {
  return (
    <section className="sisteminha-secao" id="materiais" aria-labelledby="titulo-materiais" tabIndex={-1}>
      <div className="sisteminha-secao-intro">
        <p className="sisteminha-kicker">BIBLIOTECA TÉCNICA</p>
        <h2 id="titulo-materiais">Materiais e fontes</h2>
        <p>Use a página como introdução. A implantação e o manejo exigem consultar as publicações técnicas,
          especialmente sobre qualidade da água, tratamento de resíduos e bem-estar animal.</p>
      </div>
      <ul className="sisteminha-materiais-grade">
        {materiaisOficiais.map(item => <li key={item.url}>
          <h3>{item.titulo}</h3>
          <p>{item.detalhe}</p>
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            Acessar na Embrapa <Icone nome="seta" />
          </a>
        </li>)}
      </ul>
      <div className="sisteminha-integracao-recado">
        <h3>Sobre o conteúdo do Seu Quintal</h3>
        <p>Esta é uma explicação independente, inspirada em publicações da Embrapa; não é um portal oficial.
          As imagens educativas ilustrativas foram geradas por IA e não representam uma instalação real validada.</p>
      </div>
    </section>
  );
}

function Sisteminha() {
  const [botaoCreditos, definirBotaoCreditos] = useState(null);
  const [abaAtiva, definirAbaAtiva] = useState(abaPelaHash);
  const veioDeClique = useRef(false);
  const foiMontado = useRef(false);

  useEffect(() => {
    const atualizarPeloHistorico = () => {
      const hash = window.location.hash.slice(1);
      // Âncoras de fontes, topo e controles internos não alteram o módulo ativo.
      if (idsDasAbas.has(hash) || hash === "fontes" ||
        ["calculadora-galinheiro", "consumo-galinheiro", "cuidados-galinheiro"].includes(hash)) {
        definirAbaAtiva(abaPelaHash());
      }
    };
    window.addEventListener("popstate", atualizarPeloHistorico);
    window.addEventListener("hashchange", atualizarPeloHistorico);
    return () => {
      window.removeEventListener("popstate", atualizarPeloHistorico);
      window.removeEventListener("hashchange", atualizarPeloHistorico);
    };
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const ancorasGalinheiro = ["calculadora-galinheiro", "consumo-galinheiro", "cuidados-galinheiro"];
    if (!idsDasAbas.has(hash) && hash !== "fontes" && !ancorasGalinheiro.includes(hash)) return;
    const primeiroAcesso = !foiMontado.current;
    foiMontado.current = true;
    const alvo = ancorasGalinheiro.includes(hash) ? hash :
      Object.hasOwn(modulos, abaAtiva) ? "modulos" : abaAtiva;
    const clique = veioDeClique.current;
    veioDeClique.current = false;
    // Um quadro de renderização garante que o tópico novo já esteja disponível.
    const quadro = window.requestAnimationFrame(() => {
      const destino = document.getElementById(alvo);
      if (!destino) return;
      const reducao = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const movimento = reducao || (primeiroAcesso && !clique) ? "auto" : "smooth";
      // O alvo recebe o foco após a troca: leitores de tela encontram o novo título.
      destino.focus({ preventScroll: true });
      destino.scrollIntoView({ block: "start", behavior: movimento });
    });
    return () => window.cancelAnimationFrame(quadro);
  }, [abaAtiva]);

  function navegarPeloConteudo(evento) {
    if (evento.defaultPrevented || evento.button !== 0 ||
      evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
    const link = evento.target.closest('a[href^="#"]');
    const hash = link?.getAttribute("href")?.slice(1);
    const aba = hash === "modulos" ? "tanque" : hash === "fontes" ? "materiais" : hash;
    if (!idsDasAbas.has(aba)) return;
    evento.preventDefault();
    veioDeClique.current = true;
    definirAbaAtiva(aba);
    if (window.location.hash !== "#" + aba) {
      window.history.pushState(null, "", "#" + aba);
    }
    // Para um clique repetido na aba ativa, a rolagem continua funcionando.
    const destino = document.getElementById(Object.hasOwn(modulos, aba) ? "modulos" : aba);
    if (destino && aba === abaAtiva) {
      const reducao = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      destino.scrollIntoView({ block: "start", behavior: reducao ? "auto" : "smooth" });
    }
  }

  return (
    <div className="pagina pagina-sisteminha sisteminha-ds3" id="inicio">
      <a className="pular" href="#conteudo">Pular para o conteúdo</a>
      <Cabecalho sisteminha />

      <main id="conteudo" tabIndex={-1} onClick={navegarPeloConteudo}>
        <section className="sisteminha-abertura" aria-labelledby="titulo-sisteminha">
          <div className="sisteminha-intro">
            <span className="sisteminha-hero-selo"><Icone nome="muda"/> TECNOLOGIA SOCIAL</span>
            <h1 id="titulo-sisteminha">Sisteminha Embrapa</h1>
            <p>O Sisteminha Embrapa, UFU e Fapemig combina diferentes formas de produzir alimentos no quintal. Entenda como a água do tanque pode ajudar na irrigação e como resíduos podem virar composto para a horta.</p>
            <div className="sisteminha-intro-acoes">
              <a className="botao sisteminha-cta" href="#ciclo">Ver o ciclo <Icone nome="seta" /></a>
              <a className="sisteminha-intro-link" href="#modulos">Conhecer os módulos</a>
            </div>
            <small className="sisteminha-hero-credito">Cena ilustrativa sintética gerada por IA, não fotografia de instalação real.</small>
          </div>
          <div className="sisteminha-panorama">
            <picture>
              <source type="image/avif" srcSet="./imagens/sisteminha/hero-realista-v4.avif"/>
              <img src="./imagens/sisteminha/hero-realista-v4.webp" width="1280" height="720"
                alt="Cena sintética realista de quintal com tanque de peixes, canteiros de hortaliças, composteira e duas galinhas de anatomia normal junto ao galinheiro."
                fetchPriority="high" decoding="async"/>
            </picture>
          </div>
        </section>

        <nav className="sisteminha-nav-local" aria-label="Tópicos do Sisteminha">
          <div className="sisteminha-nav-rolagem">
            {nomesDasAbas.map(([id, titulo]) => (
              <a key={id} href={`#${id}`} aria-current={abaAtiva === id ? "page" : undefined}>
                <Icone nome={iconesAbas[id]}/><span>{titulo}</span>
              </a>
            ))}
          </div>
        </nav>

        <p className="sisteminha-visualmente-oculto" role="status" aria-live="polite" aria-atomic="true">
          Tópico selecionado: {nomesDasAbas.find(([id]) => id === abaAtiva)?.[1]}
        </p>

        <section className="sisteminha-secao sisteminha-transicao-conteudo" id="ciclo" hidden={abaAtiva !== "ciclo"} aria-labelledby="titulo-ciclo" tabIndex={-1}>
          <div className="sisteminha-panorama-editorial">
            <div className="sisteminha-panorama-texto">
              <p className="sisteminha-kicker">VISÃO GERAL</p>
              <h2 id="titulo-ciclo">O que é o Sisteminha Embrapa?</h2>
              <p>É uma tecnologia social de produção integrada que combina módulos para
                produzir alimentos e aproveitar recursos de forma responsável.
                Cada família pode planejar o que cabe no seu espaço.</p>
              <p className="sisteminha-nota-editorial">A integração depende de manejo, tratamento adequado,
                espaço disponível e orientação técnica. Não é um circuito único nem uma garantia de produção.</p>
            </div>
            <figure className="sisteminha-panorama-imagem">
              <img src="./imagens/sisteminha/panorama.webp"
                srcSet="./imagens/sisteminha/panorama-720.webp 720w, ./imagens/sisteminha/panorama-960.webp 960w, ./imagens/sisteminha/panorama.webp 1248w"
                sizes="(max-width: 767px) 94vw, 42vw" width="1248" height="832"
                loading="lazy" decoding="async"
                alt="Ilustração educativa com tanque de peixes, galinheiro, horta e composteira organizados em um quintal."/>
              <figcaption>Representação ilustrativa gerada por IA, não fotografia de instalação oficial.</figcaption>
            </figure>
            <aside className="sisteminha-panorama-beneficios">
              <h3><Icone nome="muda"/> Principais benefícios</h3>
              <ul>
                <li>Produção diversificada conforme os módulos escolhidos</li>
                <li>Maior aproveitamento responsável dos recursos</li>
                <li>Organização de pequenas áreas produtivas</li>
                <li>Oportunidade de planejar a alimentação familiar</li>
              </ul>
              <p>Investimento e resultados variam conforme a escala e o manejo.</p>
            </aside>
          </div>
          <div className="sisteminha-ciclo-titulo">
            <h2>Entenda os caminhos do ciclo</h2>
            <p>Água, matéria orgânica e alimentos possuem processos próprios. Explore cada rota.</p>
          </div>
          <FluxoSisteminha/>
          <ul className="sisteminha-cartoes">
            {Object.entries(modulos).map(([id, modulo]) => (
              <li key={id}>
                <a className="sisteminha-cartao" href={`#${id}`}>
                  <img src={`./imagens/${modulo.imagem}`} alt="" loading="lazy" decoding="async" />
                  <span>{modulo.titulo} <Icone nome="seta" /></span>
                </a>
              </li>
            ))}
          </ul>
          <section className="sisteminha-visao-beneficios" aria-labelledby="beneficios-sisteminha">
            <div>
              <p className="sisteminha-kicker">CONHEÇA ANTES DE CONSTRUIR</p>
              <h3 id="beneficios-sisteminha">O que torna o Sisteminha diferente?</h3>
              <p>É uma tecnologia social de produção integrada: cada módulo tem uma função e as conexões
                ajudam a aproveitar recursos, sempre com tratamento e manejo adequados.</p>
            </div>
            <ul>
              <li><strong>Produção diversificada</strong><span>Peixes, aves e vegetais, conforme os módulos escolhidos.</span></li>
              <li><strong>Reaproveitamento responsável</strong><span>Água e matéria orgânica podem voltar ao cultivo após o tratamento correto.</span></li>
              <li><strong>Adaptação ao espaço</strong><span>O arranjo e a escala precisam caber na rotina, no orçamento e no terreno.</span></li>
            </ul>
          </section>
        </section>

        <section className="sisteminha-secao" id="modulos" aria-labelledby="titulo-modulos" tabIndex={-1}
          hidden={!Object.hasOwn(modulos, abaAtiva)}>
          <h2 id="titulo-modulos">{modulos[abaAtiva]?.titulo ?? "Conheça os módulos"}</h2>
          <p className="sisteminha-orientacao">Estes cinco componentes ilustram uma configuração integrada;
            o Sisteminha inclui outros módulos que podem ser combinados de acordo com recursos e manejo.</p>
          <FerramentasModulo modulo={abaAtiva}/>
          <div className="sisteminha-detalhes sisteminha-transicao-conteudo" key={abaAtiva}>
            {Object.entries(modulos).filter(([id]) => id === abaAtiva).map(([id, modulo]) => id === "galinheiro" ? (
              <div key={id} className="sisteminha-galinheiro-conjunto">
                <Galinheiro modulo={modulo} />
                <EsquemaModulo modulo="galinheiro" />
                <SaibaMaisModulo modulo="galinheiro" />
              </div>
            ) : (
              <DetalheModulo key={id} id={id} modulo={modulo} />
            ))}
          </div>
        </section>

        {abaAtiva === "integracao" && <div className="sisteminha-transicao-conteudo" key="integracao"><IntegracaoSisteminha/></div>}
        {abaAtiva === "materiais" && <div className="sisteminha-transicao-conteudo" key="materiais"><MateriaisSisteminha/></div>}
        <p className="sisteminha-rodape-tecnico">
          Conteúdo educativo independente. Os módulos e materiais apresentados devem ser adaptados
          às condições locais com orientação técnica.
        </p>
      </main>

      <Rodape sisteminha aoVerCreditos={(evento) => definirBotaoCreditos(evento.currentTarget)} />

      {botaoCreditos && <CaixaDialogo titulo="Sobre as imagens" acionador={botaoCreditos} fechar={() => definirBotaoCreditos(null)}>
        <p>O hero utiliza uma cena fotográfica sintética gerada por IA, não um registro de instalação real nem oficial da Embrapa. As demais imagens e diagramas são educativos e devem ser revisados tecnicamente antes de qualquer execução.</p>
      </CaixaDialogo>}
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Sisteminha />
  </StrictMode>,
);

import "./styles/tool-ui-v3.css";
