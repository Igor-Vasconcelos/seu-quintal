import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
const read=p=>readFileSync(resolve(import.meta.dirname,"..",p),"utf8");
test("estilos das ferramentas entram em todos os pontos React sem editar funções de domínio",()=>{
 for(const entry of ["src/main.jsx","src/main-conteudo.jsx","src/main-sisteminha.jsx","src/main-quintal.jsx"])
   assert.match(read(entry),/tool-ui-v3.css/);
 const css=read("src/styles/tool-ui-v3.css");
 assert.match(css,/\.ferramenta/);
 assert.match(css,/\.canteiro-area/);
 assert.match(css,/\.galinheiro-calculadora/);
 assert.match(css,/\.editor-terreno/);
 assert.match(css,/prefers-reduced-motion: reduce/);
 assert.doesNotMatch(css,/(?:^|\n)\s*(?:input|select|button|\.planta-item)\s*\{/);
});
test("CSS somente apresenta resultados e entradas, cálculos permanecem em seus módulos",()=>{
 const css=read("src/styles/tool-ui-v3.css");
 assert.match(css,/font-variant-numeric: tabular-nums/);
 assert.match(css,/var\(--sq-control-border\)/);
 assert.match(css,/var\(--sq-error-text\)/);
 assert.match(css,/var\(--sq-focus\)/);
});
