import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    rolldownOptions: {
      input: [
        "index.html",
        "sisteminha.html",
        "horta/index.html",
        "horta/organizador/index.html",
        "horta/calendario-de-plantio/index.html",
        "mapa-do-site/index.html",
      ],
    },
  },
});
