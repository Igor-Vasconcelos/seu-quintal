# Reforma visual Raiz & Caminho — 21/11/2026

## Objetivo
Adaptar a Home e as principais famílias de páginas ao mockup de referência fornecido, sem reconstruir funcionalidades nem alterar dados locais.

## Páginas e módulos impactados
- **Home**: hero sobreposto a fotografia realista, quatro benefícios, barra horizontal de temas, quatro cartões editoriais, área lateral de ferramentas, artigos recentes na largura inteira e manutenção do calendário/planejador abaixo.
- **Artigos**: identidade de cabeçalho, hero fotográfico de catálogo, cartões e tipografia editorial por meio do estilo compartilhado. Artigos são gerados como HTML indexável pelo script existente.
- **Guias**: foto no hero, cartões e orientação de escolha sem novos dados inventados.
- **Ferramentas**: foto no catálogo, superfícies e títulos padronizados; layouts das calculadoras preservados.
- **Sisteminha**: visual consistente, links de ferramentas existentes preservados e novos links para guias por módulo. Os cuidados, fontes técnicas, cálculo de galinhas e navegação por abas permanecem.
- **Meu Quintal**: padronização restrita à moldura visual do espaço pessoal, sem alterações de persistência.

## Reutilização
A implementação mantém React/Vite, HTML de entradas existentes, catálogo de ferramentas, gerador de artigos, e estruturas de navegação/armazenamento. Não cria cálculo alternativo nem nova estrutura de dados.

## Estilos e componentes
- `src/styles/home-editorial-v2.css`: estilo restrito à Home.
- `src/styles/site-raiz-caminho.css`: camada comum opt-in.
- `src/components/DestaquesEditorial.jsx`: cartões com destinos que já existem.
- `src/features/sisteminha/GuiasModulo.jsx`: links contextuais.

## Precauções de conteúdo
- Quatro cartões editoriais usam páginas existentes. Não atribuir tempo de leitura ou datas sem metadados verificados.
- Artigos recentes aparecem somente se realmente publicados pelo gerador.
- Fotografias já presentes no repositório são tratadas como **ilustrativas**, quando geradas por IA; não representam registro oficial da Embrapa.
- Conteúdo técnico mantém fontes, limites e avisos já presentes.

## Validação
Executar `npm test`, `npm run build` e o fluxo de navegador Playwright em 390 e 1440 px; revisar visualmente também 320, 768 e 1024 px. O smoke deve verificar ausência de rolagem horizontal, carregamento de fotografias, navegação, calculadoras e recursos de Meu Quintal. Não confundir nota Lighthouse com comprovação de experiência perfeita.

## Pendências editoriais futuras
1. Publicar novos artigos somente após pesquisa, fontes e revisão humana.
2. Revisar manualmente fidelidade fotográfica/anatomia de toda nova imagem e adicionar origem/créditos.
3. Avaliar ferramenta de busca e lista de favoritos como projetos funcionais futuros; não adicionar ícones sem ação.
4. Futuras URLs indexáveis individuais do Sisteminha exigem migração cuidadosa dos hashes existentes.
