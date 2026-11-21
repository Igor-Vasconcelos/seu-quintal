import { culturasOrganizador } from "./culturas.js";
import { LIMITE_PLANTAS, dimensoesDaCultura, posicaoValida } from "./canteiroGeometria.js";

// Rascunho isolado. Não altera as chaves legadas do Organizador de Horta nem do Meu Quintal.
export const CHAVE_CANTEIRO = "seu-quintal:rascunho-canteiro:v1";
export const MEDIDAS_INICIAIS = Object.freeze({ largura: 120, comprimento: 240 });

export function validarRascunho(dados) {
  if (!dados || dados.versao !== 1 || !dados.medidas || !Array.isArray(dados.plantas)) return null;
  const { largura, comprimento } = dados.medidas;
  if (!Number.isInteger(largura) || !Number.isInteger(comprimento) ||
    largura < 30 || largura > 1000 || comprimento < 30 || comprimento > 2000 ||
    dados.plantas.length > LIMITE_PLANTAS) return null;
  const plantas = [];
  const ids = new Set();
  for (const planta of dados.plantas) {
    const ficha = culturasOrganizador[planta?.cultura];
    const dimensoes = dimensoesDaCultura(ficha);
    const girado = dimensoes && dimensoesDaCultura(ficha, true);
    const dimensoesCorretas = dimensoes && (
      (planta.largura === dimensoes.largura && planta.comprimento === dimensoes.comprimento) ||
      (planta.largura === girado.largura && planta.comprimento === girado.comprimento)
    );
    if (!dimensoesCorretas || typeof planta.id !== "string" || planta.id.length > 80 ||
      ids.has(planta.id) || !Number.isFinite(planta.x) || !Number.isFinite(planta.y) ||
      !posicaoValida(planta, plantas, largura, comprimento)) return null;
    ids.add(planta.id);
    plantas.push({ id: planta.id, cultura: planta.cultura, x: planta.x, y: planta.y,
      largura: planta.largura, comprimento: planta.comprimento });
  }
  return { medidas: { largura, comprimento }, plantas };
}

export function lerRascunho(storage = window.localStorage) {
  try {
    const texto = storage.getItem(CHAVE_CANTEIRO);
    return texto ? validarRascunho(JSON.parse(texto)) : null;
  } catch {
    return null;
  }
}

export function gravarRascunho(dados, storage = window.localStorage) {
  const validado = validarRascunho({ ...dados, versao: 1 });
  if (!validado) throw new Error("Dados do canteiro inválidos.");
  storage.setItem(CHAVE_CANTEIRO, JSON.stringify({ ...validado, versao: 1 }));
}
