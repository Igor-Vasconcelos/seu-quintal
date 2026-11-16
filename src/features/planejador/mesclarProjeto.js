import { cabeNoTerreno } from "./geometria.js";

function mesclarCampos(atual, antes, depois, campos, desfazendo) {
  const resultado = { ...atual };
  for (const campo of campos) {
    if (antes[campo] !== depois[campo] && (!desfazendo || atual[campo] === antes[campo])) {
      resultado[campo] = depois[campo];
    }
  }
  return resultado;
}

function mesclarLista(atuais, antes, depois, combinar, desfazendo) {
  const originais = new Map(antes.map((item) => [item.id, item]));
  const editados = new Map(depois.map((item) => [item.id, item]));
  const idsAtuais = new Set(atuais.map(({ id }) => id));

  const mantidos = atuais.flatMap((atual) => {
    const original = originais.get(atual.id);
    if (!original) return [atual];
    const editado = editados.get(atual.id);
    if (editado) return [combinar(atual, original, editado)];
    // Desfazer uma inclusão não deve excluir trabalho feito depois em outra aba.
    return desfazendo && JSON.stringify(atual) !== JSON.stringify(original) ? [atual] : [];
  });
  const novos = depois.filter(({ id }) => !originais.has(id) && !idsAtuais.has(id));
  return [...mantidos, ...novos];
}

export function mesclarProjeto(atual, antes, depois, terreno, desfazendo = false) {
  if (desfazendo && JSON.stringify(atual) === JSON.stringify(antes)) return depois;

  function mesclarArea(area, original, editada) {
    const resultado = mesclarCampos(area, original, editada,
      ["nome", "existente", "x", "y", "largura", "comprimento"], desfazendo);
    if (cabeNoTerreno(resultado, terreno)) return resultado;

    const { x, y, largura, comprimento } = desfazendo ? area : editada;
    return { ...resultado, x, y, largura, comprimento };
  }

  function mesclarCenario(cenario, original, editado) {
    return {
      ...mesclarCampos(cenario, original, editado, ["nome"], desfazendo),
      itens: mesclarLista(cenario.itens, original.itens, editado.itens, mesclarArea, desfazendo),
    };
  }

  const cenarios = mesclarLista(atual.cenarios, antes.cenarios, depois.cenarios, mesclarCenario, desfazendo);
  if (!cenarios.length) return atual;
  const resultado = mesclarCampos(atual, antes, depois, ["ativo", "declive", "estrada"], desfazendo);
  return {
    ...resultado,
    ativo: cenarios.some(({ id }) => id === resultado.ativo) ? resultado.ativo : cenarios[0].id,
    cenarios,
  };
}
