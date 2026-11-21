import { useId } from "react";

// Ilustrações vetoriais originais e escaláveis: esquemas conceituais, não desenhos de execução.
// A foto de contexto permanece no módulo e o SVG explica o processo sem pixelar.
const descricoes = {
  tanque: "Tanque de peixes com circulação de água para tratamento em sedimentador e biofiltro. Esquema conceitual, sem medidas.",
  horta: "Canteiros com plantas de diferentes tipos e indicação de irrigação e solo com composto tratado.",
  compostagem: "Composteira com camadas de materiais orgânicos e composto maturado como resultado do tratamento.",
  minhocario: "Minhocário com substrato úmido, minhocas e húmus, em caixa protegida e com drenagem.",
  galinheiro: "Galinheiro com abrigo, poleiro, bebedouro, área de circulação e cama a ser tratada.",
};
const titles = {
  tanque: "Esquema ilustrativo da filtragem",
  horta: "Esquema ilustrativo de canteiros",
  compostagem: "Esquema ilustrativo da compostagem",
  minhocario: "Esquema ilustrativo do minhocário",
  galinheiro: "Esquema ilustrativo do galinheiro",
};
function Rotulo({ x, y, children }) {
  return <text x={x} y={y} fill="#183C2B" fontFamily="DM Sans, sans-serif" fontSize="17" fontWeight="700" textAnchor="middle">{children}</text>;
}
function Seta({ x1, x2, y = 164 }) {
  return <path d={"M" + x1 + " " + y + " H" + x2 + " m-10 -8 l10 8 l-10 8"}
    stroke="#205B40" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="7 7"/>;
}
function Peixe({ x, y, cor = "#ECA454" }) {
  return <g transform={"translate(" + x + " " + y + ")"}>
    <ellipse cx="0" cy="0" rx="23" ry="12" fill={cor} stroke="#9C5829" strokeWidth="1.8"/>
    <path d="M-16 0 L-35 -15 L-35 15 Z" fill={cor} stroke="#9C5829" strokeWidth="1.8"/>
    <circle cx="12" cy="-3" r="2.4" fill="#183C2B"/>
    <path d="M-4 -11 L6 -19 L8 -10" fill={cor} stroke="#9C5829" strokeWidth="1.3"/>
  </g>;
}
function Planta({ x, y, escala = 1 }) {
  return <g transform={"translate(" + x + " " + y + ") scale(" + escala + ")"}>
    <path d="M0 0 V-45" fill="none" stroke="#205B40" strokeWidth="4" strokeLinecap="round"/>
    <path d="M0 -21 C-38 -27 -42 -60 -10 -56 C5 -49 0 -21 0 -21Z" fill="#78AD5B" stroke="#2F7444" strokeWidth="2"/>
    <path d="M0 -33 C21 -69 44 -62 33 -37 C23 -20 0 -33 0 -33Z" fill="#A2CD70" stroke="#2F7444" strokeWidth="2"/>
  </g>;
}
export default function EsquemaModulo({ modulo }) {
  const id = useId().replaceAll(":", "");
  return (
    <figure className="sisteminha-esquema">
      <svg viewBox="0 0 760 285" role="img" aria-labelledby={id + "-titulo " + id + "-descricao"}
        xmlns="http://www.w3.org/2000/svg">
        <title id={id + "-titulo"}>{titles[modulo]}</title>
        <desc id={id + "-descricao"}>{descricoes[modulo]}</desc>
        <defs>
          <linearGradient id={id + "-ceu"} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#EEF7E9"/>
            <stop offset="100%" stopColor="#FDF8ED"/>
          </linearGradient>
          <linearGradient id={id + "-agua"} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#80C9D0"/>
            <stop offset="100%" stopColor="#397E98"/>
          </linearGradient>
          <pattern id={id + "-solo"} width="22" height="16" patternUnits="userSpaceOnUse">
            <rect width="22" height="16" fill="#A76E4C"/>
            <circle cx="5" cy="6" r="2" fill="#D2A980"/>
            <circle cx="17" cy="13" r="1.7" fill="#795337"/>
          </pattern>
        </defs>
        <rect width="760" height="285" rx="16" fill={"url(#" + id + "-ceu)"}/>
        <path d="M0 235 H760" stroke="#C2CFB5" strokeWidth="2"/>
        {modulo === "tanque" && <>
          <ellipse cx="230" cy="180" rx="165" ry="56" fill="#CBAB83" stroke="#8B6847" strokeWidth="7"/>
          <path d="M65 180 V215 Q230 279 395 215 V180" fill="#B68A59" stroke="#8B6847" strokeWidth="5"/>
          <ellipse cx="230" cy="169" rx="154" ry="46" fill={"url(#" + id + "-agua)"} stroke="#D6D4BA" strokeWidth="7"/>
          <Peixe x={150} y={170}/><Peixe x={270} y={184} cor="#F8CF67"/>
          <path d="M205 160 q20 -12 43 -5" fill="none" stroke="#D8EFF4" strokeWidth="3" opacity=".7"/>
          <path d="M357 140 V115 H468" stroke="#6B9CA8" strokeWidth="12" fill="none" strokeLinejoin="round"/>
          <rect x="480" y="85" width="95" height="139" rx="13" fill="#E8DAC0" stroke="#8C997C" strokeWidth="5"/>
          <rect x="491" y="105" width="73" height="56" fill="#C7AB83"/>
          <path d="M491 155 H564" stroke="#7F775C" strokeWidth="3"/>
          <path d="M529 166 V221" stroke="#6C8978" strokeWidth="8"/>
          <path d="M575 208 H620 V231 H326" fill="none" stroke="#799BA0" strokeWidth="10" strokeLinejoin="round"/>
          <path d="M575 112 H627" fill="none" stroke="#799BA0" strokeWidth="7"/>
          <circle cx="500" cy="178" r="3" fill="#7292A0"/>
          <circle cx="535" cy="125" r="3" fill="#7292A0"/>
          <Rotulo x={230} y={85}>Tanque com peixes</Rotulo>
          <Rotulo x={532} y={61}>Sedimentação e biofiltro</Rotulo>
          <Rotulo x={380} y={270}>Água recirculada após tratamento</Rotulo>
        </>}
        {modulo === "horta" && <>
          <path d="M36 184 L225 147 L390 189 L191 238Z" fill={"url(#" + id + "-solo)"} stroke="#8A5B38" strokeWidth="4"/>
          <path d="M385 187 L536 158 L708 194 L550 239Z" fill={"url(#" + id + "-solo)"} stroke="#8A5B38" strokeWidth="4"/>
          {[80,140,200,255,318].map((x,i)=><Planta key={i} x={x} y={188+(i%2)*8} escala={.67}/>)}
          {[455,512,571,627,676].map((x,i)=><Planta key={i} x={x} y={188+(i%2)*9} escala={.7}/>)}
          <path d="M333 65 C333 100 303 105 303 128 C303 145 362 150 362 127 C362 108 333 94 333 65Z" fill="#88C2D3" stroke="#44869D" strokeWidth="3"/>
          <path d="M376 65 C376 100 346 105 346 128 C346 145 405 150 405 127 C405 108 376 94 376 65Z" fill="#88C2D3" stroke="#44869D" strokeWidth="3"/>
          <Rotulo x={135} y={82}>Plantas adaptadas</Rotulo>
          <Rotulo x={579} y={82}>Solo com adubo tratado</Rotulo>
          <Rotulo x={379} y={270}>Água adequada • espaçamento • plantio escalonado</Rotulo>
        </>}
        {modulo === "compostagem" && <>
          <rect x="89" y="99" width="332" height="135" rx="8" fill="#B18352" stroke="#72543C" strokeWidth="6"/>
          {[145,185,225,265,305,345,385].map(x=><path key={x} d={"M" + x + " 99 V234"} stroke="#79563D" strokeWidth="5"/>)}
          <path d="M101 167 H407 V208 H101Z" fill={"url(#" + id + "-solo)"} stroke="#956644" strokeWidth="2"/>
          <path d="M103 143 q28 -25 58 2 q29 -17 58 0 q32 -15 58 -5 q22 -21 55 -2 q38 -15 74 5 V171 H103Z" fill="#86A15D"/>
          <path d="M102 130 q25 -20 52 -8 q30 -23 59 -2 q30 -23 60 -1 q24 -17 51 0 q33 -15 82 9" fill="none" stroke="#AD8A55" strokeWidth="12" strokeLinecap="round"/>
          <Seta x1={444} x2={512} y={169}/>
          <rect x="536" y="153" width="147" height="74" rx="9" fill={"url(#" + id + "-solo)"} stroke="#875739" strokeWidth="5"/>
          <path d="M540 155 Q586 119 635 143 Q659 140 681 153" fill="#6E573D"/>
          <Rotulo x={248} y={64}>Materiais adequados + manejo</Rotulo>
          <Rotulo x={610} y={111}>Composto</Rotulo>
          <Rotulo x={610} y={135}>maturado</Rotulo>
          <Rotulo x={373} y={268}>Aeração • umidade • maturação • segurança sanitária</Rotulo>
        </>}
        {modulo === "minhocario" && <>
          <rect x="130" y="84" width="495" height="150" rx="11" fill="#B98B61" stroke="#72573E" strokeWidth="7"/>
          <rect x="147" y="108" width="461" height="112" fill={"url(#" + id + "-solo)"}/>
          <path d="M147 110 H608" stroke="#9CC67A" strokeWidth="25"/>
          <path d="M148 153 H607" stroke="#8E704E" strokeWidth="19"/>
          <path d="M149 193 H605" stroke="#654632" strokeWidth="24"/>
          {[210,315,420,515].map((x,i)=>
            <path key={i} d={"M" + x + " " + (155+i%2*10) + " c30 -35 55 25 80 -7"}
              stroke="#D99589" strokeWidth="9" fill="none" strokeLinecap="round"/>)}
          <path d="M145 77 H610" stroke="#7D6549" strokeWidth="11" strokeLinecap="round"/>
          <path d="M175 234 V247 M584 234 V247" stroke="#816347" strokeWidth="8"/>
          <circle cx="560" cy="243" r="5" fill="#4B8497"/>
          <Rotulo x={380} y={52}>Material adequado e úmido</Rotulo>
          <Rotulo x={381} y={272}>Sombra • ventilação • drenagem • húmus</Rotulo>
        </>}
        {modulo === "galinheiro" && <>
          <path d="M98 117 L290 42 L480 117 V233 H98Z" fill="#E5C998" stroke="#886647" strokeWidth="6"/>
          <path d="M76 117 L290 29 L502 117" fill="none" stroke="#7C593A" strokeWidth="17" strokeLinejoin="round" strokeLinecap="round"/>
          <rect x="158" y="146" width="195" height="87" rx="7" fill="#B28A60" stroke="#795C40" strokeWidth="5"/>
          {[178,214,250,286,322].map(x=><path key={x} d={"M" + x + " 146 V233"} stroke="#806246" strokeWidth="4"/>)}
          <path d="M140 194 H380" stroke="#795B40" strokeWidth="7"/>
          <path d="M540 195 v32 M572 195 v32" stroke="#7B755B" strokeWidth="4"/>
          <path d="M532 195 H579 L569 222 H540Z" fill="#8BB7C5" stroke="#447A8D" strokeWidth="3"/>
          <ellipse cx="640" cy="206" rx="36" ry="23" fill="#BE7A4F" stroke="#85583E" strokeWidth="3"/>
          <circle cx="659" cy="182" r="16" fill="#BE7A4F" stroke="#85583E" strokeWidth="3"/>
          <path d="M660 168 l-7 -15 l8 8 l6 -10 l5 15" fill="#C44E3D"/>
          <path d="M672 188 l13 6 l-13 7" fill="#E8B55A"/>
          <circle cx="666" cy="181" r="2" fill="#183C2B"/>
          <path d="M627 225 v13 M650 225 v13" stroke="#996D3F" strokeWidth="4"/>
          <Rotulo x={284} y={262}>Abrigo ventilado e protegido</Rotulo>
          <Rotulo x={599} y={264}>Água fresca</Rotulo>
        </>}
      </svg>
      <figcaption>Esquema vetorial educativo do Seu Quintal — ilustração conceitual, sem escala técnica.</figcaption>
    </figure>
  );
}
