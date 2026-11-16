const api = "/api/meu-quintal";
export const sitePublico = "https://igor-vasconcelos.github.io/seu-quintal/";
const siteConta = "https://seu-quintal.igorvasconcelos-vi.chatgpt.site";

export function enderecoDaConta() {
  return `${siteConta}/meu-quintal/${window.location.search}${window.location.hash}`;
}

export function entrarNaConta() {
  const destino = `/meu-quintal/${window.location.search}${window.location.hash}`;
  return `/signin-with-chatgpt?return_to=${encodeURIComponent(destino)}`;
}

export async function carregarConta() {
  const resposta = await fetch(api, { cache: "no-store" });
  if (resposta.status === 401) return null;
  if (!resposta.ok) throw new Error("O Meu Quintal está temporariamente indisponível.");
  return resposta.json();
}

export function armazenamentoDaConta(inicial) {
  let dados = inicial.dados;
  let versao = inicial.versao;
  let fila = false;
  let enviando = false;
  let estado = "salvo";
  const ouvintes = new Set();

  function publicar(novo) {
    estado = novo;
    for (const ouvir of ouvintes) ouvir(estado);
  }

  async function sincronizar() {
    if (enviando || !fila || estado === "conflito" || estado === "sessao") return;
    enviando = true;
    fila = false;
    publicar("salvando");
    try {
      const resposta = await fetch(api, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dados, versao }),
      });
      if (!resposta.ok) {
        fila = true;
        publicar(({ 401: "sessao", 409: "conflito", 413: "tamanho" })[resposta.status] ?? "erro");
        return;
      }
      ({ versao } = await resposta.json());
      publicar(fila ? "salvando" : "salvo");
    } catch {
      fila = true;
      publicar("erro");
    } finally {
      enviando = false;
      if (fila && estado === "salvando") void sincronizar();
    }
  }

  function antesDeSair(evento) {
    if (!fila && !enviando) return;
    evento.preventDefault();
    evento.returnValue = "";
  }

  window.addEventListener("beforeunload", antesDeSair);
  window.addEventListener("online", sincronizar);

  return {
    ler: (chave) => dados[chave] ?? null,
    gravar(novos) {
      dados = { ...dados, ...novos };
      fila = true;
      void sincronizar();
    },
    assinar(ouvir) {
      ouvintes.add(ouvir);
      ouvir(estado);
      return () => ouvintes.delete(ouvir);
    },
    sincronizar,
  };
}
