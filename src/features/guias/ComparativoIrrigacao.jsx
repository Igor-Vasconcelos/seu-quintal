import { useState } from "react";

const cenarios = {
  vasos: {
    nome: "Alguns vasos",
    indicacao: "Em poucos vasos perto da torneira, comece com uma mangueira de jato suave. O gotejamento ganha utilidade se a rega for frequente ou difícil de encaixar na rotina.",
    mangueira: ["Baixo se já houver mangueira. Use um esguicho com jato suave.", "É preciso visitar cada vaso, mas são poucos pontos.", "Guarde a mangueira à sombra e confira se há vazamentos nas conexões."],
    gotejamento: ["Requer microtubos, gotejadores, conexões e filtragem. O temporizador é opcional.", "Depois de instalar e regular, uma abertura da água atende vários vasos.", "Confira se todos os vasos recebem água e limpe os gotejadores quando necessário."],
  },
  canteiro: {
    nome: "Um canteiro",
    indicacao: "A mangueira facilita mudar a rega conforme o plantio. Se as fileiras são fixas e exigem regas frequentes, compare o trabalho manual com a instalação de uma linha gotejadora.",
    mangueira: ["Normalmente menor se a mangueira já alcança o canteiro. Um crivo ajuda a distribuir a água.", "Você precisa passar pelo canteiro em toda rega.", "Confira conexões e use jato suave para evitar deslocar a terra perto das mudas."],
    gotejamento: ["Inclua linha gotejadora, filtro, conexões e regulador se a pressão exigir.", "A montagem leva tempo. Depois, acompanhe a umidade do solo e o tempo que o sistema fica ligado.", "Limpe o filtro e verifique se a água chega aos pontos mais distantes."],
  },
  varios: {
    nome: "Vários canteiros",
    indicacao: "O gotejamento pode reduzir o trabalho de percorrer várias fileiras. Antes de comprar, observe a pressão e a vazão da água disponível e veja quantos canteiros podem funcionar por vez.",
    mangueira: ["Pode exigir mangueira mais comprida e conexões extras para alcançar todos os canteiros.", "Requer percorrer a área a cada rega. O tempo aumenta com o número de canteiros.", "Verifique dobras, vazamentos e desgaste ao arrastar a mangueira pelo terreno."],
    gotejamento: ["O investimento cresce com a metragem das linhas e o número de conexões, filtros e registros.", "Uma vez instalado, permite molhar as fileiras por setores sem percorrer cada uma com a mangueira.", "Inspecione vazamentos e entupimentos e faça a limpeza do filtro e das linhas."],
  },
};

const criterios = ["Custo inicial", "Tempo de rega", "Manutenção"];

export default function ComparativoIrrigacao() {
  const [cenario, definirCenario] = useState("vasos");
  const atual = cenarios[cenario];

  return (
    <section className="guia-interativo" aria-labelledby="titulo-irrigacao">
      <h3 id="titulo-irrigacao">Mangueira ou gotejamento?</h3>
      <label className="campo">Qual é o tamanho da horta?
        <select value={cenario} onChange={(evento) => definirCenario(evento.target.value)}>
          {Object.entries(cenarios).map(([id, { nome }]) => <option key={id} value={id}>{nome}</option>)}
        </select>
      </label>
      <p className="painel-guia" role="status">{atual.indicacao}</p>
      <div className="campos-guia campos-guia-duplo">
        {[["Mangueira", atual.mangueira], ["Gotejamento", atual.gotejamento]].map(([nome, valores]) => (
          <div className="painel-guia comparativo-rega" key={nome}>
            <h4>{nome}</h4>
            <dl>{criterios.map((criterio, indice) => (
              <div key={criterio}><dt>{criterio}</dt><dd>{valores[indice]}</dd></div>
            ))}</dl>
          </div>
        ))}
      </div>
      <a className="link-fonte" href="https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1120149/1/manual-pratico-instalacao.pdf" target="_blank" rel="noreferrer">
        Manual de instalação de hortas · Embrapa
      </a>
    </section>
  );
}
