import { useEffect, useState } from "react";
import RecuperarDados from "../../components/RecuperarDados.jsx";
import { regioes } from "../../data/plantio.js";
import HistoricoCultivo from "../cultivo/HistoricoCultivo.jsx";
import { formatarMedida, lerMedida } from "../planejador/geometria.js";
import { novoId } from "../planejador/projetos.js";
import AgendaHorta from "./AgendaHorta.jsx";
import PlanejamentoFamiliar from "./PlanejamentoFamiliar.jsx";
import CanteirosResumo from "./CanteirosResumo.jsx";
import { chaveCanteiros, colecaoInicial, lerColecaoCanteiros } from "./canteiros.js";
import { chaveOrganizador, gravarOrganizador, hortaInicial, lerOrganizador, recuperarOrganizador } from "./armazenamento.js";
import { culturasOrganizador } from "./culturas.js";
import { avancarDias, dimensionarLote, janelaDeDatas, projetarLote, rotuloData } from "./escala.js";
import FormularioCultivo from "./FormularioCultivo.jsx";
import "../../styles/organizador-horta.css";

function abrirOrganizador() {
  try {
    return lerOrganizador();
  } catch {
    return { dados: hortaInicial, corrompido: null, erro: "O plano deste navegador está indisponível." };
  }
}

function ConfiguracaoHorta({ dados, aoSalvar, bloqueado }) {
  const [erro, definirErro] = useState("");
  function salvar(evento) {
    evento.preventDefault();
    const campos = new FormData(evento.currentTarget);
    const texto = campos.get("area").trim();
    const area = texto ? lerMedida(texto) : null;
    if (texto && area === null) {
      definirErro("Informe uma área de 0,01 a 10.000 m² ou deixe o campo em branco.");
      return;
    }
    definirErro("");
    aoSalvar(campos.get("regiao"), area);
  }

  return (
    <details className="organizador-config">
      <summary>Região e espaço da horta</summary>
      <form onSubmit={salvar} aria-label="Região e espaço da horta">
        <div className="organizador-campos">
          <label className="campo">Região
            <select name="regiao" defaultValue={dados.regiao}>
              {regioes.map((regiao) => <option key={regiao}>{regiao}</option>)}
            </select>
          </label>
          <label className="campo">Área útil dos canteiros em m² (opcional)
            <input name="area" inputMode="decimal" defaultValue={dados.area ? String(dados.area).replace(".", ",") : ""} />
          </label>
        </div>
        {erro && <p className="erro" role="alert">{erro}</p>}
        <button className="botao botao-contorno" type="submit" disabled={bloqueado}>Salvar região e espaço</button>
      </form>
    </details>
  );
}

function CultivoSalvo({ plano, aoEditar, aoRemover, bloqueado }) {
  const [confirmar, definirConfirmar] = useState(false);
  const ficha = culturasOrganizador[plano.cultura];
  const { plantas } = dimensionarLote(plano);
  const primeiro = projetarLote(plano, 0);
  return (
    <li className="organizador-cultivo">
      <div className="organizador-cultivo-cabecalho">
        <div>
          <h3>{plano.cultura}</h3>
          {plano.canteiro && <p className="nota">{plano.canteiro}</p>}
        </div>
        <div className="organizador-acoes">
          <button type="button" className="botao botao-contorno" disabled={bloqueado} onClick={() => aoEditar(plano.id)}
            aria-label={`Editar ${plano.cultura}`}>Editar</button>
          <button type="button" className="botao botao-contorno" disabled={bloqueado} onClick={() => definirConfirmar(!confirmar)}
            aria-label={`Remover ${plano.cultura}`} aria-expanded={confirmar}>Remover</button>
        </div>
      </div>
      <p className="organizador-meta-salva">
        {formatarMedida(plantas)} {plantas === 1 ? "planta" : "plantas"} por lote
        {" · "}{plano.intervalo === 1 ? "Toda semana" : `A cada ${plano.intervalo} semanas`}
        {" · "}{plano.origem === "muda" ? "Muda pronta" : "Semente"}
      </p>
      <p className="nota">Meta por semana · Casa {formatarMedida(plano.casa)} {ficha.unidade}
        {plano.venda > 0 && ` · Venda ${formatarMedida(plano.venda)} ${ficha.unidade}`}</p>
      <p className="nota">Primeira colheita prevista de {janelaDeDatas(primeiro.colheita.de, primeiro.colheita.ate)}</p>
      <details className="organizador-detalhes organizador-lotes">
        <summary>Ver os 6 primeiros lotes</summary>
        <ol>
          {Array.from({ length: 6 }, (_, indice) => projetarLote(plano, indice)).map((lote) => (
            <li key={lote.inicio}>
              <strong>Lote {lote.numero}</strong>
              <dl>
                {lote.etapas.map((etapa) => (
                  <div key={etapa.id}><dt>{etapa.nome}</dt><dd>{janelaDeDatas(etapa.de, etapa.ate)}</dd></div>
                ))}
                {plano.duracao && <div>
                  <dt>Colheitas previstas até</dt><dd>{rotuloData(avancarDias(lote.colheita.ate, plano.duracao * 7 - 1))}</dd>
                </div>}
              </dl>
            </li>
          ))}
        </ol>
      </details>
      {confirmar && <div className="organizador-confirmar">
        <p>Remover este cultivo da agenda?</p>
        <div className="organizador-acoes">
          <button type="button" className="botao botao-terracota" disabled={bloqueado} onClick={() => aoRemover(plano.id)}>Confirmar remoção</button>
          <button type="button" className="botao botao-contorno" onClick={() => definirConfirmar(false)}>Manter cultivo</button>
        </div>
      </div>}
    </li>
  );
}

