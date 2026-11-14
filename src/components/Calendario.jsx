import { useState } from "react";
import { consultarPlantio, fontePlantio, meses, regioes, totalCulturas } from "../data/plantio.js";
import Icone from "./Icone.jsx";

const inicial = { regiao: "Sudeste", mes: 11 };
const limiteResumo = 4;

export default function Calendario() {
  const [regiao, definirRegiao] = useState(inicial.regiao);
  const [mes, definirMes] = useState(inicial.mes);
  const [consulta, definirConsulta] = useState(inicial);
  const hortalicas = consultarPlantio(consulta.regiao, consulta.mes);
  const nomeMes = meses[consulta.mes - 1].toLowerCase();
  const mudou = regiao !== consulta.regiao || mes !== consulta.mes;
  const restantes = hortalicas.slice(limiteResumo);

  function consultar(evento) {
    evento.preventDefault();
    definirConsulta({ regiao, mes });
  }

  return (
    <section className="ferramenta" id="calendario" aria-labelledby="titulo-calendario">
      <h2 id="titulo-calendario"><Icone nome="muda" />Calendário de Plantio</h2>

      <form className="form-calendario" onSubmit={consultar}>
        <label className="campo linha-campo">
          Região
          <select value={regiao} onChange={(evento) => definirRegiao(evento.target.value)}>
            {regioes.map((opcao) => <option key={opcao}>{opcao}</option>)}
          </select>
        </label>
        <label className="campo linha-campo">
          Mês
          <select value={mes} onChange={(evento) => definirMes(Number(evento.target.value))}>
            {meses.map((opcao, indice) => <option key={opcao} value={indice + 1}>{opcao}</option>)}
          </select>
        </label>
        <button className="botao" type="submit">Consultar plantio</button>
      </form>

      <div className="resultado">
        <strong role="status">
          {mudou ? "Clique em Consultar plantio." :
            hortalicas.length === 0 ? "Sem resultados entre as culturas cadastradas." :
            `${hortalicas.length} ${hortalicas.length === 1 ? "opção" : "opções"} · ${consulta.regiao} · ${nomeMes}`}
        </strong>
        {!mudou && hortalicas.length > 0 && (
          <ul className="lista-culturas" aria-label="Culturas da consulta">
            {hortalicas.slice(0, limiteResumo).map((nome) => <li key={nome}>{nome}</li>)}
          </ul>
        )}
        {!mudou && restantes.length > 0 && (
          <details key={`${consulta.regiao}-${consulta.mes}`}>
            <summary>Ver mais {restantes.length} {restantes.length === 1 ? "opção" : "opções"}</summary>
            <ul className="lista-culturas">
              {restantes.map((nome) => <li key={nome}>{nome}</li>)}
            </ul>
          </details>
        )}
      </div>
      <p className="nota">
        {totalCulturas} culturas cadastradas. Confira o clima local.{" "}
        <a href={fontePlantio} target="_blank" rel="noreferrer">Tabela da Embrapa</a>
      </p>
    </section>
  );
}
