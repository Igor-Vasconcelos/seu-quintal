import { arredondarMedida, cabeNoTerreno, criarTerreno, formatarMedida, limitarPosicao, sobrepoe } from "./geometria.js";

export const chaveProjetos = "seu-quintal:projetos-terreno:v1";

export const tiposDeArea = {
  canteiro: { nome: "Canteiro", largura: 1.2, comprimento: 3, cor: "horta" },
  casa: { nome: "Casa", largura: 8, comprimento: 10, cor: "construcao" },
  acesso: { nome: "Acesso para caminhão", largura: 4, comprimento: 12, cor: "caminho" },
  manobra: { nome: "Área de manobra", largura: 8, comprimento: 8, cor: "caminho" },
  pomar: { nome: "Pomar", largura: 8, comprimento: 8, cor: "pomar" },
  horta: { nome: "Horta", largura: 4, comprimento: 6, cor: "horta" },
  tanque: { nome: "Tanque de peixes", largura: 5, comprimento: 5, cor: "agua" },
  galinheiro: { nome: "Galinheiro", largura: 3, comprimento: 4, cor: "animais" },
  chiqueiro: { nome: "Chiqueiro", largura: 3, comprimento: 4, cor: "animais" },
  compostagem: { nome: "Compostagem", largura: 2, comprimento: 2, cor: "pomar" },
  fogueira: { nome: "Fogueira", largura: 4, comprimento: 4, cor: "fogueira" },
  galpao: { nome: "Galpão", largura: 4, comprimento: 5, cor: "construcao" },
  plantio: { nome: "Faixa de plantio", largura: 2, comprimento: 6, cor: "cultivo", existente: true },
  muda: { nome: "Muda ou árvore", largura: 0, comprimento: 0, cor: "pomar", existente: true },
  outro: { nome: "Outra área", largura: 3, comprimento: 3, cor: "construcao" },
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

export const versaoProjetos = 2;
const projetosIniciais = { versao: versaoProjetos, terrenoAtivo: null, terrenos: {} };

// Mantida para ler o formato antigo, que identificava terrenos pelas dimensões.
export function chaveDoTerreno(terreno) {
  return `${terreno.largura}x${terreno.comprimento}`;
}

export function novoId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function nomeDoTerreno(nome, medidas) {
  const informado = typeof nome === "string" ? nome.trim().replace(/\s+/g, " ").slice(0, 80) : "";
  return informado || `Terreno ${formatarMedida(medidas.largura)} × ${formatarMedida(medidas.comprimento)} m`;
}

export function criarRegistroTerreno(medidas, nome = "", id = novoId()) {
  return {
    id,
    nome: nomeDoTerreno(nome, medidas),
    medidas,
    projeto: {
      ...projetoInicial,
      cenarios: projetoInicial.cenarios.map((cenario) => ({ ...cenario, itens: [] })),
    },
  };
}

function normalizarProjetoAntigo(projeto, medidas) {
  if (!Array.isArray(projeto?.cenarios)) return null;
  const cenarios = projeto.cenarios.filter((cenario) =>
    typeof cenario?.id === "string" && typeof cenario.nome === "string" && Array.isArray(cenario.itens)
  ).map((cenario) => ({
    ...cenario,
    itens: cenario.itens.filter((item) => item && Object.hasOwn(tiposDeArea, item.tipo)
      && typeof item.id === "string" && typeof item.nome === "string"
      && [item.x, item.y, item.largura, item.comprimento].every(Number.isFinite)
      && (item.tipo === "muda" ? item.largura === 0 && item.comprimento === 0
        : item.largura > 0 && item.comprimento > 0)
      && cabeNoTerreno(item, medidas)),
  }));
  if (!cenarios.length) return null;
  return {
    ativo: cenarios.find(({ id }) => id === projeto.ativo)?.id ?? cenarios[0].id,
    estrada: projeto.estrada !== false,
    declive: Object.hasOwn(declives, projeto.declive) ? projeto.declive : "",
    cenarios,
  };
}

// O ID legado é determinístico: a mesma chave antiga produz sempre o mesmo ID.
export function migrarProjetos(dados) {
  if (dados?.versao === versaoProjetos && dados.terrenos
    && typeof dados.terrenos === "object" && !Array.isArray(dados.terrenos)) return dados;
  if (!dados?.terrenos || typeof dados.terrenos !== "object" || Array.isArray(dados.terrenos)) {
    return { ...projetosIniciais, terrenos: {} };
  }
  const terrenos = {};
  for (const [chave, projetoAntigo] of Object.entries(dados.terrenos)) {
    const medidas = criarTerreno(...chave.split("x"));
    if (!medidas || chaveDoTerreno(medidas) !== chave) continue;
    const projeto = normalizarProjetoAntigo(projetoAntigo, medidas);
    if (!projeto) continue;
    const id = `legado-${chave}`;
    terrenos[id] = { id, nome: nomeDoTerreno("", medidas), medidas, projeto };
  }
  const ultimo = dados.ultimoTerreno && criarTerreno(
    String(dados.ultimoTerreno.largura), String(dados.ultimoTerreno.comprimento),
  );
  const idAtivo = ultimo ? `legado-${chaveDoTerreno(ultimo)}` : null;
  return {
    versao: versaoProjetos,
    terrenoAtivo: idAtivo && terrenos[idAtivo] ? idAtivo : Object.keys(terrenos)[0] ?? null,
    terrenos,
  };
}

export function lerProjetos() {
  try {
    const bruto = window.localStorage.getItem(chaveProjetos);
    return migrarProjetos(bruto === null ? null : JSON.parse(bruto));
  } catch {
    return { ...projetosIniciais, terrenos: {} };
  }
}

export function salvarProjetos(dados) {
  try {
    window.localStorage.setItem(chaveProjetos, JSON.stringify(migrarProjetos(dados)));
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
