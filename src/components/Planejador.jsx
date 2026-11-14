import { useState } from "react";
import { criarTerreno, formatarMedida } from "../features/planejador/geometria.js";
import Planta from "../features/planejador/Planta.jsx";
import Icone from "./Icone.jsx";

export default function Planejador({ abrirEditor }) {
  const [frente, definirFrente] = useState("35");
  const [profundidade, definirProfundidade] = useState("65");
  const [mostrarErro, definirMostrarErro] = useState(false);
  const terreno = criarTerreno(frente, profundidade);
  const erro = mostrarErro && !terreno;

  function continuar(evento) {
    evento.preventDefault();
    if (terreno) abrirEditor(terreno);
    else definirMostrarErro(true);
  }

  return (
    <section className="ferramenta ferramenta-planta" id="planejador" aria-labelledby="titulo-planejador">
      <h2 id="titulo-planejador"><Icone nome="planta" />Planejador de Terreno</h2>
      <form onSubmit={continuar}>
        <div className="planejador-grade">
          <div className="medidas">
            <label className="campo">
              Frente (m)
              <input value={frente} onChange={(evento) => definirFrente(evento.target.value)} inputMode="decimal" required
                aria-describedby={erro ? "erro-medidas" : undefined} />
            </label>
            <label className="campo">
              Profundidade (m)
              <input value={profundidade} onChange={(evento) => definirProfundidade(evento.target.value)} inputMode="decimal" required
                aria-describedby={erro ? "erro-medidas" : undefined} />
            </label>
          </div>

          <div className="previsao" aria-live="polite">
            {terreno ? <>
              <Planta terreno={terreno} mostrarFrente />
              <strong className="area">{formatarMedida(terreno.area)} m²</strong>
            </> : <span className="nota">Preencha as medidas para ver a planta.</span>}
          </div>
        </div>
        {erro && <p id="erro-medidas" className="erro" role="alert">Informe medidas de 0,01 a 10.000 m, com até dois decimais.</p>}
        <button className="botao" type="submit">Continuar no planejador</button>
      </form>
      <p className="nota">A linha verde marca a frente do terreno.</p>
    </section>
  );
}
