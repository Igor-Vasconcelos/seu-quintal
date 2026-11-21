import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const raiz = resolve(import.meta.dirname, "..");
const conteudo = caminho => readFileSync(resolve(raiz, caminho), "utf8");

test("Cabeçalho global mantém os destinos essenciais e menu acessível", () => {
  const jsx=conteudo("src/components/Cabecalho.jsx");
  for (const rota of ["horta/", "guias/", "artigos/", "horta/canteiros/",
    "horta/organizador/", "horta/calendario-de-plantio/", "sisteminha.html", "meu-quintal/"]) {
    assert.ok(jsx.includes(rota), rota);
  }
  assert.match(jsx, /aria-expanded=\{aberto\}/);
  assert.match(jsx, /aria-controls=\{idMenu\}/);
  assert.match(jsx, /Escape/);
  assert.match(jsx, /pointerdown/);
  assert.match(jsx, /<summary/);
  assert.match(jsx, /aria-current/);
  assert.match(jsx, /Da primeira muda ao seu sítio/);
});

test("Rodapé organiza guias, ferramentas e mantém créditos e mapa do site", () => {
  const jsx=conteudo("src/components/Rodape.jsx");
  assert.match(jsx, /rodape-v3/);
  assert.match(jsx, /mapa-do-site\//);
  assert.match(jsx, /aoVerCreditos/);
  assert.match(jsx, /Voltar ao topo/);
  assert.match(jsx, /Meu Quintal/);
  assert.doesNotMatch(jsx, /target="_blank"/);
});

test("Camada visual global não altera estilos de cálculos ou editor SVG", () => {
  const css=conteudo("src/styles/site-shell.css");
  assert.match(css, /\.topo\.site-shell/);
  assert.match(css, /\.rodape\.rodape-v3/);
  assert.match(css, /max-width: 1030px/);
  assert.match(css, /max-width: 450px/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(css, /(?:^|\n)\s*(?:input|button|svg|\.planta-item)\s*\{/);
  assert.ok(conteudo("src/styles/tokens.css").includes("--sq-primary"));
});
