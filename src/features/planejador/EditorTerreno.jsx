import { useState } from "react";
import CompararCenarios from "./CompararCenarios.jsx";
import PainelArea from "./PainelArea.jsx";
import Planta from "./Planta.jsx";
import {
  arredondarMedida, criarTerreno, distancia, formatarMedida, limitarPosicao, passoDaMalha, pontosEntreBordas,
} from "./geometria.js";
import { conflitosEntreItens, criarItem, declives, novoId, tiposDeArea } from "./projetos.js";

function ConfigurarTerreno({ terreno, projeto, atualizar, abrirTerreno }) {
  const [frente, definirFrente] = useState(() => String(terreno.largura).replace(".", ","));
  const [profundidade, definirProfundidade] = useState(() => String(terreno.comprimento).replace(".", ","));
  const [erro, definirErro] = useState(false);

  function abrir(evento) {
    evento.preventDefault();
    const novo = criarTerreno(frente, profundidade);
    definirErro(!novo);
    if (novo) abrirTerreno(novo);
  }

  return (
    <details className="config-terreno">
      <summary>Configurar terreno</summary>
      <div className="config-grade">
        <form onSubmit={abrir} aria-label="Medidas do terreno">
          <div className="campos-terreno">
            <label className="campo">Frente (m)
              <input inputMode="decimal" value={frente} onChange={(evento) => definirFrente(evento.target.value)} required />
            </label>
            <label className="campo">Profundidade (m)
              <input inputMode="decimal" value={profundidade} onChange={(evento) => definirProfundidade(evento.target.value)} required />
            </label>
          </div>
          {erro && <p className="erro" role="alert">Informe medidas de 0,01 a 10.000 m, com até duas casas decimais.</p>}
          <button className="botao botao-contorno" type="submit">Abrir terreno com estas medidas</button>
          <p className="nota">Para voltar a um terreno salvo, informe as medidas dele.</p>
        </form>
        <div>
          <label className="campo">Sentido do declive
            <select value={projeto.declive} onChange={(evento) => atualizar({ ...projeto, declive: evento.target.value })}>
              {Object.entries(declives).map(([valor, rotulo]) => <option key={valor} value={valor}>{rotulo}</option>)}
            </select>
          </label>
          <label className="controle-caixa">
            <input type="checkbox" checked={projeto.estrada}
              onChange={(evento) => atualizar({ ...projeto, estrada: evento.target.checked })} />
            Estrada na frente
          </label>
        </div>
      </div>
    </details>
  );
}

function Regua({ modo, mudarModo, limpar, marcas, itensMedidos, pontos }) {
  let instrucao = "Marque dois pontos na planta.";
  if (modo === "pontos" && marcas.length === 1) instrucao = "Marque o segundo ponto na planta.";
  if (modo === "areas") {
    instrucao = itensMedidos.length
      ? `${itensMedidos[0].nome} selecionado. Escolha o segundo item.`
      : "Escolha dois itens na planta ou na lista.";
  }
  if (pontos.length === 2) {
    instrucao = modo === "areas"
      ? `${itensMedidos[0].nome} ↔ ${itensMedidos[1].nome} · menor distância entre bordas.`
      : `${formatarMedida(Math.abs(pontos[1].x - pontos[0].x))} m na horizontal · ${formatarMedida(Math.abs(pontos[1].y - pontos[0].y))} m na vertical.`;
  }

  return (
    <div className="regua-terreno">
      <div className="acoes-planta" role="group" aria-label="Modo de medição">
        <button className={`botao${modo === "pontos" ? "" : " botao-contorno"}`} type="button"
          aria-pressed={modo === "pontos"} onClick={() => mudarModo("pontos")}>Entre pontos</button>
        <button className={`botao${modo === "areas" ? "" : " botao-contorno"}`} type="button"
          aria-pressed={modo === "areas"} onClick={() => mudarModo("areas")}>Entre itens</button>
        <button className="botao botao-contorno" type="button" disabled={!marcas.length} onClick={limpar}>Limpar</button>
      </div>
      <p role="status">
        {pontos.length === 2 && <strong>{formatarMedida(arredondarMedida(distancia(...pontos)))} m</strong>}
        {instrucao}
      </p>
    </div>
  );
}

