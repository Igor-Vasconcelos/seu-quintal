import { useRef, useState } from "react";

export default function BackupDados() {
  const [selecionado, definirSelecionado] = useState(null);
  const [confirmado, definirConfirmado] = useState(false);
  const [ocupado, definirOcupado] = useState(false);
  const [erro, definirErro] = useState("");
  const [mensagem, definirMensagem] = useState("");
  const entrada = useRef(null);

  async function baixarBackup() {
    definirOcupado(true);
    definirErro("");
    definirMensagem("");
    try {
      const { criarBackup } = await import("../backup/backup.js");
      const pacote = await criarBackup();
      const arquivo = new Blob([JSON.stringify(pacote)], { type: "application/json;charset=utf-8" });
      const endereco = URL.createObjectURL(arquivo);
      const link = document.createElement("a");
      link.href = endereco;
      link.download = "seu-quintal-backup-" + pacote.criadoEm.slice(0, 10) + ".json";
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(endereco), 10_000);
      definirMensagem("Arquivo de backup preparado. Guarde-o em um local seguro.");
    } catch (falha) {
      definirErro(falha.message || "Não foi possível gerar o backup.");
    } finally {
      definirOcupado(false);
    }
  }

  async function selecionarArquivo(evento) {
    const arquivo = evento.target.files?.[0];
    evento.target.value = "";
    definirSelecionado(null);
    definirConfirmado(false);
    definirErro("");
    definirMensagem("");
    if (!arquivo) return;
    try {
      const { limiteArquivoBackup, validarBackup, resumoBackup } = await import("../backup/backup.js");
      if (arquivo.size > limiteArquivoBackup) throw new Error("Escolha um arquivo JSON de até 2 MB.");
      const texto = await arquivo.text();
      const pacote = validarBackup(JSON.parse(texto));
      definirSelecionado({ nome: arquivo.name, pacote, resumo: resumoBackup(pacote) });
    } catch (falha) {
      definirErro(falha instanceof SyntaxError
        ? "Este arquivo não contém um JSON válido."
        : falha.message || "Não foi possível ler o arquivo.");
    }
  }

  async function restaurar() {
    if (!selecionado || !confirmado || ocupado) return;
    definirOcupado(true);
    definirErro("");
    try {
      const { restaurarBackup } = await import("../backup/backup.js");
      await restaurarBackup(selecionado.pacote);
      // Remonta o editor, o histórico e a horta com os dados restaurados.
      window.location.reload();
    } catch (falha) {
      definirErro(falha.message || "Não foi possível restaurar o backup.");
      definirOcupado(false);
    }
  }

  return (
    <details className="quintal-backup" id="quintal-backup">
      <summary>Backup e recuperação dos meus dados</summary>
      <div className="quintal-backup-conteudo">
        <p>Salve uma cópia dos terrenos, canteiros, desenhos, histórico e planos da horta em um arquivo JSON.
          Os dados não são enviados para um servidor.</p>
        <div className="quintal-backup-acoes">
          <button className="botao botao-contorno" type="button" onClick={baixarBackup} disabled={ocupado}>
            Baixar backup
          </button>
          <label className="campo quintal-backup-arquivo">
            Restaurar de um arquivo JSON
            <input ref={entrada} type="file" accept=".json,application/json"
              disabled={ocupado} onChange={selecionarArquivo} />
          </label>
        </div>
        {selecionado && <div className="quintal-backup-previa">
          <p><strong>Arquivo:</strong> {selecionado.nome}</p>
          <p>Backup de {new Date(selecionado.pacote.criadoEm).toLocaleString("pt-BR")}.
            Contém {selecionado.resumo.terrenos} terreno(s), {selecionado.resumo.cenarios} cenário(s),
            {" "}{selecionado.resumo.registros} registro(s) de cultivo e {selecionado.resumo.planos} plano(s) de horta.
            {selecionado.resumo.canteiros !== undefined ? ` Inclui ${selecionado.resumo.canteiros} canteiro(s).` : " Este backup antigo não contém desenhos de canteiros; os atuais serão preservados."}</p>
          <p className="aviso"><strong>Atenção:</strong> restaurar substitui os dados deste navegador.
            Baixe primeiro uma cópia dos dados atuais e feche outras abas do Seu Quintal.</p>
          <label className="quintal-backup-confirmar">
            <input type="checkbox" checked={confirmado} disabled={ocupado}
              onChange={(evento) => definirConfirmado(evento.target.checked)} />
            Entendo que os dados atuais deste navegador serão substituídos.
          </label>
          <div className="quintal-backup-acoes">
            <button className="botao" type="button" disabled={!confirmado || ocupado} onClick={restaurar}>
              {ocupado ? "Restaurando…" : "Confirmar restauração"}
            </button>
            <button className="botao botao-contorno" type="button" disabled={ocupado} onClick={() => {
              definirSelecionado(null);
              definirConfirmado(false);
            }}>Cancelar</button>
          </div>
        </div>}
        {erro && <p className="erro" role="alert">{erro}</p>}
        {mensagem && <p className="nota" role="status">{mensagem}</p>}
      </div>
    </details>
  );
}
