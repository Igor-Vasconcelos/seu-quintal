import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { configuracaoCodornas, numeroCodornas, simularCodornas } from "../src/features/codornas/calculos.js";
import { criarItem, tiposDeArea, gruposDeArea, lerProjetos, chaveProjetos } from "../src/features/planejador/projetos.js";
import { criarTerreno } from "../src/features/planejador/geometria.js";

const ler = p => readFileSync(resolve(import.meta.dirname,"..",p),"utf8");
const base = { ...configuracaoCodornas };

test("codornas: consumo e produção de ovos sob hipóteses explícitas", () => {
  const r = simularCodornas(base);
  assert.ok(r);
  assert.equal(r.poedeiras, 13);
  assert.equal(r.ovosPrevistosSemana, 13 * 7 * .8);
  assert.equal(r.avesCorteAlojadas, 0);
  assert.ok(Math.abs(r.racaoDiaKg - .351) < 1e-8);
  assert.ok(Math.abs(r.racaoMesKg - 10.53) < 1e-7);
  assert.equal(r.areaReferenciaM2, 1.3);
  assert.equal(r.aguaDiaL, .715);
});

test("codornas: lote de corte considera entrada, sobrevivência e lotes sobrepostos", () => {
  const r = simularCodornas({ ...base, modo:"corte" });
  assert.equal(r.poedeiras, 0);
  assert.equal(r.entradasMensais, 32);
  assert.equal(r.sobreviventesCorte, 30);
  assert.equal(r.lotesSimultaneos, 2);
  assert.equal(r.avesCorteAlojadas, 64);
  assert.ok(Math.abs(r.carneMesKg - 30 * .26 * .7) < 1e-8);
  assert.ok(Math.abs(r.racaoMesKg - 32 * 18 * 42 / 1000) < 1e-8);
  assert.equal(r.areaReferenciaM2, 6.4);
});

test("codornas: criação mista soma áreas separadas e compara com a disponível", () => {
  const r = simularCodornas({ ...base, modo: "misto", areaDisponivelM2:"5" });
  assert.equal(r.poedeiras, 13);
  assert.equal(r.avesCorteAlojadas, 64);
  assert.ok(Math.abs(r.areaReferenciaM2 - 7.7) < 1e-8);
  assert.equal(r.alertaArea, true);
  assert.ok(Math.abs(r.deficitAreaM2 - 2.7) < 1e-8);
  assert.equal(simularCodornas({ ...base,modo:"misto",areaDisponivelM2:"9" }).alertaArea,false);
});

test("codornas: modo inválido, sobrevivência, taxa, área, decimal e ciclo rejeitados", () => {
  for(const parcial of [
    { modo:"inexistente" }, { posturaPercentual:0 }, { posturaPercentual:101 },
    { ovosSemanais:"0" }, { racaoPosturaGramasDia:"texto" }, { areaPosturaM2Ave:"0" },
    { modo:"corte", sobrevivenciaPercentual:0 }, { modo:"corte", cicloDias:0 },
    { modo:"corte",avesCorteMensais:0 }, { areaDisponivelM2:"-1" },
    { areaDisponivelM2:"abc" }, { alojamento:"inexistente" },
  ]) assert.equal(simularCodornas({...base,...parcial}),null,JSON.stringify(parcial));
  assert.equal(numeroCodornas("0,125"),.125);
  assert.equal(numeroCodornas("1.25"),1.25);
  assert.equal(numeroCodornas("1,5,2"),null);
});

test("novo codornário reaproveita formato e salvamento de terrenos existentes", () => {
  const terreno = criarTerreno("25","40");
  const item=criarItem("codornario",terreno,[]);
  assert.equal(item.tipo,"codornario");
  assert.equal(item.largura,2);
  assert.equal(item.comprimento,3);
  assert.equal(tiposDeArea.codornario.icone,"codorna");
  assert.equal(tiposDeArea.codornario.grupo,"animais");
  assert.ok(item.x>=0&&item.y>=0);
  for(const [id, ficha] of Object.entries(tiposDeArea)){
    assert.ok(ficha.icone, id+" sem ícone");
    assert.ok(Object.hasOwn(gruposDeArea,ficha.grupo),id+" sem grupo");
  }
});

