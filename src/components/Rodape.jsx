import Icone from "./Icone.jsx";
import "../styles/rodape.css";

export default function Rodape({ inicio = false, aoVerCreditos }) {
  const home = inicio ? "" : "./";

  return (
    <footer className="rodape">
      <div className="rodape-conteudo">
        <div className="rodape-identidade">
          <a href={inicio ? "#inicio" : "./"} className="marca">
            <Icone nome="muda" />Seu Quintal
          </a>
          <p>Ferramentas e guias para cultivar e planejar seu espaço.</p>
        </div>
        <nav className="rodape-navegacao" aria-labelledby="titulo-rodape">
          <h2 id="titulo-rodape">Explore o site</h2>
          <ul>
            <li><a href={`${home}#calendario`}>Calendário de plantio</a></li>
            <li><a href={`${home}#planejador`}>Planejador de terreno</a></li>
            <li><a href={`${home}#guias`}>Guias para começar</a></li>
            <li><a href={inicio ? "./sisteminha.html" : "#inicio"} aria-current={inicio ? undefined : "page"}>Sisteminha Embrapa</a></li>
          </ul>
        </nav>
      </div>

      <div className="rodape-base">
        <button type="button" onClick={aoVerCreditos}>Sobre as imagens</button>
        <a href="#inicio" className="rodape-topo">Voltar ao topo <Icone nome="seta" /></a>
      </div>
    </footer>
  );
}
