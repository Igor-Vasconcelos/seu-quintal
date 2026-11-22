import { useState } from "react";
import Icone from "../../components/Icone.jsx";
import { tiposDeArea } from "./projetos.js";
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
  const ficha = tiposDeArea[item.tipo];
  const linksFerramenta = {
    codornario: { href: "../ferramentas/calculadora-codornas/", nome: "Calcular ovos, carne, ração e espaço" },
    tanque: { href: "../ferramentas/calculadora-peixes/", nome: "Simular volume, biomassa e ração" },
    pomar: { href: "../ferramentas/planejador-de-pomar/", nome: "Calcular posições das árvores" },
    galinheiro: { href: "../sisteminha.html#galinheiro", nome: "Consultar calculadora do galinheiro" },
    canteiro: { href: "../horta/canteiros/", nome: "Planejar plantas do canteiro" },
    horta: { href: "../sisteminha.html#horta", nome: "Entender o módulo de horta e pomar" },
    compostagem: { href: "../sisteminha.html#compostagem", nome: "Conhecer a compostagem no Sisteminha" },
    minhocario: { href: "../sisteminha.html#minhocario", nome: "Conhecer o minhocário no Sisteminha" },
  };
  const ferramenta = linksFerramenta[item.tipo];
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
      <header className="painel-area-cabecalho">
        <span className="painel-area-icone" data-cor={ficha.cor} aria-hidden="true"><Icone nome={ficha.icone}/></span>
        <div><strong>{ficha.nome}</strong><small>Personalize nome, medidas e localização</small></div>
      </header>
      {ferramenta && <a className="painel-area-ferramenta" href={ferramenta.href}>
        {ferramenta.nome} <Icone nome="seta"/>
      </a>}
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
