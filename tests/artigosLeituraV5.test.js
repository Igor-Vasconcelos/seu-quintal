import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateArticles, readArticle, renderArticle } from "../scripts/gerar-artigos.mjs";

const base = resolve(import.meta.dirname, "..");
const ler = arquivo => readFileSync(resolve(base, arquivo), "utf8");

test("card de pomar usa foto real, com descrição e licença creditada", () => {
  const jsx = ler("src/components/DestaquesEditorial.jsx");
  assert.match(jsx, /Orchard_Agriculture/);
  assert.doesNotMatch(jsx, /imagem: "\.\/imagens\/colheita\.webp"/);
  assert.match(jsx, /imagemAlt: "Pomar real/);
  assert.match(jsx, /Hazel Gordon \/ USDA Forest Service/);
  assert.match(jsx, /creativecommons\.org\/licenses\/by\/2\.0/);
  assert.match(jsx, /home-destaque-credito/);
  assert.match(jsx, /referrerPolicy/);
});

test("template gera índice numerado uma única vez, com navegação e leitura estimada", () => {
  const arquivo = "como-planejar-uma-horta-para-colher-com-frequencia";
  const artigo = readArticle(ler("content/artigos/" + arquivo + ".md"), arquivo + ".md");
  const html = renderArticle({ ...artigo, slug: arquivo });
  assert.match(html, /<h1>Como organizar uma horta pequena para colher com frequência\?<\/h1>/);
  assert.match(html, /<nav class="sq-toc" aria-label="Índice do artigo">/);
  assert.match(html, /<details class="sq-toc-details">/);
  assert.match(html, /href="#1-comece-medindo-o-espaco">Comece medindo o espaço<\/a>/);
  assert.doesNotMatch(html, /href="#1-comece-medindo-o-espaco">1\./);
  assert.match(html, /9 tópicos/);
  assert.match(html, /Leitura estimada de \d+ min/);
  assert.match(html, /class="sq-meta-tool" href="\.\.\/\.\.\/horta\/organizador\/"/);
  assert.match(html, /<div class="sq-prose" id="inicio-leitura">/);
  assert.match(html, /href="#1-comece-medindo-o-espaco"/);
  assert.match(html, /rel="canonical" href="https:\/\/igor-vasconcelos.github.io\/seu-quintal\/artigos\/como-planejar-uma-horta-para-colher-com-frequencia\/"/);
  assert.equal((html.match(/<h1>/g) || []).length, 1);
});

test("geração continua estática e preserva rotas, sitemap e artigos anteriores", () => {
  const total = generateArticles();
  assert.equal(total, 2);
  for (const slug of [
    "como-planejar-uma-horta-para-colher-com-frequencia",
    "quantas-galinhas-para-ter-ovos-em-casa",
  ]) {
    const caminho = "artigos/" + slug + "/index.html";
    assert.ok(existsSync(resolve(base, caminho)), caminho);
    const page = ler(caminho);
    assert.match(page, /class="sq-article-layout"/);
    assert.match(page, /class="sq-prose"/);
  }
  assert.match(ler("public/sitemap.xml"), /como-planejar-uma-horta-para-colher-com-frequencia/);
});

test("CSS isola o novo layout; o índice possui foco, ativo e responsividade", () => {
  const css = ler("src/styles/artigos-leitura-v5.css");
  const indice = ler("src/features/artigos/indiceAtivo.js");
  const js = ler("src/main-artigos.js");
  assert.match(css, /grid-template-columns: minmax\(14rem, 16rem\) minmax\(0, 1fr\)/);
  assert.match(css, /max-width: min\(100%, 49rem\)/);
  assert.match(css, /max-width: 1080px/);
  assert.match(css, /max-width: 767px/);
  assert.match(css, /aria-current="location"/);
  assert.match(indice, /IntersectionObserver/);
  assert.match(indice, /matchMedia/);
  assert.match(indice, /aria-current/);
  assert.match(js, /artigos-leitura-v5\.css/);
  assert.match(js, /iniciarIndiceAtivo/);
});
