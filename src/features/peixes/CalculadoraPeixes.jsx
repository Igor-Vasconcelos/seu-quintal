import { useEffect, useRef, useState } from "react";
import Icone from "../../components/Icone.jsx";
import { especiesPeixes, estimarPeixes, fontesPeixes } from "./estimativa.js";

const formatar = (valor, casas = 2) => new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: casas,
}).format(valor);

function Resultado({ dados }) {
  const foco = useRef(null);
  useEffect(() => { foco.current?.focus(); }, [dados]);
  return <section className="simulador-resultado" aria-labelledby="resultado-peixes-titulo"
    tabIndex={-1} ref={foco}>
    <p className="simulador-selo">SIMULAÇÃO CONDICIONAL</p>
    <h3 id="resultado-peixes-titulo">Seu cenário de criação</h3>
    <dl className="simulador-indicadores">
      <div><dt>Volume útil estimado</dt><dd>{formatar(dados.litros, 0)} <small>L</small></dd></div>
      <div><dt>Peixes ao final (hipótese)</dt><dd>{formatar(dados.sobreviventes, 0)} <small>un.</small></dd></div>
      <div><dt>Biomassa final hipotética</dt><dd>{formatar(dados.biomassaFinalKg)} <small>kg</small></dd></div>
      <div><dt>Ração para o ganho simulado</dt><dd>{formatar(dados.racaoKg)} <small>kg</small></dd></div>
    </dl>
    <div className="simulador-detalhes">
      <p><strong>Área do espelho d’água:</strong> {formatar(dados.areaM2)} m².</p>
      <p><strong>Densidade resultante:</strong> {formatar(dados.densidadeSimuladaKgM3)} kg/m³.
        É apenas a densidade do cenário informado, <strong>não uma lotação recomendada.</strong></p>
      {dados.dias !== null && <p><strong>Duração informada:</strong> {formatar(dados.dias, 0)} dias.
        Não representa previsão de crescimento; o manejo alimentar varia com o estágio.</p>}
      <p><strong>Limite do modelo:</strong> a ração estimada considera só o ganho de peso dos sobreviventes.
        Não inclui perdas, desperdícios, variação do consumo ou exigências de cada fase.</p>
    </div>
    {dados.quantidadeProjeto !== null
      ? <aside className="simulador-resultado-projeto">
          <h4>Comparação com o seu projeto técnico</h4>
          <p>Com a densidade de projeto que você informou, caberiam <strong>{formatar(dados.quantidadeProjeto, 0)} peixes</strong>
            ao peso final escolhido, apenas pela conta de biomassa. A validade desse índice deve ser confirmada
            pelo responsável técnico e pelo monitoramento real da água.</p>
        </aside>
      : <p className="simulador-alerta" role="status">Não calculamos uma quantidade segura de povoamento:
          é necessário um índice de biomassa aprovado para seu sistema e confirmar aeração, filtragem e monitoramento.</p>}
    <p className="simulador-alerta">Verifique oxigênio dissolvido, temperatura, pH, amônia, nitrito,
      energia de reserva, origem da água e bem-estar animal antes de adquirir peixes.
      Espécie e sistema de cultivo mudam as condições de operação.</p>
  </section>;
}

