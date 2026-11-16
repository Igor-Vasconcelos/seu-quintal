import { useState } from "react";
import { criarTerreno, formatarMedida } from "../features/planejador/geometria.js";
import Planta from "../features/planejador/Planta.jsx";
import Icone from "./Icone.jsx";

export default function Planejador({ aoCriar, noPainel = false }) {
  const [frente, definirFrente] = useState("");
  const [profundidade, definirProfundidade] = useState("");
  const [mostrarErro, definirMostrarErro] = useState(false);
  const terreno = criarTerreno(frente, profundidade);
  const erro = mostrarErro && !terreno;

  function continuar(evento) {
    if (!terreno) {
      evento.preventDefault();
      definirMostrarErro(true);
      return;
    }
    if (aoCriar) {
      evento.preventDefault();
      aoCriar(terreno);
    }
  }

  return (
    <section className="ferramenta" id="planejador" aria-labelledby="titulo-planejador">
      {noPainel ? <h3 id="titulo-planejador">Crie seu terreno</h3>
        : <h2 id="titulo-planejador"><Icone nome="planta" />Planejador de Terreno</h2>}
      <form action={noPainel ? undefined : "./meu-quintal/"} target={noPainel ? undefined : "_blank"} rel="noopener" onSubmit={continuar}>
        <div className="planejador-grade">
          <div className="medidas">
            <label className="campo">
              Frente (m)
              <input name="frente" value={frente} onChange={(evento) => definirFrente(evento.target.value)} inputMode="decimal" required
                aria-describedby={erro ? "erro-medidas" : undefined} />
            </label>
            <label className="campo">
              Profundidade (m)
              <input name="profundidade" value={profundidade} onChange={(evento) => definirProfundidade(evento.target.value)} inputMode="decimal" required
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
        <button className="botao" type="submit">{noPainel ? "Criar terreno" : "Continuar no planejador"}</button>
      </form>
      <p className="nota">A linha verde marca a frente do terreno.</p>
    </section>
  );
}
