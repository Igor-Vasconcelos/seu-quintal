import assert from "node:assert/strict";
import test from "node:test";
import {
  chaveProjetos, criarRegistroTerreno, lerProjetos, migrarProjetos, novoId,
  nomeDoTerreno, projetoInicial, salvarProjetos,
} from "../src/features/planejador/projetos.js";

const medidas = { largura: 35, comprimento: 65, area: 2275 };

function legado() {
  return {
    ultimoTerreno: medidas,
    terrenos: {
      "35x65": {
        ativo: "cenario-fazenda", estrada: true, declive: "direita",
        cenarios: [{
          id: "cenario-fazenda", nome: "Plantio atual",
          itens: [{
            id: "arvore-1", nome: "Goiabeira", tipo: "muda",
            x: 3, y: 4, largura: 0, comprimento: 0, existente: true,
          }],
        }],
      },
      "20x30": { ...projetoInicial },
    },
  };
}

test("migra terrenos legados com IDs estáveis, sem perder cenários e árvores", () => {
  const antigo = legado();
  const primeiro = migrarProjetos(antigo);
  const segundo = migrarProjetos(antigo);
  assert.equal(primeiro.versao, 2);
  assert.equal(primeiro.terrenoAtivo, "legado-35x65");
  assert.deepEqual(primeiro, segundo);
  assert.equal(Object.keys(primeiro.terrenos).length, 2);
  assert.deepEqual(primeiro.terrenos["legado-35x65"].medidas, medidas);
  assert.deepEqual(
    primeiro.terrenos["legado-35x65"].projeto.cenarios[0].itens,
    antigo.terrenos["35x65"].cenarios[0].itens,
  );
  assert.equal(primeiro.terrenos["legado-35x65"].projeto.declive, "direita");
  assert.equal(migrarProjetos(primeiro), primeiro);
});

test("cria dois terrenos independentes com as mesmas medidas", () => {
  const primeiro = criarRegistroTerreno(medidas, "Chácara", "t-1");
  const segundo = criarRegistroTerreno(medidas, "Chácara", "t-2");
  assert.notEqual(primeiro.id, segundo.id);
  assert.deepEqual(primeiro.medidas, segundo.medidas);
  primeiro.projeto.cenarios[0].itens.push({ id: "canteiro-1" });
  assert.equal(segundo.projeto.cenarios[0].itens.length, 0);
});

test("usa nome padrão quando nenhum nome é informado", () => {
  assert.equal(nomeDoTerreno("  Minha    chácara  ", medidas), "Minha chácara");
  assert.match(nomeDoTerreno("   ", medidas), /35 × 65 m/);
  assert.equal(typeof novoId(), "string");
});

test("salva e reabre a versão 2 sem modificar os dados", (t) => {
  const itens = new Map();
  globalThis.window = {
    localStorage: {
      getItem: (chave) => itens.get(chave) ?? null,
      setItem: (chave, valor) => itens.set(chave, valor),
    },
  };
  t.after(() => delete globalThis.window);
  itens.set(chaveProjetos, JSON.stringify(legado()));
  const dados = lerProjetos();
  dados.terrenos["novo-id"] = criarRegistroTerreno(medidas, "Segundo terreno", "novo-id");
  dados.terrenoAtivo = "novo-id";
  assert.equal(salvarProjetos(dados), true);
  assert.deepEqual(lerProjetos(), dados);
});

test("migra o IndexedDB antigo ao salvar sem perder as áreas existentes", async (t) => {
  let salvoNoBanco = legado();
  const banco = {
    transaction() {
      const transacao = {
        oncomplete: null, onabort: null, error: null,
        objectStore() {
          return {
            get() {
              const pedido = { result: null, onsuccess: null };
              queueMicrotask(() => {
                pedido.result = salvoNoBanco;
                pedido.onsuccess();
                queueMicrotask(() => transacao.oncomplete?.());
              });
              return pedido;
            },
            put(dados) { salvoNoBanco = dados; },
          };
        },
      };
      return transacao;
    },
  };
  globalThis.window = {
    indexedDB: {
      open() {
        const pedido = { result: banco, onsuccess: null, onerror: null };
        queueMicrotask(() => pedido.onsuccess());
        return pedido;
      },
    },
    localStorage: {
      getItem: () => null,
      setItem: () => {},
    },
  };
  t.after(() => delete globalThis.window);
  const { lerProjetosSalvos, gravarProjetosSalvos } =
    await import("../src/features/planejador/bancoProjetos.js");
  const antes = await lerProjetosSalvos();
  assert.equal(antes.terrenoAtivo, "legado-35x65");
  assert.equal(antes.terrenos["legado-35x65"].projeto.cenarios[0].itens[0].nome, "Goiabeira");

  const novo = criarRegistroTerreno(medidas, "Outro sítio", "novo-uuid");
  const gravacao = await gravarProjetosSalvos((dados) => ({
    dados: {
      ...dados,
      terrenoAtivo: novo.id,
      terrenos: { ...dados.terrenos, [novo.id]: novo },
    },
  }));
  assert.equal(gravacao.salvo, true);
  assert.equal(salvoNoBanco.versao, 2);
  assert.equal(Object.keys(salvoNoBanco.terrenos).length, 3);
  assert.equal(salvoNoBanco.terrenos["legado-35x65"].projeto.cenarios[0].itens[0].nome, "Goiabeira");
});
