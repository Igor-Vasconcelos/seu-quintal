const enderecoConfigurado = import.meta.env.VITE_API_URL?.trim();
export const apiConfigurada = import.meta.env.DEV ? Boolean(enderecoConfigurado) : enderecoConfigurado === "/api";

export async function solicitarApi(caminho, { metodo = "GET", dados, signal, contaId } = {}) {
  const headers = new Headers();
  if (dados) headers.set("Content-Type", "application/json");
  if (contaId) headers.set("X-Conta-Esperada", contaId);

  let resposta;
  try {
    resposta = await fetch(`/api${caminho}`, {
      method: metodo,
      headers,
      body: dados ? JSON.stringify(dados) : undefined,
      signal,
    });
  } catch (erro) {
    if (erro.name === "AbortError") throw erro;
    throw new Error("Não foi possível acessar a API do Seu Quintal. Tente novamente.");
  }

  const resultado = await resposta.json().catch(() => null);
  if (!resposta.ok || resultado === null) {
    const erro = new Error(resultado?.erro ?? "A API não retornou uma resposta válida. Tente novamente.");
    erro.status = resposta.status;
    throw erro;
  }
  return resultado;
}

export function solicitarProjetos({ id, depois, ...opcoes } = {}) {
  const caminho = id ? `/${encodeURIComponent(id)}` : "";
  const pagina = depois ? `?depois=${encodeURIComponent(depois)}` : "";
  return solicitarApi(`/planejamentos${caminho}${pagina}`, opcoes);
}
