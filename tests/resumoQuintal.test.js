import test from "node:test";
import assert from "node:assert/strict";
import { resumirProjetosQuintal } from "../src/features/quintal/resumoQuintal.js";

function projeto(ativo, cenarios) {
  return { ativo, estrada: true, declive: "", cenarios };
}
function cenario(id, itens = []) {
  return { id, nome: id, itens };
}

test("visão geral apresenta estado vazio sem números inventados", () => {
  const resumo = resumirProjetosQuintal({ ultimoTerreno: null, terrenos: {} });
  assert.equal(resumo.terrenos.length, 0);
  assert.equal(resumo.totalCenarios, 0);
  assert.equal(resumo.atual, null);
  assert.equal(resumo.itensNoCenarioAtivo, 0);
});

test("conta cenários de todos os terrenos e itens apenas do cenário ativo", () => {
  const dados = {
    ultimoTerreno: { largura: 35, comprimento: 65 },
    terrenos: {
      "25x40": projeto("base", [
        cenario("base", [{ id: "casa" }]),
        cenario("opcao", [{ id: "horta" }, { id: "pomar" }]),
      ]),
      "35x65": projeto("opcao", [
        cenario("base", []),
        cenario("opcao", [{ id: "galinheiro" }, { id: "tanque" }]),
      ]),
    },
  };
  const resumo = resumirProjetosQuintal(dados);
  assert.equal(resumo.terrenos.length, 2);
  assert.equal(resumo.totalCenarios, 4);
  assert.equal(resumo.atual.id, "35x65");
  assert.equal(resumo.itensNoCenarioAtivo, 2);
  assert.equal(resumo.atual.medidas.area, 2275);
});

test("último terreno ausente escolhe um terreno salvo sem mudar os dados", () => {
  const dados = {
    ultimoTerreno: { largura: 10, comprimento: 10 },
    terrenos: { "25x40": projeto("base", [cenario("base")]) },
  };
  assert.equal(resumirProjetosQuintal(dados).atual.id, "25x40");
  assert.equal(dados.ultimoTerreno.largura, 10);
});

test("ignora identificadores inválidos e projetos incompletos na listagem", () => {
  const dados = {
    ultimoTerreno: null,
    terrenos: {
      "aXb": projeto("base", [cenario("base")]),
      "25x40": { cenarios: null },
      "20x30": projeto("base", [cenario("base")]),
    },
  };
  assert.deepEqual(resumirProjetosQuintal(dados).terrenos.map(({ id }) => id), ["20x30"]);
});
