/**
 * Referências ilustrativas para iniciantes em pequenos espaços.
 * Luz é uma variável de triagem; não basta para garantir produtividade.
 * Exemplos de recipientes retangulares NÃO são medidas mínimas da espécie.
 *
 * Referências para revisão humana: Embrapa "Horta em casa" (2014),
 * Embrapa "Horta em pequenos espaços" (2017) e SENAR-PR
 * "Jardins produtivos, hortas e pomares" (2026).
 */
export const cultivosPequenosEspacos = Object.freeze({
  hortela: {
    nome: "Hortelã", foto: true, sol: "pouca", espacos: ["janela","varanda","quintal"],
    dica: "Mantenha em vaso próprio; a planta se espalha e compete com as vizinhas.",
    cuidadoSol: "Com sol forte da tarde, prefira um ponto protegido e confira a umidade.",
    recipiente: "Vaso individual, com furos e boa estabilidade.",
    medidas: [25,25,25],
  },
  salsinha: {
    nome: "Salsinha", foto: true, sol: "pouca", espacos: ["janela","varanda","quintal"],
    dica: "Escolha um lugar bem claro e acompanhe o crescimento, especialmente com pouco sol.",
    cuidadoSol: "O excesso de calor pode prejudicar as folhas; considere sol da manhã.",
    recipiente: "Vaso ou jardineira com boa drenagem.",
    medidas: [30,25,25],
  },
  alface: {
    nome: "Alface", foto: true, sol: "parcial", espacos: ["janela","varanda","quintal"],
    dica: "Mantenha a umidade regular sem encharcar e escolha cultivar adaptada ao calor.",
    cuidadoSol: "Sol forte e calor podem favorecer pendoamento; proteja nas horas mais quentes.",
    recipiente: "Jardineira com 20–25 cm de profundidade útil, como referência.",
    medidas: [40,30,25], culturaAgenda: "Alface de verão",
  },
  rucula: {
    nome: "Rúcula", foto: true, sol: "parcial", espacos: ["janela","varanda","quintal"],
    dica: "Acompanhe a umidade e faça colheitas quando as folhas estiverem desenvolvidas.",
    cuidadoSol: "Observe folhas murchas e pendoamento no calor intenso; faça sombra parcial se necessário.",
    recipiente: "Jardineira bem drenada, com cerca de 20–25 cm de profundidade útil.",
    medidas: [40,30,25], culturaAgenda: "Rúcula",
  },
  cebolinha: {
    nome: "Cebolinha", foto: true, sol: "parcial", espacos: ["janela","varanda","quintal"],
    dica: "Colha as folhas sem retirar a base para permitir a rebrota.",
    cuidadoSol: "Se o local secar rapidamente no sol forte, ajuste a rega.",
    recipiente: "Vaso ou jardineira com boa drenagem.",
    medidas: [30,25,25], culturaAgenda: "Cebolinha",
  },
  coentro: {
    nome: "Coentro", sol: "parcial", espacos: ["janela","varanda","quintal"],
    dica: "Prefira condições amenas e faça novos lotes para colher folhas por mais tempo.",
    cuidadoSol: "Calor excessivo pode antecipar o florescimento; observe a variedade e a época.",
    recipiente: "Jardineira drenada, com cerca de 20–25 cm de profundidade útil.",
    medidas: [40,30,25], culturaAgenda: "Coentro",
  },
  acelga: {
    nome: "Acelga", sol: "parcial", espacos: ["varanda","quintal"],
    dica: "Reserve espaço para as folhas e mantenha irrigação regular.",
    cuidadoSol: "Em tardes muito quentes, proteja as folhas do excesso de calor.",
    recipiente: "Recipiente amplo e bem drenado para acomodar as folhas.",
    medidas: [45,35,30], culturaAgenda: "Acelga",
  },
  almeirao: {
    nome: "Almeirão", sol: "parcial", espacos: ["varanda","quintal"],
    dica: "Colha folhas desenvolvidas antes de a planta emitir haste floral.",
    cuidadoSol: "Proteção contra calor intenso pode ajudar a manter a qualidade das folhas.",
    recipiente: "Jardineira ou canteiro com boa drenagem.",
    medidas: [40,30,25], culturaAgenda: "Almeirão",
  },
  couve: {
    nome: "Couve", sol: "parcial", espacos: ["varanda","quintal"],
    dica: "Dê espaço à folhagem e retire folhas desenvolvidas conforme o crescimento.",
    cuidadoSol: "Com calor muito forte, monitore estresse hídrico e pragas.",
    recipiente: "Vaso grande e estável, com espaço para raízes e folhas.",
    medidas: [45,45,40], culturaAgenda: "Couve",
  },
  espinafre: {
    nome: "Espinafre", sol: "parcial", espacos: ["varanda","quintal"],
    dica: "Mantenha boa umidade e acompanhe o crescimento das folhas.",
    cuidadoSol: "Prefira horas mais amenas quando houver calor intenso.",
    recipiente: "Jardineira com drenagem e espaço para as folhas.",
    medidas: [40,30,25], culturaAgenda: "Espinafre",
  },
  chicoria: {
    nome: "Chicória", sol: "parcial", espacos: ["varanda","quintal"],
    dica: "Colha folhas firmes e desenvolvidas antes do florescimento.",
    cuidadoSol: "Sol forte no calor pode exigir proteção durante a tarde.",
    recipiente: "Jardineira ou canteiro com boa drenagem.",
    medidas: [40,30,25], culturaAgenda: "Chicória",
  },
  "tomate-cereja": {
    nome: "Tomate-cereja", foto: true, sol: "pleno", espacos: ["varanda","quintal"],
    dica: "Use vaso grande, tutor e boa incidência de sol; acompanhe a irrigação.",
    cuidadoSol: "Evite estresse por falta de água e monitore o aquecimento do recipiente.",
    recipiente: "Vaso grande e estável, apoiado no piso, nunca pendurado na janela.",
    medidas: [45,45,45],
  },
  pimentao: {
    nome: "Pimentão", foto: true, sol: "pleno", espacos: ["varanda","quintal"],
    dica: "Prefira vaso firme, com boa luz, drenagem e acompanhamento da rega.",
    cuidadoSol: "Monitore calor e disponibilidade de água durante a frutificação.",
    recipiente: "Vaso grande e estável, apoiado no piso.",
    medidas: [40,40,40], culturaAgenda: "Pimentão",
  },
  manjericao: {
    nome: "Manjericão", foto: true, sol: "pleno", espacos: ["janela","varanda","quintal"],
    dica: "Prefira bastante luz, recipientes drenados e proteção contra frio intenso.",
    cuidadoSol: "No verão muito quente, acompanhe a água do vaso.",
    recipiente: "Vaso individual, firme e drenado.",
    medidas: [30,30,30],
  },
  morango: {
    nome: "Morango", sol: "pleno", espacos: ["varanda","quintal"],
    dica: "Comece com muda sadia e evite frutos em contato com terra encharcada.",
    cuidadoSol: "Em calor intenso, prefira cultivar adaptada e proteja a frutificação.",
    recipiente: "Jardineira com boa drenagem e cerca de 20–25 cm de profundidade útil.",
    medidas: [40,25,25], culturaAgenda: "Morango",
  },
  rabanete: {
    nome: "Rabanete", sol: "pleno", espacos: ["janela","varanda","quintal"],
    dica: "Mantenha o substrato solto, com umidade regular, para formar raízes.",
    cuidadoSol: "Pode ficar fibroso ou sofrer com calor excessivo; confira a época regional.",
    recipiente: "Jardineira com cerca de 20–25 cm de profundidade útil.",
    medidas: [40,30,25], culturaAgenda: "Rabanete",
  },
});

