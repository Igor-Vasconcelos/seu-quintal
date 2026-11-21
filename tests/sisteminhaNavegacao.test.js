import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { fichasSisteminha, etapasImplantacao, materiaisOficiais } from "../src/features/sisteminha/dadosSisteminha.js";

const origem = resolve(import.meta.dirname, "..");
const arquivo = caminho => readFileSync(resolve(origem, caminho), "utf8");
const main = arquivo("src/main-sisteminha.jsx");
const fluxo = arquivo("src/features/sisteminha/FluxoSisteminha.jsx");
const css = arquivo("src/styles/sisteminha.css");

test("navegação local possui oito tópicos com conteúdo dedicado", () => {
  for (const id of ["ciclo", "tanque", "galinheiro", "horta", "compostagem",
    "minhocario", "integracao", "materiais"]) {
    assert.match(main, new RegExp('\\["' + id + '",'));
  }
  assert.match(main, /<IntegracaoSisteminha\/>/);
  assert.match(main, /<MateriaisSisteminha\/>/);
  assert.match(main, /aria-current=\{abaAtiva === id/);
  assert.match(main, /window\.addEventListener\("popstate"/);
  assert.match(main, /window\.addEventListener\("hashchange"/);
});

test("o fluxo explicita caminhos distintos e links acessíveis por módulo", () => {
  for (const id of ["agua", "materia", "alimentos"]) {
    assert.match(fluxo, new RegExp('id: "' + id + '"'));
  }
  assert.match(fluxo, /href=\{"#" \+ passo\.id\}/);
  assert.match(fluxo, /aria-label=\{rota\.titulo\}/);
  assert.match(fluxo, /não um esquema de instalação/);
  assert.match(fluxo, /A água de criação não deve ser confundida com água potável/);
  assert.match(css, /\.sisteminha-rota/);
  assert.match(css, /max-width: 720px/);
});

test("fichas de cada módulo possuem informações e ligações verificáveis", () => {
  for (const id of ["tanque", "galinheiro", "horta", "compostagem", "minhocario"]) {
    const ficha = fichasSisteminha[id];
    assert.ok(ficha.objetivo);
    assert.ok(ficha.materiais.length >= 3);
    assert.ok(ficha.manejo);
    assert.ok(ficha.ligacoes);
    assert.ok(ficha.cuidados);
    assert.ok(ficha.links.length >= 1);
    for (const link of ficha.links) {
      assert.ok(link.href.startsWith("https://") || link.href.startsWith("#") || link.href.startsWith("./"));
    }
  }
  assert.equal(etapasImplantacao.length, 4);
  assert.ok(materiaisOficiais.length >= 3);
  assert.ok(materiaisOficiais.every(item => new URL(item.url).hostname.endsWith("embrapa.br")));
});

test("mantém calculadora de galinhas e imagens já presentes", () => {
  assert.match(main, /<Galinheiro key=\{id\} modulo=\{modulo\}/);
  assert.match(main, /src=\{"\.\/imagens\/" \+ modulo\.imagem\}/);
  assert.match(main, /imagens\/sisteminha\/panorama.webp/);
  assert.ok(existsSync(resolve(origem, "public/imagens/sisteminha/tanque.webp")));
  assert.ok(existsSync(resolve(origem, "public/imagens/sisteminha/minhocario.webp")));
  assert.ok(existsSync(resolve(origem, "public/imagens/sisteminha/panorama.webp")));
  assert.match(main, /imagens dos módulos do Sisteminha são ilustrações geradas por IA/);
});
