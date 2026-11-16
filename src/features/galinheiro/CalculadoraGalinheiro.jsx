import { useEffect, useRef, useState } from "react";
import Icone from "../../components/Icone.jsx";
import { lerMedida } from "../planejador/geometria.js";
import { diasPorMes, estimarGalinheiro, referenciaCorte, referenciaPostura } from "./estimativa.js";

const finalidades = [
  { id: "postura", nome: "Postura", produto: "Ovos" },
  { id: "corte", nome: "Corte", produto: "Carne" },
  { id: "mista", nome: "Mista", produto: "Ovos e carne" },
];
const numero = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 3 });
const mensagemMedia = "Informe uma média de 0,01 a 7 ovos por poedeira por semana.";

function faixa([minimo, maximo], unidade) {
  return `${numero.format(minimo)} a ${numero.format(maximo)} ${unidade}`;
}

function ResultadoGalinheiro({ estimativa }) {
  const resultado = useRef(null);
  const { postura, corte, totalSimultaneo } = estimativa;

  useEffect(() => {
    resultado.current?.focus();
  }, [estimativa]);

  return (
    <section className="galinheiro-resultado" tabIndex={-1} ref={resultado} aria-labelledby="galinheiro-resultado-titulo">
      <h5 id="galinheiro-resultado-titulo">Seu plantel estimado</h5>
      <dl className="galinheiro-numeros">
        {postura && <div><dt>Poedeiras em produção</dt><dd>{numero.format(postura.aves)}</dd></div>}
        {corte && <div><dt>Frangos para iniciar o lote</dt><dd>{numero.format(corte.aves)}</dd></div>}
        {postura && corte && <div><dt>Aves ao mesmo tempo</dt><dd>{numero.format(totalSimultaneo)}</dd></div>}
      </dl>

      <div className="galinheiro-detalhes-resultado">
        {postura && <div>
          <h6>Estimativa para as poedeiras</h6>
          <dl className="galinheiro-medidas">
            <div><dt>Média de ovos por semana</dt><dd>{numero.format(postura.ovosSemana)}</dd></div>
            <div><dt>Ração por dia</dt><dd>{faixa(postura.racaoDia, "kg")}</dd></div>
            <div><dt>Ração em {diasPorMes} dias</dt><dd>{faixa(postura.racaoMes, "kg")}</dd></div>
            <div><dt>Água de beber por dia</dt><dd>{numero.format(postura.aguaDia)} L</dd></div>
          </dl>
        </div>}
        {corte && <div>
          <h6>Estimativa para o lote de corte</h6>
          <dl className="galinheiro-medidas">
            <div><dt>Meta de frangos por saída</dt><dd>{numero.format(corte.metaPorLote)}</dd></div>
            <div><dt>Ração para todo o lote</dt><dd>{numero.format(corte.racaoLote)} kg</dd></div>
            <div><dt>Água de beber por dia</dt><dd>{faixa(corte.aguaDia, "L")}</dd></div>
          </dl>
          <p className="nota">Primeira saída após {corte.diasCriacao} dias de criação. As saídas seguintes ficam
            espaçadas em {corte.diasTotais} dias, com {referenciaCorte.diasEntreLotes} dias entre lotes.</p>
        </div>}
      </div>

      <p className="nota">Confira se o abrigo, o piquete e sua rotina comportam essa quantidade.
        Deixe água à vontade e reserve água extra para dias quentes e limpeza.</p>
      {corte && <p className="nota">A meta mensal é uma média ao longo dos ciclos. O cálculo usa como referência
        que {numero.format(corte.viabilidade)}% dos frangos completem o ciclo.</p>}
    </section>
  );
}

