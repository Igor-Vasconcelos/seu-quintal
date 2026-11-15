import { cabeNoTerreno, criarTerreno, lerMedida } from "../src/features/planejador/geometria.js";

export function ehUuid(valor) {
  return typeof valor === "string" && valor.length === 36
    && /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(valor);
}

function medidaValida(valor, minimo = 0.01) {
  return typeof valor === "number" && lerMedida(String(valor), minimo) !== null;
}

export function validarPlanejamento(dados) {
  const nome = typeof dados?.nome === "string" ? dados.nome.trim() : "";
  if (!nome || nome.length > 80 || nome.includes("\0")) {
    return { erro: "Informe um nome com até 80 caracteres." };
  }

  const { largura, profundidade, itens } = dados;
  if (!medidaValida(largura) || !medidaValida(profundidade)) {
    return { erro: "Informe medidas entre 0,01 e 10.000 metros, com até duas casas decimais." };
  }
  if (!Array.isArray(itens)) return { erro: "Informe a lista de canteiros." };

  const terreno = criarTerreno(String(largura), String(profundidade));
  const ids = new Set();
  const canteiros = [];
  for (const item of itens) {
    if (!ehUuid(item?.id) || ids.has(item.id) ||
        !medidaValida(item.x, 0) || !medidaValida(item.y, 0) ||
        !medidaValida(item.largura) || !medidaValida(item.comprimento) ||
        !cabeNoTerreno(item, terreno)) {
      return { erro: "Cada canteiro precisa de medidas válidas, um ID único e uma posição dentro do terreno." };
    }

    const { id, x, y, largura, comprimento } = item;
    ids.add(id);
    canteiros.push({ id, x, y, largura, comprimento });
  }

  return { nome, largura, profundidade, itens: canteiros };
}
