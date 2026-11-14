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

Abra `backend/.env` e preencha a `DATABASE_URL` com seu usuário, senha, porta e nome do banco. Se a senha contiver caracteres especiais, use a forma codificada para URLs. O arquivo `backend/.env` fica fora do Git. O `.env.local` aponta o React para a API local.

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
2. Abra [http://localhost:5173/](http://localhost:5173/), entre no **Meu Quintal**, adicione canteiros, dê um nome ao projeto e clique em **Salvar projeto**.
3. Recarregue, entre novamente no **Meu Quintal**, clique em **Ver projetos salvos**, selecione o projeto e use **Abrir projeto**.
4. Mova ou remova um canteiro e salve novamente. Ao reabrir, confira que as mudanças foram gravadas no mesmo projeto.

Se trocar de porta ou abrir pelo IP em vez de `localhost`, ajuste `FRONTEND_ORIGIN` no `backend/.env` para a origem que abrir no navegador e reinicie a API. Se mudar a porta do backend, atualize também a `VITE_API_URL` em `.env.local` e reinicie o Vite.

| Método e caminho | Função |
| --- | --- |
| `GET /api/planejamentos` | Lista os projetos salvos |
| `POST /api/planejamentos` | Cria um projeto |
| `GET /api/planejamentos/:id` | Carrega um projeto com seus canteiros |
| `PUT /api/planejamentos/:id` | Atualiza o projeto salvo |

## Publicar o salvamento online

O site está no GitHub Pages. A API deste PR escuta apenas em `127.0.0.1` e foi preparada para desenvolvimento local. Para colocar os planejamentos online:

1. Adicione login e associe cada planejamento a uma conta. A API deve obter a identidade do login e filtrar todas as leituras e alterações pelo dono do projeto.
2. Crie um PostgreSQL hospedado, por exemplo no [Neon](https://neon.com/docs/connect/connect-from-any-app). Configure a `DATABASE_URL` no serviço de backend e rode as migrações no banco online.
3. Hospede o Express como [Web Service no Render](https://render.com/docs/web-services). Adapte a inicialização para ler as variáveis do serviço, escutar em `0.0.0.0` e usar a porta fornecida pelo Render. Use a raiz do repositório no deploy, pois o backend importa as regras de geometria de `src/`.
4. No Express, configure `FRONTEND_ORIGIN=https://igor-vasconcelos.github.io`. No workflow de publicação do GitHub Pages, passe `VITE_API_URL` para o passo de build do Vite. Use a URL pública da API com o caminho `/api`, como `https://seu-servico.onrender.com/api`. A credencial do PostgreSQL fica no backend.
5. Publique novamente o front-end e teste na mesma conta em dois dispositivos. Abra uma segunda conta e verifique que ela só consegue acessar os próprios projetos.

Para sincronizar também o Histórico de cultivo, o backend precisará de uma tabela e rotas para os registros de plantio e colheita. Os registros existentes ficam disponíveis no navegador onde foram salvos e podem ser importados pela pessoa depois de entrar na conta.
