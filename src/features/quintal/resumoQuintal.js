import { criarTerreno } from "../planejador/geometria.js";
import { chaveDoTerreno } from "../planejador/projetos.js";

/**
 * Resume apenas dados já salvos. Não estima área ocupada, produção nem custos.
 * Os projetos existentes continuam identificados por dimensões até uma migração futura.
 */
export function resumirProjetosQuintal(dados) {
  const terrenos = Object.entries(dados?.terrenos ?? {}).map(([id, projeto]) => ({
    id,
    projeto,
    medidas: criarTerreno(...id.split("x")),
  })).filter(({ medidas, projeto }) => medidas && Array.isArray(projeto?.cenarios));

  const totalCenarios = terrenos.reduce((total, { projeto }) => total + projeto.cenarios.length, 0);
  const ultimaChave = dados?.ultimoTerreno ? chaveDoTerreno(dados.ultimoTerreno) : null;
  const atual = terrenos.find(({ id }) => id === ultimaChave) ?? terrenos[0] ?? null;
  const cenarioAtivo = atual?.projeto.cenarios.find(({ id }) => id === atual.projeto.ativo)
    ?? atual?.projeto.cenarios[0] ?? null;

  return {
    terrenos,
    totalCenarios,
    atual,
    itensNoCenarioAtivo: Array.isArray(cenarioAtivo?.itens) ? cenarioAtivo.itens.length : 0,
  };
}
