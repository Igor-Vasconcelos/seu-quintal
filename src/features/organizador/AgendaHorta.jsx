import { useState } from "react";
import { formatarMedida } from "../planejador/geometria.js";
import {
  atividadesNoPeriodo, avancarDias, dataValida, dimensionarLote, hojeCivil,
  janelaDeDatas, situacaoDoPlantio,
} from "./escala.js";

export default function AgendaHorta({ planos, regiao, aoConcluir, bloqueado }) {
  const [data, definirData] = useState(hojeCivil);
  const [semanas, definirSemanas] = useState(12);
  const [cultivo, definirCultivo] = useState("");
  const [mostrarFeitas, definirMostrarFeitas] = useState(false);
  const [limite, definirLimite] = useState(10);
  const selecionado = planos.some(({ id }) => id === cultivo) ? cultivo : "";
  const de = dataValida(data) ? data : hojeCivil();
  const ate = avancarDias(de, semanas * 7 - 1);
  const atividades = atividadesNoPeriodo(planos.filter(({ id }) => !selecionado || id === selecionado), de, ate);
  const visiveis = atividades.filter(({ plano, chave }) => mostrarFeitas || !plano.concluidas.includes(chave));

  return (
    <section className="organizador-cartao" id="agenda-horta" aria-labelledby="titulo-agenda-horta">
      <div className="organizador-secao-cabecalho">
        <h2 id="titulo-agenda-horta">Agenda da horta</h2>
        <p>{janelaDeDatas(de, ate)}</p>
      </div>
      <div className="organizador-filtros">
        <label className="campo">A partir de
          <input type="date" value={data} onChange={(evento) => { definirData(evento.target.value); definirLimite(10); }} />
        </label>
        <label className="campo">Período
          <select value={semanas} onChange={(evento) => { definirSemanas(Number(evento.target.value)); definirLimite(10); }}>
            {[4, 8, 12, 16, 26].map((n) => <option key={n} value={n}>{n} semanas</option>)}
          </select>
        </label>
        <label className="campo">Cultivo
          <select value={selecionado} onChange={(evento) => { definirCultivo(evento.target.value); definirLimite(10); }}>
            <option value="">Todos os cultivos</option>
            {planos.map((plano) => (
              <option key={plano.id} value={plano.id}>{plano.cultura}{plano.canteiro && ` · ${plano.canteiro}`}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="organizador-concluidas">
        <input type="checkbox" checked={mostrarFeitas} onChange={(evento) => definirMostrarFeitas(evento.target.checked)} />
        Mostrar atividades concluídas
      </label>
      {visiveis.length ? <ul className="organizador-atividades">
        {visiveis.slice(0, limite).map((atividade) => {
          const { plano, numero, chave, canteiro } = atividade;
          const concluida = plano.concluidas.includes(chave);
          const alerta = atividade.id !== "colher" && situacaoDoPlantio(plano, regiao, canteiro.de, canteiro.ate);
          const quantidade = dimensionarLote(plano).plantas;
          const cultura = plano.canteiro ? `${plano.cultura} · ${plano.canteiro}` : plano.cultura;
          return (
            <li key={`${plano.id}/${chave}`} className="organizador-atividade" data-feita={concluida}>
              <div className="organizador-atividade-data">{janelaDeDatas(atividade.de, atividade.ate)}</div>
              <div>
                <span className="organizador-fase" data-etapa={atividade.id}>{atividade.nome}</span>
                <h3>{cultura}</h3>
                <p>Lote {numero}{atividade.id !== "colher" && ` · ${formatarMedida(quantidade)} ${quantidade === 1 ? "planta" : "plantas"}`}</p>
                {alerta && <p className="organizador-alerta-epoca">{alerta}</p>}
              </div>
              <label className="organizador-concluidas organizador-atividade-status">
                <input type="checkbox" checked={concluida} disabled={bloqueado}
                  aria-label={`${atividade.nome} · ${cultura} · lote ${numero}`}
                  onChange={(evento) => aoConcluir(plano.id, chave, evento.target.checked)} />
                Feito
              </label>
            </li>
          );
        })}
      </ul> : <p className="organizador-vazio">
        {atividades.length ? "As atividades deste período estão concluídas." : "Nenhuma atividade nesse período. Escolha outra data ou aumente o período."}
      </p>}
      {visiveis.length > limite && <button type="button" className="botao botao-contorno"
        onClick={() => definirLimite(limite + 10)}>Mostrar mais atividades</button>}
    </section>
  );
}
