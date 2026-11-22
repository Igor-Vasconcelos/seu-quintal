import { useEffect, useRef, useState } from "react";
import Icone from "../../components/Icone.jsx";
import { especiesPomar, fontePomar, planejarPomar } from "./geometriaPomar.js";

const formatar = (v, casas = 2) => new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: casas,
}).format(v);

function Croqui({ dados }) {
  if (!dados.exibicaoCompleta) return <p className="simulador-alerta">O cálculo contempla todas as
    {formatar(dados.quantidade, 0)} posições, mas o desenho foi omitido para não sobrecarregar o aparelho
    com centenas de árvores. Experimente dividir o pomar em talhões menores.</p>;

  // Mostra posições, não localização topográfica nem representação fiel de copa.
  const raio = dados.copaAdulta === null
    ? Math.min(dados.entreLinhas, dados.entrePlantas) * .12 : dados.copaAdulta / 2;
  return <figure className="pomar-croqui">
    <svg viewBox={"0 0 " + dados.largura + " " + dados.comprimento}
      xmlns="http://www.w3.org/2000/svg" role="img"
      aria-labelledby="croqui-pomar-titulo croqui-pomar-descricao">
      <title id="croqui-pomar-titulo">Distribuição geométrica das mudas</title>
      <desc id="croqui-pomar-descricao">{dados.colunas} fileiras por {dados.linhas} plantas.
        As manchas circulares representam somente os pontos de plantio ou, se informada,
        a copa hipotética no diâmetro escolhido.</desc>
      <rect x="0" y="0" width={dados.largura} height={dados.comprimento} fill="#E8F0E8"
        stroke="#326747" strokeWidth={Math.max(.03, Math.min(dados.largura, dados.comprimento)*.004)}/>
      <rect x={dados.recuo} y={dados.recuo}
        width={dados.larguraUtil} height={dados.comprimentoUtil}
        fill="#FFF9ED" stroke="#A07C45" strokeDasharray=".3 .25"
        strokeWidth={Math.max(.025, Math.min(dados.largura, dados.comprimento)*.002)}/>
      {dados.pontos.map((p,i) => <g key={i}>
        <circle cx={p.x} cy={p.y} r={raio} fill={dados.copaAdulta === null ? "#3F8559" : "#8AB96C"}
          stroke="#205B40" strokeWidth={Math.max(.02, raio*.06)} fillOpacity=".70"/>
        <circle cx={p.x} cy={p.y} r={Math.max(.045, raio*.08)} fill="#183C2B"/>
      </g>)}
    </svg>
    <figcaption>Vista superior aproximada. {dados.copaAdulta === null
      ? "Pontos simbólicos de plantio: não indicam o tamanho da copa adulta."
      : "Círculos representam o diâmetro de copa que você informou, não uma previsão agronômica."}</figcaption>
  </figure>;
}

function Resultado({ dados }) {
  const foco = useRef(null);
  useEffect(() => { foco.current?.focus(); }, [dados]);
  return <section className="simulador-resultado" tabIndex={-1} ref={foco}
    aria-labelledby="resultado-pomar-titulo">
    <p className="simulador-selo">ARRANJO GEOMÉTRICO ESTIMADO</p>
    <h3 id="resultado-pomar-titulo">Distribuição inicial do pomar</h3>
    <dl className="simulador-indicadores">
      <div><dt>Posições de plantio</dt><dd>{formatar(dados.quantidade, 0)} <small>mudas</small></dd></div>
      <div><dt>Arranjo de plantio</dt><dd>{dados.colunas} × {dados.linhas}</dd></div>
      <div><dt>Área total</dt><dd>{formatar(dados.areaM2)} <small>m²</small></dd></div>
      <div><dt>Área após recuos</dt><dd>{formatar(dados.areaUtilM2)} <small>m²</small></dd></div>
    </dl>
    {dados.quantidade === 0 ? <p className="simulador-alerta">Não há espaço para uma célula completa
      com as distâncias informadas. Ajuste a área, os recuos ou consulte um arranjo técnico diferente.</p>
      : <Croqui dados={dados}/>}
    <div className="simulador-detalhes">
      <p><strong>Premissas:</strong> terreno retangular, uma espécie por simulação,
        recuos de {formatar(dados.recuo)} m em todos os lados e espaçamento
        de {formatar(dados.entreLinhas)} m entre linhas por {formatar(dados.entrePlantas)} m entre plantas.</p>
      <p><strong>Copa adulta:</strong> {dados.copaAdulta === null
        ? "sem diâmetro informado. Verifique o porte adulto com o viveiro e o técnico."
        : formatar(dados.copaAdulta) + " m de diâmetro informado por você; valor ilustrativo."}</p>
      {dados.sobreposicaoCopas && <p className="simulador-alerta" role="alert">
        O diâmetro de copa informado supera pelo menos um dos espaçamentos. As projeções geométricas
        se sobrepõem; revise cultivar, poda, acesso e circulação.</p>}
      <p className="simulador-alerta">Antes de plantar, confirme adaptação climática, análise do solo,
        disponibilidade de água, sol, drenagem, distância de edificações e redes, condução,
        porta-enxerto e necessidade de polinização da cultivar.</p>
    </div>
  </section>;
}

