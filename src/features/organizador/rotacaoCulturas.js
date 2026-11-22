// Agrupamento botânico para educação sobre alternância de plantios.
// NÃO calcula calendário de rotação nem substitui histórico do canteiro.
const familias = Object.freeze({
  Asteraceae: ["Alface de verão","Alface de inverno","Almeirão","Chicória"],
  Brassicaceae: ["Rúcula","Rabanete","Couve","Brócolis de verão","Brócolis de inverno","Repolho de verão","Repolho de inverno"],
  Apiaceae: ["Cenoura de verão","Cenoura de inverno","Coentro","Salsa"],
  Solanaceae: ["Tomate de mesa","Berinjela","Pimentão"],
  Cucurbitaceae: ["Abobrinha","Pepino"],
  Amaranthaceae: ["Beterraba","Acelga"],
  Fabaceae: ["Feijão-vagem"],
  Amaryllidaceae: ["Cebolinha"],
  Rosaceae: ["Morango"],
  Malvaceae: ["Quiabo"],
});
export const fonteRotacao = "https://www.gov.br/agricultura/pt-br/assuntos/sustentabilidade/organicos/fichas-agroecologicas/arquivos-producao-vegetal/1-rotacao-de-culturas-em-hortalicas-1.pdf";
export function familiaBotanica(nome) {
  return Object.keys(familias).find(familia => familias[familia].includes(nome)) ?? null;
}
export function sugestoesRotacao(nomes) {
  if (!Array.isArray(nomes)) return [];
  const diferentes = [...new Set(nomes)];
  const vistos = new Set();
  const resultado = [];
  for (const origem of diferentes) {
    const f1 = familiaBotanica(origem);
    if (!f1 || vistos.has(f1)) continue;
    vistos.add(f1);
    const destino = diferentes.find(nome => nome !== origem && familiaBotanica(nome) && familiaBotanica(nome) !== f1);
    if (destino) resultado.push({ origem, familiaOrigem:f1, destino, familiaDestino:familiaBotanica(destino) });
  }
  return resultado.slice(0, 3);
}
