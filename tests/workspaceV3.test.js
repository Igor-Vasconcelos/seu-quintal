import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
const read=p=>readFileSync(resolve(import.meta.dirname,"..",p),"utf8");
test("Meu Quintal preserva as quatro seções e o componente de backup",()=>{
 const jsx=read("src/features/quintal/MeuQuintal.jsx");
 for(const id of ["terreno","historico","horta","canteiros"])assert.ok(jsx.includes(id));
 assert.match(jsx,/<PlanejadorQuintal/);
 assert.match(jsx,/<OrganizadorHorta/);
 assert.match(jsx,/<PlanejadorVisualCanteiro/);
 assert.match(jsx,/<HistoricoCultivo/);
 assert.match(jsx,/<BackupDados/);
 assert.match(jsx,/quintal-titulo-acoes/);
 assert.match(jsx,/quintal-navegacao-icone/);
 assert.match(jsx,/Seção selecionada: /);
 assert.match(jsx,/aria-current=\{secao === id/);
});
test("O backup mantém contrato e confirma substituição antes de restaurar",()=>{
 const jsx=read("src/features/quintal/BackupDados.jsx");
 assert.match(jsx,/id="quintal-backup"/);
 assert.match(jsx,/baixarBackup/);
 assert.match(jsx,/confirmado/);
 assert.match(jsx,/restaurarBackup/);
 assert.match(jsx,/window\.location\.reload/);
 assert.match(jsx,/dados não são enviados para um servidor/);
});
test("O painel v3 muda apenas disposição e possui alternativa mobile",()=>{
 const css=read("src/styles/workspace-v3.css");
 assert.match(css,/grid-template-areas/);
 assert.match(css,/max-width: 1020px/);
 assert.match(css,/max-width: 700px/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/scroll-snap-type/);
 assert.doesNotMatch(css,/(?:^|\n)\s*(?:input|button|\.planta-item)\s*\{/);
 assert.match(read("src/main-quintal.jsx"),/workspace-v3.css/);
});
