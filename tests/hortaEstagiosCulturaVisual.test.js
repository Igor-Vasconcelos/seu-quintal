import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ler = caminho => readFileSync(resolve(import.meta.dirname, "..", caminho), "utf8");

test("cenas visuais usam SVG leve e o mesmo pictograma de cada cultura", () => {
  const visual = ler("src/features/organizador/EstagioCulturaVisual.jsx");
  assert.match(visual, /import IconeCultura from "\.\/IconeCultura\.jsx"/);
  assert.match(visual, /function Semeadura/);
  assert.match(visual, /function Desenvolvimento/);
  assert.match(visual, /function Colheita/);
  assert.match(visual, /origem === "muda"/);
  assert.match(visual, /comMudas/);
  assert.match(visual, /etapa !== 3/);
  assert.match(visual, /<IconeCultura nome=\{cultura\}/);
  assert.match(visual, /aria-hidden="true"/);
  assert.doesNotMatch(visual, /<img|\.webp|https?:\/\//);
});

test("cronograma mostra uma ilustração para cada etapa sem alterar datas ou cálculos", () => {
  const html = ler("src/features/organizador/VisualizacaoHorta.jsx");
  assert.match(html, /import EstagioCulturaVisual from "\.\/EstagioCulturaVisual\.jsx"/);
  for (const numero of [1, 2, 3]) {
    assert.match(html, new RegExp("etapa=\\{" + numero + "\\}"));
  }
  assert.match(html, /item\.seguintes\.map\(lote/);
  assert.match(html, /rotuloData\(lote\.inicio\)/);
  assert.match(html, /janelaDeDatas\(lote\.colheita\.de, lote\.colheita\.ate\)/);
  assert.match(html, /Sementes e mudas são esquemáticas/);
  assert.match(html, /sq-horta-etapa-titulo/);
  assert.match(html, /sq-horta-etapa-data/);
});

test("CSS é responsivo, usa tokens e preserva tamanho das cenas", () => {
  const css = ler("src/styles/visual-horta.css");
  assert.match(css, /sq-horta-etapa-cena-svg/);
  assert.match(css, /sq-horta-etapa-colheita-cultura/);
  assert.match(css, /sq-horta-etapa-cultura-selo/);
  assert.match(css, /@media \(max-width:700px\)/);
  assert.match(css, /@media \(max-width:350px\)/);
  assert.match(css, /grid-template-columns:1\.5rem minmax\(5rem,6rem\) minmax\(0,1fr\)/);
  assert.doesNotMatch(css, /#[0-9a-fA-F]{3,8}\b/);
});

test("ilustrações aparecem nas duas entradas, sem criar outra calculadora", () => {
  const planejamento = ler("src/features/organizador/PlanejamentoFamiliar.jsx");
  const demo = ler("src/features/artigos/SimuladorHortaArtigo.jsx");
  assert.match(planejamento, /<VisualizacaoHorta resultado=\{sugestao\}/);
  assert.match(demo, /<VisualizacaoHorta resultado=\{resultado\} compacto\/>/);
  assert.match(demo, /calcularPlanoFamiliar/);
});
