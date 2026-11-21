import Icone from "./Icone.jsx";
import "../styles/rodape.css";
import "../styles/site-shell.css";

export default function Rodape({ inicio = false, sisteminha = false, raiz = "./", pagina, aoVerCreditos }) {
  const home = inicio ? "#inicio" : raiz;
  const grupos = [
    { titulo: "Aprenda", links: [
      ["Horta e jardim", "horta/"],
      ["Guias práticos", "guias/"],
      ["Artigos", "artigos/"],
      ["Sisteminha Embrapa", "sisteminha.html"],
    ] },
    { titulo: "Planeje", links: [
      ["Calendário de plantio", "horta/calendario-de-plantio/"],
      ["Planejador de canteiros", "horta/canteiros/"],
      ["Organizador de horta", "horta/organizador/"],
      ["Meu Quintal", "meu-quintal/"],
    ] },
  ];
  return (
    <footer className="rodape rodape-v3">
      <div className="rodape-conteudo">
        <div className="rodape-identidade">
          <a href={home} className="marca site-marca">
            <span className="marca-simbolo"><Icone nome="muda"/></span>
            <span className="site-marca-texto"><strong>Seu Quintal</strong><small>Da primeira muda ao seu sítio.</small></span>
          </a>
          <p>Conhecimento e ferramentas gratuitas para cultivar, cuidar dos animais e organizar seu espaço produtivo.</p>
          <span className="rodape-apoio">Aprenda no seu ritmo. Planeje com confiança.</span>
        </div>
        {grupos.map(grupo => (
          <nav className="rodape-navegacao" key={grupo.titulo} aria-label={grupo.titulo}>
            <h2>{grupo.titulo}</h2>
            <ul>
              {grupo.links.map(([titulo, rota]) => {
                const atual = rota === "sisteminha.html" ? sisteminha
                  : rota === "horta/" ? pagina === "horta"
                  : rota === "artigos/" ? pagina === "artigos"
                  : rota === "guias/" ? pagina === "guias" : false;
                return <li key={rota}><a href={raiz + rota} aria-current={atual ? "page" : undefined}>
                  {titulo}
                </a></li>;
              })}
            </ul>
          </nav>
        ))}
      </div>
      <div className="rodape-base">
        <span>© Seu Quintal · Conteúdo educativo independente.</span>
        <div className="rodape-utilidades">
          {aoVerCreditos && <button type="button" onClick={aoVerCreditos}>Sobre as imagens</button>}
          <a href={raiz + "mapa-do-site/"}>Mapa do site</a>
          <a href="#inicio" className="rodape-topo">Voltar ao topo <Icone nome="seta"/></a>
        </div>
      </div>
    </footer>
  );
}
