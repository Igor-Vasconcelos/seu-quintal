// Catálogo único de ferramentas públicas do Seu Quintal.
// Somente rotas existentes: nunca usar este registro para anunciar recursos futuros.
export const gruposFerramentas = [
  { id:"plantio", nome:"Plantio e horta", descricao:"Decida o que plantar, distribua culturas e planeje colheitas.", icone:"horta" },
  { id:"animais", nome:"Animais e proteína", descricao:"Planeje estruturas e consumo de forma responsável.", icone:"galinha" },
  { id:"pomar", nome:"Pomar e frutíferas", descricao:"Organize espaços reservados para o crescimento das árvores.", icone:"arvores" },
  { id:"terreno", nome:"Terreno e organização", descricao:"Organize seu espaço e seus registros em um só lugar.", icone:"planta" },
  { id:"sustentabilidade", nome:"Sustentabilidade", descricao:"Aproveite recursos e evite desperdícios com cuidado.", icone:"recycle" },
];

export const catalogoFerramentas = [
  { id:"canteiros", nome:"Planejador visual de canteiros", grupo:"plantio", icone:"canteiro",
    rota:"horta/canteiros/", descricao:"Desenhe canteiros, distribua plantas e veja o espaçamento.", resultado:"Um desenho de plantio com medidas.", modulos:["horta"] },
  { id:"calendario", nome:"Calendário de plantio", grupo:"plantio", icone:"calendario",
    rota:"horta/calendario-de-plantio/", descricao:"Consulte as culturas por mês e região do Brasil.", resultado:"Indicações de épocas e culturas.", modulos:["horta"] },
  { id:"organizador", nome:"Horta contínua — consumo e rotação", grupo:"plantio", icone:"horta",
    rota:"horta/organizador/", descricao:"Defina consumo semanal, escalone plantios e aprenda a rotacionar famílias botânicas.", resultado:"Previsões de lotes, área e colheitas com agenda local.", modulos:["horta"] },
  { id:"galinhas", nome:"Calculadora de galinhas", grupo:"animais", icone:"galinha",
    rota:"sisteminha.html#calculadora-galinheiro", descricao:"Compare criação para ovos ou corte e os cuidados básicos.", resultado:"Cenário de aves, consumo e espaço.", modulos:["galinheiro"] },
  { id:"codornas", nome:"Calculadora de codornas", grupo:"animais", icone:"codorna",
    rota:"ferramentas/calculadora-codornas/", descricao:"Simule ovos, corte, ração, água e área das codornas.", resultado:"Estimativa por objetivo e hipóteses editáveis.", modulos:["galinheiro"] },
  { id:"peixes", nome:"Calculadora de peixes", grupo:"animais", icone:"peixe",
    rota:"ferramentas/calculadora-peixes/", descricao:"Simule volume do tanque, biomassa e ração.", resultado:"Cenário estimado, não lotação segura.", modulos:["tanque"] },
  { id:"pomar", nome:"Planejador de pomar", grupo:"pomar", icone:"arvores",
    rota:"ferramentas/planejador-de-pomar/", descricao:"Compare espaçamentos e veja as posições das árvores.", resultado:"Croqui e estimativa de mudas.", modulos:["horta"] },
  { id:"meu-quintal", nome:"Meu Quintal", grupo:"terreno", icone:"planta",
    rota:"meu-quintal/#terreno", descricao:"Posicione tanque, casa, canteiros, pomar e áreas de animais.", resultado:"Cenários de terreno guardados no navegador.", modulos:["tanque","galinheiro","horta","compostagem"] },
  { id:"compostagem", nome:"Checklist de compostagem", grupo:"sustentabilidade", icone:"composteira",
    rota:"guias/compostagem/", descricao:"Confira materiais aceitos e cuidados no processo de compostagem.", resultado:"Orientação prática em checklist.", modulos:["compostagem","minhocario"] },
];

export function ferramentasDoModulo(modulo) {
  return catalogoFerramentas.filter(ferramenta => ferramenta.modulos.includes(modulo));
}
