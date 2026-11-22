import { useRef, useState } from "react";
import ValorAlimentar from "../../components/ValorAlimentar.jsx";
import Icone from "../../components/Icone.jsx";
import { configuracaoCodornas, fontesCodornas, numeroCodornas, simularCodornas } from "./calculos.js";
import "../../styles/calculadora-codornas.css";

const formatar = (n, casas = 1) => new Intl.NumberFormat("pt-BR", { maximumFractionDigits: casas }).format(n);
const modos = [
  { id: "ovos", titulo: "Quero ovos", icone: "ovos", texto: "Produzir ovos para consumo" },
  { id: "corte", titulo: "Quero carne", icone: "codorna", texto: "Criar aves para consumir a carne" },
  { id: "misto", titulo: "Quero os dois", icone: "galinha", texto: "Planejar duas criações separadas" },
];
const explicacoes = [
  { titulo: "Antes de comprar", corpo: "Prepare um abrigo seco e ventilado, protegido contra chuva, calor excessivo, predadores, roedores e aves silvestres. Confirme água, comedouros, higienização, fornecimento regular das aves e obrigações sanitárias." },
  { titulo: "Todos os dias", corpo: "Confira água limpa e disponível à vontade, dê ração própria para codornas e para cada fase, observe apetite e comportamento e recolha os ovos. Registre produção e alterações." },
  { titulo: "Limpeza e higiene", corpo: "Higienize bebedouros e comedouros; retire umidade e dejetos com frequência adequada. Restrinja acesso, use roupas e calçados limpos e exclusivos. Nunca use fezes frescas na horta." },
  { titulo: "Saúde e sinais de alerta", corpo: "Aves apáticas, com dificuldade para respirar, diarreia, ferimentos, mortes inesperadas ou queda acentuada de produção precisam de avaliação. Evite movimentar aves em caso de suspeita sanitária e acione médico-veterinário e defesa sanitária; não medique por conta própria." },
  { titulo: "Ovos, filhotes e carne", corpo: "Para ovos de consumo não são necessários machos. A criação de filhotes exige aquecimento e manejo por idade. Reprodução, abate e venda precisam de instalações e exigências próprias, que a simulação não substitui." },
];

function Campo({ rotulo, nome, valor, aoMudar, minimo, maximo, unidade, ajuda }) {
  return <label className="campo codornas-campo">
    <span>{rotulo}{unidade ? " (" + unidade + ")" : ""}</span>
    <input name={nome} type="text" inputMode="decimal" value={valor} onChange={e => aoMudar(nome,e.target.value)}
      aria-describedby={ajuda ? "codornas-ajuda-" + nome : undefined}
      data-min={minimo} data-max={maximo}/>
    {ajuda && <small id={"codornas-ajuda-" + nome}>{ajuda}</small>}
  </label>;
}

