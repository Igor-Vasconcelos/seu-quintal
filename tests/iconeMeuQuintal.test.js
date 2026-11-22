import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const fonte = (path) => readFileSync(resolve(import.meta.dirname, "..", path), "utf8");

test("ícone do Meu Quintal é SVG próprio com casa, horta, muda e caminho", () => {
  const svg = fonte("src/components/Icone.jsx");
  const inicio = svg.indexOf('  "meu-quintal": <>');
  const fim = svg.indexOf('  </>,', inicio);
  assert.ok(inicio >= 0 && fim > inicio);
  const desenho = svg.slice(inicio, fim);
  assert.ok((desenho.match(/<path /g) ?? []).length >= 7);
  assert.match(desenho, /<rect /); // janela da casa
  assert.match(desenho, /11\.5 20\.5/); // início do caminho
  assert.match(desenho, /6\.7 18\.8/); // muda
  assert.match(svg, /viewBox="0 0 24 24"/);
  assert.match(svg, /aria-hidden="true"/);
  assert.match(svg, /  planta: <>/); // a planta técnica do terreno não foi removida
});

test("acessos do Meu Quintal usam o novo ícone sem modificar as rotas", () => {
  const cabecalho = fonte("src/components/Cabecalho.jsx");
  const home = fonte("src/App.jsx");
  const rodape = fonte("src/components/Rodape.jsx");
  const painel = fonte("src/features/quintal/VisaoGeralQuintal.jsx");
  assert.match(cabecalho, /<Icone nome="meu-quintal"\/> Meu Quintal/);
  assert.match(cabecalho, /href=\{noPainel \? "#geral" : raiz \+ "meu-quintal\/"\}/);
  assert.match(home, /home-meu-quintal-emblema" aria-hidden="true"/);
  assert.match(home, /<Icone nome="meu-quintal" \/>/);
  assert.match(home, /href="\.\/meu-quintal\/"/);
  assert.match(rodape, /rota === "meu-quintal\/" && <Icone nome="meu-quintal"\/>/);
  assert.match(painel, /quintal-ultimo-icone" aria-hidden="true"><Icone nome="meu-quintal"\/>/);
  assert.match(painel, /quintal-projeto-icone"><Icone nome="planta"\/>/);
});

test("emblema de destaque tem contraste, proporção e ícone legível no botão", () => {
  const homeCss = fonte("src/styles/home-editorial-v2.css");
  const navCss = fonte("src/styles/site-shell.css");
  assert.match(homeCss, /\.home-meu-quintal-emblema/);
  assert.match(homeCss, /border-radius: 50%/);
  assert.match(homeCss, /background: var\(--sq-brand-100\)/);
  assert.match(homeCss, /color: var\(--sq-forest\)/);
  assert.match(navCss, /\.menu-quintal \.icone \{ width: 1\.32rem; height: 1\.32rem;/);
});
