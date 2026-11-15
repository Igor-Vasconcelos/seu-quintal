import { formatarMedida } from "./geometria.js";

export default function Planta({ terreno, itens = [], mostrarFrente = false, aoPosicionar }) {
  // Usa o mesmo fator nos dois eixos para manter a proporção em qualquer tela.
  const maiorLado = Math.max(terreno.largura, terreno.comprimento);
  const estilo = {
    width: `${terreno.largura / maiorLado * 100}%`,
    height: `${terreno.comprimento / maiorLado * 100}%`,
    "--passo-x": `${maiorLado / terreno.largura * 12.5}%`,
    "--passo-y": `${maiorLado / terreno.comprimento * 12.5}%`,
  };

  return (
    <div className="planta-moldura">
      <div className={`planta${mostrarFrente ? " planta-com-frente" : ""}${aoPosicionar ? " planta-posicionavel" : ""}`}
        style={estilo} role="img" onClick={aoPosicionar && ((evento) => {
          const { left, top, width, height } = evento.currentTarget.getBoundingClientRect();
          aoPosicionar((evento.clientX - left) / width * terreno.largura, (evento.clientY - top) / height * terreno.comprimento);
        })}
        aria-label={`Planta em escala de ${formatarMedida(terreno.largura)} por ${formatarMedida(terreno.comprimento)} metros${mostrarFrente ? ", com a frente na borda inferior" : ""}`}>
        {itens.map((item) => (
          <span key={item.id} className={`canteiro${item.sobreposto ? " sobreposto" : ""}${item.rascunho ? " canteiro-rascunho" : ""}`}
            style={{
              left: `${item.x / terreno.largura * 100}%`,
              top: `${item.y / terreno.comprimento * 100}%`,
              width: `${item.largura / terreno.largura * 100}%`,
              height: `${item.comprimento / terreno.comprimento * 100}%`,
            }} />
        ))}
      </div>
    </div>
  );
}
