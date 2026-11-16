import Icone from "./Icone.jsx";

export default function Cabecalho({ sisteminha = false, raiz = "./", pagina, children }) {
  const inicio = sisteminha || pagina ? raiz : "";

  return (
    <header className={sisteminha ? "topo topo-sisteminha" : "topo"}>
      <a href={inicio || "#inicio"} className="marca">
        <Icone nome="muda" />Seu Quintal
      </a>
      <nav className="menu" aria-label="Menu principal">
        <a href={`${raiz}horta/`} aria-current={pagina === "horta" ? "page" : undefined}>Horta</a>
        <a href={`${raiz}horta/calendario-de-plantio/`} aria-current={pagina === "calendario" ? "page" : undefined}>Calendário</a>
        <a href={`${inicio}#guias`}>Guias</a>
        <a className="botao botao-terracota menu-sisteminha"
          href={sisteminha ? "#inicio" : `${raiz}sisteminha.html`}
          aria-current={sisteminha ? "page" : undefined}>
          Sisteminha Embrapa
        </a>
      </nav>
      {children}
    </header>
  );
}
