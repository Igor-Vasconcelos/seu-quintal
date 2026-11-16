import { regioes } from "../../data/plantio.js";
import { armazenamentoRecuperavel } from "../armazenamentoLocal.js";
import { formularioInicial, lerPlano } from "./escala.js";

export const chaveOrganizador = "seu-quintal:organizador-horta:v1";
export const hortaInicial = { regiao: "Sudeste", area: null, planos: [] };

function normalizarPlanoSalvo(item) {
  if (typeof item?.id !== "string" || typeof item.cultura !== "string" || typeof item.inicio !== "string") return null;
  if (item.canteiro != null && typeof item.canteiro !== "string") return null;
  try {
    const { plano } = lerPlano(formularioInicial(item));
    if (!plano) return null;
    const concluidas = Array.isArray(item.concluidas) ? item.concluidas.filter((chave) => typeof chave === "string") : [];
    return { ...plano, id: item.id, concluidas };
  } catch {
    return null;
  }
}

function normalizarOrganizador(dados) {
  if (dados === null) return { dados: hortaInicial, incompleto: false };
  const completos = Array.isArray(dados.planos) ? dados.planos : [];
  const planos = completos.map(normalizarPlanoSalvo).filter(Boolean);
  const regiao = regioes.includes(dados.regiao) ? dados.regiao : hortaInicial.regiao;
  const area = Number.isFinite(dados.area) && dados.area > 0 ? dados.area : null;
  return {
    dados: { planos, regiao, area },
    incompleto: !Array.isArray(dados.planos) || planos.length !== completos.length
      || (dados.regiao != null && regiao !== dados.regiao) || (dados.area != null && area === null),
  };
}

export const { ler: lerOrganizador, gravar: gravarOrganizador, recuperar: recuperarOrganizador } =
  armazenamentoRecuperavel(chaveOrganizador, hortaInicial, normalizarOrganizador);
