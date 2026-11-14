import { useState } from "react";
import CalculadoraTerra from "./CalculadoraTerra.jsx";

const espacos = {
  janela: { nome: "Janela bem iluminada", folhas: "vasos firmes com furos, apoiados no lado interno", frutos: "um vaso firme no chão junto à janela, se houver espaço para a planta e o tutor" },
  varanda: { nome: "Varanda", folhas: "uma jardineira com drenagem ou vasos individuais", frutos: "um vaso maior com furos e um tutor para o tomateiro" },
  quintal: { nome: "Quintal pequeno", folhas: "um canteiro estreito, acessível sem pisar na terra, ou vasos", frutos: "um canteiro com boa drenagem ou um vaso maior com tutor" },
};

const luzes = {
  pouca: { nome: "Menos de 3 horas", culturas: ["Hortelã", "Salsinha"], recipiente: "folhas", passo: "Se o local for claro durante o dia, experimente uma muda de hortelã em vaso próprio. Em um canto escuro, procure um ponto mais iluminado antes de montar a horta." },
  parcial: { nome: "De 3 a menos de 6 horas", culturas: ["Alface", "Rúcula", "Cebolinha"], recipiente: "folhas", passo: "Comece com uma muda de alface no ponto com mais luz, de preferência de manhã. Acompanhe a umidade da terra e o crescimento na primeira semana." },
  pleno: { nome: "6 horas ou mais", culturas: ["Tomate-cereja", "Pimentão", "Manjericão"], recipiente: "frutos", passo: "Se for plantar tomate-cereja, escolha uma muda compacta e instale o tutor na hora do plantio. Deixe espaço para circular ar ao redor da planta." },
};

export default function GuiaHorta() {
  const [espaco, definirEspaco] = useState("");
  const [luz, definirLuz] = useState("");
  const sugestao = luzes[luz];

  return (
    <div className="guia-interativo">
      <p>Observe por quanto tempo os raios de sol batem no local ao longo de um dia.</p>
      <div className="campos-guia campos-guia-duplo">
        <label className="campo">Onde você vai plantar?
          <select value={espaco} onChange={(evento) => definirEspaco(evento.target.value)}>
            <option value="">Escolha o espaço</option>
            {Object.entries(espacos).map(([id, opcao]) => <option key={id} value={id}>{opcao.nome}</option>)}
          </select>
        </label>
        <label className="campo">Sol direto por dia
          <select value={luz} onChange={(evento) => definirLuz(evento.target.value)}>
            <option value="">Escolha a duração</option>
            {Object.entries(luzes).map(([id, opcao]) => <option key={id} value={id}>{opcao.nome}</option>)}
          </select>
        </label>
      </div>
      <div aria-live="polite">
        {espaco && sugestao && (
          <div className="painel-guia">
            <h3>O que experimentar</h3>
            <ul className="lista-culturas">{sugestao.culturas.map((cultura) => <li key={cultura}>{cultura}</li>)}</ul>
            <p><strong>Onde plantar:</strong> {espacos[espaco][sugestao.recipiente]}.</p>
            <p><strong>Primeiro passo:</strong> {sugestao.passo}</p>
          </div>
        )}
      </div>
      <a className="link-fonte" href="https://www.sistemafaep.org.br/wp-content/uploads/2026/01/PR.0390-Jardins-produtivos-horas-e-pomares_web.pdf" target="_blank" rel="noreferrer">
        Guia de luminosidade e cultivo · SENAR-PR
      </a>
      <CalculadoraTerra />
    </div>
  );
}
