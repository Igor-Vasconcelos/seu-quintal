import Icone from "../../components/Icone.jsx";
import { ferramentasDoModulo } from "../../data/catalogoFerramentas.js";
import "../../styles/descoberta-ferramentas-v4.css";

// Sugestões independentes do Seu Quintal: não são módulos oficiais da Embrapa.
export default function FerramentasModulo({ modulo }) {
  const itens = ferramentasDoModulo(modulo);
  if (itens.length === 0) return null;
  const subtitulos = {
    tanque: "Simule o tanque e reserve a área na planta do terreno.",
    galinheiro: "Compare criações de aves e planeje o espaço disponível.",
    horta: "Transforme o planejamento em canteiros, lotes e um pomar.",
    compostagem: "Confira materiais adequados e o espaço de manejo.",
    minhocario: "Comece pelo manejo correto da matéria orgânica.",
  };
  return <aside className="sisteminha-ferramentas-modulo" aria-label={"Ferramentas relacionadas a " + modulo}>
    <div className="sisteminha-ferramentas-cabecalho">
      <div>
        <p className="sisteminha-kicker">COLOQUE EM PRÁTICA</p>
        <h3>Ferramentas para este módulo</h3>
        <p>{subtitulos[modulo]}</p>
      </div>
      <a href="./ferramentas/" className="sisteminha-ferramentas-todas">Ver todas <Icone nome="seta"/></a>
    </div>
    <ul className="sisteminha-ferramentas-cards">
      {itens.map(item=><li key={item.id}><a href={"./"+item.rota}>
        <span className="sisteminha-ferramenta-icone"><Icone nome={item.icone}/></span>
        <span><strong>{item.nome}</strong><small>{item.descricao}</small></span>
        <Icone nome="seta"/>
      </a></li>)}
    </ul>
    <p className="sisteminha-ferramentas-aviso">Ferramentas educativas independentes do Seu Quintal, não calculadoras oficiais da Embrapa.</p>
  </aside>;
}
