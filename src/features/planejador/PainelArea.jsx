import { useState } from "react";
import { cabeNoTerreno, formatarMedida, lerMedida } from "./geometria.js";

function camposDoItem(item) {
  return {
    nome: item.nome,
    existente: item.existente ?? false,
    x: String(item.x).replace(".", ","),
    y: String(item.y).replace(".", ","),
    largura: String(item.largura).replace(".", ","),
    comprimento: String(item.comprimento).replace(".", ","),
  };
}

export default function PainelArea({ item, terreno, aoSalvar, aoRemover }) {
  const [edicao, definirEdicao] = useState({});
  const [erro, definirErro] = useState("");
  const campos = { ...camposDoItem(item), ...edicao };
  const eMuda = item.tipo === "muda";
  const medidas = [
    { nome: "largura", rotulo: "Largura (m)" },
    { nome: "comprimento", rotulo: "Comprimento (m)" },
    { nome: "x", rotulo: "Da lateral esquerda (m)" },
    { nome: "y", rotulo: "Do fundo (m)" },
  ].slice(eMuda ? 2 : 0);

  function mudarCampo(evento) {
    const { name, value, checked, type } = evento.target;
    definirEdicao((atuais) => ({ ...atuais, [name]: type === "checkbox" ? checked : value }));
    definirErro("");
  }

  async function salvar(evento) {
    evento.preventDefault();
    const nome = campos.nome.trim();
    const x = lerMedida(campos.x, 0);
    const y = lerMedida(campos.y, 0);
    const largura = eMuda ? 0 : lerMedida(campos.largura);
    const comprimento = eMuda ? 0 : lerMedida(campos.comprimento);
    if (!nome || [x, y, largura, comprimento].includes(null)) {
      definirErro("Preencha o nome e use medidas válidas, com até duas casas decimais.");
      return;
    }
    const novo = { ...item, nome, x, y, largura, comprimento, existente: campos.existente };
    if (!cabeNoTerreno(novo, terreno)) {
      definirErro("O item ultrapassa o terreno. Ajuste o tamanho ou a posição.");
      return;
    }
    if (await aoSalvar(novo)) definirEdicao((atual) => atual === edicao ? {} : atual);
  }

  return (
    <form className="painel-area" onSubmit={salvar} aria-label={eMuda ? "Editar muda" : "Editar área"}>
      <label className="campo">Nome
        <input name="nome" maxLength={48} required value={campos.nome} onChange={mudarCampo} />
      </label>
      <div className="campos-terreno">
        {medidas.map(({ nome, rotulo }) => (
          <label key={nome} className="campo">{rotulo}
            <input name={nome} inputMode="decimal" required value={campos[nome]} onChange={mudarCampo} />
          </label>
        ))}
      </div>
      <label className="controle-caixa">
        <input type="checkbox" name="existente" checked={campos.existente} onChange={mudarCampo} />
        Já existe no terreno
      </label>
      {!eMuda && <p className="nota">Área atual de {formatarMedida(item.largura * item.comprimento)} m²</p>}
      {erro && <p className="erro" role="alert">{erro}</p>}
      <div className="acoes-planta">
        <button className="botao" type="submit">Salvar alterações</button>
        <button className="botao botao-contorno" type="button" onClick={() => aoRemover(item.id)}>Remover item</button>
      </div>
    </form>
  );
}
