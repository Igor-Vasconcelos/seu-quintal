import { novoId } from "./planejador/projetos.js";

export function comBloqueioLocal(chave, tarefa) {
  const bloqueios = window.navigator?.locks;
  return bloqueios ? bloqueios.request(chave, tarefa) : Promise.resolve().then(tarefa);
}

export function armazenamentoRecuperavel(chave, inicial, normalizar) {
  function ler() {
    const bruto = window.localStorage.getItem(chave);
    if (bruto === null) return { dados: inicial, corrompido: null };
    try {
      const { dados, incompleto } = normalizar(JSON.parse(bruto));
      return { dados, corrompido: incompleto ? bruto : null };
    } catch {
      return { dados: inicial, corrompido: bruto };
    }
  }

  function gravar(atualizar) {
    return comBloqueioLocal(chave, () => {
      const { dados, corrompido } = ler();
      if (corrompido !== null) throw new Error("Recupere os dados antes de salvar.");
      const atualizados = atualizar(dados);
      window.localStorage.setItem(chave, JSON.stringify(atualizados));
      return { dados: atualizados, corrompido: null };
    });
  }

  function recuperar(original) {
    return comBloqueioLocal(chave, () => {
      const leitura = ler();
      if (leitura.corrompido === null || leitura.corrompido !== original) return leitura;

      const copia = `${chave}:copia:${novoId()}`;
      window.localStorage.setItem(copia, original);
      try {
        window.localStorage.setItem(chave, JSON.stringify(leitura.dados));
      } catch (erro) {
        window.localStorage.removeItem(copia);
        throw erro;
      }
      return { dados: leitura.dados, corrompido: null };
    });
  }

  return { ler, gravar, recuperar };
}
