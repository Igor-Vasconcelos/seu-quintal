import { culturasOrganizador } from "./culturas.js";
import { dataValida, dimensionarLote, projetarLote, situacaoDoPlantio } from "./escala.js";

// Exemplos ajustáveis para iniciar uma conversa sobre a demanda da família.
// NÃO representam consumo médio do IBGE nem uma recomendação nutricional.
export const sugestoesDeConsumo = Object.freeze([
  { cultura: "Alface de verão", grupo: "Folhosas", porPessoa: 0.5, dica: "Colheita concentrada" },
  { cultura: "Alface de inverno", grupo: "Folhosas", porPessoa: 0.5, dica: "Variedade para outra época" },
  { cultura: "Cenoura de verão", grupo: "Raízes", porPessoa: 2, dica: "Muito presente na alimentação" },
  { cultura: "Cenoura de inverno", grupo: "Raízes", porPessoa: 2, dica: "Variedade para outra época" },
  { cultura: "Tomate de mesa", grupo: "Frutos", porPessoa: 0.25, dica: "Comum na mesa brasileira; lote teste" },
  { cultura: "Rúcula", grupo: "Folhosas", porPessoa: 0.5, dica: "Colheita concentrada" },
  { cultura: "Rabanete", grupo: "Raízes", porPessoa: 2, dica: "Ciclo curto" },
  { cultura: "Beterraba", grupo: "Raízes", porPessoa: 1, dica: "Colheita por lote" },
  { cultura: "Couve", grupo: "Folhosas", porPessoa: 0.1, dica: "Colheita de folhas; lote teste" },
  { cultura: "Abobrinha", grupo: "Frutos", porPessoa: 0.25, dica: "Colheitas repetidas; lote teste" },
  { cultura: "Acelga", grupo: "Folhosas", porPessoa: 0.5, dica: "Folhas para saladas e refogados" },
  { cultura: "Almeirão", grupo: "Folhosas", porPessoa: 0.5, dica: "Folhas amargas e nutritivas" },
  { cultura: "Chicória", grupo: "Folhosas", porPessoa: 0.5, dica: "Cultivo de clima ameno" },
  { cultura: "Brócolis de verão", grupo: "Brássicas", porPessoa: 0.25, dica: "Escolha cultivar apropriada ao calor" },
  { cultura: "Brócolis de inverno", grupo: "Brássicas", porPessoa: 0.25, dica: "Atenção aos botões florais" },
  { cultura: "Repolho de verão", grupo: "Brássicas", porPessoa: 0.25, dica: "Cabeças firmes, com cultivar adaptada" },
  { cultura: "Repolho de inverno", grupo: "Brássicas", porPessoa: 0.25, dica: "Atenção ao frio e à irrigação" },
  { cultura: "Coentro", grupo: "Temperos", porPessoa: 0.1, dica: "Planejamento por peso ainda experimental" },
  { cultura: "Cebolinha", grupo: "Temperos", porPessoa: 0.1, dica: "Folhas que podem rebrotar" },
  { cultura: "Espinafre", grupo: "Folhosas", porPessoa: 0.1, dica: "Folhas e cortes sucessivos" },
  { cultura: "Salsa", grupo: "Temperos", porPessoa: 0.1, dica: "Colheita das folhas externas" },
  { cultura: "Feijão-vagem", grupo: "Frutos", porPessoa: 0.25, dica: "Vagens jovens e tenras" },
  { cultura: "Pepino", grupo: "Frutos", porPessoa: 0.25, dica: "Condução em treliça é opcional" },
  { cultura: "Pimentão", grupo: "Frutos", porPessoa: 0.25, dica: "Colhido verde ou maduro" },
  { cultura: "Berinjela", grupo: "Frutos", porPessoa: 0.25, dica: "Frutos firmes" },
  { cultura: "Quiabo", grupo: "Frutos", porPessoa: 0.25, dica: "Requer colheita frequente" },
  { cultura: "Morango", grupo: "Frutos", porPessoa: 0.1, dica: "Risco de doenças com excesso de umidade" },
]);

