import { formatarMedida } from "./geometria.js";

export default function Planta({ terreno, itens = [], mostrarFrente = false }) {
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
      <div className={mostrarFrente ? "planta planta-com-frente" : "planta"} style={estilo} role="img"
        aria-label={`Planta em escala de ${formatarMedida(terreno.largura)} por ${formatarMedida(terreno.comprimento)} metros${mostrarFrente ? ", com a frente na borda inferior" : ""}`}>
        {itens.map((item) => (
          <span key={item.id} className={item.sobreposto ? "canteiro sobreposto" : "canteiro"}
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
