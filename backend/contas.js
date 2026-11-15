import { createHash, randomBytes, randomUUID, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { Router } from "express";
import { banco } from "./db.js";

const derivar = promisify(scrypt);
const hashSenha = (senha, sal) => derivar(senha, sal, 64, { N: 2 ** 15, r: 8, p: 3, maxmem: 64 * 1024 ** 2 });
const salFicticio = randomBytes(16);
const hashFicticio = randomBytes(64);
const duracaoSessao = 7 * 24 * 60 * 60 * 1000;
const producao = process.env.NODE_ENV === "production";
const nomeCookie = producao ? "__Host-seu-quintal" : "seu-quintal-local";
const opcaoCookie = { httpOnly: true, secure: producao, sameSite: "lax", path: "/" };
const hashToken = (token) => createHash("sha256").update(token).digest();

function credenciais(dados) {
  const usuario = typeof dados?.usuario === "string" ? dados.usuario.trim().toLowerCase() : "";
  const senha = dados?.senha;
  if (!/^[a-z0-9][a-z0-9._-]{2,31}$/.test(usuario) ||
      typeof senha !== "string" || senha.length < 15 || senha.length > 128) return null;
  return { usuario, senha };
}

function tokenRecebido(req) {
  const token = req.cookies[nomeCookie];
  return typeof token === "string" && /^[A-Za-z0-9_-]{43}$/.test(token) ? hashToken(token) : null;
}

async function consultarConta(req) {
  const token = tokenRecebido(req);
  if (!token) return null;
  const { rows: [conta] } = await banco.query(
    `SELECT contas.id, contas.usuario
     FROM sessoes JOIN contas ON contas.id = sessoes.conta_id
     WHERE sessoes.token_hash = $1 AND sessoes.expira_em > now()`,
    [token],
  );
  return conta ?? null;
}

export async function exigirConta(req, res, next) {
  const conta = await consultarConta(req);
  const esperada = req.get("X-Conta-Esperada");
  if (!conta || (esperada && esperada !== conta.id)) {
    return res.status(401).json({ erro: "Entre na sua conta para acessar seus projetos." });
  }
  req.conta = conta;
  next();
}

async function iniciarSessao(req, res, conta, novaConta) {
  const token = randomBytes(32).toString("base64url");
  const cliente = await banco.connect();

  try {
    await cliente.query("BEGIN");
    if (novaConta) {
      const { sal, hash } = novaConta;
      const criada = await cliente.query(
        "INSERT INTO contas (id, usuario, sal, senha_hash) VALUES ($1, $2, $3, $4) ON CONFLICT (usuario) DO NOTHING",
        [conta.id, conta.usuario, sal, hash],
      );
      if (!criada.rowCount) {
        await cliente.query("ROLLBACK");
        return res.status(409).json({ erro: "Este nome de usuário já está em uso." });
      }
    }
    await cliente.query(
      "DELETE FROM sessoes WHERE token_hash = $1 OR expira_em <= now()",
      [tokenRecebido(req)],
    );
    await cliente.query(
      "INSERT INTO sessoes (token_hash, conta_id, expira_em) VALUES ($1, $2, $3)",
      [hashToken(token), conta.id, new Date(Date.now() + duracaoSessao)],
    );
    await cliente.query("COMMIT");
  } catch (erro) {
    await cliente.query("ROLLBACK");
    throw erro;
  } finally {
    cliente.release();
  }

  res.cookie(nomeCookie, token, { ...opcaoCookie, maxAge: duracaoSessao });
  res.status(novaConta ? 201 : 200).json({ conta });
}

export const contas = Router();

contas.get("/sessao", async (req, res) => {
  res.json({ conta: await consultarConta(req) });
});

contas.post("/cadastro", async (req, res) => {
  const dados = credenciais(req.body);
  if (!dados) {
    return res.status(400).json({ erro: "Use um usuário de 3 a 32 caracteres e uma senha de 15 a 128 caracteres." });
  }
  const sal = randomBytes(16);
  const hash = await hashSenha(dados.senha, sal);
  await iniciarSessao(req, res, { id: randomUUID(), usuario: dados.usuario }, { sal, hash });
});

contas.post("/entrar", async (req, res) => {
  const dados = credenciais(req.body);
  const falha = () => res.status(401).json({ erro: "Usuário ou senha incorretos." });
  if (!dados) return falha();

  const { rows: [conta] } = await banco.query(
    "SELECT id, usuario, sal, senha_hash FROM contas WHERE usuario = $1", [dados.usuario],
  );
  const hash = await hashSenha(dados.senha, conta?.sal ?? salFicticio);
  const confere = timingSafeEqual(hash, conta?.senha_hash ?? hashFicticio);
  if (!confere || !conta) return falha();

  await iniciarSessao(req, res, { id: conta.id, usuario: conta.usuario });
});

contas.post("/sair", exigirConta, async (req, res) => {
  const token = tokenRecebido(req);
  if (token) await banco.query("DELETE FROM sessoes WHERE token_hash = $1", [token]);
  res.clearCookie(nomeCookie, opcaoCookie);
  res.json({ conta: null });
});