function Resultado({ resultado }) {
  const resumo = [
    { titulo: "Codornas de postura", valor: formatar(resultado.poedeiras,0), unidade: "fêmeas", mostra: resultado.modo !== "corte" },
    { titulo: "Ovos por dia, em média", valor: formatar(resultado.ovosPrevistosSemana / 7,1), unidade: "ovos/dia", mostra: resultado.modo !== "corte" },
    { titulo: "Aves de corte em alojamento", valor: formatar(resultado.avesCorteAlojadas,0), unidade: "aves", mostra: resultado.modo !== "ovos" },
    { titulo: "Carne por mês (hipótese)", valor: formatar(resultado.carneMesKg,2), unidade: "kg", mostra: resultado.modo !== "ovos" },
    { titulo: resultado.modo === "ovos" ? "Ração por 30 dias" : "Ração mensal em regime de lotes", valor: formatar(resultado.racaoMesKg,2), unidade: "kg", mostra: true },
    { titulo: "Água diária no pico", valor: formatar(resultado.aguaDiaL,2), unidade: "L/dia", mostra: true },
    { titulo: "Área de alojamento calculada", valor: formatar(resultado.areaReferenciaM2,2), unidade: "m²", mostra: true },
  ].filter(item => item.mostra);
  return <section id="codornas-resultado" className="codornas-resultado" tabIndex={-1}
    aria-labelledby="titulo-codornas-resultado">
    <p className="codornas-sobretitulo">RESULTADO · ESTIMATIVA DE PLANEJAMENTO</p>
    <h3 id="titulo-codornas-resultado">O que você precisaria para começar</h3>
    <dl className="codornas-resultados-grade">
      {resumo.map(item => <div key={item.titulo}>
        <dt>{item.titulo}</dt><dd>{item.valor} <small>{item.unidade}</small></dd>
      </div>)}
    </dl>
    <div className="codornas-resumo">
      <h4>Custos que você poderá planejar</h4>
      {resultado.modo !== "ovos" && <p className="codornas-nota">Na criação de corte, o consumo mensal corresponde ao regime de entradas regulares após os lotes se estabilizarem; o primeiro mês pode ser diferente.</p>}
      <p><strong>Ração por 30 dias:</strong> {resultado.custoRacaoMes === null
        ? "preço não informado" : "R$ " + formatar(resultado.custoRacaoMes,2)}.</p>
      <p><strong>Compra de aves para a ocupação simulada:</strong> {resultado.custoCompraAvesInicial === null
        ? "preço das aves não informado" : "R$ " + formatar(resultado.custoCompraAvesInicial,2)}.</p>
      <p><strong>Investimento estimado (aves + instalação):</strong> {resultado.investimentoInicialEstimado === null
        ? "preencha os preços das aves e equipamentos" : "R$ " + formatar(resultado.investimentoInicialEstimado,2)}.</p>
      <p><strong>Custo mensal calculável (ração + novas aves de corte):</strong> {resultado.custoMensalConhecido === null
        ? "preços incompletos" : "R$ " + formatar(resultado.custoMensalConhecido,2)}.
        Não inclui água, energia, medicamentos, embalagens, mão de obra ou reposição de poedeiras.</p>
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
      <p><strong>Ração por dia no pico de alojamento:</strong> {formatar(resultado.racaoDiaKg,2)} kg ·
        <strong> Água estimada em 30 dias de produção:</strong> {formatar(resultado.aguaMesL,1)} L.</p>
    </div>
    {resultado.capacidadeGeometrica !== null && <p className="codornas-nota">
      <strong>Sua área comportaria geometricamente até {formatar(resultado.capacidadeGeometrica,0)} aves</strong>
      {" "}segundo a metragem por ave escolhida.
      {resultado.ovosPotenciaisDiaNaArea !== null && " Na hipótese de postura, seriam em média " +
        formatar(resultado.ovosPotenciaisDiaNaArea,1) + " ovos/dia."}
      {" "}Isso não confirma capacidade sanitária ou bem-estar: revise ventilação, manejo e instalações.
    </p>}
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
  const [metaOvos, definirMetaOvos] = useState("10");
  const [periodoOvos, definirPeriodoOvos] = useState("dia");
  const modo = dados.modo;
  const resultadoRef = useRef(null);
  function mudar(chave, valor) {
    definirDados(atuais => ({ ...atuais, [chave]: valor }));
    definirResultado(null);
    definirErro("");
  }
  function calcular(evento) {
    evento.preventDefault();
    const meta = numeroCodornas(metaOvos);
    if (modo !== "corte" && (meta === null || !Number.isInteger(meta) || meta < 1 || meta > 100000)) {
      definirErro("Informe uma meta de ovos inteira maior que zero.");
      definirResultado(null);
      return;
    }
    const calculado = simularCodornas({
      ...dados,
      ovosSemanais: modo === "corte" ? dados.ovosSemanais : meta * (periodoOvos === "dia" ? 7 : 1),
    });
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
      <p>Diga quantos ovos ou aves deseja, quanto espaço tem e quanto custam os insumos.
        A ferramenta estima sua criação e mostra cuidados para quem está começando.</p>
    </header>
    <div className="codornas-modos" role="group" aria-label="Finalidade da criação">
      {modos.map(item => <button key={item.id} type="button" aria-pressed={modo === item.id}
        className="codornas-modo" onClick={() => mudar("modo",item.id)}>
        <Icone nome={item.icone}/><strong>{item.titulo}</strong><small>{item.texto}</small>
      </button>)}
    </div>
    <form className="codornas-formulario" onSubmit={calcular}>
      <fieldset className="codornas-campos codornas-principal">
        <legend>1. O que você deseja produzir?</legend>
        {(modo === "ovos" || modo === "misto") && <div className="codornas-meta-ovos">
          <label className="campo codornas-campo"><span>Quantos ovos de codorna você deseja?</span>
            <input name="metaOvos" type="text" inputMode="numeric" value={metaOvos}
              onChange={e=>{definirMetaOvos(e.target.value);definirResultado(null);definirErro("");}}
              aria-describedby="codornas-ajuda-meta"/>
            <small id="codornas-ajuda-meta">Uma meta média, não produção garantida todos os dias.</small>
          </label>
          <label className="campo codornas-campo"><span>Por qual período?</span>
            <select value={periodoOvos} onChange={e=>{definirPeriodoOvos(e.target.value);definirResultado(null);}}>
              <option value="dia">Por dia</option><option value="semana">Por semana</option>
            </select>
          </label>
        </div>}
        {(modo === "corte" || modo === "misto") && <div className="codornas-grade">
          {campo("Quantas codornas deseja para consumo por mês?", "avesCorteMensais", "aves",
            "Calcularemos quantos filhotes precisam entrar a cada lote, considerando a sobrevivência estimada.")}
        </div>}
        <p className="codornas-nota">Para ovos, considere fêmeas de linhagens poedeiras; para carne, linhagens adequadas de corte.</p>
      </fieldset>
      <fieldset className="codornas-campos codornas-principal">
        <legend>2. Qual espaço você tem?</legend>
        <div className="codornas-grade">
          <label className="campo codornas-campo"><span>Onde as aves ficarão?</span>
            <select name="alojamento" value={dados.alojamento} onChange={e=>mudar("alojamento",e.target.value)}>
              <option value="piso">No chão, em abrigo protegido</option>
              <option value="viveiro">Viveiro com área de circulação</option>
              <option value="gaiola">Gaiolas apropriadas</option>
            </select>
            <small>O sistema muda os cuidados, não define sozinho quantas aves cabem.</small>
          </label>
          <label className="campo codornas-campo"><span>Área disponível para as aves (m²) — opcional</span>
            <input name="areaDisponivelM2" type="text" inputMode="decimal" value={dados.areaDisponivelM2}
              placeholder="Ex.: 2,5" onChange={e=>mudar("areaDisponivelM2",e.target.value)}/>
            <small>Informe só o espaço útil de alojamento, sem corredores nem depósito.</small>
          </label>
        </div>
        <p className="codornas-nota">Gaiolas empilhadas exigem avaliação separada dos pisos, circulação, ventilação e limpeza.</p>
      </fieldset>
      <fieldset className="codornas-campos codornas-principal">
        <legend>3. Quanto custa na sua região? (opcional)</legend>
        <p className="codornas-nota">Informe os preços que souber. Sem preço, exibiremos consumo sem inventar valores.</p>
        <div className="codornas-grade">
          {campo("Preço médio de 1 kg de ração", "precoRacaoKg", "R$/kg",
            "No modo misto ou entre fases, as rações podem ter preços diferentes; esta versão usa um preço médio informado por você.")}
          {(modo === "ovos" || modo === "misto") && campo("Preço de cada fêmea pronta para postura", "precoPoedeira", "R$/ave")}
          {(modo === "corte" || modo === "misto") && campo("Preço de cada pintinho para corte", "precoPintinho", "R$/ave")}
          {campo("Preço total do abrigo e equipamentos", "custoEstrutura", "R$", "Estimativa informada por você.")}
        </div>
      </fieldset>
      <details className="codornas-avancado">
        <summary>Configurações avançadas — ajustar as hipóteses técnicas</summary>
        <p className="codornas-nota">Os valores abaixo são exemplos editáveis, não garantias, normas ou aprovação de lotação.</p>
        {(modo === "ovos" || modo === "misto") && <fieldset className="codornas-campos">
          <legend>Hipóteses de produção de ovos</legend>
          <div className="codornas-grade">
            {campo("Taxa média de postura", "posturaPercentual", "%", "80% significa média de oito ovos a cada dez fêmeas por dia.")}
            {campo("Ração por fêmea", "racaoPosturaGramasDia", "g/ave/dia")}
            {campo("Água de referência", "aguaPosturaMlDia", "mL/ave/dia", "Água sempre disponível, sem racionamento.")}
            {campo("Área útil por ave", "areaPosturaM2Ave", "m²/ave", "Hipótese de simulação: validar bem-estar e instalações.")}
          </div>
        </fieldset>}
        {(modo === "corte" || modo === "misto") && <fieldset className="codornas-campos">
          <legend>Hipóteses de produção de carne</legend>
          <div className="codornas-grade">
            {campo("Sobrevivência estimada", "sobrevivenciaPercentual", "%")}
            {campo("Duração do lote", "cicloDias", "dias")}
            {campo("Peso vivo por ave", "pesoVivoGramas", "g")}
            {campo("Rendimento de carcaça estimado", "rendimentoCarcacaPercentual", "%")}
            {campo("Ração média no ciclo", "racaoCorteMediaGramasDia", "g/ave/dia", "O consumo muda conforme a idade.")}
            {campo("Água média no ciclo", "aguaCorteMlDia", "mL/ave/dia")}
            {campo("Área útil por ave", "areaCorteM2Ave", "m²/ave")}
          </div>
        </fieldset>}
      </details>
      {erro && <p className="erro" role="alert">{erro}</p>}
      <button className="botao codornas-calcular" type="submit">Calcular meu cenário <Icone nome="seta"/></button>
    </form>
    <div ref={resultadoRef}>{resultado && <Resultado resultado={resultado}/>}</div>
    <section className="codornas-educacao" aria-labelledby="titulo-cuidados-codornas">
      <ValorAlimentar nome="Ovos de codorna"/>
      <ValorAlimentar nome="Carne de codorna"/>
      <h3 id="titulo-cuidados-codornas">Como cuidar das codornas: preparação, rotina, higiene e saúde</h3>
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
        <p><strong>Área:</strong> quantidade simultânea de aves × área por ave.
          <strong> Ração e água para postura:</strong> fêmeas × média diária × 30 dias.
          <strong> Para corte:</strong> entradas a cada 30 dias × média diária durante o ciclo × duração do ciclo.
          Ocupação máxima simultânea não é consumo constante durante o mês.</p>
      </details>
    </section>
    <aside className="codornas-fontes" aria-label="Referências técnicas da criação de codornas">
      <h3>Fontes técnicas e limitações</h3>
      <p>Os valores iniciais são <strong>exemplos editáveis de cenário</strong> para ajudar no planejamento.
        Estudos e manuais descrevem variações conforme genética, temperatura, alimentação, alojamento e fase produtiva.</p>
      <ul>{fontesCodornas.map(item=><li key={item.url}>
        <a href={item.url} target="_blank" rel="noopener noreferrer">{item.nome}</a>
      </li>)}</ul>
      <p>Manuseie os ovos com mãos e utensílios limpos; descarte ovos quebrados e consulte orientações específicas para limpeza e armazenamento seguro. Consulte assistência técnica e os requisitos sanitários locais. Em Minas Gerais,
        o IMA informa que até criações avícolas de subsistência devem ser cadastradas.
        Em caso de suspeita sanitária, não movimente, abata ou consuma aves sem orientação oficial.
        Não use fezes frescas nos canteiros: resíduos exigem tratamento adequado.</p>
    </aside>
  </section>;
}
