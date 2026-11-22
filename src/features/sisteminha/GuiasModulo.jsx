import Icone from "../../components/Icone.jsx";

// Links para materiais já existentes. Não anunciar uma página futura como publicada.
const sugestoes = {
  tanque: [
    {titulo:"Planeje seu tanque",descricao:"Volume, biomassa e limitações do manejo.",href:"./ferramentas/calculadora-peixes/"},
    {titulo:"Organize o espaço",descricao:"Reserve uma área para o tanque no seu terreno.",href:"./meu-quintal/#terreno"},
  ],
  galinheiro: [
    {titulo:"Quantas galinhas para ovos em casa?",descricao:"Conheça fatores de consumo e produção.",href:"./artigos/quantas-galinhas-para-ter-ovos-em-casa/"},
    {titulo:"Compare a criação de codornas",descricao:"Estime consumo, área e objetivos de produção.",href:"./ferramentas/calculadora-codornas/"},
  ],
  horta: [
    {titulo:"Planeje uma horta com colheita frequente",descricao:"Organize plantios em lotes.",href:"./artigos/como-planejar-uma-horta-para-colher-com-frequencia/"},
    {titulo:"Montar horta para consumo familiar",descricao:"Escolha alimentos, metas semanais e aprenda a alternar as culturas.",href:"./horta/organizador/#planejamento-familiar"},
    {titulo:"Calendário de plantio",descricao:"Consulte períodos por região.",href:"./horta/calendario-de-plantio/"},
    {titulo:"Planejador de pomar",descricao:"Respeite o crescimento futuro das árvores.",href:"./ferramentas/planejador-de-pomar/"},
  ],
  compostagem: [
    {titulo:"Checklist de compostagem",descricao:"Aprenda a separar materiais com segurança.",href:"./guias/compostagem/"},
    {titulo:"Cultivar em pequenos espaços",descricao:"Use o composto com manejo adequado.",href:"./horta/"},
  ],
  minhocario: [
    {titulo:"Checklist de compostagem",descricao:"Entenda os materiais antes do minhocário.",href:"./guias/compostagem/"},
  ],
};

export default function GuiasModulo({modulo}) {
  const itens = sugestoes[modulo] ?? [];
  if (itens.length === 0) return null;
  return (
    <aside className="sisteminha-guias-modulo" aria-label="Guias para aprofundar o módulo">
      <div className="sisteminha-guias-cabecalho">
        <span className="sisteminha-kicker">CONTINUE APRENDENDO</span>
        <h3>Guias e conteúdos relacionados</h3>
        <p>Entenda o assunto e abra a ferramenta quando fizer sentido para o seu espaço.</p>
      </div>
      <ul>{itens.map(item => (
        <li key={item.href}><a href={item.href}>
          <span className="sisteminha-guias-icone"><Icone nome="livro"/></span>
          <span><strong>{item.titulo}</strong><small>{item.descricao}</small></span>
          <Icone nome="seta"/>
        </a></li>
      ))}</ul>
    </aside>
  );
}
