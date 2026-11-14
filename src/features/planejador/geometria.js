const numero = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 4 });

export function formatarMedida(valor) {
  return numero.format(valor);
}

function lerDecimal(texto) {
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(texto.trim())) return NaN;
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
  return item.x >= 0 && item.y >= 0 && item.largura > 0 && item.comprimento > 0
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
