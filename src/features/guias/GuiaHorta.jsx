import { useState } from "react";
import { plantasHorta } from "../../data/plantas-horta.js";
import IconeCultura from "../organizador/IconeCultura.jsx";
import { exemploParaCultivo, recomendarCultivos } from "./recomendacoesHorta.js";
import CalculadoraTerra from "./CalculadoraTerra.jsx";

const espacos = {
  janela: { nome: "Janela iluminada", detalhe: "Pequenos vasos em uma janela segura.",
    orientacao: "Vasos estáveis, sempre do lado interno, com drenagem. Não apoie recipientes pesados no peitoril." },
  varanda: { nome: "Varanda", detalhe: "Jardineiras e vasos de diferentes tamanhos.",
    orientacao: "Vasos ou jardineiras bem drenados. Considere o peso da terra molhada e o limite estrutural da varanda." },
  quintal: { nome: "Quintal", detalhe: "Canteiros pequenos ou cultivo em recipientes.",
    orientacao: "Canteiros acessíveis sem pisar na terra ou vasos com drenagem e local adequado." },
};

const luzes = {
  pouca: { nome: "Menos de 3 horas", detalhe: "Luz direta por pouco tempo.",
    passo: "Se o local for claro mesmo sem sol, teste primeiro uma muda de hortelã ou salsinha. Com pouca luminosidade, o crescimento pode ser fraco." },
  parcial: { nome: "3 a menos de 6 horas", detalhe: "Sol apenas em parte do dia.",
    passo: "Comece com uma folhosa ou um tempero e observe luz, desenvolvimento e umidade ao longo das semanas." },
  pleno: { nome: "6 horas ou mais", detalhe: "Boa exposição ao sol direto.",
    passo: "Escolha uma opção compatível com o recipiente. Se o sol da tarde for muito forte, proteja folhas mais sensíveis e confira a irrigação." },
};

const secoes = [
  { id: "plantas", rotulo: "Escolher plantas", numero: "1" },
  { id: "terra", rotulo: "Calcular terra", numero: "2" },
];

function CartaoCultivo({ item, raiz, aoCalcular, cuidadoExtra = false }) {
  return <li className="horta-cultura-card">
    {item.foto ? (
      <img src={`${raiz}imagens/horta/${item.id}.webp`} width="360" height="240"
        alt="" loading="lazy" />
    ) : (
      <div className="horta-cultura-ilustracao" aria-hidden="true">
        <IconeCultura nome={item.culturaAgenda ?? item.nome}/>
      </div>
    )}
    <div className="horta-cultura-texto">
      <strong>{item.nome}</strong>
      <p>{item.dica}</p>
      {cuidadoExtra && <p className="horta-cuidado-sol"><b>Atenção ao sol:</b> {item.cuidadoSol}</p>}
      <button className="horta-calcular-da-planta" type="button" onClick={() => aoCalcular(item.id)}>
        Calcular terra para {item.nome} <span aria-hidden="true">→</span>
      </button>
    </div>
  </li>;
}

