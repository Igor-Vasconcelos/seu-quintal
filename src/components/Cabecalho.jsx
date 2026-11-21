import { useId, useRef, useState } from "react";
import Icone from "./Icone.jsx";

export default function Cabecalho({ sisteminha = false, raiz = "./", pagina }) {
  const [aberto, definirAberto] = useState(false);
  const botaoMenu = useRef(null);
  const idMenu = useId();
  const naHome = pagina === "inicio";
  const noPainel = pagina === "meu-quintal";
  const nosGuias = ["guias", "horta", "organizador", "compostagem", "irrigacao"].includes(pagina);
  const inicio = naHome ? "#inicio" : raiz;

  function fecharComEscape(evento) {
    if (evento.key !== "Escape" || !aberto) return;
    definirAberto(false);
    botaoMenu.current.focus();
  }

  return (
    <header className="topo" onKeyDown={fecharComEscape}>
      <div className="topo-miolo">
        <a href={inicio} className="marca">
          <span className="marca-simbolo"><Icone nome="muda" /></span>Seu Quintal
        </a>
        <button ref={botaoMenu} className="menu-alternar" type="button" aria-expanded={aberto}
          aria-controls={idMenu} onClick={() => definirAberto(!aberto)}>
          <Icone nome={aberto ? "fechar" : "menu"} /> Menu
        </button>
        <nav className={aberto ? "menu menu-aberto" : "menu"} id={idMenu} aria-label="Menu principal"
          onClick={(evento) => {
            if (aberto && evento.target.closest("a")) {
              definirAberto(false);
              botaoMenu.current.focus();
            }
          }}>
          <div className="menu-links">
            <a href={inicio} aria-current={naHome ? "page" : undefined}>Início</a>
            <a href={`${raiz}horta/calendario-de-plantio/`}
              aria-current={pagina === "calendario" ? "page" : undefined}>Calendário</a>
            <a href={`${raiz}artigos/`} aria-current={pagina === "artigos" ? "page" : undefined}>Artigos</a>
            <a href={`${raiz}guias/`} aria-current={pagina === "guias" ? "page" : undefined}
              data-secao-atual={nosGuias || undefined}>Guias</a>
            <a href={sisteminha ? "#inicio" : `${raiz}sisteminha.html`}
              aria-current={sisteminha ? "page" : undefined}>Sisteminha</a>
          </div>
          {noPainel
            ? <a className="botao menu-quintal" href="#terreno" aria-current="page">Meu Quintal</a>
            : <a className="botao menu-quintal" href={`${raiz}meu-quintal/`} target="_blank" rel="noopener"
                aria-label="Meu Quintal (abre em nova aba)">Meu Quintal <Icone nome="novaAba" /></a>}
        </nav>
      </div>
    </header>
  );
}
