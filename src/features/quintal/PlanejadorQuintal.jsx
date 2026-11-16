import { useEffect, useRef, useState } from "react";
import Planejador from "../../components/Planejador.jsx";
import { comBloqueioLocal } from "../armazenamentoLocal.js";
import EditorTerreno from "../planejador/EditorTerreno.jsx";
import { gravarProjetosSalvos, lerProjetosSalvos } from "../planejador/bancoProjetos.js";
import { criarTerreno, formatarMedida } from "../planejador/geometria.js";
import { mesclarProjeto } from "../planejador/mesclarProjeto.js";
import { chaveDoTerreno, chaveProjetos, lerProjetos, projetoInicial } from "../planejador/projetos.js";

function terrenoDaUrl() {
  const parametros = new URLSearchParams(window.location.search);
  return criarTerreno(parametros.get("frente") ?? "", parametros.get("profundidade") ?? "");
}

function aplicarEdicao(dados, { terreno, antes, depois, desfazendo }) {
  const chave = chaveDoTerreno(terreno);
  const atual = dados.terrenos[chave] ?? projetoInicial;
  const projeto = antes ? mesclarProjeto(atual, antes, depois, terreno, desfazendo) : atual;
  return { ultimoTerreno: terreno, terrenos: { ...dados.terrenos, [chave]: projeto } };
}

export default function PlanejadorQuintal() {
  const [projetos, definirProjetos] = useState(lerProjetos);
  const [terreno, definirTerreno] = useState(() => terrenoDaUrl() ?? projetos.ultimoTerreno);
  const [falhou, definirFalhou] = useState(false);
  const pendentes = useRef([]);
  const escolheuTerreno = useRef(false);
  const canal = useRef(null);
  const chave = terreno ? chaveDoTerreno(terreno) : "";
  const projeto = projetos.terrenos[chave];

  async function guardar(edicao) {
    try {
      return await comBloqueioLocal(chaveProjetos, async () => {
        const chaveEditada = chaveDoTerreno(edicao.terreno);
        const { antes, dados, salvo } = await gravarProjetosSalvos((persistidos) => {
          const atuais = pendentes.current.reduce(aplicarEdicao, persistidos);
          return { antes: atuais.terrenos[chaveEditada] ?? projetoInicial, dados: aplicarEdicao(atuais, edicao) };
        });

        if (salvo) pendentes.current = [];
        else pendentes.current.push(edicao);
        definirProjetos(dados);
        definirFalhou(!salvo);
        if (salvo) canal.current?.postMessage("atualizado");
        return { antes, depois: dados.terrenos[chaveEditada] };
      });
    } catch {
      definirFalhou(true);
      return null;
    }
  }

  function abrir(novo) {
    escolheuTerreno.current = true;
    definirTerreno(novo);
    guardar({ terreno: novo });
    const url = new URL(window.location.href);
    url.searchParams.delete("frente");
    url.searchParams.delete("profundidade");
    window.history.replaceState(null, "", url);
  }

  useEffect(() => {
    let montado = true;
    async function carregar() {
      const dados = await lerProjetosSalvos();
      if (!montado) return;
      definirProjetos(pendentes.current.reduce(aplicarEdicao, dados));
      if (!escolheuTerreno.current) {
        escolheuTerreno.current = true;
        definirTerreno(dados.ultimoTerreno);
      }
    }
    function sincronizar(evento) {
      if (evento.key === chaveProjetos || evento.key === null) carregar();
    }
    const comunicacao = typeof BroadcastChannel === "function" ? new BroadcastChannel(chaveProjetos) : null;
    canal.current = comunicacao;
    if (comunicacao) comunicacao.onmessage = carregar;
    window.addEventListener("storage", sincronizar);
    const recebido = terrenoDaUrl();
    if (recebido) abrir(recebido);
    else carregar();
    return () => {
      montado = false;
      canal.current = null;
      comunicacao?.close();
      window.removeEventListener("storage", sincronizar);
    };
  }, []);

  const alternativas = Object.keys(projetos.terrenos).map((id) => [id, criarTerreno(...id.split("x"))])
    .filter(([, medida]) => medida);

  return (
    <section className="quintal-terreno" aria-labelledby="titulo-painel-terreno">
      <div className="quintal-secao-topo">
        <h2 id="titulo-painel-terreno">Planejador de terreno</h2>
        {terreno && <button className="botao botao-contorno" type="button" onClick={() => {
          escolheuTerreno.current = true;
          definirTerreno(null);
        }}>Novo terreno</button>}
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
        projeto={projeto ?? projetoInicial}
        definirProjeto={(antes, depois, desfazendo) => guardar({ terreno, antes, depois, desfazendo })}
        salvamento={falhou ? "O salvamento está indisponível." : "Salvamento automático neste navegador"} />
        : <Planejador noPainel aoCriar={abrir} />}
    </section>
  );
}
