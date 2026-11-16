import { useEffect, useId, useRef } from "react";
import Icone from "./Icone.jsx";

function clicouFora(evento) {
  if (evento.target !== evento.currentTarget) return false;
  const { left, top, right, bottom } = evento.currentTarget.getBoundingClientRect();
  return evento.clientX < left || evento.clientX > right || evento.clientY < top || evento.clientY > bottom;
}

export default function CaixaDialogo({ titulo, acionador, fechar, children }) {
  const dialogo = useRef(null);
  const iniciouFora = useRef(false);
  const idTitulo = useId();

  useEffect(() => {
    const elemento = dialogo.current;
    elemento.showModal();
    return () => elemento.close();
  }, []);

  function fecharDialogo() {
    dialogo.current.close();
    fechar();
    if (acionador?.isConnected) acionador.focus({ preventScroll: true });
  }

  return (
    <dialog ref={dialogo} className="dialogo" aria-labelledby={idTitulo}
      onPointerDown={(evento) => { iniciouFora.current = evento.button === 0 && clicouFora(evento); }}
      onPointerCancel={() => { iniciouFora.current = false; }}
      onClick={(evento) => {
        const clicouNoFundo = iniciouFora.current && clicouFora(evento);
        iniciouFora.current = false;
        if (clicouNoFundo) fecharDialogo();
      }}
      onCancel={(evento) => { evento.preventDefault(); fecharDialogo(); }}>
      <div className="dialogo-cabecalho">
        <h2 id={idTitulo}>{titulo}</h2>
        <button className="fechar" type="button" aria-label="Fechar" onClick={fecharDialogo}>
          <Icone nome="fechar" />
        </button>
      </div>
      <div className="dialogo-corpo">{children}</div>
    </dialog>
  );
}
