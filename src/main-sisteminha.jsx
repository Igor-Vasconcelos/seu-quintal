import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/dm-sans";
import "@fontsource/dm-serif-text/latin-400.css";
import Cabecalho from "./components/Cabecalho.jsx";
import CaixaDialogo from "./components/CaixaDialogo.jsx";
import Icone from "./components/Icone.jsx";
import Rodape from "./components/Rodape.jsx";
import Galinheiro from "./features/galinheiro/Galinheiro.jsx";
import FluxoSisteminha from "./features/sisteminha/FluxoSisteminha.jsx";
import { fichasSisteminha, etapasImplantacao, materiaisOficiais } from "./features/sisteminha/dadosSisteminha.js";
import "./styles/tokens.css";
import "./styles/home.css";
import "./styles/editorial.css";
import "./styles/sisteminha.css";

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
      <img className="sisteminha-modulo-imagem" src={"./imagens/" + modulo.imagem}
        alt={modulo.descricaoImagem} loading="lazy" />

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

        <div className="sisteminha-modulo-acoes">
          {ficha.links.map(link => (
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
    if (!idsDasAbas.has(hash) && hash !== "fontes") return;
    const alvo = Object.hasOwn(modulos, abaAtiva) ? "modulos" : abaAtiva;
    const destino = document.getElementById(alvo);
    destino?.focus({ preventScroll: true });
    destino?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [abaAtiva]);

  function navegarPeloConteudo(evento) {
    if (evento.defaultPrevented || evento.button !== 0 ||
      evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
    const link = evento.target.closest('a[href^="#"]');
    const hash = link?.getAttribute("href")?.slice(1);
    const aba = hash === "modulos" ? "tanque" : hash === "fontes" ? "materiais" : hash;
    if (!idsDasAbas.has(aba)) return;
    evento.preventDefault();
    definirAbaAtiva(aba);
    if (window.location.hash !== "#" + aba) {
      window.history.pushState(null, "", "#" + aba);
    }
    // Para um clique repetido na aba ativa, a rolagem continua funcionando.
    const destino = document.getElementById(Object.hasOwn(modulos, aba) ? "modulos" : aba);
    if (destino && aba === abaAtiva) destino.scrollIntoView({ block: "start" });
  }

  return (
    <div className="pagina pagina-sisteminha" id="inicio">
      <a className="pular" href="#conteudo">Pular para o conteúdo</a>
      <Cabecalho sisteminha />

      <main id="conteudo" tabIndex={-1} onClick={navegarPeloConteudo}>
        <section className="sisteminha-abertura" aria-labelledby="titulo-sisteminha">
          <div className="sisteminha-intro">
            <h1 id="titulo-sisteminha">Sisteminha Embrapa</h1>
            <p>O Sisteminha Embrapa, UFU e Fapemig combina diferentes formas de produzir alimentos no quintal. Entenda como a água do tanque pode ajudar na irrigação e como resíduos podem virar composto para a horta.</p>
            <div className="sisteminha-intro-acoes">
              <a className="botao sisteminha-cta" href="#ciclo">Ver o ciclo <Icone nome="seta" /></a>
              <a className="sisteminha-intro-link" href="#modulos">Conhecer os módulos</a>
            </div>
          </div>
          <div className="sisteminha-panorama">
            <img src="./imagens/sisteminha/panorama.webp" width="1248" height="832"
              srcSet="./imagens/sisteminha/panorama-720.webp 720w, ./imagens/sisteminha/panorama-960.webp 960w, ./imagens/sisteminha/panorama.webp 1248w"
              sizes="(max-width: 560px) calc(100vw - 1.5rem), (max-width: 767px) 33.5rem, (min-width: 1200px) 41rem, 55vw"
              alt="Ilustração de um quintal com tanque circular de peixes, canteiros, composteira e galinheiro."
              fetchPriority="high" />
          </div>
        </section>

        <nav className="sisteminha-nav-local" aria-label="Tópicos do Sisteminha">
          <div className="sisteminha-nav-rolagem">
            {nomesDasAbas.map(([id, titulo]) => (
              <a key={id} href={`#${id}`} aria-current={abaAtiva === id ? "page" : undefined}>
                {titulo}
              </a>
            ))}
            <a href="#fontes">Fontes oficiais</a>
          </div>
        </nav>

        <section className="sisteminha-secao" id="ciclo" hidden={abaAtiva !== "ciclo"} aria-labelledby="titulo-ciclo" tabIndex={-1}>
          <h2 id="titulo-ciclo">Como funciona o ciclo</h2>
          <p className="sisteminha-orientacao">Explore os caminhos da água, da matéria orgânica e dos alimentos.
            Toque em um componente para conhecer seus cuidados e conexões.</p>
          <FluxoSisteminha/>
          <ul className="sisteminha-cartoes">
            {Object.entries(modulos).map(([id, modulo]) => (
              <li key={id}>
                <a className="sisteminha-cartao" href={`#${id}`}>
                  <img src={`./imagens/${modulo.imagem}`} alt="" loading="lazy" />
                  <span>{modulo.titulo} <Icone nome="seta" /></span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="sisteminha-secao" id="modulos" aria-labelledby="titulo-modulos" tabIndex={-1}
          hidden={!Object.hasOwn(modulos, abaAtiva)}>
          <h2 id="titulo-modulos">{modulos[abaAtiva]?.titulo ?? "Conheça os módulos"}</h2>
          <p className="sisteminha-orientacao">Estes cinco componentes ilustram uma configuração integrada;
            o Sisteminha inclui outros módulos que podem ser combinados de acordo com recursos e manejo.</p>
          <div className="sisteminha-detalhes">
            {Object.entries(modulos).filter(([id]) => id === abaAtiva).map(([id, modulo]) => id === "galinheiro" ? (
              <Galinheiro key={id} modulo={modulo} />
            ) : (
              <DetalheModulo key={id} id={id} modulo={modulo} />
            ))}
          </div>
        </section>

        {abaAtiva === "integracao" && <IntegracaoSisteminha/>}
        {abaAtiva === "materiais" && <MateriaisSisteminha/>}
        <p className="sisteminha-rodape-tecnico">
          Conteúdo educativo independente. Os módulos e materiais apresentados devem ser adaptados
          às condições locais com orientação técnica.
        </p>
      </main>

      <Rodape sisteminha aoVerCreditos={(evento) => definirBotaoCreditos(evento.currentTarget)} />

      {botaoCreditos && <CaixaDialogo titulo="Sobre as imagens" acionador={botaoCreditos} fechar={() => definirBotaoCreditos(null)}>
        <p>O panorama e as imagens dos módulos do Sisteminha são ilustrações geradas por IA.</p>
      </CaixaDialogo>}
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Sisteminha />
  </StrictMode>,
);
