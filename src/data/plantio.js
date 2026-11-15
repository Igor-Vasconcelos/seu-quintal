export const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export const regioes = ["Sul", "Sudeste", "Nordeste", "Centro-Oeste", "Norte"];

export const fontePlantio =
  "https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1020866/1/Producao-de-Hortalicas-para-a-Agricultura-Familiar.pdf#page=55";

// Embrapa, Produção de Hortaliças para Agricultura Familiar, Tabela 8, pp. 54–56.
// Colunas na ordem da fonte: Sul, Sudeste, Nordeste, Centro-Oeste e Norte.
// Cada par contém o primeiro e o último mês (inclusive). null representa * na fonte.
const anoTodo = [1, 12];
const periodos = {
  "Abóbora": [[10, 2], [9, 3], [3, 10], anoTodo, [4, 8]],
  Abobrinha: [[9, 5], [8, 5], [3, 10], anoTodo, [4, 8]],
  Acelga: [[2, 7], [2, 7], null, null, [4, 6]],
  "Agrião": [[2, 10], [2, 7], [3, 9], [3, 7], [4, 7]],
  "Alface de inverno": [[2, 10], [2, 7], [3, 9], [3, 9], [3, 7]],
  "Alface de verão": [anoTodo, anoTodo, anoTodo, anoTodo, anoTodo],
  Alho: [[5, 6], [3, 4], [5, 5], [3, 4], null],
  "Alho-poró": [[3, 6], [3, 6], [5, 6], [4, 6], null],
  "Almeirão": [[2, 10], [2, 8], [2, 8], [2, 8], [4, 8]],
  Batata: [[11, 12], [4, 5], null, [4, 5], null],
  "Batata-doce": [[10, 12], [10, 12], null, [10, 12], null],
  Berinjela: [[8, 1], [8, 3], anoTodo, [8, 2], [4, 8]],
  Beterraba: [anoTodo, anoTodo, [4, 8], [4, 8], null],
  "Brócolis de inverno": [[2, 9], [2, 7], null, [2, 5], null],
  "Brócolis de verão": [[10, 12], [9, 1], [10, 2], [10, 1], [4, 7]],
  Cebola: [[7, 8], [2, 5], [2, 4], [2, 5], [2, 5]],
  Cebolinha: [anoTodo, anoTodo, [3, 7], [4, 8], [4, 10]],
  "Cenoura de inverno": [[2, 8], [3, 7], null, [4, 7], null],
  "Cenoura de verão": [[11, 1], [10, 3], [10, 3], [10, 3], [10, 3]],
  Chicória: [[2, 7], [2, 7], [2, 8], [4, 6], [3, 8]],
  Chuchu: [[9, 10], [9, 10], anoTodo, [9, 10], [4, 6]],
  Coentro: [[9, 1], [8, 2], anoTodo, [8, 4], [4, 10]],
  Couve: [[2, 7], [2, 7], [4, 8], [2, 7], [4, 7]],
  Espinafre: [[2, 9], [2, 9], [3, 8], [3, 8], [3, 5]],
  "Feijão-vagem": [[9, 3], [8, 3], anoTodo, [3, 8], [4, 7]],
  Gengibre: [[8, 12], [8, 12], anoTodo, [8, 12], anoTodo],
  Melancia: [[9, 1], [8, 3], [3, 9], [9, 12], [4, 8]],
  "Milho-verde": [[8, 2], [9, 12], [10, 3], [9, 1], [3, 5]],
  Morango: [[3, 4], [3, 4], null, [2, 3], null],
  Pepino: [[9, 2], [9, 2], anoTodo, [7, 11], [4, 9]],
  Pimentão: [[9, 2], [8, 3], [5, 9], [8, 12], [4, 7]],
  Quiabo: [[10, 12], [8, 3], anoTodo, [8, 2], anoTodo],
  Rabanete: [[3, 8], [3, 8], [3, 7], [4, 9], [3, 8]],
  "Repolho de inverno": [[2, 9], [2, 7], [2, 7], [2, 7], null],
  "Repolho de verão": [[11, 1], [10, 2], anoTodo, [10, 2], [3, 9]],
  Rúcula: [[3, 8], [3, 8], [3, 7], [3, 7], null],
  Salsa: [[3, 9], [3, 9], [3, 8], [3, 8], null],
  "Tomate de mesa": [anoTodo, anoTodo, anoTodo, anoTodo, anoTodo],
};

export const totalCulturas = Object.keys(periodos).length;

export function descreverEpocaPlantio(nome, regiao) {
  const periodo = periodos[nome]?.[regioes.indexOf(regiao)];
  if (!periodo) return "Sem indicação na tabela para esta região.";

  const [inicio, fim] = periodo;
  if (inicio === 1 && fim === 12) return "O ano todo";
  if (inicio === fim) return meses[inicio - 1];
  return `De ${meses[inicio - 1].toLowerCase()} a ${meses[fim - 1].toLowerCase()}`;
}

export function consultarPlantio(regiao, mes) {
  const coluna = regioes.indexOf(regiao);

  return Object.entries(periodos).filter(([, porRegiao]) => {
    const periodo = porRegiao[coluna];
    if (!periodo) return false;

    const [inicio, fim] = periodo;
    if (inicio > fim) return mes >= inicio || mes <= fim;
    return mes >= inicio && mes <= fim;
  }).map(([nome]) => nome);
}
