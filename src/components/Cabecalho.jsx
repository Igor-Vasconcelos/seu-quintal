import Icone from "./Icone.jsx";

export default function Cabecalho({ sisteminha = false, raiz = "./", pagina, children }) {
  const naHome = pagina === "inicio";
  const inicio = naHome ? "#inicio" : raiz;

  return (
    <header className="topo">
      <div className="topo-miolo">
        <a href={inicio} className="marca">
          <Icone nome="muda" />Seu Quintal
        </a>
        <nav className="menu" aria-label="Menu principal">
          <a href={inicio} aria-current={naHome ? "page" : undefined}>Início</a>
          <a href={`${raiz}guias/`} aria-current={pagina === "guias" ? "page" : undefined}>Guias</a>
          <a href={naHome ? "#categorias" : `${raiz}#categorias`}>Categorias</a>
          <a href={`${raiz}horta/calendario-de-plantio/`} aria-current={pagina === "calendario" ? "page" : undefined}>Calendário</a>
          <a href={sisteminha ? "#inicio" : `${raiz}sisteminha.html`}
            aria-current={sisteminha ? "page" : undefined}>Sisteminha</a>
        </nav>
        {children ?? (pagina === "meu-quintal"
          ? <a className="botao" href="#terreno" aria-current="page">Meu Quintal</a>
          : <a className="botao" href={`${raiz}meu-quintal/`} target="_blank" rel="noopener">Meu Quintal</a>)}
      </div>
    </header>
  );
}
