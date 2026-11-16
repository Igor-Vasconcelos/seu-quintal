# Seu Quintal

Site em React, JavaScript e Vite, baseado no design system Quintal Acolhedor.

## Rodar no Windows

Abra esta pasta no VS Code. No terminal PowerShell, rode:

```powershell
npm.cmd ci
npm.cmd run dev
```

Abra o endereço que o terminal mostrar, geralmente http://localhost:5173/.

Se você já criou um projeto Vite, copie o conteúdo desta pasta para a raiz do projeto local. Revise seus arquivos antes de aceitar a substituição. A pasta `src` inclui os componentes novos, e `public/imagens` inclui os arquivos visuais. Rode os comandos acima após copiar `package.json` e `package-lock.json`.

## Onde editar

| Arquivo | Conteúdo |
| --- | --- |
| `src/App.jsx` | Abertura e seções da página inicial |
| `src/components/Cabecalho.jsx` e `src/components/Rodape.jsx` | Navegação compartilhada |
| `src/styles/tokens.css`, `src/styles/home.css` e `src/styles/editorial.css` | Design system, componentes e layout |
| `src/components/Calendario.jsx` e `src/data/plantio.js` | Formulário, fonte e períodos de plantio |
| `src/features/organizador/` | Metas semanais, escalonamento dos lotes, agenda e armazenamento dos planos de horta |
| `src/components/Planejador.jsx` e `src/features/planejador/` | Medidas, geometria, planta e editor |
| `src/data/guias.js` | Títulos, resumos e destinos dos cartões dos guias |

O calendário contém 38 opções da Tabela 8 da Embrapa, consultáveis nas cinco regiões. O planejador aceita vírgula ou ponto e calcula a área. No Meu Quintal, é possível adicionar, mover e dimensionar áreas e plantios, medir distâncias na planta e comparar cenários na mesma escala. O navegador salva os cenários por medidas do terreno. A URL contém as medidas para reabrir o editor.

Os cartões levam ao guia de horta, ao galinheiro do Sisteminha, ao guia de compostagem e ao comparativo de irrigação. A seção do Sisteminha aponta para os materiais oficiais. As quatro imagens dos guias foram geradas por IA. A abertura da home e a do Sisteminha usam o mesmo panorama do projeto. A prévia do planejador é desenhada a partir das medidas informadas.

## Páginas

Os endereços abaixo são relativos à raiz do site. Cada página tem sua entrada HTML no Vite.

| Endereço | Arquivo de entrada |
| --- | --- |
| `/` | `index.html` |
| `/meu-quintal/` | `meu-quintal/index.html` |
| `/horta/` | `horta/index.html` |
| `/horta/organizador/` | `horta/organizador/index.html` |
| `/horta/calendario-de-plantio/` | `horta/calendario-de-plantio/index.html` |
| `/guias/` | `guias/index.html` |
| `/guias/compostagem/` | `guias/compostagem/index.html` |
| `/guias/irrigacao/` | `guias/irrigacao/index.html` |
| `/sisteminha.html` | `sisteminha.html` |
| `/mapa-do-site/` | `mapa-do-site/index.html` |

Para gerar uma versão de produção em `dist`:

```powershell
npm.cmd run build
```

## Dados do Meu Quintal

A área abre em uma página própria. Os visitantes que usam a versão local guardam seus terrenos, registros e planos de horta no armazenamento do navegador. A opção Entrar com ChatGPT abre a área da conta hospedada no Seu Quintal, onde a API vincula os dados ao usuário autenticado.

Em **Cópia dos meus dados**, a pessoa pode baixar os dados locais e importá-los em seções vazias da conta. O mesmo código da interface gera a versão da conta com `npm run build -- --mode conta`.
