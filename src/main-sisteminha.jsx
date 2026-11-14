import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/dm-sans";
import "@fontsource/dm-serif-text/latin-400.css";
import Cabecalho from "./components/Cabecalho.jsx";
import Icone from "./components/Icone.jsx";
import "./styles/tokens.css";
import "./styles/home.css";
import "./styles/sisteminha.css";

const modulos = {
  tanque: {
    titulo: "Tanque de peixes",
    imagem: "sisteminha/tanque.webp",
    resumo: "Fornece peixes e água rica em nutrientes para o cultivo.",
    explicacao: "A água circula pelo sistema de filtragem. O sedimentador ajuda a separar resíduos sólidos, que podem seguir para a compostagem. Parte da água rica em nutrientes pode ser aproveitada na irrigação.",
  },
  compostagem: {
    titulo: "Compostagem",
    imagem: "compostagem.webp",
    resumo: "Transforma matéria orgânica em composto.",
    explicacao: "Resíduos do tanque, restos vegetais e material do galinheiro podem ser aproveitados na composteira conforme o manejo de cada material. O composto pode nutrir o solo, e parte do material já processado pode seguir para o minhocário.",
  },
  minhocario: {
    titulo: "Minhocário",
    imagem: "sisteminha/minhocario.webp",
    resumo: "Produz húmus para adubar os canteiros.",
    explicacao: "As minhocas transformam material orgânico previamente preparado em húmus. O húmus pode ser incorporado ao solo para fornecer nutrientes às plantas. O minhocário complementa a compostagem.",
  },
  horta: {
    titulo: "Horta",
    imagem: "horta.webp",
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

function Sisteminha() {
  useEffect(() => {
    const destino = document.getElementById(window.location.hash.slice(1));
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
            <a className="botao" href="#ciclo">Ver como funciona <Icone nome="seta" /></a>
          </div>
          <img src="./imagens/sisteminha/panorama.webp" width="1248" height="832"
            alt="Ilustração de um quintal com tanque circular de peixes, canteiros, composteira e galinheiro."
            fetchPriority="high" />
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

        <section className="sisteminha-secao" aria-labelledby="titulo-modulos">
          <h2 id="titulo-modulos">Conheça os módulos</h2>
          <p className="sisteminha-orientacao">Estes cinco componentes mostram uma das formas de integrar o Sisteminha. A escolha dos módulos pode variar conforme o espaço, os recursos e a rotina de quem vai cuidar.</p>
          <div className="sisteminha-detalhes">
            {Object.entries(modulos).map(([id, modulo]) => (
              <article className="sisteminha-detalhe" id={id} key={id} tabIndex={-1} aria-labelledby={`titulo-${id}`}>
                <h3 id={`titulo-${id}`}>{modulo.titulo}</h3>
                <p><strong>{modulo.resumo}</strong></p>
                <p>{modulo.explicacao}</p>
                <a className="sisteminha-voltar" href="#ciclo">Voltar ao ciclo</a>
              </article>
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

      <footer className="rodape sisteminha-rodape">
        <a href="./">Voltar para o Seu Quintal</a>
        <p>Imagens ilustrativas geradas por IA.</p>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Sisteminha />
  </StrictMode>,
);
