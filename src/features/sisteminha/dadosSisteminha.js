// Informações editoriais revisáveis. Valores numéricos e receitas são tratados
// nos guias/calculadoras específicos, com premissas e referências.
export const fichasSisteminha = {
  tanque: {
    objetivo: "Produzir peixes e apoiar o aproveitamento de nutrientes do sistema.",
    materiais: ["Tanque adequado e estrutura estável", "Bomba e sistema de aeração conforme o projeto",
      "Sedimentador e biofiltro", "Instrumentos de acompanhamento da qualidade da água"],
    manejo: "Acompanhar a água, a alimentação, a saúde dos peixes e o funcionamento contínuo dos equipamentos.",
    ligacoes: "A água tratada e os nutrientes recuperados podem participar da irrigação, seguindo o manejo e a segurança apropriados.",
    cuidados: "Capacidade, espécie, biomassa, oxigenação e destino da água exigem dimensionamento técnico. A água não se torna potável.",
    links: [{ href: "https://www.infoteca.cnptia.embrapa.br/handle/doc/1111791", titulo: "Manual técnico do tanque de peixes — Embrapa" }],
  },
  galinheiro: {
    objetivo: "Oferecer ovos ou carne, conforme o sistema de criação e o bem-estar das aves.",
    materiais: ["Abrigo arejado, protegido e lavável", "Comedouros e bebedouros adequados", "Ninhos, poleiros e área de circulação conforme a criação"],
    manejo: "Controlar alimentação, água, higiene, postura, saúde e destino da cama utilizada.",
    ligacoes: "Resíduos apropriados da criação podem passar por compostagem controlada, não devem ser levados crus à horta.",
    cuidados: "Evitar superlotação e informar necessidades de espaço, sanidade e ração para cada objetivo.",
    links: [{ href: "#calculadora-galinheiro", titulo: "Calcular aves, ração e espaço" }],
  },
  horta: {
    objetivo: "Produzir verduras, raízes, frutas e temperos para diversificar a alimentação.",
    materiais: ["Canteiros ou recipientes com drenagem", "Substrato e solo adequados",
      "Sementes ou mudas apropriadas à época", "Água de qualidade adequada à irrigação"],
    manejo: "Planejar cultivos por época, espaçamento, sol, irrigação, manutenção e colheitas escalonadas.",
    ligacoes: "Aproveita matéria orgânica devidamente tratada e, quando apropriado, água proveniente do sistema de produção.",
    cuidados: "Nem toda água ou composto pode entrar em contato com alimentos sem manejo seguro. Árvores frutíferas precisam de espaço para a copa adulta.",
    links: [
      { href: "./horta/canteiros/", titulo: "Planejar os canteiros" },
      { href: "./horta/organizador/", titulo: "Escalonar plantios e colheitas" },
    ],
  },
  compostagem: {
    objetivo: "Transformar resíduos orgânicos adequados em um material estável para melhorar o solo.",
    materiais: ["Área ou recipiente de compostagem apropriado", "Materiais orgânicos compatíveis e materiais secos",
      "Proteção, ferramentas e local de manejo"],
    manejo: "Equilibrar materiais, umidade e aeração; acompanhar a maturação antes de utilizar o composto.",
    ligacoes: "Recebe determinados restos vegetais e, quando o manejo permitir, material da criação animal; o composto pronto retorna ao cultivo.",
    cuidados: "Resíduos de origem animal exigem atenção sanitária. Não usar esterco fresco diretamente nas hortaliças.",
    links: [{ href: "./guias/compostagem/", titulo: "Guia de compostagem" }],
  },
  minhocario: {
    objetivo: "Produzir húmus com minhocas usando material orgânico adequado.",
    materiais: ["Minhocário com drenagem e proteção", "Minhocas adequadas ao sistema",
      "Material orgânico já preparado e condições de umidade"],
    manejo: "Evitar calor excessivo, encharcamento e alimento inadequado; manter o ambiente protegido.",
    ligacoes: "Complementa o tratamento da matéria orgânica e fornece húmus que pode ser usado nos canteiros.",
    cuidados: "Nem todo material da composteira deve ser oferecido diretamente às minhocas; aguardar condições apropriadas.",
    links: [{ href: "./guias/compostagem/", titulo: "Ver práticas de compostagem" }],
  },
};

export const etapasImplantacao = [
  { titulo: "Observe o espaço", explicacao: "Avalie sol, água, energia, relevo, acesso, vizinhança e tempo disponível para o cuidado diário." },
  { titulo: "Escolha módulos viáveis", explicacao: "O tanque é central na configuração clássica, mas o arranjo deve seguir a orientação técnica e a realidade da família." },
  { titulo: "Planeje as conexões", explicacao: "Separe produção de alimentos, água de irrigação, tratamento de resíduos e áreas de manejo." },
  { titulo: "Comece com segurança", explicacao: "Dimensione instalações, trate os resíduos, monitore animais e ajuste a produção antes de expandir." },
];

export const materiaisOficiais = [
  {
    titulo: "Portal do Sisteminha Embrapa",
    detalhe: "Visão institucional, vídeos e orientações de tecnologia social.",
    url: "https://www.embrapa.br/web/meio-norte/sisteminha",
  },
  {
    titulo: "Manual do tanque de peixes",
    detalhe: "Publicação técnica da Embrapa sobre implantação, filtragem e manejo do módulo.",
    url: "https://www.infoteca.cnptia.embrapa.br/handle/doc/1111791",
  },
  {
    titulo: "Perguntas frequentes da Embrapa",
    detalhe: "Dúvidas sobre implantação, manejo e limites da tecnologia.",
    url: "https://www.embrapa.br/web/meio-norte/sisteminha/faq",
  },
  {
    titulo: "Sisteminha Embrapa Maranhão",
    detalhe: "Apresentação do ciclo e exemplos de módulos integrados.",
    url: "https://www.embrapa.br/web/maranhao/sisteminha",
  },
];
