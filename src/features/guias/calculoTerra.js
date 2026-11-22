/**
 * Volume geométrico de um recipiente retangular.
 * Usa centésimos de centímetro inteiros para evitar arredondamentos na
 * quantidade de sacos; não calcula densidade nem recomendação de substrato.
 */
const LIMITE = 10000;

function numeroBr(valor, casas) {
  if (typeof valor !== "string") return null;
  const texto = valor.trim();
  if (!new RegExp(`^\\d+(?:[.,]\\d{1,${casas}})?$`).test(texto)) return null;
  const numero = Number(texto.replace(",", "."));
  return Number.isFinite(numero) && numero > 0 && numero <= LIMITE ? numero : null;
}

export function validarMedidaTerra(texto, unidade) {
  const numero = numeroBr(texto, unidade === "m" ? 4 : 2);
  if (numero === null) return null;
  if (numero < (unidade === "m" ? 0.0001 : 0.01)) return null;
  return numero;
}

export function converterMedidaTerra(texto, origem, destino) {
  if (!texto?.trim() || origem === destino) return texto;
  const medida = validarMedidaTerra(texto, origem);
  if (medida === null) return texto;
  const convertida = origem === "cm" ? medida / 100 : medida * 100;
  const casas = destino === "m" ? 4 : 2;
  return Number(convertida.toFixed(casas)).toString().replace(".", ",");
}

export function calcularTerra(valores, unidade) {
  if (!["cm", "m"].includes(unidade)) return { invalidos: ["unidade"], resultado: null };
  const medidas = ["comprimento", "largura", "profundidade"];
  const numeros = medidas.map(nome => validarMedidaTerra(valores[nome] ?? "", unidade));
  const sacoInformado = Boolean((valores.saco ?? "").trim());
  const saco = sacoInformado ? numeroBr(valores.saco, 2) : null;
  const invalidos = medidas.filter((_, indice) => numeros[indice] === null);
  if (sacoInformado && saco === null) invalidos.push("saco");
  if (invalidos.length) return { invalidos, resultado: null };

  const fator = unidade === "m" ? 10000 : 100;
  const volume = numeros.map(n => BigInt(Math.round(n * fator)))
    .reduce((produto, n) => produto * n, 1n);
  const tamanhoSaco = saco === null ? null : BigInt(Math.round(saco * 100)) * 10000000n;
  const quantidade = tamanhoSaco === null ? null : (volume + tamanhoSaco - 1n) / tamanhoSaco;
  return {
    invalidos: [],
    resultado: { litros: Number(volume) / 1e9, quantidade },
  };
}
