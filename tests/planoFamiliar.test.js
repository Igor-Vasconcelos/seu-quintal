import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { calcularPlanoFamiliar, intervaloPadrao, metaExemplo, sugestoesDeConsumo } from "../src/features/organizador/planoFamiliar.js";
import { dimensionarLote, lerPlano, formularioInicial } from "../src/features/organizador/escala.js";
import { culturasOrganizador } from "../src/features/organizador/culturas.js";

const base = {
  pessoas: 4, quantidadeCanteiros: 4, largura: 1, comprimento: 3,
  inicio: "2026-11-21", regiao: "Sudeste", planosExistentes: [],
  preferencias: [
    { cultura: "Alface de verão", casa: 2, venda: 0 },
    { cultura: "Cenoura de verão", casa: 8, venda: 0 },
  ],
};

test("exemplos familiares são editáveis e não se apresentam como médias do IBGE", () => {
  assert.equal(metaExemplo("Alface de verão", 4), 2);
  assert.equal(metaExemplo("Cenoura de verão", 4), 8);
  assert.equal(metaExemplo("Tomate de mesa", 4), 1);
  assert.equal(metaExemplo("Abacaxi", 4), null);
  assert.ok(sugestoesDeConsumo.every(i => Object.hasOwn(culturasOrganizador, i.cultura)));
});

test("produz lotes baseados no motor existente e distribui área por canteiro", () => {
  const r = calcularPlanoFamiliar(base);
  assert.equal(r.erro, null);
  assert.equal(r.cabe, true);
  assert.equal(r.areaTotal, 12);
  assert.equal(r.sugestoes.length, 2);
  assert.equal(r.sugestoes[0].plano.intervalo, 1);
  assert.equal(r.sugestoes[0].plantas, 2);
  assert.equal(r.sugestoes[0].seguintes.length, 3);
  assert.ok(r.sugestoes[0].primeiraColheita.de > r.sugestoes[0].plano.inicio);
  assert.ok(r.sugestoes.every(x => x.reservas.length > 0));
  for (const item of r.sugestoes) {
    assert.equal(item.area, dimensionarLote(item.plano).areaSimultanea);
    const normalized = lerPlano(formularioInicial(item.plano));
    assert.ok(normalized.plano, normalized.erro || "Plano inválido");
  }
});

test("avisa falta de canteiros, contabiliza cultivos existentes e impede duplicação", () => {
  const pequeno = calcularPlanoFamiliar({ ...base, quantidadeCanteiros: 1, largura: .3, comprimento: .3 });
  assert.equal(pequeno.cabe, false);
  assert.ok(pequeno.faltaArea > 0);
  assert.ok(pequeno.canteirosNecessarios > 1);
  const comAntigo = calcularPlanoFamiliar({
    ...base, planosExistentes: [{
      cultura: "Rabanete", casa: 12, venda: 0, intervalo: 1, origem: "semente",
      inicio: "2026-11-21", canteiro: "Canteiro 1", rendimento: null, duracao: null, teste: 2,
    }],
  });
  assert.ok(comAntigo.areaReservada > 0);
  const duplicada = calcularPlanoFamiliar({ ...base, planosExistentes: [{
    cultura: "Alface de verão", casa: 1, venda: 0, intervalo: 1,
    origem: "semente", inicio: "2026-11-21", canteiro: "", rendimento: null, duracao: null, teste: 2,
  }]});
  assert.match(duplicada.erro, /já possui/);
});

test("cultivos com colheitas sucessivas começam em lote experimental", () => {
  const r=calcularPlanoFamiliar({ ...base,
    preferencias: [{ cultura: "Tomate de mesa", casa: 1, venda: .2 }] });
  assert.equal(r.erro, null);
  assert.equal(r.sugestoes[0].experimental, true);
  assert.equal(r.sugestoes[0].plantas, 2);
  assert.equal(r.sugestoes[0].plano.intervalo, 4);
  assert.ok(r.avisos.some(item => item.includes("teste")));
});

test("rejeita entradas inválidas sem alterar planos", () => {
  assert.match(calcularPlanoFamiliar({ ...base, pessoas: 0 }).erro, /pessoas/);
  assert.match(calcularPlanoFamiliar({ ...base, inicio: "2026-02-30" }).erro, /data válida/);
  assert.match(calcularPlanoFamiliar({ ...base, preferencias: [] }).erro, /Selecione/);
  assert.match(calcularPlanoFamiliar({ ...base, preferencias: [{
    cultura: "Alface de verão", casa: -1, venda: 0,
  }] }).erro, /positivas/);
  assert.match(calcularPlanoFamiliar({ ...base, preferencias: [
    base.preferencias[0], base.preferencias[0],
  ] }).erro, /repetidas/);
  assert.match(calcularPlanoFamiliar({ ...base, preferencias: [{
    cultura: "Melancia", casa: 3, venda: 0,
  }] }).erro, /repetidas|não cadastradas/);
});

