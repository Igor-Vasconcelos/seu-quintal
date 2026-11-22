import { useEffect, useState } from "react";
import { formatarMedida } from "../planejador/geometria.js";
import { calcularTerra, converterMedidaTerra } from "./calculoTerra.js";

const campos = [
  { id: "comprimento", rotulo: "Comprimento", exemplo: "60" },
  { id: "largura", rotulo: "Largura", exemplo: "25" },
  { id: "profundidade", rotulo: "Altura da terra", exemplo: "20" },
];

const modelos = [
  { id: "vaso", nome: "Vaso médio", detalhes: "30 × 30 × 25 cm", medidas: { comprimento: "30", largura: "30", profundidade: "25" } },
  { id: "jardineira", nome: "Jardineira", detalhes: "60 × 25 × 20 cm", medidas: { comprimento: "60", largura: "25", profundidade: "20" } },
  { id: "canteiro", nome: "Canteiro elevado", detalhes: "100 × 80 × 25 cm", medidas: { comprimento: "100", largura: "80", profundidade: "25" } },
];

const vazios = { comprimento: "", largura: "", profundidade: "", saco: "" };

export default function CalculadoraTerra({ sugestaoCultivo = null, voltarParaSugestoes }) {
  const [unidade, definirUnidade] = useState("cm");
  const [valores, definirValores] = useState(vazios);
  const [modelo, definirModelo] = useState("");
  const [resultado, definirResultado] = useState(null);
  const [invalidos, definirInvalidos] = useState([]);
  const [enviou, definirEnviou] = useState(false);
  const [referenciaAtual, definirReferenciaAtual] = useState(null);

  useEffect(() => {
    if (!sugestaoCultivo) return;
    // Só uma ação explícita "Calcular terra para..." deve preencher o exemplo.
    const valoresIniciais = { ...vazios, ...sugestaoCultivo.medidas };
    definirUnidade("cm");
    definirValores(valoresIniciais);
    definirModelo("");
    definirResultado(calcularTerra(valoresIniciais, "cm").resultado);
    definirInvalidos([]);
    definirEnviou(true);
    definirReferenciaAtual(sugestaoCultivo);
  }, [sugestaoCultivo]);

  function mudarCampo(nome, valor) {
    definirValores(atuais => ({ ...atuais, [nome]: valor }));
    definirResultado(null);
    definirInvalidos(atuais => atuais.filter(item => item !== nome));
    definirEnviou(false);
    if (nome !== "saco") definirModelo("");
  }

  function mudarUnidade(nova) {
    definirValores(atuais => ({
      ...atuais,
      ...Object.fromEntries(campos.map(({ id }) => [id, converterMedidaTerra(atuais[id], unidade, nova)])),
    }));
    definirUnidade(nova);
    definirResultado(null);
    definirInvalidos([]);
    definirEnviou(false);
  }

  function selecionarModelo(item) {
    definirReferenciaAtual(null);
    definirModelo(item.id);
    definirValores(atuais => ({
      ...atuais,
      ...Object.fromEntries(campos.map(({ id }) =>
        [id, unidade === "cm" ? item.medidas[id] : converterMedidaTerra(item.medidas[id], "cm", "m")]
      )),
    }));
    definirInvalidos([]);
    definirResultado(null);
    definirEnviou(false);
  }

  function calcular(evento) {
    evento.preventDefault();
    const calculo = calcularTerra(valores, unidade);
    definirInvalidos(calculo.invalidos);
    definirResultado(calculo.resultado);
    definirEnviou(true);
    if (calculo.invalidos.length) {
      evento.currentTarget.elements.namedItem(calculo.invalidos[0])?.focus();
    }
  }

  function limpar() {
    definirReferenciaAtual(null);
    definirValores(vazios);
    definirModelo("");
    definirResultado(null);
    definirInvalidos([]);
    definirEnviou(false);
  }

  return (
    <section id="calculadora-terra" className="horta-calculadora" aria-labelledby="titulo-terra">
      <div className="horta-painel-cabecalho">
        <h3 id="titulo-terra" tabIndex={-1}>Calcule a terra para seu espaço</h3>
        <p>Escolha um modelo para começar ou informe as medidas internas do recipiente retangular.</p>
      </div>
      {referenciaAtual && <div className="horta-cultivo-selecionado">
        <div>
          <span className="horta-sobretitulo">DA PLANTA PARA O RECIPIENTE</span>
          <strong>Exemplo para {referenciaAtual.nome}</strong>
          <p>{referenciaAtual.recipiente}</p>
          <p className="horta-ajuda">{referenciaAtual.aviso} As medidas foram preenchidas e o volume já foi calculado; você pode ajustá-las.</p>
        </div>
        {voltarParaSugestoes && <button type="button" className="horta-limpar"
          onClick={voltarParaSugestoes}>Voltar às plantas</button>}
      </div>}
      <div className="horta-calculadora-layout">
        <form noValidate className="form-guia form-terra" onSubmit={calcular}>
          <fieldset className="horta-modelos">
            <legend><span className="horta-numero" aria-hidden="true">1</span> Qual espaço parece com o seu?</legend>
            <div className="horta-opcoes">
              {modelos.map(item => (
                <button type="button" className="horta-opcao" aria-pressed={modelo === item.id}
                  key={item.id} onClick={() => selecionarModelo(item)}>
                  <strong>{item.nome}</strong><span>{item.detalhes}</span>
                </button>
              ))}
            </div>
            <p className="horta-ajuda">Modelos ilustrativos. Confira sempre as medidas reais e a drenagem.</p>
          </fieldset>

          <div className="horta-medidas-cabecalho">
            <h4><span className="horta-numero" aria-hidden="true">2</span> Confira as medidas</h4>
            <label className="campo">Unidade
              <select name="unidade" value={unidade} onChange={e => mudarUnidade(e.target.value)}
                aria-label="Unidade das medidas">
                <option value="cm">Centímetros (cm)</option>
                <option value="m">Metros (m)</option>
              </select>
            </label>
          </div>
          <p className="horta-ajuda" id="ajuda-unidade-terra">
            A unidade é igual para os três lados. Ao trocar, os valores preenchidos são convertidos automaticamente.
          </p>
          <div className="campos-guia campos-terra">
            {campos.map(({ id, rotulo, exemplo }) => (
              <label className="campo" key={id}>{rotulo} ({unidade})
                <input name={id} inputMode="decimal" autoComplete="off"
                  value={valores[id]} onChange={evento => mudarCampo(id, evento.target.value)}
                  placeholder={unidade === "cm" ? `Ex.: ${exemplo}` : `Ex.: ${converterMedidaTerra(exemplo, "cm", "m")}`}
                  required aria-invalid={invalidos.includes(id) || undefined}
                  aria-describedby={invalidos.includes(id) ? "erro-terra" : "ajuda-unidade-terra"} />
              </label>
            ))}
          </div>
          <label className="campo horta-saco-terra">Volume de cada saco de terra (L) <span className="horta-opcional">opcional</span>
            <input name="saco" inputMode="decimal" autoComplete="off" value={valores.saco}
              onChange={evento => mudarCampo("saco", evento.target.value)}
              placeholder="Ex.: 20" aria-invalid={invalidos.includes("saco") || undefined}
              aria-describedby={invalidos.includes("saco") ? "erro-terra" : "ajuda-saco-terra"} />
          </label>
          <p className="horta-ajuda" id="ajuda-saco-terra">
            Informe esse volume para descobrir quantos sacos inteiros comprar.
          </p>
          {invalidos.length > 0 && <p className="erro horta-erro" id="erro-terra" role="alert">
            Confira os campos destacados. Use números positivos, vírgula ou ponto (até {unidade === "m" ? "quatro" : "duas"} casas decimais nas medidas).
          </p>}
          <div className="horta-calculadora-acoes">
            <button className="botao" type="submit">Calcular terra</button>
            <button className="botao botao-contorno" type="button" onClick={limpar}>Limpar</button>
          </div>
        </form>

        <aside className="horta-resultado-card" aria-live="polite" aria-label="Resultado da calculadora de terra">
          <span className="horta-sobretitulo">RESULTADO</span>
          {resultado ? (
            <div className="horta-resultado-dados">
              <strong className="horta-resultado-volume">
                {resultado.litros < 0.0001 ? "Menos de 0,0001" : formatarMedida(resultado.litros)} <small>L</small>
              </strong>
              <span className="horta-resultado-label">Volume geométrico de terra</span>
              {resultado.quantidade !== null ? (
                <p className="horta-resultado-sacos">
                  <strong>{resultado.quantidade.toLocaleString("pt-BR")} {resultado.quantidade === 1n ? "saco" : "sacos"}</strong>
                  <span>do volume informado, arredondados para cima</span>
                </p>
              ) : <p className="horta-resultado-dica">Se souber o volume de cada saco, preencha o campo opcional para calcular a quantidade necessária.</p>}
            </div>
          ) : (
            <div className="horta-resultado-vazio">
              <span aria-hidden="true" className="horta-resultado-ilustracao">▤</span>
              <strong>{enviou ? "Corrija as medidas" : "Sua estimativa aparece aqui"}</strong>
              <p>{enviou ? "Confira os campos destacados no formulário." : "Escolha um exemplo ou informe comprimento, largura e altura para começar."}</p>
            </div>
          )}
          <div className="horta-resultado-premissas">
            <strong>Como calculamos</strong>
            <p>Comprimento × largura × altura, convertido em litros. O resultado não desconta camada de drenagem nem considera compactação ou perdas.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
