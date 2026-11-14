import { randomUUID } from "node:crypto";
import cors from "cors";
import express from "express";
import { banco } from "./db.js";
import { ehUuid, validarPlanejamento } from "./validar-planejamento.js";

const app = express();
const porta = Number(process.env.PORT || 3001);
const origem = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const resumo = "id, nome, largura::float8 AS largura, profundidade::float8 AS profundidade, atualizado_em";
const completo = `${resumo}, itens`;

app.use(cors({ origin: origem }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", async (_req, res) => {
  await banco.query("SELECT 1 FROM planejamentos LIMIT 0");
  res.json({ status: "ok" });
});

app.get("/api/planejamentos", async (_req, res) => {
  const { rows } = await banco.query(`SELECT ${resumo} FROM planejamentos ORDER BY atualizado_em DESC, id`);
  res.json(rows);
});

app.get("/api/planejamentos/:id", async (req, res) => {
  const { id } = req.params;
  if (!ehUuid(id)) return res.status(400).json({ erro: "Código do projeto inválido." });

  const { rows: [projeto] } = await banco.query(
    `SELECT ${completo} FROM planejamentos WHERE id = $1`, [id],
  );
  if (!projeto) return res.status(404).json({ erro: "Projeto não encontrado." });
  res.json(projeto);
});

app.post("/api/planejamentos", async (req, res) => {
  const id = req.body?.id ?? randomUUID();
  if (!ehUuid(id)) return res.status(400).json({ erro: "Código do projeto inválido." });

  const { nome, largura, profundidade, itens, erro } = validarPlanejamento(req.body);
  if (erro) return res.status(400).json({ erro });

  // Com o mesmo ID, repetir um envio que já chegou ao banco deixa um único projeto.
  const { rows: [projeto] } = await banco.query(
    `INSERT INTO planejamentos (id, nome, largura, profundidade, itens)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (id) DO UPDATE SET id = EXCLUDED.id
     WHERE (planejamentos.nome, planejamentos.largura, planejamentos.profundidade, planejamentos.itens)
       = (EXCLUDED.nome, EXCLUDED.largura, EXCLUDED.profundidade, EXCLUDED.itens)
     RETURNING ${completo}`,
    [id, nome, largura, profundidade, JSON.stringify(itens)],
  );
  if (!projeto) {
    return res.status(409).json({ erro: "Já existe um projeto com esse código. Abra a versão salva para editar." });
  }
  res.location(`/api/planejamentos/${id}`).status(201).json(projeto);
});

app.put("/api/planejamentos/:id", async (req, res) => {
  const { id } = req.params;
  if (!ehUuid(id)) return res.status(400).json({ erro: "Código do projeto inválido." });

  const { nome, largura, profundidade, itens, erro } = validarPlanejamento(req.body);
  if (erro) return res.status(400).json({ erro });

  const { rows: [projeto] } = await banco.query(
    `UPDATE planejamentos
     SET nome = $2, largura = $3, profundidade = $4, itens = $5, atualizado_em = now()
     WHERE id = $1
     RETURNING ${completo}`,
    [id, nome, largura, profundidade, JSON.stringify(itens)],
  );
  if (!projeto) return res.status(404).json({ erro: "Projeto não encontrado." });
  res.json(projeto);
});

app.use((_req, res) => res.status(404).json({ erro: "Rota não encontrada." }));

app.use((erro, _req, res, _next) => {
  if (erro.type === "entity.parse.failed") {
    return res.status(400).json({ erro: "Os dados enviados precisam ser JSON válido." });
  }
  if (erro.type === "entity.too.large") {
    return res.status(413).json({ erro: "O projeto excede o tamanho aceito pela API." });
  }
  console.error("Falha ao consultar o banco:", erro.code ?? erro.name);
  res.status(500).json({ erro: "O banco de dados está indisponível. Tente novamente." });
});

const servidor = app.listen(porta, "127.0.0.1", (erro) => {
  if (erro) throw erro;
  console.log(`API do Seu Quintal em http://127.0.0.1:${servidor.address().port}/api`);
});
