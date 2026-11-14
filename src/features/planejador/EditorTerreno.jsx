import { useState } from "react";
import { cabeNoTerreno, formatarMedida, lerMedida, sobrepoe } from "./geometria.js";
import Planta from "./Planta.jsx";

const camposIniciais = { x: "0", y: "0", largura: "", comprimento: "" };
const medidaParaCampo = (valor) => String(valor).replace(".", ",");

export default function EditorTerreno({ terreno, itens, definirItens }) {
  const [campos, definirCampos] = useState(camposIniciais);
  const [erro, definirErro] = useState("");
  const [edicao, definirEdicao] = useState(null);
  const x = lerMedida(campos.x, 0);
  const y = lerMedida(campos.y, 0);
  const largura = lerMedida(campos.largura);
  const comprimento = lerMedida(campos.comprimento);
  const medidasValidas = [x, y, largura, comprimento].every((medida) => medida !== null);
  const candidato = { id: edicao ?? "rascunho", x, y, largura, comprimento };
  const cabe = medidasValidas && cabeNoTerreno(candidato, terreno);

  function editar(item) {
    definirEdicao(item?.id ?? null);
    definirCampos(item ? {
      x: medidaParaCampo(item.x),
      y: medidaParaCampo(item.y),
      largura: medidaParaCampo(item.largura),
      comprimento: medidaParaCampo(item.comprimento),
    } : camposIniciais);
    definirErro("");
  }

  function salvarCanteiro(evento) {
    evento.preventDefault();
    if (!medidasValidas) {
      definirErro("Use números com até duas casas decimais. O tamanho deve ser maior que zero e a posição pode começar em zero.");
      return;
    }
    if (!cabe) {
      definirErro("O canteiro ultrapassa o terreno. Reduza o tamanho ou mude a posição.");
      return;
    }

    const novo = { ...candidato, id: edicao ?? crypto.randomUUID() };
    definirItens(edicao ? itens.map((item) => item.id === edicao ? novo : item) : [...itens, novo]);
    editar(null);
  }

  function mudarCampo(evento) {
    const { name, value } = evento.target;
    definirCampos((atuais) => ({ ...atuais, [name]: value }));
    definirErro("");
  }

  function posicionarNaPlanta(xClicado, yClicado) {
    const limitar = (valor, lado, medida) => Math.round(Math.max(0, Math.min(valor, lado - (medida ?? 0))) * 100) / 100;
    definirCampos((atuais) => ({
      ...atuais,
      x: medidaParaCampo(limitar(xClicado, terreno.largura, largura)),
      y: medidaParaCampo(limitar(yClicado, terreno.comprimento, comprimento)),
    }));
    definirErro("");
  }

  const visiveis = cabe ? [...itens.filter((item) => item.id !== edicao), { ...candidato, rascunho: true }] : itens;
  const itensNaPlanta = visiveis.map((item) => ({
    ...item,
    sobreposto: visiveis.some((outro) => item.id !== outro.id && sobrepoe(item, outro)),
  }));

  return (
    <div className="editor">
      <p><strong>Terreno de {formatarMedida(terreno.largura)} × {formatarMedida(terreno.comprimento)} m</strong> · {formatarMedida(terreno.area)} m²</p>
      <form className="editor-grade" onSubmit={salvarCanteiro}>
        <h3 className="editor-titulo">{edicao ? "Editar canteiro" : "Adicionar canteiro"}</h3>
        <fieldset className="editor-tamanho">
          <legend>Tamanho do canteiro</legend>
          <div className="editor-campos">
            <label className="campo">Largura (m)
              <input name="largura" inputMode="decimal" required value={campos.largura} onChange={mudarCampo} placeholder="Ex.: 1,20" />
            </label>
            <label className="campo">Comprimento (m)
              <input name="comprimento" inputMode="decimal" required value={campos.comprimento} onChange={mudarCampo} placeholder="Ex.: 3" />
            </label>
          </div>
          <p className="nota">A largura vai da esquerda para a direita na planta. 1,20 m é o mesmo que 120 cm.</p>
        </fieldset>
        <div className="editor-mapa">
          <p className="marco-terreno">Fundo do terreno</p>
          <Planta terreno={terreno} itens={itensNaPlanta} mostrarFrente aoPosicionar={posicionarNaPlanta} />
          <p className="marco-terreno">Frente do terreno</p>
          <p className="nota">Clique ou toque na planta para posicionar o canteiro.</p>
        </div>
        <fieldset className="editor-posicao">
          <legend>Posição do canteiro</legend>
          <p className="nota">Você também pode digitar as distâncias a partir das bordas do terreno.</p>
          <div className="editor-campos">
            <label className="campo">Da lateral esquerda (m)
              <input name="x" inputMode="decimal" required value={campos.x} onChange={mudarCampo} />
            </label>
            <label className="campo">Do fundo (m)
              <input name="y" inputMode="decimal" required value={campos.y} onChange={mudarCampo} />
            </label>
          </div>
        </fieldset>
        <div className="editor-acoes">
          {erro ? <p role="alert" className="erro">{erro}</p> : medidasValidas && !cabe && (
            <p className="aviso" role="status">O canteiro ultrapassa o terreno. Ajuste o tamanho ou a posição.</p>
          )}
          <button className="botao" type="submit">{edicao ? "Salvar canteiro" : "Adicionar canteiro"}</button>
          {edicao && <button className="botao botao-contorno" type="button" onClick={() => editar(null)}>Cancelar edição</button>}
        </div>
      </form>
      <div aria-live="polite">
        {itensNaPlanta.some((item) => item.sobreposto) && <p className="aviso">Há canteiros sobrepostos. Veja o destaque na planta.</p>}
      </div>
      {itens.length > 0 && <ul className="lista-canteiros">
        {itens.map((item, indice) => (
          <li key={item.id}>
            <span>Canteiro {indice + 1} · {formatarMedida(item.largura)} × {formatarMedida(item.comprimento)} m</span>
            <button type="button" onClick={() => editar(item)} aria-label={`Editar canteiro ${indice + 1}`}>Editar</button>
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
