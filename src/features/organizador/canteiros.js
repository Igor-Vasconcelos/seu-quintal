import { validarRascunho, lerRascunho, MEDIDAS_INICIAIS } from "./rascunhoCanteiro.js";

export const chaveCanteiros = "seu-quintal:canteiros:v1";
export const limiteCanteiros = 24;
export const versaoCanteiros = 1;
export const idInicial = "canteiro-inicial";
const nomeInicial = "Meu primeiro canteiro";

export function novoCanteiro(id, nome = "Novo canteiro", medidas = MEDIDAS_INICIAIS) {
  return { id, nome, medidas: { ...medidas }, plantas: [] };
}

export function normalizarColecao(valor) {
  if (!valor || valor.versao !== versaoCanteiros || !Array.isArray(valor.itens) ||
    valor.itens.length < 1 || valor.itens.length > limiteCanteiros ||
    typeof valor.ativoId !== "string") return null;
  const ids = new Set();
  const itens = [];
  for (const item of valor.itens) {
    if (!item || typeof item.id !== "string" || item.id.length < 1 || item.id.length > 80 ||
      ids.has(item.id) || typeof item.nome !== "string" ||
      item.nome !== item.nome.trim() || item.nome.length < 1 || item.nome.length > 60) return null;
    const valido = validarRascunho({
      versao: 1, medidas: item.medidas, plantas: item.plantas,
    });
    if (!valido) return null;
    ids.add(item.id);
    itens.push({ id: item.id, nome: item.nome, ...valido });
  }
  if (!ids.has(valor.ativoId)) return null;
  return { versao: versaoCanteiros, ativoId: valor.ativoId, itens };
}

export function colecaoInicial(legado = null) {
  const rascunho = legado && validarRascunho({ ...legado, versao: 1 });
  return {
    versao: versaoCanteiros,
    ativoId: idInicial,
    itens: [{
      id: idInicial, nome: nomeInicial,
      ...(rascunho ?? { medidas: { ...MEDIDAS_INICIAIS }, plantas: [] }),
    }],
  };
}

// Só migra em memória; não apaga nem sobrescreve o rascunho legado antes do usuário salvar.
export function lerColecaoCanteiros(storage = window.localStorage) {
  const atual = storage.getItem(chaveCanteiros);
  if (atual !== null) {
    let dados;
    try { dados = JSON.parse(atual); }
    catch { throw new Error("Os canteiros salvos têm um JSON inválido. Exporte o armazenamento antes de recuperar."); }
    const valido = normalizarColecao(dados);
    if (!valido) throw new Error("Os canteiros salvos parecem incompatíveis. Nenhum dado foi substituído.");
    return valido;
  }
  return colecaoInicial(lerRascunho(storage));
}

export function gravarColecaoCanteiros(colecao, storage = window.localStorage) {
  const validado = normalizarColecao(colecao);
  if (!validado) throw new Error("Não foi possível salvar: confira as medidas e a distribuição de todos os canteiros.");
  storage.setItem(chaveCanteiros, JSON.stringify(validado));
  return validado;
}

export function substituirCanteiro(colecao, id, alteracoes) {
  if (!colecao.itens.some(item => item.id === id)) throw new Error("Canteiro não encontrado.");
  const itens = colecao.itens.map(item => item.id === id ? { ...item, ...alteracoes, id } : item);
  const resultado = normalizarColecao({ ...colecao, itens });
  if (!resultado) throw new Error("As alterações do canteiro são inválidas.");
  return resultado;
}

export function adicionarCanteiro(colecao, id, nome, medidas = MEDIDAS_INICIAIS) {
  if (colecao.itens.length >= limiteCanteiros) throw new Error("Limite de 24 canteiros atingido.");
  if (colecao.itens.some(item => item.id === id)) throw new Error("Identificador já utilizado.");
  const resultado = normalizarColecao({
    ...colecao, ativoId: id,
    itens: [...colecao.itens, novoCanteiro(id, nome, medidas)],
  });
  if (!resultado) throw new Error("Informe um nome de até 60 caracteres e medidas válidas.");
  return resultado;
}

export function removerCanteiro(colecao, id) {
  if (colecao.itens.length === 1) throw new Error("Mantenha pelo menos um canteiro.");
  const itens = colecao.itens.filter(item => item.id !== id);
  if (itens.length === colecao.itens.length) throw new Error("Canteiro não encontrado.");
  return normalizarColecao({
    ...colecao, itens,
    ativoId: colecao.ativoId === id ? itens[0].id : colecao.ativoId,
  });
}
