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
};
export function iconeDaCultura(nome) {
  return identificacoes[nome] ?? "folha";
}
export function nomeCurtoDaCultura(nome) {
  if (nome === "Tomate de mesa") return "Tomate";
  if (nome.startsWith("Alface de ")) return nome.replace("Alface de ", "Alface · ");
  if (nome.startsWith("Cenoura de ")) return nome.replace("Cenoura de ", "Cenoura · ");
  return nome;
}
