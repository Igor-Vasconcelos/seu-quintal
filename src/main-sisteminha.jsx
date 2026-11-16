import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/dm-sans";
import "@fontsource/dm-serif-text/latin-400.css";
import Cabecalho from "./components/Cabecalho.jsx";
import CaixaDialogo from "./components/CaixaDialogo.jsx";
import Icone from "./components/Icone.jsx";
import Rodape from "./components/Rodape.jsx";
import { guiaAnimais } from "./data/guias.js";
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
    resumo: "Aproveita água e adubo para produzir alimentos.",
    explicacao: "Os canteiros podem receber água do tanque para irrigação e usar composto ou húmus no solo. Depois da colheita, restos vegetais adequados podem voltar à composteira, dando continuidade ao aproveitamento dos resíduos.",
  },
  galinheiro: {
    titulo: "Galinheiro",
    imagem: "animais.webp",
    resumo: "Fornece ovos e material para a compostagem.",
    explicacao: "Além dos ovos, o galinheiro fornece cama usada, uma mistura de material de forração e dejetos que pode seguir para compostagem com manejo adequado.",
  },
};

const caminhos = [
  {
    id: "agua",
    titulo: "Caminho da água",
    etapas: [["tanque", "Tanque de peixes"], ["horta", "Irrigação da horta"]],
  },
  {
    id: "residuos",
    titulo: "Caminho dos resíduos",
    etapas: [
      ["tanque", "Tanque de peixes"],
      ["galinheiro", "Galinheiro"],
      ["compostagem", "Compostagem"],
      ["minhocario", "Minhocário"],
      ["horta", "Adubo para a horta"],
    ],
  },
];

function Caminho({ id, titulo, etapas }) {
  return (
    <div className={`caminho caminho-${id}`}>
      <h3>{titulo}</h3>
      <ol className="caminho-etapas">
        {etapas.map(([destino, rotulo], indice) => (
          <li key={destino}>
            {indice > 0 && (
              <span className="caminho-conector" aria-hidden="true">
                {id === "residuos" && indice === 1 ? "+" : <Icone nome="seta" />}
              </span>
            )}
            <a href={`#${destino}`}>{rotulo}</a>
          </li>
        ))}
      </ol>
    </div>
  );
}

function DetalheModulo({ id, modulo }) {
  const [destino, rotulo] = modulo.conexao;

  return (
    <article className="sisteminha-detalhe sisteminha-modulo" id={id}
      tabIndex={-1} aria-labelledby={`titulo-${id}`}>
      <img className="sisteminha-modulo-imagem" src={`./imagens/${modulo.imagem}`}
        alt={modulo.descricaoImagem} loading="lazy" />

      <div className="sisteminha-modulo-conteudo">
        <header>
          <h3 id={`titulo-${id}`}>{modulo.titulo}</h3>
          <p className="sisteminha-modulo-resumo">{modulo.resumo}</p>
        </header>
        <p className="sisteminha-modulo-explicacao">{modulo.explicacao}</p>

        <div className="sisteminha-modulo-acoes">
          <a className="botao botao-contorno" href={`#${destino}`}>
            {rotulo} <Icone nome="seta" />
          </a>
          {id === "horta" && <a className="sisteminha-voltar" href="./horta/">Abrir guia de horta</a>}
          <a className="sisteminha-voltar sisteminha-link-ciclo" href="#ciclo">
            <Icone nome="seta" /> Voltar ao ciclo
          </a>
        </div>
      </div>
    </article>
  );
}

function DetalheGalinheiro({ modulo }) {
  return (
    <article className="sisteminha-detalhe sisteminha-galinheiro" id="galinheiro"
      tabIndex={-1} aria-labelledby="titulo-galinheiro">
      <header className="galinheiro-intro">
        <a className="sisteminha-voltar sisteminha-link-ciclo" href="#ciclo">
          <Icone nome="seta" /> Voltar ao ciclo
        </a>
        <h3 id="titulo-galinheiro">{modulo.titulo}</h3>
        <p>{modulo.resumo}</p>
      </header>

      <img className="galinheiro-imagem" src={`./imagens/${modulo.imagem}`}
        width="792" height="396" alt="Galinhas caipiras ciscando perto de um galinheiro de madeira." loading="lazy" />

      <div className="galinheiro-orientacoes">
        <div>
          <h4>No ciclo do Sisteminha</h4>
          <p>{modulo.explicacao}</p>
        </div>
        <div>
          <h4>Antes de criar as aves</h4>
          <p>{guiaAnimais.descricao}</p>
        </div>
      </div>

      <div className="galinheiro-acoes">
        <a className="botao" href={guiaAnimais.url} target="_blank" rel="noreferrer">
          Ler o guia da Embrapa <Icone nome="seta" />
        </a>
        <a className="sisteminha-voltar" href="#compostagem">Ver compostagem</a>
      </div>
    </article>
  );
}

