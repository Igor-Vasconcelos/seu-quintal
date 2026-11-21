import { useMemo } from "react";
import { formatarMedida } from "../planejador/geometria.js";
import { situacaoDosCanteiros } from "./situacaoCanteiros.js";
import IconeCultura from "./IconeCultura.jsx";
import { hojeCivil, janelaDeDatas } from "./escala.js";
import "../../styles/canteiros-inteligentes.css";

export default function CanteirosResumo({ colecao, planos, aviso }) {
  const situacoes = useMemo(() => situacaoDosCanteiros(colecao, planos, hojeCivil()), [colecao, planos]);
  const linkEditor = window.location.pathname.includes("/meu-quintal/")
    ? "../horta/canteiros/" : "../canteiros/";
  return (
    <section className="organizador-cartao meus-canteiros-resumo" id="meus-canteiros" aria-labelledby="titulo-meus-canteiros">
      <div className="organizador-secao-cabecalho">
        <div>
          <h2 id="titulo-meus-canteiros">Meus canteiros</h2>
          <p className="nota">Desenhos salvos e previsão de uso dos espaços. As datas são estimadas, não confirmam a ocupação real.</p>
        </div>
        <a className="botao botao-contorno" href={linkEditor}>Editar desenhos</a>
      </div>
      {aviso && <p className="aviso" role="alert">{aviso}</p>}
      <ul className="canteiros-resumo-grade">
        {situacoes.map(item => (
          <li key={item.id} className="canteiros-resumo-item">
            <div className="canteiros-resumo-cabecalho">
              <h3>{item.nome}</h3>
              <span>{formatarMedida(item.area)} m²</span>
            </div>
            <p className="canteiros-resumo-status">{item.estado}</p>
            <p className="nota">{item.plantasNoDesenho} posições no desenho · {item.planos} {item.planos === 1 ? "cultivo vinculado" : "cultivos vinculados"}</p>
            {item.culturas.length > 0 && <div className="canteiros-resumo-culturas">
              {item.culturas.map(cultura => (
                <span key={cultura}><IconeCultura nome={cultura} />{cultura}</span>
              ))}
            </div>}
            {item.colheitas.length > 0 && <p className="canteiros-resumo-colheitas">
              <strong>Próxima janela de colheita:</strong> {item.colheitas[0].cultura} — {janelaDeDatas(item.colheitas[0].de, item.colheitas[0].ate)}
            </p>}
            <p className="canteiros-resumo-replantio">{item.sugestao}</p>
            {item.alertaArea && <p className="aviso">
              A soma estimada dos lotes ({formatarMedida(item.demanda)} m²) ultrapassa a área deste canteiro.
            </p>}
          </li>
        ))}
      </ul>
      <p className="nota">Para vincular um cultivo, escolha o canteiro salvo em “Planejar um cultivo”. A agenda usa IDs estáveis, mas ainda não move as plantas automaticamente no desenho.</p>
    </section>
  );
}
