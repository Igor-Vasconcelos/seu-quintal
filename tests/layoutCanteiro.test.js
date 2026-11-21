import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { culturasOrganizador } from "../src/features/organizador/culturas.js";
import { iconeDaCultura, nomeCurtoDaCultura } from "../src/features/organizador/culturasVisuais.js";
import { CHAVE_CANTEIRO, MEDIDAS_INICIAIS, validarRascunho, lerRascunho, gravarRascunho }
  from "../src/features/organizador/rascunhoCanteiro.js";

const raiz = resolve(import.meta.dirname, "..");
const file = caminho => readFileSync(resolve(raiz, caminho), "utf8");
function storageEmMemoria() {
  const itens = new Map();
  return {
    getItem: chave => itens.get(chave) ?? null,
    setItem: (chave, valor) => itens.set(chave, valor),
  };
}
const inicial = () => ({
  medidas: { largura: 120, comprimento: 240 },
  plantas: [
    { id: "p1", cultura: "Alface de verão", x: 12.5, y: 12.5, largura: 25, comprimento: 25 },
    { id: "p2", cultura: "Alface de inverno", x: 37.5, y: 12.5, largura: 25, comprimento: 25 },
  ],
});

test("as culturas existentes possuem ícones e nomes inequívocos", () => {
  const grupos = [...new Set(Object.keys(culturasOrganizador).map(iconeDaCultura))];
  assert.equal(Object.keys(culturasOrganizador).length, 10);
  assert.equal(grupos.length, 8);
  assert.equal(grupos.includes("folha"), false);
  assert.equal(iconeDaCultura("Alface de verão"), "alface");
  assert.equal(iconeDaCultura("Alface de inverno"), "alface");
  assert.equal(iconeDaCultura("Cenoura de inverno"), "cenoura");
  assert.equal(iconeDaCultura("Tomate de mesa"), "tomate");
  assert.match(nomeCurtoDaCultura("Alface de verão"), /verão/);
});

test("rascunho é válido, recuperável e isolado das chaves antigas", () => {
  const armazenamento = storageEmMemoria();
  assert.equal(lerRascunho(armazenamento), null);
  const dados = inicial();
  gravarRascunho(dados, armazenamento);
  assert.deepEqual(lerRascunho(armazenamento), dados);
  assert.equal(JSON.parse(armazenamento.getItem(CHAVE_CANTEIRO)).versao, 1);
  assert.deepEqual(MEDIDAS_INICIAIS, { largura: 120, comprimento: 240 });
  assert.match(CHAVE_CANTEIRO, /rascunho-canteiro/);
  assert.notEqual(CHAVE_CANTEIRO, "seu-quintal:organizador-horta:v1");
});

test("rascunho inválido ou incompatível não substitui o plano", () => {
  const dados = inicial();
  assert.equal(validarRascunho({ ...dados, versao: 2 }), null);
  assert.equal(validarRascunho({ ...dados, versao: 1,
    medidas: { largura: 20, comprimento: 240 } }), null);
  assert.equal(validarRascunho({ ...dados, versao: 1,
    plantas: [dados.plantas[0], { ...dados.plantas[0], id: "p3" }] }), null);
  assert.equal(validarRascunho({ ...dados, versao: 1,
    plantas: [dados.plantas[0], { ...dados.plantas[0], x: 37.5 }] }), null);
  assert.equal(validarRascunho({ ...dados, versao: 1,
    plantas: [{ ...dados.plantas[0], cultura: "desconhecida" }] }), null);
  assert.equal(validarRascunho({ ...dados, versao: 1,
    plantas: [{ ...dados.plantas[0], x: -3 }] }), null);
  const memoria = storageEmMemoria();
  memoria.setItem(CHAVE_CANTEIRO, "{quebrado");
  assert.equal(lerRascunho(memoria), null);
  assert.throws(() => gravarRascunho({ ...dados, plantas: [dados.plantas[0], dados.plantas[0]] }, memoria));
});

test("layout mantém as opções de acesso, edição e exportação reais", () => {
  const jsx = file("src/features/organizador/PlanejadorVisualCanteiro.jsx");
  const css = file("src/styles/visual-canteiro.css");
  const html = file("horta/canteiros/index.html");
  assert.match(html, /<h1>Planejador Visual de Canteiros<\/h1>/);
  assert.match(jsx, /gravarRascunho/);
  assert.match(jsx, /await imagem\.decode\(\)/);
  assert.match(jsx, /toBlob\(/);
  assert.match(jsx, /selecionada/);
  assert.match(jsx, /role="group"/);
  assert.match(jsx, /onPointerDown/);
  assert.match(jsx, /onKeyDown/);
  assert.match(jsx, /<IconeCultura/);
  assert.match(css, /grid-template-columns: minmax/);
  assert.match(css, /max-width: 700px/);
  assert.doesNotMatch(jsx, /Vista 3D/);
});
