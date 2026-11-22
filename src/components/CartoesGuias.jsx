import { guias } from "../data/guias.js";
import Icone from "./Icone.jsx";

export default function CartoesGuias({ itens = guias, raiz = "./", titulo: Titulo = "h3" }) {
  return (
    <ul className="guias-grade">
      {itens.map((guia) => (
        <li key={guia.id}>
          <a className="guia-cartao" href={`${raiz}${guia.destino}`}>
            <img src={`${raiz}imagens/${guia.id}.webp`} width="792" height="396" alt="" loading="lazy" />
            <div>
              <span className="guia-cartao-formato">{guia.formato}</span>
              <Titulo>{guia.titulo}</Titulo>
              <p>{guia.resumo}</p>
              <dl className="guia-cartao-detalhes">
                <div><dt>Para quem</dt><dd>{guia.paraQuem}</dd></div>
                <div><dt>O que você vai aprender</dt><dd>{guia.aprende}</dd></div>
              </dl>
              <span className="guia-acao">Explorar conteúdo <Icone nome="seta" /></span>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
