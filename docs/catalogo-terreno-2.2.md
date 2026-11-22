# Seu Quintal — Catálogo do planejador de terrenos (UI 2.2)

Referência: **Bíblia do Produto 2.0**, seção 8.5 (planta retangular e biblioteca de estruturas); seção 9 (módulos do Sisteminha); **Design System Raiz & Caminho 2.0**, seção 16 (ícones SVG 20–24 px).

## Funcionalidade

O editor abre a categoria **Cultivos** por padrão. Ao escolher uma categoria, mostra somente seus elementos, com ícone SVG, nome e dimensões iniciais. Depois de adicionar, o usuário pode editar medidas e posição pelo painel. O mapa mantém dimensões proporcionais, assim como cenários, salvamento local e backup JSON.

### Categorias e elementos

| Grupo | Elementos |
| --- | --- |
| Cultivos | Canteiro, Horta, Pomar, Faixa de plantio, Muda ou árvore, Viveiro de mudas |
| Animais | Galinheiro, Codornário, Chiqueiro, Tanque de peixes |
| Construções | Casa, Galpão, Depósito, Estufa |
| Compostagem | Composteira, Minhocário, Biodigestor |
| Água | Caixa d'água, Cisterna |
| Acessos | Caminho, Entrada / portão, Pátio |
| Apoio e lazer | Fogueira, Pergolado, Redário, Piscina, Campinho / quadra, Outra área |

**Atenção:** a lista da plataforma não é catálogo oficial de módulos da Embrapa. Os módulos da página do Sisteminha incluem tanque de peixes, galinheiro, horta/pomar, compostagem e minhocário. Biodigestor, piscina, campinho e outras estruturas são opções adicionais de planejamento e não representam endosso, integração técnica ou modelo executivo da Embrapa.

## Premissas e segurança

- As dimensões do catálogo servem como **ponto de partida ilustrativo**, sem embasamento para projeto de obra, recuos, manejo animal, instalação de biodigestor ou sistema hidráulico.
- O usuário ajusta tamanho e coordenadas, com validações geométricas e aviso de conflitos já existentes.
- O modelo de dados do terreno continua com o identificador de tipo: não houve migração de chave, gravação automática em massa nem alteração na escala da planta.
- `acesso` permanece o ID persistido do elemento agora chamado **Caminho**; isso evita perda do acesso antigo.
- `manobra` segue válido em carregamento, edição, renderização e backup legado, mas com `oculto: true`: não é mais oferecido para novos projetos. Não apagar o tipo enquanto os backups v1 ainda forem aceitos.

## Padrão de iconografia e UX

- `Icone.jsx`: SVGs de `viewBox="0 0 24 24"`, traço unificado, sem emojis, fotos nem bibliotecas adicionais.
- O nome sempre acompanha o ícone; ações possuem `aria-pressed` e foco visível.
- No desktop, os grupos aparecem em três colunas na área lateral do editor; tablet com quatro e celular com duas colunas, sem rolagem lateral obrigatória.
- Diferenciar categorias e tipos por ícone **e** texto, nunca apenas por cor.
- Manter a navegação sem conta e armazenamento no navegador com backup.

## Validação

- `tests/catalogoTerreno.test.js`: catálogo, ícones, dimensões iniciais, preservação de tipo legado e backup.
- `scripts/smoke-visual.mjs`: grupos, escolha de Caminho/Minhocário/Biodigestor, inclusão de Piscina/Campinho e atualização da Visão geral, em 390 e 1440 px, mais testes de overflow em 320/768/1024 px.
- Antes de publicar, verificar `npm test`, `npm run build`, SEO e resultados reais de Playwright.

**Evolução futura:** IDs estáveis e nomes de propriedades para múltiplos terrenos com mesmas medidas (issue #33).
