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
