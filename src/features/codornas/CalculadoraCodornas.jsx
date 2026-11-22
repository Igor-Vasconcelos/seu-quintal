import { useRef, useState } from "react";
import ValorAlimentar from "../../components/ValorAlimentar.jsx";
import Icone from "../../components/Icone.jsx";
import { configuracaoCodornas, fontesCodornas, simularCodornas } from "./calculos.js";
import "../../styles/calculadora-codornas.css";

const formatar = (n, casas = 1) => new Intl.NumberFormat("pt-BR", { maximumFractionDigits: casas }).format(n);
const modos = [
  { id: "ovos", titulo: "Ovos", icone: "ovos", texto: "Dimensionar poedeiras por meta de ovos" },
  { id: "corte", titulo: "Corte", icone: "codorna", texto: "Planejar lotes para consumo de carne" },
  { id: "misto", titulo: "Misto", icone: "galinha", texto: "Comparar os dois grupos separados" },
];
const explicacoes = [
  {
    titulo: "Escolha da linhagem",
    corpo: "Codornas japonesas são comuns para postura; linhagens europeias são utilizadas para carne. O potencial produtivo depende de genética, idade, nutrição e sanidade.",
  },
  {
    titulo: "Água e ração sempre disponíveis",
    corpo: "Use ração própria para espécie e fase de criação. A necessidade de água aumenta no calor. Não restrinja água para corresponder ao número da simulação.",
  },
  {
    titulo: "Instalações e bem-estar",
    corpo: "Planeje ventilação sem correntes fortes, conforto térmico, proteção contra predadores, manejo da cama e dos dejetos, limpeza dos bebedouros e área de manejo humano.",
  },
  {
    titulo: "Reprodução e postura",
    corpo: "Ovos de consumo não exigem macho. Para reprodução, incubação e recria são necessárias instalações e manejo específicos, não incluídos nesta calculadora.",
  },
  {
    titulo: "Sanidade e destino da produção",
    corpo: "Observe aves feridas, comportamento, consumo e mortalidade. Para abate e venda, verifique as exigências de inspeção sanitária e procure assistência técnica.",
  },
];

function Campo({ rotulo, nome, valor, aoMudar, minimo, maximo, unidade, ajuda }) {
  return <label className="campo codornas-campo">
    <span>{rotulo}{unidade ? " (" + unidade + ")" : ""}</span>
    <input name={nome} type="text" inputMode="decimal" value={valor} onChange={e => aoMudar(nome,e.target.value)}
      required aria-describedby={ajuda ? "codornas-ajuda-" + nome : undefined}
      data-min={minimo} data-max={maximo}/>
    {ajuda && <small id={"codornas-ajuda-" + nome}>{ajuda}</small>}
  </label>;
}

function Resultado({ resultado }) {
  const resumo = [
    { titulo: "Codornas de postura", valor: formatar(resultado.poedeiras,0), unidade: "fêmeas", mostra: resultado.modo !== "corte" },
    { titulo: "Ovos por semana", valor: formatar(resultado.ovosPrevistosSemana), unidade: "ovos", mostra: resultado.modo !== "corte" },
    { titulo: "Aves de corte em alojamento", valor: formatar(resultado.avesCorteAlojadas,0), unidade: "aves", mostra: resultado.modo !== "ovos" },
    { titulo: "Carne por mês (hipótese)", valor: formatar(resultado.carneMesKg,2), unidade: "kg", mostra: resultado.modo !== "ovos" },
    { titulo: "Ração por mês", valor: formatar(resultado.racaoMesKg,2), unidade: "kg", mostra: true },
    { titulo: "Água por dia", valor: formatar(resultado.aguaDiaL,2), unidade: "L", mostra: true },
    { titulo: "Área de alojamento calculada", valor: formatar(resultado.areaReferenciaM2,2), unidade: "m²", mostra: true },
  ].filter(item => item.mostra);
  return <section id="codornas-resultado" className="codornas-resultado" tabIndex={-1}
    aria-labelledby="titulo-codornas-resultado">
    <p className="codornas-sobretitulo">CENÁRIO ESTIMADO</p>
    <h3 id="titulo-codornas-resultado">Planejamento para sua criação</h3>
    <dl className="codornas-resultados-grade">
      {resumo.map(item => <div key={item.titulo}>
        <dt>{item.titulo}</dt><dd>{item.valor} <small>{item.unidade}</small></dd>
      </div>)}
    </dl>
    <div className="codornas-resumo">
      <p><strong>Alojamento escolhido:</strong> {({
        piso: "piso/aviário", viveiro: "viveiro com circulação", gaiola: "gaiolas/baterias",
      })[resultado.alojamento]}. O modelo não muda a área por ave automaticamente;
        ajuste o parâmetro segundo o projeto e o bem-estar animal.</p>
      {resultado.modo !== "corte" && <p><strong>Ovos em 30 dias:</strong> aproximadamente {formatar(resultado.ovosPrevistosMes,0)}.
        A média depende da taxa de postura informada e da fase de produção.</p>}
      {resultado.modo !== "ovos" && <p><strong>Corte:</strong> para buscar {resultado.sobreviventesCorte} aves ao fim de cada entrada,
        iniciar com {resultado.entradasMensais} por lote de 30 dias.
        A reserva geométrica considera {resultado.lotesSimultaneos} lote(s) potencialmente sobrepostos
        e não inclui perdas em datas específicas.</p>}
      {resultado.modo === "misto" && <p><strong>Ambientes separados:</strong> {formatar(resultado.areaPosturaM2,2)} m² para
        postura e {formatar(resultado.areaCorteM2,2)} m² para corte, segundo as áreas por ave que você escolheu.</p>}
      <p><strong>Ração por dia:</strong> {formatar(resultado.racaoDiaKg,2)} kg ·
        <strong> Água estimada em 30 dias:</strong> {formatar(resultado.aguaMesL,1)} L.</p>
    </div>
    {resultado.alertaArea && <p className="codornas-alerta" role="alert">
      <strong>Atenção ao espaço:</strong> a área calculada supera a área disponível em
      {" "}{formatar(resultado.deficitAreaM2,2)} m². Rever o projeto, não superlotar as aves.
    </p>}
    {resultado.areaDisponivelM2 !== null && !resultado.alertaArea && <p className="codornas-nota">
      A área disponível cobre a área calculada segundo suas hipóteses; isso não confirma
      adequação da lotação, estrutura ou conforto térmico.
    </p>}
    <div className="codornas-nota">
      <strong>Como interpretar:</strong> estes resultados são estimativas de planejamento, não mínimos
      legais, densidade recomendada ou produção garantida. O espaço informado é área útil de alojamento;
      corredores, alimentação, armazenamento e limpeza exigem área adicional.
    </div>
  </section>;
}

