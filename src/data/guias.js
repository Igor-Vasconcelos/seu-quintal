export const guiaHorta = {
  id: "horta",
  destino: "horta/",
  assunto: "Horta",
  simbolo: "🌱",
  resumo: "Escolha o que plantar em uma janela, varanda ou quintal.",
  titulo: "Horta em pequenos espaços",
  fonte: "Horta em pequenos espaços · Embrapa",
  url: "https://www.infoteca.cnptia.embrapa.br/handle/doc/958531",
};

export const guiaAnimais = {
  id: "animais",
  titulo: "Criação de animais",
  destino: "sisteminha.html#galinheiro",
  assunto: "Criação de animais",
  simbolo: "🐓",
  resumo: "Conheça os cuidados iniciais para montar um galinheiro.",
  descricao: "Antes de escolher as aves, pense na rotina de manejo e no local do abrigo. O material da Embrapa traz critérios para avaliar drenagem, ventilação, sombra e acesso à água.",
  fonte: "Criação de galinhas e codornas · Embrapa",
  url: "https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1102048/1/Doc248PerguntasRespostasCriacaoGalinhasCodornas.pdf",
};

export const guias = [
  guiaHorta,
  guiaAnimais,
  {
    id: "compostagem",
    titulo: "Solo e compostagem",
    destino: "guias/compostagem/",
    assunto: "Compostagem",
    simbolo: "♻️",
    resumo: "Descubra o que pode ir para a composteira de casa.",
  },
  {
    id: "ferramentas",
    titulo: "Ferramentas e irrigação",
    destino: "guias/irrigacao/",
    assunto: "Ferramentas",
    simbolo: "🧤",
    resumo: "Compare mangueira e gotejamento para o tamanho da sua horta.",
  },
];
