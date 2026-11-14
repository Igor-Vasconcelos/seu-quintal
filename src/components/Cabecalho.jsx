import Icone from "./Icone.jsx";

export default function Cabecalho({ sisteminha = false, children }) {
  const inicio = sisteminha ? "./" : "";

  return (
    <header className={sisteminha ? "topo topo-sisteminha" : "topo"}>
      <a href={sisteminha ? "./" : "#inicio"} className="marca">
        <Icone nome="muda" />Seu Quintal
      </a>
      <nav className="menu" aria-label="Menu principal">
        <a href={`${inicio}#calendario`}>Calendário</a>
        <a href={`${inicio}#guias`}>Guias</a>
        <a className="botao botao-terracota menu-sisteminha"
          href={sisteminha ? "#inicio" : "./sisteminha.html"}
          aria-current={sisteminha ? "page" : undefined}>
          Sisteminha Embrapa
        </a>
      </nav>
      {children}
    </header>
  );
}
