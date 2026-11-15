const catalogo = "https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/887213/1/Catalogohortalicas.pdf";

// Orientações reescritas com base no Catálogo Brasileiro de Hortaliças (Embrapa e Sebrae, 2010).
const fichas = {
  "Abóbora": {
    pagina: 8,
    plantio: "Semeie em covas no local definitivo. Reserve espaço para as ramas se espalharem.",
    cuidados: "Prefira uma época quente e proteja a planta da geada. As abelhas ajudam na formação dos frutos.",
    colheita: "A colheita costuma começar entre 90 e 120 dias após o plantio. Deixe o fruto amadurecer na planta.",
  },
  Abobrinha: {
    pagina: 9,
    plantio: "Semeie no local definitivo ou em bandeja para transplantar a muda com o torrão.",
    cuidados: "Use um solo que drene bem. Excesso de água prejudica o desenvolvimento.",
    colheita: "Cerca de 45 a 60 dias após o plantio. Retire os frutos ainda jovens e macios.",
  },
  Acelga: {
    pagina: 10,
    plantio: "Semeie em bandeja ou diretamente no canteiro.",
    cuidados: "Prefira clima ameno. Se semear no canteiro, retire as mudas que nascerem muito juntas.",
    colheita: "A partir de cerca de 60 a 70 dias após o plantio, quando as folhas estiverem desenvolvidas.",
  },
  "Agrião": {
    pagina: 11,
    plantio: "Prepare mudas a partir de sementes em bandeja ou de ramos de uma planta adulta.",
    cuidados: "Mantenha o solo úmido e prefira temperaturas amenas.",
    colheita: "Por volta de 60 a 70 dias após o plantio, quando as folhas estiverem em tamanho de consumo. A planta pode rebrotar.",
  },
  "Alface de inverno": {
    pagina: 13,
    plantio: "Produza mudas em bandeja ou copinhos e transplante para o canteiro.",
    cuidados: "Escolha uma variedade para clima ameno. Mantenha a umidade do solo regular.",
    colheita: "Em torno de 60 a 80 dias após o plantio, antes de a planta emitir a haste floral.",
  },
  "Alface de verão": {
    pagina: 13,
    plantio: "Semeie em bandeja ou copinhos e transplante as mudas.",
    cuidados: "Escolha uma variedade adaptada ao calor. Acompanhe a umidade do solo nos dias mais quentes.",
    colheita: "Em torno de 50 a 70 dias após o plantio, antes de a planta emitir a haste floral.",
  },
  Alho: {
    pagina: 14,
    plantio: "Separe dentes de alho para plantio e plante-os com a ponta voltada para cima.",
    cuidados: "Escolha uma cultivar adequada ao clima local. A exigência de frio e horas de luz varia com a cultivar.",
    colheita: "O catálogo indica de 150 a 180 dias após o plantio como referência.",
  },
  "Alho-poró": {
    pagina: 15,
    plantio: "Faça mudas e transplante quando elas tiverem cerca de 12 cm de altura.",
    cuidados: "Prefira solo solto. Junte terra à base do caule ao longo do cultivo para favorecer a parte branca.",
    colheita: "Em torno de 90 a 120 dias após o plantio.",
  },
  "Almeirão": {
    pagina: 16,
    plantio: "Semeie direto no canteiro e retire as plantas que nascerem juntas.",
    cuidados: "Mantenha a irrigação frequente. A cultura prefere temperaturas amenas.",
    colheita: "Por volta de 60 a 70 dias após o plantio, com folhas firmes e desenvolvidas.",
  },
  Batata: {
    pagina: 17,
    plantio: "Use batata-semente e plante em solo solto.",
    cuidados: "Junte terra à base das plantas à medida que crescem para manter os tubérculos cobertos.",
    colheita: "Em torno de 90 a 120 dias após o plantio. Observe quando a parte aérea começar a secar e tombar.",
  },
  "Batata-doce": {
    pagina: 18,
    plantio: "Plante ramas novas, enterrando parte dos nós e deixando a ponta com folhas para fora.",
    cuidados: "Use solo solto e com boa drenagem para as raízes crescerem.",
    colheita: "Cerca de 120 a 150 dias após o plantio. Confira uma planta antes de colher o restante do canteiro.",
  },
  Berinjela: {
    pagina: 19,
    plantio: "Semeie em bandeja e transplante as mudas para o local definitivo.",
    cuidados: "Produza as mudas em clima quente. O calor favorece a germinação e o crescimento inicial.",
    colheita: "A partir de aproximadamente 100 a 120 dias após o plantio, com os frutos firmes.",
  },
  Beterraba: {
    pagina: 21,
    plantio: "Semeie no canteiro ou produza mudas em bandeja.",
    cuidados: "Use terra solta para as raízes crescerem. Desbaste onde muitas plantas nascerem juntas.",
    colheita: "Por volta de 60 a 70 dias após o plantio, quando as raízes estiverem em tamanho de consumo.",
  },
  "Brócolis de inverno": {
    pagina: 22,
    plantio: "Faça mudas em bandeja e transplante para o canteiro.",
    cuidados: "Escolha uma cultivar para clima ameno ou frio e confira se o solo precisa de correção ou adubação.",
    colheita: "Entre 90 e 100 dias após o plantio, em média. Corte quando os botões estiverem desenvolvidos e as flores ainda fechadas.",
  },
  "Brócolis de verão": {
    pagina: 22,
    plantio: "Produza mudas de uma cultivar adaptada ao calor e transplante para o canteiro.",
    cuidados: "Planeje a adubação do canteiro antes do transplante. O brócolis exige boa disponibilidade de nutrientes.",
    colheita: "Em torno de 80 a 100 dias após o plantio. Colha as inflorescências com os botões ainda fechados.",
  },
  Cebola: {
    pagina: 23,
    plantio: "Semeie no canteiro ou transplante mudas formadas em bandejas. Também é possível usar bulbinhos para plantio.",
    cuidados: "Escolha uma variedade indicada para a região. A duração diária de luz influencia a formação do bulbo.",
    colheita: "Em torno de 120 a 180 dias após o plantio. Observe quando as folhas começarem a secar e deitar.",
  },
  Cebolinha: {
    pagina: 24,
    plantio: "Semeie ou repique uma parte de uma touceira, mantendo as raízes.",
    cuidados: "Mantenha a base da planta quando cortar as folhas para permitir novas brotações.",
    colheita: "Cerca de 80 a 100 dias após o plantio por sementes. Depois do primeiro corte, acompanhe as rebrotas.",
  },
  "Cenoura de inverno": {
    pagina: 25,
    plantio: "Semeie direto em canteiro com terra fofa. Escolha uma cultivar de inverno.",
    cuidados: "Retire pedras e torrões para facilitar o crescimento das raízes.",
    colheita: "De 90 a 110 dias após o plantio, aproximadamente. Folhas mais velhas amarelando ajudam a indicar o ponto.",
  },
  "Cenoura de verão": {
    pagina: 25,
    plantio: "Semeie direto no canteiro com uma cultivar adaptada ao calor.",
    cuidados: "Solte bem o solo e retire obstáculos que possam deformar as raízes.",
    colheita: "Cerca de 85 a 100 dias após o plantio. Verifique o tamanho de uma raiz antes de colher o restante.",
  },
  "Chicória": {
    pagina: 26,
    plantio: "Semeie em canteiro ou produza mudas de chicória lisa ou crespa.",
    cuidados: "Prefira o período mais ameno e mantenha o solo úmido durante o crescimento das folhas.",
    colheita: "Em torno de 60 a 70 dias após o plantio, com folhas bem desenvolvidas.",
  },
  Chuchu: {
    pagina: 27,
    plantio: "Plante um fruto maduro e brotado, deixando a brotação para fora da terra.",
    cuidados: "Prepare uma parreira ou treliça. Mantenha água disponível e escolha um solo que drene bem.",
    colheita: "Cerca de 100 a 120 dias após o plantio. Retire os frutos ainda tenros.",
  },
  Coentro: {
    pagina: 28,
    plantio: "Semeie direto no canteiro ou na jardineira.",
    cuidados: "Mantenha o solo úmido durante a germinação. Faça plantios em datas diferentes para ter folhas por mais tempo.",
    colheita: "Por volta de 50 a 60 dias após o plantio, enquanto as folhas estiverem tenras.",
  },
  Couve: {
    pagina: 29,
    plantio: "Comece com mudas de couve de folhas, produzidas a partir de sementes ou brotos.",
    cuidados: "Na colheita, preserve o broto no centro para que a planta continue produzindo.",
    colheita: "A partir de aproximadamente 80 a 90 dias após o plantio, começando pelas folhas externas desenvolvidas.",
  },
  Espinafre: {
    pagina: 33,
    plantio: "Produza mudas em bandeja. Também é possível enraizar ramos cortados da planta adulta.",
    cuidados: "Prefira clima ameno e faça cortes preservando a base da planta.",
    colheita: "Cerca de 60 a 80 dias após o plantio, antes da floração.",
  },
  "Feijão-vagem": {
    pagina: 34,
    plantio: "Semeie direto no local definitivo. Instale um suporte para variedades trepadeiras.",
    cuidados: "Evite períodos de geada ou calor excessivo, que podem prejudicar as flores e as vagens.",
    colheita: "Em torno de 60 a 70 dias após o plantio. Pegue as vagens desenvolvidas antes de ficarem fibrosas.",
  },
  Gengibre: {
    pagina: 35,
    plantio: "Plante pedaços de rizoma com gemas em solo rico em matéria orgânica e bem drenado.",
    cuidados: "Cubra os rizomas com terra se começarem a aparecer na superfície. Evite geadas.",
    colheita: "O catálogo indica cerca de 240 a 300 dias para colher rizomas desenvolvidos.",
  },
  Melancia: {
    pagina: 40,
    plantio: "Semeie em local quente e ensolarado, com espaço para as ramas crescerem.",
    cuidados: "Planeje a irrigação e preserve a visita das abelhas durante a floração.",
    colheita: "Em torno de 85 a 90 dias após o plantio. O amarelecimento da mancha que encosta no chão ajuda a indicar o ponto.",
  },
  "Milho-verde": {
    pagina: 42,
    plantio: "Semeie diretamente no terreno. Escolha sementes de uma variedade voltada para consumo como milho-verde.",
    cuidados: "Planeje a adubação e acompanhe a umidade do solo principalmente na floração e na formação das espigas.",
    colheita: "Colha as espigas imaturas com os grãos cheios e ainda macios. No ponto leitoso, o grão solta um líquido esbranquiçado ao ser pressionado.",
  },
  Morango: {
    pagina: 44,
    plantio: "Use mudas de morangueiro em canteiro ou recipiente com boa drenagem.",
    cuidados: "Evite água acumulada nas raízes. Escolha variedade adequada ao clima da sua região.",
    colheita: "Por volta de 70 a 80 dias após o plantio, começando pelos frutos maduros.",
  },
  Pepino: {
    pagina: 47,
    plantio: "Semeie no local definitivo ou transplante mudas produzidas em bandeja.",
    cuidados: "Prefira época quente. Uma treliça pode ajudar a conduzir as ramas.",
    colheita: "Cerca de 45 a 60 dias após o plantio, com frutos firmes e em tamanho de consumo.",
  },
  "Pimentão": {
    pagina: 49,
    plantio: "Semeie em bandeja e transplante as mudas para o local definitivo.",
    cuidados: "Use uma estaca para ajudar a planta a sustentar os frutos. Alterne o cultivo com espécies de outras famílias.",
    colheita: "Em torno de 100 a 120 dias após o plantio. Pode ser colhido verde ou maduro, conforme a variedade e o uso.",
  },
  Quiabo: {
    pagina: 50,
    plantio: "Semeie direto no canteiro ou use mudas. Prefira solo aquecido.",
    cuidados: "Cultive em condições quentes e acompanhe os frutos regularmente quando a planta começar a produzir.",
    colheita: "A partir de aproximadamente 70 a 80 dias após o plantio. Retire os frutos ainda macios.",
  },
  Rabanete: {
    pagina: 51,
    plantio: "Semeie direto em solo fofo e faça o desbaste para dar espaço às raízes.",
    cuidados: "Mantenha umidade regular. Alternar seca e excesso de água pode favorecer rachaduras.",
    colheita: "Em torno de 25 a 30 dias após a semeadura. Retire as raízes antes de ficarem esponjosas.",
  },
  Repolho: {
    pagina: 52,
    plantio: "Produza mudas em bandeja, escolhendo a variedade de inverno ou de verão conforme a consulta.",
    cuidados: "Mantenha a irrigação regular durante a formação da cabeça para ajudar a evitar rachaduras.",
    colheita: "Cerca de 90 a 110 dias após o plantio, quando a cabeça estiver firme.",
  },
  "Rúcula": {
    pagina: 53,
    plantio: "Semeie no local definitivo ou transplante mudas de bandeja.",
    cuidados: "Prefira temperaturas amenas. Se colher com corte, preserve a base para uma possível rebrota.",
    colheita: "Cerca de 40 a 60 dias após a semeadura, com as folhas em tamanho de consumo.",
  },
  Salsa: {
    pagina: 54,
    plantio: "Semeie em terra bem drenada e rica em matéria orgânica.",
    cuidados: "A germinação é lenta. Mantenha a terra úmida ao longo desse período.",
    colheita: "Em torno de 60 a 70 dias após o plantio. Corte primeiro as folhas externas.",
  },
  "Tomate de mesa": {
    pagina: 57,
    plantio: "Produza mudas ou escolha mudas sadias de uma variedade de mesa e transplante para um local ensolarado.",
    cuidados: "Providencie suporte para variedades de crescimento indeterminado e acompanhe sinais de doenças, sobretudo em tempo úmido.",
    colheita: "Cerca de 100 a 120 dias após o plantio. Para consumo imediato, deixe o fruto amadurecer na planta.",
  },
};

export function buscaFichaCultura(nome) {
  if (nome === "Repolho de verão" || nome === "Repolho de inverno") return fichas.Repolho;
  return fichas[nome];
}

export function fonteFichaCultura(pagina) {
  return `${catalogo}#page=${pagina}`;
}
