import { useEffect, useState } from "react";
import Icone from "../../components/Icone.jsx";
import { lerProjetosSalvos } from "../planejador/bancoProjetos.js";
import { lerProjetos } from "../planejador/projetos.js";
import { resumirProjetosQuintal } from "./resumoQuintal.js";
import { formatarMedida } from "../planejador/geometria.js";

function tituloDoTerreno(terreno) {
  return `${formatarMedida(terreno.largura)} × ${formatarMedida(terreno.comprimento)} m`;
}

export default function VisaoGeralQuintal() {
  const [dados, definirDados] = useState(null);

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      let projetos;
      try {
        projetos = await lerProjetosSalvos();
      } catch {
        projetos = lerProjetos();
      }
      if (ativo) definirDados(projetos);
    }
    function receberStorage(evento) {
      if (evento.key?.startsWith("seu-quintal:") || evento.key === null) carregar();
    }
    const canal = typeof BroadcastChannel === "function"
      ? new BroadcastChannel("seu-quintal:projetos-terreno:v1") : null;
    if (canal) canal.onmessage = carregar;
    window.addEventListener("storage", receberStorage);
    carregar();
    return () => {
      ativo = false;
      canal?.close();
      window.removeEventListener("storage", receberStorage);
    };
  }, []);

  if (!dados) return <section className="quintal-visao-geral" aria-label="Visão geral">
    <h2>Visão geral</h2>
    <p role="status">Carregando seus projetos deste navegador…</p>
  </section>;

  const { terrenos, totalCenarios, atual, itensNoCenarioAtivo } = resumirProjetosQuintal(dados);

  return <section className="quintal-visao-geral" aria-labelledby="quintal-visao-titulo">
    <div className="quintal-visao-cabecalho">
      <div>
        <span className="quintal-etiqueta">SEUS PROJETOS</span>
        <h2 id="quintal-visao-titulo">Visão geral</h2>
        <p>Acompanhe os terrenos salvos e continue de onde parou.</p>
      </div>
      <a className="botao" href="#terreno"><Icone nome="planta"/> Abrir planejador</a>
    </div>

    {terrenos.length ? <>
      <div className="quintal-indicadores" aria-label="Resumo dos projetos salvos">
        <div><small>Terrenos salvos</small><strong>{terrenos.length}</strong></div>
        <div><small>Cenários registrados</small><strong>{totalCenarios}</strong></div>
        <div><small>Itens no cenário atual</small><strong>{itensNoCenarioAtivo}</strong></div>
      </div>

      <section className="quintal-ultimo-projeto" aria-labelledby="quintal-projeto-atual">
        <div className="quintal-ultimo-texto">
          <span className="quintal-etiqueta">CONTINUE SEU PLANEJAMENTO</span>
          <h3 id="quintal-projeto-atual">{tituloDoTerreno(atual.medidas)}</h3>
          <p>{formatarMedida(atual.medidas.area)} m² · {atual.projeto.cenarios.length} cenário(s)</p>
          <p className="quintal-ultimo-nota">Projetos e desenhos guardados neste navegador.</p>
          <a className="botao" href={`?frente=${atual.medidas.largura}&profundidade=${atual.medidas.comprimento}#terreno`}>
            Continuar neste terreno <Icone nome="seta"/>
          </a>
        </div>
        <div className="quintal-ultimo-icone" aria-hidden="true"><Icone nome="planta"/></div>
      </section>

      <div className="quintal-projetos-cabecalho">
        <h3>Meus terrenos</h3>
        <span>{terrenos.length} projeto(s)</span>
      </div>
      <div className="quintal-projetos-lista">
        {terrenos.map(({ id, medidas, projeto }) => (
          <a className="quintal-projeto-item" key={id}
            href={`?frente=${medidas.largura}&profundidade=${medidas.comprimento}#terreno`}>
            <span className="quintal-projeto-icone"><Icone nome="planta"/></span>
            <span className="quintal-projeto-descricao">
              <strong>{tituloDoTerreno(medidas)}</strong>
              <small>{formatarMedida(medidas.area)} m² · {projeto.cenarios.length} cenário(s)</small>
            </span>
            <Icone nome="seta"/>
          </a>
        ))}
      </div>
    </> : <div className="quintal-primeiro-passo">
      <Icone nome="muda"/>
      <h3>Seu planejamento começa por aqui</h3>
      <p>Informe as medidas do seu terreno para montar a planta e começar a organizar suas áreas.</p>
      <a className="botao" href="#terreno">Criar meu primeiro terreno <Icone nome="seta"/></a>
    </div>}
  </section>;
}
