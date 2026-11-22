import { culturasOrganizador } from "./culturas.js";

// Uma fonte única para a navegação visual do planejador, do assistente familiar
// e do editor de canteiros. Não altera os IDs de culturas gravados no navegador.
export const gruposCulturas = Object.freeze({
  Folhosas: ["Alface de verão", "Alface de inverno", "Rúcula", "Couve", "Acelga", "Almeirão", "Chicória", "Espinafre"],
  Raízes: ["Cenoura de verão", "Cenoura de inverno", "Rabanete", "Beterraba"],
  Temperos: ["Cebolinha", "Coentro", "Salsa"],
  "Frutos e vagens": ["Tomate de mesa", "Abobrinha", "Berinjela", "Feijão-vagem", "Morango", "Pepino", "Pimentão", "Quiabo"],
  "Brássicas": ["Brócolis de verão", "Brócolis de inverno", "Repolho de verão", "Repolho de inverno"],
});
export const destaquesCulturas = Object.freeze(["Alface de verão", "Cenoura de verão", "Tomate de mesa"]);
export const categoriasCulturas = Object.keys(gruposCulturas);
export const todasCulturas = Object.values(gruposCulturas).flat();

function normalizarBusca(texto) {
  return String(texto ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim();
}
export function buscarCulturas(termo = "", categoria = "Todas") {
  const busca = normalizarBusca(termo);
  return todasCulturas.filter(nome =>
    (categoria === "Todas" || gruposCulturas[categoria]?.includes(nome)) &&
    normalizarBusca(nome).includes(busca)
  );
}
export function grupoDaCultura(nome) {
  return categoriasCulturas.find(grupo => gruposCulturas[grupo].includes(nome)) ?? "";
}
export function resumoCultura(nome) {
  const ficha = culturasOrganizador[nome];
  if (!ficha) return "";
  return (ficha.colheitasSucessivas ? "Colheitas em etapas" : "Colheita por lote") +
    " · " + ficha.unidade;
}
