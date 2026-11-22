// Validação de SEO estático após o build do Vite.
// Não depende de servidor ou navegador: detecta conteúdo ausente antes do deploy.
import { existsSync, readFileSync } from "node:fs";
import { resolve, join, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const DIST = join(ROOT, "dist");
const ORIGIN = "https://igor-vasconcelos.github.io/seu-quintal";

function garantir(condicao, mensagem) {
  if (!condicao) throw new Error("SEO estático: " + mensagem);
}

function arquivoDaUrl(url) {
  const parsed = new URL(url);
  garantir(parsed.origin === new URL(ORIGIN).origin, "URL externa no sitemap: " + url);
  garantir(parsed.pathname.startsWith("/seu-quintal/"), "URL fora do projeto: " + url);
  const relativo = parsed.pathname.slice("/seu-quintal/".length);
  garantir(!relativo.split("/").includes(".."), "Caminho inválido: " + url);
  return resolve(DIST, relativo.endsWith(".html") ? relativo : join(relativo, "index.html"));
}

function extrairUrlSitemap(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
}

export function verificarSeoEstatico() {
  const sitemap = join(DIST, "sitemap.xml");
  garantir(existsSync(sitemap), "sitemap.xml não foi copiado para dist");
  garantir(existsSync(join(DIST, "imagens", "marca-seu-quintal.svg")),
    "ícone da marca não encontrado no build");

  const urls = extrairUrlSitemap(readFileSync(sitemap, "utf8"));
  garantir(urls.length > 0, "sitemap vazio");
  garantir(new Set(urls).size === urls.length, "URLs duplicadas no sitemap");

  for (const url of urls) {
    const arquivo = arquivoDaUrl(url);
    garantir(arquivo.startsWith(DIST + sep), "Caminho fora de dist: " + url);
    garantir(existsSync(arquivo), "URL do sitemap sem página HTML: " + url);
    const html = readFileSync(arquivo, "utf8");
    const canonical = html.match(/<link\b[^>]*\brel="canonical"[^>]*\bhref="([^"]+)"/i)?.[1];
    garantir(canonical === url,
      "canonical divergente em " + url + " (encontrado: " + (canonical ?? "nenhum") + ")");
    garantir(/<h1\b/i.test(html) || /<div id="root"><\/div>/.test(html),
      "página sem título ou ponto de montagem: " + url);
  }

  const catalogo = JSON.parse(readFileSync(join(ROOT, "src", "data", "artigos-publicados.json"), "utf8"));
  for (const artigo of catalogo) {
    const url = ORIGIN + "/artigos/" + artigo.slug + "/";
    garantir(urls.includes(url), "artigo publicado fora do sitemap: " + artigo.slug);
    const html = readFileSync(arquivoDaUrl(url), "utf8");
    garantir(/<article\b/.test(html) && /class="sq-prose"/.test(html) &&
      /<h2\s+id=/.test(html), "artigo sem conteúdo pré-gerado no HTML: " + artigo.slug);
    garantir((html.match(/<h1\b/g) || []).length === 1,
      "artigo com quantidade incorreta de H1: " + artigo.slug);
  }

  // Os guias editoriais já possuem conteúdo explicativo em HTML, sem exigir JavaScript.
  for (const path of ["/guias/", "/horta/", "/guias/compostagem/", "/guias/irrigacao/"]) {
    const html = readFileSync(arquivoDaUrl(ORIGIN + path), "utf8");
    garantir(/<h1\b/.test(html) && /<main\b/.test(html) &&
      /<p\b/.test(html), "guia sem HTML semântico inicial: " + path);
  }
  return { paginas: urls.length, artigos: catalogo.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = verificarSeoEstatico();
  console.info("SEO estático OK: " + result.paginas + " páginas; " +
    result.artigos + " artigo(s) já presentes no HTML.");
}
