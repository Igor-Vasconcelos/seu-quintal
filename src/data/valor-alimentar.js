// Educação alimentar: descrições qualitativas, não prescrições nem laudos.
export const fontesAlimentacao = Object.freeze({
  tbca: "https://tbca.net.br/",
  guia: "https://www.gov.br/saude/pt-br/composicao/saps/promocao-da-saude/guias-alimentares",
});
const notas = Object.freeze({
  "Alface": "Folhas com água e fibras; ajudam a diversificar saladas e refeições.",
  "Cenoura": "Contém carotenoides, incluindo precursores de vitamina A, além de fibras.",
  "Tomate": "Oferece carotenoides, incluindo licopeno, e contribui para a variedade de vegetais.",
  "Tomate-cereja": "Oferece carotenoides, incluindo licopeno, e compõe uma alimentação variada.",
  "Rúcula": "Folhosa que acrescenta fibras e variedade de micronutrientes à alimentação.",
  "Rabanete": "Raiz com água e fibras, útil para variar os vegetais das refeições.",
  "Beterraba": "Raiz que fornece fibras e folato, com composição variável pelo preparo.",
  "Couve": "Folhas com carotenoides e vitamina K, além de fibras.",
  "Abobrinha": "Hortaliça com água e fibras, versátil em preparações caseiras.",
  "Acelga": "Folhosa que contribui com fibras e micronutrientes.",
  "Almeirão": "Folhas com fibras que ajudam a diversificar sabores e preparações.",
  "Chicória": "Folhosa que acrescenta fibras e variedade às refeições.",
  "Brócolis": "Hortaliça que fornece fibras e vitamina C, dependendo do preparo.",
  "Repolho": "Hortaliça que fornece fibras e vitamina C, com variação pelo preparo.",
  "Coentro": "Tempero aromático que amplia sabores sem depender apenas de sal.",
  "Cebolinha": "Tempero de folhas aromáticas que diversifica o sabor dos pratos.",
  "Espinafre": "Folhas que fornecem micronutrientes; a composição depende da espécie e do preparo.",
  "Salsa": "Erva aromática com micronutrientes; pequenas porções não substituem outros vegetais.",
  "Salsinha": "Erva aromática com micronutrientes; pequenas porções não substituem outros vegetais.",
  "Feijão-vagem": "Vagens que fornecem fibras e ajudam a diversificar os vegetais da refeição.",
  "Pepino": "Alimento rico em água, com fibras, especialmente quando consumido com casca higienizada.",
  "Pimentão": "Hortaliça que fornece vitamina C; o teor varia conforme maturação e preparo.",
  "Berinjela": "Hortaliça que contribui com fibras e variedade de preparações.",
  "Morango": "Fruta que fornece vitamina C e fibras.",
  "Quiabo": "Hortaliça que fornece fibras e diversifica as refeições.",
  "Hortelã": "Erva aromática utilizada em preparações e bebidas, sem alegação medicinal.",
  "Manjericão": "Erva aromática que permite variar o sabor dos alimentos.",
  "Agrião": "Folhas que ajudam a variar a alimentação e fornecem micronutrientes.",
  "Alho": "Tempero aromático que pode dar sabor a refeições com menos sal.",
  "Alho-poró": "Hortaliça que fornece fibras e aroma nas preparações.",
  "Batata": "Tubérculo que fornece carboidratos e potássio; o preparo altera seu perfil nutricional.",
  "Batata-doce": "Raiz que fornece carboidratos e fibras; variedades alaranjadas possuem carotenoides.",
  "Cebola": "Hortaliça aromática que contribui para variedade de preparações.",
  "Chuchu": "Hortaliça rica em água, útil para variar os vegetais da refeição.",
  "Gengibre": "Rizoma usado como tempero; não substitui tratamentos de saúde.",
  "Abóbora": "A polpa de variedades alaranjadas contém carotenoides precursores de vitamina A.",
  "Melancia": "Fruta com elevado teor de água e carotenoides.",
  "Milho-verde": "Fornece carboidratos e fibras, conforme o preparo.",
  "Bananeira": "A banana é uma fruta que fornece carboidratos, fibras e potássio.",
  "Goiabeira": "A goiaba fornece vitamina C e fibras.",
  "Aceroleira": "A acerola é conhecida por oferecer vitamina C.",
  "Laranjeira": "A laranja fornece vitamina C e fibras quando consumida inteira.",
  "Limoeiro": "O limão fornece vitamina C; a quantidade consumida costuma ser pequena.",
  "Pitangueira": "A pitanga diversifica o consumo de frutas e fornece micronutrientes.",
  "Mangueira": "A manga oferece carotenoides e fibras.",
  "Ovos de galinha": "Ovos fornecem proteínas e nutrientes variados; consuma bem preparados e armazenados com higiene.",
  "Carne de frango": "A carne de frango fornece proteínas; o teor de gordura varia com o corte e o preparo.",
  "Ovos de codorna": "Ovos de codorna fornecem proteínas; mantenha higiene e cozimento adequado.",
  "Carne de codorna": "A carne de codorna fornece proteínas; cozinhe completamente e preserve a cadeia fria.",
  "Peixes": "Peixes fornecem proteínas; composição de gorduras e micronutrientes varia por espécie e preparo.",
});
export function chaveAlimento(nome) {
  if (typeof nome !== "string") return "";
  const base = nome.replace(/ de (verão|inverno)$/i, "").replace(/ de mesa$/i, "");
  return base.trim();
}
export function valorAlimentar(nome) {
  if (nome === "Outra frutífera (configure)" || nome === "Outra espécie") return null;
  const chave = chaveAlimento(nome);
  return notas[chave] ? { titulo: chave, descricao: notas[chave] } : null;
}
