import { useState } from "react";
import { plantasHorta } from "../../data/plantas-horta.js";
import CalculadoraTerra from "./CalculadoraTerra.jsx";

const espacos = {
  janela: {
    nome: "Janela iluminada", detalhe: "Pequenos vasos em uma janela segura.",
    folhas: "Vasos firmes com furos, apoiados no lado interno.",
    frutos: "Um vaso firme no chão junto à janela, se houver espaço para a planta e o tutor.",
  },
  varanda: {
    nome: "Varanda", detalhe: "Jardineiras e vasos de diferentes tamanhos.",
    folhas: "Uma jardineira com drenagem ou vasos individuais.",
    frutos: "Um vaso maior com furos e um tutor para o tomateiro.",
  },
  quintal: {
    nome: "Quintal", detalhe: "Canteiros pequenos ou cultivo em recipientes.",
    folhas: "Um canteiro estreito, acessível sem pisar na terra, ou vasos.",
    frutos: "Um canteiro com boa drenagem ou um vaso maior com tutor.",
  },
};

const luzes = {
  pouca: {
    nome: "Menos de 3 horas", detalhe: "Luz direta por pouco tempo.",
    culturas: ["hortela", "salsinha"], recipiente: "folhas",
    passo: "Se o local for claro durante o dia, experimente uma muda de hortelã em vaso próprio. Se for escuro, procure um ponto mais iluminado.",
  },
  parcial: {
    nome: "3 a menos de 6 horas", detalhe: "Sol apenas em parte do dia.",
    culturas: ["alface", "rucula", "cebolinha"], recipiente: "folhas",
    passo: "Experimente uma muda de alface no melhor ponto de luz. Acompanhe a umidade da terra na primeira semana.",
  },
  pleno: {
    nome: "6 horas ou mais", detalhe: "Boa exposição ao sol direto.",
    culturas: ["tomate-cereja", "pimentao", "manjericao"], recipiente: "frutos",
    passo: "Se escolher tomate-cereja, use uma muda compacta e instale o tutor na hora do plantio.",
  },
};

const dicasPlantas = {
  hortela: "Cultive em um vaso próprio para conter o crescimento.",
  salsinha: "Observe o crescimento e ajuste o local se houver pouca luz.",
  alface: "Mantenha o solo levemente úmido, sem encharcar.",
  rucula: "Acompanhe a umidade e colha folhas desenvolvidas.",
  cebolinha: "Corte as folhas sem retirar a base da planta.",
  "tomate-cereja": "Escolha recipiente maior, boa luz e tutor.",
  pimentao: "Use um recipiente firme e acompanhe a irrigação.",
  manjericao: "Prefira local protegido de frio intenso e com boa luminosidade.",
};

const secoes = [
  { id: "plantas", rotulo: "Escolher plantas", numero: "1" },
  { id: "terra", rotulo: "Calcular terra", numero: "2" },
];

