export const chavesQuintal = {
  terrenos: "seu-quintal:projetos-terreno:v1",
  historico: "seu-quintal:historico-cultivo:v1",
  horta: "seu-quintal:organizador-horta:v1",
};

const fonteLocal = {
  ler: (chave) => window.localStorage.getItem(chave),
  gravar(dados) {
    for (const [chave, valor] of Object.entries(dados)) window.localStorage.setItem(chave, valor);
  },
};

let fonte = fonteLocal;

export function usarDadosDaConta(armazenamento) {
  fonte = armazenamento;
}

export function lerDado(chave) {
  return fonte.ler(chave);
}

export function gravarDado(chave, valor) {
  fonte.gravar({ [chave]: valor });
}

export function gravarCopiaDaConta(dados) {
  fonte.gravar(dados);
}

export function montarCopia() {
  return {
    formato: "seu-quintal",
    versao: 1,
    dados: Object.fromEntries(Object.values(chavesQuintal).flatMap((chave) => {
      const valor = lerDado(chave);
      return valor === null ? [] : [[chave, valor]];
    })),
  };
}

export function lerCopia(texto) {
  const copia = JSON.parse(texto);
  if (copia?.formato !== "seu-quintal" || copia.versao !== 1 || !copia.dados || Array.isArray(copia.dados) || typeof copia.dados !== "object") {
    throw new Error("Selecione uma cópia do Seu Quintal.");
  }
  const dados = {};
  for (const [chave, valor] of Object.entries(copia.dados)) {
    if (!Object.values(chavesQuintal).includes(chave) || typeof valor !== "string") throw new Error("Cópia inválida.");
    const registro = JSON.parse(valor);
    const valido = chave === chavesQuintal.historico
      ? Array.isArray(registro)
      : chave === chavesQuintal.horta
        ? Array.isArray(registro?.planos)
        : registro?.terrenos && typeof registro.terrenos === "object" && !Array.isArray(registro.terrenos);
    if (!valido) throw new Error("Cópia inválida.");
    dados[chave] = valor;
  }
  return dados;
}
