// Simulador de piscicultura: matemática geométrica e hipóteses do usuário.
// Não converte volume em "lotação segura" sem densidade de projeto e checagens.
// Fontes técnicas: Embrapa Ater+ Digital (manejo alimentar / densidade) e Sisteminha.
export const fontesPeixes = [
  { nome: "Embrapa — Manejo alimentar e densidade de peixes", url: "https://www.atermaisdigital.cnptia.embrapa.br/web/peixes/manejo-alimentar-e-nutricao1" },
  { nome: "Embrapa — Sisteminha, módulo tanque de peixes", url: "https://www.infoteca.cnptia.embrapa.br/handle/doc/1111791" },
];

export const especiesPeixes = [
  { id: "tilapia", nome: "Tilápia" },
  { id: "tambaqui", nome: "Tambaqui" },
  { id: "carpa", nome: "Carpa" },
  { id: "outra", nome: "Outra espécie" },
];

function valido(valor, minimo, maximo, inteiro = false) {
  const n = typeof valor === "number" ? valor :
    typeof valor === "string" && /^\d+(?:[,.]\d{1,3})?$/.test(valor.trim())
      ? Number(valor.trim().replace(",", ".")) : NaN;
  return Number.isFinite(n) && n >= minimo && n <= maximo && (!inteiro || Number.isInteger(n)) ? n : null;
}

export function estimarPeixes(dados) {
  if (!dados || !especiesPeixes.some(e => e.id === dados.especie)) return null;
  if (!["circular", "retangular"].includes(dados.formato)) return null;
  const profundidade = valido(dados.profundidade, .1, 30);
  const largura = dados.formato === "retangular" ? valido(dados.largura, .1, 1000) : null;
  const comprimento = dados.formato === "retangular" ? valido(dados.comprimento, .1, 1000) : null;
  const diametro = dados.formato === "circular" ? valido(dados.diametro, .1, 1000) : null;
  const quantidade = valido(dados.quantidade, 1, 100000, true);
  const inicial = valido(dados.pesoInicialGramas, 1, 30000);
  const final = valido(dados.pesoFinalGramas, 1, 30000);
  const sobrevivencia = valido(dados.sobrevivencia, 1, 100);
  const conversao = valido(dados.conversaoAlimentar, .5, 10);
  if ([profundidade, quantidade, inicial, final, sobrevivencia, conversao].some(x => x === null)
    || (dados.formato === "circular" ? diametro === null : largura === null || comprimento === null)
    || final < inicial) return null;

  const areaM2 = dados.formato === "circular"
    ? Math.PI * (diametro / 2) ** 2
    : largura * comprimento;
  const volumeM3 = areaM2 * profundidade;
  if (!Number.isFinite(volumeM3) || volumeM3 <= 0 || volumeM3 > 1_000_000) return null;

  // Arredondamos sobreviventes para baixo; não modelamos quando ocorreram perdas.
  const sobreviventes = Math.floor(quantidade * sobrevivencia / 100);
  const biomassaFinalKg = sobreviventes * final / 1000;
  const ganhoVivosKg = sobreviventes * (final - inicial) / 1000;
  const racaoKg = ganhoVivosKg * conversao;
  const densidadeSimuladaKgM3 = biomassaFinalKg / volumeM3;
  const dias = dados.diasCiclo === "" || dados.diasCiclo === null || dados.diasCiclo === undefined
    ? null : valido(dados.diasCiclo, 1, 3650, true);
  if (dias === null && dados.diasCiclo !== "" && dados.diasCiclo !== null && dados.diasCiclo !== undefined) return null;

  // Opcional: índice fornecido por projeto técnico, nunca tabela default de lotação.
  const densidadeProjeto = dados.densidadeProjeto === "" || dados.densidadeProjeto == null
    ? null : valido(dados.densidadeProjeto, .01, 1000);
  if (dados.densidadeProjeto !== "" && dados.densidadeProjeto != null && densidadeProjeto === null) return null;

  const condicoesCriticas = Boolean(dados.aeracao && dados.filtragem && dados.monitoramento && dados.densidadeValidada);
  const quantidadeProjeto = densidadeProjeto !== null && condicoesCriticas
    ? Math.max(0, Math.floor(volumeM3 * densidadeProjeto / (final / 1000))) : null;
  return {
    areaM2, volumeM3, litros: volumeM3 * 1000,
    quantidadeInicial: quantidade, sobreviventes,
    biomassaFinalKg, densidadeSimuladaKgM3,
    racaoKg, dias, quantidadeProjeto, densidadeProjeto,
    condicoesCriticas, simulacao: true,
  };
}
