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
    <section className="ferramenta" id="planejador" aria-labelledby="titulo-planejador" tabIndex={-1}>
      <h3 className="ferramenta-titulo" id="titulo-planejador">
        <Icone nome="planta" />{noPainel ? "Crie seu terreno" : "Planejador de terreno"}
      </h3>
      <p className="ferramenta-intro">Use as medidas da frente e do fundo para ver a área.</p>
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
            </> : <>
              <Icone nome="planta" />
              <span className="nota">A planta aparece aqui</span>
            </>}
          </div>
        </div>
        {erro && <p id="erro-medidas" className="erro" role="alert">Informe medidas de 0,01 a 10.000 m, com até dois decimais.</p>}
        <button className="botao" type="submit">{noPainel ? "Criar terreno" : <>Continuar no planejador <Icone nome="novaAba" />
          <span className="visualmente-oculto"> (abre em nova aba)</span></>}</button>
      </form>
      {terreno && <p className="nota">A linha verde marca a frente do terreno.</p>}
    </section>
  );
}
