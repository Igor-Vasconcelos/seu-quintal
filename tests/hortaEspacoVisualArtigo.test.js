import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { calcularPlanoFamiliar } from "../src/features/organizador/planoFamiliar.js";
import { dimensionarLote } from "../src/features/organizador/escala.js";
import { readArticle, renderArticle } from "../scripts/gerar-artigos.mjs";

const base = {
  pessoas: 4, inicio:"2026-11-22", regiao:"Sudeste",
  preferencias: [
    {cultura:"Alface de verão",casa:4,venda:0,intervalo:1},
    {cultura:"Cenoura de verão",casa:8,venda:0,intervalo:2},
  ],
  planosExistentes: [],
};
const read=path=>readFileSync(resolve(import.meta.dirname,"..",path),"utf8");

test("modo automático calcula área antes de conhecer canteiros", () => {
  const r=calcularPlanoFamiliar({ ...base,modoEspaco:"automatico" });
  assert.equal(r.erro,null);
  assert.equal(r.modoEspaco,"automatico");
  assert.equal(r.areaCanteiro,3);
  assert.equal(r.larguraModelo,1);
  assert.equal(r.comprimentoModelo,3);
  assert.equal(r.canteirosNecessarios,Math.ceil(r.areaNecessariaM2 / 3));
  assert.equal(r.quantidadeConsiderada,r.canteirosNecessarios);
  assert.equal(r.areaNova,r.sugestoes.reduce((total,item)=>total+item.area,0));
  assert.equal(r.cabe,true);
  assert.ok(r.sugestoes.every(item=>item.reservas.length>0));
  assert.ok(r.avisos.some(aviso=>/corredores/.test(aviso)));
});

test("modo existente mantém capacidades e cálculos antigos", () => {
  const r=calcularPlanoFamiliar({ ...base, quantidadeCanteiros:2, largura:1,comprimento:2 });
  assert.equal(r.erro,null);
  assert.equal(r.modoEspaco,"existente");
  assert.equal(r.quantidadeConsiderada,2);
  assert.equal(r.areaCanteiro,2);
  assert.equal(r.areaTotal,4);
  assert.equal(r.canteirosNecessarios,Math.ceil(r.areaNecessariaM2/2));
  assert.equal(r.cabe,r.faltaArea<=1e-6 && r.sugestoes.every(i=>!i.semEspaco));
  assert.equal(calcularPlanoFamiliar({...base,quantidadeCanteiros:0,largura:1,comprimento:2}).erro.includes("canteiros"),true);
});

test("cultivos salvos são reservados no dimensionamento automático", () => {
  const anterior={
    cultura:"Rabanete",inicio:"2026-11-22",origem:"semente",casa:8,venda:0,intervalo:1,
    rendimento:null,duracao:null,teste:2,canteiro:"Canteiro 1",
  };
  const r=calcularPlanoFamiliar({...base,modoEspaco:"automatico",planosExistentes:[anterior]});
  assert.equal(r.erro,null);
  assert.equal(r.areaReservada,dimensionarLote(anterior).areaSimultanea);
  assert.ok(r.areaNecessariaM2>r.areaNova);
  assert.ok(r.canteirosNecessarios>=1);
});

test("demanda superior ao limite visual não é cortada silenciosamente nem salva", () => {
  const r=calcularPlanoFamiliar({
    ...base,modoEspaco:"automatico",preferencias:[
      {cultura:"Alface de verão",casa:10000,venda:0,intervalo:1},
    ],
  });
  assert.equal(r.erro,null);
  assert.equal(r.quantidadeConsiderada,24);
  assert.ok(r.canteirosNecessarios>24);
  assert.ok(r.areaNecessariaM2>r.areaTotal);
  assert.ok(r.faltaArea>0);
  assert.equal(r.cabe,false);
  assert.ok(r.avisos.some(aviso=>aviso.includes("24 canteiros-modelo")));
});

test("visualização reusa desenhos e projeção do domínio sem gerar figuras paralelas", () => {
  const visual=read("src/features/organizador/VisualizacaoHorta.jsx");
  assert.match(visual,/import IconeCultura from "\.\/IconeCultura\.jsx"/);
  assert.match(visual,/item\.seguintes\.map\(lote/);
  assert.match(visual,/lote\.colheita\.de/);
  assert.match(visual,/área útil/);
  assert.doesNotMatch(visual,/<img|src="\/imagens\/|Math\.random/);
  const original=read("src/features/organizador/IconeCultura.jsx");
  assert.match(original,/iconeDaCultura/);
  assert.match(original,/viewBox="0 0 72 72"/);
});

test("jornada completa começa pelo consumo e oferece modo existente sem alterar dados salvos", () => {
  const ui=read("src/features/organizador/PlanejamentoFamiliar.jsx");
  const stepPeople=ui.indexOf("Para quem e quando plantar?");
  const stepConsumption=ui.indexOf("O que sua família costuma comer?");
  const stepArea=ui.indexOf("Descubra o espaço e veja os lotes");
  assert.ok(stepPeople>=0 && stepPeople<stepConsumption && stepConsumption<stepArea);
  assert.match(ui,/modoEspaco.*automatico/);
  assert.match(ui,/Já tenho canteiros/);
  assert.match(ui,/<VisualizacaoHorta resultado=\{sugestao\}/);
  assert.match(ui,/Adicionar sugestões à minha agenda/);
  assert.match(read("src/features/organizador/armazenamento.js"),/seu-quintal:organizador-horta:v1/);
});

test("o artigo publicado contém simulador interativo com fallback e link de continuidade", () => {
  const slug="como-planejar-uma-horta-para-colher-com-frequencia";
  const meta=readArticle(read("content/artigos/"+slug+".md"),slug+".md");
  const html=renderArticle({...meta,slug});
  assert.match(html,/id="simulador-horta-artigo"/);
  assert.match(html,/id="titulo-horta-interativa"/);
  assert.match(html,/Ative o JavaScript/);
  assert.match(html,/horta\/organizador\/#planejamento-familiar/);
  assert.equal((html.match(/<h1>/g)||[]).length,1);
  assert.match(read("src/main-artigos.js"),/import\("\.\/features\/artigos\/SimuladorHortaArtigo\.jsx"\)/);
  const demo=read("src/features/artigos/SimuladorHortaArtigo.jsx");
  assert.match(demo,/calcularPlanoFamiliar/);
  assert.match(demo,/VisualizacaoHorta/);
  assert.match(demo,/não salva dados nem os transfere automaticamente/);
});
