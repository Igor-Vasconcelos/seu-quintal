import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { politicaConteudo } from "./politica-conteudo.js";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const api = env.VITE_API_URL?.trim();
  const destino = /^https?:\/\//.test(api ?? "") ? new URL(api).origin : "http://127.0.0.1:3001";

  return {
    plugins: [
      react(),
      {
        name: "seu-quintal-csp",
        apply: "build",
        transformIndexHtml: () => [{
          tag: "meta",
          attrs: { "http-equiv": "Content-Security-Policy", content: politicaConteudo },
          injectTo: "head-prepend",
        }],
      },
    ],
    base: "./",
    server: { proxy: api ? { "/api": destino } : undefined },
    build: {
      rolldownOptions: {
        input: ["index.html", "sisteminha.html"],
      },
    },
  };
});
