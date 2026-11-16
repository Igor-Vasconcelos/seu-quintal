import { useEffect, useRef } from "react";
import Icone from "./Icone.jsx";

function clicouFora(evento) {
  if (evento.target !== evento.currentTarget) return false;
  const { left, top, right, bottom } = evento.currentTarget.getBoundingClientRect();
  return evento.clientX < left || evento.clientX > right || evento.clientY < top || evento.clientY > bottom;
}

export default function CaixaDialogo({ titulo, fechar, children }) {
  const dialogo = useRef(null);
  const iniciouFora = useRef(false);

  useEffect(() => {
    const elemento = dialogo.current;
    elemento.showModal();
    return () => elemento.close();
  }, []);

  return (
    <dialog ref={dialogo} className="dialogo" aria-labelledby="titulo-dialogo"
      onPointerDown={(evento) => { iniciouFora.current = evento.button === 0 && clicouFora(evento); }}
      onPointerCancel={() => { iniciouFora.current = false; }}
      onClick={(evento) => {
        const fecharDialogo = iniciouFora.current && clicouFora(evento);
        iniciouFora.current = false;
        if (fecharDialogo) fechar();
      }}
      onCancel={(evento) => { evento.preventDefault(); fechar(); }}>
      <div className="dialogo-cabecalho">
        <h2 id="titulo-dialogo">{titulo}</h2>
        <button className="fechar" type="button" aria-label="Fechar" onClick={fechar}>
          <Icone nome="fechar" />
        </button>
      </div>
      <div className="dialogo-corpo">{children}</div>
    </dialog>
  );
}
