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
              <Titulo>{guia.titulo}</Titulo>
              <p>{guia.resumo}</p>
              <span className="guia-acao">Abrir guia <Icone nome="seta" /></span>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
