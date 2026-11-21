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
