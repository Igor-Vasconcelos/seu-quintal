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

O calendário contém 38 opções da Tabela 8 da Embrapa, consultáveis nas cinco regiões. O planejador aceita vírgula ou ponto e calcula a área. O editor permite criar, editar a posição e remover canteiros. As medidas do terreno vão na URL. Com a API configurada, o Meu Quintal também salva e reabre projetos com os canteiros.

Os cartões abrem introduções com referências. A seção do Sisteminha aponta para os materiais oficiais. As quatro imagens dos guias foram geradas por IA. A abertura e o banner do Sisteminha usam ilustrações da referência visual do projeto. A prévia do planejador é desenhada a partir das medidas informadas.

Para gerar uma versão de produção em `dist`:

```powershell
npm.cmd run build
```


## Salvar no PostgreSQL durante o desenvolvimento

Com o PostgreSQL rodando, crie o banco `seu_quintal` no pgAdmin ou execute `CREATE DATABASE seu_quintal;` em uma conexão com o banco padrão `postgres`.

No PowerShell, a partir da raiz do repositório:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item .env.example .env.local
```

Abra `backend/.env` e preencha a `DATABASE_URL` com seu usuário, senha, porta e nome do banco. Se a senha contiver caracteres especiais, use a forma codificada para URLs. O arquivo `backend/.env` fica fora do Git. O `.env.local` aponta o React para a API local.

No primeiro terminal, inicie a API:

```powershell
cd backend
npm.cmd ci
npm.cmd run db:setup
npm.cmd start
```

No segundo terminal, volte à raiz do repositório:

```powershell
npm.cmd ci
npm.cmd run dev
```

1. Confira a conexão em [http://127.0.0.1:3001/api/health](http://127.0.0.1:3001/api/health). A resposta esperada é `{"status":"ok"}`.
2. Abra [http://localhost:5173/](http://localhost:5173/), entre no **Meu Quintal**, adicione canteiros, dê um nome ao projeto e clique em **Salvar projeto**.
3. Recarregue, entre novamente no **Meu Quintal**, clique em **Ver projetos salvos**, selecione o projeto e use **Abrir projeto**.
4. Mova ou remova um canteiro e salve novamente. Ao reabrir, confira que as mudanças foram gravadas no mesmo projeto.

Se o Vite escolher outra porta, ajuste `FRONTEND_ORIGIN` no `backend/.env` para a origem que abrir no navegador e reinicie a API. Se mudar a porta do backend, atualize também a `VITE_API_URL` em `.env.local` e reinicie o Vite.

| Método e caminho | Função |
| --- | --- |
| `GET /api/planejamentos` | Lista os projetos salvos |
| `POST /api/planejamentos` | Cria um projeto |
| `GET /api/planejamentos/:id` | Carrega um projeto com seus canteiros |
| `PUT /api/planejamentos/:id` | Atualiza o projeto salvo |

A API desta etapa escuta em `127.0.0.1` e usa um banco de desenvolvimento. Para publicar o recurso com projetos privados, a API precisará identificar a conta e associar cada projeto ao seu dono. O GitHub Pages publica o front-end, e os controles de salvamento aparecem quando o build do React recebe a `VITE_API_URL`.