export function intervaloPadrao(cultura) {
  const ficha = culturasOrganizador[cultura];
  return ficha?.colheitasSucessivas ? 4 : 1;
}

export function metaExemplo(cultura, pessoas) {
  const item = sugestoesDeConsumo.find(s => s.cultura === cultura);
  return item && Number.isInteger(pessoas) && pessoas >= 1 && pessoas <= 20
    ? Math.round(item.porPessoa * pessoas * 100) / 100 : null;
}

// Faz reserva CONSERVADORA de área simultânea nos canteiros, sem desenhar a posição física.
// Canteiros com mais de uma cultura exigem posterior conferência geométrica no editor.
function distribuirReservas(canteiros, reservadoExistente, novos) {
  const espacos = canteiros.map((canteiro, i) => ({
    nome: "Canteiro " + (i + 1), area: canteiro.area, usada: 0,
  }));
  function alocar(area) {
    let restante = area;
    const destinos = [];
    for (const espaco of espacos) {
      if (restante <= 1e-8) break;
      const livre = Math.max(0, espaco.area - espaco.usada);
      const usar = Math.min(livre, restante);
      if (usar > 1e-8) {
        espaco.usada += usar;
        restante -= usar;
        destinos.push({ nome: espaco.nome, area: Math.round(usar * 100) / 100 });
      }
    }
    return { destinos, restante: Math.max(0, restante) };
  }
  alocar(reservadoExistente);
  return novos.map(({ plano, area, ...resto }) => {
    const { destinos, restante } = alocar(area);
    const nomes = destinos.map(d => d.nome);
    return {
      ...resto, area, reservas: destinos,
      semEspaco: restante > 1e-6,
      plano: { ...plano, canteiro: nomes.join(", ").slice(0, 60) },
    };
  });
}

