export const diasPorMes = 30;

export const referenciaPostura = {
  ovosPorSemana: 5,
  racaoGramasDia: [100, 115],
  aguaMililitrosDia: 250,
  fonte: "https://www.infoteca.cnptia.embrapa.br/infoteca/handle/doc/1076928",
};

export const referenciaCorte = {
  diasPadrao: 84,
  diasEntreLotes: 15,
  aguaMililitrosDia: [190, 270],
  // Desempenho em semiconfinamento, tabela 6 do folheto Embrapa 041.
  ciclos: {
    77: { racaoGramas: 6953, viabilidade: 94.5 },
    84: { racaoGramas: 8059, viabilidade: 94 },
    91: { racaoGramas: 9207, viabilidade: 93.5 },
  },
  fonte: "https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1148805/1/final10036.pdf",
  fonteIntervalo: "https://www.atermaisdigital.cnptia.embrapa.br/web/frango/sanidade/limpeza-e-desinfeccao",
};

function positivoInteiro(valor) {
  return Number.isSafeInteger(valor) && valor > 0;
}

function estimarPostura(ovosSemana, ovosPorPoedeira) {
  if (!positivoInteiro(ovosSemana) || !positivoInteiro(ovosSemana * 100)) return null;
  if (!Number.isFinite(ovosPorPoedeira) || ovosPorPoedeira < .01 || ovosPorPoedeira > 7) return null;

  const ovosEmCentesimos = Math.round(ovosPorPoedeira * 100);
  if (ovosEmCentesimos / 100 !== ovosPorPoedeira) return null;
  const aves = Math.ceil(ovosSemana * 100 / ovosEmCentesimos);
  const racaoDia = referenciaPostura.racaoGramasDia.map((gramas) => aves * gramas / 1000);
  return {
    aves,
    ovosSemana: aves * ovosEmCentesimos / 100,
    racaoDia,
    racaoMes: racaoDia.map((quilos) => quilos * diasPorMes),
    aguaDia: aves * referenciaPostura.aguaMililitrosDia / 1000,
  };
}

function estimarCorte(frangosMes, diasCriacao) {
  if (!positivoInteiro(frangosMes) || !positivoInteiro(diasCriacao)
    || !Object.hasOwn(referenciaCorte.ciclos, diasCriacao)) return null;

  const ciclo = referenciaCorte.ciclos[diasCriacao];
  const diasTotais = diasCriacao + referenciaCorte.diasEntreLotes;
  if (!positivoInteiro(frangosMes * diasTotais)) return null;

  const metaPorLote = Math.ceil(frangosMes * diasTotais / diasPorMes);
  const aves = Math.ceil(metaPorLote * 100 / ciclo.viabilidade);
  return {
    aves,
    metaPorLote,
    diasCriacao,
    diasTotais,
    racaoLote: aves * ciclo.racaoGramas / 1000,
    aguaDia: referenciaCorte.aguaMililitrosDia.map((ml) => aves * ml / 1000),
    viabilidade: ciclo.viabilidade,
  };
}

export function estimarGalinheiro({
  tipo, ovosSemana, ovosPorPoedeira = referenciaPostura.ovosPorSemana,
  frangosMes, diasCriacao = referenciaCorte.diasPadrao,
}) {
  const incluiPostura = tipo === "postura" || tipo === "mista";
  const incluiCorte = tipo === "corte" || tipo === "mista";
  if (!incluiPostura && !incluiCorte) return null;

  const postura = incluiPostura ? estimarPostura(ovosSemana, ovosPorPoedeira) : null;
  const corte = incluiCorte ? estimarCorte(frangosMes, diasCriacao) : null;
  if ((incluiPostura && !postura) || (incluiCorte && !corte)) return null;

  const totalSimultaneo = (postura?.aves ?? 0) + (corte?.aves ?? 0);
  return positivoInteiro(totalSimultaneo) ? { postura, corte, totalSimultaneo } : null;
}
