import Icone from "./Icone.jsx";
import "../styles/rodape.css";

export default function Rodape({ inicio = false, sisteminha = false, raiz = "./", pagina, aoVerCreditos }) {
  const home = inicio ? "" : raiz;

  return (
    <footer className="rodape">
      <div className="rodape-conteudo">
        <div className="rodape-identidade">
          <a href={home || "#inicio"} className="marca">
            <Icone nome="muda" />Seu Quintal
          </a>
          <p>Ferramentas e guias para cultivar e planejar seu espaço.</p>
        </div>
        <nav className="rodape-navegacao" aria-labelledby="titulo-rodape">
          <h2 id="titulo-rodape">Explore o site</h2>
          <ul>
            <li><a href={`${raiz}horta/`} aria-current={pagina === "horta" ? "page" : undefined}>Horta em pequenos espaços</a></li>
            <li><a href={`${raiz}horta/calendario-de-plantio/`} aria-current={pagina === "calendario" ? "page" : undefined}>Calendário de plantio</a></li>
            <li><a href={`${home}#planejador`}>Planejador de terreno</a></li>
            <li><a href={`${home}#guias`}>Guias para começar</a></li>
            <li><a href={sisteminha ? "#inicio" : `${raiz}sisteminha.html`} aria-current={sisteminha ? "page" : undefined}>Sisteminha Embrapa</a></li>
            <li><a href={`${raiz}mapa-do-site/`} aria-current={pagina === "mapa" ? "page" : undefined}>Mapa do site</a></li>
          </ul>
        </nav>
      </div>

      <div className="rodape-base">
        {aoVerCreditos && <button type="button" onClick={aoVerCreditos}>Sobre as imagens</button>}
        <a href="#inicio" className="rodape-topo">Voltar ao topo <Icone nome="seta" /></a>
      </div>
    </footer>
  );
}
