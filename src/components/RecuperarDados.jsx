export default function RecuperarDados({ recuperar, salvando }) {
  return (
    <div className="aviso recuperacao-local">
      <p role="alert">Os dados salvos neste navegador precisam de recuperação.</p>
      <p>Os registros legíveis serão mantidos e uma cópia dos dados originais ficará salva neste navegador.</p>
      <button className="botao botao-contorno" type="button" disabled={salvando} onClick={recuperar}>
        Recuperar dados
      </button>
    </div>
  );
}
