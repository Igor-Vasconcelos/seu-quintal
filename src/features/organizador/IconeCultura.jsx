import { iconeDaCultura } from "./culturasVisuais.js";

// Ilustrações SVG leves e escaláveis. Sem depender de emoji ou de fotografias externas.
// O texto acessível está nos botões que usam os ícones (SVG decorativo).
function Folha({ x = 0, y = 0, rot = 0, escala = 1, cor = "#5B9C42" }) {
  return (
    <g transform={"translate(" + x + " " + y + ") rotate(" + rot + ") scale(" + escala + ")"}>
      <path d="M0 0 C-15 -8 -17 -29 0 -38 C16 -29 15 -8 0 0Z"
        fill={cor} stroke="#316B3F" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M0 -2 V-34 M0 -13 L-7 -22 M0 -21 L7 -28"
        stroke="#B6D98F" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    </g>
  );
}
function Alface() {
  return <g>
    <ellipse cx="36" cy="57" rx="25" ry="6" fill="#36622E" opacity=".13"/>
    {[0, 50, 100, 150, 200, 250, 300].map(ang =>
      <path key={ang} d="M36 35 C26 28 15 16 20 10 C30 4 43 13 45 25 C48 32 41 37 36 35Z"
        transform={"rotate(" + ang + " 36 36)"} fill={ang % 100 ? "#7DBD51" : "#98CE5A"}
        stroke="#498840" strokeWidth="1.5" strokeLinejoin="round"/>)}
    <path d="M36 50 C19 39 22 20 33 20 C44 23 49 38 36 50Z" fill="#D0E88C" stroke="#619F45" strokeWidth="1.2"/>
    <path d="M34 48 Q39 32 35 21" fill="none" stroke="#75A94A" strokeWidth="1.5"/>
  </g>;
}
function Rucula() {
  return <g>
    <path d="M34 60 Q31 39 27 17 M35 59 Q43 43 49 16 M34 60 Q35 32 39 11"
      stroke="#58824B" strokeWidth="3" fill="none" strokeLinecap="round"/>
    {[{x:25,r:-15},{x:37,r:4},{x:49,r:22}].map((p,i) =>
      <g key={i} transform={"translate(" + p.x + " 12) rotate(" + p.r + ")"}>
        <path d="M0 38 Q-11 32 -12 24 L-6 21 L-14 16 L-8 13 L-13 8 L-4 10 Q0 -1 3 0 Q8 6 12 10 L8 14 L16 16 L9 22 L13 25 Q6 31 0 38Z"
          fill={i===1?"#5C9941":"#82B857"} stroke="#3A783A" strokeWidth="1.5"/>
        <path d="M0 34 V5" stroke="#B5D889" strokeWidth="1.2"/>
      </g>)}
  </g>;
}
function Couve() {
  return <g>
    <path d="M32 60 Q36 39 38 20" stroke="#5B7942" strokeWidth="4" strokeLinecap="round"/>
    <path d="M38 45 C3 48 5 19 18 10 C25 -4 46 7 53 12 C75 24 58 53 38 45Z"
      fill="#468343" stroke="#285A36" strokeWidth="2"/>
    <path d="M35 43 C22 27 23 16 31 8 M35 43 C45 24 52 21 57 20 M35 43 Q39 28 38 12"
      stroke="#A8D28A" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M35 36 Q28 32 19 33 M41 32 Q49 35 60 32" stroke="#85BA72" strokeWidth="1.5" fill="none"/>
  </g>;
}
function Cenoura() {
  return <g>
    <ellipse cx="36" cy="61" rx="16" ry="4" fill="#8A582C" opacity=".14"/>
    <path d="M35 23 L22 19 C22 36 30 53 35 64 C43 49 50 34 48 19Z"
      fill="#F18827" stroke="#BF611F" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M26 29 L43 33 M29 42 L40 44 M31 53 L37 55" stroke="#E7A251" strokeWidth="2"/>
    <path d="M35 22 Q14 4 12 15 Q20 24 35 25 M36 21 Q33 0 42 6 Q45 13 37 24 M38 22 Q58 3 60 13 Q54 21 38 25"
      fill="#69AC43" stroke="#397941" strokeWidth="1.4"/>
  </g>;
}
function Beterraba() {
  return <g>
    <path d="M34 33 Q23 8 11 12 Q11 28 34 33 M38 32 Q45 5 58 9 Q59 27 38 32"
      fill="#63A449" stroke="#357943" strokeWidth="1.6"/>
    <path d="M33 32 Q33 13 35 8 M38 31 Q44 15 51 13" fill="none" stroke="#A4D085" strokeWidth="1.5"/>
    <path d="M18 31 C23 20 51 20 55 34 C60 50 49 59 37 61 C20 59 12 44 18 31Z"
      fill="#A83C5E" stroke="#77314E" strokeWidth="2"/>
    <path d="M34 60 L36 67" stroke="#9B5361" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M25 35 Q33 29 44 33" stroke="#DA7F92" strokeWidth="2" fill="none"/>
  </g>;
}
function Rabanete() {
  return <g>
    <path d="M34 31 Q25 7 12 16 Q13 27 35 35 M37 30 Q41 9 57 15 Q58 26 38 35 M35 32 Q33 10 37 7"
      fill="#78B74B" stroke="#428643" strokeWidth="1.5"/>
    <path d="M35 61 Q35 66 30 69" stroke="#CCBC9C" strokeWidth="2" fill="none"/>
    <path d="M19 33 C23 22 48 22 54 36 C57 50 47 60 35 63 C22 59 14 46 19 33Z"
      fill="#EB6370" stroke="#BF3D57" strokeWidth="2"/>
    <path d="M24 51 Q33 64 44 55 Q36 63 35 63 Q28 62 24 51Z" fill="#F5F0D7" opacity=".9"/>
  </g>;
}
function Abobrinha() {
  return <g>
    <path d="M14 26 Q23 14 55 17 Q69 24 61 41 Q51 54 21 49 Q7 45 14 26Z"
      fill="#66A84D" stroke="#347447" strokeWidth="2"/>
    <path d="M16 27 Q28 23 55 25 M19 36 Q37 31 61 34 M22 44 Q39 41 55 42"
      fill="none" stroke="#B8D981" strokeWidth="2" opacity=".85"/>
    <path d="M14 30 Q6 25 7 20 Q15 15 19 24" fill="#5F8642" stroke="#347447" strokeWidth="2"/>
  </g>;
}
function Tomate() {
  return <g>
    <ellipse cx="36" cy="61" rx="25" ry="5" fill="#6E5128" opacity=".14"/>
    <circle cx="29" cy="40" r="18" fill="#EA543D" stroke="#AF3A2C" strokeWidth="2"/>
    <circle cx="47" cy="45" r="15" fill="#E95336" stroke="#AF3A2C" strokeWidth="2"/>
    <ellipse cx="24" cy="33" rx="5" ry="8" fill="#FA9C71" opacity=".5" transform="rotate(30 24 33)"/>
    <path d="M30 24 L22 17 L34 20 L40 13 L38 25 L50 24 L39 31 L36 39 L30 30 L20 32Z"
      fill="#4F9344" stroke="#327141" strokeWidth="1.6"/>
    <path d="M35 22 Q34 9 45 8" fill="none" stroke="#4C7741" strokeWidth="3" strokeLinecap="round"/>
  </g>;
}
function Cebolinha() {
  return <g>
    {[20,26,32,38,44,50].map((x,i)=>
      <path key={x} d={"M35 60 Q" + (x-6) + " 36 " + x + " " + (8+i%3*3)}
        stroke={i%2?"#4B8D43":"#78BB55"} strokeWidth="4" fill="none" strokeLinecap="round"/>)}
    <path d="M25 57 Q36 63 48 56" stroke="#C7A876" strokeWidth="4" fill="none"/>
  </g>;
}
function Salsa() {
  return <g>
    {[0,45,-45].map((deg,i)=><g key={i} transform={"rotate(" + deg + " 36 55)"}>
      <path d="M36 58 V22" stroke="#4E833C" strokeWidth="3"/>
      {[15,26,37].map(y=><g key={y}>
        <circle cx="29" cy={y} r="8" fill="#5A9C45"/><circle cx="42" cy={y-1} r="8" fill="#7CB951"/>
      </g>)}
    </g>)}
  </g>;
}
function Manjericao() {
  return <g><path d="M36 62 V29" stroke="#518343" strokeWidth="3"/>
    <Folha x={34} y={55} rot={-45} escala={.65}/>
    <Folha x={37} y={53} rot={45} escala={.65}/>
    <Folha x={36} y={44} rot={0} escala={.7} cor="#83BF5A"/>
  </g>;
}
function Pepino() {
  return <g>
    <ellipse cx="36" cy="59" rx="24" ry="5" fill="#325B35" opacity=".12"/>
    <path d="M14 42 Q11 26 25 23 L54 21 Q65 25 62 38 Q59 50 46 51 L25 53 Q17 52 14 42Z"
      fill="#467D3C" stroke="#285E35" strokeWidth="2"/>
    <path d="M23 28 Q40 24 54 27 M21 36 Q39 33 56 34 M23 44 Q39 41 52 43"
      fill="none" stroke="#79AE56" strokeWidth="1.7"/>
  </g>;
}
const variantes = {
  alface: Alface, rucula: Rucula, couve: Couve, cenoura: Cenoura,
  beterraba: Beterraba, rabanete: Rabanete, cebolinha: Cebolinha, salsa: Salsa,
  manjericao: Manjericao, tomate: Tomate, pepino: Pepino, abobrinha: Abobrinha,
  folha: Alface,
};
export default function IconeCultura({ nome, className = "", x, y, width, height }) {
  const Cultura = variantes[iconeDaCultura(nome)] ?? variantes.folha;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"
      x={x} y={y} width={width} height={height} className={className}
      aria-hidden="true" focusable="false">
      <Cultura />
    </svg>
  );
}
