import { arredondarMedida, cabeNoTerreno, criarTerreno, limitarPosicao, sobrepoe } from "./geometria.js";

export const chaveProjetos = "seu-quintal:projetos-terreno:v1";

// Catálogo único do terreno. Apenas a chave de tipo é persistida;
 // ícones, categorias e dimensões iniciais podem evoluir sem migrar dados.
export const tiposDeArea = {
  canteiro: { nome: "Canteiro", largura: 1.2, comprimento: 3, cor: "horta", icone: "canteiro", grupo: "cultivo" },
  casa: { nome: "Casa", largura: 8, comprimento: 10, cor: "construcao", icone: "casa", grupo: "construcao" },
  acesso: { nome: "Acesso para caminhão", largura: 4, comprimento: 12, cor: "caminho", icone: "caminho", grupo: "construcao" },
  manobra: { nome: "Área de manobra", largura: 8, comprimento: 8, cor: "caminho", icone: "manobra", grupo: "construcao" },
  pomar: { nome: "Pomar", largura: 8, comprimento: 8, cor: "pomar", icone: "arvores", grupo: "cultivo" },
  horta: { nome: "Horta", largura: 4, comprimento: 6, cor: "horta", icone: "horta", grupo: "cultivo" },
  tanque: { nome: "Tanque de peixes", largura: 5, comprimento: 5, cor: "agua", icone: "tanque", grupo: "animais" },
  galinheiro: { nome: "Galinheiro", largura: 3, comprimento: 4, cor: "animais", icone: "galinha", grupo: "animais" },
  codornario: { nome: "Codornário", largura: 2, comprimento: 3, cor: "codornas", icone: "codorna", grupo: "animais" },
  chiqueiro: { nome: "Chiqueiro", largura: 3, comprimento: 4, cor: "animais", icone: "porco", grupo: "animais" },
  compostagem: { nome: "Compostagem", largura: 2, comprimento: 2, cor: "pomar", icone: "composteira", grupo: "apoio" },
  fogueira: { nome: "Fogueira", largura: 4, comprimento: 4, cor: "fogueira", icone: "fogueira", grupo: "apoio" },
  galpao: { nome: "Galpão", largura: 4, comprimento: 5, cor: "construcao", icone: "galpao", grupo: "construcao" },
  plantio: { nome: "Faixa de plantio", largura: 2, comprimento: 6, cor: "cultivo", icone: "fileiras", grupo: "cultivo", existente: true },
  muda: { nome: "Muda ou árvore", largura: 0, comprimento: 0, cor: "pomar", icone: "muda", grupo: "cultivo", existente: true },
  outro: { nome: "Outra área", largura: 3, comprimento: 3, cor: "construcao", icone: "outros", grupo: "apoio" },
};

export const gruposDeArea = {
  cultivo: { nome: "Cultivos", icone: "horta" },
  animais: { nome: "Animais", icone: "codorna" },
  construcao: { nome: "Construções", icone: "casa" },
  apoio: { nome: "Apoio e lazer", icone: "fogueira" },
};

export const declives = {
  "": "Sem indicação",
  esquerda: "Para a esquerda",
  direita: "Para a direita",
  frente: "Para a frente",
  fundo: "Para o fundo",
};

export const projetoInicial = {
  ativo: "inicial",
  estrada: true,
  declive: "",
  cenarios: [{ id: "inicial", nome: "Cenário inicial", itens: [] }],
};

const projetosIniciais = { ultimoTerreno: null, terrenos: {} };

export function chaveDoTerreno(terreno) {
  return `${terreno.largura}x${terreno.comprimento}`;
}

export function novoId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function lerProjetos() {
  try {
    const dados = JSON.parse(window.localStorage.getItem(chaveProjetos));
    if (!dados?.terrenos || typeof dados.terrenos !== "object") return projetosIniciais;
    const terrenos = {};
    for (const [id, projeto] of Object.entries(dados.terrenos)) {
      const dimensoes = criarTerreno(...id.split("x"));
      if (!dimensoes || !Array.isArray(projeto?.cenarios)) continue;
      const cenarios = projeto.cenarios.filter((cenario) =>
        typeof cenario?.id === "string" && typeof cenario.nome === "string" && Array.isArray(cenario.itens)
      ).map((cenario) => ({
        ...cenario,
        itens: cenario.itens.filter((item) => item && Object.hasOwn(tiposDeArea, item.tipo)
          && typeof item.id === "string" && typeof item.nome === "string"
          && [item.x, item.y, item.largura, item.comprimento].every(Number.isFinite)
          && (item.tipo === "muda" ? item.largura === 0 && item.comprimento === 0
            : item.largura > 0 && item.comprimento > 0)
          && cabeNoTerreno(item, dimensoes)),
      }));
      if (!cenarios.length) continue;
      terrenos[id] = {
        ativo: cenarios.find(({ id }) => id === projeto.ativo)?.id ?? cenarios[0].id,
        estrada: projeto.estrada !== false,
        declive: Object.hasOwn(declives, projeto.declive) ? projeto.declive : "",
        cenarios,
      };
    }
    const ultimoTerreno = dados.ultimoTerreno && criarTerreno(
      String(dados.ultimoTerreno.largura), String(dados.ultimoTerreno.comprimento),
    );
    return { terrenos, ultimoTerreno: ultimoTerreno || null };
  } catch {
    return projetosIniciais;
  }
}

export function salvarProjetos(dados) {
  try {
    window.localStorage.setItem(chaveProjetos, JSON.stringify(dados));
    return true;
  } catch {
    return false;
  }
}

function compartilhamEspaco(a, b) {
  const tipos = new Set([a.tipo, b.tipo]);
  return (tipos.has("pomar") && tipos.has("muda"))
    || (tipos.has("horta") && tipos.has("canteiro"))
    || (tipos.has("acesso") && tipos.has("manobra"));
}

function conflitam(a, b) {
  return sobrepoe(a, b) && !compartilhamEspaco(a, b);
}

export function conflitosEntreItens(itens) {
  return itens.flatMap((item, indice) => itens.slice(indice + 1)
    .filter((outro) => conflitam(item, outro))
    .map((outro) => [item, outro]));
}

export function criarItem(tipo, terreno, itens) {
  const ficha = tiposDeArea[tipo];
  const item = {
    id: novoId(),
    tipo,
    nome: ficha.nome,
    existente: ficha.existente ?? false,
    largura: Math.min(ficha.largura, terreno.largura),
    comprimento: Math.min(ficha.comprimento, terreno.comprimento),
  };
  const proporcoes = [.5, .25, .75, 0, 1];
  const posicoes = proporcoes.flatMap((y) => proporcoes.map((x) => ({
    x: arredondarMedida(x * (terreno.largura - item.largura)),
    y: arredondarMedida(y * (terreno.comprimento - item.comprimento)),
  })));
  const posicao = posicoes.find((ponto) => itens.every((outro) => !conflitam({ ...item, ...ponto }, outro))) ?? posicoes[0];
  return { ...item, ...limitarPosicao(posicao.x, posicao.y, item, terreno) };
}
