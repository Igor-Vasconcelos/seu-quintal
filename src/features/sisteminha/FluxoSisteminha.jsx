/**
 * Fluxo educativo do Sisteminha. Não representa tubulações reais ou
 * autorização para usar dejetos sem tratamento.
 */
const rotas = [
  {
    id: "agua", titulo: "Água e nutrientes", subtitulo: "Aproveitamento responsável",
    passos: [
      { id: "tanque", nome: "Tanque de peixes", resumo: "Produção de peixes" },
      { nome: "Filtragem", resumo: "Sedimentador e biofiltro" },
      { id: "horta", nome: "Horta e pomar", resumo: "Irrigação adequada" },
    ],
  },
  {
    id: "materia", titulo: "Matéria orgânica", subtitulo: "Solo mais fértil",
    passos: [
      { id: "galinheiro", nome: "Resíduos adequados", resumo: "Cama e restos vegetais" },
      { id: "compostagem", nome: "Compostagem", resumo: "Tratamento e maturação" },
      { id: "minhocario", nome: "Minhocário", resumo: "Material já preparado" },
      { id: "horta", nome: "Solo dos canteiros", resumo: "Uso do composto ou húmus" },
    ],
  },
  {
    id: "alimentos", titulo: "Alimentos para a família", subtitulo: "O objetivo do sistema",
    passos: [
      { id: "tanque", nome: "Peixes", resumo: "Proteína" },
      { id: "galinheiro", nome: "Ovos e aves", resumo: "Proteína" },
      { id: "horta", nome: "Vegetais e frutas", resumo: "Diversidade alimentar" },
    ],
  },
];

export default function FluxoSisteminha() {
  return (
    <div className="sisteminha-fluxo" aria-labelledby="sisteminha-fluxo-titulo">
      <div className="sisteminha-fluxo-topo">
        <h3 id="sisteminha-fluxo-titulo">O ciclo em três caminhos</h3>
        <p>Selecione um componente para entender sua função. O desenho é didático, não um esquema de instalação.</p>
      </div>
      {rotas.map(rota => (
        <section key={rota.id} className={"sisteminha-rota sisteminha-rota-" + rota.id}
          aria-label={rota.titulo}>
          <div className="sisteminha-rota-titulo">
            <span className="sisteminha-rota-marcador" aria-hidden="true"/>
            <div>
              <h4>{rota.titulo}</h4>
              <p>{rota.subtitulo}</p>
            </div>
          </div>
          <ol className="sisteminha-rota-passos">
            {rota.passos.map((passo, indice) => (
              <li key={passo.nome + indice}>
                {passo.id
                  ? <a href={"#" + passo.id} className="sisteminha-passo">
                      <strong>{passo.nome}</strong><small>{passo.resumo}</small>
                    </a>
                  : <span className="sisteminha-passo sisteminha-passo-neutro">
                      <strong>{passo.nome}</strong><small>{passo.resumo}</small>
                    </span>}
                {indice < rota.passos.length - 1 &&
                  <span className="sisteminha-seta-fluxo" aria-hidden="true">→</span>}
              </li>
            ))}
          </ol>
        </section>
      ))}
      <p className="sisteminha-fluxo-nota">
        Atenção: resíduos animais precisam de manejo e tratamento apropriados antes de uso agrícola.
        A água de criação não deve ser confundida com água potável.
      </p>
      <a className="sisteminha-fluxo-integrar" href="#integracao">Entender as conexões e os cuidados <span aria-hidden="true">→</span></a>
    </div>
  );
}
