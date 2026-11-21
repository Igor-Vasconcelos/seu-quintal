import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { culturasOrganizador } from "../src/features/organizador/culturas.js";
import {
  LIMITE_PLANTAS, adicionarAutomaticamente, areaOcupadaCm2,
  capacidadeHomogenea, cm, dimensoesDaCultura, cabeNoCanteiro,
  entraEmConflito, posicaoValida, proximaPosicaoLivre, resumirCulturas,
} from "../src/features/organizador/canteiroGeometria.js";

const raiz = resolve(import.meta.dirname, "..");

test("reutiliza espaçamentos das mesmas culturas do Organizador de Horta", () => {
  const alface = dimensoesDaCultura(culturasOrganizador["Alface de verão"]);
  const couve = dimensoesDaCultura(culturasOrganizador.Couve);
  const rabanete = dimensoesDaCultura(culturasOrganizador.Rabanete);
  assert.deepEqual(alface, { largura: 25, comprimento: 25 });
  assert.deepEqual(couve, { largura: 90, comprimento: 50 });
  assert.deepEqual(rabanete, { largura: 25, comprimento: 5 });
  assert.deepEqual(dimensoesDaCultura(culturasOrganizador.Couve, true),
    { largura: 50, comprimento: 90 });
  assert.equal(cm(2.65), 265);
});

test("calcula capacidade geométrica com espaçamento entre linhas e plantas", () => {
  assert.equal(capacidadeHomogenea(100, 200,
    dimensoesDaCultura(culturasOrganizador["Alface de verão"])), 32);
  assert.equal(capacidadeHomogenea(100, 100,
    dimensoesDaCultura(culturasOrganizador.Rabanete)), 80);
  assert.equal(capacidadeHomogenea(50, 50,
    dimensoesDaCultura(culturasOrganizador.Couve)), 0);
  assert.equal(capacidadeHomogenea(0, 100, { largura: 10, comprimento: 10 }), 0);
});

test("não permite planta fora de área ou espaçamentos sobrepostos", () => {
  const a = { id: "a", cultura: "Alface", x: 12.5, y: 12.5, largura: 25, comprimento: 25 };
  const b = { id: "b", cultura: "Alface", x: 37.5, y: 12.5, largura: 25, comprimento: 25 };
  const c = { id: "c", cultura: "Alface", x: 30, y: 12.5, largura: 25, comprimento: 25 };
  assert.equal(cabeNoCanteiro(a, 100, 100), true);
  assert.equal(entraEmConflito(a, b), false);
  assert.equal(entraEmConflito(a, c), true);
  assert.equal(posicaoValida(b, [a], 100, 100), true);
  assert.equal(posicaoValida(c, [a], 100, 100), false);
  assert.equal(posicaoValida({ ...b, x: 96 }, [a], 100, 100), false);
  assert.equal(posicaoValida(a, [a], 100, 100, "a"), true);
});

test("distribui posições automaticamente sem sobreposição e respeita o limite", () => {
  const d = dimensoesDaCultura(culturasOrganizador["Alface de verão"]);
  let serial = 0;
  const id = () => String(++serial);
  const plantas = adicionarAutomaticamente([], "Alface de verão", d, 100, 200, 200, id);
  assert.equal(plantas.length, 32);
  assert.equal(areaOcupadaCm2(plantas), 32 * 25 * 25);
  for (const [indice, planta] of plantas.entries()) {
    assert.equal(posicaoValida(planta, plantas.filter((_, i) => i !== indice), 100, 200), true);
  }
  assert.equal(proximaPosicaoLivre(plantas, "Alface de verão", d, 100, 200), null);
  assert.deepEqual(resumirCulturas(plantas), [{ cultura: "Alface de verão", quantidade: 32 }]);

  serial = 0;
  const grande = adicionarAutomaticamente([], "Rabanete",
    dimensoesDaCultura(culturasOrganizador.Rabanete), 1000, 2000,
    50000, id);
  assert.equal(grande.length, LIMITE_PLANTAS);
});

test("canteiro e ferramenta estão integrados ao build e às rotas públicas", () => {
  const vite = readFileSync(resolve(raiz, "vite.config.js"), "utf8");
  const site = readFileSync(resolve(raiz, "horta/canteiros/index.html"), "utf8");
  const main = readFileSync(resolve(raiz, "src/main-conteudo.jsx"), "utf8");
  const generator = readFileSync(resolve(raiz, "scripts/gerar-artigos.mjs"), "utf8");
  assert.match(vite, /horta\/canteiros\/index\.html/);
  assert.match(site, /<h1>Planeje seu canteiro/);
  assert.match(site, /<div id="canteiro-visual-raiz"/);
  assert.match(main, /<OrganizadorHorta culturaSugerida=\{cultura\}/);
  assert.match(generator, /"\/horta\/canteiros\/"/);
});
