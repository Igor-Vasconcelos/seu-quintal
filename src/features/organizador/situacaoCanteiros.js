import { culturasOrganizador } from "./culturas.js";
import { avancarDias, dataValida, dimensionarLote, hojeCivil, lotesNoPeriodo } from "./escala.js";

function planosDoCanteiro(canteiro, todos, canteiros) {
  // Compatibilidade com nomes usados antes da introdução de IDs.
  const nomesIguais = canteiros.filter(item => item.nome === canteiro.nome).length;
  return todos.filter(plano => plano.canteiroId === canteiro.id ||
    (!plano.canteiroId && nomesIguais === 1 && plano.canteiro.trim() === canteiro.nome));
}

export function situacaoDosCanteiros(colecao, planos, hoje = hojeCivil()) {
  if (!dataValida(hoje)) throw new Error("Data de referência inválida.");
  const de = avancarDias(hoje, -120);
  const ate = avancarDias(hoje, 120);
  return colecao.itens.map(canteiro => {
    const vinculados = planosDoCanteiro(canteiro, planos, colecao.itens);
    const ocupacoes = vinculados.flatMap(plano => {
      const ficha = culturasOrganizador[plano.cultura];
      if (!ficha) return [];
      return lotesNoPeriodo(plano, de, ate).slice(0, 90).map(lote => ({
        planoId: plano.id, cultura: plano.cultura, numero: lote.numero,
        entrada: lote.canteiro.de, colheita: lote.colheita,
        liberacao: ficha.colheitasSucessivas && !plano.duracao
          ? null : avancarDias(lote.colheita.ate, (plano.duracao ?? 0) * 7),
      }));
    }).sort((a,b) => a.entrada.localeCompare(b.entrada));
    const ativas = ocupacoes.filter(o => o.entrada <= hoje && (o.liberacao === null || o.liberacao >= hoje));
    const proximas = ocupacoes.filter(o => o.entrada > hoje);
    const area = (canteiro.medidas.largura * canteiro.medidas.comprimento) / 10000;
    const demanda = vinculados.reduce((total, plano) => total + dimensionarLote(plano).areaSimultanea, 0);
    let estado = "Sem lotes vinculados";
    let sugestao = "Planeje o primeiro lote e vincule-o a este canteiro.";
    if (ativas.length) {
      estado = "Ocupação prevista";
      const incerto = ativas.some(o => o.liberacao === null);
      const liberacao = incerto ? null : ativas.map(o => o.liberacao).sort().at(-1);
      sugestao = liberacao
        ? "Replantio: conferir liberação após " + liberacao + ", se não houver outros lotes previstos."
        : "Liberação sem data confiável: informe a duração real da colheita antes de replantar.";
    } else if (vinculados.some(plano =>
      culturasOrganizador[plano.cultura]?.colheitasSucessivas && !plano.duracao)) {
      estado = "Liberação não verificada";
      sugestao = "A duração da colheita não foi informada. Confirme no canteiro antes de replantar.";
    } else if (proximas.length) {
      estado = "Próximo plantio previsto";
      sugestao = "Entrada estimada em " + proximas[0].entrada + "; confirme o espaço antes de plantar.";
    } else if (vinculados.length) {
      estado = "Sem ocupação confirmada";
      sugestao = "Não há lote previsto nesta janela. Confira o canteiro antes de reutilizá-lo.";
    }
    return {
      id: canteiro.id, nome: canteiro.nome, area, estado, sugestao,
      culturas: [...new Set(vinculados.map(p => p.cultura))],
      plantasNoDesenho: canteiro.plantas.length,
      planos: vinculados.length, demanda,
      alertaArea: demanda > area + 1e-6,
      proximoLote: proximas[0] ?? null,
      colheitas: ocupacoes.filter(o => o.colheita.ate >= hoje)
        .slice(0, 3).map(o => ({ cultura: o.cultura, ...o.colheita })),
      ocupacoesAtivas: ativas.length,
    };
  });
}
