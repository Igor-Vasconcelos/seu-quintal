import { useRef, useState } from "react";
import { distancia, formatarMedida, limitarPosicao, passoDaMalha } from "./geometria.js";
import { tiposDeArea } from "./projetos.js";

function posicaoEmPercentual(ponto, terreno) {
  return {
    left: `${ponto.x / terreno.largura * 100}%`,
    top: `${ponto.y / terreno.comprimento * 100}%`,
  };
}

function MarcasDaRegua({ pontos, terreno }) {
  const [inicio, fim] = pontos;
  if (!inicio) return null;
  const angulo = fim ? Math.atan2(fim.y - inicio.y, fim.x - inicio.x) : 0;
  return (
    <div className="marcas-regua" aria-hidden="true">
      {fim && <span className="regua-linha" style={{
        ...posicaoEmPercentual(inicio, terreno),
        width: `${distancia(inicio, fim) / terreno.largura * 100}%`,
        transform: `rotate(${angulo}rad)`,
      }} />}
      {pontos.map((ponto, indice) => (
        <span key={indice} className="regua-ponto" style={posicaoEmPercentual(ponto, terreno)} />
      ))}
    </div>
  );
}

export default function Planta({
  terreno, itens = [], mostrarFrente = false, estrada = false, declive = "",
  selecionado, conflitos, pontos = [], aoMarcarPonto, aoSelecionar, aoMover,
}) {
  const planta = useRef(null);
  const arrasto = useRef(null);
  const ignorarClique = useRef(null);
  const [previa, definirPrevia] = useState(null);
  const interativa = Boolean(aoSelecionar || aoMarcarPonto);

  // O fator comum mantém distâncias e ângulos proporcionais nos dois eixos.
  const maiorLado = Math.max(terreno.largura, terreno.comprimento);
  const passo = passoDaMalha(terreno);
  const estilo = {
    width: `${terreno.largura / maiorLado * 100}%`,
    height: `${terreno.comprimento / maiorLado * 100}%`,
    "--passo-x": `${passo / terreno.largura * 100}%`,
    "--passo-y": `${passo / terreno.comprimento * 100}%`,
  };

  function pontoDoEvento(evento) {
    const { left, top, width, height } = planta.current.getBoundingClientRect();
    return {
      x: (evento.clientX - left) / width * terreno.largura,
      y: (evento.clientY - top) / height * terreno.comprimento,
    };
  }

  function iniciarArrasto(evento, item) {
    if (!evento.isPrimary || evento.button !== 0) return;
    ignorarClique.current = null;
    arrasto.current = {
      item, idPonteiro: evento.pointerId, origem: pontoDoEvento(evento),
      clientX: evento.clientX, clientY: evento.clientY, posicao: null,
    };
    evento.currentTarget.setPointerCapture(evento.pointerId);
  }

  function moverArrasto(evento) {
    const ativo = arrasto.current;
    if (!ativo || ativo.idPonteiro !== evento.pointerId) return;
    if (!ativo.posicao && Math.hypot(evento.clientX - ativo.clientX, evento.clientY - ativo.clientY) < 4) return;
    const ponto = pontoDoEvento(evento);
    ativo.posicao = limitarPosicao(
      ativo.item.x + ponto.x - ativo.origem.x,
      ativo.item.y + ponto.y - ativo.origem.y,
      ativo.item, terreno,
    );
    definirPrevia({ id: ativo.item.id, ...ativo.posicao });
  }

  function finalizarArrasto(evento, cancelar = false) {
    const ativo = arrasto.current;
    if (!ativo || ativo.idPonteiro !== evento.pointerId) return;
    arrasto.current = null;
    definirPrevia(null);
    if (cancelar || !ativo.posicao) return;
    ignorarClique.current = ativo.item.id;
    aoMover(ativo.item, ativo.posicao);
  }

  return (
    <div className="planta-moldura">
      <div ref={planta} className={`planta${mostrarFrente ? " planta-com-frente" : ""}${estrada ? " planta-com-estrada" : ""}${aoMarcarPonto ? " planta-posicionavel" : ""}`}
        style={estilo} role={interativa ? "group" : "img"}
        aria-label={`Planta em escala de ${formatarMedida(terreno.largura)} por ${formatarMedida(terreno.comprimento)} metros${mostrarFrente ? ", com a frente na borda inferior" : ""}`}
        onClick={aoMarcarPonto && ((evento) => aoMarcarPonto(pontoDoEvento(evento)))}>
        {declive && <span className="planta-declive" data-direcao={declive} aria-hidden="true">↓</span>}
        {itens.map((item) => {
          const posicao = previa?.id === item.id ? previa : item;
          const ponto = item.tipo === "muda";
          const propriedades = {
            className: `planta-item${ponto ? " planta-muda" : ""}${item.existente ? " planta-item-existente" : ""}${aoMover ? " planta-item-movel" : ""}${conflitos?.has(item.id) ? " planta-item-conflito" : ""}`,
            "data-cor": tiposDeArea[item.tipo].cor,
            title: item.nome,
            style: {
              ...posicaoEmPercentual(posicao, terreno),
              ...(!ponto && {
                width: `${item.largura / terreno.largura * 100}%`,
                height: `${item.comprimento / terreno.comprimento * 100}%`,
              }),
            },
          };
          const rotulo = !ponto && <span className="planta-item-rotulo">{item.nome}</span>;
          return aoSelecionar && !aoMarcarPonto
            ? <button key={item.id} {...propriedades} type="button"
                aria-label={item.nome} aria-pressed={selecionado === item.id}
                onClick={(evento) => {
                  evento.stopPropagation();
                  if (ignorarClique.current !== item.id || evento.detail === 0) aoSelecionar(item);
                  ignorarClique.current = null;
                }}
                onPointerDown={aoMover && ((evento) => iniciarArrasto(evento, item))}
                onPointerMove={aoMover && moverArrasto}
                onPointerUp={aoMover && finalizarArrasto}
                onPointerCancel={aoMover && ((evento) => finalizarArrasto(evento, true))}
                onLostPointerCapture={aoMover && ((evento) => finalizarArrasto(evento, true))}>{rotulo}</button>
            : <span key={item.id} {...propriedades}>{rotulo}</span>;
        })}
        <MarcasDaRegua pontos={pontos} terreno={terreno} />
      </div>
    </div>
  );
}
