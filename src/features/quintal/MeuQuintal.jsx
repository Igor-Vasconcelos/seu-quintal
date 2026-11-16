import { lazy, Suspense, useEffect, useState } from "react";
import Cabecalho from "../../components/Cabecalho.jsx";
import Icone from "../../components/Icone.jsx";
import Rodape from "../../components/Rodape.jsx";
import { armazenamentoDaConta, carregarConta, enderecoDaConta, entrarNaConta, sitePublico } from "./conta.js";
import { gravarCopiaDaConta, lerCopia, lerDado, montarCopia, usarDadosDaConta } from "./dados.js";
import PlanejadorQuintal from "./PlanejadorQuintal.jsx";

const HistoricoCultivo = lazy(() => import("../cultivo/HistoricoCultivo.jsx"));
const OrganizadorHorta = lazy(() => import("../organizador/OrganizadorHorta.jsx"));

const secoes = { terreno: "Planejador de terreno", historico: "Histórico de cultivo", horta: "Organizador de horta" };
const mensagensDeSincronizacao = {
  salvo: "Dados disponíveis na sua conta",
  salvando: "Salvando na sua conta…",
  erro: "Não foi possível salvar. Tente novamente ou baixe uma cópia.",
  conflito: "Outra aba salvou uma versão mais recente. Baixe uma cópia das mudanças antes de recarregar.",
  sessao: "Sua sessão terminou. Baixe uma cópia das mudanças e entre novamente.",
  tamanho: "Os dados atingiram o limite de tamanho da conta. Baixe uma cópia.",
};

function secaoAtual() {
  const nome = window.location.hash.slice(1);
  return Object.hasOwn(secoes, nome) ? nome : "terreno";
}

function salvarArquivo(copia) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(copia, null, 2)], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "meu-quintal-dados.json";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function CopiaDosDados({ naConta, atualizarPainel }) {
  const [mensagem, definirMensagem] = useState("");

  function baixar() {
    try {
      const copia = montarCopia();
      if (!Object.keys(copia.dados).length) {
        definirMensagem("Crie um terreno ou registre um cultivo para gerar uma cópia.");
        return;
      }
      salvarArquivo(copia);
      definirMensagem("Cópia pronta para baixar.");
    } catch {
      definirMensagem("Não foi possível ler os dados para baixar a cópia.");
    }
  }

  async function importar(evento) {
    evento.preventDefault();
    const form = evento.currentTarget;
    const arquivo = new FormData(form).get("arquivo");
    if (!arquivo?.size || arquivo.size > 1_600_000) {
      definirMensagem("Selecione uma cópia do Seu Quintal de até 1,6 MB.");
      return;
    }
    try {
      const dados = lerCopia(await arquivo.text());
      const paraImportar = Object.fromEntries(Object.entries(dados).filter(([chave]) => lerDado(chave) === null));
      const total = Object.keys(paraImportar).length;
      if (!total) {
        definirMensagem("A cópia não tem dados para preencher uma seção vazia da conta.");
        return;
      }
      gravarCopiaDaConta(paraImportar);
      atualizarPainel();
      form.reset();
      definirMensagem(total < Object.keys(dados).length
        ? "Dados adicionados às seções vazias. Os dados já salvos na conta foram preservados."
        : "Dados adicionados ao painel da conta.");
    } catch {
      definirMensagem("Não foi possível abrir esta cópia do Seu Quintal.");
    }
  }

  return (
    <details className="quintal-copia">
      <summary>Cópia dos meus dados</summary>
      <div className="quintal-copia-conteudo">
        <button className="botao botao-contorno" type="button" onClick={baixar}>Baixar meus dados</button>
        {naConta ? <form onSubmit={importar}>
          <label className="campo">Cópia para importar
            <input type="file" accept=".json,application/json" name="arquivo" required />
          </label>
          <p className="nota">A cópia preenche as seções que ainda estão vazias na conta.</p>
          <button className="botao botao-contorno" type="submit">Importar para a conta</button>
        </form> : <p className="nota">Guarde o arquivo para levar seus terrenos, cultivo e plano de horta para a conta.</p>}
        <p role="status" className="nota">{mensagem}</p>
      </div>
    </details>
  );
}

function AreaDaConta({ conta, armazenamento, atualizarPainel }) {
  const [estado, definirEstado] = useState("salvo");
  useEffect(() => armazenamento?.assinar(definirEstado), [armazenamento]);

  return (
    <section className="quintal-conta" aria-label="Conta e dados">
      <div className="quintal-secao-topo">
        <div>
          <h2>{conta ? "Sua conta" : "Entre para guardar seu quintal"}</h2>
          {conta ? <>
            <p className="quintal-email">{conta.email}</p>
            <p className="nota" role="status">{mensagensDeSincronizacao[estado]}</p>
          </> : <p>Use sua conta do ChatGPT para abrir seus dados em outros aparelhos.</p>}
        </div>
        <div className="quintal-acoes">
          {conta ? <a className="botao botao-contorno" href="/signout-with-chatgpt?return_to=%2Fmeu-quintal%2F" target="_top">Sair da conta</a>
            : <a className="botao" href={enderecoDaConta()}>Entrar com ChatGPT</a>}
          {estado === "erro" && <button className="botao botao-contorno" type="button"
            onClick={armazenamento.sincronizar}>Tentar salvar novamente</button>}
        </div>
      </div>
      {!conta && <p className="nota">Você está usando os dados salvos neste navegador.</p>}
      <CopiaDosDados naConta={Boolean(conta)} atualizarPainel={atualizarPainel} />
    </section>
  );
}

