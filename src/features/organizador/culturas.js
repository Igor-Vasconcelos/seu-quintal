export const fonteEscalonamento = "https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1063739/1/CT155FINAL.pdf#page=18";
const fonteMudas = "https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1050963/1/Producao-de-Mudas-de-Hortalicas.pdf";
const fonteCouve = "https://www.iac.sp.gov.br/media/publicacoes/iacbt199.pdf";
const fonteTomate = "https://www.atermaisdigital.cnptia.embrapa.br/web/tomate-de-mesa/cultivares";

const alface = {
  mudas: [21, 28], espaco: [0.25, 0.25], unidade: "pés",
  ponto: "Colha o pé quando estiver desenvolvido e antes de a planta emitir a haste floral.",
  fontes: [{ nome: "Embrapa · Produção de mudas", url: fonteMudas }],
};
const cenoura = {
  espaco: [0.20, 0.05], unidade: "raízes",
  ponto: "Retire uma cenoura para conferir o tamanho e confirmar o ponto das demais.",
};

export const culturasOrganizador = {
  "Alface de verão": {
    ...alface, canteiro: [30, 35],
    fontes: [...alface.fontes, { nome: "Embrapa · Alface crespa e ciclo no canteiro",
      url: "https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1092024/1/Alface-Crespa.2018.pdf" }],
  },
  "Alface de inverno": {
    ...alface, canteiro: [35, 45],
    fontes: [...alface.fontes, { nome: "Embrapa · Prazos de cultivo no campo",
      url: "https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/425901/1/Dc072.pdf" }],
  },
  "Rúcula": {
    canteiro: [40, 60], espaco: [0.20, 0.15], unidade: "pés",
    ponto: "Confira se as folhas atingiram o tamanho desejado. A escala conta uma colheita por pé.",
  },
  Rabanete: {
    canteiro: [25, 30], espaco: [0.25, 0.05], unidade: "raízes",
    ponto: "Retire as raízes no tamanho desejado, antes que fiquem esponjosas.",
  },
  Beterraba: {
    canteiro: [60, 70], espaco: [0.20, 0.10], unidade: "raízes",
    ponto: "Confira o tamanho de uma raiz antes de colher o restante do lote.",
  },
  "Cenoura de verão": { ...cenoura, canteiro: [85, 100] },
  "Cenoura de inverno": { ...cenoura, canteiro: [90, 110] },
  Couve: {
    mudas: [30, 40], canteiro: [50, 70], espaco: [0.90, 0.50], unidade: "kg", colheitasSucessivas: true,
    ponto: "Retire as folhas externas desenvolvidas e preserve as folhas centrais para os próximos cortes.",
    fontes: [
      { nome: "Embrapa · Formação da muda de couve", url: "https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1173700/1/RecomendacoesTecnicasProducao.pdf" },
      { nome: "IAC · Colheita de couve de folha", url: fonteCouve },
    ],
  },
  Abobrinha: {
    canteiro: [45, 60], espaco: [1.50, 1], unidade: "kg", colheitasSucessivas: true,
    ponto: "Colha os frutos ainda jovens e macios e continue acompanhando os que se formarem.",
  },
  "Tomate de mesa": {
    mudas: [20, 30], canteiro: [75, 80], espaco: [1, 0.50], unidade: "kg", colheitasSucessivas: true,
    ponto: "Confira a cor e o ponto de maturação da cultivar escolhida. Os frutos amadurecem em datas diferentes.",
    fontes: [
      { nome: "Embrapa · Mudas de tomate de mesa", url: "https://www.atermaisdigital.cnptia.embrapa.br/web/tomate-de-mesa/mudas-e-sementes" },
      { nome: "Embrapa · Prazos por cultivar de tomate", url: fonteTomate },
    ],
  },
};
