import { useState } from "react";
import { buscaFichaCultura, fonteFichaCultura } from "../../data/fichas-culturas.js";
import { descreverEpocaPlantio, fontePlantio } from "../../data/plantio.js";
import { formatarMedida } from "../planejador/geometria.js";
import { culturasOrganizador, fonteEscalonamento } from "./culturas.js";
import { categoriasCulturas, gruposCulturas } from "./catalogoCulturas.js";
import { dimensionarLote, formularioInicial, janelaDeDatas, lerPlano, projetarLote, situacaoDoPlantio } from "./escala.js";

function Quantidade({ nome, rotulo, valor, mudar }) {
  return (
    <label className="campo">{rotulo}
      <input name={nome} inputMode="decimal" value={valor} onChange={mudar} placeholder="0" />
    </label>
  );
}

function GuiaDoCultivo({ plano }) {
  const dados = culturasOrganizador[plano.cultura];
  const ficha = buscaFichaCultura(plano.cultura);
  const [fileiras, plantas] = dados.espaco.map((m) => formatarMedida(m * 100));
  let comoComecar = "Semeie no local definitivo. Use a profundidade indicada para a sua variedade e faça o desbaste se as plantas nascerem juntas.";
  if (plano.origem === "muda") comoComecar = "Transplante mudas sadias para o local definitivo, mantendo o torrão. Regue depois de plantar.";
  if (plano.origem === "semente" && dados.mudas) {
    comoComecar = "Semeie em bandeja com substrato para mudas. Mantenha a umidade e confira o desenvolvimento das folhas e raízes antes de transplantar.";
  }

  return (
    <details className="organizador-detalhes">
      <summary>Como plantar, cuidar e colher</summary>
      <dl className="organizador-guia">
        <div><dt>Como começar</dt><dd>{comoComecar}</dd></div>
        <div><dt>Orientação da cultura</dt><dd>{ficha.plantio}</dd></div>
        <div><dt>Espaçamento usado no plano</dt><dd>{fileiras} cm entre fileiras e {plantas} cm entre plantas.</dd></div>
        <div><dt>Cuidados</dt><dd>{ficha.cuidados}</dd></div>
        <div><dt>Ponto de colheita</dt><dd>{dados.ponto}</dd></div>
      </dl>
      <ul className="organizador-fontes">
        <li><a href={fonteFichaCultura(ficha.pagina)} target="_blank" rel="noreferrer">Embrapa e Sebrae · Ficha da cultura</a></li>
        <li><a href={fonteEscalonamento} target="_blank" rel="noreferrer">Embrapa · Plantio em lotes e espaçamento</a></li>
        {dados.fontes?.map(({ nome, url }) => <li key={url}><a href={url} target="_blank" rel="noreferrer">{nome}</a></li>)}
      </ul>
    </details>
  );
}

