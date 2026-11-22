import Icone from "../../components/Icone.jsx";
import { guiaAnimais } from "../../data/guias.js";
import CalculadoraGalinheiro from "./CalculadoraGalinheiro.jsx";
import { referenciaCorte, referenciaPostura } from "./estimativa.js";

const fonteAgua = "https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/1112245/1/ProducaoAnimalRecursosHidricos.pdf";
const fonteSanidade = "https://www.gov.br/agricultura/pt-br/assuntos/sanidade-animal-e-vegetal/saude-animal/programas-de-saude-animal/pnsa/influenza-aviaria";
const numero = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });

function ConsumoGalinheiro() {
  const [racaoMin, racaoMax] = referenciaPostura.racaoGramasDia;
  const [aguaMin, aguaMax] = referenciaCorte.aguaMililitrosDia;
  const dias = referenciaCorte.diasPadrao;
  const racaoCorte = referenciaCorte.ciclos[dias].racaoGramas / 1000;

  return (
    <section className="galinheiro-secao" id="consumo-galinheiro" tabIndex={-1} aria-labelledby="titulo-consumo-galinheiro">
      <h4 id="titulo-consumo-galinheiro">Consumo de ração e água</h4>
      <div className="galinheiro-cartoes">
        <div className="galinheiro-cartao">
          <h5>Poedeiras em produção</h5>
          <dl className="galinheiro-medidas">
            <div><dt>Ração por ave por dia</dt><dd>{racaoMin} a {racaoMax} g</dd></div>
            <div><dt>Água por ave por dia</dt><dd>Cerca de {referenciaPostura.aguaMililitrosDia} mL</dd></div>
          </dl>
          <p>Ofereça ração completa de postura às aves em produção. Pintinhas e frangas ainda em crescimento
            precisam da ração indicada para a sua fase. <a href={referenciaPostura.fonte}>Guia da poedeira Embrapa 051</a>.</p>
        </div>
        <div className="galinheiro-cartao">
          <h5>Frangos de corte</h5>
          <dl className="galinheiro-medidas">
            <div><dt>Ração por ave até {dias} dias</dt><dd>Cerca de {numero.format(racaoCorte)} kg</dd></div>
            <div><dt>Água por ave por dia</dt><dd>{aguaMin} a {aguaMax} mL</dd></div>
          </dl>
          <p>A referência de ração usa o frango colonial em semiconfinamento. Escolha a ração para a idade
            do lote e acompanhe o consumo conforme as aves crescem. <a href={referenciaCorte.fonte}>
              Guia do frango colonial Embrapa 041</a>.</p>
        </div>
      </div>
      <p className="galinheiro-dica">Mantenha água potável e fresca à vontade, com bebedouros à sombra.
        O consumo muda com o tamanho das aves e aumenta no calor. Reserve água separada para a limpeza dos
        equipamentos. <a href={fonteAgua}>Referências de consumo de água</a>.</p>
    </section>
  );
}

function CuidadosGalinheiro() {
  return (
    <section className="galinheiro-secao" id="cuidados-galinheiro" tabIndex={-1} aria-labelledby="titulo-cuidados-galinheiro">
      <h4 id="titulo-cuidados-galinheiro">Cuidados com as galinhas</h4>
      <div className="galinheiro-cartoes">
        <div className="galinheiro-cartao">
          <h5>Abrigo, ninhos e piquete</h5>
          <p>Escolha um local bem drenado, ventilado e com sombra. Proteja o abrigo com tela e fechamento
            seguro contra predadores. Para as poedeiras, prepare ninhos com forração seca e poleiros firmes.
            O rodízio de piquetes dá tempo para a vegetação se recuperar.</p>
        </div>
        <div className="galinheiro-cartao">
          <h5>Rotina diária</h5>
          <p>Reponha a água, higienize os bebedouros, retire partes molhadas da cama e recolha os ovos todos
            os dias. Guarde a ração em local seco e protegido de roedores. Galinhas botam ovos mesmo sem galo.
            O galo é necessário para obter ovos férteis e produzir pintinhos.</p>
        </div>
        <div className="galinheiro-cartao">
          <h5>Pintinhos e troca de lote</h5>
          <p>Prepare o abrigo aquecido antes da chegada dos pintinhos e siga o manejo da linhagem.
            Na troca de lotes de corte, reserve tempo para higienizar o abrigo e os equipamentos e manter
            a instalação vazia antes de receber novas aves. <a href={referenciaCorte.fonteIntervalo}>
              Orientações de limpeza e descanso do galinheiro</a>.</p>
        </div>
        <div className="galinheiro-cartao galinheiro-sanidade">
          <h5>Prevenção e sinais de alerta</h5>
          <p>Proteja a água e a ração do contato com aves silvestres. Converse com um médico-veterinário sobre
            a vacinação. Se várias aves morrerem de repente ou apresentarem dificuldade para respirar ou falta de
            coordenação, avise imediatamente o Serviço Veterinário Oficial. <a href={fonteSanidade}>Orientações e notificação do MAPA</a>.</p>
        </div>
      </div>
      <a className="sisteminha-voltar" href={guiaAnimais.url}>{guiaAnimais.fonte}</a>
    </section>
  );
}

export default function Galinheiro({ modulo }) {
  return (
    <article className="sisteminha-detalhe sisteminha-galinheiro" id="galinheiro" tabIndex={-1}
      aria-labelledby="titulo-galinheiro">
      <div className="galinheiro-abertura">
        <header className="galinheiro-intro">
          <a className="sisteminha-voltar sisteminha-link-ciclo" href="#ciclo">
            <Icone nome="seta" /> Voltar ao ciclo
          </a>
          <h3 id="titulo-galinheiro">{modulo.titulo}</h3>
          <p>Planeje a criação para ovos, carne ou os dois e veja como cuidar das aves no dia a dia.</p>
          <div className="galinheiro-acoes">
            <a className="botao" href="#calculadora-galinheiro">Usar calculadora <Icone nome="seta" /></a>
            <a className="home-link" href="#consumo-galinheiro">Consumo e cuidados</a>
            <a className="home-link" href="./ferramentas/calculadora-codornas/">
              <Icone nome="codorna"/> Planejar codornas
            </a>
            <a className="home-link" href="./artigos/quantas-galinhas-para-ter-ovos-em-casa/">Guia: quantas galinhas criar?</a>
          </div>
        </header>
        <img className="galinheiro-imagem" src={`./imagens/${modulo.imagem}`}
          width="792" height="396" alt="Galinhas caipiras perto de um galinheiro de madeira." loading="lazy" />
      </div>

      <CalculadoraGalinheiro />
      <ConsumoGalinheiro />
      <CuidadosGalinheiro />

      <aside className="galinheiro-ciclo" aria-labelledby="titulo-galinheiro-ciclo">
        <div>
          <h4 id="titulo-galinheiro-ciclo">No ciclo do Sisteminha</h4>
          <p>{modulo.explicacao}</p>
        </div>
        <a className="sisteminha-voltar" href="#compostagem">Ver compostagem</a>
      </aside>
    </article>
  );
}