export default function PlanejadorPomar() {
  const [especie, definirEspecie] = useState("goiaba");
  const [entreLinhas, definirEntreLinhas] = useState("5");
  const [entrePlantas, definirEntrePlantas] = useState("4");
  const [resultado, definirResultado] = useState(null);
  const [erro, definirErro] = useState("");
  const padrao = especiesPomar[especie];

  function trocarEspecie(valor) {
    const ficha = especiesPomar[valor];
    definirEspecie(valor);
    definirEntreLinhas(String(ficha.entreLinhas).replace(".", ","));
    definirEntrePlantas(String(ficha.entrePlantas).replace(".", ","));
    definirResultado(null);
  }

  function calcular(evento) {
    evento.preventDefault();
    const valores = new FormData(evento.currentTarget);
    const cenario = planejarPomar({
      especie,
      largura: valores.get("largura"),
      comprimento: valores.get("comprimento"),
      recuo: valores.get("recuo"),
      entreLinhas, entrePlantas,
      copaAdulta: valores.get("copaAdulta"),
    });
    if (!cenario) {
      definirResultado(null);
      definirErro("Revise as dimensões, os recuos e os espaçamentos. Use metros positivos e valores possíveis.");
    } else {
      definirErro("");
      definirResultado(cenario);
    }
  }

  return <section className="simulador-quintal simulador-pomar" aria-labelledby="titulo-simulador-pomar">
    <div className="simulador-apresentacao">
      <p className="simulador-selo"><Icone nome="muda"/> FERRAMENTA GRATUITA</p>
      <h2 id="titulo-simulador-pomar">Quantas frutíferas cabem no espaço?</h2>
      <p>Compare uma espécie de cada vez, altere os espaçamentos e veja o arranjo dos pontos de
        plantio. O desenho considera o espaço reservado para o crescimento, não apenas a muda jovem.</p>
    </div>
    <form className="simulador-formulario" onSubmit={calcular}
      onChange={() => { definirResultado(null); definirErro(""); }}>
      <fieldset className="simulador-bloco">
        <legend>1. Seu espaço</legend>
        <div className="simulador-campos">
          <label className="campo">Largura do pomar (m)
            <input name="largura" inputMode="decimal" defaultValue="15" required/>
          </label>
          <label className="campo">Comprimento do pomar (m)
            <input name="comprimento" inputMode="decimal" defaultValue="25" required/>
          </label>
          <label className="campo">Recuo em cada borda (m)
            <input name="recuo" inputMode="decimal" defaultValue="1" required/>
          </label>
        </div>
        <p className="nota">O recuo informado é uma reserva de planejamento, não uma distância legal
          ou técnica universal para árvores próximas a muros, casas, fios ou tubulações.</p>
      </fieldset>
      <fieldset className="simulador-bloco">
        <legend>2. Espécie e espaçamento</legend>
        <div className="simulador-campos">
          <label className="campo">Frutífera
            <select name="especie" value={especie} onChange={e => trocarEspecie(e.target.value)}>
              {Object.entries(especiesPomar).map(([id,f]) => <option value={id} key={id}>{f.nome}</option>)}
            </select>
          </label>
          <label className="campo">Entre linhas (m)
            <input name="entreLinhas" inputMode="decimal" value={entreLinhas}
              onChange={e => definirEntreLinhas(e.target.value)} required/>
          </label>
          <label className="campo">Entre plantas da linha (m)
            <input name="entrePlantas" inputMode="decimal" value={entrePlantas}
              onChange={e => definirEntrePlantas(e.target.value)} required/>
          </label>
          <label className="campo">Copa adulta prevista (diâmetro em m) — opcional
            <input name="copaAdulta" inputMode="decimal" placeholder="Consulte o porte da cultivar"/>
          </label>
          <label className="campo">Variedade / porta-enxerto — opcional
            <input name="variedade" placeholder="Ex.: variedade escolhida no viveiro"/>
          </label>
        </div>
        <p className="nota">{especie === "outra"
          ? "Espaçamento inicial meramente ilustrativo. Defina os valores com informação da espécie e cultivar."
          : "Espaçamento inicial extraído de um exemplo de pomar do Sistema Filho, Embrapa. Ajuste após verificar cultivar, condução, clima e solo."}</p>
      </fieldset>
      {erro && <p className="erro" role="alert">{erro}</p>}
      <button type="submit" className="botao simulador-calcular">Desenhar meu pomar <Icone nome="seta"/></button>
    </form>
    {resultado && <Resultado dados={resultado}/>}
    <details className="simulador-explicacao">
      <summary>Como são calculados o espaço e as posições?</summary>
      <p>Retiramos o recuo dos quatro lados do retângulo. Em cada direção,
        dividimos a medida disponível pelo espaçamento adotado e arredondamos para baixo.</p>
      <p>Os pontos são centralizados em células do espaçamento informado. O cálculo
        representa <strong>uma espécie por simulação</strong>, sem descontar caminhos internos,
        estruturas existentes, sombras e desníveis. Em um pomar misto, planeje por setores ou valide um desenho específico.</p>
      <p>O diâmetro da copa é opcional e informado pelo usuário. A calculadora não estima produtividade,
        idade de frutificação ou polinização porque esses fatores dependem de cultivar e manejo.</p>
    </details>
    <aside className="simulador-fontes" aria-label="Fontes técnicas do planejador de pomar">
      <h3>Fontes e cuidados</h3>
      <p>Espaçamentos iniciais: <a href={fontePomar} target="_blank" rel="noopener noreferrer">
        Embrapa — Circular Técnica 34, Sistema Filho</a>. A publicação contém exemplos de espaçamento e
        ressalta que a escolha deve considerar condições da região e necessidades do cultivo.</p>
      <p>O desenho não substitui análise do solo, levantamento das redes e construções,
        estudo de insolação ou um projeto agronômico.</p>
    </aside>
  </section>;
}
