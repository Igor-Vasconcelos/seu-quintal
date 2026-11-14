import { useEffect, useRef, useState } from "react";
import { formatarMedida, lerMedida } from "../planejador/geometria.js";

const chave = "seu-quintal:historico-cultivo:v1";
const unidades = { kg: "kg", g: "g", un: "un.", maco: "maço(s)" };
const chaveArea = (texto) => texto.toLocaleLowerCase("pt-BR");
const formatarData = (data) => data.split("-").reverse().join("/");

function carregarRegistros() {
  const dados = JSON.parse(window.localStorage.getItem(chave) ?? "[]");
  if (!Array.isArray(dados) || dados.some((item) =>
    !item || ["id", "area", "cultura", "plantio", "colheita", "unidade", "observacoes"].some((campo) => typeof item[campo] !== "string"))) {
    throw new Error("Histórico inválido");
  }
  return dados;
}

function abrirHistorico() {
  try {
    return { registros: carregarRegistros(), erro: "" };
  } catch {
    return { registros: [], erro: "O histórico deste navegador está indisponível." };
  }
}

export default function HistoricoCultivo() {
  const [historico, definirHistorico] = useState(abrirHistorico);
  const [filtro, definirFiltro] = useState("");
  const [edicao, definirEdicao] = useState(null);
  const [remocao, definirRemocao] = useState(null);
  const [mensagem, definirMensagem] = useState("");
  const [erro, definirErro] = useState("");
  const formulario = useRef(null);

  useEffect(() => {
    function sincronizar(evento) {
      if (evento.key === chave || evento.key === null) definirHistorico(abrirHistorico());
    }
    window.addEventListener("storage", sincronizar);
    return () => window.removeEventListener("storage", sincronizar);
  }, []);

  const areas = [...new Map(historico.registros.map(({ area }) => [chaveArea(area), area]))]
    .sort((a, b) => a[1].localeCompare(b[1], "pt-BR", { numeric: true }));
  const filtroAtivo = areas.some(([id]) => id === filtro) ? filtro : "";
  const registrosVisiveis = historico.registros
    .filter(({ area }) => !filtroAtivo || chaveArea(area) === filtroAtivo)
    .sort((a, b) => (b.colheita || b.plantio).localeCompare(a.colheita || a.plantio));

  function salvarRegistros(atualizar) {
    try {
      const registros = atualizar(carregarRegistros());
      window.localStorage.setItem(chave, JSON.stringify(registros));
      definirHistorico({ registros, erro: "" });
      return true;
    } catch {
      definirErro("Não foi possível salvar no navegador. Confira se o armazenamento local está disponível e tente novamente.");
      return false;
    }
  }

  function salvarCultivo(evento) {
    evento.preventDefault();
    definirMensagem("");
    definirErro("");
    const dados = new FormData(evento.currentTarget);
    const area = dados.get("area").trim().replace(/\s+/g, " ");
    const cultura = dados.get("cultura").trim();
    const plantio = dados.get("plantio");
    const colheita = dados.get("colheita");
    const quantidadeTexto = dados.get("quantidade").trim();
    const quantidade = quantidadeTexto ? lerMedida(quantidadeTexto, 0) : null;
    const unidade = dados.get("unidade");

    if (!area || !cultura) {
      definirErro("Informe o nome da área e da cultura.");
      formulario.current.elements.namedItem(!area ? "area" : "cultura").focus();
      return;
    }
    if (colheita && colheita < plantio) {
      definirErro("A data de colheita precisa ser igual ou posterior ao plantio.");
      formulario.current.elements.namedItem("colheita").focus();
      return;
    }
    if (quantidadeTexto && quantidade === null) {
      definirErro("Informe uma quantidade de 0 a 10.000, com até duas casas decimais.");
      formulario.current.elements.namedItem("quantidade").focus();
      return;
    }
    if (quantidade !== null && !colheita) {
      definirErro("Informe a data da colheita para registrar a quantidade.");
      formulario.current.elements.namedItem("colheita").focus();
      return;
    }
    const registro = {
      id: edicao?.id ?? crypto.randomUUID(),
      area, cultura, plantio, colheita, quantidade, unidade,
      observacoes: dados.get("observacoes").trim(),
    };
    if (!salvarRegistros((atuais) => [registro, ...atuais.filter(({ id }) => id !== registro.id)])) return;
    definirFiltro(chaveArea(area));
    if (edicao) definirEdicao(null);
    else formulario.current.reset();
    definirMensagem(edicao ? "Registro atualizado." : "Cultivo registrado.");
  }

  function editar(registro) {
    definirEdicao(registro);
    definirRemocao(null);
    definirErro("");
    definirMensagem("");
    // O formulário usa campos nativos e remonta ao trocar o registro editado.
    requestAnimationFrame(() => formulario.current?.elements.namedItem("area")?.focus());
  }

  function remover(registro) {
    definirErro("");
    if (!salvarRegistros((atuais) => atuais.filter(({ id }) => id !== registro.id))) return;
    if (edicao?.id === registro.id) definirEdicao(null);
    definirRemocao(null);
    definirMensagem("Registro removido.");
  }

  return (
    <section className="historico-cultivo" id="painel-cultivo" aria-labelledby="titulo-cultivo">
      <h3 id="titulo-cultivo">Histórico de cultivo</h3>
      <p className="nota">Registre o que plantou e colheu em cada canteiro ou talhão. Os registros ficam salvos neste navegador.</p>
      {historico.erro && <p className="erro" role="alert">{historico.erro}</p>}

      <form className="form-guia painel-guia" key={edicao?.id ?? "novo"} ref={formulario} onSubmit={salvarCultivo}>
        <h4>{edicao ? "Editar registro" : "Registrar cultivo"}</h4>
        <div className="campos-guia campos-guia-duplo">
          <label className="campo">Canteiro ou talhão
            <input name="area" list="areas-de-cultivo" maxLength="60" required
              placeholder="Ex.: Canteiro 1" defaultValue={edicao?.area} />
          </label>
          <datalist id="areas-de-cultivo">
            {areas.map(([id, area]) => <option key={id} value={area} />)}
          </datalist>
          <label className="campo">Cultura<input name="cultura" maxLength="60" required defaultValue={edicao?.cultura} /></label>
          <label className="campo">Data de plantio<input type="date" name="plantio" required defaultValue={edicao?.plantio} /></label>
          <label className="campo">Data de colheita (opcional)<input type="date" name="colheita" defaultValue={edicao?.colheita} /></label>
          <label className="campo">Quantidade colhida (opcional)
            <input name="quantidade" inputMode="decimal" defaultValue={edicao?.quantidade ?? ""} />
          </label>
          <label className="campo">Unidade
            <select name="unidade" defaultValue={edicao?.unidade ?? "kg"}>
              {Object.entries(unidades).map(([id, rotulo]) => <option key={id} value={id}>{rotulo}</option>)}
            </select>
          </label>
        </div>
        <label className="campo">Observações (opcional)
          <textarea name="observacoes" rows="2" maxLength="500" defaultValue={edicao?.observacoes} />
        </label>
        <div className="acoes-guia">
          <button className="botao" type="submit">{edicao ? "Salvar alterações" : "Salvar cultivo"}</button>
          {edicao && <button className="botao botao-contorno" type="button" onClick={() => editar(null)}>Cancelar edição</button>}
        </div>
      </form>
      {erro && <p className="erro" role="alert">{erro}</p>}
      <p className="nota" role="status">{mensagem}</p>

      {areas.length > 0 && <label className="campo">Filtrar histórico por área
        <select value={filtroAtivo} onChange={(evento) => { definirFiltro(evento.target.value); definirRemocao(null); }}>
          <option value="">Todos os canteiros e talhões</option>
          {areas.map(([id, area]) => <option key={id} value={id}>{area}</option>)}
        </select>
      </label>}
      {!historico.erro && (registrosVisiveis.length ? <ul className="lista-cultivo">
        {registrosVisiveis.map((registro) => (
          <li className="painel-guia" key={registro.id}>
            <h4>{registro.cultura} · {registro.area}</h4>
            <p>Plantio em {formatarData(registro.plantio)}</p>
            <p>{registro.colheita ? `Colheita em ${formatarData(registro.colheita)}` : "Colheita ainda sem registro"}
              {registro.quantidade !== null && ` · ${formatarMedida(registro.quantidade)} ${unidades[registro.unidade]}`}
            </p>
            {registro.observacoes && <p className="observacoes-cultivo">{registro.observacoes}</p>}
            {remocao === registro.id ? (
              <div className="confirmar-remocao">
                <p>Remover este registro do histórico?</p>
                <div className="acoes-guia">
                  <button className="botao botao-terracota" type="button" onClick={() => remover(registro)}>Confirmar remoção</button>
                  <button className="botao botao-contorno" type="button" onClick={() => definirRemocao(null)}>Manter registro</button>
                </div>
              </div>
            ) : (
              <div className="acoes-guia">
                <button className="botao botao-contorno" type="button" onClick={() => editar(registro)}>Editar registro</button>
                <button className="botao botao-contorno" type="button" onClick={() => definirRemocao(registro.id)}>Remover registro</button>
              </div>
            )}
          </li>
        ))}
      </ul> : <p className="nota">Nenhum cultivo registrado.</p>)}
    </section>
  );
}
