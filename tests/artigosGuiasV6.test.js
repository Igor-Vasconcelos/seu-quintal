import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, statSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { readArticle, renderArticle, renderMarkdown, inlineMarkdown } from "../scripts/gerar-artigos.mjs";

const root = resolve(import.meta.dirname, "..");
const ler = p => readFileSync(resolve(root,p),"utf8");
const fichas = [
  "como-planejar-uma-horta-para-colher-com-frequencia",
  "quantas-galinhas-para-ter-ovos-em-casa",
];
const imagens = [
  "horta-canteiros-etapas", "horta-canteiros-lotes", "horta-colheita-escalonada",
  "galinhas-galinheiro-bem-estar", "galinhas-agua-racao", "galinhas-ninhos-ovos",
];

test("ilustrações locais WebP foram incluídas como imagens reais, com tamanhos razoáveis", () => {
  for(const nome of imagens) {
    const arquivo = resolve(root, "public/imagens/artigos/"+nome+".webp");
    assert.ok(existsSync(arquivo), "Imagem ausente "+nome);
    assert.ok(statSync(arquivo).size > 2000, "Imagem vazia "+nome);
    assert.ok(statSync(arquivo).size < 250_000, "Imagem excessiva "+nome);
    assert.equal(readFileSync(arquivo).toString("ascii",0,4), "RIFF");
    assert.equal(readFileSync(arquivo).toString("ascii",8,12), "WEBP");
  }
});

test("artigos possuem resposta direta, passos, fotos, FAQ, fontes e ferramentas específicas", () => {
  const contagens = [9,10];
  fichas.forEach((slug,i) => {
    const raw=ler("content/artigos/"+slug+".md");
    assert.ok(raw.trim().split(/\s+/).length>1100, "Conteúdo ainda curto: "+slug);
    const article=readArticle(raw,slug+".md");
    assert.ok(article.resposta?.length>90);
    const html=renderArticle({...article,slug});
    assert.match(html,/<div class="sq-article-opening">/);
    assert.match(html,/class="sq-answer"/);
    assert.match(html,/class="sq-article-layout"/);
    assert.match(html,/class="sq-step-figure"/);
    assert.equal((html.match(/class="sq-step-figure"/g)||[]).length,2);
    assert.match(html,/loading="lazy" decoding="async"/);
    assert.match(html,/Ilustração digital gerada por IA/);
    assert.ok(html.includes("Perguntas frequentes"));
    assert.ok(html.includes("Fontes e leitura complementar"));
    assert.ok(html.includes("Coloque em prática com as ferramentas do Seu Quintal"));
    assert.ok(html.includes(contagens[i]+" tópicos"));
    assert.ok(html.includes('type="application/ld+json"'));
    assert.equal((html.match(/<h1>/g)||[]).length,1);
  });
});

test("figuras e tabelas possuem alt, legendas e regiões acessíveis", () => {
  const markdown = '## Exemplo\n\n![Plantas jovens em um canteiro bem cuidado.](/imagens/artigos/horta-canteiros-lotes.webp)\n\n| Semana | Meta |\n| --- | --- |\n| 1 | **Lote A** |';
  const {html}=renderMarkdown(markdown,"../../");
  assert.match(html,/alt="Plantas jovens/);
  assert.match(html,/figcaption/);
  assert.match(html,/href="|src="\.\.\/\.\.\/imagens\/artigos\//);
  assert.match(html,/role="region" aria-label="Tabela de exemplo" tabindex="0"/);
  assert.match(html,/<th scope="col">Semana<\/th>/);
  assert.match(html,/<td><strong>Lote A<\/strong><\/td>/);
  assert.throws(() => renderMarkdown('![x](/imagens/artigos/arquivo.webp)',"../../"),/Imagem deve usar/);
  assert.throws(() => renderMarkdown('| A | B |\n| --- | --- |\n| única |',"../../"),/quantidade desigual/);
});

test("URLs com âncoras são permitidas com validação estrita", () => {
  assert.match(inlineMarkdown("[Calcular](/sisteminha.html#calculadora-galinheiro)","../../"),
    /href="\.\.\/\.\.\/sisteminha.html#calculadora-galinheiro"/);
  assert.throws(() => inlineMarkdown("[ruim](/sisteminha.html#<img)","../../"),/Âncora inválida/);
});

test("CSS é isolado, mantém hero pequeno e reduz imagem em celular", () => {
  const css=ler("src/styles/artigos-guias-v6.css");
  const js=ler("src/main-artigos.js");
  assert.match(css,/\.sq-artigos \.sq-article-opening/);
  assert.match(css,/max-width: 700px/);
  assert.match(css,/9\.5rem/);
  assert.match(css,/\.sq-step-figure/);
  assert.match(css,/\.sq-table-wrap/);
  assert.match(js,/artigos-guias-v6\.css/);
});
