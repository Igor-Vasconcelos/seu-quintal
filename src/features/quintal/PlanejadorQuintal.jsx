import { useEffect, useState } from "react";
import Planejador from "../../components/Planejador.jsx";
import EditorTerreno from "../planejador/EditorTerreno.jsx";
import { criarTerreno, formatarMedida } from "../planejador/geometria.js";
import { chaveDoTerreno, lerProjetos, projetoInicial, salvarProjetos } from "../planejador/projetos.js";

function terrenoDaUrl() {
  const parametros = new URLSearchParams(window.location.search);
  return criarTerreno(parametros.get("frente") ?? "", parametros.get("profundidade") ?? "");
}

export default function PlanejadorQuintal() {
  const [projetos, definirProjetos] = useState(lerProjetos);
  const [terreno, definirTerreno] = useState(() => terrenoDaUrl() ?? projetos.ultimoTerreno);
  const [falhou, definirFalhou] = useState(false);
  const chave = terreno ? chaveDoTerreno(terreno) : "";
  const projeto = projetos.terrenos[chave];

  function guardar(novoTerreno, novoProjeto) {
    const chaveNova = chaveDoTerreno(novoTerreno);
    const recentes = lerProjetos().terrenos;
    const terrenos = falhou
      ? { ...recentes, ...projetos.terrenos }
      : { ...projetos.terrenos, ...recentes };
    const dados = {
      ultimoTerreno: novoTerreno,
      terrenos: { ...terrenos, [chaveNova]: novoProjeto ?? terrenos[chaveNova] ?? projetoInicial },
    };
    definirProjetos(dados);
    definirFalhou(!salvarProjetos(dados));
  }

  function abrir(novo) {
    definirTerreno(novo);
    guardar(novo);
    const url = new URL(window.location.href);
    url.searchParams.delete("frente");
    url.searchParams.delete("profundidade");
    window.history.replaceState(null, "", url);
  }

  useEffect(() => {
    const recebido = terrenoDaUrl();
    if (recebido) abrir(recebido);
  }, []);

  const alternativas = Object.keys(projetos.terrenos).map((id) => [id, criarTerreno(...id.split("x"))])
    .filter(([, medida]) => medida);

  return (
    <section className="quintal-terreno" aria-labelledby="titulo-painel-terreno">
      <div className="quintal-secao-topo">
        <h2 id="titulo-painel-terreno">Planejador de terreno</h2>
        {terreno && <button className="botao botao-contorno" type="button" onClick={() => definirTerreno(null)}>Novo terreno</button>}
      </div>
      {alternativas.length > 0 && <label className="campo quintal-terrenos">
        Terrenos salvos
        <select aria-label="Terrenos salvos" value={chave} onChange={(evento) => {
          const escolhido = alternativas.find(([id]) => id === evento.target.value);
          if (escolhido) abrir(escolhido[1]);
        }}>
          <option value="" disabled>Escolha um terreno</option>
          {alternativas.map(([id, medida]) => (
            <option key={id} value={id}>{formatarMedida(medida.largura)} × {formatarMedida(medida.comprimento)} m</option>
          ))}
        </select>
      </label>}
      {terreno ? <EditorTerreno key={chave} terreno={terreno} abrirTerreno={abrir}
        projeto={projeto ?? projetoInicial} definirProjeto={(novo) => guardar(terreno, novo)}
        salvamento={falhou ? "O salvamento está indisponível." : "Salvamento automático neste navegador"} />
        : <Planejador noPainel aoCriar={abrir} />}
    </section>
  );
}
