import { useState } from "react";
import { plantasHorta } from "../../data/plantas-horta.js";
import CalculadoraTerra from "./CalculadoraTerra.jsx";

const espacos = {
  janela: { nome: "Janela bem iluminada", folhas: "Vasos firmes com furos, apoiados no lado interno.", frutos: "Um vaso firme no chão junto à janela, se houver espaço para a planta e o tutor." },
  varanda: { nome: "Varanda", folhas: "Uma jardineira com drenagem ou vasos individuais.", frutos: "Um vaso maior com furos e um tutor para o tomateiro." },
  quintal: { nome: "Quintal pequeno", folhas: "Um canteiro estreito, acessível sem pisar na terra, ou vasos.", frutos: "Um canteiro com boa drenagem ou um vaso maior com tutor." },
};

const luzes = {
  pouca: { nome: "Menos de 3 horas", culturas: ["hortela", "salsinha"], recipiente: "folhas", passo: "Se o local for claro durante o dia, experimente uma muda de hortelã em vaso próprio. Se for escuro, procure um ponto mais iluminado." },
  parcial: { nome: "De 3 a menos de 6 horas", culturas: ["alface", "rucula", "cebolinha"], recipiente: "folhas", passo: "Experimente uma muda de alface no melhor ponto de luz. Acompanhe a umidade da terra na primeira semana." },
  pleno: { nome: "6 horas ou mais", culturas: ["tomate-cereja", "pimentao", "manjericao"], recipiente: "frutos", passo: "Se escolher tomate-cereja, use uma muda compacta e instale o tutor na hora do plantio." },
};

const secoes = [
  { id: "plantas", rotulo: "O que plantar" },
  { id: "terra", rotulo: "Calculadora de terra" },
];

export default function GuiaHorta({ guia, raiz = "./" }) {
  const [secao, definirSecao] = useState("plantas");
  const [espaco, definirEspaco] = useState("");
  const [luz, definirLuz] = useState("");
  const sugestao = espaco && luzes[luz];

  return (
    <div className="guia-horta">
      <div className="acoes-guia secoes-quintal" role="group" aria-label="Seções do guia de horta">
        {secoes.map(({ id, rotulo }) => (
          <button className={`botao${secao === id ? "" : " botao-contorno"}`} key={id} type="button"
            aria-controls={`guia-horta-${id}`} aria-pressed={secao === id} onClick={() => definirSecao(id)}>
            {rotulo}
          </button>
        ))}
      </div>
      <div id="guia-horta-plantas" hidden={secao !== "plantas"}>
        <div className="guia-interativo escolhas-horta">
          <div className="campos-guia campos-guia-duplo">
            <label className="campo">Onde você vai plantar?
              <select value={espaco} onChange={(evento) => definirEspaco(evento.target.value)}>
                <option value="">Escolha o espaço</option>
                {Object.entries(espacos).map(([id, opcao]) => <option key={id} value={id}>{opcao.nome}</option>)}
              </select>
            </label>
            <label className="campo">Sol direto por dia
              <select value={luz} onChange={(evento) => definirLuz(evento.target.value)} aria-describedby="ajuda-horta-sol">
                <option value="">Escolha a duração</option>
                {Object.entries(luzes).map(([id, opcao]) => <option key={id} value={id}>{opcao.nome}</option>)}
              </select>
            </label>
          </div>
          <p className="nota" id="ajuda-horta-sol">Conte só o tempo em que o sol bate diretamente no local.</p>
          <div aria-live="polite">
            {sugestao && <>
              <h3>Plantas para experimentar</h3>
              <ul className="culturas-com-fotos">
                {sugestao.culturas.map((id) => (
                  <li key={id}>
                    <img src={`${raiz}imagens/horta/${id}.webp`} width="360" height="240" alt="" />
                    <strong>{plantasHorta[id].nome}</strong>
                  </li>
                ))}
              </ul>
              <dl className="painel-guia detalhes-horta">
                <div><dt>Onde plantar</dt><dd>{espacos[espaco][sugestao.recipiente]}</dd></div>
                <div><dt>Primeiro passo</dt><dd>{sugestao.passo}</dd></div>
              </dl>
            </>}
          </div>
          {sugestao && <details className="creditos-culturas">
            <summary>Fontes e créditos das fotos</summary>
            <a className="link-fonte" href="https://www.sistemafaep.org.br/wp-content/uploads/2026/01/PR.0390-Jardins-produtivos-horas-e-pomares_web.pdf" target="_blank" rel="noreferrer">
              Guia de luminosidade e cultivo · SENAR-PR
            </a>
            {" · "}<a className="link-fonte" href={guia.url} target="_blank" rel="noreferrer">{guia.fonte}</a>
            <p className="nota">Fotos do Wikimedia Commons, recortadas e convertidas para WebP.</p>
            <ul>
              {sugestao.culturas.map((id) => {
                const { nome, arquivo, autor, licenca, codigo } = plantasHorta[id];
                return <li key={id}>
                  <a href={`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(arquivo.replaceAll(" ", "_"))}`} target="_blank" rel="noreferrer">
                    {nome} · {autor}
                  </a>
                  {" · "}
                  {codigo ? (
                    <a href={`https://creativecommons.org/licenses/${codigo}/`} target="_blank" rel="noreferrer">{licenca}</a>
                  ) : licenca}
                </li>;
              })}
            </ul>
          </details>}
        </div>
      </div>
      <div id="guia-horta-terra" hidden={secao !== "terra"}>
        <CalculadoraTerra />
      </div>
    </div>
  );
}
