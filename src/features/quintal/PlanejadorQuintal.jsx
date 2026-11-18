import { useEffect, useRef, useState } from "react";
import Planejador from "../../components/Planejador.jsx";
import { comBloqueioLocal } from "../armazenamentoLocal.js";
import EditorTerreno from "../planejador/EditorTerreno.jsx";
import { gravarProjetosSalvos, lerProjetosSalvos } from "../planejador/bancoProjetos.js";
import { criarTerreno, formatarMedida } from "../planejador/geometria.js";
import { mesclarProjeto } from "../planejador/mesclarProjeto.js";
import {
  chaveProjetos, criarRegistroTerreno, lerProjetos, migrarProjetos, nomeDoTerreno, projetoInicial,
} from "../planejador/projetos.js";

function terrenoDaUrl() {
  const parametros = new URLSearchParams(window.location.search);
  return criarTerreno(parametros.get("frente") ?? "", parametros.get("profundidade") ?? "");
}

function aplicarEdicao(originais, edicao) {
  const dados = migrarProjetos(originais);
  if (edicao.tipo === "criar") {
    const { registro } = edicao;
    if (dados.terrenos[registro.id]) return { ...dados, terrenoAtivo: registro.id };
    return {
      ...dados, terrenoAtivo: registro.id,
      terrenos: { ...dados.terrenos, [registro.id]: registro },
    };
  }
  const atual = dados.terrenos[edicao.id];
  if (!atual) return dados;
  if (edicao.tipo === "selecionar") return { ...dados, terrenoAtivo: edicao.id };
  if (edicao.tipo === "renomear") {
    return {
      ...dados,
      terrenos: { ...dados.terrenos, [edicao.id]: { ...atual, nome: nomeDoTerreno(edicao.nome, atual.medidas) } },
    };
  }
  if (edicao.tipo === "projeto") {
    const projeto = mesclarProjeto(atual.projeto, edicao.antes, edicao.depois, atual.medidas, edicao.desfazendo);
    return {
      ...dados, terrenoAtivo: edicao.id,
      terrenos: { ...dados.terrenos, [edicao.id]: { ...atual, projeto } },
    };
  }
  return dados;
}

export default function PlanejadorQuintal() {
  const [projetos, definirProjetos] = useState(lerProjetos);
  const [idSelecionado, definirIdSelecionado] = useState(() => lerProjetos().terrenoAtivo);
  const [falhou, definirFalhou] = useState(false);
  const pendentes = useRef([]);
  const escolheuTerreno = useRef(false);
  const canal = useRef(null);
  const registro = projetos.terrenos[idSelecionado];
  const alternativas = Object.values(projetos.terrenos);

  async function guardar(edicao) {
    try {
      return await comBloqueioLocal(chaveProjetos, async () => {
        const { antes, dados, salvo } = await gravarProjetosSalvos((persistidos) => {
          const atuais = pendentes.current.reduce(aplicarEdicao, persistidos);
          return {
            antes: edicao.tipo === "projeto" ? atuais.terrenos[edicao.id]?.projeto ?? projetoInicial : null,
            dados: aplicarEdicao(atuais, edicao),
          };
        });

        if (salvo) pendentes.current = [];
        else pendentes.current.push(edicao);
        definirProjetos(dados);
        definirFalhou(!salvo);
        if (salvo) canal.current?.postMessage("atualizado");
        return edicao.tipo === "projeto" ? { antes, depois: dados.terrenos[edicao.id]?.projeto } : null;
      });
    } catch {
      definirFalhou(true);
      return null;
    }
  }

  function limparParametros() {
    const url = new URL(window.location.href);
    url.searchParams.delete("frente");
    url.searchParams.delete("profundidade");
    window.history.replaceState(null, "", url);
  }

  function criarNovo(medidas, nome = "") {
    const novo = criarRegistroTerreno(medidas, nome);
    const edicao = { tipo: "criar", registro: novo };
    escolheuTerreno.current = true;
    definirIdSelecionado(novo.id);
    definirProjetos((dados) => aplicarEdicao(dados, edicao));
    guardar(edicao);
    limparParametros();
  }

  function selecionar(id) {
    if (!projetos.terrenos[id]) return;
    const edicao = { tipo: "selecionar", id };
    escolheuTerreno.current = true;
    definirIdSelecionado(id);
    definirProjetos((dados) => aplicarEdicao(dados, edicao));
    guardar(edicao);
    limparParametros();
  }

  function renomear(evento) {
    evento.preventDefault();
    if (!registro) return;
    const nome = evento.currentTarget.elements.namedItem("nome").value;
    const edicao = { tipo: "renomear", id: registro.id, nome };
    definirProjetos((dados) => aplicarEdicao(dados, edicao));
    guardar(edicao);
  }

  useEffect(() => {
    let montado = true;
    async function carregar() {
      const dados = await lerProjetosSalvos();
      if (!montado) return;
      definirProjetos(pendentes.current.reduce(aplicarEdicao, dados));
      if (!escolheuTerreno.current) {
        escolheuTerreno.current = true;
        definirIdSelecionado(dados.terrenoAtivo);
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
    if (recebido) criarNovo(recebido);
    else carregar();
    return () => {
      montado = false;
      canal.current = null;
      comunicacao?.close();
      window.removeEventListener("storage", sincronizar);
    };
  }, []);

  return (
    <section className="quintal-terreno" aria-labelledby="titulo-painel-terreno">
      <div className="quintal-secao-topo">
        <h2 id="titulo-painel-terreno">Planejador de terreno</h2>
        {registro && <button className="botao botao-contorno" type="button" onClick={() => {
          escolheuTerreno.current = true;
          definirIdSelecionado(null);
        }}>Novo terreno</button>}
      </div>
      {alternativas.length > 0 && <label className="campo quintal-terrenos">
        Terrenos salvos
        <select aria-label="Terrenos salvos" value={registro ? registro.id : ""} onChange={(evento) => selecionar(evento.target.value)}>
          <option value="" disabled>Selecione um terreno</option>
          {alternativas.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nome} · {formatarMedida(item.medidas.largura)} × {formatarMedida(item.medidas.comprimento)} m
            </option>
          ))}
        </select>
      </label>}
      {falhou && <p className="erro" role="alert">Não foi possível salvar. Faça um backup antes de fechar o navegador.</p>}
      {registro ? <>
        <form key={registro.id} className="quintal-nome-terreno" onSubmit={renomear}>
          <label className="campo">Nome do terreno
            <input name="nome" maxLength="80" defaultValue={registro.nome} aria-label="Nome do terreno" />
          </label>
          <button className="botao botao-contorno" type="submit">Salvar nome</button>
        </form>
        <EditorTerreno key={registro.id} terreno={registro.medidas} abrirTerreno={criarNovo}
          projeto={registro.projeto}
          definirProjeto={(antes, depois, desfazendo) =>
            guardar({ tipo: "projeto", id: registro.id, antes, depois, desfazendo })}
          salvamento={falhou ? "O salvamento está indisponível." : "Salvamento automático neste navegador"} />
      </> : <Planejador noPainel aoCriar={criarNovo} />}
    </section>
  );
}
