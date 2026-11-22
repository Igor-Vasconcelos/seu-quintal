import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,statSync} from "node:fs";
import {resolve} from "node:path";
const root=resolve(import.meta.dirname,"..");
const read=p=>readFileSync(resolve(root,p),"utf8");
test("Sisteminha tem imagem fotográfica sintética em AVIF com fallback WebP",()=>{
 const jsx=read("src/main-sisteminha.jsx");
 assert.match(jsx,/hero-realista-v4\.avif/);
 assert.match(jsx,/hero-realista-v4\.webp/);
 assert.match(jsx,/<picture>/);
 assert.match(jsx,/type="image\/avif"/);
 assert.match(jsx,/fetchPriority="high"/);
 assert.doesNotMatch(jsx,/src="\.\/imagens\/sisteminha\/hero-corrigido\.svg"/);
 assert.match(jsx,/não fotografia de instalação real/);
 const avif=statSync(resolve(root,"public/imagens/sisteminha/hero-realista-v4.avif"));
 const webp=statSync(resolve(root,"public/imagens/sisteminha/hero-realista-v4.webp"));
 assert.ok(avif.size>30000 && avif.size<250000);
 assert.ok(webp.size>40000 && webp.size<250000);
});
test("Fotos de ferramentas são realistas e possuem descrição e crédito",()=>{
 for(const [file,asset] of [
   ["horta/canteiros/index.html","abertura-horta-768.webp"],
   ["horta/calendario-de-plantio/index.html","horta.webp"],
   ["ferramentas/calculadora-codornas/index.html","codornas-fotoreal-v5.webp"],
   ["ferramentas/planejador-de-pomar/index.html","pomar-frutiferas-v1.webp"],
 ]){
  const html=read(file);
  assert.match(html,/ferramenta-(?:topo-figura|foto-realista)/);
  assert.ok(html.includes(asset));
  assert.match(html,/Imagem (?:ilustrativa|sintética) gerada por IA/);
  assert.match(html,/alt="/);
 }
 assert.ok(statSync(resolve(root,"public/imagens/codornas-fotoreal-v5.webp")).size>10000);
 assert.ok(statSync(resolve(root,"public/imagens/pomar-frutiferas-v1.webp")).size>10000);
});
test("Fotografias não alteram as regras de negócio ou layouts dos mapas",()=>{
 const css=read("src/styles/tool-layout-v4.css");
 assert.match(css,/max-width: 740px/);
 assert.match(css,/ferramenta-foto-realista/);
 assert.match(read("src/styles/editorial-mockup.css"),/sisteminha-hero-credito/);
 assert.doesNotMatch(css,/(?:^|\n)\s*(?:input|select|\.planta-item)\s*\{/);
});