function ResumoCultivo({ plano, regiao }) {
  const ficha = culturasOrganizador[plano.cultura];
  const { plantas, areaSimultanea, metaLote, experimental } = dimensionarLote(plano);
  const lote = projetarLote(plano, 0);
  const alerta = situacaoDoPlantio(plano, regiao, lote.canteiro.de, lote.canteiro.ate);
  const intervalo = plano.intervalo === 1 ? "por semana" : `a cada ${plano.intervalo} semanas`;
  const prazos = {
    transplantar: plano.origem === "semente" && ficha.mudas && `${ficha.mudas.join("–")} dias depois de semear`,
    colher: `${ficha.canteiro.join("–")} dias depois de ${ficha.mudas ? "transplantar" : "semear"}`,
  };

  return (
    <div className="organizador-resumo">
      <div className="organizador-quantidade">
        <strong>{formatarMedida(plantas)}</strong>
        <div>{plantas === 1 ? "planta" : "plantas"} por lote
          <small>Um novo lote {intervalo}</small>
        </div>
      </div>
      {experimental && <p className="nota">Lote de teste. Use o que colher para estimar o rendimento por planta.</p>}
      {ficha.colheitasSucessivas && !experimental && <p className="nota">
        Meta de {formatarMedida(metaLote)} kg por lote, somando as colheitas de toda a fase produtiva.
      </p>}
      <h3>Primeiro lote</h3>
      <ol className="organizador-etapas">
        {lote.etapas.map((etapa) => (
          <li key={etapa.id} data-etapa={etapa.id}>
            <div>
              <span>{etapa.nome}</span>
              {prazos[etapa.id] && <small>{prazos[etapa.id]}</small>}
            </div>
            <strong>{janelaDeDatas(etapa.de, etapa.ate)}</strong>
          </li>
        ))}
      </ol>
      {plano.duracao && <p className="nota">Período produtivo informado de {plano.duracao} semanas a partir do início da colheita.</p>}
      <p className="organizador-area-lote"><strong>{formatarMedida(areaSimultanea)} m²</strong> estimados de canteiro
        {ficha.colheitasSucessivas && !plano.duracao && " até o início das colheitas"}</p>
      <div className="organizador-epoca">
        <p><strong>Época de plantio · {regiao}</strong></p>
        <p>{descreverEpocaPlantio(plano.cultura, regiao)} <a href={fontePlantio} target="_blank" rel="noreferrer">Tabela da Embrapa</a></p>
        {alerta && <p className="aviso">{alerta}</p>}
      </div>
      <GuiaDoCultivo plano={plano} />
      <p className="nota">As datas são estimativas. Confira a cultivar, o clima e o ponto de colheita na horta.</p>
    </div>
  );
}

