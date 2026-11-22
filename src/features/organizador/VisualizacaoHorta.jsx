import IconeCultura from "./IconeCultura.jsx";
import { culturasOrganizador } from "./culturas.js";
import { janelaDeDatas, rotuloData } from "./escala.js";
import { formatarMedida } from "../planejador/geometria.js";
import "../../styles/visual-horta.css";

/**
 * Duas leituras de uma única simulação: reservas equivalentes de canteiros
 * e lotes escalonados. Reutiliza os SVGs reais do catálogo do site.
 * NÃO representa posições de plantas nem geometria em escala.
 */
export default function VisualizacaoHorta({ resultado, compacto = false }) {
  if (!resultado || resultado.erro || !resultado.sugestoes?.length) return null;
  const total = Math.min(resultado.quantidadeConsiderada ?? 0, 24);
  const canteiros = Array.from({ length: total }, (_, indice) => {
    const nome = "Canteiro " + (indice + 1);
    const culturas = resultado.sugestoes.flatMap(item =>
      (item.reservas || []).filter(r => r.nome === nome).map(r => ({
        nome: item.plano.cultura, area: r.area,
      }))
    );
    const existente = Math.max(0, Math.min(resultado.areaCanteiro, resultado.areaReservada - indice * resultado.areaCanteiro));
    return { nome, culturas, existente };
  });
  return <section className="sq-horta-visual" aria-labelledby="sq-horta-visual-titulo">
    <header>
      <h4 id="sq-horta-visual-titulo">Veja como distribuir os lotes</h4>
      <p>As figuras usam as ilustrações das próprias culturas do Seu Quintal. Canteiros e estágios são uma <strong>representação didática</strong>, sem posições de plantas ou medidas em escala.</p>
    </header>
    {total > 0 && <div className="sq-horta-visual-setores">
      <h5>Exemplo de reservas por canteiro</h5>
      <ol className="sq-horta-mapa">
        {canteiros.map(canteiro => <li key={canteiro.nome} className="sq-horta-mapa-canteiro">
          <strong>{canteiro.nome}</strong>
          <span className="sq-horta-mapa-area">{formatarMedida(resultado.areaCanteiro)} m² de área útil</span>
          {canteiro.culturas.length ? <ul className="sq-horta-mapa-culturas">
            {canteiro.culturas.map(cultura => <li key={cultura.nome}>
              <IconeCultura nome={cultura.nome}/>
              <span>{cultura.nome}<small>{formatarMedida(cultura.area)} m² reservados</small></span>
            </li>)}
          </ul> : <p className="sq-horta-mapa-vazio">Sem nova cultura alocada</p>}
          {canteiro.existente > 0 && <small>Inclui {formatarMedida(canteiro.existente)} m² já reservados em planos anteriores.</small>}
        </li>)}
      </ol>
      {resultado.canteirosNecessarios > total && <p role="status">A área calculada equivale a {resultado.canteirosNecessarios} canteiros-modelo; mostramos apenas {total}. Reduza as metas ou revise a configuração.</p>}
    </div>}
    <div className="sq-horta-visual-setores">
      <h5>Etapas dos primeiros três lotes</h5>
      <div className="sq-horta-linhas">
        {resultado.sugestoes.map(item => {
          const ficha = culturasOrganizador[item.plano.cultura];
          return <div className="sq-horta-linha" key={item.plano.cultura}>
            <div className="sq-horta-linha-titulo">
              <IconeCultura nome={item.plano.cultura}/>
              <strong>{item.plano.cultura}</strong>
            </div>
            <ol className="sq-horta-lotes-visuais">
              {item.seguintes.map(lote => <li key={lote.inicio} className="sq-horta-lote-visual">
                <strong>Lote {lote.numero}</strong>
                <div className="sq-horta-estagios" aria-label={"Etapas do lote " + lote.numero}>
                  <div>
                    <span className="sq-horta-estagio-sinal" aria-hidden="true">1</span>
                    <span>{item.plano.origem === "muda" ? "Mudas prontas" : ficha.mudas ? "Semeadura em bandeja" : "Semeadura"}</span>
                    <small>{rotuloData(lote.inicio)}</small>
                  </div>
                  <div>
                    <span className="sq-horta-estagio-sinal" aria-hidden="true">2</span>
                    <span>{ficha.mudas ? "Transplante / desenvolvimento" : "Desenvolvimento"}</span>
                    <small>{ficha.mudas ? "Transplantar: " + janelaDeDatas(lote.canteiro.de, lote.canteiro.ate)
                      : "Até início estimado de colheita: " + rotuloData(lote.colheita.de)}</small>
                  </div>
                  <div>
                    <span className="sq-horta-estagio-sinal" aria-hidden="true">3</span>
                    <span>{ficha.colheitasSucessivas ? "Começar a colher" : "Colheita estimada"}</span>
                    <small>{janelaDeDatas(lote.colheita.de, lote.colheita.ate)}</small>
                  </div>
                </div>
              </li>)}
            </ol>
          </div>;
        })}
      </div>
    </div>
    <p className="sq-horta-visual-limites">O intervalo entre plantios não garante colheita contínua. Considere o clima, o manejo, a época regional e o desenvolvimento real de cada lote. Os caminhos de circulação e a forma final dos canteiros ainda devem ser planejados.</p>
    {!compacto && <p><a href={window.location.pathname.includes("/meu-quintal/") ? "../horta/canteiros/" : "../canteiros/"}>Abrir planejador visual de canteiros</a> para conferir o desenho em escala e os espaçamentos.</p>}
  </section>;
}
