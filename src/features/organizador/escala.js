import { consultarPlantio, descreverEpocaPlantio } from "../../data/plantio.js";
import { lerMedida } from "../planejador/geometria.js";
import { culturasOrganizador } from "./culturas.js";

const msDia = 86_400_000;
const formatador = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", timeZone: "UTC" });
const formatadorComAno = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
const formatoCivil = (data) => Date.parse(`${data}T00:00:00Z`);

export function hojeCivil() {
  const hoje = new Date();
  return [hoje.getFullYear(), hoje.getMonth() + 1, hoje.getDate()].map((n) => String(n).padStart(2, "0")).join("-");
}

export function dataValida(data) {
  if (typeof data !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
  const ms = formatoCivil(data);
  return Number.isFinite(ms) && new Date(ms).toISOString().slice(0, 10) === data;
}

export function avancarDias(data, dias) {
  return new Date(formatoCivil(data) + dias * msDia).toISOString().slice(0, 10);
}

function diferencaDias(a, b) {
  return (formatoCivil(b) - formatoCivil(a)) / msDia;
}

export function rotuloData(data) {
  const formato = Number(data.slice(0, 4)) === new Date().getFullYear() ? formatador : formatadorComAno;
  return formato.format(new Date(formatoCivil(data))).replace(".", "");
}

export function janelaDeDatas(de, ate) {
  if (de === ate) return rotuloData(de);
  return `${rotuloData(de)} a ${rotuloData(ate)}`;
}

function semanasValidas(valor, maximo) {
  return Number.isInteger(valor) && valor >= 1 && valor <= maximo;
}

export function formularioInicial(plano) {
  const iniciais = {
    cultura: "Alface de verão", origem: "semente", inicio: hojeCivil(), canteiro: "",
    casa: 4, venda: 0, intervalo: 1, rendimento: null, duracao: null, teste: 2,
  };
  return Object.entries(iniciais).reduce((campos, [nome, valorInicial]) => {
    const valor = plano?.[nome] ?? valorInicial;
    campos[nome] = typeof valor === "number" ? String(valor).replace(".", ",") : valor ?? "";
    return campos;
  }, {});
}

export function lerPlano(campos) {
  if (!Object.hasOwn(culturasOrganizador, campos.cultura)) return { erro: "Escolha uma cultura." };
  const ficha = culturasOrganizador[campos.cultura];
  const casa = lerMedida(campos.casa || "0", 0);
  const venda = lerMedida(campos.venda || "0", 0);
  const intervalo = Number(campos.intervalo);
  if (!dataValida(campos.inicio)) return { erro: "Informe uma data de início válida." };
  if (casa === null || venda === null || casa + venda <= 0) {
    return { erro: "Informe uma meta semanal para a casa, para venda ou para as duas." };
  }
  if (!semanasValidas(intervalo, 52)) return { erro: "Informe um intervalo inteiro de 1 a 52 semanas." };

  const rendimento = ficha.colheitasSucessivas && campos.rendimento !== "" ? lerMedida(campos.rendimento) : null;
  const duracao = ficha.colheitasSucessivas && campos.duracao !== "" ? Number(campos.duracao) : null;
  const teste = ficha.colheitasSucessivas ? Number(campos.teste) : 2;
  if (ficha.colheitasSucessivas) {
    if (campos.rendimento !== "" && rendimento === null) return { erro: "Informe um rendimento maior que zero." };
    if (duracao !== null && !semanasValidas(duracao, 104)) {
      return { erro: "Informe de 1 a 104 semanas de colheita ou deixe a duração em branco." };
    }
    if (!rendimento && (!Number.isSafeInteger(teste) || teste < 1)) {
      return { erro: "Informe quantas plantas serão usadas no lote de teste." };
    }
  }

  return {
    plano: {
      cultura: campos.cultura, origem: ficha.mudas && campos.origem === "muda" ? "muda" : "semente",
      inicio: campos.inicio, canteiro: campos.canteiro.trim(), casa, venda, intervalo,
      rendimento, duracao, teste: rendimento ? 2 : teste,
    },
  };
}

function fases(plano) {
  const ficha = culturasOrganizador[plano.cultura];
  const viveiro = (plano.origem === "semente" && ficha.mudas) || [0, 0];
  return { ficha, viveiro, intervaloDias: plano.intervalo * 7 };
}

export function dimensionarLote(plano) {
  const { ficha, viveiro, intervaloDias } = fases(plano);
  const metaLote = (Math.round(plano.casa * 100) + Math.round(plano.venda * 100)) * plano.intervalo / 100;
  const experimental = Boolean(ficha.colheitasSucessivas && !plano.rendimento);
  const plantas = experimental ? plano.teste : Math.ceil(metaLote / (plano.rendimento ?? 1) - 1e-9);
  const areaLote = plantas * ficha.espaco[0] * ficha.espaco[1];
  const diasCanteiro = ficha.canteiro[1] + (viveiro[1] - viveiro[0]) + (plano.duracao ?? 0) * 7;
  return {
    metaLote, plantas, experimental,
    areaSimultanea: areaLote * Math.ceil(diasCanteiro / intervaloDias),
  };
}

export function situacaoDoPlantio(plano, regiao, de, ate) {
  const primeira = consultarPlantio(regiao, Number(de.slice(5, 7))).includes(plano.cultura);
  const ultima = de.slice(0, 7) === ate.slice(0, 7)
    ? primeira : consultarPlantio(regiao, Number(ate.slice(5, 7))).includes(plano.cultura);
  if (primeira && ultima) return "";
  const epoca = descreverEpocaPlantio(plano.cultura, regiao);
  if (epoca.startsWith("Sem indicação")) return epoca;
  if (primeira || ultima) return "Parte da janela de entrada no canteiro está fora da época de referência.";
  return "Entrada no canteiro fora da época de referência.";
}

export function projetarLote(plano, indice) {
  const { ficha, viveiro, intervaloDias } = fases(plano);
  const inicio = avancarDias(plano.inicio, indice * intervaloDias);
  const canteiro = { de: avancarDias(inicio, viveiro[0]), ate: avancarDias(inicio, viveiro[1]) };
  const colheita = {
    de: avancarDias(canteiro.de, ficha.canteiro[0]),
    ate: avancarDias(canteiro.ate, ficha.canteiro[1]),
  };
  const etapas = [];
  if (plano.origem === "semente") {
    etapas.push({ id: "semear", nome: ficha.mudas ? "Semear na bandeja" : "Semear no canteiro", de: inicio, ate: inicio });
  }
  if (ficha.mudas) {
    etapas.push({ id: "transplantar", nome: "Transplantar mudas", ...canteiro });
  }
  etapas.push({ id: "colher", nome: ficha.colheitasSucessivas ? "Iniciar a colheita" : "Colher", ...colheita });
  return { inicio, numero: indice + 1, canteiro, colheita, etapas };
}

export function lotesNoPeriodo(plano, de, ate) {
  const { ficha, viveiro, intervaloDias } = fases(plano);
  const maxDias = viveiro[1] + ficha.canteiro[1];
  const primeiro = Math.max(0, Math.ceil((diferencaDias(plano.inicio, de) - maxDias) / intervaloDias));
  const ultimo = Math.floor(diferencaDias(plano.inicio, ate) / intervaloDias);
  return Array.from({ length: Math.max(0, ultimo - primeiro + 1) }, (_, i) => projetarLote(plano, primeiro + i));
}

export function atividadesNoPeriodo(planos, de, ate) {
  return planos.flatMap((plano) => lotesNoPeriodo(plano, de, ate).flatMap((lote) => lote.etapas
    .filter((etapa) => etapa.de <= ate && etapa.ate >= de)
    .map((etapa) => ({
      ...etapa, plano, canteiro: lote.canteiro, numero: lote.numero, chave: `${lote.inicio}/${etapa.id}`,
    }))))
    .sort((a, b) => a.de.localeCompare(b.de) || a.plano.cultura.localeCompare(b.plano.cultura, "pt-BR"));
}
