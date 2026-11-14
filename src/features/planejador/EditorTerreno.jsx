import { useState } from "react";
import { cabeNoTerreno, formatarMedida, lerMedida, sobrepoe } from "./geometria.js";
import Planta from "./Planta.jsx";

export default function EditorTerreno({ terreno, itens, definirItens }) {
  const [erro, definirErro] = useState("");
  const [edicao, definirEdicao] = useState(null);
  const itemEditado = itens.find((item) => item.id === edicao);

  function salvarCanteiro(evento) {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    const x = lerMedida(dados.get("x"), 0);
    const y = lerMedida(dados.get("y"), 0);
    const largura = lerMedida(dados.get("largura"));
    const comprimento = lerMedida(dados.get("comprimento"));
    if ([x, y, largura, comprimento].includes(null)) {
      definirErro("Confira as medidas. Use números com até duas casas decimais e comece as posições em 0.");
      return;
    }
    if (!cabeNoTerreno({ x, y, largura, comprimento }, terreno)) {
      definirErro("O canteiro ultrapassa os limites do terreno.");
      return;
    }
    const novo = { id: edicao ?? crypto.randomUUID(), x, y, largura, comprimento };
    definirItens(edicao ? itens.map((item) => item.id === edicao ? novo : item) : [...itens, novo]);
    definirEdicao(null);
    definirErro("");
    evento.currentTarget.reset();
  }

  const itensNaPlanta = itens.map((item) => ({
    ...item,
    sobreposto: itens.some((outro) => item.id !== outro.id && sobrepoe(item, outro)),
  }));

  function editar(id) {
    definirEdicao(id);
    definirErro("");
  }

  return (
    <div className="editor">
      <p><strong>{formatarMedida(terreno.largura)} × {formatarMedida(terreno.comprimento)} m</strong> · {formatarMedida(terreno.area)} m²</p>
      <div className="editor-grade">
        <div>
          <Planta terreno={terreno} itens={itensNaPlanta} />
          <p className="nota">Planta em escala. A frente fica na borda inferior.</p>
        </div>
        <form key={edicao ?? "novo"} onSubmit={salvarCanteiro}>
          <h3>{edicao ? "Editar canteiro" : "Adicionar canteiro"}</h3>
          <p className="nota">Meça a posição a partir do canto superior esquerdo da planta.</p>
          <div className="editor-campos">
            <label className="campo">Da esquerda (m)<input name="x" inputMode="decimal" required defaultValue={itemEditado?.x ?? "0"} /></label>
            <label className="campo">Do topo (m)<input name="y" inputMode="decimal" required defaultValue={itemEditado?.y ?? "0"} /></label>
            <label className="campo">Largura (m)<input name="largura" inputMode="decimal" required defaultValue={itemEditado?.largura ?? ""} /></label>
            <label className="campo">Comprimento (m)<input name="comprimento" inputMode="decimal" required defaultValue={itemEditado?.comprimento ?? ""} /></label>
          </div>
          <button className="botao" type="submit">{edicao ? "Salvar posição" : "Adicionar canteiro"}</button>
          {edicao && <button className="botao botao-contorno" type="button" onClick={() => editar(null)}>Cancelar edição</button>}
          {erro && <p role="alert" className="erro">{erro}</p>}
        </form>
      </div>
      <div aria-live="polite">
        {itensNaPlanta.some((item) => item.sobreposto) && <p className="aviso">Há canteiros sobrepostos. Veja o destaque na planta.</p>}
      </div>
      {itens.length > 0 && <ul className="lista-canteiros">
        {itens.map((item, indice) => (
          <li key={item.id}>
            <span>Canteiro {indice + 1} · {formatarMedida(item.largura)} × {formatarMedida(item.comprimento)} m</span>
            <button type="button" onClick={() => editar(item.id)} aria-label={`Editar canteiro ${indice + 1}`}>Editar</button>
            <button type="button" aria-label={`Remover canteiro ${indice + 1}`} onClick={() => {
              definirItens(itens.filter((outro) => outro.id !== item.id));
              if (edicao === item.id) editar(null);
            }}>Remover</button>
          </li>
        ))}
      </ul>}
    </div>
  );
}
