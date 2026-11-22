import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { culturasOrganizador } from "../src/features/organizador/culturas.js";
import { buscarCulturas, categoriasCulturas, gruposCulturas, todasCulturas } from "../src/features/organizador/catalogoCulturas.js";
import { formularioInicial, lerPlano, dimensionarLote, projetarLote } from "../src/features/organizador/escala.js";
import { metaExemplo, calcularPlanoFamiliar } from "../src/features/organizador/planoFamiliar.js";
import { buscaFichaCultura } from "../src/data/fichas-culturas.js";
import { iconeDaCultura } from "../src/features/organizador/culturasVisuais.js";
import { normalizarColecao } from "../src/features/organizador/canteiros.js";

test("27 culturas disponíveis, nenhuma órfã, com ficha técnica e categoria", () => {
  assert.equal(todasCulturas.length, 27);
  assert.equal(new Set(todasCulturas).size, todasCulturas.length);
  assert.deepEqual(new Set(todasCulturas), new Set(Object.keys(culturasOrganizador)));
  assert.equal(categoriasCulturas.length, 5);
  for (const nome of todasCulturas) {
    const guia = buscaFichaCultura(nome);
    assert.ok(guia?.plantio && guia?.cuidados && guia?.colheita, nome);
    assert.ok(Number.isInteger(guia.pagina), nome);
    assert.ok(iconeDaCultura(nome) !== "folha", "Ícone enganoso em " + nome);
    const ficha = culturasOrganizador[nome];
    assert.ok(ficha.ponto.length >= 20 && ficha.unidade, nome);
    assert.ok(ficha.canteiro[0] > 0 && ficha.canteiro[1] >= ficha.canteiro[0], nome);
    assert.ok(ficha.espaco.every(n => n > 0), nome);
    assert.ok(gruposCulturas[categoriasCulturas.find(c => gruposCulturas[c].includes(nome))], nome);
  }
});
test("busca tolera acentos e filtra por categoria sem afetar os dados", () => {
  assert.deepEqual(buscarCulturas("brocolis"), ["Brócolis de verão", "Brócolis de inverno"]);
  assert.deepEqual(buscarCulturas("pimentao"), ["Pimentão"]);
  assert.deepEqual(buscarCulturas("couve", "Raízes"), []);
  assert.equal(buscarCulturas("", "Temperos").length, 3);
  assert.equal(buscarCulturas("rucula")[0], "Rúcula");
});
test("cada cultura permite um plano inicial, com área e cronograma finitos", () => {
  for (const nome of todasCulturas) {
    const campos = formularioInicial(null, nome);
    const { plano, erro } = lerPlano(campos);
    assert.ok(plano && !erro, nome + ": " + erro);
    const lote = dimensionarLote(plano);
    assert.ok(Number.isFinite(lote.areaSimultanea) && lote.areaSimultanea > 0, nome);
    assert.ok(lote.plantas > 0, nome);
    const projecao = projetarLote(plano, 0);
    assert.match(projecao.colheita.de, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(projecao.colheita.ate >= projecao.colheita.de, nome);
    assert.ok(metaExemplo(nome, 4) > 0, nome);
  }
});
test("coentro é colheita por lote em kg: teste obrigatório sem simular rebrota", () => {
  const ficha = culturasOrganizador.Coentro;
  assert.equal(ficha.colheitasSucessivas, undefined);
  assert.equal(ficha.planejamentoPorPeso, true);
  const campos = formularioInicial(null, "Coentro");
  const { plano } = lerPlano(campos);
  assert.ok(dimensionarLote(plano).experimental);
  assert.equal(projetarLote(plano, 0).etapas.at(-1).nome, "Colher");
  const comRendimento = lerPlano({ ...campos, rendimento: "0,05" }).plano;
  assert.equal(dimensionarLote(comRendimento).experimental, false);
});
test("morango inicia por muda pronta, sem indicar semeadura inadequada", () => {
  const campos = formularioInicial(null, "Morango");
  assert.equal(campos.origem, "muda");
  const plano = lerPlano({ ...campos, origem: "semente" }).plano;
  assert.equal(plano.origem, "muda");
  assert.equal(projetarLote(plano, 0).etapas[0].id, "transplantar");
});
test("cálculo familiar não promete meta em kg sem medição de produção", () => {
  const resultado = calcularPlanoFamiliar({
    pessoas: 2, quantidadeCanteiros: 10, largura: 2, comprimento: 3,
    inicio: "2026-11-22", regiao: "Sudeste",
    preferencias: [{cultura:"Coentro", casa:0.2,venda:0}, {cultura:"Pimentão",casa:0.2,venda:0}],
  });
  assert.equal(resultado.erro, null);
  assert.equal(resultado.sugestoes.length, 2);
  assert.ok(resultado.sugestoes.every(item => item.experimental));
});
test("opções antigas de canteiro continuam válidas sem alteração de formato", () => {
  const colecao = { versao: 1, ativoId: "a", itens: [{
    id: "a", nome: "Meu canteiro", medidas: { largura: 120, comprimento: 240 }, plantas: [],
  }]};
  assert.ok(normalizarColecao(colecao));
  const fonte = readFileSync(resolve(import.meta.dirname, "../src/features/organizador/PlanejadorVisualCanteiro.jsx"), "utf8");
  assert.match(fonte, /buscarCulturas\(buscaCultura, categoriaCultura\)/);
  assert.match(fonte, /canteiro-cultura-conselho/);
  const familia = readFileSync(resolve(import.meta.dirname, "../src/features/organizador/PlanejamentoFamiliar.jsx"), "utf8");
  assert.match(familia, /Buscar cultura/);
  assert.match(familia, /Guia rápido:/);
});
