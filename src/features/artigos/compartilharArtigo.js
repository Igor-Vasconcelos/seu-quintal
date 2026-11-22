/**
 * Compartilhamento progressivo: sem cookies, tracking ou dependência de conta.
 * Compartilha a URL canônica da página; texto continua indexável sem JavaScript.
 */
export function iniciarCompartilhamentoArtigo(doc = document, win = window) {
  const botao = doc.querySelector(".sq-article [data-sq-share]");
  const retorno = doc.querySelector(".sq-article .sq-share-feedback");
  if (!botao || !retorno) return () => {};
  const compartilhar = async () => {
    const canonical = doc.querySelector('link[rel="canonical"]')?.href || win.location.href;
    const titulo = doc.querySelector(".sq-article h1")?.textContent?.trim() || doc.title;
    retorno.textContent = "";
    try {
      if (typeof win.navigator.share === "function") {
        await win.navigator.share({ title: titulo, url: canonical });
        return;
      }
      if (typeof win.navigator.clipboard?.writeText === "function") {
        await win.navigator.clipboard.writeText(canonical);
        retorno.textContent = "Link copiado para compartilhar.";
        return;
      }
      retorno.textContent = "Link para compartilhar: " + canonical;
    } catch (error) {
      if (error?.name !== "AbortError") {
        retorno.textContent = "Não foi possível compartilhar. Copie o endereço do navegador.";
      }
    }
  };
  botao.addEventListener("click", compartilhar);
  return () => botao.removeEventListener("click", compartilhar);
}