export default function GuiaHorta({ guia, raiz = "./" }) {
  const [secao, definirSecao] = useState("plantas");
  const [espaco, definirEspaco] = useState("");
  const [luz, definirLuz] = useState("");
  const sugestao = espaco && luz ? luzes[luz] : null;

  return (
    <div className="guia-horta horta-ferramentas-v2">
      <div className="horta-ferramentas-intro">
        <div>
          <span className="horta-sobretitulo">FERRAMENTAS GRATUITAS · SEM CADASTRO</span>
          <p>Comece escolhendo o ambiente e a luz. Depois, calcule a terra necessária para seu recipiente.</p>
        </div>
        <div className="horta-secoes" role="group" aria-label="Ferramentas para sua horta">
          {secoes.map(({ id, rotulo, numero }) => (
            <button key={id} type="button" className="horta-secao-botao"
              aria-controls={`guia-horta-${id}`} aria-pressed={secao === id}
              onClick={() => definirSecao(id)}>
              <span className="horta-secao-numero" aria-hidden="true">{numero}</span>
              {rotulo}
            </button>
          ))}
        </div>
      </div>

      <section id="guia-horta-plantas" className="horta-painel" hidden={secao !== "plantas"}
        aria-label="Escolha plantas para seu espaço">
        <div className="horta-painel-cabecalho">
          <h3>Descubra o que pode plantar</h3>
          <p>Responda duas perguntas rápidas para receber sugestões iniciais de cultivo.</p>
        </div>
        <div className="horta-escolhas">
          <fieldset className="horta-campo-escolha">
            <legend><span className="horta-numero" aria-hidden="true">1</span> Onde você vai plantar?</legend>
            <div className="horta-opcoes" role="group" aria-label="Escolha seu espaço">
              {Object.entries(espacos).map(([id, opcao]) => (
                <button key={id} type="button" aria-pressed={espaco === id}
                  className="horta-opcao" onClick={() => definirEspaco(id)}>
                  <strong>{opcao.nome}</strong>
                  <span>{opcao.detalhe}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="horta-campo-escolha">
            <legend><span className="horta-numero" aria-hidden="true">2</span> Quanto tempo de sol direto recebe?</legend>
            <p className="horta-ajuda">Conte apenas quando o sol bate diretamente no local, sem considerar luz indireta.</p>
            <div className="horta-opcoes" role="group" aria-label="Horas de sol direto por dia">
              {Object.entries(luzes).map(([id, opcao]) => (
                <button key={id} type="button" aria-pressed={luz === id}
                  className="horta-opcao" onClick={() => definirLuz(id)}>
                  <strong>{opcao.nome}</strong>
                  <span>{opcao.detalhe}</span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="horta-recomendacoes" aria-live="polite" aria-atomic="true">
          {!sugestao ? (
            <div className="horta-estado-inicial">
              <span className="horta-estado-icone" aria-hidden="true">✳</span>
              <div>
                <strong>Suas sugestões aparecem aqui</strong>
                <p>{!espaco ? "Primeiro, escolha onde será sua horta." : "Ótimo! Agora informe quantas horas de sol direto o local recebe."}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="horta-recomendacoes-titulo">
                <div>
                  <span className="horta-sobretitulo">IDEIAS PARA COMEÇAR</span>
                  <h4>Plantas para experimentar</h4>
                  <p>Para {espacos[espaco].nome.toLocaleLowerCase("pt-BR")}, com {luzes[luz].nome.toLocaleLowerCase("pt-BR")} de sol direto.</p>
                </div>
                <button type="button" className="horta-limpar" onClick={() => { definirEspaco(""); definirLuz(""); }}>
                  Refazer escolhas
                </button>
              </div>
              <ul className="culturas-com-fotos horta-culturas">
                {sugestao.culturas.map((id) => (
                  <li key={id}>
                    <img src={`${raiz}imagens/horta/${id}.webp`} width="360" height="240"
                      alt="" loading="lazy" />
                    <div className="horta-cultura-texto">
                      <strong>{plantasHorta[id].nome}</strong>
                      <p>{dicasPlantas[id]}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <dl className="horta-orientacoes">
                <div><dt>Onde plantar</dt><dd>{espacos[espaco][sugestao.recipiente]}</dd></div>
                <div><dt>Primeiro passo</dt><dd>{sugestao.passo}</dd></div>
              </dl>
              <div className="horta-proximos-passos">
                <a className="botao" href={`${raiz}horta/calendario-de-plantio/`}>Ver calendário da minha região</a>
                <a className="botao botao-contorno" href={`${raiz}horta/canteiros/`}>Desenhar meu canteiro</a>
              </div>
              <p className="horta-ressalva">Sugestões para experimentar, não garantia de desenvolvimento. Verifique temperatura, variedade, profundidade do recipiente e drenagem.</p>
              <details className="creditos-culturas">
                <summary>Fontes técnicas e créditos das fotografias</summary>
                <a href="https://www.sistemafaep.org.br/wp-content/uploads/2026/01/PR.0390-Jardins-produtivos-horas-e-pomares_web.pdf"
                  target="_blank" rel="noopener noreferrer">SENAR-PR · Luminosidade e cultivo</a>
                {" · "}<a href={guia.url} target="_blank" rel="noopener noreferrer">{guia.fonte}</a>
                <ul>
                  {sugestao.culturas.map(id => {
                    const { nome, arquivo, autor, licenca, codigo } = plantasHorta[id];
                    return <li key={id}>
                      <a href={`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(arquivo.replaceAll(" ", "_"))}`}
                        target="_blank" rel="noopener noreferrer">{nome} · {autor}</a>
                      {" · "}{codigo ? <a href={`https://creativecommons.org/licenses/${codigo}/`}
                        target="_blank" rel="noopener noreferrer">{licenca}</a> : licenca}
                    </li>;
                  })}
                </ul>
              </details>
            </>
          )}
        </div>
      </section>

      <div id="guia-horta-terra" className="horta-painel" hidden={secao !== "terra"}>
        <CalculadoraTerra />
      </div>
    </div>
  );
}