export default function CalculadoraCodornas() {
  const [dados, definirDados] = useState(() => ({ ...configuracaoCodornas }));
  const [resultado, definirResultado] = useState(null);
  const [erro, definirErro] = useState("");
  const modo = dados.modo;
  const resultadoRef = useRef(null);
  function mudar(chave, valor) {
    definirDados(atuais => ({ ...atuais, [chave]: valor }));
    definirResultado(null);
    definirErro("");
  }
  function calcular(evento) {
    evento.preventDefault();
    const calculado = simularCodornas(dados);
    if (!calculado) {
      definirErro("Revise os valores. Use números positivos, vírgula ou ponto decimal e percentuais de 1 a 100.");
      definirResultado(null);
      return;
    }
    definirErro("");
    definirResultado(calculado);
    // O resultado surge abaixo; o anúncio semântico é feito pelo título.
    requestAnimationFrame(() => resultadoRef.current?.querySelector("#codornas-resultado")?.focus({preventScroll:true}));
  }
  const campo = (rotulo, nome, unidade, ajuda) => <Campo key={nome} rotulo={rotulo}
    nome={nome} valor={String(dados[nome])} aoMudar={mudar} unidade={unidade} ajuda={ajuda}/>;
  return <section className="codornas-calculadora" aria-labelledby="titulo-calculadora-codornas">
    <header className="codornas-calculadora-intro">
      <p className="codornas-sobretitulo"><Icone nome="codorna"/> PLANEJAMENTO RESPONSÁVEL</p>
      <h2 id="titulo-calculadora-codornas">Calculadora de codornas</h2>
      <p>Escolha sua finalidade e estime quantas aves, quanta ração e qual área de alojamento
        um cenário precisa. Ajuste as hipóteses à linhagem e ao manejo planejado.</p>
    </header>
    <div className="codornas-modos" role="group" aria-label="Finalidade da criação">
      {modos.map(item => <button key={item.id} type="button" aria-pressed={modo === item.id}
        className="codornas-modo" onClick={() => mudar("modo",item.id)}>
        <Icone nome={item.icone}/><strong>{item.titulo}</strong><small>{item.texto}</small>
      </button>)}
    </div>
    <form className="codornas-formulario" onSubmit={calcular}>
      {(modo === "ovos" || modo === "misto") && <fieldset className="codornas-campos">
        <legend><Icone nome="ovos"/> Produção de ovos</legend>
        <div className="codornas-grade">
          {campo("Meta semanal", "ovosSemanais", "ovos", "Ovos de consumo desejados; não contabiliza perdas e quebras.")}
          {campo("Taxa média de postura", "posturaPercentual", "%", "Exemplo ajustável, não promessa de produção.")}
          {campo("Ração diária por poedeira","racaoPosturaGramasDia","g/ave/dia")}
          {campo("Água diária por poedeira","aguaPosturaMlDia","mL/ave/dia","Estimativa para planejamento: ofereça água potável à vontade.")}
          {campo("Área útil por poedeira","areaPosturaM2Ave","m²/ave","Hipótese de espaço editável; exige validação conforme sistema e bem-estar.")}
        </div>
      </fieldset>}
      {(modo === "corte" || modo === "misto") && <fieldset className="codornas-campos">
        <legend><Icone nome="codorna"/> Produção de carne</legend>
        <div className="codornas-grade">
          {campo("Meta mensal de aves", "avesCorteMensais", "aves")}
          {campo("Sobrevivência estimada", "sobrevivenciaPercentual", "%")}
          {campo("Duração de cada lote", "cicloDias", "dias")}
          {campo("Peso vivo por ave ao abate", "pesoVivoGramas", "g")}
          {campo("Rendimento de carcaça hipotético", "rendimentoCarcacaPercentual", "%")}
          {campo("Ração média diária no ciclo", "racaoCorteMediaGramasDia", "g/ave/dia",
            "Média simples do ciclo: pintinhos comem menos que aves mais velhas.")}
          {campo("Água média diária no ciclo", "aguaCorteMlDia", "mL/ave/dia")}
          {campo("Área útil por ave de corte", "areaCorteM2Ave", "m²/ave")}
        </div>
      </fieldset>}
      <fieldset className="codornas-campos">
        <legend><Icone nome="planta"/> Ambiente e área disponível</legend>
        <div className="codornas-grade">
          <label className="campo codornas-campo">
            <span>Sistema de alojamento</span>
            <select name="alojamento" value={dados.alojamento}
              onChange={e=>mudar("alojamento",e.target.value)}>
              <option value="piso">Piso/aviário</option><option value="viveiro">Viveiro com área de circulação</option>
              <option value="gaiola">Gaiolas/baterias</option>
            </select>
          </label>
          <label className="campo codornas-campo"><span>Área útil já disponível (m²) — opcional</span>
            <input name="areaDisponivelM2" type="text" inputMode="decimal" value={dados.areaDisponivelM2}
              placeholder="Ex.: 6" onChange={e=>mudar("areaDisponivelM2",e.target.value)}/>
            <small>Considere apenas a área efetiva de alojamento; gaiolas empilhadas requerem avaliação separada.</small>
          </label>
        </div>
        <p className="codornas-nota">Em gaiolas, a área útil dos pisos não é igual à
          área ocupada no galpão. Inclua altura, ventilação, acesso e facilidade de limpeza.</p>
      </fieldset>
      {erro && <p className="erro" role="alert">{erro}</p>}
      <button className="botao codornas-calcular" type="submit">Calcular meu cenário <Icone nome="seta"/></button>
    </form>
    <div ref={resultadoRef}>{resultado && <Resultado resultado={resultado}/>}</div>
    <section className="codornas-educacao" aria-labelledby="titulo-cuidados-codornas">
      <ValorAlimentar nome="Ovos de codorna"/>
      <ValorAlimentar nome="Carne de codorna"/>
      <h3 id="titulo-cuidados-codornas">O que você precisa saber antes de criar</h3>
      <div className="codornas-informacoes">
        {explicacoes.map(bloco => <article key={bloco.titulo}>
          <h4>{bloco.titulo}</h4><p>{bloco.corpo}</p>
        </article>)}
      </div>
      <details className="codornas-como-calcula">
        <summary>Como a calculadora chegou aos resultados?</summary>
        <p><strong>Postura:</strong> poedeiras = arredondamento para cima de
          (meta semanal ÷ (7 × taxa de postura)). Ovos previstos = poedeiras × 7 × taxa.</p>
        <p><strong>Corte:</strong> aves de entrada = arredondamento para cima
          de (meta mensal ÷ sobrevivência). A simulação reserva grupos simultâneos
          conforme a duração do ciclo e uma nova entrada a cada 30 dias.</p>
        <p><strong>Área:</strong> aves alojadas × área por ave informada, com
          separação de postura e corte. <strong>Ração e água:</strong> número de aves
          presentes × consumos médios informados × dias. Não modela fases de crescimento,
          consumo de pintinhos ou perdas reais.</p>
      </details>
    </section>
    <aside className="codornas-fontes" aria-label="Referências técnicas da criação de codornas">
      <h3>Fontes técnicas e limitações</h3>
      <p>Os valores iniciais são <strong>exemplos editáveis de cenário</strong> para ajudar no planejamento.
        Estudos e manuais descrevem variações conforme genética, temperatura, alimentação, alojamento e fase produtiva.</p>
      <ul>{fontesCodornas.map(item=><li key={item.url}>
        <a href={item.url} target="_blank" rel="noopener noreferrer">{item.nome}</a>
      </li>)}</ul>
      <p>Consulte assistência técnica e os requisitos sanitários locais. O tratamento de dejetos
        antes do uso na horta é indispensável; não use fezes frescas nos canteiros.</p>
    </aside>
  </section>;
}
