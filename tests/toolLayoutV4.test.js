import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
const ler=p=>readFileSync(resolve(import.meta.dirname,"..",p),"utf8");
const paginas=[
 ["horta/canteiros/index.html","canteiro-visual-raiz"],
 ["horta/calendario-de-plantio/index.html","calendario-raiz"],
 ["horta/organizador/index.html","organizador-raiz"],
 ["ferramentas/calculadora-codornas/index.html","calculadora-codornas-raiz"],
 ["ferramentas/calculadora-peixes/index.html","calculadora-peixes-raiz"],
 ["ferramentas/planejador-de-pomar/index.html","planejador-pomar-raiz"],
];
test("seis ferramentas adotam abertura compacta e sinais claros de utilização",()=>{
 for(const [path,mount] of paginas){
  const html=ler(path);
  assert.match(html,/class="pagina-ferramenta-v4"/);
  assert.match(html,/class="ferramenta-meta"/);
  assert.match(html,/Gratuito/);
  assert.match(html,/Sem cadastro/);
  assert.ok(html.includes('id="'+mount+'"'));
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.match(html,/rel="canonical"/);
 }
});
test("instruções continuam indexáveis, agora após o formulário das ferramentas",()=>{
 for(const [path,mount] of paginas.filter(([p])=>/organizador|calculadora-|planejador-de-pomar/.test(p))){
  const html=ler(path);
  const area=html.indexOf('id="'+mount+'"');
  const explicacao=html.indexOf('class="orientacao-tematica"');
  assert.ok(area > 0 && explicacao > area,path);
 }
});
test("estilos v4 não modificam cálculos e mantêm conteúdo e painel responsivos",()=>{
 const css=ler("src/styles/tool-layout-v4.css");
 assert.match(css,/\.pagina-ferramenta-v4/);
 assert.match(css,/\.pagina-meu-quintal/);
 assert.match(css,/max-width: 740px/);
 assert.doesNotMatch(css,/(?:^|\n)\s*(?:input|select|svg|\.planta-item)\s*\{/);
 for(const entry of ["src/main-conteudo.jsx","src/main-quintal.jsx"])
   assert.match(ler(entry),/tool-layout-v4.css/);
 assert.match(ler("scripts/smoke-visual.mjs"),/calendario-de-plantio/);
});
