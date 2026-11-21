import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {generateArticles} from "../scripts/gerar-artigos.mjs";
const read=p=>readFileSync(resolve(import.meta.dirname,"..",p),"utf8");
test("artigos gerados preservam H1, URLs e conteúdo indexável após migração",()=>{
 const n=generateArticles();
 assert.equal(n,2);
 const art=read("artigos/como-planejar-uma-horta-para-colher-com-frequencia/index.html");
 assert.equal((art.match(/<h1\b/g)||[]).length,1);
 assert.match(art,/rel="canonical"/);
 assert.match(art,/application\/ld\+json/);
 assert.match(art,/class="sq-brand-text"/);
 assert.match(art,/favicon\.svg/);
 assert.match(art,/Da primeira muda ao seu sítio/);
 assert.match(art,/class="sq-tool"/);
});
test("guia, artigo e ferramenta permanecem independentes no CSS visual",()=>{
 const css=read("src/styles/editorial-pages-v3.css");
 assert.match(css,/\.conteudo-tematico \.abertura-horta/);
 assert.match(css,/\.sq-artigos \.sq-header/);
 assert.match(css,/aspect-ratio: 3 \/ 2/);
 assert.match(css,/max-width: 760px/);
 assert.match(css,/prefers-reduced-motion/);
 assert.doesNotMatch(css,/(?:^|\n)\s*(?:input|select|\.editor-terreno)\s*\{/);
});
test("o novo CSS é carregado tanto em guias React quanto em artigos HTML estáticos",()=>{
 assert.match(read("src/main-conteudo.jsx"),/editorial-pages-v3.css/);
 assert.match(read("src/main-artigos.js"),/editorial-pages-v3.css/);
 assert.match(read("scripts/gerar-artigos.mjs"),/class="sq-brand-text"/);
});
