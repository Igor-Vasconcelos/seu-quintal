import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { culturasOrganizador } from "../src/features/organizador/culturas.js";
import { especiesPomar } from "../src/features/pomar/geometriaPomar.js";
import { valorAlimentar, chaveAlimento, fontesAlimentacao } from "../src/data/valor-alimentar.js";
import { familiaBotanica, sugestoesRotacao, fonteRotacao } from "../src/features/organizador/rotacaoCulturas.js";

const read = path => readFileSync(resolve(import.meta.dirname, "..", path), "utf8");

test("todas as culturas do organizador têm texto alimentar específico", () => {
  for (const nome of Object.keys(culturasOrganizador)) {
    const texto = valorAlimentar(nome);
    assert.ok(texto?.descricao, "Sem informação para " + nome);
    assert.ok(texto.descricao.length > 24);
  }
  assert.equal(chaveAlimento("Alface de verão"), "Alface");
  assert.equal(chaveAlimento("Cenoura de inverno"), "Cenoura");
  assert.equal(chaveAlimento("Tomate de mesa"), "Tomate");
});

test("as frutíferas cadastradas têm orientação, sem inventar informação de espécies desconhecidas", () => {
  for (const especie of Object.values(especiesPomar)) {
    if (especie.nome.startsWith("Outra ")) continue;
    assert.ok(valorAlimentar(especie.nome)?.descricao, especie.nome);
  }
  assert.equal(valorAlimentar("Outra frutífera (configure)"), null);
  assert.equal(valorAlimentar("Produto inexistente"), null);
  assert.equal(valorAlimentar(null), null);
});

test("ovos, carnes e peixes descrevem nutrientes sem prometer tratamento", () => {
  for (const nome of ["Ovos de galinha", "Carne de frango", "Ovos de codorna", "Carne de codorna", "Peixes"]) {
    const descricao = valorAlimentar(nome)?.descricao;
    assert.match(descricao, /proteína/i, nome);
    assert.doesNotMatch(descricao, /cura|previne doenças|garante/i);
  }
  assert.match(fontesAlimentacao.tbca, /^https:/);
  assert.match(fontesAlimentacao.guia, /gov\.br/);
});

test("rotação só sugere famílias diferentes e não mistura variantes da mesma família", () => {
  assert.equal(familiaBotanica("Rabanete"), "Brassicaceae");
  assert.equal(familiaBotanica("Couve"), "Brassicaceae");
  assert.equal(familiaBotanica("Cenoura de verão"), "Apiaceae");
  assert.equal(familiaBotanica("Cultivo desconhecido"), null);
  assert.deepEqual(sugestoesRotacao(["Alface de verão","Alface de inverno"]), []);
  assert.deepEqual(sugestoesRotacao(null), []);
  const saida = sugestoesRotacao(["Alface de verão","Couve","Cenoura de verão","Tomate de mesa"]);
  assert.ok(saida.length > 0 && saida.length <= 3);
  for (const s of saida) assert.notEqual(s.familiaOrigem, s.familiaDestino);
  assert.match(fonteRotacao, /gov\.br/);
});

test("a ferramenta integra ensino nutricional nas áreas sem mudar armazenamento", () => {
  const componentes = [
    "src/features/organizador/PlanejamentoFamiliar.jsx",
    "src/features/organizador/FormularioCultivo.jsx",
    "src/features/organizador/PlanejadorVisualCanteiro.jsx",
    "src/features/organizador/OrganizadorHorta.jsx",
    "src/features/guias/GuiaHorta.jsx",
    "src/features/pomar/PlanejadorPomar.jsx",
    "src/components/Calendario.jsx",
    "src/features/galinheiro/Galinheiro.jsx",
    "src/features/codornas/CalculadoraCodornas.jsx",
    "src/features/peixes/CalculadoraPeixes.jsx",
  ];
  for (const path of componentes) assert.match(read(path), /ValorAlimentar/, path);
  const family = read("src/features/organizador/PlanejamentoFamiliar.jsx");
  assert.match(family, /sugestoesRotacao/);
  assert.match(family, /não reserva canteiros automaticamente/);
  assert.match(family, /Adicionar sugestões à minha agenda/);
  assert.match(read("src/data/catalogoFerramentas.js"), /Horta contínua/);
});
