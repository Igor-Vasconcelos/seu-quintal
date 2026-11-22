import Icone from "./Icone.jsx";

// Vitrines de entrada conectadas a páginas já publicadas.
// Tempo de leitura só será exibido quando houver metadados verificados.
const destaques = [
  {
    titulo: "Como montar uma horta em pequenos espaços",
    descricao: "Escolha plantas e organize sua horta conforme a luz e o espaço disponível.",
    imagem: "./imagens/horta.webp",
    destino: "./horta/",
    tema: "Horta",
    nivel: "Iniciante",
    icone: "horta",
    etiqueta: "Guia interativo",
  },
  {
    titulo: "Tanque de peixes no quintal: como começar",
    descricao: "Conheça os módulos do tanque e simule o espaço e o volume necessário.",
    imagem: "./imagens/sisteminha/tanque.webp",
    destino: "./sisteminha.html#tanque",
    tema: "Peixes",
    nivel: "Iniciante",
    icone: "peixe",
    etiqueta: "Guia prático",
  },
  {
    titulo: "Criação de codornas: ovos e corte",
    descricao: "Entenda o consumo, o espaço e os cuidados antes de planejar a criação.",
    imagem: "./imagens/codornas-fotoreal-v4.webp",
    destino: "./ferramentas/calculadora-codornas/",
    tema: "Codornas",
    nivel: "Planejamento",
    icone: "codorna",
    etiqueta: "Guia e calculadora",
  },
  {
    titulo: "Como planejar um pomar produtivo",
    descricao: "Compare o espaçamento e a área necessária para o crescimento das frutíferas.",
    // Fotografia real de árvores frutíferas distribuídas em fileiras (CC BY 2.0).
    imagem: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Orchard_Agriculture_%28A4%29_%284999168100%29.jpg/960px-Orchard_Agriculture_%28A4%29_%284999168100%29.jpg",
    imagemAlt: "Pomar real com árvores frutíferas organizadas em fileiras e espaço de circulação.",
    creditoFoto: "Hazel Gordon / USDA Forest Service",
    creditoUrl: "https://commons.wikimedia.org/wiki/File:Orchard_Agriculture_(A4)_(4999168100).jpg",
    licenca: "CC BY 2.0",
    licencaUrl: "https://creativecommons.org/licenses/by/2.0/",
    destino: "./ferramentas/planejador-de-pomar/",
    tema: "Pomar",
    nivel: "Iniciante",
    icone: "arvores",
    etiqueta: "Guia e planejador",
  },
];

export default function DestaquesEditorial() {
  return (
    <ul className="home-destaques-grade">
      {destaques.map((destaque) => (
        <li key={destaque.destino} className={destaque.creditoFoto ? "home-destaque-com-credito" : undefined}>
          <a className="home-destaque-card" href={destaque.destino}>
            <div className="home-destaque-imagem">
              <img src={destaque.imagem} width="792" height="528" loading="lazy" decoding="async"
                alt={destaque.imagemAlt || ""} referrerPolicy={destaque.creditoFoto ? "no-referrer" : undefined} />
              <span className="home-destaque-selo"><Icone nome="livro" /> {destaque.etiqueta}</span>
            </div>
            <div className="home-destaque-conteudo">
              <h3>{destaque.titulo}</h3>
              <p>{destaque.descricao}</p>
              <div className="home-destaque-rodape">
                <span><Icone nome={destaque.icone} /> {destaque.nivel}</span>
                <span className="home-destaque-seta" aria-label={"Abrir " + destaque.tema}><Icone nome="seta" /></span>
              </div>
            </div>
          </a>
          {destaque.creditoFoto && <p className="home-destaque-credito">
            Foto: <a href={destaque.creditoUrl} target="_blank" rel="noopener noreferrer">
              {destaque.creditoFoto}</a> · <a href={destaque.licencaUrl} target="_blank"
              rel="noopener noreferrer">{destaque.licenca}</a>. Imagem recortada para o card.
          </p>}
        </li>
      ))}
    </ul>
  );
}
