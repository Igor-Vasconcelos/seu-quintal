import IconeCultura from "./IconeCultura.jsx";

/**
 * Cenas esquemáticas leves, sem imagens externas.
 * O pictograma original identifica a cultura; sementes e mudas são genéricas,
 * pois a morfologia muda conforme espécie e cultivar.
 * Os textos e datas permanecem no componente pai.
 */
function Semeadura({ origem, comMudas }) {
  if (origem === "muda") {
    return <svg className="sq-horta-etapa-cena-svg" viewBox="0 0 140 90" aria-hidden="true">
      <path d="M47 56h46l-5 26H52Z" fill="var(--sq-plan-soil)" stroke="var(--sq-plan-planned-stroke)" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M70 59V26M70 45Q47 44 51 29Q63 26 70 45ZM70 39Q92 39 90 24Q78 22 70 39Z"
        fill="var(--sq-leaf)" stroke="var(--sq-forest)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M70 26V20" stroke="var(--sq-forest)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M54 65h33" stroke="var(--sq-plan-planned-stroke)" strokeWidth="2" strokeLinecap="round"/>
    </svg>;
  }
  return <svg className="sq-horta-etapa-cena-svg" viewBox="0 0 140 90" aria-hidden="true">
    <path d="M22 47h96l-8 32H30Z" fill="var(--sq-plan-soil)" stroke="var(--sq-plan-planned-stroke)" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M22 47h96M54 47l-3 32M86 47l3 32M28 63h84" stroke="var(--sq-plan-planned-stroke)" strokeWidth="1.5" fill="none"/>
    {comMudas
      ? [40, 70, 100].map(x => <g key={x} transform={`translate(${x} 0)`}>
          <path d="M0 59V36" stroke="var(--sq-forest)" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M0 45Q-17 42-14 32Q-4 31 0 45ZM0 40Q15 37 12 28Q3 28 0 40Z"
            fill="var(--sq-leaf)" stroke="var(--sq-forest)" strokeWidth="1.5"/>
        </g>)
      : [40, 70, 100].map(x => <g key={x}>
          <ellipse cx={x} cy="57" rx="5" ry="3.5" fill="var(--sq-plan-planned-stroke)"/>
          <path d={`M${x+1} 55q4-6 1-9`} stroke="var(--sq-surface-warm)" strokeWidth="1.2" fill="none"/>
        </g>)}
  </svg>;
}

function Desenvolvimento() {
  return <svg className="sq-horta-etapa-cena-svg" viewBox="0 0 140 90" aria-hidden="true">
    <path d="M11 67Q70 58 129 67v19H11Z" fill="var(--sq-plan-soil)"/>
    <path d="M11 67Q70 58 129 67" stroke="var(--sq-plan-planned-stroke)" strokeWidth="2" fill="none"/>
    {[35, 70, 105].map((x,i) => {
      const alta = i === 1 ? 31 : 40;
      return <g key={x}>
        <path d={`M${x} 67V${alta}`} stroke="var(--sq-forest)" strokeWidth="3" strokeLinecap="round"/>
        <path d={`M${x} ${alta+15}Q${x-19} ${alta+15} ${x-17} ${alta+2}Q${x-6} ${alta+3} ${x} ${alta+15}Z`}
          fill="var(--sq-leaf)" stroke="var(--sq-forest)" strokeWidth="1.4"/>
        <path d={`M${x} ${alta+11}Q${x+18} ${alta+9} ${x+16} ${alta-3}Q${x+5} ${alta-1} ${x} ${alta+11}Z`}
          fill="var(--sq-brand-700)" stroke="var(--sq-forest)" strokeWidth="1.4"/>
        <path d={`M${x} 67q-3 9-6 11M${x} 67q5 9 9 11`}
          stroke="var(--sq-plan-planned-stroke)" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
      </g>;
    })}
  </svg>;
}

function Colheita({ cultura }) {
  return <div className="sq-horta-etapa-colheita">
    <IconeCultura nome={cultura} className="sq-horta-etapa-colheita-cultura"/>
    <svg className="sq-horta-etapa-colheita-cesta" viewBox="0 0 110 50" aria-hidden="true">
      <path d="M17 15h76l-10 31H27Z" fill="var(--sq-plan-soil)"
        stroke="var(--sq-plan-planned-stroke)" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M25 15h60M39 18l3 24M55 18v25M71 18l-3 24"
        fill="none" stroke="var(--sq-plan-planned-stroke)" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M36 15Q36 1 55 1T74 15" stroke="var(--sq-plan-planned-stroke)"
        strokeWidth="3" fill="none"/>
    </svg>
  </div>;
}

export default function EstagioCulturaVisual({
  cultura, etapa, origem = "semente", comMudas = false,
}) {
  if (![1, 2, 3].includes(etapa)) return null;

  return <div className={`sq-horta-etapa-ilustracao sq-horta-etapa-ilustracao--${etapa}`}
    aria-hidden="true">
    <div className="sq-horta-etapa-cena">
      {etapa === 1 && <Semeadura origem={origem} comMudas={comMudas}/>}
      {etapa === 2 && <Desenvolvimento/>}
      {etapa === 3 && <Colheita cultura={cultura}/>}
      {etapa !== 3 && <div className="sq-horta-etapa-cultura-selo">
        <IconeCultura nome={cultura}/>
      </div>}
    </div>
  </div>;
}
