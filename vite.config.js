import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const entradasArtigos = existsSync("artigos/index.html")
  ? [resolve("artigos/index.html"), ...readdirSync("artigos", { withFileTypes: true })
    .filter(item => item.isDirectory())
    .map(item => resolve("artigos", item.name, "index.html"))]
  : [];

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    rolldownOptions: {
      input: [
        "index.html",
        "meu-quintal/index.html",
        "sisteminha.html",
        "horta/index.html",
        "horta/organizador/index.html",
        "horta/canteiros/index.html",
        "horta/calendario-de-plantio/index.html",
        "ferramentas/calculadora-peixes/index.html",
        "ferramentas/calculadora-codornas/index.html",
        "ferramentas/planejador-de-pomar/index.html",
        "guias/index.html",
        "guias/compostagem/index.html",
        "guias/irrigacao/index.html",
        "mapa-do-site/index.html",
        ...entradasArtigos,
      ],
    },
  },
});
