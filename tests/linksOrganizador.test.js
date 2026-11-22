import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function ler(arquivo) {
  return readFileSync(resolve(import.meta.dirname, "..", arquivo), "utf8");
}

test("dica dos canteiros aponta para a rota certa em cada contexto", () => {
  const codigo = ler("src/features/organizador/PlanejadorVisualCanteiro.jsx");
  assert.match(codigo, /pathname\.includes\("\/meu-quintal\/"\)/);
  assert.match(codigo, /"\.\.\/horta\/organizador\/#planejamento-familiar"/);
  assert.match(codigo, /"\.\.\/organizador\/#planejamento-familiar"/);
  // Um caminho relativo à página de canteiros não serve dentro de Meu Quintal.
  const urlQuintal = new URL("../horta/organizador/#planejamento-familiar",
    "https://exemplo.com/seu-quintal/meu-quintal/");
  const urlCanteiro = new URL("../organizador/#planejamento-familiar",
    "https://exemplo.com/seu-quintal/horta/canteiros/");
  assert.equal(urlQuintal.pathname, "/seu-quintal/horta/organizador/");
  assert.equal(urlCanteiro.pathname, "/seu-quintal/horta/organizador/");
  assert.equal(urlQuintal.hash, "#planejamento-familiar");
  assert.equal(urlCanteiro.hash, "#planejamento-familiar");
});

test("organizador mantém a seção de planejamento familiar com abertura após o carregamento", () => {
  const codigo = ler("src/features/organizador/PlanejamentoFamiliar.jsx");
  assert.match(codigo, /id="planejamento-familiar"/);
  assert.match(codigo, /detalhe\.open = true/);
  assert.match(codigo, /scrollIntoView/);
  assert.match(codigo, /hashchange/);
  assert.match(ler("horta/organizador/index.html"), /id="organizador-raiz"/);
});

test("URL antiga possui redirecionamento de compatibilidade sem conteúdo duplicado", () => {
  const html = ler("public/organizador/index.html");
  assert.match(html, /noindex, follow/);
  assert.match(html, /rel="canonical"/);
  assert.match(html, /\.\.\/horta\/organizador\//);
  assert.match(html, /window\.location\.search \+ window\.location\.hash/);
  assert.match(html, /href="\.\.\/horta\/organizador\/#planejamento-familiar"/);
});
