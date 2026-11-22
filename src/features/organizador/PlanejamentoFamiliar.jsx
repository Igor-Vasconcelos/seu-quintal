import { useEffect, useRef, useState } from "react";
import ValorAlimentar from "../../components/ValorAlimentar.jsx";
import { fonteRotacao, sugestoesRotacao } from "./rotacaoCulturas.js";
import IconeCultura from "./IconeCultura.jsx";
import { buscaFichaCultura, fonteFichaCultura } from "../../data/fichas-culturas.js";
import { descreverEpocaPlantio } from "../../data/plantio.js";
import { buscarCulturas, categoriasCulturas, destaquesCulturas, resumoCultura, todasCulturas } from "./catalogoCulturas.js";

import { culturasOrganizador, fonteEscalonamento } from "./culturas.js";
import { calcularPlanoFamiliar, intervaloPadrao, metaExemplo, sugestoesDeConsumo } from "./planoFamiliar.js";
import { hojeCivil, janelaDeDatas, rotuloData } from "./escala.js";
import { formatarMedida, lerMedida } from "../planejador/geometria.js";
import "../../styles/plano-familiar.css";

function CartaoCultura({ nome, selecionada, aoSelecionar, aoConsultar }) {
  return <div className="familia-cultura-opcao">
    <label className="familia-cultura">
      <input type="checkbox" checked={selecionada} onChange={evento => aoSelecionar(nome, evento.target.checked)} />
      <IconeCultura nome={nome}/>
      <span>{nome}</span>
    </label>
    <button type="button" className="familia-cultura-guia" onClick={() => aoConsultar(nome)}
      aria-label={"Ver dicas de cultivo de " + nome}>Dicas</button>
  </div>;
}

function textoNumero(n) {
  return String(n).replace(".", ",");
}