export default function GuiaHorta({ guia, raiz = "./" }) {
  const [secao, definirSecao] = useState("plantas");
  const [espaco, definirEspaco] = useState("");
  const [luz, definirLuz] = useState("");
  const [cultivoParaTerra, definirCultivoParaTerra] = useState(null);
  const sugestao = espaco && luz ? recomendarCultivos(espaco, luz) : null;

  function calcularParaCultura(id) {
    definirCultivoParaTerra(exemploParaCultivo(id, espaco));
    definirSecao("terra");
    requestAnimationFrame(() => document.getElementById("titulo-terra")?.focus({ preventScroll: false }));
  }

  const todosCultivos = sugestao
    ? [...sugestao.principais, ...sugestao.outrasAdequadas, ...sugestao.comCuidados]
    : [];

  return (
    <div className="guia-horta horta-ferramentas-v2">
      <div className="horta-ferramentas-intro">
        <div>
          <span className="horta-sobretitulo">FERRAMENTAS GRATUITAS · SEM CADASTRO</span>
          <p>Escolha uma planta para seu espaço e descubra quanto de terra cabe em um recipiente de exemplo.</p>
        </div>
        <div className="horta-secoes" role="group" aria-label="Ferramentas para sua horta">
          {secoes.map(({ id, rotulo, numero }) => (
            <button key={id} type="button" className="horta-secao-botao"
              aria-controls={`guia-horta-${id}`} aria-pressed={secao === id}
              onClick={() => definirSecao(id)}>
              <span className="horta-secao-numero" aria-hidden="true">{numero}</span>
              {rotulo}
            </button>
          ))}
        </div>
      </div>

      <section id="guia-horta-plantas" className="horta-painel" hidden={secao !== "plantas"}
        aria-label="Escolha plantas para seu espaço">
        <div className="horta-painel-cabecalho">
          <h3>Descubra o que pode plantar</h3>
          <p>Responda duas perguntas para encontrar exemplos de cultivo. As sugestões não representam todas as espécies possíveis.</p>
        </div>
        <div className="horta-escolhas">
          <fieldset className="horta-campo-escolha">
            <legend><span className="horta-numero" aria-hidden="true">1</span> Onde você vai plantar?</legend>
            <div className="horta-opcoes" role="group" aria-label="Escolha seu espaço">
              {Object.entries(espacos).map(([id, opcao]) => (
                <button key={id} type="button" aria-pressed={espaco === id}
                  className="horta-opcao" onClick={() => definirEspaco(id)}>
                  <strong>{opcao.nome}</strong>
                  <span>{opcao.detalhe}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="horta-campo-escolha">
            <legend><span className="horta-numero" aria-hidden="true">2</span> Quanto tempo de sol direto recebe?</legend>
            <p className="horta-ajuda">Conte apenas quando o sol bate diretamente no local, sem considerar luz indireta.</p>
            <div className="horta-opcoes" role="group" aria-label="Horas de sol direto por dia">
              {Object.entries(luzes).map(([id, opcao]) => (
                <button key={id} type="button" aria-pressed={luz === id}
                  className="horta-opcao" onClick={() => definirLuz(id)}>
                  <strong>{opcao.nome}</strong>
                  <span>{opcao.detalhe}</span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="horta-recomendacoes">
          {!sugestao ? (
            <div className="horta-estado-inicial">
              <span className="horta-estado-icone" aria-hidden="true">✳</span>
              <div>
                <strong>Suas sugestões aparecem aqui</strong>
                <p>{!espaco ? "Primeiro, escolha onde será sua horta." : "Ótimo! Agora informe quantas horas de sol direto o local recebe."}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="horta-recomendacoes-titulo">
                <div>
                  <span className="horta-sobretitulo">IDEIAS PARA COMEÇAR</span>
                  <h4>Plantas para experimentar</h4>
                  <p>Para {espacos[espaco].nome.toLocaleLowerCase("pt-BR")}, com {luzes[luz].nome.toLocaleLowerCase("pt-BR")} de sol direto.</p>
                </div>
                <button type="button" className="horta-limpar" onClick={() => { definirEspaco(""); definirLuz(""); }}>
                  Refazer escolhas
                </button>
              </div>
              <p className="horta-recomendacoes-status" aria-live="polite">
                {sugestao.total} opções para explorar: algumas pedem adaptação da luz e cuidados extras.
              </p>
              {luz === "pouca" && <p className="horta-aviso-luz">
                Atenção: menos de 3 horas de sol direto é pouco para muitas hortaliças. Essas opções são testes em locais claros, não uma garantia de colheita.
              </p>}
              <h5 className="horta-recomendacoes-subtitulo">Opções para a luz informada</h5>
              <ul className="culturas-com-fotos horta-culturas">
                {sugestao.principais.map(item =>
                  <CartaoCultivo key={item.id} item={item} raiz={raiz} aoCalcular={calcularParaCultura}/>)}
              </ul>
              {sugestao.outrasAdequadas.length > 0 && (
                <details className="horta-mais-culturas">
                  <summary>Ver mais {sugestao.outrasAdequadas.length} opções para essa faixa de sol</summary>
                  <ul className="culturas-com-fotos horta-culturas">
                    {sugestao.outrasAdequadas.map(item =>
                      <CartaoCultivo key={item.id} item={item} raiz={raiz} aoCalcular={calcularParaCultura}/>)}
                  </ul>
                </details>
              )}
              {sugestao.comCuidados.length > 0 && (
                <details className="horta-mais-culturas horta-outras-condicoes">
                  <summary>Outras {sugestao.comCuidados.length} opções que podem funcionar com cuidados</summary>
                  <p>Ter mais horas de sol amplia possibilidades, mas não obriga uma planta de meia-sombra a suportar sol intenso. Em locais muito quentes, algumas precisam de sombra no período da tarde.</p>
                  <ul className="culturas-com-fotos horta-culturas">
                    {sugestao.comCuidados.map(item =>
                      <CartaoCultivo key={item.id} item={item} raiz={raiz} aoCalcular={calcularParaCultura} cuidadoExtra/>)}
                  </ul>
                </details>
              )}
              <dl className="horta-orientacoes">
                <div><dt>Onde plantar</dt><dd>{espacos[espaco].orientacao}</dd></div>
                <div><dt>Primeiro passo</dt><dd>{luzes[luz].passo}</dd></div>
              </dl>
              <div className="horta-proximos-passos">
                <a className="botao" href={`${raiz}horta/calendario-de-plantio/`}>Ver calendário da minha região</a>
                <a className="botao botao-contorno" href={`${raiz}horta/organizador/#planejamento-familiar`}>Explorar o catálogo completo</a>
                <a className="botao botao-contorno" href={`${raiz}horta/canteiros/`}>Desenhar meu canteiro</a>
              </div>
              <p className="horta-ressalva">
                As recomendações são exemplos, não lista exaustiva nem garantia de sucesso.
                Verifique temperatura, cultivar, ventilação, profundidade, drenagem e segurança do local.
              </p>
              <details className="creditos-culturas">
                <summary>Fontes técnicas e créditos das fotografias</summary>
                <a href="https://www.sistemafaep.org.br/wp-content/uploads/2026/01/PR.0390-Jardins-produtivos-horas-e-pomares_web.pdf"
                  target="_blank" rel="noopener noreferrer">SENAR-PR · Luminosidade e cultivo</a>
                {" · "}<a href="https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1000838/1/Horta-em-casa.pdf"
                  target="_blank" rel="noopener noreferrer">Embrapa · Horta em casa</a>
                {" · "}<a href={guia.url} target="_blank" rel="noopener noreferrer">{guia.fonte}</a>
                <ul>
                  {todosCultivos.filter(item => item.foto).map(item => {
                    const { nome, arquivo, autor, licenca, codigo } = plantasHorta[item.id];
                    return <li key={item.id}>
                      <a href={`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(arquivo.replaceAll(" ", "_"))}`}
                        target="_blank" rel="noopener noreferrer">{nome} · {autor}</a>
                      {" · "}{codigo ? <a href={`https://creativecommons.org/licenses/${codigo}/`}
                        target="_blank" rel="noopener noreferrer">{licenca}</a> : licenca}
                    </li>;
                  })}
                </ul>
              </details>
            </>
          )}
        </div>
      </section>

      <div id="guia-horta-terra" className="horta-painel" hidden={secao !== "terra"}>
        <CalculadoraTerra sugestaoCultivo={cultivoParaTerra}
          voltarParaSugestoes={() => definirSecao("plantas")} />
      </div>
    </div>
  );
}
