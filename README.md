# Seu Quintal

Site em React, JavaScript e Vite, com calendário de plantio, planejador, guias práticos e histórico de cultivo.

## Rodar no Windows

Abra a raiz do repositório no VS Code. Use Node.js 24 para rodar com a mesma versão do GitHub Actions. No PowerShell, execute os comandos abaixo.

```powershell
npm.cmd ci
npm.cmd run dev
```

Abra o endereço que o terminal mostrar, geralmente http://localhost:5173/.

## Onde editar

| Arquivo | Conteúdo |
| --- | --- |
| `src/App.jsx` | Cabeçalho, abertura, seções e navegação |
| `src/styles/tokens.css` e `src/styles/home.css` | Design system e responsividade |
| `src/components/Calendario.jsx` e `src/data/plantio.js` | Formulário, fonte e períodos de plantio |
| `src/components/Planejador.jsx` e `src/features/planejador/` | Medidas, geometria, planta e editor |
| `src/data/guias.js` e `src/features/guias/` | Cartões e ferramentas dos guias |
| `src/features/cultivo/HistoricoCultivo.jsx` | Histórico de plantio e colheita no navegador |
| `backend/` | API Express, configuração do PostgreSQL e migração da tabela |

O calendário contém 38 opções da Tabela 8 da Embrapa, consultáveis nas cinco regiões. O planejador aceita vírgula ou ponto e calcula a área. O editor permite criar, editar a posição e remover canteiros. As medidas do terreno vão na URL. Os canteiros ficam em memória até que um projeto seja salvo com a API local configurada.

O Histórico de cultivo usa `localStorage`. Os registros ficam no navegador em que foram criados.

Os cartões abrem introduções com referências. A seção do Sisteminha aponta para os materiais oficiais. As quatro capas dos guias foram geradas por IA. As fotos do checklist de compostagem têm créditos junto a cada imagem. A abertura e o banner do Sisteminha usam ilustrações da referência visual do projeto. A prévia do planejador é desenhada a partir das medidas informadas.

Para gerar uma versão de produção em `dist`:

```powershell
npm.cmd run build
```

## Salvar no PostgreSQL durante o desenvolvimento

Enquanto o [PR #1](https://github.com/Igor-Vasconcelos/seu-quintal/pull/1) estiver aberto, baixe a branch do backend no clone do projeto.

```powershell
git fetch origin
git switch feat/planejamentos-postgresql
```

O salvamento da planta usa a API local. Com o PostgreSQL instalado e rodando, crie o banco `seu_quintal` no pgAdmin ou execute `CREATE DATABASE seu_quintal;` em uma conexão com o banco padrão `postgres`.

Na raiz do repositório, crie os arquivos de configuração na primeira vez que rodar o projeto.

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item .env.example .env.local
```

Abra `backend/.env` e preencha a `DATABASE_URL` com seu usuário, senha, porta e nome do banco. Se a senha contiver caracteres especiais, use a forma codificada para URLs. O arquivo `backend/.env` fica fora do Git. O `.env.local` aponta o React para `/api` no mesmo endereço do site. O Vite encaminha os pedidos à API local.

No primeiro terminal, instale as dependências, crie a tabela e inicie a API.

```powershell
cd backend
npm.cmd ci
npm.cmd run db:setup
npm.cmd start
```

No segundo terminal, rode o React a partir da raiz do repositório.

```powershell
npm.cmd ci
npm.cmd run dev
```

1. Confira a conexão em [http://127.0.0.1:3001/api/health](http://127.0.0.1:3001/api/health). A resposta esperada é `{"status":"ok"}`.
2. Abra [http://localhost:5173/](http://localhost:5173/), entre no **Meu Quintal** e crie uma conta com nome de usuário e senha. Adicione canteiros, dê um nome ao projeto e use **Salvar projeto**.
3. Recarregue, entre novamente no **Meu Quintal**, clique em **Ver projetos salvos**, selecione o projeto e use **Abrir projeto**.
4. Mova ou remova um canteiro e salve novamente. Ao reabrir, confira as mudanças. Saia da conta, crie outra e confirme que ela tem a própria lista de projetos.

Se mudar o endereço do Vite, ajuste `FRONTEND_ORIGIN` no `backend/.env` para a origem exata e reinicie a API. Se mudar a porta do backend, use `VITE_API_URL=http://127.0.0.1:NOVA_PORTA/api` no desenvolvimento e reinicie o Vite.

As migrações preservam os projetos locais criados na versão anterior. Como eles ainda não têm dono, ficam indisponíveis até que o administrador do banco associe cada projeto à conta correta pela coluna `dono_id`.

| Método e caminho | Função |
| --- | --- |
| `GET /api/planejamentos?depois=ID` | Lista os seus projetos em páginas de até 20. O cursor é opcional. |
| `POST /api/planejamentos` | Cria um projeto |
| `GET /api/planejamentos/:id` | Carrega um projeto com seus canteiros |
| `PUT /api/planejamentos/:id` | Atualiza o projeto salvo |

## Publicar o salvamento online

O Express pode servir o site e a API juntos. Assim, o navegador envia o cookie de sessão por HTTPS ao mesmo domínio da página. A publicação estática no GitHub Pages continua disponível para consultar o conteúdo e usar o planejador temporário.

1. Crie o PostgreSQL hospedado, por exemplo no [Neon](https://neon.com/docs/connect/connect-from-any-app).
2. Crie um [Web Service no Render](https://render.com/docs/web-services) conectado à branch que contém o backend. Deixe o diretório raiz em branco para usar o repositório inteiro.
3. Configure os comandos e variáveis abaixo. O Render já informa o endereço HTTPS e a porta. Se usar domínio próprio, atribua a origem HTTPS dele a `FRONTEND_ORIGIN`, sem o caminho.

| Campo | Valor |
| --- | --- |
| Build Command | `npm ci --include=dev && npm ci --prefix backend && npm run build` |
| Start Command | `npm run db:setup --prefix backend && npm start --prefix backend` |
| Health Check Path | `/api/health` |
| `NODE_VERSION` | `24` |
| `NODE_ENV` | `production` |
| `VITE_API_URL` | `/api` |
| `DATABASE_URL` | Credencial do PostgreSQL, adicionada apenas às variáveis do serviço |

4. Abra a URL HTTPS do serviço. Entre com a mesma conta em dois dispositivos e abra um projeto salvo. Em seguida, abra outra conta e confira que os projetos da primeira estão indisponíveis.

O cadastro usa nome de usuário e senha. Essa versão não tem recuperação de senha. O limite de requisições usa memória do serviço e é aplicado por instância. O Histórico de cultivo guarda plantios e colheitas no navegador em que foram cadastrados.

O build inclui uma política CSP para as páginas estáticas. Quando o Express serve o site, ele também envia os cabeçalhos HTTPS e de proteção contra incorporação em frames.