function Sisteminha() {
  const [verCreditos, definirVerCreditos] = useState(false);

  useEffect(() => {
    const destino = document.getElementById(window.location.hash.slice(1));
    destino?.focus({ preventScroll: true });
    destino?.scrollIntoView();
  }, []);

  return (
    <div className="pagina pagina-sisteminha" id="inicio">
      <a className="pular" href="#conteudo">Pular para o conteúdo</a>
      <Cabecalho sisteminha />

      <main id="conteudo" tabIndex={-1}>
        <section className="sisteminha-abertura" aria-labelledby="titulo-sisteminha">
          <div className="sisteminha-intro">
            <h1 id="titulo-sisteminha">Sisteminha Embrapa</h1>
            <p>O Sisteminha Embrapa, UFU e Fapemig integra diferentes formas de produzir alimentos no quintal. Veja como o tanque, a horta, o galinheiro e a compostagem aproveitam água e matéria orgânica.</p>
            <div className="sisteminha-intro-acoes">
              <a className="botao sisteminha-cta" href="#ciclo">Ver o ciclo <Icone nome="seta" /></a>
              <a className="sisteminha-intro-link" href="#modulos">Conhecer os módulos</a>
            </div>
          </div>
          <div className="sisteminha-panorama">
            <img src="./imagens/sisteminha/panorama.webp" width="1248" height="832"
              alt="Ilustração de um quintal com tanque circular de peixes, canteiros, composteira e galinheiro."
              fetchPriority="high" />
          </div>
        </section>

        <section className="sisteminha-secao" id="ciclo" aria-labelledby="titulo-ciclo" tabIndex={-1}>
          <h2 id="titulo-ciclo">Como funciona o ciclo</h2>
          <p className="sisteminha-orientacao">Escolha um tópico para entender sua função.</p>
          <div className="caminhos">
            {caminhos.map((caminho) => <Caminho key={caminho.id} {...caminho} />)}
          </div>
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

        <section className="sisteminha-secao" id="modulos" aria-labelledby="titulo-modulos" tabIndex={-1}>
          <h2 id="titulo-modulos">Conheça os módulos</h2>
          <p className="sisteminha-orientacao">Estes cinco componentes mostram uma das formas de integrar o Sisteminha. A escolha dos módulos pode variar conforme o espaço, os recursos e a rotina de quem vai cuidar.</p>
          <div className="sisteminha-detalhes">
            {Object.entries(modulos).map(([id, modulo]) => id === "galinheiro" ? (
              <DetalheGalinheiro key={id} modulo={modulo} />
            ) : (
              <DetalheModulo key={id} id={id} modulo={modulo} />
            ))}
          </div>
        </section>

        <aside className="sisteminha-fontes" aria-labelledby="titulo-fontes">
          <div>
            <h2 id="titulo-fontes">Materiais da Embrapa</h2>
            <p>Consulte os materiais oficiais para conhecer os demais módulos e ver orientações de montagem e manejo.</p>
          </div>
          <div className="sisteminha-fontes-links">
            <a className="botao" href="https://www.embrapa.br/web/meio-norte/sisteminha">Portal do Sisteminha</a>
            <a className="sisteminha-voltar" href="https://www.infoteca.cnptia.embrapa.br/handle/doc/1111791">Manual do tanque de peixes</a>
          </div>
        </aside>
      </main>

      <Rodape sisteminha aoVerCreditos={() => definirVerCreditos(true)} />

      {verCreditos && <CaixaDialogo titulo="Sobre as imagens" fechar={() => definirVerCreditos(false)}>
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