export default function CalculadoraPeixes() {
  const [formato, definirFormato] = useState("circular");
  const [resultado, definirResultado] = useState(null);
  const [erro, definirErro] = useState("");
  const [especie, definirEspecie] = useState("tilapia");

  function calcular(evento) {
    evento.preventDefault();
    const form = evento.currentTarget;
    const dados = new FormData(form);
    const estimativa = estimarPeixes({
      especie, formato,
      diametro: dados.get("diametro"),
      largura: dados.get("largura"),
      comprimento: dados.get("comprimento"),
      profundidade: dados.get("profundidade"),
      quantidade: dados.get("quantidade"),
      pesoInicialGramas: dados.get("pesoInicialGramas"),
      pesoFinalGramas: dados.get("pesoFinalGramas"),
      sobrevivencia: dados.get("sobrevivencia"),
      conversaoAlimentar: dados.get("conversaoAlimentar"),
      diasCiclo: dados.get("diasCiclo"),
      densidadeProjeto: dados.get("densidadeProjeto"),
      densidadeValidada: dados.has("densidadeValidada"),
      aeracao: dados.has("aeracao"), filtragem: dados.has("filtragem"),
      monitoramento: dados.has("monitoramento"),
    });
    if (!estimativa) {
      definirResultado(null);
      definirErro("Confira as medidas, os pesos e os percentuais. O peso final deve ser igual ou maior que o inicial.");
      return;
    }
    definirErro("");
    definirResultado(estimativa);
  }

  return <section className="simulador-quintal simulador-peixes" aria-labelledby="titulo-simulador-peixes">
    <div className="simulador-apresentacao">
      <p className="simulador-selo"><Icone nome="peixe"/> FERRAMENTA GRATUITA</p>
      <h2 id="titulo-simulador-peixes">Simule seu tanque de peixes</h2>
      <p>Calcule o volume útil, a biomassa do lote e a ração para um cenário informado por você.
        A conta não define automaticamente quantos peixes é seguro criar.</p>
    </div>
    <form className="simulador-formulario" onSubmit={calcular}
      onChange={() => { definirResultado(null); definirErro(""); }}>
      <fieldset className="simulador-bloco">
        <legend>1. Seu tanque</legend>
        <div className="simulador-campos">
          <label className="campo">Formato
            <select value={formato} onChange={e => definirFormato(e.target.value)} name="formato">
              <option value="circular">Circular</option>
              <option value="retangular">Retangular</option>
            </select>
          </label>
          {formato === "circular" ? <label className="campo">
            Diâmetro interno (m)
            <input name="diametro" type="text" inputMode="decimal" defaultValue="3" required/>
          </label> : <>
            <label className="campo">Largura interna (m)
              <input name="largura" type="text" inputMode="decimal" defaultValue="3" required/>
            </label>
            <label className="campo">Comprimento interno (m)
              <input name="comprimento" type="text" inputMode="decimal" defaultValue="4" required/>
            </label>
          </>}
          <label className="campo">Profundidade útil da água (m)
            <input name="profundidade" type="text" inputMode="decimal" defaultValue="1" required/>
          </label>
          <label className="campo">Espécie
            <select name="especie" value={especie} onChange={e => definirEspecie(e.target.value)}>
              {especiesPeixes.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
            </select>
          </label>
        </div>
        <p className="nota">Informe a profundidade realmente preenchida com água, não a altura total da parede.
          O volume geométrico não representa a capacidade biológica do tanque.</p>
      </fieldset>
      <fieldset className="simulador-bloco">
        <legend>2. Cenário de crescimento</legend>
        <div className="simulador-campos">
          <label className="campo">Peixes inicialmente colocados
            <input type="number" name="quantidade" min="1" max="100000" step="1" defaultValue="20" required/>
          </label>
          <label className="campo">Peso inicial por peixe (g)
            <input name="pesoInicialGramas" type="text" inputMode="decimal" defaultValue="100" required/>
          </label>
          <label className="campo">Peso final desejado (g)
            <input name="pesoFinalGramas" type="text" inputMode="decimal" defaultValue="700" required/>
          </label>
          <label className="campo">Sobrevivência hipotética (%)
            <input name="sobrevivencia" type="text" inputMode="decimal" defaultValue="100" required/>
          </label>
          <label className="campo">Conversão alimentar hipotética (kg/kg)
            <input name="conversaoAlimentar" type="text" inputMode="decimal" defaultValue="1,5" required/>
          </label>
          <label className="campo">Duração planejada (dias) — opcional
            <input name="diasCiclo" type="number" min="1" max="3650" step="1" placeholder="Definida no seu manejo"/>
          </label>
        </div>
        <p className="nota">A conversão alimentar de 1,5 é um <strong>exemplo da Embrapa</strong>, não uma
          previsão para sua espécie ou instalação. Sobrevivência de 100% é hipótese inicial, não promessa.</p>
      </fieldset>
      <details className="simulador-avancado">
        <summary>Já tenho um projeto técnico para o povoamento</summary>
        <div className="simulador-avancado-corpo">
          <label className="campo">Densidade de biomassa definida no projeto (kg/m³)
            <input name="densidadeProjeto" inputMode="decimal" placeholder="Sem valor padrão"/>
          </label>
          <p>Este campo é opcional e não tem valor recomendado automático. Para exibir uma contagem
            referenciada nele, confirme as verificações abaixo:</p>
          <label><input type="checkbox" name="densidadeValidada"/> Índice adequado à espécie, peso e tipo de tanque, validado tecnicamente</label>
          <label><input type="checkbox" name="aeracao"/> Aeração/oxigênio dimensionados</label>
          <label><input type="checkbox" name="filtragem"/> Filtragem e tratamento dimensionados</label>
          <label><input type="checkbox" name="monitoramento"/> Monitoramento da qualidade da água previsto</label>
        </div>
      </details>
      {erro && <p className="erro" role="alert">{erro}</p>}
      <button className="botao simulador-calcular" type="submit">Calcular cenário <Icone nome="seta"/></button>
    </form>
    {resultado && <Resultado dados={resultado}/>}
    <details className="simulador-explicacao">
      <summary>Como os cálculos funcionam e quais são os limites?</summary>
      <p><strong>Volume:</strong> área do retângulo (largura × comprimento) ou do círculo (π × raio²), multiplicada
        pela profundidade útil. Um metro cúbico equivale a 1.000 litros.</p>
      <p><strong>Biomassa:</strong> sobreviventes × peso final. <strong>Ração:</strong> ganho de peso dos
        sobreviventes × conversão alimentar informada. O modelo não prevê taxa de crescimento nem mortalidade.</p>
      <p><strong>Densidade técnica:</strong> quando o usuário declara um índice validado e as condições críticas,
        a conta divide a biomassa total prevista pelo peso final. Não é uma recomendação de povoamento.</p>
    </details>
    <aside className="simulador-fontes" aria-label="Fontes técnicas da calculadora de peixes">
      <h3>Fontes e cuidados</h3>
      <ul>{fontesPeixes.map(f => <li key={f.url}><a href={f.url} target="_blank" rel="noopener noreferrer">{f.nome}</a></li>)}</ul>
      <p>Ferramenta independente do Seu Quintal. Consulte um técnico de aquicultura e as regras locais
        antes de implantar, povoar ou comercializar a criação.</p>
    </aside>
  </section>;
}
