import Icone from "../components/Icone.jsx";
import { catalogoFerramentas, gruposFerramentas } from "../data/catalogoFerramentas.js";
import "../styles/descoberta-ferramentas-v4.css";

export default function CatalogoFerramentas({ raiz="../" }) {
  return <section className="ferramentas-catalogo" aria-labelledby="catalogo-ferramentas-titulo">
    <header className="ferramentas-catalogo-intro">
      <h2 id="catalogo-ferramentas-titulo">Escolha uma tarefa</h2>
      <p>As ferramentas são gratuitas e podem ser usadas sem conta. As que salvam dados usam o navegador deste dispositivo.</p>
    </header>
    <nav className="ferramentas-indice" aria-label="Categorias de ferramentas">
      {gruposFerramentas.map(grupo => <a key={grupo.id} href={"#ferramentas-" + grupo.id}>
        <Icone nome={grupo.icone}/>{grupo.nome}
      </a>)}
    </nav>
    {gruposFerramentas.map(grupo => (
      <section key={grupo.id} id={"ferramentas-" + grupo.id} className="ferramentas-grupo"
        aria-labelledby={"titulo-ferramentas-" + grupo.id}>
        <header className="ferramentas-grupo-cabecalho">
          <span className="ferramentas-grupo-icone" aria-hidden="true"><Icone nome={grupo.icone}/></span>
          <div>
            <h3 id={"titulo-ferramentas-" + grupo.id}>{grupo.nome}</h3>
            <p>{grupo.descricao}</p>
          </div>
        </header>
        <ul className="ferramentas-cards">
          {catalogoFerramentas.filter(item=>item.grupo===grupo.id).map(item=>(
            <li key={item.id}>
              <a className="ferramentas-card" href={raiz+item.rota}>
                <span className="ferramentas-card-icone"><Icone nome={item.icone}/></span>
                <strong>{item.nome}</strong>
                <span>{item.descricao}</span>
                <small><b>O que você obtém:</b> {item.resultado}</small>
                <span className="ferramentas-card-acao">Usar ferramenta <Icone nome="seta"/></span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    ))}
  </section>;
}
