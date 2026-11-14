const endereco = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "");

export const apiConfigurada = Boolean(endereco);

export async function solicitarProjetos({ id, metodo = "GET", dados, signal } = {}) {
  const caminho = id ? `/${encodeURIComponent(id)}` : "";
  let resposta;
  try {
    resposta = await fetch(`${endereco}/planejamentos${caminho}`, {
      method: metodo,
      headers: dados ? { "Content-Type": "application/json" } : undefined,
      body: dados ? JSON.stringify(dados) : undefined,
      signal,
    });
  } catch (erro) {
    if (erro.name === "AbortError") throw erro;
    throw new Error("Não foi possível acessar a API do Seu Quintal. Confira se o servidor está rodando.");
  }

  const resultado = await resposta.json().catch(() => null);
  if (!resposta.ok || resultado === null) {
    throw new Error(resultado?.erro ?? "A API não retornou uma resposta válida. Tente novamente.");
  }
  return resultado;
}
