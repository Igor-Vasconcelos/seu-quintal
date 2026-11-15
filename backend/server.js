import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import cookieParser from "cookie-parser";
import express from "express";
import { rateLimit } from "express-rate-limit";
import { politicaConteudo } from "../politica-conteudo.js";
import { contas, exigirConta } from "./contas.js";
import { banco } from "./db.js";
import { ehUuid, validarPlanejamento } from "./validar-planejamento.js";

const app = express();
const porta = Number(process.env.PORT || 3001);
const producao = process.env.NODE_ENV === "production";
const urlSite = new URL(process.env.FRONTEND_ORIGIN || process.env.RENDER_EXTERNAL_URL || "http://localhost:5173");
const dist = fileURLToPath(new URL("../dist/", import.meta.url));

if (producao && (urlSite.protocol !== "https:" || !existsSync(dist))) {
  throw new Error("A produção exige uma origem HTTPS e o build do site em dist/.");
}

app.disable("x-powered-by");
if (producao && process.env.RENDER === "true") app.set("trust proxy", 1);
const resumo = "id, nome, largura::float8 AS largura, profundidade::float8 AS profundidade, atualizado_em";
const completo = `${resumo}, itens`;

app.use((_req, res, next) => {
  res.set({
    "Content-Security-Policy": `${politicaConteudo}; frame-ancestors 'none'`,
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  });
  if (producao) res.set("Strict-Transport-Security", "max-age=31536000");
  next();
});

app.use("/api", (_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.get("/api/health", async (_req, res) => {
  await banco.query("SELECT dono_id FROM planejamentos LIMIT 0");
  res.json({ status: "ok" });
});

function limitar(windowMs, limit) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { erro: "Muitas requisições. Aguarde um pouco e tente novamente." },
  });
}

app.use("/api", limitar(60_000, 120), cookieParser(), (req, res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method) && req.get("Origin") !== urlSite.origin) {
    return res.status(403).json({ erro: "Esta ação só pode ser enviada pelo Seu Quintal." });
  }
  next();
});
app.post(["/api/auth/entrar", "/api/auth/cadastro"], limitar(15 * 60_000, 20));
app.use("/api/auth", express.json({ limit: "8kb" }), contas);
app.use("/api/planejamentos", exigirConta, express.json({ limit: "1mb" }));

const tamanhoPagina = 20;

app.get("/api/planejamentos", async (req, res) => {
  const depois = req.query.depois ?? null;
  if (depois !== null && !ehUuid(depois)) return res.status(400).json({ erro: "Página inválida." });

  const { rows } = await banco.query(
    `SELECT ${resumo} FROM planejamentos
     WHERE dono_id = $1 AND (
       $2::uuid IS NULL OR (criado_em, id) < (
         SELECT criado_em, id FROM planejamentos WHERE dono_id = $1 AND id = $2
       )
     )
     ORDER BY criado_em DESC, id DESC LIMIT $3`,
    [req.conta.id, depois, tamanhoPagina + 1],
  );
  const projetos = rows.slice(0, tamanhoPagina);
  res.json({ projetos, proxima: rows.length > tamanhoPagina ? projetos.at(-1).id : null });
});

app.get("/api/planejamentos/:id", async (req, res) => {
  const { id } = req.params;
  if (!ehUuid(id)) return res.status(400).json({ erro: "Código do projeto inválido." });

  const { rows: [projeto] } = await banco.query(
    `SELECT ${completo} FROM planejamentos WHERE id = $1 AND dono_id = $2`, [id, req.conta.id],
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
    `INSERT INTO planejamentos (id, nome, largura, profundidade, itens, dono_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (id) DO UPDATE SET id = EXCLUDED.id
     WHERE planejamentos.dono_id = EXCLUDED.dono_id
       AND (planejamentos.nome, planejamentos.largura, planejamentos.profundidade, planejamentos.itens)
       = (EXCLUDED.nome, EXCLUDED.largura, EXCLUDED.profundidade, EXCLUDED.itens)
     RETURNING ${completo}`,
    [id, nome, largura, profundidade, JSON.stringify(itens), req.conta.id],
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
     WHERE id = $1 AND dono_id = $6
     RETURNING ${completo}`,
    [id, nome, largura, profundidade, JSON.stringify(itens), req.conta.id],
  );
  if (!projeto) return res.status(404).json({ erro: "Projeto não encontrado." });
  res.json(projeto);
});

app.use("/api", (_req, res) => res.status(404).json({ erro: "Rota não encontrada." }));
if (producao) app.use(express.static(dist, { dotfiles: "ignore" }));
app.use((_req, res) => res.status(404).send("Página não encontrada."));

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

const servidor = app.listen(porta, producao ? "0.0.0.0" : "127.0.0.1", (erro) => {
  if (erro) throw erro;
  console.log(`Seu Quintal disponível na porta ${servidor.address().port}.`);
});
