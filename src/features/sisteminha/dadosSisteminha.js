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
    etapas: [
      { titulo: "Definir a estrutura", texto: "Escolha o local, a espécie e a capacidade com apoio do manual técnico. Preveja energia e manutenção da circulação." },
      { titulo: "Entender o tratamento", texto: "O sedimentador retém sólidos e o biofiltro ajuda no tratamento biológico. Não confunda recirculação com água própria para beber." },
      { titulo: "Estabelecer a rotina", texto: "Acompanhe alimentação, oxigenação, qualidade da água, funcionamento da bomba e destino seguro dos sólidos separados." },
    ],
    sinais: ["Água com alterações persistentes de odor ou aparência", "Peixes procurando ar na superfície ou com comportamento incomum", "Parada da bomba, da aeração ou do fluxo de tratamento"],
    perguntas: [
      { pergunta: "A água do tanque pode ir direto para qualquer planta?", resposta: "Não automaticamente. O reuso depende de tratamento, qualidade da água, tipo de cultura e modo de irrigação. Consulte a orientação técnica antes de aplicar em alimentos consumidos crus." },
      { pergunta: "O que acontece se faltar energia?", resposta: "A circulação e a aeração podem parar. A autonomia e o plano de contingência devem fazer parte do projeto, sobretudo em sistemas de criação intensiva." },
    ],
    links: [{ href: "https://www.infoteca.cnptia.embrapa.br/handle/doc/1111791", titulo: "Manual técnico do tanque de peixes — Embrapa" }],
  },
  galinheiro: {
    objetivo: "Oferecer ovos ou carne, conforme o sistema de criação e o bem-estar das aves.",
    materiais: ["Abrigo arejado, protegido e lavável", "Comedouros e bebedouros adequados", "Ninhos, poleiros e área de circulação conforme a criação"],
    manejo: "Controlar alimentação, água, higiene, postura, saúde e destino da cama utilizada.",
    ligacoes: "Resíduos apropriados da criação podem passar por compostagem controlada, não devem ser levados crus à horta.",
    cuidados: "Evitar superlotação e informar necessidades de espaço, sanidade e ração para cada objetivo.",
    etapas: [
      { titulo: "Definir a finalidade", texto: "Criação para ovos, carne ou ambas exige dimensionamentos e manejo diferentes." },
      { titulo: "Preparar instalações", texto: "Planeje abrigo, sombra, ventilação, proteção contra predadores, acesso à água e manejo da cama." },
      { titulo: "Criar uma rotina", texto: "Observe consumo, limpeza, postura, comportamento e saúde das aves. Registre mudanças e procure assistência quando necessário." },
    ],
    sinais: ["Ave prostrada, com dificuldade respiratória ou sem comer", "Cama constantemente molhada, odor forte ou ventilação insuficiente", "Contato frequente com aves silvestres e falhas de proteção"],
    perguntas: [
      { pergunta: "É necessário ter galo para colher ovos?", resposta: "Não. As galinhas botam ovos sem galo; ele é necessário para produzir ovos férteis destinados à reprodução." },
      { pergunta: "Posso usar a cama do galinheiro direto na horta?", resposta: "Não é uma prática segura. Materiais com dejetos precisam de compostagem e controle sanitário adequados antes do uso agrícola." },
    ],
    links: [{ href: "#calculadora-galinheiro", titulo: "Calcular aves, ração e espaço" }],
  },
  horta: {
    objetivo: "Produzir verduras, raízes, frutas e temperos para diversificar a alimentação.",
    materiais: ["Canteiros ou recipientes com drenagem", "Substrato e solo adequados",
      "Sementes ou mudas apropriadas à época", "Água de qualidade adequada à irrigação"],
    manejo: "Planejar cultivos por época, espaçamento, sol, irrigação, manutenção e colheitas escalonadas.",
    ligacoes: "Aproveita matéria orgânica devidamente tratada e, quando apropriado, água proveniente do sistema de produção.",
    cuidados: "Nem toda água ou composto pode entrar em contato com alimentos sem manejo seguro. Árvores frutíferas precisam de espaço para a copa adulta.",
    etapas: [
      { titulo: "Planejar o calendário", texto: "Escolha culturas adequadas à região e à época e distribua semeaduras em lotes, evitando concentrar todas as colheitas." },
      { titulo: "Preparar o espaço", texto: "Verifique luz, drenagem, acesso à água e caminhos. Respeite espaçamentos e o porte futuro das plantas." },
      { titulo: "Acompanhar a colheita", texto: "Registre o que realmente produziu. Ajuste quantidade de mudas e frequência dos próximos lotes a partir do consumo familiar." },
    ],
    sinais: ["Folhas murchas mesmo com irrigação adequada", "Áreas encharcadas ou crescimento muito desigual", "Folhas com sinais de pragas ou doenças em expansão"],
    perguntas: [
      { pergunta: "Quantas culturas devo plantar?", resposta: "Comece pelo que a família realmente consome e pelo espaço disponível. A ferramenta de horta do Seu Quintal ajuda a estimar lotes, mas o resultado depende do manejo." },
      { pergunta: "Preciso aplicar água do tanque na horta?", resposta: "Não. A horta pode funcionar independentemente; no sistema integrado, o reuso de água só deve ocorrer quando sua qualidade e o método de irrigação forem apropriados." },
    ],
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
    etapas: [
      { titulo: "Selecionar resíduos", texto: "Separe os materiais aceitos pelo método adotado. Exclua resíduos impróprios ou contaminados." },
      { titulo: "Acompanhar o processo", texto: "Mantenha condições adequadas de umidade, aeração e equilíbrio entre materiais secos e úmidos." },
      { titulo: "Usar somente quando pronto", texto: "O composto precisa estar maturado e seguro para seu destino. Para resíduos animais, aplique orientações sanitárias específicas." },
    ],
    sinais: ["Odor forte e persistente", "Excesso de água e falta de aeração", "Presença de materiais inadequados ou de animais atraídos pelo descarte"],
    perguntas: [
      { pergunta: "Qualquer resto orgânico pode entrar na composteira?", resposta: "Não. A lista depende do sistema e do manejo. O guia de compostagem ajuda a separar materiais aceitos daqueles que exigem cuidado ou devem ficar de fora." },
      { pergunta: "É seguro colocar esterco fresco nos canteiros?", resposta: "Não é recomendado. O material de origem animal pode conter agentes patogênicos e exige tratamento e manejo sanitário adequados." },
    ],
    links: [{ href: "./guias/compostagem/", titulo: "Guia de compostagem" }],
  },
  minhocario: {
    objetivo: "Produzir húmus com minhocas usando material orgânico adequado.",
    materiais: ["Minhocário com drenagem e proteção", "Minhocas adequadas ao sistema",
      "Material orgânico já preparado e condições de umidade"],
    manejo: "Evitar calor excessivo, encharcamento e alimento inadequado; manter o ambiente protegido.",
    ligacoes: "Complementa o tratamento da matéria orgânica e fornece húmus que pode ser usado nos canteiros.",
    cuidados: "Nem todo material da composteira deve ser oferecido diretamente às minhocas; aguardar condições apropriadas.",
    etapas: [
      { titulo: "Preparar o ambiente", texto: "Escolha recipiente ventilado, protegido de chuva intensa e sol direto, com drenagem adequada." },
      { titulo: "Alimentar com cuidado", texto: "Forneça somente materiais compatíveis com as minhocas, em condições apropriadas, sem excesso de alimentos ou calor." },
      { titulo: "Coletar o húmus", texto: "Acompanhe a transformação do material, separando o húmus pronto para uso no solo e preservando as minhocas." },
    ],
    sinais: ["Minhocas tentando escapar em grande quantidade", "Cheiro forte, excesso de umidade ou calor", "Acúmulo de restos não decompostos e presença de insetos indesejados"],
    perguntas: [
      { pergunta: "Minhocário e composteira são a mesma coisa?", resposta: "Não. Os dois transformam matéria orgânica, mas a vermicompostagem depende das minhocas e de condições adequadas para elas." },
      { pergunta: "Posso colocar qualquer composto quente no minhocário?", resposta: "Não. Material muito quente ou inadequado pode prejudicar as minhocas. Aguarde a preparação e o resfriamento quando necessários." },
    ],
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
