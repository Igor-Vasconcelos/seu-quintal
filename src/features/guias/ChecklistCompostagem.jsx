import { useState } from "react";

const categorias = {
  pode: "Pode colocar",
  cuidado: "Use com cuidado",
  evite: "Deixe de fora",
};

const materiais = [
  { nome: "Cascas e aparas de frutas e legumes", tipo: "pode", exemplos: "Banana, maçã, cenoura e talos. Pique e cubra com folhas secas. Consulte abaixo as orientações para cítricos." },
  { nome: "Folhas secas e palha", tipo: "pode", exemplos: "Use como material seco para cobrir os restos frescos." },
  { nome: "Borra de café", tipo: "pode", exemplos: "Misture em pequenas porções com os demais resíduos e o material seco." },
  { nome: "Cascas de ovo", tipo: "pode", exemplos: "Deixe secar e triture. Pedaços grandes demoram mais a se decompor." },
  { nome: "Papelão pardo sem revestimento", tipo: "pode", exemplos: "Tire a fita adesiva e rasgue em pedaços. Use como parte do material seco." },
  {
    nome: "Cascas cítricas",
    tipo: "cuidado",
    exemplos: "Laranja, limão e mexerica. Coloque pouco de cada vez, picado e misturado com outros resíduos.",
    minhocario: { tipo: "evite", exemplos: "Evite cascas de laranja, limão e mexerica em minhocários domésticos." },
  },
  { nome: "Aparas de grama fresca", tipo: "cuidado", exemplos: "Use em camadas finas, misturadas com folhas secas para evitar compactação." },
  { nome: "Carne, peixe, ossos e laticínios", tipo: "evite", exemplos: "Carne crua ou cozida, queijo, leite e iogurte podem atrair animais e gerar mau cheiro." },
  { nome: "Óleo, gordura e comida temperada", tipo: "evite", exemplos: "Separe óleo de cozinha, frituras e sobras com molho ou temperos." },
  { nome: "Fezes de animais domésticos", tipo: "evite", exemplos: "Separe fezes de gato e cachorro dos resíduos destinados ao adubo da horta." },
  { nome: "Plástico, vidro e metal", tipo: "evite", exemplos: "Embalagens, etiquetas e latas seguem para descarte ou reciclagem conforme a coleta local." },
];

const fotos = [
  {
    arquivo: "compostagem-cascas.webp",
    largura: 480,
    alt: "Pedaços de cascas e folhas sendo adicionados à terra",
    autor: "Ferik80",
    url: "https://commons.wikimedia.org/wiki/File:Adicionando_res%C3%ADduos_de_frutas_e_legumes_na_terra_para_compostagem.jpg",
  },
  {
    arquivo: "compostagem-residuos.webp",
    largura: 640,
    alt: "Cascas de frutas e de ovos visíveis na superfície de uma composteira",
    autor: "Niwrat",
    url: "https://commons.wikimedia.org/wiki/File:Close_up_view_of_compost.jpg",
  },
];

const normalizar = (texto) => texto.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

export default function ChecklistCompostagem({ raiz }) {
  const [modelo, definirModelo] = useState("sem-minhocas");
  const [consulta, definirConsulta] = useState("");
  const [filtro, definirFiltro] = useState("");
  const termos = normalizar(consulta.trim()).split(/\s+/);
  const visiveis = materiais
    .map(({ minhocario, ...material }) => ({
      ...material,
      ...(modelo === "minhocario" ? minhocario : null),
    }))
    .filter(({ tipo, nome, exemplos }) => {
      const texto = normalizar(`${nome} ${exemplos}`);
      return (!filtro || tipo === filtro) && termos.every((termo) => texto.includes(termo));
    });

  return (
    <div className="guia-interativo">
      <h2>O que pode entrar na composteira?</h2>
      <div className="campos-guia campos-guia-duplo">
        <label className="campo">Tipo de composteira
          <select value={modelo} onChange={(evento) => definirModelo(evento.target.value)}>
            <option value="sem-minhocas">Doméstica sem minhocas</option>
            <option value="minhocario">Minhocário doméstico</option>
          </select>
        </label>
        <label className="campo">Mostrar
          <select value={filtro} onChange={(evento) => definirFiltro(evento.target.value)}>
            <option value="">Todas as categorias</option>
            {Object.entries(categorias).map(([id, rotulo]) => <option key={id} value={id}>{rotulo}</option>)}
          </select>
        </label>
      </div>
      <label className="campo">Buscar material
        <input type="search" placeholder="Ex.: café, casca, óleo" value={consulta}
          onChange={(evento) => definirConsulta(evento.target.value)} />
      </label>
      <p className="nota" role="status">
        {visiveis.length ? `${visiveis.length} ${visiveis.length === 1 ? "material encontrado" : "materiais encontrados"}` : "Nenhum material encontrado. Tente outro termo ou categoria."}
      </p>
      {visiveis.length > 0 && <ul className="lista-materiais">
        {visiveis.map(({ nome, tipo, exemplos }) => (
          <li key={nome}>
            <div><strong>{nome}</strong> <span className={`etiqueta-material ${tipo}`}>{categorias[tipo]}</span></div>
            <p>{exemplos}</p>
          </li>
        ))}
      </ul>}
      <div className="fotos-compostagem">
        {fotos.map(({ arquivo, largura, alt, autor, url }) => (
          <figure key={arquivo}>
            <img src={`${raiz}imagens/${arquivo}`} alt={alt} width={largura} height="640" loading="lazy" />
            <figcaption>
              <a href={url} target="_blank" rel="noreferrer">{autor} · Wikimedia Commons</a>
              {" · "}<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>
              {" · Foto redimensionada, recortada na exibição e convertida para WebP."}
            </figcaption>
          </figure>
        ))}
      </div>
      <a className="link-fonte" href="https://www.ufpb.br/cga/wp-content/uploads/sites/79/sites/365/2025/09/manual-de-compostagem.pdf" target="_blank" rel="noreferrer">
        Manual de compostagem doméstica · UFPB
      </a>
    </div>
  );
}
