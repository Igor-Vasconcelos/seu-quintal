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
  fechar: <path d="m6 6 12 12M18 6 6 18" />,
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
