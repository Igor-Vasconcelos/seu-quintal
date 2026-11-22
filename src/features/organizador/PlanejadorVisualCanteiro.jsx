import { useId, useMemo, useRef, useState } from "react";
import { formatarMedida, lerMedida } from "../planejador/geometria.js";
import { culturasOrganizador, fonteEscalonamento } from "./culturas.js";
import IconeCultura from "./IconeCultura.jsx";
import { nomeCurtoDaCultura } from "./culturasVisuais.js";
import { adicionarCanteiro, colecaoInicial, gravarColecaoCanteiros, lerColecaoCanteiros,
  limiteCanteiros, removerCanteiro, substituirCanteiro } from "./canteiros.js";
import { lerOrganizador } from "./armazenamento.js";
import { chaveCanteiros } from "./canteiros.js";
import {
  LIMITE_PLANTAS, PASSO_MOVIMENTO_CM, adicionarAutomaticamente, areaOcupadaCm2,
  capacidadeHomogenea, cm, dimensoesDaCultura, posicaoValida, proximaPosicaoLivre, resumirCulturas,
} from "./canteiroGeometria.js";
import "../../styles/visual-canteiro.css";
import "../../styles/canteiros-inteligentes.css";

const nomes = Object.keys(culturasOrganizador);
const metros = valorCm => formatarMedida(valorCm / 100);
const numero = valor => formatarMedida(valor);
const defaultTexto = valor => String(valor / 100).replace(".", ",");

