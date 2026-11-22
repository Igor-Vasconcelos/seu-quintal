import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const raiz = resolve(import.meta.dirname, "..");
function ler(path) { return readFileSync(resolve(raiz, path), "utf8"); }

test("rodapé oferece três temas equilibrados com destinos reais", () => {
  const fonte = ler("src/components/Rodape.jsx");
  for (const titulo of ["Aprenda", "Planeje", "Cuide e organize"]) {
    assert.ok(fonte.includes('titulo: "' + titulo + '"'), titulo);
  }
  const rotas = [...fonte.matchAll(/\["[^"]+",\s*"([^"]+)"\]/g)].map(match => match[1]);
  assert.equal(rotas.length, 12);
  assert.equal(new Set(rotas).size, rotas.length);
  const grupos = fonte.split(/\{ titulo: "(?:Aprenda|Planeje|Cuide e organize)"/).slice(1);
  assert.ok(grupos.length >= 3);
  for (const grupo of grupos.slice(0, 3)) {
    assert.equal([...grupo.split("] }")[0].matchAll(/\["[^"]+",\s*"([^"]+)"\]/g)].length, 4);
  }
  for (const rota of rotas) {
    const arquivo = rota.endsWith(".html") ? rota : rota + "index.html";
    assert.ok(existsSync(resolve(raiz, arquivo)), "Link aponta para rota sem HTML: " + rota);
  }
  assert.match(fonte, /aria-current=\{atual \? "page" : undefined\}/);
  assert.match(fonte, /aria-label=\{grupo\.titulo\}/);
  assert.match(fonte, /rodape-v4\.css/);
});

test("ícones próprios do Meu Quintal não afetam símbolos técnicos já usados no editor", () => {
  const fonte = ler("src/features/quintal/MeuQuintal.jsx");
  const icones = ler("src/components/Icone.jsx");
  const ids = ["visao-quintal","terrenos-menu","canteiros-menu","agenda-menu","historico-menu"];
  for (const id of ids) {
    assert.ok(fonte.includes('icone: "' + id + '"'), "Seção sem ícone próprio: " + id);
    assert.ok(icones.includes('"' + id + '":'), "Ícone SVG inexistente: " + id);
  }
  assert.match(fonte, /<Icone nome="dados-locais"\/>/);
  assert.match(fonte, /<Icone nome="backup-menu"\/>/);
  assert.match(icones, /viewBox="0 0 24 24"/);
  for (const antigo of ["outros","planta","canteiro","calendario","historico"]) {
    assert.ok(icones.includes("  " + antigo + ":"), "Símbolo técnico removido: " + antigo);
  }
  assert.match(fonte, /aria-current=\{secao === id \? "location" : undefined\}/);
  assert.match(fonte, /aria-label=\{nome\}/);
});

test("grid e foco do rodapé e sidebar mantêm suporte a tablets e celulares", () => {
  const footer = ler("src/styles/rodape-v4.css");
  const sidebar = ler("src/styles/workspace-v3.css");
  assert.match(footer, /grid-template-columns: minmax\(17rem, 1\.4fr\) repeat\(3, minmax\(9rem, 1fr\)\)/);
  for (const breakpoint of ["1120px","767px","490px","360px"]) {
    assert.ok(footer.includes(breakpoint), "Não há ajuste do rodapé para " + breakpoint);
  }
  assert.match(footer, /:focus-visible/);
  assert.match(sidebar, /quintal-navegacao-icone \.icone/);
  assert.match(sidebar, /stroke-width: 1\.75/);
});
