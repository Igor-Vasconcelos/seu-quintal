// Geometria simples de um pomar retangular. Os espaçamentos abaixo são
// exemplos publicados pela Embrapa no Sistema Filho (C.T. 34): não são
// recomendações universais nem previsão de diâmetro adulto de copa.
export const fontePomar = "https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1070012/1/Cirtec-34.pdf";
export const especiesPomar = {
  banana: { nome: "Bananeira", entreLinhas: 3, entrePlantas: 2.5, fonte: fontePomar },
  goiaba: { nome: "Goiabeira", entreLinhas: 5, entrePlantas: 4, fonte: fontePomar },
  acerola: { nome: "Aceroleira", entreLinhas: 5, entrePlantas: 4, fonte: fontePomar },
  laranja: { nome: "Laranjeira", entreLinhas: 5, entrePlantas: 4, fonte: fontePomar },
  limao: { nome: "Limoeiro", entreLinhas: 5, entrePlantas: 4, fonte: fontePomar },
  pitanga: { nome: "Pitangueira", entreLinhas: 5, entrePlantas: 4, fonte: fontePomar },
  manga: { nome: "Mangueira", entreLinhas: 8, entrePlantas: 6, fonte: fontePomar },
  outra: { nome: "Outra frutífera (configure)", entreLinhas: 5, entrePlantas: 4, fonte: null },
};

function numero(valor, minimo, maximo) {
  const n = typeof valor === "number" ? valor :
    typeof valor === "string" && /^\d+(?:[,.]\d{1,3})?$/.test(valor.trim())
      ? Number(valor.trim().replace(",", ".")) : NaN;
  return Number.isFinite(n) && n >= minimo && n <= maximo ? n : null;
}

export function planejarPomar(dados) {
  if (!dados || !Object.hasOwn(especiesPomar, dados.especie)) return null;
  const largura = numero(dados.largura, .5, 1000);
  const comprimento = numero(dados.comprimento, .5, 1000);
  const recuo = numero(dados.recuo, 0, 100);
  const entreLinhas = numero(dados.entreLinhas, .5, 100);
  const entrePlantas = numero(dados.entrePlantas, .5, 100);
  const copaAdulta = dados.copaAdulta === "" || dados.copaAdulta === null || dados.copaAdulta === undefined
    ? null : numero(dados.copaAdulta, .5, 100);
  if ([largura, comprimento, recuo, entreLinhas, entrePlantas].some(v => v === null)
      || ((dados.copaAdulta !== "" && dados.copaAdulta !== null && dados.copaAdulta !== undefined) && copaAdulta === null)) return null;
  const larguraUtil = Math.max(0, largura - 2 * recuo);
  const comprimentoUtil = Math.max(0, comprimento - 2 * recuo);
  const colunas = Math.floor(larguraUtil / entreLinhas);
  const linhas = Math.floor(comprimentoUtil / entrePlantas);
  if (colunas * linhas > 100000) return null;
  const quantidade = colunas * linhas;
  const sobraLargura = larguraUtil - colunas * entreLinhas;
  const sobraComprimento = comprimentoUtil - linhas * entrePlantas;
  const origemX = recuo + sobraLargura / 2 + entreLinhas / 2;
  const origemY = recuo + sobraComprimento / 2 + entrePlantas / 2;

  // Amostra de até 160 árvores evita criar milhares de nós SVG;
  // toda a capacidade geométrica continua calculada.
  const pontos = [];
  if (quantidade <= 160) {
    for (let x = 0; x < colunas; x++) for (let y = 0; y < linhas; y++) {
      pontos.push({ x: origemX + x * entreLinhas, y: origemY + y * entrePlantas });
    }
  }
  return {
    largura, comprimento, recuo, larguraUtil, comprimentoUtil,
    entreLinhas, entrePlantas, colunas, linhas, quantidade,
    areaM2: largura * comprimento, areaUtilM2: larguraUtil * comprimentoUtil,
    copaAdulta, sobreposicaoCopas: copaAdulta !== null && copaAdulta > Math.min(entreLinhas, entrePlantas),
    pontos, exibicaoCompleta: quantidade <= 160,
  };
}
