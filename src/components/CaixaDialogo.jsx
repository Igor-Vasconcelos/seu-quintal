import { useEffect, useRef } from "react";
import Icone from "./Icone.jsx";

export default function CaixaDialogo({ titulo, fechar, children }) {
  const dialogo = useRef(null);

  useEffect(() => {
    const elemento = dialogo.current;
    elemento.showModal();
    return () => elemento.close();
  }, []);

  return (
    <dialog ref={dialogo} className="dialogo" aria-labelledby="titulo-dialogo"
      onCancel={(evento) => { evento.preventDefault(); fechar(); }}>
      <div className="dialogo-cabecalho">
        <h2 id="titulo-dialogo">{titulo}</h2>
        <button className="fechar" type="button" aria-label="Fechar" onClick={fechar}>
          <Icone nome="fechar" />
        </button>
      </div>
      {children}
    </dialog>
  );
}
