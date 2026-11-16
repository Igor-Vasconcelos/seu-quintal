import { Component, useState } from "react";

export function FalhaAoCarregar() {
  const [tentando, definirTentando] = useState(false);

  async function tentarNovamente() {
    definirTentando(true);
    // Uma falha pode ficar guardada no cache do navegador mesmo ao recarregar a página.
    const links = document.querySelectorAll('link[rel="modulepreload"], link[rel="stylesheet"]');
    const arquivos = new Set(Array.from(links, (link) => link.href)
      .filter((url) => url.startsWith(window.location.origin + "/")));
    const signal = AbortSignal.timeout(5000);
    await Promise.allSettled([...arquivos].map((url) => fetch(url, { cache: "reload", signal })));
    window.location.reload();
  }

  return (
    <div className="aviso aviso-ferramenta">
      <p role="alert">O carregamento da ferramenta foi interrompido.</p>
      <button className="botao botao-contorno" type="button" disabled={tentando} onClick={tentarNovamente}>
        {tentando ? "Tentando novamente…" : "Tentar novamente"}
      </button>
    </div>
  );
}

export default class LimiteDaFerramenta extends Component {
  state = { falhou: false };

  static getDerivedStateFromError() {
    return { falhou: true };
  }

  render() {
    return this.state.falhou ? <FalhaAoCarregar /> : this.props.children;
  }
}