function PlanoHorta({ dados, aoEditar, aoRemover, bloqueado }) {
  const total = dados.planos.reduce((area, plano) => area + dimensionarLote(plano).areaSimultanea, 0);
  const temEstimativaParcial = dados.planos.some((plano) => culturasOrganizador[plano.cultura].colheitasSucessivas && !plano.duracao);

  return (
    <section className="organizador-cartao" id="plano-horta" aria-labelledby="titulo-plano-horta">
      <div className="organizador-secao-cabecalho">
        <h2 id="titulo-plano-horta" tabIndex="-1">Meu plano de horta</h2>
        {dados.planos.length > 0 && <a href="#agenda-horta">Abrir agenda</a>}
      </div>
      {dados.planos.length ? <>
        <div className="organizador-area-total">
          <p><strong>{formatarMedida(total)} m²</strong> estimados de canteiro para o conjunto
            {dados.area && ` · ${formatarMedida(dados.area)} m² disponíveis`}</p>
          <p className="nota">Soma das áreas previstas para os lotes simultâneos de cada cultura, antes dos caminhos.</p>
          {temEstimativaParcial && <p className="nota">Nos cultivos sem duração de colheita informada, a área conta até a primeira colheita.</p>}
          {dados.area && total > dados.area && <p className="aviso">A estimativa ultrapassa a área informada. Revise as metas ou divida os cultivos por época.</p>}
        </div>
        <ul className="organizador-cultivos">
          {dados.planos.map((plano) => <CultivoSalvo key={plano.id} plano={plano} aoEditar={aoEditar} aoRemover={aoRemover} bloqueado={bloqueado} />)}
        </ul>
      </> : <p className="organizador-vazio">Adicione um primeiro cultivo para montar a agenda da sua horta.</p>}
    </section>
  );
}

