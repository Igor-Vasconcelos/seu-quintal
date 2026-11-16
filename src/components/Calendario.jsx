import { useState } from "react";
import { buscaFichaCultura, fonteFichaCultura } from "../data/fichas-culturas.js";
import { consultarPlantio, descreverEpocaPlantio, fontePlantio, meses, regioes, totalCulturas } from "../data/plantio.js";
import CaixaDialogo from "./CaixaDialogo.jsx";
import Icone from "./Icone.jsx";

const inicial = { regiao: "Sudeste", mes: 11 };
const limiteResumo = 4;

function ListaCulturas({ nomes, abrirFicha, rotulo }) {
  return (
    <ul className="lista-culturas" aria-label={rotulo}>
      {nomes.map((nome) => (
        <li key={nome}>
          <button className="cultura" type="button" aria-haspopup="dialog"
            onClick={(evento) => abrirFicha({ nome, acionador: evento.currentTarget })}>
            {nome} <Icone nome="seta" />
          </button>
        </li>
      ))}
    </ul>
  );
}

function FichaCultura({ nome, regiao, acionador, fechar }) {
  const ficha = buscaFichaCultura(nome);

  return (
    <CaixaDialogo titulo={nome} acionador={acionador} fechar={fechar}>
      <div className="ficha-cultura-epoca">
        <Icone nome="muda" />
        <div>
          <strong>Época de plantio · {regiao}</strong>
          <p>{descreverEpocaPlantio(nome, regiao)}</p>
        </div>
      </div>
      {ficha && (
        <dl className="ficha-cultura">
          <div><dt>Como plantar</dt><dd>{ficha.plantio}</dd></div>
          <div><dt>Cuidados</dt><dd>{ficha.cuidados}</dd></div>
          <div><dt>Quando colher</dt><dd>{ficha.colheita}</dd></div>
        </dl>
      )}
      <p className="nota">
        A época e o ciclo variam conforme a variedade, o clima local e o manejo.
      </p>
      <a className="link-fonte" href={ficha ? fonteFichaCultura(ficha.pagina) : fontePlantio}
        target="_blank" rel="noreferrer">
        {ficha ? "Consultar a cultura no catálogo Embrapa e Sebrae" : "Consultar a tabela da Embrapa"}
      </a>
    </CaixaDialogo>
  );
}

export default function Calendario({ titulo = "Calendário de Plantio" }) {
  const [regiao, definirRegiao] = useState(inicial.regiao);
  const [mes, definirMes] = useState(inicial.mes);
  const [consulta, definirConsulta] = useState(inicial);
  const [cultura, definirCultura] = useState(null);
  const hortalicas = consultarPlantio(consulta.regiao, consulta.mes);
  const nomeMes = meses[consulta.mes - 1].toLowerCase();
  const mudou = regiao !== consulta.regiao || mes !== consulta.mes;
  const restantes = hortalicas.slice(limiteResumo);

  function consultar(evento) {
    evento.preventDefault();
    definirConsulta({ regiao, mes });
  }

  return (
    <>
      <section className="ferramenta" id="calendario" aria-labelledby="titulo-calendario">
        <h2 id="titulo-calendario"><Icone nome="muda" />{titulo}</h2>

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
            <>
              <p className="resultado-instrucao">Selecione uma cultura para ver como plantar e colher.</p>
              <ListaCulturas nomes={hortalicas.slice(0, limiteResumo)} abrirFicha={definirCultura}
                rotulo="Culturas da consulta" />
            </>
          )}
          {!mudou && restantes.length > 0 && (
            <details key={`${consulta.regiao}-${consulta.mes}`}>
              <summary>Ver mais {restantes.length} {restantes.length === 1 ? "opção" : "opções"}</summary>
              <ListaCulturas nomes={restantes} abrirFicha={definirCultura} rotulo="Mais culturas da consulta" />
            </details>
          )}
        </div>
        <p className="nota">
          {totalCulturas} culturas cadastradas. Confira o clima local.{" "}
          <a href={fontePlantio} target="_blank" rel="noreferrer">Tabela da Embrapa</a>
        </p>
      </section>
      {cultura && <FichaCultura {...cultura} regiao={consulta.regiao} fechar={() => definirCultura(null)} />}
    </>
  );
}
