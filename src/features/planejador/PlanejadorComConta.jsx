import { useEffect, useRef, useState } from "react";
import EditorTerreno from "./EditorTerreno.jsx";
import EditorComProjetos from "./EditorComProjetos.jsx";
import { solicitarApi } from "./api.js";

export default function PlanejadorComConta({ chaveEdicao, limparProjeto, ...editor }) {
  const [conta, definirConta] = useState(undefined);
  const [cadastro, definirCadastro] = useState(false);
  const [ocupado, definirOcupado] = useState(false);
  const [erro, definirErro] = useState("");
  const donoProjeto = useRef(editor.registro?.contaId);

  useEffect(() => {
    const controle = new AbortController();
    solicitarApi("/auth/sessao", { signal: controle.signal }).then(
      (sessao) => {
        if (controle.signal.aborted) return;
        if (donoProjeto.current && donoProjeto.current !== sessao.conta?.id) limparProjeto();
        definirConta(sessao.conta);
      },
      (falha) => {
        if (!controle.signal.aborted) {
          if (donoProjeto.current) limparProjeto();
          definirConta(null);
          definirErro(falha.message);
        }
      },
    );
    return () => controle.abort();
  }, [limparProjeto]);

  function encerrarSessaoLocal() {
    definirConta(null);
    limparProjeto();
  }

  async function enviarConta(evento) {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    const dados = Object.fromEntries(new FormData(formulario));
    definirOcupado(true);
    definirErro("");
    try {
      const sessao = await solicitarApi(cadastro ? "/auth/cadastro" : "/auth/entrar", { metodo: "POST", dados });
      formulario.reset();
      definirConta(sessao.conta);
      definirCadastro(false);
    } catch (falha) {
      definirErro(falha.message);
    } finally {
      definirOcupado(false);
    }
  }

  async function sair() {
    definirOcupado(true);
    definirErro("");
    try {
      await solicitarApi("/auth/sair", { metodo: "POST", contaId: conta.id });
      encerrarSessaoLocal();
    } catch (falha) {
      if (falha.status === 401) encerrarSessaoLocal();
      definirErro(falha.message);
    } finally {
      definirOcupado(false);
    }
  }

  return (
    <>
      {conta
        ? <EditorComProjetos key={chaveEdicao} {...editor} contaId={conta.id}
            sessaoExpirada={() => {
              encerrarSessaoLocal();
              definirErro("Sua sessão terminou. Entre novamente para acessar seus projetos.");
            }} />
        : conta === null && <EditorTerreno key={chaveEdicao} {...editor} />}

      <section className="projetos-salvos" aria-label="Conta do Meu Quintal">
        {conta === undefined && <p role="status">Consultando sua sessão…</p>}
        {conta && <>
          <p>Conta <strong>{conta.usuario}</strong></p>
          <button type="button" className="botao botao-contorno" disabled={ocupado} onClick={sair}>Sair da conta</button>
        </>}
        {conta === null && <>
          <h3>{cadastro ? "Criar conta" : "Entre para salvar seus projetos"}</h3>
          <form className="form-conta-quintal" key={String(cadastro)} onSubmit={enviarConta}>
            <fieldset className="editor-projeto-campos" disabled={ocupado}>
              <label className="campo">Usuário
                <input name="usuario" autoComplete="username" autoCapitalize="none" spellCheck={false}
                  minLength={3} maxLength={32} required />
              </label>
              <label className="campo">Senha
                <input name="senha" type="password" autoComplete={cadastro ? "new-password" : "current-password"}
                  minLength={15} maxLength={128} required />
              </label>
              {cadastro && <p className="nota">Use letras, números, ponto, hífen ou sublinhado no usuário e pelo menos 15 caracteres na senha.</p>}
              <button type="submit" className="botao">{cadastro ? "Criar conta" : "Entrar"}</button>
            </fieldset>
          </form>
          <button type="button" className="botao botao-contorno" disabled={ocupado}
            onClick={() => { definirCadastro(!cadastro); definirErro(""); }}>
            {cadastro ? "Já tenho conta" : "Criar uma conta"}
          </button>
        </>}
        {erro && <p role="alert" className="erro">{erro}</p>}
      </section>
    </>
  );
}