export default function OrganizadorHorta({ culturaSugerida }) {
  const [estado, definirEstado] = useState(abrirOrganizador);
  const [estadoCanteiros, definirEstadoCanteiros] = useState(() => {
    try { return { dados: lerColecaoCanteiros(), erro: "" }; }
    catch (falha) { return { dados: colecaoInicial(), erro: falha.message }; }
  });
  const [edicao, definirEdicao] = useState(null);
  const [mensagem, definirMensagem] = useState("");
  const [salvando, definirSalvando] = useState(false);
  const { dados, erro, corrompido } = estado;
  const bloqueado = salvando || corrompido !== null;
  const planoEmEdicao = dados.planos.find(({ id }) => id === edicao);

  useEffect(() => {
    function sincronizar(evento) {
      if (evento.key === chaveOrganizador || evento.key === null) definirEstado(abrirOrganizador());
      if (evento.key === chaveCanteiros || evento.key === null) {
        try { definirEstadoCanteiros({ dados: lerColecaoCanteiros(), erro: "" }); }
        catch (falha) { definirEstadoCanteiros(atual => ({ ...atual, erro: falha.message })); }
      }
    }
    window.addEventListener("storage", sincronizar);
    return () => window.removeEventListener("storage", sincronizar);
  }, []);

  async function atualizar(transformar, retorno = "") {
    if (bloqueado) return false;
    definirSalvando(true);
    try {
      definirEstado(await gravarOrganizador(transformar));
      definirMensagem(retorno);
      return true;
    } catch {
      definirEstado({ ...abrirOrganizador(), erro: "O navegador não conseguiu salvar o plano. Confira se o armazenamento local está disponível." });
      return false;
    } finally {
      definirSalvando(false);
    }
  }

  async function recuperar() {
    definirSalvando(true);
    definirMensagem("");
    try {
      const restaurado = await recuperarOrganizador(corrompido);
      definirEstado(restaurado);
      if (restaurado.corrompido === null) {
        definirMensagem("Plano recuperado. Você já pode salvar cultivos.");
        focar("titulo-form-cultivo");
      }
    } catch {
      definirEstado((atual) => ({ ...atual, erro: "O navegador não conseguiu guardar a cópia dos dados. Confira o espaço disponível e tente novamente." }));
    } finally {
      definirSalvando(false);
    }
  }

  function focar(id) {
    requestAnimationFrame(() => document.getElementById(id)?.focus());
  }

  function editar(id) {
    definirEdicao(id);
    definirMensagem("");
    focar("titulo-form-cultivo");
  }

  async function salvarPlano(plano) {
    const id = planoEmEdicao?.id ?? novoId();
    const salvo = await atualizar((atuais) => {
      const anterior = atuais.planos.find((item) => item.id === id);
      const concluidas = anterior?.cultura === plano.cultura && anterior.origem === plano.origem ? anterior.concluidas : [];
      const novo = { ...plano, id, concluidas };
      return {
        ...atuais,
        planos: anterior ? atuais.planos.map((item) => item.id === id ? novo : item) : [...atuais.planos, novo],
      };
    }, planoEmEdicao ? "Cultivo atualizado." : `${plano.cultura} adicionada ao plano.`);
    if (salvo) {
      definirEdicao(null);
      focar("titulo-plano-horta");
    }
  }

  async function adicionarSugestoes(sugestoes, areaTotal) {
    if (!sugestoes.length || bloqueado) return false;
    return atualizar((atuais) => {
      const existentes = new Set(atuais.planos.map(p => p.cultura));
      const novos = sugestoes.filter(p => !existentes.has(p.cultura))
        .map(plano => ({ ...plano, id: novoId(), concluidas: [] }));
      if (novos.length !== sugestoes.length) throw new Error("Um cultivo já foi cadastrado.");
      return { ...atuais, area: atuais.area ?? areaTotal, planos: [...atuais.planos, ...novos] };
    }, "Sugestões de plantio incluídas na agenda.");
  }

  async function remover(id) {
    if (await atualizar((atuais) => ({ ...atuais, planos: atuais.planos.filter((plano) => plano.id !== id) }), "Cultivo removido.")) {
      if (id === edicao) definirEdicao(null);
      focar("titulo-plano-horta");
    }
  }

  function concluir(id, chave, feita) {
    atualizar((atuais) => ({
      ...atuais,
      planos: atuais.planos.map((plano) => {
        if (plano.id !== id) return plano;
        const concluidas = new Set(plano.concluidas);
        if (feita) concluidas.add(chave);
        else concluidas.delete(chave);
        return { ...plano, concluidas: [...concluidas] };
      }),
    }), feita ? "Atividade concluída." : "Atividade reaberta.");
  }

  function abrirAssistente() {
    const painel = document.getElementById("planejamento-familiar");
    if (!painel) return;
    painel.open = true;
    painel.scrollIntoView({ block: "start", behavior: "auto" });
    painel.querySelector("summary")?.focus({ preventScroll: true });
  }

  return (
    <div className="organizador">
      <div className="organizador-inicio">
        <div>
          <span className="organizador-etiqueta">DA PRIMEIRA MUDA À COLHEITA</span>
          <h2>Organize sua horta no seu ritmo</h2>
          <p>Escolha as culturas, planeje lotes com datas estimadas e acompanhe o que precisa fazer.</p>
          <p className="organizador-inicio-contador" role="status">
            {dados.planos.length ? `${dados.planos.length} cultivo(s) no seu plano` : "Você ainda não cadastrou cultivos."}
          </p>
        </div>
        <nav aria-label="Etapas do planejamento da horta" className="organizador-atalhos">
          <button type="button" onClick={abrirAssistente}>1. Escolher culturas</button>
          <a href="#titulo-form-cultivo">2. Planejar cultivo</a>
          <a href={dados.planos.length ? "#agenda-horta" : "#plano-horta"}>
            {dados.planos.length ? "3. Ver minha agenda" : "3. Ver meu plano"}
          </a>
        </nav>
      </div>
      <div className="organizador-barra">
        <ConfiguracaoHorta key={`${dados.regiao}/${dados.area}`} dados={dados}
          aoSalvar={(regiao, area) => atualizar((atuais) => ({ ...atuais, regiao, area }), "Região e espaço salvos.")}
          bloqueado={bloqueado} />
      </div>
      {erro && <p className="erro" role="alert">{erro}</p>}
      {corrompido !== null && <RecuperarDados recuperar={recuperar} salvando={salvando} />}
      <p className="organizador-status" role="status">{mensagem}</p>
      <CanteirosResumo colecao={estadoCanteiros.dados} planos={dados.planos} aviso={estadoCanteiros.erro} />
      <PlanejamentoFamiliar regiao={dados.regiao} planosExistentes={dados.planos}
        bloqueado={bloqueado} aoAplicar={adicionarSugestoes} />
      <FormularioCultivo key={planoEmEdicao?.id ?? "novo"} edicao={planoEmEdicao} regiao={dados.regiao}
        canteiros={estadoCanteiros.erro ? [] : estadoCanteiros.dados.itens}
        culturaSugerida={culturaSugerida} aoSalvar={salvarPlano} aoCancelar={() => definirEdicao(null)} bloqueado={bloqueado} />
      <PlanoHorta dados={dados} aoEditar={editar} aoRemover={remover} bloqueado={bloqueado} />
      {dados.planos.length > 0 && <AgendaHorta planos={dados.planos} regiao={dados.regiao} aoConcluir={concluir} bloqueado={bloqueado} />}
      <details className="organizador-cartao organizador-historico" id="historico-horta">
        <summary>Histórico de cultivo</summary>
        <p className="nota">Anote as colheitas para ajustar os próximos lotes com o rendimento da sua horta.</p>
        <HistoricoCultivo />
      </details>
    </div>
  );
}
