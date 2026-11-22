export const guiaHorta = {
  id: "horta",
  destino: "horta/",
  assunto: "Horta",
  simbolo: "🌱",
  resumo: "Escolha o que plantar em uma janela, varanda ou quintal.",
  titulo: "Horta em pequenos espaços",
  formato: "Guia interativo",
  paraQuem: "Para quem tem vasos, varanda ou quintal pequeno",
  aprende: "Escolher culturas pelo espaço e pela luz disponível",
  fonte: "Horta em pequenos espaços · Embrapa",
  url: "https://www.infoteca.cnptia.embrapa.br/handle/doc/958531",
};

export const guiaAnimais = {
  id: "animais",
  titulo: "Criação de animais",
  formato: "Conteúdo + calculadora",
  paraQuem: "Para quem pensa em criar aves",
  aprende: "Conhecer consumo, instalações e planejamento de galinhas",
  destino: "sisteminha.html#galinheiro",
  assunto: "Criação de animais",
  simbolo: "🐓",
  resumo: "Calcule quantas aves criar e veja o consumo de ração, água e os cuidados diários.",
  fonte: "Criação de galinhas e codornas · Embrapa",
  url: "https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1102048/1/Doc248PerguntasRespostasCriacaoGalinhasCodornas.pdf",
};

export const guias = [
  guiaHorta,
  guiaAnimais,
  {
    id: "compostagem",
    titulo: "Solo e compostagem",
    formato: "Checklist interativo",
    paraQuem: "Para quem quer aproveitar resíduos orgânicos",
    aprende: "Separar materiais adequados e evitar os que exigem cuidado",
    destino: "guias/compostagem/",
    assunto: "Compostagem",
    simbolo: "♻️",
    resumo: "Descubra o que pode ir para a composteira de casa.",
  },
  {
    id: "ferramentas",
    titulo: "Ferramentas e irrigação",
    formato: "Comparativo prático",
    paraQuem: "Para quem precisa escolher como irrigar",
    aprende: "Comparar regador, mangueira e gotejamento",
    destino: "guias/irrigacao/",
    assunto: "Ferramentas",
    simbolo: "🧤",
    resumo: "Compare mangueira e gotejamento para o tamanho da sua horta.",
  },
];