const ordemLuz = ["pouca","parcial","pleno"];
const prioridade = ["tomate-cereja","pimentao","manjericao","morango","rabanete",
  "alface","rucula","cebolinha","coentro","acelga","almeirao","couve","espinafre",
  "chicoria","hortela","salsinha"];

/**
 * 6 h de sol não apagam as possibilidades de meia sombra, mas elas podem
 * exigir proteção do calor. Evita sugerir recipientes grandes em janelas.
 */
export function recomendarCultivos(espaco, luz) {
  if (!["janela","varanda","quintal"].includes(espaco) || !ordemLuz.includes(luz)) {
    return { principais: [], outrasAdequadas: [], comCuidados: [], total: 0 };
  }
  const principalNivel = ordemLuz.indexOf(luz);
  const candidatos = prioridade
    .filter(id => cultivosPequenosEspacos[id].espacos.includes(espaco))
    .map(id => ({ id, ...cultivosPequenosEspacos[id] }));
  const adequadas = candidatos.filter(item => ordemLuz.indexOf(item.sol) === principalNivel);
  const comCuidados = candidatos.filter(item => ordemLuz.indexOf(item.sol) < principalNivel);
  return {
    principais: adequadas.slice(0, 4),
    outrasAdequadas: adequadas.slice(4),
    comCuidados,
    total: adequadas.length + comCuidados.length,
  };
}

export function exemploParaCultivo(id, espaco = "") {
  const item = cultivosPequenosEspacos[id];
  if (!item) return null;
  const [comprimento, largura, profundidade] = item.medidas;
  return {
    id,
    nome: item.nome,
    medidas: { comprimento: String(comprimento), largura: String(largura), profundidade: String(profundidade) },
    recipiente: item.recipiente,
    aviso: "Medidas ilustrativas para fazer a conta, não exigência mínima nem garantia de bom cultivo." +
      (espaco === "janela" ? " Em janelas, coloque o vaso sobre apoio seguro do lado interno." :
        espaco === "varanda" ? " Em varandas, confira o peso da terra molhada e a capacidade da estrutura." : ""),
  };
}
