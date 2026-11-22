import Icone from "./Icone.jsx";
import "../styles/rodape.css";
import "../styles/site-shell.css";
import "../styles/rodape-v4.css";

export default function Rodape({ inicio = false, sisteminha = false, raiz = "./", pagina, aoVerCreditos }) {
  const home = inicio ? "#inicio" : raiz;
  // Preservar rotas reais e distribuir o mesmo número de destinos por assunto.
  const grupos = [
    { titulo: "Aprenda", links: [
      ["Horta e jardim", "horta/"],
      ["Guias práticos", "guias/"],
      ["Artigos", "artigos/"],
      ["Sisteminha Embrapa", "sisteminha.html"],
    ] },
    { titulo: "Planeje", links: [
      ["Todas as ferramentas", "ferramentas/"],
      ["Calendário de plantio", "horta/calendario-de-plantio/"],
      ["Planejador de canteiros", "horta/canteiros/"],
      ["Organizador de horta", "horta/organizador/"],
    ] },
    { titulo: "Cuide e organize", links: [
      ["Meu Quintal", "meu-quintal/"],
      ["Planejador de pomar", "ferramentas/planejador-de-pomar/"],
      ["Calculadora de peixes", "ferramentas/calculadora-peixes/"],
      ["Calculadora de codornas", "ferramentas/calculadora-codornas/"],
    ] },
  ];
  return (
    <footer className="rodape rodape-v3">
      <div className="rodape-conteudo">
        <div className="rodape-identidade">
          <a href={home} className="marca site-marca">
            <span className="marca-simbolo site-marca-emblema">
              <img src={raiz + "imagens/marca-seu-quintal.svg"} width="58" height="58"
                alt="" aria-hidden="true" loading="lazy" />
            </span>
            <span className="site-marca-texto"><strong>Seu Quintal</strong><small>Da primeira muda ao seu sítio.</small></span>
          </a>
          <p>Ideias e ferramentas gratuitas para cuidar da sua horta, dos animais e do espaço que você tem — ou sonha em ter.</p>
          <span className="rodape-apoio"><Icone nome="muda"/> Comece gratuitamente, sem precisar de uma conta.</span>
        </div>
        {grupos.map(grupo => (
          <nav className="rodape-navegacao" key={grupo.titulo} aria-label={grupo.titulo}>
            <h2>{grupo.titulo}</h2>
            <ul>
              {grupo.links.map(([titulo, rota]) => {
                const atual = rota === "sisteminha.html" ? sisteminha
                  : rota === "horta/" ? pagina === "horta"
                  : rota === "artigos/" ? pagina === "artigos"
                  : rota === "guias/" ? pagina === "guias"
                  : rota === "meu-quintal/" ? pagina === "meu-quintal"
                  : rota === "ferramentas/" ? pagina === "ferramentas" : false;
                return <li key={rota}><a href={raiz + rota}
                  className={rota === "meu-quintal/" ? "rodape-link-quintal" : undefined}
                  aria-current={atual ? "page" : undefined}>
                  {rota === "meu-quintal/" && <Icone nome="meu-quintal"/>}
                  <span>{titulo}</span>
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
