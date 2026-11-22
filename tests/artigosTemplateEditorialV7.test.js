import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { readArticle, renderArticle, renderMarkdown, comporSecoesEditorais } from "../scripts/gerar-artigos.mjs";
import { iniciarCompartilhamentoArtigo } from "../src/features/artigos/compartilharArtigo.js";

const raiz = resolve(import.meta.dirname, "..");
const ler = caminho => readFileSync(resolve(raiz,caminho),"utf8");
const slugs = ["como-planejar-uma-horta-para-colher-com-frequencia", "quantas-galinhas-para-ter-ovos-em-casa"];

test("template reutilizável preserva HTML estático, canônicos, H1 e imagens", () => {
  for(const slug of slugs) {
    const article = readArticle(ler("content/artigos/"+slug+".md"), slug+".md");
    const html = renderArticle({...article, slug});
    assert.equal((html.match(/<h1>/g)||[]).length,1);
    assert.match(html, /<article class="sq-article">/);
    assert.match(html, /class="sq-article-opening"/);
    assert.match(html, /class="sq-article-meta-bar"/);
    assert.match(html, /<aside class="sq-article-aside" aria-label="Navegação e sugestões">/);
    assert.match(html, /<div class="sq-prose" id="inicio-leitura">/);
    assert.match(html, /<section class="sq-learning-panel"/);
    assert.match(html, /class="sq-side-related-card"/);
    assert.match(html, /class="sq-hero-image"/);
    assert.match(html, /fetchpriority="high"/);
    assert.equal((html.match(/class="sq-step-figure"/g)||[]).length,2);
    assert.match(html, /data-sq-share/);
    assert.match(html, /role="status" aria-live="polite"/);
    assert.match(html, /"@type":"BreadcrumbList"/);
    assert.match(html, /"@type":"BlogPosting"/);
    assert.match(html, new RegExp('rel="canonical" href="https://igor-vasconcelos.github.io/seu-quintal/artigos/'+slug+'/'));
    assert.ok(html.includes("Fontes e leitura complementar"));
    assert.ok(html.includes("Perguntas frequentes"));
    assert.ok(html.includes("Coloque em prática com as ferramentas do Seu Quintal"));
    assert.doesNotMatch(html, /"datePublished":"/); // Sem criar datas não documentadas.
  }
});

test("passo ilustrado agrupa figura e texto sem perder âncoras nem conteúdo", () => {
  const markdown=[
    "Introdução prática.",
    "",
    "## Etapa ilustrada",
    "",
    "Primeira observação.",
    "",
    "![Foto de canteiro doméstico com folhas verdes.](/imagens/artigos/horta-canteiros-lotes.webp)",
    "",
    "Próximo cuidado importante.",
    "",
    "## Segunda etapa",
    "",
    "Acompanhe o resultado."
  ].join("\n");
  const original=renderMarkdown(markdown,"../../").html;
  const html=comporSecoesEditorais(original);
  assert.match(html,/class="sq-guide-section sq-guide-section--illustrated"/);
  assert.match(html,/class="sq-guide-step-copy"/);
  assert.match(html,/aria-labelledby="etapa-ilustrada"/);
  assert.match(html,/<h2 id="segunda-etapa">/);
  assert.equal((html.match(/Primeira observação/g)||[]).length,1);
  assert.equal((html.match(/Próximo cuidado importante/g)||[]).length,1);
  assert.equal((html.match(/class="sq-step-figure"/g)||[]).length,1);
});

test("tabelas continuam com largura própria e não são colocadas na grade de passos", () => {
  const md='## Exemplo\n\nTexto antes\n\n![Uma área verde com plantações e canteiros.](/imagens/artigos/horta-canteiros-lotes.webp)\n\n| Semana | Lote |\n| --- | --- |\n| 1 | A |';
  const html=comporSecoesEditorais(renderMarkdown(md,"../../").html);
  assert.match(html,/class="sq-guide-section"/);
  assert.doesNotMatch(html,/sq-guide-section--illustrated/);
  assert.match(html,/class="sq-table-wrap"/);
  assert.match(html,/class="sq-step-figure"/);
});

test("metadados novos são opcionais e validados quando presentes", () => {
  const original=ler("content/artigos/como-planejar-uma-horta-para-colher-com-frequencia.md");
  assert.ok(readArticle(original,"horta.md").aprendizados);
  assert.throws(()=>readArticle(original.replace(/^aprendizados:.*$/m,'aprendizados: "um|dois"'),"horta.md"),/Aprendizados/);
  assert.throws(()=>readArticle(original.replace('relacionadoUrl: "/horta/"','relacionadoUrl: "javascript:alert(1)"'),"horta.md"),/Caminho interno inválido/);
});

test("compartilhar copia a URL canônica quando não há API nativa", async () => {
  let click=null, copied="";
  const output={textContent:""};
  const button={addEventListener:(_,fn)=>{click=fn;},removeEventListener:()=>{click=null;}};
  const doc={title:"Título",
    querySelector:(selector)=>{
      if(selector === ".sq-article [data-sq-share]")return button;
      if(selector === ".sq-article .sq-share-feedback")return output;
      if(selector === 'link[rel="canonical"]')return {href:"https://exemplo.com/guia/"};
      if(selector === ".sq-article h1")return {textContent:"Guia editorial"};
      return null;
    }};
  const win={location:{href:"https://outro.com/"},navigator:{clipboard:{writeText:async url=>{copied=url;}}}};
  const clean=iniciarCompartilhamentoArtigo(doc,win);
  assert.equal(typeof click,"function");
  await click();
  assert.equal(copied,"https://exemplo.com/guia/");
  assert.equal(output.textContent,"Link copiado para compartilhar.");
  clean();
  assert.equal(click,null);
});

test("estilos usam isolamento de escopo e responsividade mobile", () => {
  const css=ler("src/styles/artigos-template-v7.css");
  const main=ler("src/main-artigos.js");
  assert.match(css,/\.sq-artigos \.sq-article-opening/);
  assert.match(css,/sq-article-aside/);
  assert.match(css,/sq-guide-step/);
  assert.match(css,/max-width: 1080px/);
  assert.match(css,/max-width: 700px/);
  assert.match(css,/prefers-reduced-motion/);
  assert.match(main,/artigos-template-v7\.css/);
  assert.match(main,/iniciarCompartilhamentoArtigo/);
});