export default function PlanejadorVisualCanteiro() {
  const [inicio] = useState(() => {
    try { return { dados: lerColecaoCanteiros(), erro: "" }; }
    catch (erro) { return { dados: colecaoInicial(), erro: erro.message }; }
  });
  const [colecao, setColecao] = useState(inicio.dados);
  const [ativoId, setAtivoId] = useState(inicio.dados.ativoId);
  const ativo = colecao.itens.find(item => item.id === ativoId) || colecao.itens[0];
  const [nome, setNome] = useState(ativo.nome);
  const [novoNome, setNovoNome] = useState("");
  const [medidas, setMedidas] = useState(ativo.medidas);
  const [textoLargura, setTextoLargura] = useState(() => defaultTexto(ativo.medidas.largura));
  const [textoComprimento, setTextoComprimento] = useState(() => defaultTexto(ativo.medidas.comprimento));
  const [plantas, setPlantas] = useState(ativo.plantas);
  const plantasRef = useRef(ativo.plantas);
  const [cultura, setCultura] = useState("Alface de verão");
  const [girarNovas, setGirarNovas] = useState(false);
  const [mostrarTodas, setMostrarTodas] = useState(false);
  const [selecionado, setSelecionado] = useState(null);
  const [salvo, setSalvo] = useState(() => {
    try { return !inicio.erro && window.localStorage.getItem(chaveCanteiros) !== null; }
    catch { return false; }
  });
  const [mensagem, setMensagem] = useState(inicio.erro ||
    "Se havia um rascunho antigo, ele foi carregado sem apagar o original. Salve para incluí-lo nos Meus Canteiros.");
  const [erro, setErro] = useState(false);
  const [baixando, setBaixando] = useState(false);
  const sequencia = useRef(Date.now());
  const arrastoId = useRef(null);
  const svgRef = useRef(null);
  const malhaId = useId().replaceAll(":", "");
  const ficha = culturasOrganizador[cultura];
  const dimensoes = dimensoesDaCultura(ficha, girarNovas);
  const selecionada = plantas.find(item => item.id === selecionado);
  const resumo = useMemo(() => resumirCulturas(plantas), [plantas]);
  const areaCm2 = medidas.largura * medidas.comprimento;
  const ocupacao = Math.min(100, (areaOcupadaCm2(plantas) / areaCm2) * 100);
  const capacidade = capacidadeHomogenea(medidas.largura, medidas.comprimento, dimensoes);
  const idNovo = () => "planta-" + (++sequencia.current);
  const visiveis = mostrarTodas ? nomes : nomes.slice(0, 6);

  function avisar(texto, invalido = false) {
    setErro(invalido);
    setMensagem(texto);
  }

  function atualizarPlantas(novas) {
    plantasRef.current = novas;
    setPlantas(novas);
    setSalvo(false);
  }

  function aplicarMedidas(evento) {
    evento.preventDefault();
    const largura = lerMedida(textoLargura);
    const comprimento = lerMedida(textoComprimento);
    if (largura === null || comprimento === null ||
      largura < 0.30 || largura > 10 || comprimento < 0.30 || comprimento > 20) {
      avisar("Informe largura de 0,30 a 10 m e comprimento de 0,30 a 20 m.", true);
      return;
    }
    const nova = { largura: cm(largura), comprimento: cm(comprimento) };
    if (plantasRef.current.some(item =>
      !posicaoValida(item, plantasRef.current, nova.largura, nova.comprimento, item.id))) {
      avisar("Algumas plantas ficariam fora do canteiro. Mova ou remova essas posições primeiro.", true);
      return;
    }
    setMedidas(nova);
    setSalvo(false);
    avisar("Medidas atualizadas. As plantas foram preservadas.");
  }

  function escolherCultura(nome) {
    setCultura(nome);
    setGirarNovas(false);
    avisar(nomeCurtoDaCultura(nome) + " selecionada. Adicione uma planta ao canteiro.");
  }

  function adicionarUma() {
    if (plantasRef.current.length >= LIMITE_PLANTAS) {
      avisar("O desenho atingiu o limite de " + LIMITE_PLANTAS + " posições.", true);
      return;
    }
    const vaga = proximaPosicaoLivre(plantasRef.current, cultura, dimensoes,
      medidas.largura, medidas.comprimento);
    if (!vaga) {
      avisar("Não há espaço livre para esta cultura com o espaçamento selecionado.", true);
      return;
    }
    const nova = { ...vaga, id: idNovo() };
    atualizarPlantas([...plantasRef.current, nova]);
    setSelecionado(nova.id);
    avisar(nomeCurtoDaCultura(cultura) + " adicionada.");
  }

  function preencher() {
    const novas = adicionarAutomaticamente(plantasRef.current, cultura, dimensoes,
      medidas.largura, medidas.comprimento, LIMITE_PLANTAS, idNovo);
    if (!novas.length) {
      avisar("Nenhuma posição livre encontrada para esta cultura.", true);
      return;
    }
    atualizarPlantas([...plantasRef.current, ...novas]);
    setSelecionado(novas[novas.length - 1].id);
    avisar(novas.length + " posições adicionadas. Confira as recomendações locais de cultivo.");
  }

  function mover(id, x, y, silencioso = false) {
    const atuais = plantasRef.current;
    const planta = atuais.find(item => item.id === id);
    if (!planta) return;
    const candidata = { ...planta, x: Math.round(x * 2) / 2, y: Math.round(y * 2) / 2 };
    if (!posicaoValida(candidata, atuais, medidas.largura, medidas.comprimento, id)) {
      if (!silencioso) avisar("Movimento impedido: limite do canteiro ou espaçamento ocupado.", true);
      return;
    }
    atualizarPlantas(atuais.map(item => item.id === id ? candidata : item));
    if (!silencioso) avisar("Posição atualizada.");
  }

  function girarSelecionada() {
    if (!selecionada) return;
    const nova = { ...selecionada, largura: selecionada.comprimento,
      comprimento: selecionada.largura };
    if (!posicaoValida(nova, plantasRef.current, medidas.largura, medidas.comprimento, nova.id)) {
      avisar("Não é possível girar aqui: o espaçamento encontraria uma borda ou outra planta.", true);
      return;
    }
    atualizarPlantas(plantasRef.current.map(item => item.id === nova.id ? nova : item));
    avisar("Orientação do espaçamento alterada.");
  }

  function removerSelecionada() {
    if (!selecionada) return;
    atualizarPlantas(plantasRef.current.filter(item => item.id !== selecionada.id));
    setSelecionado(null);
    avisar("Planta removida.");
  }

  function limpar() {
    if (!plantas.length) return;
    if (!window.confirm("Remover todas as plantas deste desenho?")) return;
    atualizarPlantas([]);
    setSelecionado(null);
    avisar("Desenho limpo. O rascunho salvo anteriormente não foi alterado.");
  }

  function carregarCanteiro(item) {
    setAtivoId(item.id);
    setNome(item.nome);
    setMedidas(item.medidas);
    setTextoLargura(defaultTexto(item.medidas.largura));
    setTextoComprimento(defaultTexto(item.medidas.comprimento));
    setPlantas(item.plantas);
    plantasRef.current = item.plantas;
    setSelecionado(null);
    setSalvo(true);
  }

  function persistir(proximo) {
    if (inicio.erro) {
      avisar("Existe um problema com o armazenamento anterior. Nenhum dado será sobrescrito.", true);
      return false;
    }
    try {
      // Evita sobrescrever mudanças feitas em outra aba do navegador.
      if (window.localStorage.getItem(chaveCanteiros) !== null) {
        const armazenado = lerColecaoCanteiros();
        if (JSON.stringify(armazenado.itens) !== JSON.stringify(colecao.itens)) {
          throw new Error("Os canteiros mudaram em outra aba. Recarregue antes de salvar para evitar perda de dados.");
        }
      }
      const salvoAgora = gravarColecaoCanteiros(proximo);
      setColecao(salvoAgora);
      setSalvo(true);
      return salvoAgora;
    } catch (falha) {
      avisar(falha.message || "Não foi possível guardar os canteiros neste navegador.", true);
      return false;
    }
  }

  function salvar() {
    if (inicio.erro) return;
    try {
      const proximo = substituirCanteiro(colecao, ativoId,
        { nome: nome.trim(), medidas, plantas: plantasRef.current });
      if (persistir(proximo)) avisar("Canteiro salvo. Ele estará no backup do Meu Quintal.");
    } catch (falha) {
      avisar(falha.message || "Confira o nome e as medidas do canteiro.", true);
    }
  }

  function trocarCanteiro(id) {
    if (id === ativoId) return;
    if (!salvo && !window.confirm("Existem mudanças não salvas. Trocar de canteiro sem salvá-las?")) return;
    const proximo = { ...colecao, ativoId: id };
    if (persistir(proximo)) {
      carregarCanteiro(proximo.itens.find(item => item.id === id));
      avisar("Canteiro aberto.");
    }
  }

  function criarCanteiro() {
    if (!salvo && !window.confirm("Criar outro canteiro sem salvar as mudanças do atual?")) return;
    const nomeNovo = novoNome.trim() || "Canteiro " + (colecao.itens.length + 1);
    if (nomeNovo.length > 60) return avisar("Use um nome com até 60 caracteres.", true);
    try {
      const id = "canteiro-" + (globalThis.crypto?.randomUUID?.() ?? Date.now().toString(36));
      const proximo = adicionarCanteiro(colecao, id, nomeNovo);
      if (persistir(proximo)) {
        carregarCanteiro(proximo.itens.at(-1));
        setNovoNome("");
        avisar("Novo canteiro criado e salvo neste navegador.");
      }
    } catch (falha) {
      avisar(falha.message, true);
    }
  }

  function excluirCanteiro() {
    if (colecao.itens.length < 2) return;
    try {
      const planos = lerOrganizador().dados.planos;
      if (planos.some(plano => plano.canteiroId === ativoId ||
        (!plano.canteiroId && plano.canteiro === ativo.nome))) {
        avisar("Este canteiro está vinculado à agenda. Edite os cultivos antes de excluí-lo.", true);
        return;
      }
    } catch {
      avisar("Não foi possível verificar os vínculos da agenda. Exclusão cancelada.", true);
      return;
    }
    if (!window.confirm("Excluir " + ativo.nome + " e seu desenho salvo? Esta ação não pode ser desfeita.")) return;
    try {
      const proximo = removerCanteiro(colecao, ativoId);
      if (persistir(proximo)) {
        carregarCanteiro(proximo.itens[0]);
        avisar("Canteiro excluído. Os demais foram preservados.");
      }
    } catch (falha) { avisar(falha.message, true); }
  }

  function pontoDoPonteiro(evento) {
    const matriz = svgRef.current?.getScreenCTM();
    if (!matriz) return null;
    const ponto = svgRef.current.createSVGPoint();
    ponto.x = evento.clientX;
    ponto.y = evento.clientY;
    return ponto.matrixTransform(matriz.inverse());
  }

  function iniciarArrasto(evento, id) {
    if (evento.button !== 0) return;
    setSelecionado(id);
    arrastoId.current = id;
    evento.currentTarget.setPointerCapture(evento.pointerId);
  }

  function moverArrasto(evento, id) {
    if (arrastoId.current !== id) return;
    const ponto = pontoDoPonteiro(evento);
    if (ponto) mover(id, ponto.y, ponto.x, true);
  }

  function terminarArrasto(evento) {
    arrastoId.current = null;
    if (evento.currentTarget.hasPointerCapture(evento.pointerId)) {
      evento.currentTarget.releasePointerCapture(evento.pointerId);
    }
  }

  function moverPorTeclado(evento, planta) {
    const passos = {
      ArrowLeft: [0, -PASSO_MOVIMENTO_CM],
      ArrowRight: [0, PASSO_MOVIMENTO_CM],
      ArrowUp: [-PASSO_MOVIMENTO_CM, 0],
      ArrowDown: [PASSO_MOVIMENTO_CM, 0],
    };
    const deslocamento = passos[evento.key];
    if (deslocamento) {
      evento.preventDefault();
      setSelecionado(planta.id);
      mover(planta.id, planta.x + deslocamento[0], planta.y + deslocamento[1]);
    } else if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      setSelecionado(planta.id);
    }
  }

  async function baixarPNG() {
    const original = svgRef.current;
    if (!original || baixando) return;
    setBaixando(true);
    try {
      const copia = original.cloneNode(true);
      copia.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const ladoMaior = Math.max(medidas.largura, medidas.comprimento);
      const largura = Math.max(1, Math.round(1600 * medidas.comprimento / ladoMaior));
      const altura = Math.max(1, Math.round(1600 * medidas.largura / ladoMaior));
      copia.setAttribute("width", String(largura));
      copia.setAttribute("height", String(altura));
      const texto = new XMLSerializer().serializeToString(copia);
      const urlSVG = URL.createObjectURL(new Blob([texto], { type: "image/svg+xml;charset=utf-8" }));
      try {
        const imagem = new Image();
        imagem.src = urlSVG;
        await imagem.decode();
        const canvas = document.createElement("canvas");
        canvas.width = largura;
        canvas.height = altura;
        const contexto = canvas.getContext("2d");
        if (!contexto) throw new Error("Canvas indisponível.");
        contexto.drawImage(imagem, 0, 0, largura, altura);
        const arquivo = await new Promise((resolve, reject) => canvas.toBlob(
          blob => blob ? resolve(blob) : reject(new Error("Não foi possível gerar o PNG.")), "image/png"));
        const urlPNG = URL.createObjectURL(arquivo);
        const link = document.createElement("a");
        link.href = urlPNG;
        link.download = "seu-quintal-canteiro.png";
        document.body.append(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(urlPNG), 1000);
        avisar("Imagem PNG gerada com o desenho atual do canteiro.");
      } finally {
        URL.revokeObjectURL(urlSVG);
      }
    } catch {
      avisar("Não foi possível gerar a imagem neste navegador.", true);
    } finally {
      setBaixando(false);
    }
  }

  return (
    <section className="canteiro-visual" aria-labelledby="titulo-visual-canteiro">
      <div className="canteiro-visual-acima">
        <div>
          <p className="canteiro-etiqueta">FERRAMENTA GRATUITA · SEM CADASTRO</p>
          <h2 id="titulo-visual-canteiro">Monte seu canteiro</h2>
        </div>
        <p className="canteiro-visual-dica-curta">Escolha uma cultura, distribua as plantas e ajuste como preferir.</p>
      </div>

      <div className="meus-canteiros-editor" aria-label="Meus canteiros salvos">
        <label>Abrir canteiro
          <select value={ativoId} onChange={e => trocarCanteiro(e.target.value)}>
            {colecao.itens.map(item => <option key={item.id} value={item.id}>{item.nome}</option>)}
          </select>
        </label>
        <label>Nome do canteiro
          <input value={nome} maxLength={60} onChange={e => { setNome(e.target.value); setSalvo(false); }}/>
        </label>
        <label>Novo canteiro
          <input value={novoNome} maxLength={60} placeholder="Ex.: Canteiro das folhas"
            onChange={e => setNovoNome(e.target.value)}/>
        </label>
        <button type="button" className="botao botao-contorno" onClick={criarCanteiro}
          disabled={Boolean(inicio.erro) || colecao.itens.length >= limiteCanteiros}>＋ Criar</button>
        <button type="button" className="botao botao-contorno" onClick={excluirCanteiro}
          disabled={Boolean(inicio.erro) || colecao.itens.length < 2}>Excluir canteiro</button>
        <button type="button" className="botao" onClick={salvar}
          disabled={Boolean(inicio.erro) || salvo}>{salvo ? "✓ Salvo" : "Salvar alterações"}</button>
        <div className="meus-canteiros-editor-dados">
          <p>{colecao.itens.length} de {limiteCanteiros} canteiros · Salve as alterações antes de trocar de canteiro.</p>
          <a href={window.location.pathname.includes("/meu-quintal/") ? "#horta" : "../organizador/#meus-canteiros"}>
            Ver previsão de plantio e replantio
          </a>
        </div>
      </div>

      <div className="canteiro-visual-grade">
        <div className="canteiro-visual-esquerda">
          <details className="canteiro-visual-cartao" open>
            <summary><span aria-hidden="true">▱</span> Medidas do canteiro</summary>
            <form className="canteiro-medidas" onSubmit={aplicarMedidas}>
              <label>Largura <span className="canteiro-input"><input aria-label="Largura do canteiro em metros"
                inputMode="decimal" value={textoLargura} onChange={e => setTextoLargura(e.target.value)}
                required/><span>m</span></span></label>
              <label>Comprimento <span className="canteiro-input"><input aria-label="Comprimento do canteiro em metros"
                inputMode="decimal" value={textoComprimento} onChange={e => setTextoComprimento(e.target.value)}
                required/><span>m</span></span></label>
              <button className="botao botao-contorno" type="submit">Aplicar medidas</button>
            </form>
          </details>

          <div className="canteiro-visual-cartao canteiro-catalogo">
            <div className="canteiro-cartao-cabecalho">
              <h3><span aria-hidden="true">❧</span> Escolha a cultura</h3>
              <span className="canteiro-cat-contador">{nomes.length} opções</span>
            </div>
            <p className="canteiro-texto-secundario">Toque em uma cultura para adicioná-la ao desenho.</p>
            <div className="canteiro-culturas-grade" role="group" aria-label="Culturas disponíveis">
              {visiveis.map(nome => (
                <button type="button" key={nome} aria-pressed={cultura === nome}
                  className={"canteiro-cultura-item" + (cultura === nome ? " selecionado" : "")}
                  onClick={() => escolherCultura(nome)}>
                  <IconeCultura nome={nome} className="canteiro-cultura-icone"/>
                  <span>{nomeCurtoDaCultura(nome)}</span>
                  {cultura === nome && <b className="canteiro-cultura-check" aria-hidden="true">✓</b>}
                </button>
              ))}
            </div>
            <button type="button" className="canteiro-ver-mais"
              onClick={() => setMostrarTodas(!mostrarTodas)} aria-expanded={mostrarTodas}>
              {mostrarTodas ? "Ver menos culturas" : "Ver todas as culturas"}
            </button>
            <div className="canteiro-espacamento">
              <strong>Espaçamento de referência</strong>
              <p>{metros(dimensoes.largura)} m entre fileiras · {metros(dimensoes.comprimento)} m entre plantas</p>
              <small>Capacidade teórica no canteiro vazio: {capacidade} posições</small>
            </div>
            <details className="canteiro-mais-opcoes">
              <summary>Orientação e fontes técnicas</summary>
              <label><input type="checkbox" checked={girarNovas}
                onChange={e => setGirarNovas(e.target.checked)}/> Inverter a orientação das novas plantas</label>
              <p>Os retângulos indicam o espaço de referência de cada planta. Não incluem corredores, margens extras ou garantia de produção.</p>
              <ul>
                <li><a href={fonteEscalonamento} target="_blank" rel="noopener noreferrer">Embrapa · Plantio escalonado</a></li>
                {ficha.fontes?.map(fonte => <li key={fonte.url}><a href={fonte.url} target="_blank" rel="noopener noreferrer">{fonte.nome}</a></li>)}
              </ul>
            </details>
          </div>
        </div>

        <section className="canteiro-visual-cartao canteiro-area" aria-label="Desenho interativo do canteiro">
          <div className="canteiro-area-cabecalho">
            <div>
              <h3><span aria-hidden="true">✳</span> Seu canteiro</h3>
              <span className="canteiro-texto-secundario">{metros(medidas.largura)} × {metros(medidas.comprimento)} m</span>
            </div>
            <span className="canteiro-vista" aria-label="Vista superior do canteiro">▦ Vista superior</span>
          </div>

          <div className="canteiro-area-desenho">
            <div className="canteiro-medida-horizontal">{metros(medidas.comprimento)} m</div>
            <div className="canteiro-area-svg">
              <svg xmlns="http://www.w3.org/2000/svg" ref={svgRef}
                viewBox={"0 0 " + medidas.comprimento + " " + medidas.largura}
                preserveAspectRatio="xMidYMid meet" role="group"
                aria-label={"Canteiro com " + plantas.length + " plantas. Use os botões abaixo para editar e as setas do teclado para mover uma planta."}>
                <defs>
                  <pattern id={malhaId} patternUnits="userSpaceOnUse" width="25" height="25">
                    <path d="M25 0 L0 0 0 25" fill="none" stroke="#B48B62" strokeWidth=".5" opacity=".5"/>
                  </pattern>
                </defs>
                <rect x="0" y="0" width={medidas.comprimento} height={medidas.largura}
                  fill="#69472E"/>
                <rect x="2" y="2" width={medidas.comprimento - 4} height={medidas.largura - 4}
                  fill="#765139" stroke="#B27B4B" strokeWidth="2"/>
                <rect x="3" y="3" width={medidas.comprimento - 6} height={medidas.largura - 6}
                  fill={"url(#" + malhaId + ")"}/>
                {plantas.map(planta => {
                  const ativa = planta.id === selecionado;
                  const tam = Math.min(planta.largura, planta.comprimento) * .92;
                  return (
                    <g key={planta.id} role="button" tabIndex={0} aria-pressed={ativa}
                      aria-label={planta.cultura + ", posição " + metros(planta.x) + " m por " + metros(planta.y) + " m. Use Enter para selecionar ou setas para mover."}
                      className="canteiro-planta" onClick={() => setSelecionado(planta.id)}
                      onPointerDown={e => iniciarArrasto(e, planta.id)}
                      onPointerMove={e => moverArrasto(e, planta.id)}
                      onPointerUp={terminarArrasto} onPointerCancel={terminarArrasto}
                      onKeyDown={e => moverPorTeclado(e, planta)}>
                      <title>{nomeCurtoDaCultura(planta.cultura) + " — " + metros(planta.largura) + " × " + metros(planta.comprimento) + " m"}</title>
                      <rect x={planta.y - planta.comprimento / 2} y={planta.x - planta.largura / 2}
                        width={planta.comprimento} height={planta.largura}
                        rx={Math.min(2, tam / 5)} fill={ativa ? "#DAE7C0" : "#8AB870"} fillOpacity={ativa ? .24 : .1}
                        stroke={ativa ? "#E9F7A9" : "#D4BE90"} strokeWidth={ativa ? 2 : .8}
                        strokeDasharray={ativa ? "3 2" : "2 2"} vectorEffect="non-scaling-stroke"/>
                      <IconeCultura nome={planta.cultura}
                        x={planta.y - tam / 2} y={planta.x - tam / 2} width={tam} height={tam}/>
                    </g>
                  );
                })}
                <rect x="1" y="1" width={medidas.comprimento - 2} height={medidas.largura - 2}
                  fill="none" stroke="#C79760" strokeWidth="3" vectorEffect="non-scaling-stroke"
                  pointerEvents="none"/>
              </svg>
              {!plantas.length && <div className="canteiro-area-vazio" aria-hidden="true">
                <span>🌱</span><strong>Seu canteiro está pronto</strong>
                <small>Escolha uma cultura e toque em “Adicionar planta”.</small>
              </div>}
            </div>
          </div>
          <div className="canteiro-area-acoes">
            <button className="botao" type="button" onClick={adicionarUma}>＋ Adicionar planta</button>
            <button className="botao botao-contorno" type="button" onClick={preencher}>▦ Preencher área</button>
            <button className="botao botao-contorno" type="button" onClick={girarSelecionada} disabled={!selecionada}>↻ Girar</button>
            <button className="botao botao-contorno" type="button" onClick={removerSelecionada} disabled={!selecionada}>✕ Remover</button>
          </div>
          {plantas.length > 0 && <div className="canteiro-selecao">
            <label>Planta selecionada
              <select value={selecionado ?? ""} onChange={e => setSelecionado(e.target.value || null)}>
                <option value="">Selecione para mover</option>
                {plantas.map((planta, indice) => <option key={planta.id} value={planta.id}>
                  {indice + 1}. {nomeCurtoDaCultura(planta.cultura)} ({metros(planta.x)} × {metros(planta.y)} m)
                </option>)}
              </select>
            </label>
            {selecionada && <div className="canteiro-direcoes" aria-label="Movimentar planta em passos de 5 centímetros">
              <button type="button" onClick={() => mover(selecionada.id, selecionada.x - PASSO_MOVIMENTO_CM, selecionada.y)} aria-label="Mover 5 cm para cima">↑</button>
              <button type="button" onClick={() => mover(selecionada.id, selecionada.x, selecionada.y - PASSO_MOVIMENTO_CM)} aria-label="Mover 5 cm para a esquerda">←</button>
              <button type="button" onClick={() => mover(selecionada.id, selecionada.x + PASSO_MOVIMENTO_CM, selecionada.y)} aria-label="Mover 5 cm para baixo">↓</button>
              <button type="button" onClick={() => mover(selecionada.id, selecionada.x, selecionada.y + PASSO_MOVIMENTO_CM)} aria-label="Mover 5 cm para a direita">→</button>
            </div>}
          </div>}
          <p className="canteiro-ajuda">Arraste no desenho ou selecione uma posição e use as setas. Cada retângulo indica o espaçamento reservado.</p>
        </section>

        <aside className="canteiro-visual-cartao canteiro-resumo" aria-label="Resumo do planejamento">
          <div className="canteiro-resumo-painel">
            <h3><span aria-hidden="true">▥</span> Resumo</h3>
            <dl>
              <div><dt>Área do canteiro</dt><dd>{numero(areaCm2 / 10000)} m²</dd></div>
              <div><dt>Plantas posicionadas</dt><dd>{plantas.length}</dd></div>
              <div><dt>Ocupação teórica</dt><dd><span className="canteiro-anel" style={{ "--sq-progresso": ocupacao + "%" }} aria-hidden="true"/> {numero(ocupacao)}%</dd></div>
            </dl>
          </div>
          {resumo.length > 0 && <details className="canteiro-resumo-culturas">
            <summary>Ver quantidade por cultura</summary>
            <ul>
              {resumo.map(item => <li key={item.cultura}>
                <IconeCultura nome={item.cultura}/><span>{nomeCurtoDaCultura(item.cultura)}</span>
                <strong>{item.quantidade}</strong>
              </li>)}
            </ul>
          </details>}
          <div className="canteiro-resumo-botoes">
            <button className="botao" type="button" onClick={salvar}>
              {salvo ? "✓ Canteiro salvo" : "✓ Salvar canteiro"}
            </button>
            <button className="botao botao-contorno" type="button" onClick={baixarPNG} disabled={baixando}>
              {baixando ? "Gerando imagem…" : "↓ Baixar imagem PNG"}
            </button>
            <button className="canteiro-limpar" type="button" onClick={limpar} disabled={!plantas.length}>Limpar desenho</button>
          </div>
          <p className="canteiro-texto-secundario">Salva vários canteiros neste dispositivo e inclui-os no backup do Meu Quintal. Não sincroniza entre dispositivos.</p>
        </aside>
      </div>

      <div className="canteiro-dica">
        <strong><span aria-hidden="true">✦</span> Dica do Seu Quintal</strong>
        <p>Quer colher em épocas diferentes? Use o <a href={window.location.pathname.includes("/meu-quintal/")
          ? "../horta/organizador/#planejamento-familiar"
          : "../organizador/#planejamento-familiar"}>Organizador de Horta</a> para planejar lotes de plantio.</p>
      </div>
      <p className={erro ? "canteiro-erro" : "canteiro-mensagem"} role={erro ? "alert" : "status"} aria-live="polite">{mensagem}</p>
      <p className="canteiro-sobre">Os espaçamentos são referências por cultura; variedade, solo, irrigação, clima e manejo podem exigir ajustes. O resultado não prevê produtividade.</p>
    </section>
  );
}
