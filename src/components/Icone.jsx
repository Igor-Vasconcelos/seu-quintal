const desenhos = {
  muda: <>
    <path d="M12 21v-8m0 3C5 16 3 12 2 7c6 0 10 2 10 9Z" fill="#70934b" />
    <path d="M12 13c0-7 4-10 10-10-1 6-4 10-10 10Z" fill="#4f8644" />
  </>,
  planta: <>
    <path d="M6 4h15l-4 16H2L6 4Z" />
    <path d="m11 4-4 16m9-16-4 16M4 12h15" />
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
    <path d="M4 21 9 3h6l5 18M12 4v3m0 4v3m0 4v3"/>
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
