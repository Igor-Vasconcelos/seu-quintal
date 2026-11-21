/*
 * Núcleo geométrico do canteiro visual.
 * Medidas internas em centímetros; as dimensões vêm de culturasOrganizador.
 * Espaçamento é uma reserva retangular por planta, não diâmetro real da copa.
 */
export const LIMITE_PLANTAS = 220;
export const PASSO_MOVIMENTO_CM = 5;

export function cm(metros) {
  return Math.round(metros * 100);
}

export function dimensoesDaCultura(ficha, girado = false) {
  if (!ficha || !Array.isArray(ficha.espaco) || ficha.espaco.length !== 2) return null;
  const medidas = ficha.espaco.map(cm);
  if (medidas.some(n => !Number.isFinite(n) || n <= 0)) return null;
  return girado ? { largura: medidas[1], comprimento: medidas[0] } :
    { largura: medidas[0], comprimento: medidas[1] };
}

export function capacidadeHomogenea(larguraCm, comprimentoCm, dimensoes) {
  if (![larguraCm, comprimentoCm, dimensoes?.largura, dimensoes?.comprimento]
    .every(n => Number.isFinite(n) && n > 0)) return 0;
  return Math.floor(larguraCm / dimensoes.largura) *
    Math.floor(comprimentoCm / dimensoes.comprimento);
}

export function cabeNoCanteiro(planta, larguraCm, comprimentoCm) {
  return planta.x - planta.largura / 2 >= -1e-6 &&
    planta.y - planta.comprimento / 2 >= -1e-6 &&
    planta.x + planta.largura / 2 <= larguraCm + 1e-6 &&
    planta.y + planta.comprimento / 2 <= comprimentoCm + 1e-6;
}

export function entraEmConflito(a, b) {
  const distanciaX = Math.abs(a.x - b.x);
  const distanciaY = Math.abs(a.y - b.y);
  return distanciaX < (a.largura + b.largura) / 2 - 1e-6 &&
    distanciaY < (a.comprimento + b.comprimento) / 2 - 1e-6;
}

export function posicaoValida(planta, plantas, larguraCm, comprimentoCm, ignorarId = null) {
  return cabeNoCanteiro(planta, larguraCm, comprimentoCm) &&
    !plantas.some(outra => outra.id !== ignorarId && entraEmConflito(planta, outra));
}

// Retorna a primeira posição livre na malha da cultura, sem mover plantas existentes.
export function proximaPosicaoLivre(plantas, cultura, dimensoes, larguraCm, comprimentoCm) {
  if (!dimensoes || capacidadeHomogenea(larguraCm, comprimentoCm, dimensoes) === 0) return null;
  const maxY = comprimentoCm - dimensoes.comprimento / 2;
  const maxX = larguraCm - dimensoes.largura / 2;
  for (let y = dimensoes.comprimento / 2; y <= maxY + 1e-6; y += dimensoes.comprimento) {
    for (let x = dimensoes.largura / 2; x <= maxX + 1e-6; x += dimensoes.largura) {
      const candidata = { cultura, x, y, ...dimensoes };
      if (posicaoValida(candidata, plantas, larguraCm, comprimentoCm)) return candidata;
    }
  }
  return null;
}

export function adicionarAutomaticamente(plantas, cultura, dimensoes, larguraCm, comprimentoCm,
  quantidade, criarId) {
  const total = Math.min(Math.max(0, Math.floor(quantidade)), LIMITE_PLANTAS - plantas.length);
  const adicionadas = [];
  for (let i = 0; i < total; i++) {
    const posicao = proximaPosicaoLivre([...plantas, ...adicionadas], cultura, dimensoes,
      larguraCm, comprimentoCm);
    if (!posicao) break;
    adicionadas.push({ ...posicao, id: criarId() });
  }
  return adicionadas;
}

export function areaOcupadaCm2(plantas) {
  return plantas.reduce((acumulada, planta) =>
    acumulada + planta.largura * planta.comprimento, 0);
}

export function resumirCulturas(plantas) {
  const contagem = new Map();
  for (const planta of plantas) contagem.set(planta.cultura, (contagem.get(planta.cultura) || 0) + 1);
  return [...contagem.entries()].map(([cultura, quantidade]) => ({ cultura, quantidade }));
}
