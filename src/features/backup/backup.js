import { lerProjetosSalvos, gravarProjetosSalvos } from "../planejador/bancoProjetos.js";
import { chaveProjetos, chaveDoTerreno, declives, tiposDeArea } from "../planejador/projetos.js";
import { cabeNoTerreno, criarTerreno } from "../planejador/geometria.js";
import { chaveOrganizador, hortaInicial } from "../organizador/armazenamento.js";
import { formularioInicial, lerPlano } from "../organizador/escala.js";
import { culturasOrganizador } from "../organizador/culturas.js";
import { regioes } from "../../data/plantio.js";
import { chaveCanteiros, lerColecaoCanteiros, normalizarColecao } from "../organizador/canteiros.js";
import { CHAVE_CANTEIRO } from "../organizador/rascunhoCanteiro.js";

export const chaveHistorico = "seu-quintal:historico-cultivo:v1";
export const limiteArquivoBackup = 2 * 1024 * 1024;
export const versaoBackup = 1;

function objeto(valor) {
  return valor !== null && typeof valor === "object" && !Array.isArray(valor);
}

function exigir(condicao, mensagem) {
  if (!condicao) throw new Error(mensagem);
}

function texto(valor) {
  return typeof valor === "string";
}

function validarProjetos(projetos) {
  exigir(objeto(projetos) && objeto(projetos.terrenos), "Os terrenos do backup estão inválidos.");
  if (projetos.ultimoTerreno != null) {
    const ultimo = projetos.ultimoTerreno;
    const medidas = objeto(ultimo)
      ? criarTerreno(String(ultimo.largura), String(ultimo.comprimento)) : null;
    exigir(medidas && ultimo.area === medidas.area,
      "As medidas ou a área do último terreno estão inválidas.");
  }
  for (const [chave, projeto] of Object.entries(projetos.terrenos)) {
    const dimensoes = criarTerreno(...chave.split("x"));
    exigir(dimensoes && chaveDoTerreno(dimensoes) === chave, "Um terreno tem medidas inválidas.");
    exigir(objeto(projeto) && Array.isArray(projeto.cenarios) && projeto.cenarios.length > 0,
      "Um terreno não tem cenários válidos.");
    exigir(typeof projeto.estrada === "boolean" && Object.hasOwn(declives, projeto.declive),
      "As configurações de um terreno estão inválidas.");
    exigir(projeto.cenarios.some((c) => objeto(c) && c.id === projeto.ativo), "O cenário ativo é inválido.");
    for (const cenario of projeto.cenarios) {
      exigir(objeto(cenario) && texto(cenario.id) && texto(cenario.nome) && Array.isArray(cenario.itens),
        "Um cenário do backup está inválido.");
      for (const item of cenario.itens) {
        exigir(objeto(item) && texto(item.id) && texto(item.nome)
          && texto(item.tipo) && Object.hasOwn(tiposDeArea, item.tipo)
          && [item.x, item.y, item.largura, item.comprimento].every(Number.isFinite)
          && (item.tipo === "muda"
            ? item.largura === 0 && item.comprimento === 0
            : item.largura > 0 && item.comprimento > 0)
          && cabeNoTerreno(item, dimensoes), "Um item do planejador está inválido.");
      }
    }
  }
}

function validarHistorico(historico) {
  exigir(Array.isArray(historico), "O histórico de cultivo está inválido.");
  for (const item of historico) {
    exigir(objeto(item) && ["id", "area", "cultura", "plantio", "colheita", "unidade", "observacoes"]
      .every((campo) => texto(item[campo])) && ["kg", "g", "un", "maco"].includes(item.unidade)
      && (item.quantidade == null || Number.isFinite(item.quantidade)),
      "Um registro do histórico está inválido.");
  }
}