test("terrenos antigos continuam legíveis depois de adicionar novo tipo", () => {
  const originalWindow=globalThis.window;
  const documento={ultimoTerreno:{largura:25,comprimento:40},terrenos:{
    "25x40":{ativo:"inicial",estrada:true,declive:"",
      cenarios:[{id:"inicial",nome:"Cenário inicial",itens:[
        {id:"anterior",tipo:"galinheiro",nome:"Galinheiro existente",x:1,y:1,largura:3,comprimento:4,existente:true},
        {id:"codorna",tipo:"codornario",nome:"Área de codornas",x:5,y:1,largura:2,comprimento:3,existente:false},
      ]}]}
  }};
  globalThis.window={localStorage:{getItem:k=>k===chaveProjetos?JSON.stringify(documento):null}};
  try {
    const r=lerProjetos();
    assert.equal(r.terrenos["25x40"].cenarios[0].itens.length,2);
    assert.equal(r.terrenos["25x40"].cenarios[0].itens[0].tipo,"galinheiro");
    assert.equal(r.terrenos["25x40"].cenarios[0].itens[1].tipo,"codornario");
  } finally {globalThis.window=originalWindow;}
});

test("navegação visual substitui select longo e mapa expõe ícones dos tipos", () => {
  const editor=ler("src/features/planejador/EditorTerreno.jsx");
  const mapa=ler("src/features/planejador/Planta.jsx");
  const painel=ler("src/features/planejador/PainelArea.jsx");
  const css=ler("src/styles/planejador-areas-visuais.css");
  assert.match(editor,/area-categorias/);
  assert.match(editor,/area-opcoes/);
  assert.match(editor,/aria-pressed=\{tipo === id\}/);
  assert.doesNotMatch(editor,/<select value=\{tipo\}/);
  assert.match(mapa,/planta-item-conteudo/);
  assert.match(mapa,/tiposDeArea\[item\.tipo\]\.icone/);
  assert.match(painel,/codornario:/);
  assert.match(css,/data-cor="codornas"/);
});

test("calculadora pública possui HTML, SEO, menu, mapa e teste de navegador", () => {
  const html=ler("ferramentas/calculadora-codornas/index.html");
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.match(html,/rel="canonical"/);
  assert.match(html,/<noscript>/);
  assert.match(html,/calculadora-codornas-raiz/);
  for(const file of ["src/main-conteudo.jsx","src/components/Cabecalho.jsx",
    "src/components/Rodape.jsx","scripts/gerar-artigos.mjs",
    "mapa-do-site/index.html","vite.config.js","scripts/smoke-visual.mjs"])
    assert.match(ler(file),/calculadora-codornas/);
  assert.match(ler("src/main-quintal.jsx"),/planejador-areas-visuais.css/);
});

test("codornas: custos só são mostrados com preços e consumo de lote respeita o ciclo", () => {
  const semPreco = simularCodornas({ ...base, modo: "misto" });
  assert.equal(semPreco.custoRacaoMes, null);
  assert.equal(semPreco.custoCompraAvesInicial, null);
  const r = simularCodornas({ ...base, modo: "misto",
    precoRacaoKg:"4,50", precoPoedeira:"12", precoPintinho:"3", custoEstrutura:"250" });
  assert.ok(r);
  assert.ok(Math.abs(r.racaoMesKg - (13*27*30 + 32*18*42)/1000) < 1e-8);
  assert.ok(Math.abs(r.custoRacaoMes - r.racaoMesKg*4.5) < 1e-8);
  assert.equal(r.custoCompraAvesInicial, 13*12 + 64*3);
  assert.equal(r.investimentoInicialEstimado, 13*12 + 64*3 + 250);
  assert.equal(r.custoMensalConhecido, r.custoRacaoMes + 32*3);
  assert.equal(simularCodornas({...base,precoRacaoKg:"-2"}),null);
  assert.equal(simularCodornas({...base,precoRacaoKg:"custo"}),null);
});
test("codornas: área geométrica é informativa e não presume capacidade no misto", () => {
  const ovos = simularCodornas({ ...base, areaDisponivelM2: "2" });
  assert.equal(ovos.capacidadeGeometrica,20);
  assert.equal(ovos.ovosPotenciaisDiaNaArea,16);
  assert.equal(simularCodornas({...base,modo:"misto",areaDisponivelM2:"2"}).capacidadeGeometrica,null);
});
