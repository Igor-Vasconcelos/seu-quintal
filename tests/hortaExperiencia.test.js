import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { calcularTerra, converterMedidaTerra, validarMedidaTerra } from "../src/features/guias/calculoTerra.js";

const raiz = resolve(import.meta.dirname, "..");
const ler = caminho => readFileSync(resolve(raiz, caminho), "utf8");
const medidas = { comprimento: "60", largura: "25", profundidade: "20", saco: "20" };

test("jardineira de 60 × 25 × 20 cm precisa de 30 litros e 2 sacos de 20 L", () => {
  const { resultado, invalidos } = calcularTerra(medidas, "cm");
  assert.deepEqual(invalidos, []);
  assert.equal(resultado.litros, 30);
  assert.equal(resultado.quantidade, 2n);
});
test("troca entre cm e m preserva o volume com casas suficientes para precisão", () => {
  const emMetros = Object.fromEntries(Object.entries(medidas).map(([nome, valor]) =>
    [nome, nome === "saco" ? valor : converterMedidaTerra(valor, "cm", "m")]));
  assert.equal(emMetros.comprimento, "0,6");
  assert.equal(emMetros.largura, "0,25");
  assert.equal(emMetros.profundidade, "0,2");
  assert.equal(calcularTerra(emMetros, "m").resultado.litros, 30);
  assert.equal(converterMedidaTerra("0,0001", "m", "cm"), "0,01");
  assert.equal(converterMedidaTerra("0,01", "cm", "m"), "0,0001");
  assert.equal(validarMedidaTerra("0,0001", "m"), 0.0001);
});
test("quantidade de sacos arredonda sempre para cima e é opcional", () => {
  assert.equal(calcularTerra({ ...medidas, saco:"12" }, "cm").resultado.quantidade, 3n);
  assert.equal(calcularTerra({ ...medidas, saco:"" }, "cm").resultado.quantidade, null);
  const decimal = calcularTerra({ comprimento:"100", largura:"50", profundidade:"20", saco:"20" }, "cm");
  assert.equal(decimal.resultado.litros, 100);
  assert.equal(decimal.resultado.quantidade, 5n);
});
test("não oferece resultado com entrada vazia, negativa, infinita ou casas inválidas", () => {
  assert.deepEqual(calcularTerra({ comprimento:"",largura:"25",profundidade:"20",saco:"" }, "cm").invalidos, ["comprimento"]);
  assert.deepEqual(calcularTerra({ ...medidas, saco:"0" }, "cm").invalidos, ["saco"]);
  assert.deepEqual(calcularTerra({ ...medidas, comprimento:"-30" }, "cm").invalidos, ["comprimento"]);
  assert.deepEqual(calcularTerra({ ...medidas, largura:"NaN" }, "cm").invalidos, ["largura"]);
  assert.deepEqual(calcularTerra({ ...medidas, largura:"0,001" }, "cm").invalidos, ["largura"]);
  assert.equal(calcularTerra({ ...medidas, comprimento:"10000,01" }, "cm").resultado, null);
});
test("interface mantém acessibilidade e separa sugestões, cálculo e resultados", () => {
  const guia = ler("src/features/guias/GuiaHorta.jsx");
  assert.match(guia, /aria-pressed=\{espaco === id\}/);
  assert.match(guia, /aria-pressed=\{luz === id\}/);
  assert.match(guia, /aria-live="polite"/);
  assert.match(guia, /Ver calendário da minha região/);
  assert.match(guia, /Fontes técnicas e créditos das fotografias/);
  const calculadora = ler("src/features/guias/CalculadoraTerra.jsx");
  assert.match(calculadora, /name="unidade"/);
  assert.match(calculadora, /converterMedidaTerra/);
  assert.match(calculadora, /aria-invalid/);
  assert.match(calculadora, /Volume geométrico de terra/);
  const horta = ler("horta/index.html");
  assert.match(horta, /horta-proximas-etapas/);
  assert.match(horta, /\.\/organizador\//);
  const principal = ler("src/main-conteudo.jsx");
  assert.match(principal, /horta-ferramentas-v6\.css/);
});
