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
  // Referências de ciclo e espaçamento: Embrapa/Sebrae (Catálogo Brasileiro
  // de Hortaliças) e tabela Hortas em Pequenos Espaços. Faixas de 'mudas' são
  // aproximações de planejamento e NÃO garantem o ponto de transplante.
  Acelga: {
    mudas: [21, 28], canteiro: [60, 70], espaco: [0.40, 0.30], unidade: "pés",
    ponto: "Colha quando as folhas estiverem formadas e tenras; prefira cultivares adaptadas ao clima.",
  },
  "Almeirão": {
    mudas: [21, 28], canteiro: [60, 70], espaco: [0.25, 0.25], unidade: "pés",
    ponto: "Colha folhas desenvolvidas antes do alongamento da haste floral.",
  },
  "Chicória": {
    mudas: [21, 28], canteiro: [60, 70], espaco: [0.25, 0.25], unidade: "pés",
    ponto: "Colha folhas firmes e bem desenvolvidas, antes de aparecer a haste floral.",
  },
  "Brócolis de inverno": {
    mudas: [21, 28], canteiro: [90, 100], espaco: [0.90, 0.50], unidade: "cabeças",
    ponto: "Corte a inflorescência enquanto os botões ainda estiverem fechados.",
  },
  "Brócolis de verão": {
    mudas: [21, 28], canteiro: [80, 100], espaco: [0.90, 0.50], unidade: "cabeças",
    ponto: "Colha com os botões compactos, antes de as pequenas flores se abrirem.",
  },
  "Repolho de inverno": {
    mudas: [21, 28], canteiro: [90, 110], espaco: [0.80, 0.40], unidade: "cabeças",
    ponto: "Colha quando a cabeça estiver firme, antes de começar a rachar.",
  },
  "Repolho de verão": {
    mudas: [21, 28], canteiro: [90, 110], espaco: [0.80, 0.40], unidade: "cabeças",
    ponto: "Colha a cabeça firme e acompanhe possíveis rachaduras após chuvas.",
  },
  Coentro: {
    canteiro: [50, 60], espaco: [0.25, 0.10], unidade: "kg",
    // Colheita em lote, porém por peso: exige aferição em teste.
    planejamentoPorPeso: true,
    ponto: "Use folhas tenras antes do florescimento; registre a massa real colhida para planejar novos lotes.",
  },
  Cebolinha: {
    mudas: [21, 28], canteiro: [80, 100], espaco: [0.25, 0.15], unidade: "kg",
    colheitasSucessivas: true,
    ponto: "Corte folhas desenvolvidas preservando a base para a rebrota.",
  },
  Espinafre: {
    canteiro: [60, 80], espaco: [0.25, 0.10], unidade: "kg",
    colheitasSucessivas: true,
    ponto: "Colha folhas desenvolvidas e preserve a base para permitir rebrota quando houver.",
  },
  Salsa: {
    canteiro: [60, 70], espaco: [0.25, 0.10], unidade: "kg",
    colheitasSucessivas: true,
    ponto: "Retire primeiro as folhas externas. Registre quantos cortes cada planta realmente suportou.",
  },
  "Feijão-vagem": {
    canteiro: [60, 70], espaco: [1.00, 0.50], unidade: "kg",
    colheitasSucessivas: true,
    ponto: "Colha as vagens desenvolvidas antes de ficarem fibrosas; variedades trepadeiras precisam de suporte.",
  },
  Pepino: {
    canteiro: [45, 60], espaco: [1.00, 0.50], unidade: "kg",
    colheitasSucessivas: true,
    ponto: "Colha frutos firmes, ainda jovens, e acompanhe novas formações no pé.",
  },
  Pimentão: {
    mudas: [21, 28], canteiro: [100, 120], espaco: [1.00, 0.50], unidade: "kg",
    colheitasSucessivas: true,
    ponto: "Colha verde ou maduro, conforme a cultivar e o uso. Pode exigir tutoramento.",
  },
  Berinjela: {
    mudas: [21, 28], canteiro: [100, 120], espaco: [1.20, 1.00], unidade: "kg",
    colheitasSucessivas: true,
    ponto: "Escolha frutos firmes, de tamanho adequado à cultivar, sem deixar perder o brilho.",
  },
  Quiabo: {
    canteiro: [70, 80], espaco: [1.00, 0.40], unidade: "kg",
    colheitasSucessivas: true,
    ponto: "Colha os frutos ainda macios, com frequência, antes de ficarem fibrosos.",
  },
  Morango: {
    // Plantio por muda pronta: não sugerir semeadura em bandeja ao usuário.
    mudas: [0, 0], somenteMuda: true, canteiro: [70, 80], espaco: [0.30, 0.20], unidade: "kg",
    colheitasSucessivas: true,
    ponto: "Colha os frutos maduros e evite que fiquem em contato com solo encharcado.",
  },

};