export default function FormularioCultivo({ edicao, culturaSugerida, regiao, canteiros = [], aoSalvar, aoCancelar, bloqueado }) {
  const [campos, definirCampos] = useState(() => formularioInicial(edicao, culturaSugerida));
  const [tentouSalvar, definirTentouSalvar] = useState(false);
  const ficha = culturasOrganizador[campos.cultura];
  const { plano, erro } = lerPlano(campos);

  function mudar(evento) {
    const { name, value } = evento.target;
    definirCampos((atuais) => ({ ...atuais, [name]: value }));
  }

  function mudarCultura(evento) {
    const cultura = evento.target.value;
    const proxima = culturasOrganizador[cultura];
    definirCampos((atuais) => ({
      ...atuais, cultura, origem: proxima.somenteMuda ? "muda" : proxima.mudas ? atuais.origem : "semente",
      casa: proxima.unidade === ficha.unidade ? atuais.casa : proxima.unidade === "kg" ? "0,5" : "4",
      venda: proxima.unidade === ficha.unidade ? atuais.venda : "0",
      intervalo: proxima.colheitasSucessivas === ficha.colheitasSucessivas ? atuais.intervalo : proxima.colheitasSucessivas ? "4" : "1",
      rendimento: "", duracao: "",
    }));
  }

  function vincularCanteiro(evento) {
    const id = evento.target.value;
    const salvo = canteiros.find(item => item.id === id);
    definirCampos(atuais => ({
      ...atuais, canteiroId: id,
      canteiro: salvo ? salvo.nome : atuais.canteiro,
    }));
  }

  function salvar(evento) {
    evento.preventDefault();
    definirTentouSalvar(true);
    if (plano && !bloqueado) aoSalvar(plano);
  }

  return (
    <div className="organizador-montagem">
      <section className="organizador-cartao" aria-labelledby="titulo-form-cultivo">
        <h2 id="titulo-form-cultivo" tabIndex="-1">{edicao ? "Editar cultivo" : "Planejar um cultivo"}</h2>
        <form className="organizador-form" aria-label={edicao ? "Editar cultivo" : "Planejar um cultivo"} onSubmit={salvar}>
          <div className="organizador-campos">
            <label className="campo">Cultura
              <select name="cultura" value={campos.cultura} onChange={mudarCultura}>
                {categoriasCulturas.map(grupo => (
                  <optgroup key={grupo} label={grupo}>
                    {gruposCulturas[grupo].map(nome => <option key={nome} value={nome}>{nome}</option>)}
                  </optgroup>
                ))}
              </select>
            </label>
            <label className="campo">Como vai começar?
              <select name="origem" value={campos.origem} onChange={mudar}>
                {!ficha.somenteMuda && <option value="semente">{ficha.mudas ? "Semente em bandeja" : "Semente no canteiro"}</option>}
                {ficha.mudas && <option value="muda">Muda pronta</option>}
              </select>
            </label>
            <label className="campo">Data do primeiro plantio
              <input type="date" name="inicio" value={campos.inicio} onChange={mudar} required />
            </label>
            <label className="campo">Novo lote a cada
              <span className="organizador-com-unidade">
                <input name="intervalo" type="number" min="1" max="52" step="1" value={campos.intervalo} onChange={mudar} required />
                <span>semana(s)</span>
              </span>
            </label>
          </div>
          <p className="organizador-dica-rapida">
            <strong>Cuidados com {campos.cultura}</strong>
            <span>{buscaFichaCultura(campos.cultura)?.cuidados}</span>
            <small>Confira as orientações e as fontes completas na previsão ao lado (ou abaixo, no celular).</small>
          </p>
          <fieldset className="organizador-meta">
            <legend>Quanto quer colher por semana?</legend>
            <p className="nota">Informe a meta em {ficha.unidade}.</p>
            <div className="organizador-campos">
              <Quantidade nome="casa" rotulo="Para casa" valor={campos.casa} mudar={mudar} />
              <Quantidade nome="venda" rotulo="Para venda (opcional)" valor={campos.venda} mudar={mudar} />
            </div>
          </fieldset>
          {(ficha.colheitasSucessivas || ficha.planejamentoPorPeso) && (
            <fieldset className="organizador-meta">
              <legend>{ficha.colheitasSucessivas ? "Colheitas da mesma planta" : "Produção por peso no lote"}</legend>
              <p className="nota">Use o rendimento real observado por planta no ciclo ou comece com um lote de teste. Sem essa medição, a meta em kg não pode ser garantida.</p>
              <div className="organizador-campos">
                <Quantidade nome="rendimento" rotulo="Kg por planta no ciclo (opcional)" valor={campos.rendimento} mudar={mudar} />
                {ficha.colheitasSucessivas && <label className="campo">Semanas de colheita (opcional)
                  <input type="number" name="duracao" min="1" max="104" step="1" value={campos.duracao} onChange={mudar} />
                </label>}
                {!campos.rendimento && <label className="campo">Plantas no lote de teste
                  <input type="number" name="teste" min="1" step="1" value={campos.teste} onChange={mudar} required />
                </label>}
              </div>
              {plano?.duracao && plano.duracao < plano.intervalo && <p className="aviso">
                Com esse intervalo, a duração informada da colheita deixa semanas sem um lote em produção.
              </p>}
            </fieldset>
          )}
          <label className="campo organizador-seletor-canteiro">Vincular a um canteiro salvo (opcional)
            <select name="canteiroId" value={campos.canteiroId || ""} onChange={vincularCanteiro}>
              <option value="">Sem vínculo com o desenho</option>
              {canteiros.map(item => <option key={item.id} value={item.id}>
                {item.nome} — {(item.medidas.largura * item.medidas.comprimento / 10000).toLocaleString("pt-BR")} m²
              </option>)}
            </select>
          </label>
          <label className="campo">Canteiro ou área (descrição)
            <input name="canteiro" value={campos.canteiro} onChange={mudar} maxLength={60}
              placeholder="Ex.: canteiro perto da varanda" />
          </label>
          {tentouSalvar && erro && <p className="erro" role="alert">{erro}</p>}
          <div className="organizador-acoes">
            <button className="botao" type="submit" disabled={bloqueado}>{edicao ? "Salvar alterações" : "Adicionar ao plano"}</button>
            {edicao && <button className="botao botao-contorno" type="button" onClick={aoCancelar}>Cancelar edição</button>}
          </div>
        </form>
      </section>
      <aside className="organizador-cartao organizador-previsao" aria-labelledby="titulo-previsao-cultivo">
        <h2 id="titulo-previsao-cultivo">Previsão de plantio</h2>
        {plano ? <ResumoCultivo plano={plano} regiao={regiao} /> :
          <p className="nota">Informe a data e a meta semanal para calcular a escala.</p>}
      </aside>
    </div>
  );
}
