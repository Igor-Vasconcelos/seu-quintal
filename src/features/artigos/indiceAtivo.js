/**
 * Progressive enhancement do índice do artigo estático.
 * Âncoras continuam utilizáveis sem JavaScript.
 * Mobile: painel recolhível nativo. Desktop: painel aberto e sticky.
 */
export function iniciarIndiceAtivo(doc = document, win = window) {
  const nav = doc.querySelector(".sq-article .sq-toc");
  const details = nav?.querySelector("details");
  if (!nav || !details) return () => {};

  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const secoes = links.map(link => {
    const id = link.getAttribute("href").slice(1);
    return { link, elemento: doc.getElementById(id) };
  }).filter(item => item.elemento);
  if (!secoes.length) return () => {};

  const grande = win.matchMedia("(min-width: 1081px)");
  function ajustarPainel() { details.open = grande.matches; }
  ajustarPainel();
  grande.addEventListener?.("change", ajustarPainel);

  let ativo = null;
  let agendado = false;
  function atualizar() {
    agendado = false;
    const limite = Math.min(220, win.innerHeight * .32);
    // Última seção que alcançou o início da área de leitura.
    const corrente = [...secoes].reverse().find(({ elemento }) =>
      elemento.getBoundingClientRect().top <= limite
    ) ?? secoes[0];
    if (corrente.link === ativo) return;
    ativo = corrente.link;
    for (const { link } of secoes) {
      if (link === ativo) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  }
  function agendar() {
    if (agendado) return;
    agendado = true;
    win.requestAnimationFrame(atualizar);
  }

  // Observer ajuda a detectar mudanças de seção sem depender só do scroll.
  const observador = typeof win.IntersectionObserver === "function"
    ? new win.IntersectionObserver(agendar, {
      rootMargin: "-15% 0px -65% 0px",
      threshold: [0, 1],
    })
    : null;
  secoes.forEach(({ elemento }) => observador?.observe(elemento));
  win.addEventListener("scroll", agendar, { passive: true });
  win.addEventListener("resize", agendar, { passive: true });
  win.addEventListener("hashchange", agendar);
  agendar();

  return () => {
    observador?.disconnect();
    grande.removeEventListener?.("change", ajustarPainel);
    win.removeEventListener("scroll", agendar);
    win.removeEventListener("resize", agendar);
    win.removeEventListener("hashchange", agendar);
  };
}
