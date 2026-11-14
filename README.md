# Seu Quintal

Home em React, JavaScript e Vite, baseada no design system Quintal Acolhedor.

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
| `src/App.jsx` | Cabeçalho, abertura, seções e navegação |
| `src/styles/tokens.css` e `src/styles/home.css` | Design system e responsividade |
| `src/components/Calendario.jsx` e `src/data/plantio.js` | Formulário, fonte e períodos de plantio |
| `src/components/Planejador.jsx` e `src/features/planejador/` | Medidas, geometria, planta e editor |
| `src/data/guias.js` | Textos e fontes dos quatro cartões |

O calendário contém 38 opções da Tabela 8 da Embrapa, consultáveis nas cinco regiões. O planejador aceita vírgula ou ponto e calcula a área. O editor permite criar, editar a posição e remover canteiros. Os canteiros ficam em memória enquanto a página está aberta e as medidas do terreno vão na URL.

Os cartões abrem introduções com referências. A seção do Sisteminha aponta para os materiais oficiais. As quatro imagens dos guias foram geradas por IA. A abertura e o banner do Sisteminha usam ilustrações da referência visual do projeto. A prévia do planejador é desenhada a partir das medidas informadas.

Para gerar uma versão de produção em `dist`:

```powershell
npm.cmd run build
```