test("linka canteiros e agenda sem tocar na estrutura antiga de persistência", () => {
  const root=resolve(import.meta.dirname, "..");
  const formulario=readFileSync(resolve(root, "src/features/organizador/OrganizadorHorta.jsx"), "utf8");
  const visual=readFileSync(resolve(root, "src/features/organizador/PlanejadorVisualCanteiro.jsx"), "utf8");
  const memoria=readFileSync(resolve(root, "src/features/organizador/armazenamento.js"), "utf8");
  assert.match(formulario, /<PlanejamentoFamiliar/);
  assert.match(formulario, /adicionarSugestoes/);
  assert.match(visual, /#planejamento-familiar/);
  assert.match(memoria, /seu-quintal:organizador-horta:v1/);
});

test("o assistente aceita frequência personalizada e recalcula quantidade, datas e área", () => {
  const semanal = calcularPlanoFamiliar(base);
  const quinzenal = calcularPlanoFamiliar({
    ...base, preferencias: [{ cultura: "Alface de verão", casa: 2, venda: 0, intervalo: 2 }],
  });
  assert.equal(intervaloPadrao("Alface de verão"), 1);
  assert.equal(intervaloPadrao("Tomate de mesa"), 4);
  assert.equal(quinzenal.erro, null);
  const item = quinzenal.sugestoes[0];
  assert.equal(item.plano.intervalo, 2);
  assert.equal(item.plantas, 4);
  assert.equal(item.seguintes[0].inicio, "2026-11-21");
  assert.equal(item.seguintes[1].inicio, "2026-12-05");
  assert.equal(item.seguintes[2].inicio, "2026-12-19");
  assert.ok(item.primeiraColheita.de > item.seguintes[0].inicio);
  assert.equal(item.area, dimensionarLote(item.plano).areaSimultanea);
  assert.equal(semanal.sugestoes[0].plantas, 2);
  assert.equal(lerPlano(formularioInicial(item.plano)).plano.intervalo, 2);
});

test("datas não perdem dia/mês na virada do ano e intervalos por cultura são independentes", () => {
  const r = calcularPlanoFamiliar({
    ...base, inicio: "2026-12-29",
    preferencias: [
      { cultura: "Alface de verão", casa: 3, venda: 0, intervalo: 2 },
      { cultura: "Cenoura de verão", casa: 6, venda: 0, intervalo: 3 },
    ],
  });
  assert.equal(r.erro, null);
  const [alface, cenoura] = r.sugestoes;
  assert.equal(alface.seguintes[1].inicio, "2027-01-12");
  assert.equal(cenoura.seguintes[1].inicio, "2027-01-19");
  assert.equal(alface.plantas, 6);
  assert.equal(cenoura.plantas, 18);
});

test("intervalos fora de 1 a 52 semanas ou decimais mostram erro contextualizado", () => {
  for (const intervalo of [0, -1, 1.5, 53, Number.NaN, Infinity]) {
    const r = calcularPlanoFamiliar({
      ...base, preferencias: [{ cultura: "Rabanete", casa: 2, venda: 0, intervalo }],
    });
    assert.match(r.erro, /intervalo de 1 a 52 semanas para Rabanete/);
  }
  const limite = calcularPlanoFamiliar({
    ...base, preferencias: [{ cultura: "Rabanete", casa: 2, venda: 0, intervalo: 52 }],
  });
  assert.equal(limite.erro, null);
});

test("controle acessível e três respostas usam as mesmas projeções persistidas", () => {
  const root = resolve(import.meta.dirname, "..");
  const ui = readFileSync(resolve(root, "src/features/organizador/PlanejamentoFamiliar.jsx"), "utf8");
  assert.match(ui, /Novo lote a cada \(semanas\)/);
  assert.match(ui, /type="number" min="1" max="52" step="1"/);
  assert.match(ui, /1\. Quanto plantar/);
  assert.match(ui, /2\. Quando plantar novamente/);
  assert.match(ui, /3\. Quando esperar a colheita/);
  assert.match(ui, /seguintes\.map\(lote/);
  assert.match(ui, /Adicionar sugestões à minha agenda/);
  assert.match(ui, /intervalos\[cultura\]/);
});
