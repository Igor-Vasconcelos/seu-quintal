const desenhos = {
  muda: <>
    <path d="M12 21v-8m0 3C5 16 3 12 2 7c6 0 10 2 10 9Z" fill="#70934b" />
    <path d="M12 13c0-7 4-10 10-10-1 6-4 10-10 10Z" fill="#4f8644" />
  </>,
  planta: <>
    <path d="M6 4h15l-4 16H2L6 4Z" />
    <path d="m11 4-4 16m9-16-4 16M4 12h15" />
  </>,
  // Meu Quintal: miniatura de uma chácara com casa, muda, canteiros e caminho.
  // Distinto de "planta", que permanece como grade técnica do planejador.
  // Simplificado no viewBox 24×24 para permanecer legível no botão da navbar.
  "meu-quintal": <>
    <path d="m8.5 9.2 4-3.1 4 3.1" />
    <path d="M9.5 9.2v5.5h6V9.2M11.5 14.7v-3.6h2v3.6" />
    <rect x="14.15" y="11.1" width="1.1" height="1.1" rx=".15" fill="currentColor" stroke="none" />
    <path d="M3 20.5 5.2 14.7H9m6.5 0h3.1l2.4 5.8H3Z" />
    <path d="M11.5 20.5c-.5-1.7.2-3.4 1.8-5.8" />
    <path d="M6.7 18.8v-4" />
    <path d="M6.7 16.5c-2.1-.2-2.9-1.4-3-2.8 1.8.1 2.9 1.2 3 2.8Z" />
    <path d="M6.7 16c.3-1.9 1.1-2.9 2.8-3-.1 1.6-1.1 2.9-2.8 3Z" />
    <path d="M15.8 17.5h2.8m-3 2h3.6m-3.1-2v-1m1.3 1v-1m-.4 3v-1" />
  </>,
  livro: <>
    <path d="M12 6v14m0-14C9 4 6 4 2 5v14c4-1 7-1 10 1 3-2 6-2 10-1V5c-4-1-7-1-10 1Z" />
  </>,
  calendario: <>
    <rect x="3.5" y="5" width="17" height="16" rx="2" />
    <path d="M7.5 3v4m9-4v4M3.5 10h17m-13 5h2m5 0h2" />
  </>,
  historico: <>
    <path d="M8 4H5v17h14V4h-3M8 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2H8V4Zm0 7h8m-8 5h8" />
  </>,
  "chevron-baixo": <path d="m6 9 6 6 6-6" />,
  ciclo: <>
    <path d="M20 7a8 8 0 0 0-13-2L4 8m0-5v5h5"/>
    <path d="M4 17a8 8 0 0 0 13 2l3-3m0 5v-5h-5"/>
  </>,
  peixe: <>
    <path d="M20 12c-4.5 6.5-12 6.5-16 0 4-6.5 11.5-6.5 16 0z"/>
    <path d="m4 12-2-4v8z"/><circle cx="16" cy="10" r=".8" fill="currentColor" stroke="none"/>
  </>,
  galinha: <>
    <path d="M5 16c-2-2-2-6 1-8 2-1 3 0 4 0a5 5 0 0 1 9 1l2 2-3 2v4c-4 4-10 4-13-1Z"/>
    <path d="M11 7c0-3 2-3 2-3s1-2 3 0"/><path d="m10 20-1 2m6-2 1 2"/>
  </>,
  recycle: <>
    <path d="m7 7 2-4h5l3 5m-3-1h4l-1-4"/>
    <path d="m18 12 4 2-2 5h-7m3-3-3 3 4 3"/>
    <path d="M10 19H4l-2-5 3-5m0-4v4H1"/>
  </>,
  minhoca: <path d="M3 16c1-7 5-11 9-8s-4 8 1 10 7-6 9-11M5 13l4 1m-2-5 4 1m6 9 3-2"/>,
  rede: <>
    <circle cx="12" cy="4" r="2"/><circle cx="4" cy="19" r="2"/><circle cx="20" cy="19" r="2"/>
    <path d="M11 6 5 17m8-11 6 11M6 19h12"/>
  </>,
  codorna: <>
    <path d="M5 17c-2-2-1-6 2-7 2-1 4-1 5-3 2-2 5-1 6 1l2 2-3 1c2 3 0 6-3 7l-2 2h-3l-2-3Z"/>
    <path d="M5 15c-2-1-2-4-1-5m7 6 3-2M9 19l-1 3m6-4 1 4"/><circle cx="16" cy="8" r=".75" fill="currentColor" stroke="none"/>
  </>,
  ovos: <>
    <path d="M4 16c0-4 2-9 5-9s5 5 5 9a5 5 0 0 1-10 0Z"/>
    <path d="M12 14c0-4 2-9 5-9s5 5 5 9a5 5 0 0 1-10 0Z"/>
  </>,
  casa: <>
    <path d="m2 11 10-8 10 8M5 10v11h14V10M9 21v-8h6v8"/>
  </>,
  caminho: <>
    <path d="M5 21c.5-4.5 4-7.3 4-11.4C9 6.5 7.4 4.7 7 3"/>
    <path d="M19 21c-.5-4.5-4-7.3-4-11.4 0-3.1 1.6-4.9 2-6.6"/>
    <path d="M12 20v-2m0-4v-2m0-4V6"/>
  </>,
  manobra: <>
    <path d="M5 18a8 8 0 1 1 14-5M4 13l1 5 5-2"/>
    <rect x="8" y="9" width="8" height="5" rx="1"/><circle cx="10" cy="14" r="1"/><circle cx="14" cy="14" r="1"/>
  </>,
  arvores: <>
    <path d="M7 20v-7m10 7v-7"/>
    <path d="M7 3C4 3 2 7 4 9c-3 4 0 7 4 6 5 1 6-5 3-7 1-3-1-5-4-5Zm10 0c-3 0-5 4-3 6-3 3-2 6 2 7 4 1 7-4 5-7 1-3-1-6-4-6Z"/>
    <path d="M3 21h18"/>
  </>,
  horta: <>
    <path d="M3 20h18M7 20V9m5 11V7m5 13V10"/>
    <path d="M7 12C2 12 2 7 3 6c4 0 5 3 4 6Zm5-2c-4-1-4-5-3-6 4-1 5 3 3 6Zm5 4c4-1 5-5 4-6-4 0-5 3-4 6Z"/>
  </>,
  canteiro: <>
    <path d="M2 10 12 6l10 4v10l-10 3L2 20V10Z" /><path d="m2 13 10 4 10-4m-10-7v11"/>
    <path d="M8 9V4m0 4L5 6m3 2 3-2M16 10V4m0 5-3-3m3 3 3-3"/>
  </>,
  tanque: <>
    <ellipse cx="12" cy="8" rx="9" ry="4"/><path d="M3 8v10c0 5 18 5 18 0V8M3 13c5 4 13 4 18 0"/>
    <path d="m8 16 4-2 3 2-3 2-4-2Z"/>
  </>,
  porco: <>
    <path d="m4 9-2-3 4-2 3 2a11 11 0 0 1 9 1l3-3 1 5-2 2c1 7-3 10-9 10C5 21 2 17 4 9Z"/>
    <ellipse cx="12" cy="15" rx="4" ry="2.6"/><path d="M11 15v.7m2-1.4v1.4"/>
    <circle cx="8" cy="11" r=".75" fill="currentColor" stroke="none"/>
  </>,
  composteira: <>
    <path d="M4 9h16v12H4zM3 9l9-6 9 6M7 12h10m-10 4h10"/>
    <path d="M12 7c-2-3-5-1-4 1 2 1 4 1 4-1Zm0 0c0-2 3-4 5-3 0 2-2 4-5 3Z"/>
  </>,
  fogueira: <>
    <path d="m4 21 16-5M4 16l16 5"/>
    <path d="M12 16c-6-1-6-6-3-10 1 3 3 2 3-4 6 6 9 10 4 14-2 2-6 1-7-1"/>
    <path d="M12 15c-2-2 0-5 2-6 3 5 1 7-2 6Z"/>
  </>,
  galpao: <>
    <path d="m2 8 10-5 10 5v13H2V8ZM2 8h20M7 21V11h10v10m-10-5h10"/>
  </>,
  fileiras: <>
    <path d="M3 8c5-3 13-3 18 0M3 13c5-3 13-3 18 0M3 18c5-3 13-3 18 0"/>
    <path d="M7 10V4m0 5L4 7m3 1 3-2M15 15V9m0 5-3-3m3 3 3-3"/>
  </>,
  outros: <>
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 18h7m-3-4v7"/>
  </>,
  // Ícones de estruturas: mesmo viewBox 24 × 24 e traço do sistema visual.
  viveiro: <>
    <path d="M3 20V9l9-6 9 6v11H3Z"/>
    <path d="M12 3v17M3 10h18"/>
    <path d="M7 20v-6m0 3c-2-1-2-3-2-3 2 0 2 1 2 3Zm0 0c2-1 2-3 2-3-2 0-2 1-2 3Z"/>
    <path d="M17 20v-6m0 3c-2-1-2-3-2-3 2 0 2 1 2 3Zm0 0c2-1 2-3 2-3-2 0-2 1-2 3Z"/>
  </>,
  deposito: <>
    <path d="m3 9 9-6 9 6v12H3V9Z"/>
    <path d="M7 21V11h10v10M7 14h10M7 17h10"/>
  </>,
  estufa: <>
    <path d="M2 21V11L7 4h10l5 7v10H2Z"/>
    <path d="M7 4v17m10-17v17M2 11h20M12 11v10"/>
    <path d="M10 18h4m-2 2v-5"/>
  </>,
  minhocario: <>
    <path d="M4 10h16l-1 11H5L4 10ZM3 7h18v3H3V7Z"/>
    <path d="M7 15c2-3 3 2 5-1s4 1 5-1"/>
    <circle cx="7" cy="14.5" r=".65" fill="currentColor" stroke="none"/>
    <path d="M9 18h6"/>
  </>,
  biodigestor: <>
    <path d="M4 20v-8a8 8 0 0 1 16 0v8H4Z"/>
    <path d="M3 20h18M12 4V2m0 0h5m0 0v5"/>
    <path d="M7 15h10M10 18h4"/>
  </>,
  gota: <>
    <path d="M12 2c2 4 7 9 7 13a7 7 0 0 1-14 0c0-4 5-9 7-13Z"/>
    <path d="M8 16a4 4 0 0 0 4 3"/>
  </>,
  caixaagua: <>
    <ellipse cx="12" cy="6" rx="8" ry="3"/>
    <path d="M4 6v13c0 4 16 4 16 0V6M4 14c5 3 11 3 16 0"/>
    <path d="M8 20v2m8-2v2"/>
  </>,
  cisterna: <>
    <path d="M3 9h18v12H3V9ZM2 9h20"/>
    <path d="M8 9V5a4 4 0 0 1 8 0v4M5 15c3-2 5 2 8 0s4-2 6-1"/>
    <path d="M12 2v3"/>
  </>,
  portao: <>
    <path d="M3 21V5h18v16M3 9l9-5 9 5"/>
    <path d="M12 8v13M5 11h5v10H5V11Zm9 0h5v10h-5V11Z"/>
    <path d="M10 16h1m2 0h1"/>
  </>,
  patio: <>
    <rect x="3" y="5" width="18" height="15" rx="1.5"/>
    <path d="M9 5v15m6-15v15M3 12.5h18"/>
    <path d="M6 3h12"/>
  </>,
  pergolado: <>
    <path d="M3 9h18M5 9v12m14-12v12M3 5h18"/>
    <path d="M7 3v6m5-6v6m5-6v6M8 17h8M9 17v4m6-4v4"/>
  </>,
  redario: <>
    <path d="M4 3v18M20 3v18M4 8c5 8 11 8 16 0"/>
    <path d="M7 9c3 4 7 4 10 0M4 8l3-1m13 1-3-1"/>
    <path d="M2 21h5m10 0h5"/>
  </>,
  piscina: <>
    <rect x="3" y="5" width="18" height="15" rx="3"/>
    <path d="M6 12c2-2 4 2 6 0s4-2 6 0M6 16c2-2 4 2 6 0s4-2 6 0"/>
    <path d="M7 5V2m4 3V2M7 8h4"/>
  </>,
  quadra: <>
    <rect x="2" y="4" width="20" height="16" rx="1.5"/>
    <path d="M12 4v16M2 9h4v6H2m20-6h-4v6h4"/>
    <circle cx="12" cy="12" r="3"/>
  </>,
  // Navegação do Meu Quintal: linguagem única de traço 24×24 e símbolos por função.
  // Não substituir os ícones técnicos do catálogo de estruturas, usados nos mapas.
  "visao-quintal": <>
    <path d="m2.5 11 9.5-7.5 9.5 7.5"/>
    <path d="M5.5 10.5V20h13V10.5M9 20v-5h4v5"/>
    <path d="M16 18v-5m0 2c-2-1-3-3-3-4 3 0 3 2 3 4Zm0 1c1-2 3-3 4-3 0 2-2 3-4 3Z"/>
  </>,
  "terrenos-menu": <>
    <rect x="2.75" y="4" width="18.5" height="16" rx="2"/>
    <path d="M2.75 13h7M10 4v7M10 13c3 0 5 3 5 7"/>
    <path d="M16.5 13v-4m0 2c-2-1-2-3-2-3 2 0 2 1 2 3Zm0 0c2-1 2-3 2-3-2 0-2 1-2 3Z"/>
  </>,
  "canteiros-menu": <>
    <rect x="3" y="8" width="18" height="13" rx="2"/>
    <path d="M3 15h18M8 21v-7m8 7v-7"/>
    <path d="M8 15c-3-1-4-3-4-5 3 0 4 2 4 5Zm0 0c0-3 2-5 4-5 0 3-1 4-4 5Z"/>
    <path d="M16 15c-3-1-4-3-4-5 3 0 4 2 4 5Zm0 0c0-3 2-5 4-5 0 3-1 4-4 5Z"/>
  </>,
  "agenda-menu": <>
    <rect x="3" y="5" width="18" height="16" rx="2"/>
    <path d="M7 3v4m10-4v4M3 10h18M8.5 15l2.5 2.5 4.5-5"/>
  </>,
  "historico-menu": <>
    <path d="M4 8a8.5 8.5 0 1 1-.5 7"/>
    <path d="M4 3v5h5M12 7.5v5l3 1.8"/>
  </>,
  "dados-locais": <>
    <rect x="3" y="5" width="18" height="14" rx="2"/>
    <path d="M3 13h18M7 16h.01M11 16h6"/>
  </>,
  "backup-menu": <>
    <path d="M5 3h10l4 4v13H5V3ZM15 3v5h4"/>
    <path d="M12 10v7m-3-3 3 3 3-3"/>
  </>,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  fechar: <path d="m6 6 12 12M18 6 6 18" />,
  novaAba: <path d="M13 5h6v6m0-6-8 8m6 0v6H5V7h6" />,
  seta: <path d="M4 12h15m-6-6 6 6-6 6" />,
};

export default function Icone({ nome }) {
  return (
    <svg className="icone" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {desenhos[nome]}
    </svg>
  );
}
