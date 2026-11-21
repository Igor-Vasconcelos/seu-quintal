import test from "node:test";
import assert from "node:assert/strict";
import { culturasOrganizador } from "../src/features/organizador/culturas.js";
import { gravarRascunho, CHAVE_CANTEIRO } from "../src/features/organizador/rascunhoCanteiro.js";
import {
  chaveCanteiros, colecaoInicial, lerColecaoCanteiros, gravarColecaoCanteiros,
  normalizarColecao, adicionarCanteiro, substituirCanteiro, removerCanteiro,
} from "../src/features/organizador/canteiros.js";
import { situacaoDosCanteiros } from "../src/features/organizador/situacaoCanteiros.js";
import { formularioInicial, lerPlano } from "../src/features/organizador/escala.js";

function storage() {
  const map = new Map();
  return {
    getItem: chave => map.get(chave) ?? null,
    setItem: (chave, texto) => map.set(chave, texto),
    removeItem: chave => map.delete(chave),
  };
}
const planta = { id:"p1", cultura:"Alface de verão", x:12.5, y:12.5, largura:25, comprimento:25 };
const primeiro = () => ({ medidas: { largura:100, comprimento:200 }, plantas:[planta] });

test("migra o rascunho legado sem apagar ou substituir a chave antiga", () => {
  const mem = storage();
  gravarRascunho(primeiro(), mem);
  const copiaOriginal = mem.getItem(CHAVE_CANTEIRO);
  const colecao = lerColecaoCanteiros(mem);
  assert.equal(colecao.itens.length, 1);
  assert.deepEqual(colecao.itens[0].plantas, [planta]);
  assert.equal(mem.getItem(chaveCanteiros), null, "leitura nao migra no armazenamento");
  gravarColecaoCanteiros(colecao, mem);
  assert.equal(mem.getItem(CHAVE_CANTEIRO), copiaOriginal);
  assert.deepEqual(lerColecaoCanteiros(mem), colecao);
});

test("cria, renomeia, edita e exclui canteiros sem mexer no vizinho", () => {
  const mem = storage();
  const inicial = colecaoInicial();
  const dois = adicionarCanteiro(inicial, "canteiro-b", "Raizes", { largura:100, comprimento:300 });
  assert.equal(dois.itens.length, 2);
  const editado = substituirCanteiro(dois, "canteiro-b", { nome:"Raízes", plantas:[planta] });
  gravarColecaoCanteiros(editado, mem);
  assert.equal(lerColecaoCanteiros(mem).itens[1].plantas.length, 1);
  assert.equal(lerColecaoCanteiros(mem).itens[0].plantas.length, 0);
  const removido = removerCanteiro(editado, "canteiro-b");
  assert.equal(removido.itens.length, 1);
  assert.equal(removido.ativoId, inicial.ativoId);
  assert.throws(() => removerCanteiro(removido, inicial.ativoId), /pelo menos um/);
});

test("recusa coleções inválidas e nunca sobrescreve dados corrompidos", () => {
  const mem = storage();
  const inicial = colecaoInicial();
  assert.equal(normalizarColecao({ ...inicial, versao:4 }), null);
  assert.equal(normalizarColecao({ ...inicial, itens:[inicial.itens[0], inicial.itens[0]] }), null);
  assert.equal(normalizarColecao({ ...inicial, itens:[{...inicial.itens[0], nome:""}] }), null);
  assert.equal(normalizarColecao({ ...inicial, itens:[{...inicial.itens[0], plantas:[planta, {...planta,id:"p2"}]}] }), null);
  assert.throws(() => adicionarCanteiro(inicial, inicial.itens[0].id, "Duplicado"), /utilizado/);
  mem.setItem(chaveCanteiros, "{corrompido");
  assert.throws(() => lerColecaoCanteiros(mem), /JSON inválido/);
  assert.equal(mem.getItem(chaveCanteiros), "{corrompido");
});

test("a referência do canteiro usa ID estável, mesmo depois de renomear", () => {
  const id = "canteiro-estavel";
  const plano = {
    ...lerPlano({ ...formularioInicial(null,"Alface de verão"), canteiroId:id,
      canteiro:"Canteiro das folhas", inicio:"2026-11-21", casa:"2", venda:"0" }).plano,
    id:"cultivo-a",
  };
  assert.equal(plano.canteiroId, id);
  const original = adicionarCanteiro(colecaoInicial(), id, "Canteiro das folhas");
  const novo = substituirCanteiro(original, id, { nome:"Horta da varanda" });
  const sit = situacaoDosCanteiros(novo,[plano],"2026-12-02");
  assert.equal(sit.find(s=>s.id===id).planos, 1);
});

test("as previsões informam colheita, área e datas condicionais, não liberação garantida", () => {
  const inicial = colecaoInicial();
  const id = inicial.ativoId;
  const alface = {
    ...lerPlano({ ...formularioInicial(null,"Alface de verão"), canteiroId:id,
      canteiro:"Meu primeiro canteiro", inicio:"2026-11-21", casa:"2", venda:"0" }).plano,
    id:"cultivo-a",
  };
  const result = situacaoDosCanteiros(inicial,[alface],"2026-12-01")[0];
  assert.equal(result.planos, 1);
  assert.ok(result.sugestao.includes("Replantio") || result.sugestao.includes("Entrada") ||
    result.sugestao.includes("Liberação"));
  assert.ok(result.colheitas.length > 0);
  assert.ok(result.demanda > 0);
  const planoContinua = {
    ...lerPlano({ ...formularioInicial(null,"Tomate de mesa"), canteiroId:id,
      canteiro:"Meu primeiro canteiro", inicio:"2026-09-01", casa:"0,5", venda:"0" }).plano,
    id:"cultivo-b",
  };
  const desconhecida = situacaoDosCanteiros(inicial,[planoContinua],"2026-12-02")[0];
  assert.match(desconhecida.sugestao, /Liberação sem data|Entrada|não há lote/i);
});

test("as culturas ainda compartilham espaçamentos com o planejador visual", () => {
  assert.equal(culturasOrganizador["Alface de verão"].espaco[0], .25);
});
