import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { generateArticles, readArticle, renderMarkdown, inlineMarkdown } from "../scripts/gerar-artigos.mjs";

const root = resolve(import.meta.dirname, "..");
const read = path => readFileSync(join(root, path), "utf8");

test("metadados obrigatórios e status editorial são validados", () => {
  assert.throws(() => readArticle("---\ntitulo: Teste\n---\nConteúdo", "teste.md"), /obrigatório|ausente/);
  assert.throws(() => readArticle("---\ntitulo: X\n---\n", "teste.md"), /obrigatório/);
});

test("o Markdown gera HTML estático acessível e evita scripts injetados", () => {
  const { html, headings } = renderMarkdown("## Primeira etapa\n\nTexto **forte**.\n\n- Item\n\n## Segunda etapa\n\n<script>alert(1)</script>", "../../");
  assert.match(html, /<h2 id="primeira-etapa">/);
  assert.match(html, /<strong>forte<\/strong>/);
  assert.match(html, /<ul>\s*<li>Item<\/li>/s);
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>alert/);
  assert.equal(headings.length, 2);
  assert.match(inlineMarkdown("[Abrir horta](/horta/)", "../../"), /href="\.\.\/\.\.\/horta\/"/);
  assert.throws(() => inlineMarkdown("[Ruim](javascript:alert)", "../../"), /não suportado/);
});

test("publicação gera catálogo, artigos e sitemap sem depender de React", () => {
  const count = generateArticles();
  assert.equal(count, 2);
  const catalogo = JSON.parse(read("src/data/artigos-publicados.json"));
  assert.equal(catalogo.length, 2);
  assert.ok(catalogo.every(a => a.slug && a.titulo && a.imagem));
  const index = read("artigos/index.html");
  assert.match(index, /Artigos e guias para seu quintal/);
  assert.match(index, /Como organizar uma horta pequena/);
  assert.match(index, /Quantas galinhas preciso/);
  const horta = read("artigos/como-planejar-uma-horta-para-colher-com-frequencia/index.html");
  assert.equal((horta.match(/<h1\b/g) || []).length, 1);
  assert.match(horta, /<main id="conteudo"/);
  assert.match(horta, /<h2 id="1-comece-medindo-o-espaco">/);
  assert.match(horta, /ferramenta gratuita/);
  assert.match(horta, /href="\.\.\/\.\.\/horta\/organizador\/"/);
  assert.match(horta, /rel="canonical" href="https:\/\/igor-vasconcelos.github.io\/seu-quintal\/artigos\/como-planejar-uma-horta-para-colher-com-frequencia\/"/);
  assert.match(horta, /type="application\/ld\+json"/);
  const galinhas = read("artigos/quantas-galinhas-para-ter-ovos-em-casa/index.html");
  assert.match(galinhas, /href="\.\.\/\.\.\/sisteminha.html#calculadora-galinheiro"/);
  const sitemap = read("public/sitemap.xml");
  assert.match(sitemap, /\/seu-quintal\/artigos\/quantas-galinhas-para-ter-ovos-em-casa\/<\/loc>/);
  assert.match(sitemap, /\/seu-quintal\/sisteminha.html<\/loc>/);
});
