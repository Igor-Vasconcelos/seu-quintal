import { useEffect, useId, useRef, useState } from "react";
import Icone from "./Icone.jsx";
import "../styles/site-shell.css";

const grupos = [
  {
    id: "guias", rotulo: "Guias", itens: [
      { titulo: "Horta e jardim", rota: "horta/", paginas: ["horta"] },
      { titulo: "Guias práticos", rota: "guias/", paginas: ["guias", "compostagem", "irrigacao"] },
      { titulo: "Artigos e dicas", rota: "artigos/", paginas: ["artigos"] },
    ],
  },
  {
    id: "ferramentas", rotulo: "Ferramentas", itens: [
      { titulo: "Planejar o terreno", rota: "meu-quintal/#terreno" },
      { titulo: "Planejador de canteiros", rota: "horta/canteiros/", paginas: ["canteiros"] },
      { titulo: "Organizador da horta", rota: "horta/organizador/", paginas: ["organizador"] },
      { titulo: "Calendário de plantio", rota: "horta/calendario-de-plantio/", paginas: ["calendario"] },
      { titulo: "Calculadora de peixes", rota: "ferramentas/calculadora-peixes/", paginas: ["peixes"] },
      { titulo: "Calculadora de codornas", rota: "ferramentas/calculadora-codornas/", paginas: ["codornas"] },
      { titulo: "Planejador de pomar", rota: "ferramentas/planejador-de-pomar/", paginas: ["pomar"] },
    ],
  },
];

export default function Cabecalho({ sisteminha = false, raiz = "./", pagina }) {
  const [aberto, definirAberto] = useState(false);
  const menuRef = useRef(null);
  const botaoMenu = useRef(null);
  const idMenu = useId();
  const naHome = pagina === "inicio";
  const noPainel = pagina === "meu-quintal";
  const inicio = naHome ? "#inicio" : raiz;

  function fecharSubmenus() {
    menuRef.current?.querySelectorAll("details[open]").forEach(item => { item.open = false; });
  }

  function fecharMenu() {
    definirAberto(false);
    fecharSubmenus();
  }

  useEffect(() => {
    function aoClicarFora(evento) {
      if (!menuRef.current?.contains(evento.target) && !botaoMenu.current?.contains(evento.target)) {
        fecharSubmenus();
      }
    }
    document.addEventListener("pointerdown", aoClicarFora);
    return () => document.removeEventListener("pointerdown", aoClicarFora);
  }, []);

  function tratarTecla(evento) {
    if (evento.key !== "Escape") return;
    const submenu = evento.target.closest("details[open]");
    if (submenu) {
      submenu.open = false;
      submenu.querySelector("summary")?.focus();
    } else if (aberto) {
      definirAberto(false);
      botaoMenu.current?.focus();
    }
  }

  function abrirGrupo(evento) {
    if (!evento.currentTarget.open) return;
    menuRef.current?.querySelectorAll("details[open]").forEach(detalhe => {
      if (detalhe !== evento.currentTarget) detalhe.open = false;
    });
  }

  return (
    <header className="topo site-shell" onKeyDown={tratarTecla}>
      <div className="topo-miolo">
        <a href={inicio} className="marca site-marca" aria-label="Seu Quintal, voltar ao início">
          <span className="marca-simbolo"><Icone nome="muda"/></span>
          <span className="site-marca-texto">
            <strong>Seu Quintal</strong>
            <small>Da primeira muda ao seu sítio.</small>
          </span>
        </a>

        <button ref={botaoMenu} className="menu-alternar" type="button" aria-expanded={aberto}
          aria-controls={idMenu} onClick={() => definirAberto(!aberto)}>
          <Icone nome={aberto ? "fechar" : "menu"}/>
          <span>{aberto ? "Fechar" : "Menu"}</span>
        </button>

        <nav ref={menuRef} className={aberto ? "menu menu-aberto" : "menu"} id={idMenu}
          aria-label="Menu principal"
          onClick={evento => {
            if (evento.target.closest("a")) {
              fecharMenu();
            }
          }}>
          <div className="menu-links">
            <a href={inicio} aria-current={naHome ? "page" : undefined}>Início</a>
            {grupos.map(grupo => {
              const selecionado = grupo.itens.some(item => item.paginas?.includes(pagina));
              return (
                <details key={grupo.id} className="site-menu-grupo"
                  data-secao-atual={selecionado ? "" : undefined}
                  onToggle={abrirGrupo}>
                  <summary aria-label={"Abrir opções de " + grupo.rotulo}>
                    {grupo.rotulo} <Icone nome="chevron-baixo"/>
                  </summary>
                  <div className="site-menu-submenu">
                    {grupo.itens.map(item => (
                      <a key={item.rota} href={raiz + item.rota}
                        aria-current={item.paginas?.includes(pagina) ? "page" : undefined}>
                        {item.titulo}
                      </a>
                    ))}
                  </div>
                </details>
              );
            })}
            <a className="site-menu-sisteminha" href={sisteminha ? "#inicio" : raiz + "sisteminha.html"}
              aria-current={sisteminha ? "page" : undefined}>Sisteminha Embrapa</a>
          </div>
          <a className="botao menu-quintal"
            href={noPainel ? "#terreno" : raiz + "meu-quintal/"}
            aria-current={noPainel ? "page" : undefined}>
            <Icone nome="planta"/> Meu Quintal
          </a>
        </nav>
      </div>
    </header>
  );
}
