// Somente apresentação. O catálogo agronômico continua em culturas.js.
const identificacoes = {
  "Alface de verão": "alface",
  "Alface de inverno": "alface",
  "Rúcula": "rucula",
  "Rabanete": "rabanete",
  "Beterraba": "beterraba",
  "Cenoura de verão": "cenoura",
  "Cenoura de inverno": "cenoura",
  "Couve": "couve",
  "Abobrinha": "abobrinha",
  "Tomate de mesa": "tomate",
  Acelga: "couve",
  "Almeirão": "rucula",
  Chicória: "couve",
  "Brócolis de verão": "brocolis",
  "Brócolis de inverno": "brocolis",
  "Repolho de verão": "repolho",
  "Repolho de inverno": "repolho",
  Coentro: "salsa",
  Cebolinha: "cebolinha",
  Espinafre: "couve",
  Salsa: "salsa",
  "Feijão-vagem": "vagem",
  Pepino: "pepino",
  Pimentão: "pimentao",
  Berinjela: "berinjela",
  Quiabo: "quiabo",
  Morango: "morango",
};
export function iconeDaCultura(nome) {
  return identificacoes[nome] ?? "brotos";
}
export function nomeCurtoDaCultura(nome) {
  if (nome === "Tomate de mesa") return "Tomate";
  if (nome.startsWith("Alface de ")) return nome.replace("Alface de ", "Alface · ");
  if (nome.startsWith("Cenoura de ")) return nome.replace("Cenoura de ", "Cenoura · ");
  return nome;
}