export default function CalculadoraGalinheiro() {
  const [tipo, definirTipo] = useState("postura");
  const [estimativa, definirEstimativa] = useState(null);
  const [erro, definirErro] = useState("");
  const incluiPostura = tipo !== "corte";
  const incluiCorte = tipo !== "postura";
  const erroMedia = erro === mensagemMedia;

  function calcular(evento) {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    const dados = new FormData(formulario);
    const media = lerMedida(dados.get("ovosPorPoedeira"));
    if (incluiPostura && (media === null || media > 7)) {
      definirErro(mensagemMedia);
      formulario.elements.namedItem("ovosPorPoedeira").focus();
      return;
    }

    const resultado = estimarGalinheiro({
      tipo,
      ovosSemana: Number(dados.get("ovosSemana")),
      ovosPorPoedeira: media,
      frangosMes: Number(dados.get("frangosMes")),
      diasCriacao: Number(dados.get("diasCriacao")),
    });
    definirEstimativa(resultado);
    definirErro(resultado ? "" : "Informe metas em números inteiros maiores que zero. Para um valor muito alto, reduza a meta.");
  }

  return (
    <section className="galinheiro-calculadora" id="calculadora-galinheiro" tabIndex={-1}
      aria-labelledby="titulo-calculadora-galinheiro">
      <h4 id="titulo-calculadora-galinheiro">Quantas aves criar?</h4>
      <p>Informe o que você quer produzir para estimar o tamanho da criação e o consumo das aves.</p>
      <form className="galinheiro-form" onSubmit={calcular} onChange={() => {
        definirEstimativa(null);
        definirErro("");
      }}>
        <fieldset>
          <legend>Tipo de criação</legend>
          <div className="galinheiro-tipos">
            {finalidades.map(({ id, nome, produto }) => (
              <label className="galinheiro-tipo" key={id}>
                <input name="tipo" type="radio" value={id} checked={tipo === id} onChange={() => definirTipo(id)} />
                <span><strong>{nome}</strong><small>{produto}</small></span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="galinheiro-campos">
          <label className="campo" hidden={!incluiPostura}>
            Ovos desejados por semana
            <input type="number" inputMode="numeric" name="ovosSemana" min="1" step="1" placeholder="Ex. 24"
              required disabled={!incluiPostura} />
          </label>
          <label className="campo" hidden={!incluiPostura}>
            Média de ovos por poedeira por semana
            <input name="ovosPorPoedeira" inputMode="decimal" defaultValue={referenciaPostura.ovosPorSemana}
              aria-describedby={erroMedia ? "ajuda-media-galinheiro erro-galinheiro" : "ajuda-media-galinheiro"}
              aria-invalid={erroMedia || undefined} disabled={!incluiPostura} />
          </label>
          <label className="campo" hidden={!incluiCorte}>
            Frangos desejados por mês
            <input type="number" inputMode="numeric" name="frangosMes" min="1" step="1" placeholder="Ex. 4"
              required disabled={!incluiCorte} />
          </label>
          <label className="campo" hidden={!incluiCorte}>
            Dias de criação até a saída do lote
            <select name="diasCriacao" defaultValue={referenciaCorte.diasPadrao} disabled={!incluiCorte}>
              {Object.keys(referenciaCorte.ciclos).map((dias) => <option key={dias} value={dias}>{dias} dias</option>)}
            </select>
          </label>
        </div>
        {incluiPostura && <p className="nota" id="ajuda-media-galinheiro">
          Use {referenciaPostura.ovosPorSemana} ovos por semana como ponto de partida ou informe a média que você já observa.
        </p>}
        {incluiCorte && <p className="nota">
          Modelo com um lote de frango colonial por vez e {referenciaCorte.diasEntreLotes} dias entre lotes.
          {tipo === "mista" && " Poedeiras e frangos de corte ficam em grupos separados."}
        </p>}
        {erro && <p className="erro" id="erro-galinheiro" role="alert">{erro}</p>}
        <button className="botao" type="submit">Calcular plantel <Icone nome="seta" /></button>
      </form>

      {estimativa && <ResultadoGalinheiro estimativa={estimativa} />}

      <details className="galinheiro-calculo">
        <summary>Como a conta é feita</summary>
        <p>Para postura, dividimos os ovos desejados pela média semanal de cada poedeira e arredondamos para cima.
          Para corte, convertemos a meta mensal em meta por ciclo, somando criação e intervalo.
          O número inicial de frangos considera a proporção esperada de aves que completam esse ciclo.</p>
        <p>Os resultados usam {diasPorMes} dias por mês e indicadores de linhagens da Embrapa.
          <a href="#consumo-galinheiro"> Confira as referências de consumo</a> e
          <a href={referenciaCorte.fonteIntervalo}> o intervalo entre lotes</a>.</p>
      </details>
    </section>
  );
}
