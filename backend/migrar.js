import { readdir, readFile } from "node:fs/promises";
import { banco } from "./db.js";

try {
  const pasta = new URL("./migrations/", import.meta.url);
  const arquivos = (await readdir(pasta)).filter((nome) => nome.endsWith(".sql")).sort();
  const cliente = await banco.connect();

  try {
    await cliente.query("BEGIN");
    await cliente.query("SELECT pg_advisory_xact_lock(317142560)");
    await cliente.query("CREATE TABLE IF NOT EXISTS migracoes (arquivo text PRIMARY KEY)");
    for (const arquivo of arquivos) {
      const executada = await cliente.query("SELECT 1 FROM migracoes WHERE arquivo = $1", [arquivo]);
      if (executada.rowCount) continue;
      await cliente.query(await readFile(new URL(arquivo, pasta), "utf8"));
      await cliente.query("INSERT INTO migracoes (arquivo) VALUES ($1)", [arquivo]);
    }
    await cliente.query("COMMIT");
    console.log("Migrações do Seu Quintal atualizadas.");
  } catch (erro) {
    await cliente.query("ROLLBACK");
    throw erro;
  } finally {
    cliente.release();
  }
} finally {
  await banco.end();
}