export default function EditorTerreno({ terreno, projeto, definirProjeto, salvamento, abrirTerreno }) {
  const [tipo, definirTipo] = useState("canteiro");
  const [selecionado, definirSelecionado] = useState(null);
  const [mostrarExistentes, definirMostrarExistentes] = useState(true);
  const [historico, definirHistorico] = useState([]);
  const [acaoCenario, definirAcaoCenario] = useState("");
  const [nomeCenario, definirNomeCenario] = useState("");
  const [comparando, definirComparando] = useState(false);
  const [modoRegua, definirModoRegua] = useState(null);
  const [marcas, definirMarcas] = useState([]);
  const [posicionando, definirPosicionando] = useState(false);

  const cenario = projeto.cenarios.find(({ id }) => id === projeto.ativo);
  const itens = cenario.itens;
  const visiveis = mostrarExistentes ? itens : itens.filter((item) => !item.existente);
  const itemSelecionado = itens.find(({ id }) => id === selecionado);
  const podePosicionar = visiveis.some(({ id }) => id === selecionado);
  const conflitos = conflitosEntreItens(itens);
  const idsEmConflito = new Set(conflitos.flatMap((par) => par.map((item) => item.id)));
  const itensMedidos = modoRegua === "areas" ? marcas.map((id) => itens.find((item) => item.id === id)).filter(Boolean) : [];
  let pontos = modoRegua === "pontos" ? marcas : [];
  if (itensMedidos.length === 2) pontos = pontosEntreBordas(...itensMedidos);
  if (itensMedidos.length === 1) {
    const { x, y, largura, comprimento } = itensMedidos[0];
    pontos = [{ x: x + largura / 2, y: y + comprimento / 2 }];
  }

  function controlarRegua(modo) {
    definirPosicionando(false);
    definirModoRegua(modo);
    definirMarcas([]);
  }

  function atualizar(novo) {
    definirHistorico((atuais) => [...atuais.slice(-19), projeto]);
    definirProjeto(novo);
  }

  function desfazer() {
    definirProjeto(historico.at(-1));
    definirHistorico((atuais) => atuais.slice(0, -1));
    definirMarcas([]);
    definirPosicionando(false);
  }

  function trocarCenario(id) {
    definirProjeto({ ...projeto, ativo: id });
    definirAcaoCenario("");
    definirSelecionado(null);
    definirMarcas([]);
    definirPosicionando(false);
  }

  function nomearCenario(acao) {
    definirComparando(false);
    definirAcaoCenario(acao);
    definirNomeCenario(acao === "duplicar" ? `${cenario.nome.slice(0, 36)} · cópia` : cenario.nome);
  }

  function salvarNome(evento) {
    evento.preventDefault();
    const nome = nomeCenario.trim();
    if (!nome) return;
    if (acaoCenario === "duplicar") {
      const copia = { ...cenario, id: novoId(), nome };
      atualizar({ ...projeto, ativo: copia.id, cenarios: [...projeto.cenarios, copia] });
      definirMarcas([]);
      definirPosicionando(false);
    } else {
      atualizar({ ...projeto, cenarios: projeto.cenarios.map((opcao) => opcao.id === cenario.id ? { ...opcao, nome } : opcao) });
    }
    definirAcaoCenario("");
  }

  function excluirCenario() {
    const restantes = projeto.cenarios.filter(({ id }) => id !== cenario.id);
    atualizar({ ...projeto, cenarios: restantes, ativo: restantes[0].id });
    definirAcaoCenario("");
    definirSelecionado(null);
    definirMarcas([]);
    definirPosicionando(false);
  }

  function atualizarItens(novos) {
    atualizar({
      ...projeto,
      cenarios: projeto.cenarios.map((opcao) => opcao.id === cenario.id ? { ...opcao, itens: novos } : opcao),
    });
  }

  function adicionarItem(evento) {
    evento.preventDefault();
    const item = criarItem(tipo, terreno, itens);
    atualizarItens([...itens, item]);
    if (item.existente) definirMostrarExistentes(true);
    definirSelecionado(item.id);
    controlarRegua(null);
  }

  function salvarItem(item) {
    atualizarItens(itens.map((atual) => atual.id === item.id ? item : atual));
    if (item.existente) definirMostrarExistentes(true);
  }

  function moverItem(item, posicao) {
    definirSelecionado(item.id);
    if (item.x !== posicao.x || item.y !== posicao.y) salvarItem({ ...item, ...posicao });
  }

  function removerItem(id) {
    atualizarItens(itens.filter((item) => item.id !== id));
    definirSelecionado(null);
    definirMarcas([]);
    definirPosicionando(false);
  }

  function selecionarItem(item) {
    if (modoRegua === "areas") {
      definirMarcas((atuais) => {
        if (atuais.length !== 1) return [item.id];
        return atuais[0] === item.id ? atuais : [...atuais, item.id];
      });
    } else {
      definirSelecionado(item.id);
      definirPosicionando(false);
    }
  }

  function marcarPonto({ x, y }) {
    const ponto = {
      x: arredondarMedida(Math.max(0, Math.min(x, terreno.largura))),
      y: arredondarMedida(Math.max(0, Math.min(y, terreno.comprimento))),
    };
    definirMarcas((atuais) => atuais.length === 1 ? [...atuais, ponto] : [ponto]);
  }

  function posicionarItem({ x, y }) {
    moverItem(itemSelecionado, limitarPosicao(x, y, itemSelecionado, terreno));
    definirPosicionando(false);
  }

  const podeComparar = projeto.cenarios.length > 1;

  return (
    <div className="editor-terreno">
      <div className="terreno-resumo">
        <p><strong>{formatarMedida(terreno.largura)} × {formatarMedida(terreno.comprimento)} m</strong>
          <span>{formatarMedida(terreno.area)} m²</span></p>
        <p className="nota" role="status">{salvamento}</p>
      </div>
      <ConfigurarTerreno terreno={terreno} projeto={projeto} atualizar={atualizar} abrirTerreno={abrirTerreno} />

      <div className="faixa-cenarios">
        <label className="campo">Cenário ativo
          <select value={projeto.ativo} onChange={(evento) => trocarCenario(evento.target.value)}>
            {projeto.cenarios.map(({ id, nome }) => <option key={id} value={id}>{nome}</option>)}
          </select>
        </label>
        <div className="acoes-planta">
          <button className="botao botao-contorno" type="button" onClick={() => nomearCenario("duplicar")}>Duplicar cenário</button>
          <button className="botao botao-contorno" type="button" onClick={() => nomearCenario("renomear")}>Renomear</button>
          {podeComparar && <button className="botao" type="button" aria-expanded={comparando} onClick={() => {
            definirComparando(!comparando);
            definirAcaoCenario("");
          }}>{comparando ? "Voltar à planta" : "Comparar cenários"}</button>}
        </div>
      </div>

      {acaoCenario && <form className="nomear-cenario" onSubmit={salvarNome}>
        <label className="campo">{acaoCenario === "duplicar" ? "Nome da cópia" : "Nome do cenário"}
          <input required maxLength={44} value={nomeCenario} onChange={(evento) => definirNomeCenario(evento.target.value)} />
        </label>
        <div className="acoes-planta">
          <button className="botao" type="submit" disabled={!nomeCenario.trim()}>{acaoCenario === "duplicar" ? "Criar cópia" : "Salvar nome"}</button>
          <button className="botao botao-contorno" type="button" onClick={() => definirAcaoCenario("")}>Cancelar</button>
          {acaoCenario === "renomear" && podeComparar && (
            <button className="botao botao-contorno" type="button" onClick={excluirCenario}>Excluir cenário</button>
          )}
        </div>
      </form>}

      {comparando && podeComparar ? (
        <CompararCenarios key={projeto.ativo} projeto={projeto} terreno={terreno} mostrarExistentes={mostrarExistentes} />
      ) : (
        <div className="terreno-grade">
          <form className="adicionar-area cartao-planta" onSubmit={adicionarItem}>
            <label className="campo">O que vai no terreno?
              <select value={tipo} onChange={(evento) => definirTipo(evento.target.value)}>
                {Object.entries(tiposDeArea).map(([id, ficha]) => <option key={id} value={id}>{ficha.nome}</option>)}
              </select>
            </label>
            <button className="botao" type="submit">{tipo === "muda" ? "Adicionar muda" : "Adicionar área"}</button>
          </form>

          <section className="terreno-mapa cartao-planta" aria-labelledby="titulo-planta-terreno">
            <div className="planta-cabecalho">
              <div>
                <h3 id="titulo-planta-terreno">Planta do terreno</h3>
                <p className="nota">Malha de {formatarMedida(passoDaMalha(terreno))} m por quadrado</p>
              </div>
              <div className="acoes-planta">
                <button className="botao botao-contorno" type="button" onClick={desfazer} disabled={!historico.length}>Desfazer</button>
                {podePosicionar && !modoRegua && <button className={`botao${posicionando ? "" : " botao-contorno"}`}
                  type="button" aria-pressed={posicionando} onClick={() => definirPosicionando(!posicionando)}>Posicionar</button>}
                <button className={`botao${modoRegua ? "" : " botao-contorno"}`} type="button" aria-pressed={Boolean(modoRegua)}
                  onClick={() => controlarRegua(modoRegua ? null : "pontos")}>Régua</button>
              </div>
            </div>
            {modoRegua && <Regua modo={modoRegua} mudarModo={controlarRegua} limpar={() => definirMarcas([])}
              marcas={marcas} itensMedidos={itensMedidos} pontos={pontos} />}
            <div className="planta-quadro">
              <p className="marco-terreno">Fundo do terreno</p>
              <Planta terreno={terreno} itens={visiveis} mostrarFrente estrada={projeto.estrada}
                declive={projeto.declive} selecionado={modoRegua === "areas" ? marcas.at(-1) : selecionado}
                conflitos={idsEmConflito} pontos={pontos}
                aoSelecionar={selecionarItem} aoMover={modoRegua || posicionando ? undefined : moverItem}
                aoMarcarPonto={modoRegua === "pontos" ? marcarPonto : posicionando && podePosicionar ? posicionarItem : undefined} />
              <p className="marco-terreno">{projeto.estrada ? "Frente do terreno · estrada" : "Frente do terreno"}</p>
            </div>
            {projeto.declive && <p className="nota">Declive {declives[projeto.declive].toLowerCase()}.</p>}
            {visiveis.length > 0 && !modoRegua && <p className="nota">{posicionando && podePosicionar
              ? "Toque na planta para mover o item selecionado."
              : "Arraste um item para mover ou selecione para editar as medidas."}</p>}
          </section>

          <section className="terreno-itens cartao-planta" aria-labelledby="titulo-itens-terreno">
            <h3 id="titulo-itens-terreno">Áreas e plantios</h3>
            {itens.some((item) => item.existente) && <label className="controle-caixa">
              <input type="checkbox" checked={mostrarExistentes} onChange={(evento) => {
                definirMostrarExistentes(evento.target.checked);
                definirMarcas([]);
                definirPosicionando(false);
              }} />
              Mostrar itens existentes na planta
            </label>}
            {itens.length ? <ul className="itens-terreno">
              {itens.map((item) => <li key={item.id}>
                <button type="button" aria-pressed={modoRegua === "areas" ? marcas.includes(item.id) : selecionado === item.id}
                  onClick={() => selecionarItem(item)}>
                  <span className="item-terreno-cor" data-cor={tiposDeArea[item.tipo].cor} aria-hidden="true" />
                  {item.nome}
                  {item.existente && <small>Existente</small>}
                </button>
              </li>)}
            </ul> : <p className="nota">Adicione a primeira área para começar a montar a planta.</p>}

            {itemSelecionado && !modoRegua && (
              <PainelArea key={JSON.stringify(itemSelecionado)} item={itemSelecionado} terreno={terreno}
                aoSalvar={salvarItem} aoRemover={removerItem} />
            )}
            {conflitos.length > 0 && <div className="aviso conflitos-terreno" role="status">
              <strong>{conflitos.length === 1 ? "1 sobreposição" : `${conflitos.length} sobreposições`}</strong>
              <ul>{conflitos.map(([a, b]) => <li key={`${a.id}-${b.id}`}>{a.nome} e {b.nome}</li>)}</ul>
            </div>}
          </section>
        </div>
      )}
    </div>
  );
}
