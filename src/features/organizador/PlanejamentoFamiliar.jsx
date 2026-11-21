import { useEffect, useRef, useState } from "react";
import IconeCultura from "./IconeCultura.jsx";
import { culturasOrganizador, fonteEscalonamento } from "./culturas.js";
import { calcularPlanoFamiliar, metaExemplo, sugestoesDeConsumo } from "./planoFamiliar.js";
import { hojeCivil, janelaDeDatas } from "./escala.js";
import { formatarMedida, lerMedida } from "../planejador/geometria.js";
import "../../styles/plano-familiar.css";

const grupos = [
  { titulo: "Mais procuradas para a mesa", culturas: ["Alface de verão", "Cenoura de verão", "Tomate de mesa"] },
  { titulo: "Outras culturas disponíveis", culturas: ["Rúcula", "Rabanete", "Beterraba", "Couve", "Abobrinha", "Alface de inverno", "Cenoura de inverno"] },
];

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
  const [incluirVenda, definirIncluirVenda] = useState(false);
  const [salvando, definirSalvando] = useState(false);
  const [retorno, definirRetorno] = useState("");
  const detalheRef = useRef(null);
  useEffect(() => {
    if (window.location.hash === "#planejamento-familiar" && detalheRef.current) detalheRef.current.open = true;
  }, []);
  const [falha, definirFalha] = useState(false);

  function selecionar(nome, marcado) {
    definirSelecionadas(atuais => marcado ? [...atuais, nome] : atuais.filter(c => c !== nome));
    definirRetorno("");
  }

  const preferencias = selecionadas.map(cultura => ({
    cultura,
    casa: metasCasa[cultura] === undefined ? metaExemplo(cultura, pessoas) : lerMedida(metasCasa[cultura], 0),
    venda: incluirVenda ? (metasVenda[cultura] === undefined ? 0 : lerMedida(metasVenda[cultura], 0)) : 0,
  }));
  const sugestao = calcularPlanoFamiliar({
    pessoas, quantidadeCanteiros: quantidade, largura: lerMedida(largura),
    comprimento: lerMedida(comprimento), inicio, regiao, preferencias, planosExistentes,
  });

  async function salvarPlano() {
    if (sugestao.erro || !sugestao.cabe || bloqueado || salvando) return;
    definirSalvando(true);
    definirRetorno("");
    try {
      const resultado = await aoAplicar(sugestao.sugestoes.map(({ plano }) => plano));
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
          <strong>Planejamento para colher com frequência</strong>
          <small>Escolha o que a família consome e veja uma sugestão de lotes por canteiro.</small>
        </span>
        <span className="familia-chamada-acao">Montar minha horta</span>
      </summary>
      <div className="familia-conteudo">
        <p className="nota">Este assistente reaproveita os ciclos de cultivo e a agenda do Seu Quintal. As quantidades sugeridas são apenas exemplos iniciais editáveis, não médias oficiais de consumo.</p>
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
          <p className="nota">Tomate e cenoura estão entre as hortaliças mais adquiridas no Brasil; cebola também aparece nas pesquisas, mas ainda não tem cálculo nesta ferramenta. A alface é uma opção frequente para hortas domésticas.</p>
          {grupos.map((grupo, indice) => (
            <div key={grupo.titulo} className="familia-grupo">
              {indice === 0 ? <h4>{grupo.titulo}</h4> : <details>
                <summary>Ver mais culturas disponíveis</summary>
                <h4>{grupo.titulo}</h4>
                <div className="familia-seletor">
                  {grupo.culturas.map(nome => <label key={nome} className="familia-cultura">
                    <input type="checkbox" checked={selecionadas.includes(nome)} onChange={e => selecionar(nome, e.target.checked)}/>
                    <IconeCultura nome={nome}/>
                    <span>{nome}</span>
                  </label>)}
                </div>
              </details>}
              {indice === 0 && <div className="familia-seletor">
                {grupo.culturas.map(nome => <label key={nome} className="familia-cultura">
                  <input type="checkbox" checked={selecionadas.includes(nome)} onChange={e => selecionar(nome, e.target.checked)}/>
                  <IconeCultura nome={nome}/>
                  <span>{nome}</span>
                </label>)}
              </div>}
            </div>
          ))}
          <div className="familia-metas">
            <h4>Metas por semana — ajuste ao consumo real</h4>
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
              </div>
            ))}
          </div>
        </div>

        <div className="familia-etapa">
          <h3><span className="familia-passo">3</span> Sugestão de plantios e canteiros</h3>
          {sugestao.erro ? <p className="erro" role="alert">{sugestao.erro}</p> : <>
            <div className="familia-indicadores">
              <div><span>Área disponível</span><strong>{formatarMedida(sugestao.areaTotal)} m²</strong></div>
              <div><span>Área simultânea estimada</span><strong>{formatarMedida(sugestao.areaReservada + sugestao.areaNova)} m²</strong></div>
              <div><span>Canteiros equivalentes necessários</span><strong>{sugestao.canteirosNecessarios}</strong></div>
            </div>
            {sugestao.faltaArea > 0 && <p className="aviso" role="status">
              Faltam aproximadamente <strong>{formatarMedida(sugestao.faltaArea)} m²</strong> para reservar o conjunto de cultivos. Aumente os canteiros, reduza as metas ou retire uma cultura.
            </p>}
            <ol className="familia-previsoes">
              {sugestao.sugestoes.map(({ plano, area, plantas, experimental, alertaEpoca, reservas, seguintes }) => (
                <li key={plano.cultura}>
                  <div className="familia-previsao-titulo">
                    <IconeCultura nome={plano.cultura}/>
                    <div><strong>{plano.cultura}</strong><span>{plantas} {plantas === 1 ? "planta" : "plantas"} por lote · {formatarMedida(area)} m² de reserva simultânea</span></div>
                  </div>
                  <p>Reservas: {reservas.length ? reservas.map(item => item.nome + " (" + formatarMedida(item.area) + " m²)").join(" · ") : "sem área disponível"}</p>
                  <p>Primeiras colheitas estimadas: {seguintes.map(lote => janelaDeDatas(lote.colheita.de, lote.colheita.ate)).join(" · ")}</p>
                  {experimental && <p className="familia-alerta">Lote de teste de 2 plantas. A meta em kg depende de medir a produção durante o ciclo.</p>}
                  {alertaEpoca && <p className="familia-alerta">{alertaEpoca}</p>}
                </li>
              ))}
            </ol>
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
              <a className="botao botao-contorno" href="../canteiros/">Desenhar um canteiro</a>
            </div>
            <p className="nota">Os novos cultivos serão salvos na agenda deste navegador, sem apagar os existentes. Os canteiros recebem nomes e reservas estimadas; a integração automática com o desenho será uma próxima etapa.</p>
          </>}
          {retorno && <p className={falha ? "erro" : "organizador-status"} role={falha ? "alert" : "status"}>{retorno}</p>}
        </div>
      </div>
    </details>
  );
}
