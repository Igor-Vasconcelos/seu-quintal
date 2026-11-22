import { fontesAlimentacao, valorAlimentar } from "../data/valor-alimentar.js";
import "../styles/valor-alimentar.css";

/** Educação nutricional uniforme entre cultivo e criação. Não é orientação clínica. */
export default function ValorAlimentar({ nome, compacto = false }) {
  const dados = valorAlimentar(nome);
  if (!dados) return null;
  return <aside className={"sq-valor-alimentar" + (compacto ? " sq-valor-alimentar--compacto" : "")}
    aria-label={"Na alimentação: " + dados.titulo}>
    <strong>Na alimentação: {dados.titulo}</strong>
    <p>{dados.descricao}</p>
    {!compacto && <p className="sq-valor-fontes">Informação geral sobre composição de alimentos, não uma promessa de benefício clínico.
      Consulte a <a href={fontesAlimentacao.tbca} target="_blank" rel="noopener noreferrer">TBCA/USP</a> e o
      {" "}<a href={fontesAlimentacao.guia} target="_blank" rel="noopener noreferrer">Guia Alimentar do Ministério da Saúde</a>.
      O valor nutricional depende da porção, cultivar, espécie e preparo.</p>}
  </aside>;
}
