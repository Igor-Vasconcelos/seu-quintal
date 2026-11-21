import { fichasSisteminha } from "./dadosSisteminha.js";

// Conteúdo de aprofundamento opcional: sem sobrecarregar a primeira leitura do módulo.
export default function SaibaMaisModulo({ modulo }) {
  const dados = fichasSisteminha[modulo];
  return (
    <section className="sisteminha-aprofundamento" aria-labelledby={"aprofundamento-" + modulo}>
      <div className="sisteminha-aprofundamento-titulo">
        <p className="sisteminha-kicker">NA PRÁTICA</p>
        <h4 id={"aprofundamento-" + modulo}>Do planejamento ao cuidado diário</h4>
        <p>Um roteiro de observação e dúvidas frequentes para ajudar a entender o funcionamento do módulo.</p>
      </div>
      <ol className="sisteminha-passo-a-passo">
        {dados.etapas.map((etapa, indice) => (
          <li key={etapa.titulo}>
            <span className="sisteminha-etapa-numero" aria-hidden="true">{String(indice + 1).padStart(2, "0")}</span>
            <div><h5>{etapa.titulo}</h5><p>{etapa.texto}</p></div>
          </li>
        ))}
      </ol>
      <div className="sisteminha-mais-grupo">
        <section className="sisteminha-alertas">
          <h5>O que merece atenção?</h5>
          <ul>{dados.sinais.map(item => <li key={item}>{item}</li>)}</ul>
          <p>Esses sinais indicam necessidade de revisão do manejo ou avaliação técnica; não são diagnóstico.</p>
        </section>
        <section className="sisteminha-perguntas" aria-labelledby={"perguntas-" + modulo}>
          <h5 id={"perguntas-" + modulo}>Dúvidas frequentes</h5>
          {dados.perguntas.map(item => (
            <details key={item.pergunta}>
              <summary>{item.pergunta}</summary>
              <p>{item.resposta}</p>
            </details>
          ))}
        </section>
      </div>
    </section>
  );
}
