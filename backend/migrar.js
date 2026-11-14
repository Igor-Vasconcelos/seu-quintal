import { readFile } from "node:fs/promises";
import { banco } from "./db.js";

try {
  const sql = await readFile(new URL("./migrations/001_planejamentos.sql", import.meta.url), "utf8");
  await banco.query(sql);
  console.log("Tabela de planejamentos pronta.");
} finally {
  await banco.end();
}