export default function MeuQuintal({ hospedado }) {
  const [secao, definirSecao] = useState(secaoAtual);
  const [estado, definirEstado] = useState(hospedado ? { tipo: "carregando" } : { tipo: "local" });
  const [recarregar, definirRecarregar] = useState(0);
  const raiz = hospedado ? sitePublico : "../";

  useEffect(() => {
    function trocar() {
      const destino = window.location.hash.slice(1);
      if (!destino || Object.hasOwn(secoes, destino)) definirSecao(secaoAtual());
    }
    window.addEventListener("hashchange", trocar);
    return () => window.removeEventListener("hashchange", trocar);
  }, []);

  useEffect(() => {
    if (!hospedado) return;
    let ativo = true;
    carregarConta().then((conta) => {
      if (!ativo) return;
      if (!conta) {
        definirEstado({ tipo: "entrar" });
        return;
      }
      const armazenamento = armazenamentoDaConta(conta);
      usarDadosDaConta(armazenamento);
      definirEstado({ tipo: "conta", conta, armazenamento });
    }).catch(() => {
      if (ativo) definirEstado({ tipo: "erro" });
    });
    return () => { ativo = false; };
  }, [hospedado]);

  const dentro = estado.tipo === "local" || estado.tipo === "conta";
  const voltarAoLocal = `${sitePublico}meu-quintal/${window.location.search}${window.location.hash}`;

  return (
    <div className="pagina" id="inicio">
      <a href="#conteudo" className="pular">Pular para o conteúdo</a>
      <Cabecalho raiz={raiz} pagina="meu-quintal" />
      <main className="quintal-pagina" id="conteudo" tabIndex={-1}>
        <header className="quintal-titulo">
          <div><h1>Meu Quintal</h1>
            <p>Planeje seu terreno e acompanhe o que você planta e colhe.</p></div>
          <a href={raiz}>Voltar ao Seu Quintal <Icone nome="seta" /></a>
        </header>
        {estado.tipo === "carregando" && <p role="status">Carregando sua conta…</p>}
        {estado.tipo === "entrar" && <section className="quintal-conta" aria-labelledby="titulo-entrar">
          <h2 id="titulo-entrar">Entre no seu quintal</h2>
          <p>Use sua conta do ChatGPT. Seus terrenos e cultivos ficam disponíveis quando você entrar em outro aparelho.</p>
          <div className="quintal-acoes">
            <a className="botao" href={entrarNaConta()} target="_top">Entrar com ChatGPT</a>
            <a className="botao botao-contorno" href={voltarAoLocal}>Usar neste navegador</a>
          </div>
        </section>}
        {estado.tipo === "erro" && <section className="quintal-conta" aria-label="Acesso à conta">
          <p role="alert">Não foi possível acessar sua conta agora.</p>
          <div className="quintal-acoes">
            <button className="botao" type="button" onClick={() => window.location.reload()}>Tentar novamente</button>
            <a className="botao botao-contorno" href={voltarAoLocal}>Abrir os dados do navegador</a>
          </div>
        </section>}
        {dentro && <>
          <AreaDaConta conta={estado.conta} armazenamento={estado.armazenamento}
            atualizarPainel={() => definirRecarregar((n) => n + 1)} />
          <nav className="quintal-secoes" aria-label="Ferramentas do Meu Quintal">
            {Object.entries(secoes).map(([id, nome]) => (
              <a key={id} href={`#${id}`} className={`botao${secao === id ? "" : " botao-contorno"}`}
                aria-current={secao === id ? "page" : undefined}>{nome}</a>
            ))}
          </nav>
          <Suspense fallback={<p role="status">Carregando ferramenta…</p>}>
            <div key={recarregar} className="quintal-ferramenta">
              {secao === "terreno" && <PlanejadorQuintal naConta={hospedado} />}
              {secao === "historico" && <HistoricoCultivo naConta={hospedado} />}
              {secao === "horta" && <section aria-label="Organizador de horta">
                <h2>Organizador de horta</h2>
                <OrganizadorHorta naConta={hospedado} />
              </section>}
            </div>
          </Suspense>
        </>}
      </main>
      <Rodape raiz={raiz} pagina="meu-quintal" />
    </div>
  );
}
