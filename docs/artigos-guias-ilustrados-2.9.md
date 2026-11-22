# Seu Quintal 2.9 — artigos completos, ilustrados e com abertura compacta

## Diagnóstico (22/11/2026)
O conteúdo existente tinha cerca de 2 minutos de leitura, uma imagem de abertura excessivamente grande no desktop e poucos exemplos práticos. O link do artigo das galinhas abria o Sisteminha sem ir à calculadora. Imagens didáticas e tabelas não eram suportadas pelo gerador estático.

## Mudanças no produto
- **Hero compacto, semelhante à Home**: imagem contextual ao lado do título/resposta direta no desktop. No celular, a imagem ocupa uma faixa de 8 rem; a resposta direta permanece visível e o subtítulo redundante é ocultado apenas na apresentação móvel para liberar o conteúdo mais cedo. Não altera header global, URL ou navegação.
- **Horta**: passos de medição, escolha de plantas, lotes de plantio, exemplo administrativo de quatro semanas, fatores de risco, checklist, caso de família, perguntas frequentes, fontes e links específicos para Horta, Calendário, Planejador Visual, Organizador e Meu Quintal.
- **Galinhas**: cálculo de poedeiras com hipótese ajustável (5 ovos/ave/semana), exemplos para 10/20/30 ovos, água e ração da mesma função de referência existente, espaço, ninhos, rotina, biossegurança, caso completo, perguntas frequentes, fontes e atalho direto à calculadora no Sisteminha.
- **Markdown indexável**: gerador agora aceita imagens WebP locais com texto alternativo e legenda de IA, além de tabelas simples com header e região rolável acessível. Renderização estática sem depender de JavaScript para o conteúdo.
- **Imagens**: seis WebP locais, produzidas por geração de imagem como **ilustrações fotorrealistas**, não fotografias reais nem material oficial; arquivo separado por finalidade, sem dependências externas. Imagens visuais devem ser verificadas quanto à anatomia, botânica e instalações antes de republicações futuras.
- **Sinalização**: resposta direta na abertura, estimativa de tempo de leitura recalculada, passo a passo e exemplos claramente condicionais. Nenhuma data de publicação/atualização foi criada artificialmente.

## Arquivos alterados
- `content/artigos/{como-planejar-uma-horta-para-colher-com-frequencia,quantas-galinhas-para-ter-ovos-em-casa}.md`
- `scripts/gerar-artigos.mjs` — Markdown, tabela, figura, hero e link de âncora interna
- `src/styles/artigos-guias-v6.css` e `src/main-artigos.js`
- `public/imagens/artigos/*.webp` — seis imagens
- `tests/artigosGuiasV6.test.js` e `scripts/smoke-visual.mjs`

## Fontes verificadas para redação e revisão
- Embrapa Hortaliças — [Horta em pequenos espaços](https://www.infoteca.cnptia.embrapa.br/handle/doc/958531).
- Embrapa — [Hortas pedagógicas, instalação](https://www.infoteca.cnptia.embrapa.br/handle/doc/1120149).
- Embrapa Meio-Norte — [Perguntas e respostas sobre galinhas e codornas](https://www.infoteca.cnptia.embrapa.br/handle/doc/1102048).
- Embrapa Suínos e Aves — [Boas práticas para o bem-estar de poedeiras](https://www.infoteca.cnptia.embrapa.br/handle/doc/1127416).
- Embrapa — [Alimentos e alimentação de galinhas](https://ainfo.cnptia.embrapa.br/digital/bitstream/item/25920/1/Alimentos-e-alimentacao-de-galinhas.pdf).
- Fórmulas e parâmetros: `src/features/galinheiro/estimativa.js` (fonte de verdade existente; não modificada).

## Limitações
- O artigo não prescreve densidade específica nem vacinação; exigem adequação local e revisão técnica veterinária. Ração/água são números referenciais do código, **não limites de fornecimento**.
- Intervalos de escalonamento são exemplos; não há produção garantida.
- As imagens de IA são ilustrativas, sem identificação como fotografias de sítios, nem atribuição fictícia à Embrapa.
- A navegação article → ferramenta usa href com âncora pública validada. Nenhum valor pessoal é enviado via URL e nenhum dado é salvo por artigo.

## Testes necessários antes de publicar
- [ ] `npm test`, incluindo geração estática, imagens WebP e SEO de slugs/canonicals
- [ ] `npm run build` + `postbuild` do verificador de SEO
- [ ] Playwright dos dois artigos em 390 e 1440 px, hero com altura controlada, carregamento de 2 fotos de etapa, tabela, índice e navegação
- [ ] Sem transbordamento horizontal em 320/768/1024 px
- [ ] Verificar leitura humana, botânica e anatomia das imagens, mobile e interligações
- [ ] Merge condicionado à CI; conferir GitHub Pages separadamente

**Proteção:** nenhuma migração de localStorage, IDs de culturas, espécies, cálculos, propriedades ou backups.
