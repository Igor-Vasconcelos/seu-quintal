import { regioes } from "../../data/plantio.js";
import { formularioInicial, lerPlano } from "./escala.js";

export const chaveOrganizador = "seu-quintal:organizador-horta:v1";
export const hortaInicial = { regiao: "Sudeste", area: null, planos: [] };

export function lerOrganizador() {
  const dados = JSON.parse(window.localStorage.getItem(chaveOrganizador) ?? "null");
  if (dados === null) return hortaInicial;
  if (!Array.isArray(dados.planos)) throw new Error("O plano salvo está em um formato inválido.");

  const planos = dados.planos.map((item) => {
    if (typeof item?.id !== "string") throw new Error("Cultivo salvo inválido.");
    const { plano } = lerPlano(formularioInicial(item));
    if (!plano) throw new Error("Cultivo salvo inválido.");
    const concluidas = Array.isArray(item.concluidas) ? item.concluidas.filter((chave) => typeof chave === "string") : [];
    return { ...plano, id: item.id, concluidas };
  });
  return {
    planos, regiao: regioes.includes(dados.regiao) ? dados.regiao : hortaInicial.regiao,
    area: Number.isFinite(dados.area) && dados.area > 0 ? dados.area : null,
  };
}

export function gravarOrganizador(transformar) {
  const atualizado = transformar(lerOrganizador());
  window.localStorage.setItem(chaveOrganizador, JSON.stringify(atualizado));
  return atualizado;
}
