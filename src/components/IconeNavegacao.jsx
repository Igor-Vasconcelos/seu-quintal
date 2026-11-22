/* Ícones das barras de assuntos: família de linhas consistente (24x24).
 * SVG local sem imagens externas; mesmos traços em Home e Sisteminha. */
const desenhos = {
  grade: <>
    <rect x="3" y="3" width="7" height="7" rx="1.4" />
    <rect x="14" y="3" width="7" height="7" rx="1.4" />
    <rect x="3" y="14" width="7" height="7" rx="1.4" />
    <rect x="14" y="14" width="7" height="7" rx="1.4" />
  </>,
  horta: <>
    <path d="M12 21V11" />
    <path d="M12 13C7.2 13 4 10.3 4 5.5 9 5.6 12 8.7 12 13Z" />
    <path d="M12 11c0-4.8 3.1-7.2 8-7.4 0 4.7-3.2 7.4-8 7.4Z" />
    <path d="M4.5 21h15" />
  </>,
  peixe: <>
    <path d="M5.8 8.8C9.4 5.6 15.1 5.4 19 9l2.5 3-2.5 3c-3.9 3.6-9.6 3.4-13.2.2L2.5 18V6l3.3 2.8Z" />
    <circle cx="16.2" cy="10.8" r=".8" fill="currentColor" stroke="none" />
    <path d="M11 8c-1.8 2.7-1.8 5.3 0 8" />
  </>,
  galinha: <>
    <path d="M6.7 10.5C8.2 8.2 10 7 12.5 7c3.2 0 5.5 2 6.2 4.6l2.4 1.1-2.4 1.2c-.2 3.5-2.7 5.4-6.5 5.4H9.5C5.7 19.3 3.8 16.2 5 13c-1.8-.8-2.4-2.4-2-4.1 1.4 1.1 2.6 1.5 3.7 1.6Z" />
    <path d="M10.7 7c-.3-2 1-3 2.4-3 .9 0 1.4.5 1.6 1.1C16.5 4 18 5 18 7" />
    <path d="M9.2 19.3V22m5.4-2.7V22" />
    <circle cx="16.1" cy="10.6" r=".7" fill="currentColor" stroke="none" />
  </>,
  codorna: <>
    <path d="M5.5 15.7c-1.2-1.5-.9-4.2.7-5.3 1.4-1 3.2-.9 4.4-1.9C12.4 6.7 14 6 15.6 6c2.1 0 3.9 1.2 4.1 3l2 1.1-2.6 1c1 3-.4 5.7-3.8 7l-2 1.3h-3l-2-2.1c-1.2-.2-2.1-.7-2.8-1.6Z" />
    <path d="M9 14.5c2 1.3 4.4 1.6 6.1.3M9.2 19.3 8.4 22m6.1-3 .8 3" />
    <circle cx="16.9" cy="9.4" r=".7" fill="currentColor" stroke="none" />
    <path d="M11 11.3h.01m2 .6h.01m-1 1.8h.01" strokeWidth="2.2" />
  </>,
  arvores: <>
    <path d="M8 22v-7m9 7v-6M3 22h18" />
    <path d="M7.5 3C4.8 3 3.5 5.4 4 7c-2 1.3-2.1 4 .1 5.2-1 3.6 3 5.4 5.4 3.3 3.6.7 5.5-2.4 4-5.2 1.7-2.5.1-4.8-2.1-5.2C11.5 4.4 9.6 3 7.5 3Z" />
    <path d="M17 6c-2.7 0-4.1 2.4-3.5 4.2-2.1 2.2-.9 4.6 1.1 4.9 1 2.7 5.9 3.1 6.8-.4 2.9-1.2 3.4-4.6 1.1-5.5-.1-2.1-1.7-3.2-3.5-3.2Z" />
  </>,
  recycle: <>
    <path d="m8.3 3.7 1.8-2 4.6 0 3.1 5.7m-2.7-.4 3.3 1 1-3.5" />
    <path d="m20.9 10 1.7 3.9-2.8 4.7h-6.1m2.1-2.2-2.5 2.4 2.6 2.5" />
    <path d="m11.9 20.6-4.2 1.1-4.1-2.4-.8-5.3m2.5 2.1-1.2-3.3-3.4 1.2" />
  </>,
  irrigacao: <>
    <path d="M12 2.6C8.8 7.2 6 10.8 6 14a6 6 0 0 0 12 0c0-3.2-2.8-6.8-6-11.4Z" />
    <path d="M10 16.4c.7.8 1.6 1.2 2.8 1.2" />
    <path d="M18.8 4.5v2.2m-1.1-1.1h2.2" />
  </>,
  planejamento: <>
    <rect x="3" y="3" width="18" height="18" rx="1.8" />
    <path d="M9 3v18m6-18v18M3 9h18M3 15h18" />
    <path d="m15.8 10.8 1 1 1.7-2" />
  </>,
  sisteminha: <>
    <path d="m2.5 11 9.5-8 9.5 8M5 10.5v10h14v-10M9 20.5v-8h6v8" />
    <path d="M12 10.6c-1.5-1.1-1.6-2.1-1.3-3.3 1.5.1 2.3.9 2.5 2.5M12.8 10.6c.1-1.9 1.6-3 3.1-3.2-.1 1.7-1.1 2.8-3.1 3.2Z" />
  </>,
  pequenos: <>
    <path d="M5 14h14l-1.6 7H6.6L5 14ZM12 14V7" />
    <path d="M12 10C7.6 10 6 7.8 6 4c3.8 0 6 2.2 6 6Zm0-1c0-3.8 2.2-5.8 6-5.8C18 7 16.2 9 12 9Z" />
  </>,
  ciclo: <>
    <path d="M20 7.5a8.5 8.5 0 0 0-14.4-2.1L3.5 8m0-5v5h5" />
    <path d="M4 16.5a8.5 8.5 0 0 0 14.4 2.1l2.1-2.6m0 5v-5h-5" />
  </>,
  minhoca: <>
    <path d="M2.5 16.5c0-4.1 3-7 6.3-7 3.2 0 3.8 4.1 1.5 5.3-2.5 1.4-1.1 4.3 2.1 4.3 4.9 0 4.5-9.1 9.1-13.6" />
    <path d="m4.5 12.5 2.8 2m-.4-6 1.9 2.5m5.9 7.3 2.7-1.2m-.1-5.4 3.1 1" />
  </>,
  rede: <>
    <circle cx="12" cy="4" r="2.2" />
    <circle cx="4.5" cy="19" r="2.2" />
    <circle cx="19.5" cy="19" r="2.2" />
    <path d="m11.1 6-5.5 10.8m7.3-10.8 5.5 10.8M6.8 19h10.4" />
  </>,
  livro: <>
    <path d="M12 6.5v14m0-14C9.8 4.6 6.4 4 2.8 5v14c3.6-1 7-.4 9.2 1.5 2.2-1.9 5.6-2.5 9.2-1.5V5c-3.6-1-7-.4-9.2 1.5Z" />
  </>,
};

export default function IconeNavegacao({ nome }) {
  return (
    <svg className="icone icone-navegacao" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" focusable="false">
      {desenhos[nome] ?? desenhos.grade}
    </svg>
  );
}
