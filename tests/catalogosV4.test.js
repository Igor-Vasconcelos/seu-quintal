import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateArticles } from "../scripts/gerar-artigos.mjs";
import { guias } from "../src/data/guias.js";
const ler = caminho => readFileSync(resolve(import.meta.dirname,"..",caminho),"utf8");

test("catálogo de guias apresenta público, aprendizado e destino válido",()=>{
  assert.equal(guias.length,4);
  for(const guia of guias){
    assert.ok(guia.formato && guia.paraQuem && guia.aprende);
    assert.match(guia.destino,/^[a-z0-9/#.-]+$/);
    assert.doesNotMatch(guia.aprende,/garantido/i);
  }
  const cards=ler("src/components/CartoesGuias.jsx");
  assert.match(cards,/guia-cartao-detalhes/);
  assert.match(cards,/guia\.paraQuem/);
  assert.match(cards,/guia\.aprende/);
});

test("página de guias explica o passo a passo sem depender de JavaScript",()=>{
 const html=ler("guias/index.html");
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 assert.match(html,/guias-como-usar/);
 assert.match(html,/id="catalogo-guias"/);
 assert.match(html,/<noscript>/);
 assert.match(html,/rel="canonical"/);
});

test("catálogo editorial gerado diferencia artigos de guias e mantém SEO",()=>{
 assert.equal(generateArticles(),2);
 const html=ler("artigos/index.html");
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 for(const frase of ["Artigos e guias para seu quintal","Guias para começar",
 "Artigos por assunto","Artigos","Ferramentas","Como organizar uma horta pequena","Quantas galinhas preciso"]) {
   assert.ok(html.includes(frase),frase);
 }
 assert.match(html,/sq-guides-grid/);
 assert.match(html,/sq-articles-list/);
 assert.match(html,/rel="canonical"/);
 assert.match(ler("src/main-artigos.js"),/catalogos-v4\.css/);
 assert.match(ler("src/main-conteudo.jsx"),/catalogos-v4\.css/);
});
