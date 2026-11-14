import { useEffect, useRef, useState } from "react";
import EditorTerreno from "./EditorTerreno.jsx";
import { solicitarProjetos } from "./api.js";
import { formatarMedida } from "./geometria.js";

export default function EditorComProjetos({ terreno, itens, definirItens, registro, gravarRegistro, abrirProjeto }) {
  const [nome, definirNome] = useState(registro?.nome ?? "");
  const [projetos, definirProjetos] = useState(null);
  const [escolhido, definirEscolhido] = useState("");
  const [operacao, definirOperacao] = useState("");
  const [mensagem, definirMensagem] = useState("");
  const [erro, definirErro] = useState("");
  const requisicao = useRef(null);
  const idNovo = useRef(null);
  const alterado = registro ? registro.itens !== itens || registro.nome !== nome.trim() : itens.length > 0 || Boolean(nome.trim());

  useEffect(() => () => requisicao.current?.abort(), []);

  async function executar(acao, tarefa) {
    if (requisicao.current) return;
    const controle = new AbortController();
    requisicao.current = controle;
    definirOperacao(acao);
    definirErro("");
    definirMensagem("");

    try {
      await tarefa(controle.signal);
    } catch (falha) {
      if (!controle.signal.aborted) definirErro(falha.message);
    } finally {
      requisicao.current = null;
      if (!controle.signal.aborted) definirOperacao("");
    }
  }

  function salvar(evento) {
    evento.preventDefault();
    executar("salvar", async (signal) => {
      const id = registro?.id ?? (idNovo.current ??= crypto.randomUUID());
      const salvo = await solicitarProjetos({
        id: registro?.id,
        metodo: registro?.id ? "PUT" : "POST",
        dados: { id, nome: nome.trim(), largura: terreno.largura, profundidade: terreno.comprimento, itens },
        signal,
      });
      if (signal.aborted) return;
      gravarRegistro({ id: salvo.id, nome: salvo.nome, itens });
      definirNome(salvo.nome);
      definirProjetos((lista) => lista && [salvo, ...lista.filter((projeto) => projeto.id !== salvo.id)]);
      definirMensagem("Projeto salvo.");
    });
  }

  function listar() {
    executar("listar", async (signal) => {
      const lista = await solicitarProjetos({ signal });
      if (signal.aborted) return;
      definirProjetos(lista);
      definirEscolhido(lista[0]?.id ?? "");
      definirMensagem(lista.length ? "" : "Você ainda não tem projetos salvos.");
    });
  }

  function abrir(evento) {
    evento.preventDefault();
    if (alterado && !window.confirm("Abrir outro projeto e descartar as alterações atuais?")) return;
    executar("abrir", async (signal) => {
      const salvo = await solicitarProjetos({ id: escolhido, signal });
      if (!signal.aborted) abrirProjeto(salvo);
    });
  }

  return (
    <>
      <fieldset className="editor-projeto-campos" disabled={Boolean(operacao)}>
        <EditorTerreno terreno={terreno} itens={itens} definirItens={definirItens} />
        <section className="projetos-salvos" aria-label="Projetos do Meu Quintal">
          <form onSubmit={salvar} className="projetos-salvos-linha">
            <label className="campo">
              Nome do projeto
              <input value={nome} onChange={(evento) => definirNome(evento.target.value)} maxLength={80} required />
            </label>
            <button type="submit" className="botao" disabled={!nome.trim() || !alterado}>
              {operacao === "salvar" ? "Salvando…" : "Salvar projeto"}
            </button>
          </form>
          <button type="button" className="botao botao-contorno" onClick={listar}>
            {operacao === "listar" ? "Buscando…" : "Ver projetos salvos"}
          </button>
          {projetos?.length > 0 && (
            <form onSubmit={abrir} className="projetos-salvos-linha">
              <label className="campo">
                Projetos salvos
                <select value={escolhido} onChange={(evento) => definirEscolhido(evento.target.value)}>
                  {projetos.map((projeto) => (
                    <option key={projeto.id} value={projeto.id}>
                      {projeto.nome} · {formatarMedida(projeto.largura)} × {formatarMedida(projeto.profundidade)} m
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit" className="botao botao-contorno">
                {operacao === "abrir" ? "Abrindo…" : "Abrir projeto"}
              </button>
            </form>
          )}
        </section>
      </fieldset>
      <p role="status" className="nota">{registro && alterado ? "Há alterações por salvar." : mensagem}</p>
      {erro && <p role="alert" className="erro">{erro}</p>}
    </>
  );
}