export default function PlanejamentoFamiliar({ regiao, planosExistentes, bloqueado, aoAplicar }) {
  const [pessoas, definirPessoas] = useState(4);
  const [quantidade, definirQuantidade] = useState(4);
  const [largura, definirLargura] = useState("1");
  const [comprimento, definirComprimento] = useState("3");
  const [inicio, definirInicio] = useState(hojeCivil);
  const [selecionadas, definirSelecionadas] = useState(["Alface de verão", "Cenoura de verão", "Tomate de mesa"]);
  const [metasCasa, definirMetasCasa] = useState({});
  const [metasVenda, definirMetasVenda] = useState({});
  const [intervalos, definirIntervalos] = useState({});
  const [incluirVenda, definirIncluirVenda] = useState(false);
  const [salvando, definirSalvando] = useState(false);
  const [retorno, definirRetorno] = useState("");
  const detalheRef = useRef(null);
  useEffect(() => {
    // O Organizador é carregado sob demanda: o alvo ainda não existe quando o
    // navegador tenta rolar até a âncora. Abrir e posicionar após a montagem.
    function abrirPeloLink() {
      const detalhe = detalheRef.current;
      if (window.location.hash !== "#planejamento-familiar" || !detalhe) return;
      detalhe.open = true;
      requestAnimationFrame(() => detalhe.scrollIntoView({ block: "start", behavior: "auto" }));
    }
    abrirPeloLink();
    window.addEventListener("hashchange", abrirPeloLink);
    return () => window.removeEventListener("hashchange", abrirPeloLink);
  }, []);
  const [falha, definirFalha] = useState(false);
  const [busca, definirBusca] = useState("");
  const [categoria, definirCategoria] = useState("Todas");
  const [culturaDetalhe, definirCulturaDetalhe] = useState("Alface de verão");
  const resultadosBusca = buscarCulturas(busca, categoria);
  const mostrarDestaques = !busca.trim() && categoria === "Todas";
  const outrasCulturas = resultadosBusca.filter(nome => !mostrarDestaques || !destaquesCulturas.includes(nome));
  const orientacao = buscaFichaCultura(culturaDetalhe);
  function pesquisar(texto) {
    definirBusca(texto);
    const primeira = buscarCulturas(texto, categoria)[0];
    if (primeira) definirCulturaDetalhe(primeira);
  }
  function filtrar(grupo) {
    definirCategoria(grupo);
    const primeira = buscarCulturas(busca, grupo)[0];
    if (primeira) definirCulturaDetalhe(primeira);
  }


  function selecionar(nome, marcado) {
    definirSelecionadas(atuais => marcado ? [...atuais, nome] : atuais.filter(c => c !== nome));
    definirRetorno("");
    if (marcado) definirCulturaDetalhe(nome);
  }

  const preferencias = selecionadas.map(cultura => ({
    cultura,
    casa: metasCasa[cultura] === undefined ? metaExemplo(cultura, pessoas) : lerMedida(metasCasa[cultura], 0),
    venda: incluirVenda ? (metasVenda[cultura] === undefined ? 0 : lerMedida(metasVenda[cultura], 0)) : 0,
    intervalo: intervalos[cultura] === undefined ? intervaloPadrao(cultura) : Number(intervalos[cultura]),
  }));
  const alternativasRotacao = sugestoesRotacao(selecionadas);
  const sugestao = calcularPlanoFamiliar({
    pessoas, quantidadeCanteiros: quantidade, largura: lerMedida(largura),
    comprimento: lerMedida(comprimento), inicio, regiao, preferencias, planosExistentes,
  });

  async function salvarPlano() {
    if (sugestao.erro || !sugestao.cabe || bloqueado || salvando) return;
    definirSalvando(true);
    definirRetorno("");
    try {
      const resultado = await aoAplicar(sugestao.sugestoes.map(({ plano }) => plano), sugestao.areaTotal);
      if (resultado) {
        definirRetorno("Cultivos adicionados ao plano! Veja as tarefas e primeiras colheitas na agenda abaixo.");
        definirFalha(false);
        if (detalheRef.current) detalheRef.current.open = false;
      } else {
        definirRetorno("Não foi possível salvar o plano. Confira se o armazenamento do navegador está disponível.");
        definirFalha(true);
      }
    } finally {
      definirSalvando(false);
    }
  }

  return (
    <details className="organizador-cartao familia" id="planejamento-familiar" ref={detalheRef}>
      <summary className="familia-abrir">
        <span className="familia-chamada">
          <strong>Horta contínua: consumo, plantios escalonados e rotação</strong>
          <small>Informe o consumo semanal, planeje lotes e aprenda a alternar cultivos nos canteiros.</small>
        </span>
        <span className="familia-chamada-acao">Montar minha horta</span>
      </summary>
      <div className="familia-conteudo">
        <p className="nota">Escolha os alimentos, ajuste as metas semanais e confira as primeiras datas de colheita. As sugestões de consumo são exemplos editáveis, não médias oficiais. Rotação é a troca de famílias botânicas em ciclos posteriores; o sistema ainda não a executa automaticamente.</p>
        <div className="familia-etapa">
          <h3><span className="familia-passo">1</span> Pessoas e espaço disponível</h3>
          <div className="familia-campos">
            <label className="campo">Pessoas na família
              <input type="number" min="1" max="20" value={pessoas} onChange={e => definirPessoas(Number(e.target.value))} />
            </label>
            <label className="campo">Quantidade de canteiros
              <input type="number" min="1" max="24" value={quantidade} onChange={e => definirQuantidade(Number(e.target.value))} />
            </label>
            <label className="campo">Largura de cada canteiro (m)
              <input inputMode="decimal" value={largura} onChange={e => definirLargura(e.target.value)} />
            </label>
            <label className="campo">Comprimento de cada canteiro (m)
              <input inputMode="decimal" value={comprimento} onChange={e => definirComprimento(e.target.value)} />
            </label>
            <label className="campo">Data de início
              <input type="date" value={inicio} onChange={e => definirInicio(e.target.value)} />
            </label>
          </div>
          <p className="nota">Região atual: <strong>{regiao}</strong>. Para mudar, use “Região e espaço da horta” acima.</p>
        </div>

        <div className="familia-etapa">
          <h3><span className="familia-passo">2</span> O que sua família costuma comer?</h3>
          <p className="nota">Escolha as hortaliças e temperos que sua família realmente utiliza. Use a busca para encontrar novas opções e consulte as dicas antes de planejar o plantio.</p>
          <div className="familia-busca-cabecalho">
            <label className="campo">Buscar cultura
              <input type="search" value={busca} onChange={e => pesquisar(e.target.value)}
                placeholder="Ex.: brócolis, pepino, salsa…" />
            </label>
            <p role="status" className="nota">{todasCulturas.length} culturas disponíveis · {selecionadas.length} selecionadas</p>
          </div>
          <div className="familia-filtros" role="group" aria-label="Filtrar por tipo de hortaliça">
            {["Todas", ...categoriasCulturas].map(nome => (
              <button type="button" key={nome} className="familia-filtro" aria-pressed={categoria === nome}
                onClick={() => filtrar(nome)}>{nome}</button>
            ))}
          </div>
          {mostrarDestaques && <div className="familia-grupo">
            <h4>Sugestões para começar</h4>
            <div className="familia-seletor">
              {destaquesCulturas.map(nome => <CartaoCultura key={nome} nome={nome}
                selecionada={selecionadas.includes(nome)} aoSelecionar={selecionar} aoConsultar={definirCulturaDetalhe}/>)}
            </div>
          </div>}
          {mostrarDestaques ? <details className="familia-mais-culturas">
            <summary>Ver mais {outrasCulturas.length} culturas disponíveis</summary>
            <div className="familia-seletor">
              {outrasCulturas.map(nome => <CartaoCultura key={nome} nome={nome}
                selecionada={selecionadas.includes(nome)} aoSelecionar={selecionar} aoConsultar={definirCulturaDetalhe}/>)}
            </div>
          </details> : <div className="familia-grupo">
            <h4>Resultados ({outrasCulturas.length})</h4>
            {outrasCulturas.length ? <div className="familia-seletor">
              {outrasCulturas.map(nome => <CartaoCultura key={nome} nome={nome}
                selecionada={selecionadas.includes(nome)} aoSelecionar={selecionar} aoConsultar={definirCulturaDetalhe}/>)}
            </div> : <p role="status" className="nota">Nenhuma cultura encontrada. Tente outro nome ou selecione Todas.</p>}
          </div>}
          <aside className="familia-orientacoes" aria-labelledby="familia-orientacoes-titulo">
            <div className="familia-orientacoes-titulo">
              <IconeCultura nome={culturaDetalhe}/>
              <div>
                <h4 id="familia-orientacoes-titulo">Guia rápido: {culturaDetalhe}</h4>
                <p className="nota">{resumoCultura(culturaDetalhe)} · Época ({regiao}): {descreverEpocaPlantio(culturaDetalhe, regiao)}</p>
              </div>
            </div>
            <dl>
              <div><dt>Como começar</dt><dd>{orientacao?.plantio}</dd></div>
              <div><dt>Cuidados</dt><dd>{orientacao?.cuidados}</dd></div>
              <div><dt>Quando colher</dt><dd>{orientacao?.colheita}</dd></div>
              <div><dt>Como manter a colheita</dt><dd>{culturasOrganizador[culturaDetalhe]?.colheitasSucessivas ? "Essa planta pode oferecer mais de uma coleta. Registre o rendimento real para ajustar as metas." : "Divida os plantios em lotes com datas diferentes para distribuir a colheita."}</dd></div>
            </dl>
            <ValorAlimentar nome={culturaDetalhe} compacto/>
            {orientacao && <a href={fonteFichaCultura(orientacao.pagina)} target="_blank" rel="noopener noreferrer">
              Consultar ficha Embrapa/Sebrae
            </a>}
            <p className="nota">Os prazos e espaçamentos são referências. Ajuste cultivar, região, temperatura e manejo antes de plantar.</p>
          </aside>
          <div className="familia-metas">
            <h4>Metas por semana e frequência de plantio</h4>
            <p className="nota">Defina quanto quer colher e de quantas em quantas semanas iniciará um novo lote. O intervalo é uma hipótese editável, não uma frequência universal: o resultado e a área estimada serão recalculados automaticamente.</p>
            <label className="familia-venda">
              <input type="checkbox" checked={incluirVenda} onChange={e => definirIncluirVenda(e.target.checked)}/>
              Quero planejar excedentes para venda
            </label>
            {selecionadas.map(cultura => (
              <div className="familia-meta" key={cultura}>
                <div className="familia-meta-cultura">
                  <IconeCultura nome={cultura}/>
                  <span><strong>{cultura}</strong><small>{culturasOrganizador[cultura].unidade} por semana</small></span>
                </div>
                <label>Para casa
                  <input inputMode="decimal" aria-label={"Consumo semanal da casa para " + cultura}
                    value={metasCasa[cultura] === undefined ? textoNumero(metaExemplo(cultura, pessoas)) : metasCasa[cultura]}
                    onChange={e => definirMetasCasa(atuais => ({ ...atuais, [cultura]: e.target.value }))} />
                </label>
                {incluirVenda && <label>Para venda
                  <input inputMode="decimal" aria-label={"Meta semanal de venda de " + cultura}
                    value={metasVenda[cultura] ?? "0"} onChange={e => definirMetasVenda(atuais => ({ ...atuais, [cultura]: e.target.value }))}/>
                </label>}
                <label>Novo lote a cada (semanas)
                  <input type="number" min="1" max="52" step="1"
                    aria-label={"Intervalo entre novos lotes de " + cultura + " em semanas"}
                    value={intervalos[cultura] === undefined ? String(intervaloPadrao(cultura)) : intervalos[cultura]}
                    onChange={e => definirIntervalos(atuais => ({ ...atuais, [cultura]: e.target.value }))}/>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="familia-etapa">
          <h3><span className="familia-passo">3</span> Quanto plantar, quando repetir e quando colher</h3>
          <p className="nota">As três respostas abaixo usam a sua meta semanal, a frequência escolhida e as referências de ciclo de cada cultura. São estimativas; confira a época regional e o desenvolvimento real das plantas.</p>
          {sugestao.erro ? <p className="erro" role="alert">{sugestao.erro}</p> : <>
            <div className="familia-indicadores">
              <div><span>Área disponível</span><strong>{formatarMedida(sugestao.areaTotal)} m²</strong></div>
              <div><span>Área simultânea estimada</span><strong>{formatarMedida(sugestao.areaReservada + sugestao.areaNova)} m²</strong></div>
              <div><span>Canteiros equivalentes necessários</span><strong>{sugestao.canteirosNecessarios}</strong></div>
            </div>
            {sugestao.faltaArea > 0 && <p className="aviso" role="status">
              Faltam aproximadamente <strong>{formatarMedida(sugestao.faltaArea)} m²</strong> para reservar o conjunto de cultivos. Aumente os canteiros, reduza as metas ou retire uma cultura.
            </p>}
            <ol className="familia-previsoes" aria-label="Planejamento por cultura">
              {sugestao.sugestoes.map(({ plano, area, plantas, experimental, alertaEpoca, reservas, seguintes }) => {
                const ficha = culturasOrganizador[plano.cultura];
                const primeiro = seguintes[0];
                const proximo = seguintes[1];
                const inicioRotulo = plano.origem === "muda" ? "Usar mudas prontas"
                  : ficha.mudas ? "Semear para formar mudas" : "Semear no canteiro";
                return <li key={plano.cultura}>
                  <div className="familia-previsao-titulo">
                    <IconeCultura nome={plano.cultura}/>
                    <div>
                      <strong>{plano.cultura}</strong>
                      <span>Meta semanal: {formatarMedida(plano.casa)} {ficha.unidade} para casa
                        {plano.venda > 0 && " + " + formatarMedida(plano.venda) + " " + ficha.unidade + " para venda"}</span>
                    </div>
                  </div>
                  <div className="familia-respostas">
                    <div>
                      <span>1. Quanto plantar</span>
                      <strong>{formatarMedida(plantas)} {plantas === 1 ? "planta" : "plantas"} por lote</strong>
                      <small>{experimental ? "Lote experimental; produção ainda não conhecida" : "Quantidade estimada a partir da meta informada"}</small>
                    </div>
                    <div>
                      <span>2. Quando plantar novamente</span>
                      <strong>A cada {plano.intervalo * 7} dias</strong>
                      <small>Próximo lote: {rotuloData(proximo.inicio)}</small>
                    </div>
                    <div>
                      <span>3. Quando esperar a colheita</span>
                      <strong>{janelaDeDatas(primeiro.colheita.de, primeiro.colheita.ate)}</strong>
                      <small>{ficha.colheitasSucessivas ? "Início estimado de colheitas sucessivas" : "Primeira janela estimada de colheita"}</small>
                    </div>
                  </div>
                  <details className="familia-cronograma">
                    <summary>Ver datas dos três primeiros lotes</summary>
                    <ol>
                      {seguintes.map(lote => <li key={lote.inicio}>
                        <strong>Lote {lote.numero}</strong>
                        <dl>
                          <div><dt>{inicioRotulo}</dt><dd>{rotuloData(lote.inicio)}</dd></div>
                          {ficha.mudas && plano.origem === "semente" && <div>
                            <dt>Transplantar para o canteiro</dt>
                            <dd>{janelaDeDatas(lote.canteiro.de, lote.canteiro.ate)}</dd>
                          </div>}
                          <div>
                            <dt>{ficha.colheitasSucessivas ? "Começar a colher" : "Colher"}</dt>
                            <dd>{janelaDeDatas(lote.colheita.de, lote.colheita.ate)}</dd>
                          </div>
                        </dl>
                      </li>)}
                    </ol>
                  </details>
                  <p>Área simultânea estimada: <strong>{formatarMedida(area)} m²</strong>.
                    Reservas: {reservas.length ? reservas.map(item => item.nome + " (" + formatarMedida(item.area) + " m²)").join(" · ") : "sem área disponível"}.</p>
                  {experimental && <p className="familia-alerta">A meta em kg não está validada: acompanhe a produção do lote de teste e ajuste as próximas quantidades.</p>}
                  {alertaEpoca && <p className="familia-alerta">Atenção à época de plantio: {alertaEpoca} Confira a janela regional dos três primeiros lotes.</p>}
                </li>;
              })}
            </ol>
            <section className="sq-rotacao-instrucao" aria-labelledby="sq-rotacao-titulo">
              <h4 id="sq-rotacao-titulo">Depois da colheita: como fazer rotação de culturas?</h4>
              <p>Escalonar é semear em datas diferentes. Rotacionar é alternar famílias botânicas no <strong>mesmo canteiro, em ciclos posteriores</strong>; pode ajudar a organizar o manejo de solo e pragas, mas não garante ausência de doenças.</p>
              {alternativasRotacao.length ? <>
                <p>Exemplos com suas culturas, somente depois de liberar o canteiro:</p>
                <ul>{alternativasRotacao.map(item => <li key={item.origem}>
                  <strong>{item.origem}</strong> ({item.familiaOrigem}) → <strong>{item.destino}</strong> ({item.familiaDestino}).
                </li>)}</ul>
              </> : <p>Selecione duas ou mais culturas de famílias botânicas diferentes para ver exemplos. Consulte o histórico antes de repetir plantios.</p>}
              <p className="nota">Orientação didática: não reserva canteiros automaticamente, nem avalia doenças anteriores, adubação ou épocas compatíveis. Confirme a sequência com orientação local.</p>
              <a href={fonteRotacao} target="_blank" rel="noopener noreferrer">MAPA — ficha de rotação de hortaliças</a>
            </section>
            <details className="familia-limites">
              <summary>Premissas, limites e fontes</summary>
              <ul>{sugestao.avisos.map(item => <li key={item}>{item}</li>)}</ul>
              <p>Não há garantia de colheita semanal: chuvas, temperatura, cultivar e manejo alteram as datas. A ocupação considera reservas de área, não a posição real das plantas, e não gera os desenhos dos canteiros.</p>
              <p><a href={fonteEscalonamento} target="_blank" rel="noopener noreferrer">Embrapa — Escalonamento em canteiros</a></p>
              <p><a href="https://www.scielo.br/j/csc/a/Tpdj5PbtVq8QRWd8skyCqsm/?format=html&lang=pt" target="_blank" rel="noopener noreferrer">Pesquisa científica — aquisição domiciliar de hortaliças baseada na POF/IBGE</a></p>
            </details>
            <div className="familia-acoes">
              <button type="button" className="botao" disabled={bloqueado || salvando || !sugestao.cabe}
                onClick={salvarPlano}>{salvando ? "Adicionando…" : "Adicionar sugestões à minha agenda"}</button>
              <a className="botao botao-contorno" href={window.location.pathname.includes("/meu-quintal/")
                ? "../horta/canteiros/" : "../canteiros/"}>Desenhar um canteiro</a>
            </div>
            <p className="nota">Os novos cultivos serão salvos na agenda deste navegador, sem apagar os existentes. Se a área total da horta ainda não tiver sido definida, ela será preenchida com a soma dos canteiros. Os canteiros recebem nomes e reservas estimadas; a integração automática com o desenho será uma próxima etapa.</p>
          </>}
          {retorno && <p className={falha ? "erro" : "organizador-status"} role={falha ? "alert" : "status"}>{retorno}</p>}
        </div>
      </div>
    </details>
  );
}
