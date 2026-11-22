import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { estimarPeixes } from "../src/features/peixes/estimativa.js";
import { planejarPomar, especiesPomar, fontePomar } from "../src/features/pomar/geometriaPomar.js";

const ler = p => readFileSync(resolve(import.meta.dirname, "..", p), "utf8");
const peixesBase = {
  especie: "tilapia", formato: "circular", diametro: "2", profundidade: "1",
  quantidade: 10, pesoInicialGramas: 100, pesoFinalGramas: 700,
  sobrevivencia: 90, conversaoAlimentar: "1,5", diasCiclo: "",
  densidadeProjeto: "",
};

test("peixes: volume circular e litros respeitam profundidade útil", () => {
  const r = estimarPeixes(peixesBase);
  assert.ok(r);
  assert.ok(Math.abs(r.volumeM3 - Math.PI) < 1e-9);
  assert.ok(Math.abs(r.litros - Math.PI * 1000) < 1e-7);
  assert.equal(r.sobreviventes, 9);
  assert.ok(Math.abs(r.biomassaFinalKg - 6.3) < 1e-9);
  assert.ok(Math.abs(r.racaoKg - 8.1) < 1e-9);
  assert.equal(r.quantidadeProjeto, null);
});

test("peixes: volume retangular e biomassa são separados de recomendação", () => {
  const r = estimarPeixes({
    ...peixesBase, especie: "tambaqui", formato: "retangular",
    largura: "3,5", comprimento: "4", profundidade: "1,2",
  });
  assert.equal(r.areaM2, 14);
  assert.equal(r.volumeM3, 16.8);
  assert.equal(r.quantidadeProjeto, null);
  assert.ok(r.densidadeSimuladaKgM3 > 0);
});

test("peixes: contagem com densidade exige declaração técnica e checagens completas", () => {
  const opcoes = { ...peixesBase, densidadeProjeto: "4", densidadeValidada: true,
    aeracao: true, filtragem: true, monitoramento: true };
  assert.equal(estimarPeixes(opcoes).quantidadeProjeto, Math.floor(Math.PI * 4 / .7));
  assert.equal(estimarPeixes({ ...opcoes, aeracao: false }).quantidadeProjeto, null);
  assert.equal(estimarPeixes({ ...opcoes, densidadeValidada: false }).quantidadeProjeto, null);
  assert.equal(estimarPeixes({ ...opcoes, densidadeProjeto: "" }).quantidadeProjeto, null);
});

test("peixes: rejeita números inválidos, taxa impossível e peso final menor", () => {
  for (const dados of [
    { profundidade: "0" }, { quantidade: 0 }, { sobrevivencia: 101 },
    { pesoInicialGramas: 900 }, { conversaoAlimentar: "-1" },
    { densidadeProjeto: "abc" }, { especie: "inexistente" },
    { diametro: "" }, { diasCiclo: "abc" },
  ]) assert.equal(estimarPeixes({ ...peixesBase, ...dados }), null);
});

test("pomar: calcula posições e conserva recuo em todos os lados", () => {
  const r = planejarPomar({ especie: "goiaba", largura: 10, comprimento: 20,
    recuo: 1, entreLinhas: 4, entrePlantas: 3, copaAdulta: "" });
  assert.equal(r.quantidade, 12);
  assert.equal(r.colunas, 2);
  assert.equal(r.linhas, 6);
  assert.equal(r.pontos.length, 12);
  assert.equal(r.pontos[0].x, 3);
  assert.equal(r.pontos[0].y, 2.5);
  assert.equal(r.pontos.at(-1).x, 7);
  assert.equal(r.pontos.at(-1).y, 17.5);
  assert.equal(r.areaM2, 200);
  assert.equal(r.areaUtilM2, 144);
});

test("pomar: cabe zero árvore quando célula inteira não cabe", () => {
  const r = planejarPomar({ especie: "manga", largura: 5, comprimento: 5,
    recuo: 1, entreLinhas: 8, entrePlantas: 6 });
  assert.equal(r.quantidade, 0);
  assert.deepEqual(r.pontos, []);
});

test("pomar: diâmetro informado destaca copas potencialmente sobrepostas", () => {
  const r = planejarPomar({ especie: "banana", largura: "15", comprimento: "25",
    recuo: "1", entreLinhas: "3", entrePlantas: "2,5", copaAdulta: "4" });
  assert.equal(r.sobreposicaoCopas, true);
  assert.equal(r.copaAdulta, 4);
  assert.equal(planejarPomar({ ...r, especie:"banana", copaAdulta:"" }).sobreposicaoCopas, false);
});

test("pomar: limita SVG, preservando a contagem geométrica", () => {
  const r = planejarPomar({ especie: "banana", largura: 40, comprimento: 50,
    recuo: 0, entreLinhas: 2, entrePlantas: 2 });
  assert.equal(r.quantidade, 500);
  assert.equal(r.exibicaoCompleta, false);
  assert.deepEqual(r.pontos, []);
});

test("pomar: rejeita dimensões impossíveis e usa fontes rastreáveis", () => {
  for (const dados of [
    { largura: 0 }, { recuo: -1 }, { entreLinhas: 0 },
    { entrePlantas: "abc" }, { copaAdulta: "-5" }, { especie: "desconhecida" },
  ]) assert.equal(planejarPomar({ especie: "banana", largura: 10, comprimento: 20,
    recuo: 1, entreLinhas: 3, entrePlantas: 2, ...dados }), null);
  assert.match(fontePomar, /embrapa\.br/);
  assert.ok(Object.keys(especiesPomar).length >= 6);
});

test("as duas ferramentas têm rotas, navegação, HTML estático e mount React", () => {
  const vite = ler("vite.config.js");
  const main = ler("src/main-conteudo.jsx");
  const sitemap = ler("scripts/gerar-artigos.mjs");
  const cab = ler("src/components/Cabecalho.jsx");
  const rod = ler("src/components/Rodape.jsx");
  const sisteminha = ler("src/features/sisteminha/dadosSisteminha.js");
  const smokes = ler("scripts/smoke-visual.mjs");
  for (const rota of ["ferramentas/calculadora-peixes/", "ferramentas/planejador-de-pomar/"]) {
    for (const fonte of [vite, sitemap, cab, rod, sisteminha, smokes])
      assert.ok(fonte.includes(rota), "rota ausente em componente ou arquivo");
  }
  assert.match(main, /<CalculadoraPeixes\/>/);
  assert.match(main, /<PlanejadorPomar\/>/);
  assert.match(main, /calculadoras-peixes-pomar\.css/);
  const htmlPeixes = ler("ferramentas/calculadora-peixes/index.html");
  const htmlPomar = ler("ferramentas/planejador-de-pomar/index.html");
  for (const html of [htmlPeixes, htmlPomar]) {
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.match(html, /rel="canonical"/);
    assert.match(html, /<noscript>/);
    assert.match(html, /<div id="rodape"><\/div>/);
  }
});
