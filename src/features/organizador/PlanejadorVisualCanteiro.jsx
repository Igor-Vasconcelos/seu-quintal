import { useId, useMemo, useRef, useState } from "react";
import { formatarMedida, lerMedida } from "../planejador/geometria.js";
import { culturasOrganizador, fonteEscalonamento } from "./culturas.js";
import {
  LIMITE_PLANTAS, PASSO_MOVIMENTO_CM, adicionarAutomaticamente, areaOcupadaCm2,
  capacidadeHomogenea, cm, dimensoesDaCultura, posicaoValida,
  proximaPosicaoLivre, resumirCulturas,
} from "./canteiroGeometria.js";
import "../../styles/visual-canteiro.css";

const nomes = Object.keys(culturasOrganizador);
const paleta = ["var(--sq-leaf)", "var(--sq-brand-700)", "var(--sq-accent)",
  "var(--sq-info-text)", "var(--sq-warning-text)"];
const metros = n => formatarMedida(n / 100);

export default function PlanejadorVisualCanteiro() {
  const [textoLargura, setTextoLargura] = useState("1");
  const [textoComprimento, setTextoComprimento] = useState("2");
  const [medidas, setMedidas] = useState({ largura: 100, comprimento: 200 });
  const [cultura, setCultura] = useState("Alface de verão");
  const [girarNovas, setGirarNovas] = useState(false);
  const [plantas, setPlantas] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(false);
  const sequencia = useRef(0);
  const desenhando = useRef(null);
  const svg = useRef(null);
  const idMalha = useId().replaceAll(":", "");
  const ficha = culturasOrganizador[cultura];
  const espacamento = dimensoesDaCultura(ficha, girarNovas);
  const selecionada = plantas.find(item => item.id === selecionado);
  const resumo = useMemo(() => resumirCulturas(plantas), [plantas]);
  const area = medidas.largura * medidas.comprimento;
  const ocupacao = Math.min(100, areaOcupadaCm2(plantas) / area * 100);
  const idNovo = () => "muda-" + (++sequencia.current);

  function avisar(texto, invalido = false) {
    setErro(invalido);
    setMensagem(texto);
  }

  function aplicarMedidas(evento) {
    evento.preventDefault();
    const largura = lerMedida(textoLargura);
    const comprimento = lerMedida(textoComprimento);
    if (largura === null || comprimento === null ||
      largura < 0.3 || largura > 10 || comprimento < 0.3 || comprimento > 20) {
      avisar("Informe largura de 0,30 a 10 m e comprimento de 0,30 a 20 m.", true);
      return;
    }
    const nova = { largura: cm(largura), comprimento: cm(comprimento) };
    if (plantas.some(item => !posicaoValida(item, plantas, nova.largura, nova.comprimento, item.id))) {
      avisar("Algumas plantas ficariam fora do canteiro. Remova ou mova essas posições antes de reduzir as medidas.", true);
      return;
    }
    setMedidas(nova);
    avisar("Medidas atualizadas sem apagar as plantas.");
  }

  function incluirUma() {
    if (plantas.length >= LIMITE_PLANTAS) {
      avisar("Limite de " + LIMITE_PLANTAS + " posições no desenho. Divida o cultivo em mais canteiros.", true);
      return;
    }
    const livre = proximaPosicaoLivre(plantas, cultura, espacamento, medidas.largura, medidas.comprimento);
    if (!livre) { avisar("Não há posição livre para essa cultura com o espaçamento escolhido.", true); return; }
    const nova = { ...livre, id: idNovo() };
    setPlantas([...plantas, nova]);
    setSelecionado(nova.id);
    avisar(cultura + " adicionada ao desenho.");
  }

  function preencher() {
    const novas = adicionarAutomaticamente(plantas, cultura, espacamento, medidas.largura,
      medidas.comprimento, LIMITE_PLANTAS, idNovo);
    if (!novas.length) { avisar("Não há posições adicionais disponíveis para essa cultura.", true); return; }
    setPlantas([...plantas, ...novas]);
    setSelecionado(novas[novas.length - 1].id);
    avisar(novas.length + " posições adicionadas. Confira as condições reais de cultivo.");
  }

  function mover(id, x, y, silencioso = false) {
    const planta = plantas.find(item => item.id === id);
    if (!planta) return;
    const nova = { ...planta, x: Math.round(x * 2) / 2, y: Math.round(y * 2) / 2 };
    if (!posicaoValida(nova, plantas, medidas.largura, medidas.comprimento, id)) {
      if (!silencioso) avisar("Não é possível mover: limite do canteiro ou sobreposição de espaçamentos.", true);
      return;
    }
    setPlantas(atuais => atuais.map(item => item.id === id ? nova : item));
    if (!silencioso) avisar("Posição de " + planta.cultura + " atualizada.");
  }

  function girarSelecionada() {
    if (!selecionada) return;
    const nova = { ...selecionada, largura: selecionada.comprimento,
      comprimento: selecionada.largura };
    if (!posicaoValida(nova, plantas, medidas.largura, medidas.comprimento, nova.id)) {
      avisar("Não é possível girar: falta espaço ou há outra planta muito próxima.", true);
      return;
    }
    setPlantas(atuais => atuais.map(item => item.id === nova.id ? nova : item));
    avisar("Orientação alterada.");
  }

  function pontoSvg(evento) {
    const matriz = svg.current?.getScreenCTM();
    if (!matriz) return null;
    const ponto = svg.current.createSVGPoint();
    ponto.x = evento.clientX;
    ponto.y = evento.clientY;
    return ponto.matrixTransform(matriz.inverse());
  }

  function iniciar(evento, id) {
    if (evento.button !== 0) return;
    setSelecionado(id);
    desenhando.current = id;
    evento.currentTarget.setPointerCapture(evento.pointerId);
  }

  function deslocar(evento, id) {
    if (desenhando.current !== id) return;
    const ponto = pontoSvg(evento);
    if (ponto) mover(id, ponto.x, ponto.y, true);
  }

  function encerrar(evento) {
    desenhando.current = null;
    if (evento.currentTarget.hasPointerCapture(evento.pointerId)) {
      evento.currentTarget.releasePointerCapture(evento.pointerId);
    }
  }

  function teclado(evento, planta) {
    const deslocamento = {
      ArrowLeft: [-PASSO_MOVIMENTO_CM, 0], ArrowRight: [PASSO_MOVIMENTO_CM, 0],
      ArrowUp: [0, -PASSO_MOVIMENTO_CM], ArrowDown: [0, PASSO_MOVIMENTO_CM],
    }[evento.key];
    if (deslocamento) {
      evento.preventDefault();
      setSelecionado(planta.id);
      mover(planta.id, planta.x + deslocamento[0], planta.y + deslocamento[1]);
    } else if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      setSelecionado(planta.id);
    }
  }

  function limpar() {
    if (!window.confirm("Remover todas as plantas desta prévia?")) return;
    setPlantas([]);
    setSelecionado(null);
    avisar("Canteiro limpo.");
  }

  return (
    <section className="canteiro-visual" aria-labelledby="titulo-canteiro-visual">
      <header className="canteiro-visual-abertura">
        <div>
          <p className="canteiro-etiqueta">FERRAMENTA GRATUITA · SEM CADASTRO</p>
          <h2 id="titulo-canteiro-visual">Desenhe seu canteiro</h2>
          <p>Visualize as posições das plantas com os mesmos espaçamentos do nosso Organizador de Horta.</p>
        </div>
        <p className="canteiro-aviso-salvamento">Prévia experimental: as posições ainda não são salvas quando você fecha esta página.</p>
      </header>
      <div className="canteiro-visual-grade">
        <section className="canteiro-visual-controles" aria-label="Medidas e culturas">
          <h3>1. Medidas do canteiro</h3>
          <form className="canteiro-visual-form" onSubmit={aplicarMedidas}>
            <label>Largura (m)
              <input value={textoLargura} inputMode="decimal" required
                onChange={e => setTextoLargura(e.target.value)} />
            </label>
            <label>Comprimento (m)
              <input value={textoComprimento} inputMode="decimal" required
                onChange={e => setTextoComprimento(e.target.value)} />
            </label>
            <button type="submit" className="botao botao-contorno">Aplicar medidas</button>
          </form>
          <h3>2. Escolha a cultura</h3>
          <label className="canteiro-visual-form">Cultura
            <select value={cultura} onChange={e => { setCultura(e.target.value); setGirarNovas(false); }}>
              {nomes.map(nome => <option key={nome} value={nome}>{nome}</option>)}
            </select>
          </label>
          <div className="canteiro-visual-dados">
            <p><strong>Entre fileiras:</strong> {metros(espacamento.largura)} m</p>
            <p><strong>Entre plantas:</strong> {metros(espacamento.comprimento)} m</p>
            <p><strong>Canteiro vazio:</strong> cerca de {capacidadeHomogenea(medidas.largura, medidas.comprimento, espacamento)} posições da cultura selecionada.</p>
          </div>
          <label className="canteiro-visual-checkbox">
            <input type="checkbox" checked={girarNovas} onChange={e => setGirarNovas(e.target.checked)}/>
            Inverter fileiras para as novas plantas
          </label>
          <div className="canteiro-visual-botoes">
            <button type="button" className="botao" onClick={incluirUma}>Adicionar uma planta</button>
            <button type="button" className="botao botao-contorno" onClick={preencher}>Preencher área livre</button>
          </div>
          <p className="canteiro-ajuda">Escolha a cultura e adicione. Depois, selecione a planta no desenho para arrastar, mover por botões ou remover.</p>
          <details className="canteiro-visual-fontes">
            <summary>Fontes e limitações</summary>
            <p>Espaçamentos de referência do Organizador de Horta, sem reserva adicional para corredores e manejo. A capacidade é geométrica, não uma previsão de colheita.</p>
            <ul>
              <li><a href={fonteEscalonamento} target="_blank" rel="noopener noreferrer">Embrapa · Escalonamento do cultivo</a></li>
              {ficha.fontes?.map(fonte => <li key={fonte.url}><a href={fonte.url} target="_blank" rel="noopener noreferrer">{fonte.nome}</a></li>)}
            </ul>
          </details>
        </section>
        <section className="canteiro-visual-area" aria-label="Planta superior do canteiro">
          <div className="canteiro-visual-area-topo">
            <h3>3. Distribuição</h3>
            <span>{metros(medidas.largura)} × {metros(medidas.comprimento)} m</span>
          </div>
          <p className="canteiro-ajuda">Vista superior em proporção. A malha representa quadrados de 25 × 25 cm.</p>
          <div className="canteiro-visual-viewport">
            <svg ref={svg} viewBox={"0 0 " + medidas.largura + " " + medidas.comprimento}
              preserveAspectRatio="xMidYMid meet" role="group"
              aria-label={"Canteiro com " + plantas.length + " plantas. Selecione uma pelo teclado ou toque."}>
              <defs>
                <pattern id={idMalha} width="25" height="25" patternUnits="userSpaceOnUse">
                  <path d="M25 0 L0 0 0 25" fill="none" stroke="var(--sq-plan-guide)" strokeWidth=".4"/>
                </pattern>
              </defs>
              <rect width={medidas.largura} height={medidas.comprimento} fill="var(--sq-plan-soil)"/>
              <rect width={medidas.largura} height={medidas.comprimento} fill={"url(#" + idMalha + ")"}/>
              {plantas.map(planta => {
                const ativa = planta.id === selecionado;
                const cor = paleta[nomes.indexOf(planta.cultura) % paleta.length];
                return (
                  <g key={planta.id} role="button" tabIndex={0} aria-pressed={ativa}
                    aria-label={planta.cultura + " em " + metros(planta.x) + " m por " + metros(planta.y) + " m. Setas do teclado movem 5 cm."}
                    className="canteiro-visual-planta"
                    onPointerDown={e => iniciar(e, planta.id)}
                    onPointerMove={e => deslocar(e, planta.id)}
                    onPointerUp={encerrar} onPointerCancel={encerrar}
                    onClick={() => setSelecionado(planta.id)}
                    onKeyDown={e => teclado(e, planta)}>
                    <title>{planta.cultura + ": " + metros(planta.largura) + " × " + metros(planta.comprimento) + " m"}</title>
                    <rect x={planta.x - planta.largura / 2} y={planta.y - planta.comprimento / 2}
                      width={planta.largura} height={planta.comprimento}
                      fill="var(--sq-brand-100)" fillOpacity=".55"
                      stroke={ativa ? "var(--sq-plan-selection)" : "var(--sq-plan-existing-stroke)"}
                      strokeWidth={ativa ? 2 : 1} vectorEffect="non-scaling-stroke"/>
                    <circle cx={planta.x} cy={planta.y} r={Math.min(planta.largura, planta.comprimento) * .3}
                      fill={cor} stroke="white" strokeWidth=".6" vectorEffect="non-scaling-stroke"/>
                  </g>
                );
              })}
              <rect width={medidas.largura} height={medidas.comprimento}
                fill="none" stroke="var(--sq-plan-planned-stroke)" strokeWidth="2"
                vectorEffect="non-scaling-stroke" pointerEvents="none"/>
            </svg>
          </div>
          <p className="canteiro-ajuda">Os retângulos mostram o espaço reservado por planta, não o tamanho de sua copa adulta.</p>
          {selecionada ? <div className="canteiro-visual-selecao">
            <h4>{selecionada.cultura} selecionada</h4>
            <p>Posição: {metros(selecionada.x)} m × {metros(selecionada.y)} m</p>
            <div className="canteiro-visual-direcoes" aria-label="Mover planta">
              <button type="button" onClick={() => mover(selecionada.id, selecionada.x, selecionada.y - 5)} aria-label="Mover 5 centímetros para cima">↑</button>
              <div>
                <button type="button" onClick={() => mover(selecionada.id, selecionada.x - 5, selecionada.y)} aria-label="Mover 5 centímetros para esquerda">←</button>
                <button type="button" onClick={() => mover(selecionada.id, selecionada.x, selecionada.y + 5)} aria-label="Mover 5 centímetros para baixo">↓</button>
                <button type="button" onClick={() => mover(selecionada.id, selecionada.x + 5, selecionada.y)} aria-label="Mover 5 centímetros para direita">→</button>
              </div>
            </div>
            <div className="canteiro-visual-botoes">
              <button type="button" className="botao botao-contorno" onClick={girarSelecionada}>Girar espaçamento</button>
              <button type="button" className="botao botao-contorno" onClick={() => {
                setPlantas(atuais => atuais.filter(item => item.id !== selecionada.id));
                setSelecionado(null); avisar("Planta removida.");
              }}>Remover planta</button>
            </div>
          </div> : <p className="canteiro-ajuda">Selecione uma planta para ver os controles de movimento.</p>}
        </section>
        <aside className="canteiro-visual-resumo" aria-label="Resumo da distribuição">
          <h3>4. Resultado</h3>
          <dl>
            <div><dt>Posições desenhadas</dt><dd>{plantas.length}</dd></div>
            <div><dt>Área do canteiro</dt><dd>{formatarMedida(area / 10000)} m²</dd></div>
            <div><dt>Espaço reservado</dt><dd>{formatarMedida(ocupacao)}%</dd></div>
          </dl>
          {resumo.length ? <ul className="canteiro-visual-lista">
            {resumo.map(item => <li key={item.cultura}><span>{item.cultura}</span><strong>{item.quantidade}</strong></li>)}
          </ul> : <p>Adicione a primeira cultura para visualizar o resultado.</p>}
          <p className="canteiro-ajuda">A ocupação representa somente os espaçamentos reservados, sem prever produtividade.</p>
          <div className="canteiro-visual-proximo">
            <h4>Quer colher com frequência?</h4>
            <p>Use o Organizador da Horta para planejar consumo, venda e datas de novos lotes.</p>
            <a className="botao" href={"../organizador/?cultura=" + encodeURIComponent(selecionada?.cultura || cultura)}>
              Planejar datas de plantio
            </a>
            <p className="canteiro-ajuda">As posições não são transferidas para a agenda nesta primeira versão.</p>
          </div>
          <button type="button" className="botao botao-contorno" onClick={limpar} disabled={!plantas.length}>Limpar desenho</button>
        </aside>
      </div>
      <p className={erro ? "erro" : "canteiro-visual-status"} role={erro ? "alert" : "status"} aria-live="polite">{mensagem}</p>
    </section>
  );
}
