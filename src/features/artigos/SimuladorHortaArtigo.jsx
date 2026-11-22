import { useState } from "react";
import { regioes } from "../../data/plantio.js";
import { lerMedida, formatarMedida } from "../planejador/geometria.js";
import { todasCulturas } from "../organizador/catalogoCulturas.js";
import { calcularPlanoFamiliar, metaExemplo, intervaloPadrao } from "../organizador/planoFamiliar.js";
import { hojeCivil } from "../organizador/escala.js";
import VisualizacaoHorta from "../organizador/VisualizacaoHorta.jsx";
import "../../styles/simulador-horta-artigo.css";

/** Prévia educativa dentro do artigo: utiliza o mesmo motor, sem salvar dados. */
export default function SimuladorHortaArtigo() {
  const [pessoas, definirPessoas] = useState(4);
  const [cultura, definirCultura] = useState("Alface de verão");
  const [meta, definirMeta] = useState(null);
  const [intervalo, definirIntervalo] = useState(null);
  const [regiao, definirRegiao] = useState("Sudeste");
  const [inicio, definirInicio] = useState(hojeCivil);
  const quantidade = meta === null ? metaExemplo(cultura, pessoas) : lerMedida(meta, 0);
  const frequencia = intervalo === null ? intervaloPadrao(cultura) : Number(intervalo);
  const resultado = calcularPlanoFamiliar({
    modoEspaco: "automatico",
    pessoas, inicio, regiao, planosExistentes: [],
    preferencias: [{ cultura, casa: quantidade, venda: 0, intervalo: frequencia }],
  });
  const sugestao = resultado.erro ? null : resultado.sugestoes[0];
  function escolherCultura(evento) {
    definirCultura(evento.target.value);
    definirMeta(null);
    definirIntervalo(null);
  }
  return <div className="sq-horta-demo">
    <p>Faça um teste com uma cultura. O cálculo considera a demanda semanal e o espaço ocupado por lotes simultâneos; o desenho é ilustrativo, não uma planta em escala.</p>
    <div className="sq-horta-demo-campos">
      <label>Pessoas na casa
        <input type="number" min="1" max="20" step="1" value={pessoas}
          onChange={evento => definirPessoas(Number(evento.target.value))}/>
      </label>
      <label>Cultura
        <select value={cultura} onChange={escolherCultura}>
          {todasCulturas.map(nome => <option value={nome} key={nome}>{nome}</option>)}
        </select>
      </label>
      <label>Consumo por semana
        <input inputMode="decimal" value={meta === null ? String(metaExemplo(cultura, pessoas) ?? "") : meta}
          aria-label={"Consumo semanal de " + cultura} onChange={evento => definirMeta(evento.target.value)}/>
      </label>
      <label>Novo lote a cada (semanas)
        <input type="number" min="1" max="52" step="1"
          value={intervalo === null ? String(intervaloPadrao(cultura)) : intervalo}
          onChange={evento => definirIntervalo(evento.target.value)}/>
      </label>
      <label>Região do Brasil
        <select value={regiao} onChange={evento => definirRegiao(evento.target.value)}>
          {regioes.map(nome => <option key={nome} value={nome}>{nome}</option>)}
        </select>
      </label>
      <label>Iniciar primeiro lote em
        <input type="date" value={inicio} onChange={evento => definirInicio(evento.target.value)}/>
      </label>
    </div>
    {resultado.erro ? <p className="sq-horta-demo-erro" role="alert">{resultado.erro}</p>
      : <div aria-live="polite" aria-atomic="false" className="sq-horta-demo-resultado">
        <div className="sq-horta-demo-metricas">
          <p><span>Quanto plantar</span><strong>{sugestao.plantas} {sugestao.plantas === 1 ? "planta" : "plantas"} por lote</strong></p>
          <p><span>Área útil estimada</span><strong>{formatarMedida(resultado.areaNecessariaM2)} m²</strong></p>
          <p><span>Equivalente em 1 × 3 m</span><strong>{resultado.canteirosNecessarios} {resultado.canteirosNecessarios === 1 ? "canteiro" : "canteiros"}</strong></p>
        </div>
        {sugestao.experimental && <p className="sq-horta-demo-aviso">Lote experimental: o rendimento por planta ainda não foi medido. A meta informada não está garantida.</p>}
        {sugestao.alertaEpoca && <p className="sq-horta-demo-aviso">Atenção à época de plantio: {sugestao.alertaEpoca}</p>}
        <VisualizacaoHorta resultado={resultado} compacto/>
      </div>}
    <p className="sq-horta-demo-proxima"><a href="../../horta/organizador/#planejamento-familiar">Abrir ferramenta completa e adicionar à agenda</a></p>
    <p className="sq-horta-demo-nota">A simulação do artigo não salva dados nem os transfere automaticamente. Para continuar no Organizador, informe novamente suas escolhas. Confira as condições locais e a necessidade de corredores.</p>
  </div>;
}
