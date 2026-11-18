import assert from "node:assert/strict";
import test from "node:test";
import { criarBackup, restaurarBackup, resumoBackup, validarBackup } from "../src/features/backup/backup.js";
import { chaveProjetos, migrarProjetos, criarRegistroTerreno } from "../src/features/planejador/projetos.js";
import { chaveHistorico } from "../src/features/backup/backup.js";
import { chaveOrganizador } from "../src/features/organizador/armazenamento.js";

function exemplo() {
  return {
    aplicacao: "seu-quintal",
    versao: 1,
    criadoEm: "2026-11-18T16:00:00.000Z",
    dados: {
      projetos: {
        ultimoTerreno: { largura: 20, comprimento: 30, area: 600 },
        terrenos: {
          "20x30": {
            ativo: "inicio", estrada: true, declive: "direita",
            cenarios: [{ id: "inicio", nome: "Principal", itens: [
              { id: "horta-1", tipo: "horta", nome: "Horta", existente: false,
                x: 1, y: 1, largura: 4, comprimento: 6 },
            ] }],
          },
        },
      },
      historico: [{
        id: "cultivo-1", area: "Canteiro 1", cultura: "Alface",
        plantio: "2026-11-01", colheita: "", quantidade: null,
        unidade: "kg", observacoes: "",
      }],
      organizador: { regiao: "Sudeste", area: null, planos: [] },
    },
  };
}

function ambienteLocal(t) {
  const dados = new Map();
  globalThis.window = {
    localStorage: {
      getItem: (chave) => dados.get(chave) ?? null,
      setItem: (chave, valor) => dados.set(chave, valor),
      removeItem: (chave) => dados.delete(chave),
    },
  };
  t.after(() => delete globalThis.window);
  return dados;
}

test("aceita um arquivo compatível com terrenos e histórico", () => {
  const pacote = exemplo();
  assert.equal(validarBackup(pacote), pacote);
  assert.deepEqual(resumoBackup(pacote), {
    terrenos: 1, cenarios: 1, registros: 1, planos: 0,
  });
});

test("bloqueia versões incompatíveis e arquivos que não são do Seu Quintal", () => {
  const pacote = exemplo();
  assert.throws(() => validarBackup({ ...pacote, versao: 999 }), /versão/i);
  assert.throws(() => validarBackup({ ...pacote, aplicacao: "outro" }), /Seu Quintal/);
});

test("rejeita backups com área do terreno inconsistente", () => {
  const pacote = exemplo();
  pacote.dados.projetos.ultimoTerreno.area = 1;
  assert.throws(() => validarBackup(pacote), /último terreno/i);
});

test("recusa posições inválidas, sem truncar os dados importados", () => {
  const pacote = exemplo();
  pacote.dados.projetos.terrenos["20x30"].cenarios[0].itens[0].x = 19;
  assert.throws(() => validarBackup(pacote), /item do planejador/i);
});

test("recusa histórico e planos de horta inválidos", () => {
  const pacote = exemplo();
  pacote.dados.historico[0].unidade = "inexistente";
  assert.throws(() => validarBackup(pacote), /histórico/i);
  const outro = exemplo();
  outro.dados.organizador.planos.push({ id: "a", cultura: "inventada", canteiro: "", concluidas: [] });
  assert.throws(() => validarBackup(outro), /organizador/i);
});

test("restaura terrenos, histórico e organizador no navegador e permite exportar novamente", async (t) => {
  const dados = ambienteLocal(t);
  const pacote = exemplo();
  await restaurarBackup(pacote);
  assert.deepEqual(JSON.parse(dados.get(chaveProjetos)), migrarProjetos(pacote.dados.projetos));
  assert.deepEqual(JSON.parse(dados.get(chaveHistorico)), pacote.dados.historico);
  assert.deepEqual(JSON.parse(dados.get(chaveOrganizador)), pacote.dados.organizador);
  const reexportado = await criarBackup();
  assert.equal(reexportado.versao, 2);
  assert.deepEqual(reexportado.dados.projetos, migrarProjetos(pacote.dados.projetos));
  assert.deepEqual(reexportado.dados.historico, pacote.dados.historico);
  assert.deepEqual(reexportado.dados.organizador, pacote.dados.organizador);
});

test("restaura valores anteriores se o navegador falhar durante a importação", async (t) => {
  const dados = ambienteLocal(t);
  const originais = new Map([
    [chaveHistorico, JSON.stringify([])],
    [chaveOrganizador, JSON.stringify({ regiao: "Sudeste", area: null, planos: [] })],
  ]);
  for (const [chave, valor] of originais) dados.set(chave, valor);
  const setItem = window.localStorage.setItem;
  let falhar = true;
  window.localStorage.setItem = (chave, valor) => {
    if (chave === chaveOrganizador && falhar) {
      falhar = false;
      throw new Error("Sem espaço");
    }
    setItem(chave, valor);
  };
  await assert.rejects(restaurarBackup(exemplo()), /Sem espaço/);
  assert.deepEqual([...dados], [...originais]);
});

test("backup v2 guarda terrenos distintos com as mesmas medidas e nomes próprios", () => {
  const pacote = exemplo();
  const medidas = { largura: 35, comprimento: 65, area: 2275 };
  const primeiro = criarRegistroTerreno(medidas, "Chácara da família", "terreno-1");
  const segundo = criarRegistroTerreno(medidas, "Área de produção", "terreno-2");
  pacote.versao = 2;
  pacote.dados.projetos = {
    versao: 2, terrenoAtivo: "terreno-2",
    terrenos: { "terreno-1": primeiro, "terreno-2": segundo },
  };
  assert.equal(validarBackup(pacote), pacote);
  assert.deepEqual(resumoBackup(pacote), {
    terrenos: 2, cenarios: 2, registros: 1, planos: 0,
  });
});

test("rejeita backup v2 com ID ou área incoerentes", () => {
  const pacote = exemplo();
  pacote.versao = 2;
  const medidas = { largura: 35, comprimento: 65, area: 2275 };
  pacote.dados.projetos = {
    versao: 2, terrenoAtivo: "um",
    terrenos: { um: criarRegistroTerreno(medidas, "Chácara", "outro") },
  };
  assert.throws(() => validarBackup(pacote), /identificação/i);
  pacote.dados.projetos.terrenos.um.id = "um";
  pacote.dados.projetos.terrenos.um.medidas.area = 1;
  assert.throws(() => validarBackup(pacote), /medidas ou área/i);
});