function validarOrganizador(organizador) {
  exigir(objeto(organizador) && regioes.includes(organizador.regiao)
    && (organizador.area === null || (Number.isFinite(organizador.area) && organizador.area > 0))
    && Array.isArray(organizador.planos), "O organizador de horta está inválido.");
  for (const item of organizador.planos) {
    exigir(objeto(item) && texto(item.id) && Object.hasOwn(culturasOrganizador, item.cultura)
      && texto(item.canteiro) && Array.isArray(item.concluidas)
      && item.concluidas.every(texto), "Um cultivo do organizador está inválido.");
    const normalizado = lerPlano(formularioInicial(item)).plano;
    const campos = ["cultura", "origem", "inicio", "canteiro", "casa", "venda",
      "intervalo", "rendimento", "duracao", "teste"];
    exigir(normalizado && campos.every((campo) => normalizado[campo] === item[campo]),
      "Um plano de cultivo contém informações inválidas.");
  }
}

export function validarBackup(pacote) {
  exigir(objeto(pacote) && pacote.aplicacao === "seu-quintal", "Este não é um backup do Seu Quintal.");
  exigir(pacote.versao === versaoBackup, "A versão do backup não é compatível.");
  exigir(texto(pacote.criadoEm) && Number.isFinite(Date.parse(pacote.criadoEm)),
    "A data do backup está inválida.");
  exigir(objeto(pacote.dados), "O conteúdo do backup está incompleto.");
  validarProjetos(pacote.dados.projetos);
  validarHistorico(pacote.dados.historico);
  validarOrganizador(pacote.dados.organizador);
  if (Object.hasOwn(pacote.dados, "canteiros")) {
    exigir(normalizarColecao(pacote.dados.canteiros) !== null,
      "Os canteiros do backup estão inválidos.");
  }
  return pacote;
}

function lerLocal(chave, inicial) {
  const salvo = window.localStorage.getItem(chave);
  return salvo === null ? inicial : JSON.parse(salvo);
}

export async function criarBackup() {
  const pacote = {
    aplicacao: "seu-quintal",
    versao: versaoBackup,
    criadoEm: new Date().toISOString(),
    dados: {
      projetos: await lerProjetosSalvos(),
      historico: lerLocal(chaveHistorico, []),
      organizador: lerLocal(chaveOrganizador, hortaInicial),
      ...((window.localStorage.getItem(chaveCanteiros) !== null ||
        window.localStorage.getItem(CHAVE_CANTEIRO) !== null)
        ? { canteiros: lerColecaoCanteiros() } : {}),
    },
  };
  validarBackup(pacote);
  exigir(new Blob([JSON.stringify(pacote)]).size <= limiteArquivoBackup,
    "O backup ultrapassou 2 MB. Não foi possível exportar.");
  return pacote;
}

export function resumoBackup(pacote) {
  const { projetos, historico, organizador } = validarBackup(pacote).dados;
  return {
    terrenos: Object.keys(projetos.terrenos).length,
    cenarios: Object.values(projetos.terrenos).reduce((total, terreno) => total + terreno.cenarios.length, 0),
    registros: historico.length,
    planos: organizador.planos.length,
    ...(Object.hasOwn(pacote.dados, "canteiros") ? { canteiros: pacote.dados.canteiros.itens.length } : {}),
  };
}

export async function restaurarBackup(pacote) {
  const { projetos, historico, organizador, canteiros } = validarBackup(pacote).dados;
  // Um backup antigo não contém canteiros: preserve os atuais em vez de apagá-los.
  const chaves = [chaveHistorico, chaveOrganizador, chaveProjetos,
    ...(canteiros ? [chaveCanteiros] : [])];
  const anteriores = chaves.map((chave) => window.localStorage.getItem(chave));
  try {
    window.localStorage.setItem(chaveHistorico, JSON.stringify(historico));
    window.localStorage.setItem(chaveOrganizador, JSON.stringify(organizador));
    if (canteiros) window.localStorage.setItem(chaveCanteiros, JSON.stringify(canteiros));
    // A gravação do terreno usa IndexedDB, com fallback no armazenamento local.
    const resultado = await gravarProjetosSalvos(() => ({ dados: projetos }));
    if (!resultado.salvo) throw new Error("Não foi possível salvar todos os terrenos.");
  } catch (erro) {
    try {
      chaves.forEach((chave, i) => {
        if (anteriores[i] === null) window.localStorage.removeItem(chave);
        else window.localStorage.setItem(chave, anteriores[i]);
      });
    } catch {
      throw new Error("A restauração falhou e o navegador não conseguiu reverter todos os dados locais. Não feche esta aba.");
    }
    throw erro;
  }
}
