import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cultivosPequenosEspacos, recomendarCultivos, exemploParaCultivo } from "../src/features/guias/recomendacoesHorta.js";
import { plantasHorta } from "../src/data/plantas-horta.js";
import { calcularTerra } from "../src/features/guias/calculoTerra.js";

test("16 opções de cultivo; fotografias originais e avisos preservados", () => {
  assert.equal(Object.keys(cultivosPequenosEspacos).length,16);
  for (const [id, ficha] of Object.entries(cultivosPequenosEspacos)) {
    assert.ok(ficha.nome && ficha.dica && ficha.cuidadoSol && ficha.recipiente,id);
    assert.ok(ficha.medidas.length===3 && ficha.medidas.every(n=>n>0),id);
    if (ficha.foto) assert.equal(plantasHorta[id]?.nome,ficha.nome,id);
  }
});

test("luz maior amplia possibilidades sem declarar todas ideais", () => {
  const pouca = recomendarCultivos("varanda","pouca");
  const parcial = recomendarCultivos("varanda","parcial");
  const pleno = recomendarCultivos("varanda","pleno");
  assert.deepEqual(pouca.principais.map(i=>i.id),["hortela","salsinha"]);
  assert.equal(pouca.total,2);
  assert.ok(parcial.total>pouca.total);
  assert.ok(pleno.total>parcial.total);
  assert.ok(pleno.principais.some(i=>i.id==="tomate-cereja"));
  assert.ok(pleno.comCuidados.some(i=>i.id==="alface"),"alface precisa de ressalva no calor");
  assert.ok(pleno.comCuidados.some(i=>i.id==="hortela"),"hortelã com sol forte deve ter ressalva");
  assert.ok(!pleno.principais.some(i=>i.id==="hortela"),"tolerar meia-sombra não equivale a preferir sol pleno");
});

test("janela evita estruturas pesadas e oferece alternativas com manejo", () => {
  const pleno = recomendarCultivos("janela","pleno");
  assert.ok(pleno.principais.some(i=>i.id==="manjericao"));
  assert.ok(pleno.comCuidados.some(i=>i.id==="cebolinha"));
  const ids = [...pleno.principais,...pleno.outrasAdequadas,...pleno.comCuidados].map(i=>i.id);
  assert.ok(!ids.includes("tomate-cereja"));
  assert.ok(!ids.includes("pimentao"));
  assert.ok(!ids.includes("couve"));
  assert.deepEqual(recomendarCultivos("janela","errado").principais,[]);
});

test("clicar em uma cultura fornece exemplo calculável, sem alterar fórmula", () => {
  const tomate = exemploParaCultivo("tomate-cereja", "varanda");
  assert.match(tomate.aviso,/terra molhada/);
  assert.match(exemploParaCultivo("manjericao", "janela").aviso,/lado interno/);
  assert.equal(tomate.nome,"Tomate-cereja");
  assert.deepEqual(tomate.medidas,{comprimento:"45",largura:"45",profundidade:"45"});
  const {resultado,invalidos}=calcularTerra({...tomate.medidas,saco:"20"},"cm");
  assert.deepEqual(invalidos,[]);
  assert.equal(resultado.litros,91.125);
  assert.equal(resultado.quantidade,5n);
  assert.match(tomate.aviso,/ilustrativas/);
  assert.equal(exemploParaCultivo("inexistente"),null);
  for(const id of Object.keys(cultivosPequenosEspacos)) {
    assert.ok(calcularTerra(exemploParaCultivo(id).medidas,"cm").resultado.litros>0,id);
  }
});

test("a transição de escolha para volume tem ação e retorno acessíveis", () => {
  const src=readFileSync(resolve(import.meta.dirname,"../src/features/guias/GuiaHorta.jsx"),"utf8");
  const calc=readFileSync(resolve(import.meta.dirname,"../src/features/guias/CalculadoraTerra.jsx"),"utf8");
  assert.match(src,/Calcular terra para \{item\.nome\}/);
  assert.match(src,/Outras \{sugestao\.comCuidados\.length\} opções/);
  assert.match(src,/aria-live="polite"/);
  assert.match(src,/exemploParaCultivo\(id, espaco\)/);
  assert.match(calc,/useEffect/);
  assert.match(calc,/calcularTerra\(valoresIniciais, "cm"\)/);
  assert.match(calc,/Voltar às plantas/);
});
