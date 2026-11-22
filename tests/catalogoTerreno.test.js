import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { criarTerreno, cabeNoTerreno } from "../src/features/planejador/geometria.js";
import {
  tiposDeArea, tiposDeAreaDisponiveis, gruposDeArea,
  criarItem, chaveProjetos, lerProjetos,
} from "../src/features/planejador/projetos.js";
import { validarBackup } from "../src/features/backup/backup.js";
import { hortaInicial } from "../src/features/organizador/armazenamento.js";

const iconSource = readFileSync(resolve(import.meta.dirname, "../src/components/Icone.jsx"), "utf8");
const editorSource = readFileSync(resolve(import.meta.dirname, "../src/features/planejador/EditorTerreno.jsx"), "utf8");

const novasAreas = [
  "viveiro", "deposito", "estufa", "minhocario", "biodigestor",
  "caixaagua", "cisterna", "entrada", "patio",
  "pergolado", "redario", "piscina", "quadra",
];

test("catálogo inclui Sisteminha, lazer e circulação com os sete grupos acessíveis", () => {
  assert.equal(Object.keys(gruposDeArea).length, 7);
  for (const id of [
    "horta", "pomar", "galinheiro", "tanque", "compostagem", "minhocario",
    "piscina", "quadra", "acesso", ...novasAreas,
  ]) {
    assert.ok(Object.hasOwn(tiposDeAreaDisponiveis, id), id);
  }
  assert.equal(tiposDeArea.acesso.nome, "Caminho");
  assert.equal(tiposDeArea.quadra.nome, "Campinho / quadra");
  assert.equal(tiposDeArea.piscina.nome, "Piscina");
  assert.equal(tiposDeArea.manobra.oculto, true);
  assert.ok(!Object.hasOwn(tiposDeAreaDisponiveis, "manobra"));
  assert.match(editorSource, /Object.entries\(tiposDeAreaDisponiveis\)/);
});

test("cada opção visível possui medidas válidas, grupo e ícone vetorial 24 × 24", () => {
  assert.match(iconSource, /viewBox="0 0 24 24"/);
  for (const [id, ficha] of Object.entries(tiposDeAreaDisponiveis)) {
    assert.ok(gruposDeArea[ficha.grupo], id + " sem grupo");
    assert.ok(typeof ficha.nome === "string" && ficha.nome.length > 0, id);
    assert.ok(Number.isFinite(ficha.largura) && Number.isFinite(ficha.comprimento), id);
    assert.ok(ficha.largura >= 0 && ficha.comprimento >= 0, id);
    if (id !== "muda") assert.ok(ficha.largura > 0 && ficha.comprimento > 0, id);
    assert.ok(iconSource.includes("  " + ficha.icone + ": "), id + " sem ícone " + ficha.icone);
  }
  for (const [id, grupo] of Object.entries(gruposDeArea)) {
    assert.ok(Object.values(tiposDeAreaDisponiveis).some(ficha => ficha.grupo === id), id);
    assert.ok(iconSource.includes("  " + grupo.icone + ": "), "grupo " + id + " sem ícone");
  }
  assert.doesNotMatch(iconSource, /<img\b|<image\b/);
});

test("novas áreas usam as dimensões iniciais apenas como referência e cabem na planta", () => {
  const terreno = criarTerreno("25", "40");
  for (const tipo of novasAreas) {
    const item = criarItem(tipo, terreno, []);
    assert.equal(item.tipo, tipo);
    assert.ok(cabeNoTerreno(item, terreno), tipo);
    assert.ok(item.id && typeof item.id === "string");
  }
  const pequeno = criarTerreno("2", "3");
  for (const tipo of ["piscina", "quadra", "acesso"]) {
    assert.ok(cabeNoTerreno(criarItem(tipo, pequeno, []), pequeno), tipo);
  }
});

test("áreas de manobra antigas continuam sendo lidas e exportadas sem perder a posição", () => {
  const antigaJanela = globalThis.window;
  const dados = {
    ultimoTerreno: { largura: 25, comprimento: 40, area: 1000 },
    terrenos: {
      "25x40": {
        ativo: "inicial", estrada: true, declive: "",
        cenarios: [{
          id: "inicial", nome: "Cenário inicial",
          itens: [
            { id: "legado", tipo: "manobra", nome: "Meu antigo espaço de manobra", x: 1, y: 2, largura: 8, comprimento: 8, existente: true },
            { id: "piscina", tipo: "piscina", nome: "Piscina", x: 12, y: 2, largura: 4, comprimento: 8, existente: false },
          ],
        }],
      },
    },
  };
  globalThis.window = { localStorage: { getItem: chave => chave === chaveProjetos ? JSON.stringify(dados) : null } };
  try {
    const lidos = lerProjetos();
    const itens = lidos.terrenos["25x40"].cenarios[0].itens;
    assert.deepEqual(itens.map(item => item.id), ["legado", "piscina"]);
    assert.equal(itens[0].x, 1);
    assert.equal(itens[0].tipo, "manobra");
    assert.equal(itens[1].tipo, "piscina");
    assert.doesNotThrow(() => validarBackup({
      aplicacao: "seu-quintal", versao: 1,
      criadoEm: "2026-11-22T00:00:00.000Z",
      dados: { projetos: dados, historico: [], organizador: hortaInicial },
    }));
  } finally {
    if (antigaJanela === undefined) delete globalThis.window;
    else globalThis.window = antigaJanela;
  }
});
