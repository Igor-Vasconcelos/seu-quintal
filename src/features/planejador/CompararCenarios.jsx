import { useState } from "react";
import { arredondarMedida, distancia, formatarMedida, pontosEntreBordas } from "./geometria.js";
import Planta from "./Planta.jsx";
import { conflitosEntreItens } from "./projetos.js";

function resumo(itens, terreno) {
  const casa = itens.find(({ tipo }) => tipo === "casa");
  const horta = itens.find(({ tipo }) => tipo === "horta");
  const acesso = itens.find(({ tipo }) => tipo === "acesso");
  const manobra = itens.find(({ tipo }) => tipo === "manobra");
  return [
    ["Itens na planta", itens.length],
    ["Sobreposições", conflitosEntreItens(itens).length],
    ["Casa até a frente", casa ? `${formatarMedida(terreno.comprimento - casa.y - casa.comprimento)} m` : "—"],
    ["Casa até a horta", casa && horta ? `${formatarMedida(arredondarMedida(distancia(...pontosEntreBordas(casa, horta))))} m` : "—"],
    ["Acesso para caminhão", acesso ? `${formatarMedida(acesso.largura)} × ${formatarMedida(acesso.comprimento)} m` : "—"],
    ["Área de manobra", manobra ? `${formatarMedida(manobra.largura * manobra.comprimento)} m²` : "—"],
  ];
}

export default function CompararCenarios({ projeto, terreno, mostrarExistentes }) {
  const [primeiro, definirPrimeiro] = useState(projeto.ativo);
  const [segundo, definirSegundo] = useState(() => projeto.cenarios.find(({ id }) => id !== projeto.ativo).id);

  return (
    <section aria-labelledby="titulo-comparacao" className="comparacao-terrenos">
      <h3 id="titulo-comparacao">Comparar cenários</h3>
      <p className="nota">As duas plantas usam a mesma escala.</p>
      <div className="comparacao-grade">
        {[primeiro, segundo].map((id, indice) => {
          const cenario = projeto.cenarios.find((opcao) => opcao.id === id);
          const visiveis = mostrarExistentes ? cenario.itens : cenario.itens.filter((item) => !item.existente);
          const outros = projeto.cenarios.filter((opcao) => opcao.id !== (indice ? primeiro : segundo));
          const conflitos = new Set(conflitosEntreItens(cenario.itens).flatMap((par) => par.map((item) => item.id)));
          return (
            <article key={indice} className="cartao-planta">
              <label className="campo">{indice ? "Segundo cenário" : "Primeiro cenário"}
                <select value={id} onChange={(evento) => (indice ? definirSegundo : definirPrimeiro)(evento.target.value)}>
                  {outros.map((opcao) => <option key={opcao.id} value={opcao.id}>{opcao.nome}</option>)}
                </select>
              </label>
              <Planta terreno={terreno} itens={visiveis} conflitos={conflitos}
                estrada={projeto.estrada} declive={projeto.declive} mostrarFrente />
              <dl className="comparacao-resumo">
                {resumo(cenario.itens, terreno).map(([rotulo, valor]) => (
                  <div key={rotulo}><dt>{rotulo}</dt><dd>{valor}</dd></div>
                ))}
              </dl>
            </article>
          );
        })}
      </div>
    </section>
  );
}
