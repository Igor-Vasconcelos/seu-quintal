import assert from "node:assert/strict";
import test from "node:test";
import { armazenamentoRecuperavel } from "../src/features/armazenamentoLocal.js";
import { mesclarProjeto } from "../src/features/planejador/mesclarProjeto.js";
import { projetoInicial } from "../src/features/planejador/projetos.js";

const terreno = { largura: 20, comprimento: 30 };
const area = { tipo: "canteiro", id: "canteiro", nome: "Canteiro", x: 0, y: 0, largura: 2, comprimento: 3 };

function comAreas(...itens) {
  return { ...projetoInicial, cenarios: [{ ...projetoInicial.cenarios[0], itens }] };
}

test("salva inclusões de duas abas abertas com o mesmo projeto", () => {
  const casa = { ...area, id: "casa", nome: "Casa" };
  const primeiraAba = comAreas(area);
  const segundaAba = comAreas(casa);
  const combinado = mesclarProjeto(primeiraAba, projetoInicial, segundaAba, terreno);
  assert.deepEqual(combinado, comAreas(area, casa));

  const desfeito = mesclarProjeto(combinado, primeiraAba, projetoInicial, terreno, true);
  assert.deepEqual(desfeito, comAreas(casa));
});

test("preserva alterações de outra aba ao editar e desfazer uma área", () => {
  const deslocada = { ...area, x: 4 };
  const nomeLocal = { ...area, nome: "Horta" };
  const editado = mesclarProjeto(comAreas(deslocada), comAreas(area), comAreas(nomeLocal), terreno);
  assert.deepEqual(editado, comAreas({ ...deslocada, nome: "Horta" }));

  const nomeDaOutraAba = comAreas({ ...deslocada, nome: "Horta da casa" });
  const desfeito = mesclarProjeto(nomeDaOutraAba, editado, comAreas(deslocada), terreno, true);
  assert.deepEqual(desfeito, nomeDaOutraAba);
});

function armazenamentoDeTeste(t) {
  const chave = "teste:registros";
  const itens = new Map();
  const localStorage = {
    getItem: (id) => itens.get(id) ?? null,
    setItem: (id, valor) => itens.set(id, valor),
    removeItem: (id) => itens.delete(id),
  };
  globalThis.window = { localStorage };
  t.after(() => delete globalThis.window);

  const armazenamento = armazenamentoRecuperavel(chave, [], (registros) => {
    const dados = registros.filter((registro) => typeof registro === "string");
    return { dados, incompleto: dados.length !== registros.length };
  });
  return { chave, itens, localStorage, armazenamento };
}

test("recupera os registros legíveis e guarda o original antes de salvar", async (t) => {
  const { chave, itens, armazenamento } = armazenamentoDeTeste(t);
  const bruto = JSON.stringify(["Alface", null]);
  itens.set(chave, bruto);
  assert.deepEqual(armazenamento.ler(), { dados: ["Alface"], corrompido: bruto });
  await assert.rejects(armazenamento.gravar(() => []));

  await armazenamento.recuperar(bruto);
  assert.equal([...itens.values()].includes(bruto), true);
  const resultado = await armazenamento.gravar((dados) => [...dados, "Couve"]);
  assert.deepEqual(resultado, { dados: ["Alface", "Couve"], corrompido: null });
});

test("conserva o valor original se faltar espaço durante a recuperação", async (t) => {
  const { chave, itens, localStorage, armazenamento } = armazenamentoDeTeste(t);
  const bruto = "{json interrompido";
  itens.set(chave, bruto);
  t.mock.method(localStorage, "setItem", (id, valor) => {
    if (id === chave) throw new Error("Armazenamento cheio");
    itens.set(id, valor);
  });

  await assert.rejects(armazenamento.recuperar(bruto), /cheio/);
  assert.deepEqual([...itens.entries()], [[chave, bruto]]);
});
