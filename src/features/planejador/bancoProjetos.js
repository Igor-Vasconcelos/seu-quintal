import { lerProjetos, salvarProjetos } from "./projetos.js";

const nomeBanco = "seu-quintal-terrenos";
const colecao = "projetos";
const registro = "principal";
let abertura;

function abrirBanco() {
  abertura ??= new Promise((resolver, rejeitar) => {
    const pedido = window.indexedDB.open(nomeBanco, 1);
    pedido.onupgradeneeded = () => pedido.result.createObjectStore(colecao);
    pedido.onerror = () => rejeitar(pedido.error);
    pedido.onsuccess = () => {
      const banco = pedido.result;
      banco.onversionchange = () => {
        banco.close();
        abertura = undefined;
      };
      resolver(banco);
    };
  }).catch(() => null);
  return abertura;
}

function consultarBanco(banco, atualizar) {
  return new Promise((resolver, rejeitar) => {
    const transacao = banco.transaction(colecao, atualizar ? "readwrite" : "readonly");
    const projetos = transacao.objectStore(colecao);
    const pedido = projetos.get(registro);
    let resultado;

    transacao.oncomplete = () => resolver(resultado);
    transacao.onabort = () => rejeitar(transacao.error);
    pedido.onsuccess = () => {
      // O primeiro salvamento importa o terreno e os cenários da versão anterior.
      const dados = pedido.result ?? lerProjetos();
      try {
        resultado = atualizar ? atualizar(dados) : dados;
        if (atualizar) projetos.put(resultado.dados, registro);
      } catch (erro) {
        rejeitar(erro);
        transacao.abort();
      }
    };
  });
}

export async function lerProjetosSalvos() {
  const banco = await abrirBanco();
  return banco ? consultarBanco(banco).catch(lerProjetos) : lerProjetos();
}

export async function gravarProjetosSalvos(atualizar) {
  const banco = await abrirBanco();
  if (!banco) {
    const resultado = atualizar(lerProjetos());
    return { ...resultado, salvo: salvarProjetos(resultado.dados) };
  }
  try {
    const resultado = await consultarBanco(banco, atualizar);
    // Mantém a leitura anterior como cópia local para a abertura do painel.
    salvarProjetos(resultado.dados);
    return { ...resultado, salvo: true };
  } catch {
    const dados = await consultarBanco(banco).catch(lerProjetos);
    return { ...atualizar(dados), salvo: false };
  }
}
