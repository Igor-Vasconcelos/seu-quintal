// Seu Quintal — Simulações, não parâmetros compulsórios de coturnicultura.
// Metas, consumo médio, espaço por ave e sobrevivência são hipóteses editáveis.
// Dados de referência: Emater-DF (criação de corte), Emater-MG e artigos científicos.
export const fontesCodornas = [
  { nome: "Emater-DF — Criação de codornas para corte (2021)", url: "https://biblioteca.emater.df.gov.br/jspui/handle/123456789/153" },
  { nome: "Emater-MG — Criação de codornas", url: "https://www.emater.mg.gov.br/doc/site/serevicoseprodutos/livraria/Pequenos%20animais/Cria%C3%A7%C3%A3o%20de%20codornas.pdf" },
  { nome: "Pesquisa em codornas japonesas de postura (SciELO)", url: "https://www.scielo.br/j/abmvz/a/DL5cC5tVQvZHrGw5KtthsvD/?lang=pt" },
  { nome: "Instituto de Zootecnia — Bem-estar e densidades de codornas", url: "https://iz.agricultura.sp.gov.br/publica.php?id=354" },
];
export const configuracaoCodornas = Object.freeze({
  modo: "ovos",
  alojamento: "piso",
  ovosSemanais: 70,
  posturaPercentual: 80,
  avesCorteMensais: 30,
  sobrevivenciaPercentual: 95,
  cicloDias: 42,
  pesoVivoGramas: 260,
  rendimentoCarcacaPercentual: 70,
  racaoPosturaGramasDia: 27,
  racaoCorteMediaGramasDia: 18,
  aguaPosturaMlDia: 55,
  aguaCorteMlDia: 55,
  areaPosturaM2Ave: 0.1,
  areaCorteM2Ave: 0.1,
  areaDisponivelM2: "",
});

const MARGEM = 1e-8;
const limites = {
  ovosSemanais: [1, 1000000], posturaPercentual: [1, 100],
  avesCorteMensais: [1, 100000], sobrevivenciaPercentual: [1, 100],
  cicloDias: [1, 365], pesoVivoGramas: [1, 3000],
  rendimentoCarcacaPercentual: [1, 100],
  racaoPosturaGramasDia: [1, 250], racaoCorteMediaGramasDia: [1, 250],
  aguaPosturaMlDia: [1, 1000], aguaCorteMlDia: [1, 1000],
  areaPosturaM2Ave: [0.005, 20], areaCorteM2Ave: [0.005, 20],
  areaDisponivelM2: [0, 1000000],
};
const camposInteiros = new Set(["ovosSemanais","avesCorteMensais","cicloDias"]);

export function numeroCodornas(valor) {
  if (typeof valor === "number") return Number.isFinite(valor) ? valor : null;
  if (typeof valor !== "string" || !/^\d+(?:[,.]\d{1,3})?$/.test(valor.trim())) return null;
  const numero = Number(valor.trim().replace(",", "."));
  return Number.isFinite(numero) ? numero : null;
}

export function simularCodornas(entrada) {
  if (!entrada || !["ovos","corte","misto"].includes(entrada.modo)) return null;
  if (entrada.alojamento !== undefined && !["piso","viveiro","gaiola"].includes(entrada.alojamento)) return null;
  const postura = entrada.modo !== "corte";
  const corte = entrada.modo !== "ovos";
  const requeridos = [
    ...(postura ? ["ovosSemanais","posturaPercentual","racaoPosturaGramasDia","aguaPosturaMlDia","areaPosturaM2Ave"] : []),
    ...(corte ? ["avesCorteMensais","sobrevivenciaPercentual","cicloDias","pesoVivoGramas",
      "rendimentoCarcacaPercentual","racaoCorteMediaGramasDia","aguaCorteMlDia","areaCorteM2Ave"] : []),
  ];
  const valores = {};
  for (const campo of requeridos) {
    const n = numeroCodornas(entrada[campo]);
    const [min,max] = limites[campo];
    if (n === null || n < min || n > max || (camposInteiros.has(campo) && !Number.isInteger(n))) return null;
    valores[campo] = n;
  }
  const disponivel = entrada.areaDisponivelM2 === "" || entrada.areaDisponivelM2 == null
    ? null : numeroCodornas(entrada.areaDisponivelM2);
  if (disponivel !== null && (disponivel < limites.areaDisponivelM2[0] || disponivel > limites.areaDisponivelM2[1])) return null;
  if (entrada.areaDisponivelM2 !== "" && entrada.areaDisponivelM2 != null && disponivel === null) return null;

  const poedeiras = postura ? Math.ceil(valores.ovosSemanais / (7 * valores.posturaPercentual / 100)) : 0;
  const ovosPrevistosSemana = poedeiras * 7 * (valores.posturaPercentual ?? 0) / 100;
  const ovosPrevistosMes = ovosPrevistosSemana * 30 / 7;

  // Uma entrada por 30 dias, contando a sobreposição de ciclos. Esta é uma
  // reserva conservadora de alojamento, não um calendário zootécnico completo.
  const entradasMensais = corte ? Math.ceil(valores.avesCorteMensais / (valores.sobrevivenciaPercentual / 100)) : 0;
  const lotesSimultaneos = corte ? Math.ceil(valores.cicloDias / 30) : 0;
  const avesCorteAlojadas = entradasMensais * lotesSimultaneos;
  const sobreviventesCorte = corte ? Math.floor(entradasMensais * (valores.sobrevivenciaPercentual / 100) + MARGEM) : 0;
  const carneMesKg = corte ? sobreviventesCorte * valores.pesoVivoGramas *
    (valores.rendimentoCarcacaPercentual / 100) / 1000 : 0;

  const areaPosturaM2 = postura ? poedeiras * valores.areaPosturaM2Ave : 0;
  const areaCorteM2 = corte ? avesCorteAlojadas * valores.areaCorteM2Ave : 0;
  const areaReferenciaM2 = areaPosturaM2 + areaCorteM2;
  const racaoDiaKg = (
    poedeiras * (valores.racaoPosturaGramasDia ?? 0) +
    avesCorteAlojadas * (valores.racaoCorteMediaGramasDia ?? 0)
  ) / 1000;
  const aguaDiaL = (
    poedeiras * (valores.aguaPosturaMlDia ?? 0) +
    avesCorteAlojadas * (valores.aguaCorteMlDia ?? 0)
  ) / 1000;

  const alertaArea = disponivel !== null && areaReferenciaM2 > disponivel + MARGEM;
  return {
    modo: entrada.modo, alojamento: entrada.alojamento ?? "piso", poedeiras, ovosPrevistosSemana, ovosPrevistosMes,
    entradasMensais, sobreviventesCorte, lotesSimultaneos, avesCorteAlojadas,
    carneMesKg, racaoDiaKg, racaoMesKg: racaoDiaKg * 30,
    aguaDiaL, aguaMesL: aguaDiaL * 30,
    areaPosturaM2, areaCorteM2, areaReferenciaM2,
    areaDisponivelM2: disponivel, alertaArea,
    deficitAreaM2: alertaArea ? areaReferenciaM2 - disponivel : 0,
    avisos: [
      "Espaço por ave e consumo são hipóteses editáveis, não mínimos normativos nem garantia de bem-estar.",
      "Aves de corte mais jovens consomem quantidades diferentes; usar consumo diário médio constante simplifica o ciclo.",
      "A água deve permanecer disponível e limpa; o cálculo não dimensiona reservatório ou vazão para calor extremo.",
      "Para ovos alimentares, galos não são necessários; no sistema misto, separe os lotes por finalidade.",
    ],
  };
}