export function calcularPlanoFamiliar({
  pessoas, quantidadeCanteiros, largura, comprimento, inicio, regiao,
  preferencias, planosExistentes = [], modoEspaco = "existente",
}) {
  if (!Number.isInteger(pessoas) || pessoas < 1 || pessoas > 20)
    return { erro: "Informe de 1 a 20 pessoas na família." };
  const automatico = modoEspaco === "automatico";
  if (!automatico && modoEspaco !== "existente")
    return { erro: "Selecione como deseja planejar o espaço." };
  if (!automatico && (!Number.isInteger(quantidadeCanteiros) || quantidadeCanteiros < 1 || quantidadeCanteiros > 24 ||
    !Number.isFinite(largura) || !Number.isFinite(comprimento) ||
    largura < 0.3 || largura > 3 || comprimento < 0.3 || comprimento > 20))
    return { erro: "Informe de 1 a 24 canteiros, largura de 0,30 a 3 m e comprimento de 0,30 a 20 m." };
  if (!dataValida(inicio)) return { erro: "Informe uma data válida para começar o planejamento." };
  if (!Array.isArray(preferencias) || preferencias.length === 0)
    return { erro: "Selecione pelo menos uma cultura." };
  const culturas = new Set();
  const existentes = new Set(planosExistentes.map(plano => plano.cultura));
  const novos = [];
  for (const item of preferencias) {
    const ficha = culturasOrganizador[item.cultura];
    if (!ficha || culturas.has(item.cultura)) return { erro: "Culturas repetidas ou não cadastradas." };
    if (existentes.has(item.cultura)) return { erro: item.cultura + " já possui um cultivo na agenda. Edite o plano existente para evitar duplicar lotes." };
    culturas.add(item.cultura);
    if (typeof item.casa !== "number" || typeof (item.venda ?? 0) !== "number")
      return { erro: "Informe metas numéricas válidas para " + item.cultura + "." };
    const casa = item.casa, venda = item.venda ?? 0;
    if (!Number.isFinite(casa) || casa < 0 || casa > 10000 ||
      !Number.isFinite(venda) || venda < 0 || venda > 10000 ||
      casa + venda <= 0)
      return { erro: "Informe metas semanais positivas, em " + ficha.unidade + ", para " + item.cultura + "." };
    const intervalo = item.intervalo === undefined ? intervaloPadrao(item.cultura) : item.intervalo;
    if (!Number.isInteger(intervalo) || intervalo < 1 || intervalo > 52)
      return { erro: "Informe um intervalo de 1 a 52 semanas para " + item.cultura + "." };
    const plano = {
      cultura: item.cultura, origem: ficha.somenteMuda ? "muda" : "semente", inicio,
      canteiro: "", casa, venda, intervalo,
      rendimento: null, duracao: null, teste: 2,
    };
    const dimensionamento = dimensionarLote(plano);
    const seguintes = [0, 1, 2].map(i => projetarLote(plano, i));
    const primeiro = seguintes[0];
    const alertaEpoca = seguintes.map(lote =>
      situacaoDoPlantio(plano, regiao, lote.canteiro.de, lote.canteiro.ate)
    ).find(Boolean) ?? "";
    novos.push({
      plano, area: dimensionamento.areaSimultanea,
      plantas: dimensionamento.plantas,
      experimental: dimensionamento.experimental,
      alertaEpoca, primeiraColheita: primeiro.colheita, seguintes,
    });
  }
  // Modo automático: calcula primeiro a demanda. Canteiros de 1 × 3 m são
  // apenas unidades equivalentes de visualização, nunca planta em escala.
  // O limite de 24 protege interface e alocação; a demanda real é preservada.
  const larguraModelo = automatico ? 1 : largura;
  const comprimentoModelo = automatico ? 3 : comprimento;
  const areaCanteiro = larguraModelo * comprimentoModelo;
  const reservada = planosExistentes.reduce((soma, plano) => soma + dimensionarLote(plano).areaSimultanea, 0);
  const estimativaNova = novos.reduce((soma, item) => soma + item.area, 0);
  const areaNecessariaM2 = reservada + estimativaNova;
  const canteirosNecessarios = Math.max(1, Math.ceil((areaNecessariaM2 - 1e-8) / areaCanteiro));
  const quantidadeConsiderada = automatico ? Math.min(24, canteirosNecessarios) : quantidadeCanteiros;
  const areaTotal = areaCanteiro * quantidadeConsiderada;
  const canteiros = Array.from({ length: quantidadeConsiderada }, () => ({ area: areaCanteiro }));
  const sugestoes = distribuirReservas(canteiros, reservada, novos);
  const falta = Math.max(0, reservada + estimativaNova - areaTotal);
  return {
    erro: null, sugestoes, areaCanteiro, areaTotal, areaReservada: reservada,
    areaNova: estimativaNova, areaNecessariaM2, faltaArea: falta,
    modoEspaco, quantidadeConsiderada, larguraModelo, comprimentoModelo,
    cabe: falta <= 1e-6 && sugestoes.every(item => !item.semEspaco),
    canteirosNecessarios,
    avisos: [
      ...(sugestoes.some(item => item.experimental)
        ? ["Culturas de colheitas sucessivas começam com 2 plantas de teste. Sem rendimento medido, não é possível prometer a meta em kg."] : []),
      ...(sugestoes.some(item => item.alertaEpoca)
        ? ["Um ou mais dos três primeiros lotes têm entrada no canteiro fora ou parcialmente fora da época regional de referência."] : []),
      ...(planosExistentes.length
        ? ["A área dos cultivos já cadastrados foi reservada no cálculo, mas sua localização física não foi verificada."] : []),
      ...(automatico && canteirosNecessarios > 24
        ? ["A demanda equivale a mais de 24 canteiros-modelo. Reduza metas ou adapte o desenho antes de salvar."] : []),
      "A área considera espaço simultâneo de cultivo, mas não inclui corredores, acessos, bordaduras ou folgas para manejo.",
      "As reservas são estimativas simultâneas, não a planta geométrica final. Confira o posicionamento no Planejador de Canteiros.",
    ],
  };
}
