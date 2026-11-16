import assert from "node:assert/strict";
import test from "node:test";
import { estimarGalinheiro } from "../src/features/galinheiro/estimativa.js";

test("dimensiona poedeiras e estima o consumo diário e mensal", () => {
  const { postura, corte, totalSimultaneo } = estimarGalinheiro({ tipo: "postura", ovosSemana: 24 });

  assert.equal(totalSimultaneo, 5);
  assert.equal(corte, null);
  assert.deepEqual(postura, {
    aves: 5,
    ovosSemana: 25,
    racaoDia: [0.5, 0.575],
    racaoMes: [15, 17.25],
    aguaDia: 1.25,
  });
});

test("usa a média fracionária de postura sem arredondar para uma ave a mais na divisão exata", () => {
  const { postura } = estimarGalinheiro({ tipo: "postura", ovosSemana: 29, ovosPorPoedeira: 2.9 });

  assert.equal(postura.aves, 10);
  assert.equal(postura.ovosSemana, 29);
});

test("dimensiona um lote de corte com intervalo e margem de viabilidade", () => {
  const { postura, corte, totalSimultaneo } = estimarGalinheiro({ tipo: "corte", frangosMes: 4 });

  assert.equal(postura, null);
  assert.equal(totalSimultaneo, 15);
  assert.deepEqual(corte, {
    aves: 15,
    metaPorLote: 14,
    diasCriacao: 84,
    diasTotais: 99,
    racaoLote: 120.885,
    aguaDia: [2.85, 4.05],
    viabilidade: 94,
  });
});

test("soma os grupos da criação mista e usa os dados da duração escolhida", () => {
  const dados = { tipo: "mista", ovosSemana: 24, frangosMes: 4 };
  const maisCurto = estimarGalinheiro({ ...dados, diasCriacao: 77 });
  const maisLongo = estimarGalinheiro({ ...dados, diasCriacao: 91 });

  assert.equal(maisCurto.totalSimultaneo, 19);
  assert.equal(maisCurto.corte.racaoLote, 97.342);
  assert.equal(maisLongo.totalSimultaneo, 22);
  assert.equal(maisLongo.corte.racaoLote, 156.519);
});

test("rejeita metas ausentes ou inválidas e dias sem referência", () => {
  assert.equal(estimarGalinheiro({ tipo: "mista", ovosSemana: 24 }), null);
  assert.equal(estimarGalinheiro({ tipo: "postura", ovosSemana: 0 }), null);
  assert.equal(estimarGalinheiro({ tipo: "postura", ovosSemana: 2.5 }), null);
  assert.equal(estimarGalinheiro({ tipo: "postura", ovosSemana: 24, ovosPorPoedeira: 7.01 }), null);
  assert.equal(estimarGalinheiro({ tipo: "postura", ovosSemana: 24, ovosPorPoedeira: 2.907 }), null);
  assert.equal(estimarGalinheiro({ tipo: "corte", frangosMes: 4, diasCriacao: 85 }), null);
  assert.equal(estimarGalinheiro({ tipo: "corte", frangosMes: 4, diasCriacao: "84" }), null);
  assert.equal(estimarGalinheiro({ tipo: "corte", frangosMes: Number.MAX_SAFE_INTEGER }), null);
  assert.equal(estimarGalinheiro({ tipo: "outro" }), null);
});
