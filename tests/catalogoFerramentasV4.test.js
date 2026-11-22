import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {catalogoFerramentas,gruposFerramentas,ferramentasDoModulo} from "../src/data/catalogoFerramentas.js";
import {generateArticles} from "../scripts/gerar-artigos.mjs";
const read=p=>readFileSync(resolve(import.meta.dirname,"..",p),"utf8");
test("catálogo lista somente ferramentas publicadas com grupos e resultados",()=>{
 const grupos=new Set(gruposFerramentas.map(g=>g.id));
 assert.equal(grupos.size,gruposFerramentas.length);
 assert.ok(catalogoFerramentas.length>=9);
 assert.equal(new Set(catalogoFerramentas.map(x=>x.id)).size,catalogoFerramentas.length);
 for(const item of catalogoFerramentas){
   assert.ok(grupos.has(item.grupo));
   assert.match(item.rota,/^[a-z0-9-]+(?:\/[a-z0-9-]+)*(?:\/|\/#[a-z0-9-]+|\.html#[a-z0-9-]+)$/);
   assert.ok(item.nome&&item.descricao&&item.resultado&&item.icone);
   assert.ok(item.modulos.length);
 }
});
test("peixes são mostrados na aba do tanque e não em módulos sem relação",()=>{
 const ids=ferramentasDoModulo("tanque").map(x=>x.id);
 assert.ok(ids.includes("peixes"));
 assert.ok(ids.includes("meu-quintal"));
 assert.ok(!ids.includes("codornas"));
 const avicultura=ferramentasDoModulo("galinheiro").map(x=>x.id);
 assert.ok(avicultura.includes("galinhas"));
 assert.ok(avicultura.includes("codornas"));
 assert.ok(ferramentasDoModulo("horta").some(x=>x.id==="pomar"));
});
test("catálogo, guias, navegação e sitemap têm links indexáveis",()=>{
 const html=read("ferramentas/index.html");
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 assert.match(html,/rel="canonical"/);
 assert.match(html,/catalogo-ferramentas/);
 assert.match(html,/<noscript>/);
 for(const path of ["src/main-conteudo.jsx","src/components/Cabecalho.jsx","src/components/Rodape.jsx",
  "vite.config.js","scripts/smoke-visual.mjs","scripts/gerar-artigos.mjs","mapa-do-site/index.html"]){
  assert.ok(read(path).includes("ferramentas/"),path);
 }
 assert.match(read("src/main-sisteminha.jsx"),/FerramentasModulo/);
 assert.match(read("src/features/sisteminha/FerramentasModulo.jsx"),/ferramentasDoModulo/);
 assert.equal(generateArticles(),2);
 assert.match(read("public/sitemap.xml"),/\/seu-quintal\/ferramentas\/<\/loc>/);
});
