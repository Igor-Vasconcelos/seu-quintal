const numero = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 4 });

export function formatarMedida(valor) {
  return numero.format(valor);
}

function lerDecimal(texto) {
  if (typeof texto !== "string" || !/^\d+(?:[.,]\d{1,2})?$/.test(texto.trim())) return NaN;
  return Number(texto.replace(",", "."));
}

export function lerMedida(texto, minimo = 0.01) {
  const valor = lerDecimal(texto);
  return valor >= minimo && valor <= 10000 ? valor : null;
}

export function criarTerreno(frente, profundidade) {
  const largura = lerMedida(frente);
  const comprimento = lerMedida(profundidade);
  if (largura === null || comprimento === null) return null;
  return { largura, comprimento, area: largura * comprimento };
}

export function cabeNoTerreno(item, terreno) {
  // Compara centímetros inteiros para evitar imprecisão na soma de decimais.
  const emCentimetros = (metros) => Math.round(metros * 100);
  const temDimensoes = item.largura > 0 && item.comprimento > 0;
  const ePonto = item.largura === 0 && item.comprimento === 0;
  return item.x >= 0 && item.y >= 0 && (temDimensoes || ePonto)
    && emCentimetros(item.x) + emCentimetros(item.largura) <= emCentimetros(terreno.largura)
    && emCentimetros(item.y) + emCentimetros(item.comprimento) <= emCentimetros(terreno.comprimento);
}

export function sobrepoe(a, b) {
  const cm = (metros) => Math.round(metros * 100);
  return cm(a.x) < cm(b.x) + cm(b.largura)
    && cm(b.x) < cm(a.x) + cm(a.largura)
    && cm(a.y) < cm(b.y) + cm(b.comprimento)
    && cm(b.y) < cm(a.y) + cm(a.comprimento);
}

export function arredondarMedida(metros) {
  return Math.round(metros * 100) / 100;
}

export function limitarPosicao(x, y, item, terreno) {
  return {
    x: arredondarMedida(Math.max(0, Math.min(x, terreno.largura - item.largura))),
    y: arredondarMedida(Math.max(0, Math.min(y, terreno.comprimento - item.comprimento))),
  };
}

export function passoDaMalha(terreno) {
  const alvo = Math.max(terreno.largura, terreno.comprimento) / 8;
  const base = 10 ** Math.floor(Math.log10(alvo));
  return Number(([1, 2, 5, 10].find((passo) => passo * base >= alvo) * base).toPrecision(4));
}

export function distancia(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function pontosProximos(inicioA, tamanhoA, inicioB, tamanhoB) {
  const fimA = arredondarMedida(inicioA + tamanhoA);
  const fimB = arredondarMedida(inicioB + tamanhoB);
  if (fimA < inicioB) return [fimA, inicioB];
  if (fimB < inicioA) return [inicioA, fimB];
  const meio = (Math.max(inicioA, inicioB) + Math.min(fimA, fimB)) / 2;
  return [meio, meio];
}

export function pontosEntreBordas(a, b) {
  const [xA, xB] = pontosProximos(a.x, a.largura, b.x, b.largura);
  const [yA, yB] = pontosProximos(a.y, a.comprimento, b.y, b.comprimento);
  return [{ x: xA, y: yA }, { x: xB, y: yB }];
}
