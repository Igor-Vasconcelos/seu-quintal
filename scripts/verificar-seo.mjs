// Validação de SEO estático após o build do Vite.
// Não depende de servidor ou navegador: detecta conteúdo ausente antes do deploy.
import { existsSync, readFileSync, readdirSync } from "node:fs";
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
  const pastaArtigos = join(DIST, "artigos");
  const paginas = ["index.html", ...readdirSync(pastaArtigos, { withFileTypes: true })
    .filter(item => item.isDirectory())
    .flatMap(item => readdirSync(join(pastaArtigos, item.name))
      .filter(nome => nome.endsWith(".html")).map(nome => item.name + "/" + nome))];
  const urlsHtml = paginas.map(relativo => ORIGIN + "/artigos/" +
    (relativo === "index.html" ? "" : relativo.replace(/index\.html$/, "")));
  // Paridade bidirecional: nem HTML órfão nem URL fantasma no sitemap.
  for (const url of urlsHtml) garantir(urls.includes(url), "HTML fora do sitemap: " + url);
  const urlsXml = urls.filter(url => url.startsWith(ORIGIN + "/artigos/"));
  garantir(urlsXml.length === urlsHtml.length && urlsXml.every(url => urlsHtml.includes(url)),
    "HTML e sitemap dos artigos estão diferentes");
  garantir(catalogo.length === paginas.length - 1,
    "catálogo de artigos e arquivos HTML não correspondem");

  const titulos = new Set();
  for (const artigo of catalogo) {
    const url = ORIGIN + "/artigos/" + artigo.slug + "/";
    garantir(urls.includes(url), "artigo publicado fora do sitemap: " + artigo.slug);
    const html = readFileSync(arquivoDaUrl(url), "utf8");
    const titulo = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
    const descricao = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1]?.trim();
    garantir(Boolean(titulo) && !titulos.has(titulo), "title vazio ou repetido: " + artigo.slug);
    titulos.add(titulo);
    garantir(Boolean(descricao), "meta description vazia: " + artigo.slug);
    garantir((html.match(/<h1\b/gi) || []).length === 1, "H1 ausente/duplicado: " + artigo.slug);
    garantir(/<article\b/i.test(html) && /class="sq-prose"/.test(html) &&
      /<h2\s+id=/i.test(html), "artigo sem HTML principal: " + artigo.slug);
    garantir(html.includes('rel="canonical" href="' + url + '"'), "canonical divergente: " + artigo.slug);
    for (const property of ["og:title", "og:description", "og:image", "og:url"]) {
      garantir(new RegExp('property="' + property + '" content="[^"]+"').test(html),
        "Open Graph incompleto (" + property + "): " + artigo.slug);
    }
    garantir(html.includes('property="og:image" content="' + ORIGIN + artigo.imagem + '"'),
      "og:image diferente da imagem do artigo: " + artigo.slug);
    garantir(/href="\.\.\/"/.test(html) &&
      /href="\.\.\/\.\.\/(?:horta|guias|ferramentas|sisteminha)/.test(html),
      "artigo órfão, sem navegação e CTA contextual: " + artigo.slug);

    const scripts = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map(match => JSON.parse(match[1]));
    const schema = scripts.find(item => item["@type"] === "BlogPosting");
    garantir(schema && schema.headline === artigo.titulo &&
      schema.url === url && schema.image === ORIGIN + artigo.imagem &&
      Boolean(schema.author?.name), "schema Article inválido: " + artigo.slug);
    for (const field of ["datePublished", "dateModified"]) {
      if (schema[field]) garantir(/^\d{4}-\d{2}-\d{2}$/.test(schema[field]),
        "data inválida no schema: " + field + "/" + artigo.slug);
    }
    const faq = scripts.find(item => item["@type"] === "FAQPage");
    if (faq) {
      garantir(Array.isArray(faq.mainEntity) && faq.mainEntity.length > 0,
        "FAQ sem perguntas em " + artigo.slug);
      for (const item of faq.mainEntity) {
        garantir(item.name && item.acceptedAnswer?.text &&
          html.includes(item.name.replace(/&/g, "&amp;").replace(/</g, "&lt;")),
          "FAQ não visível no texto: " + artigo.slug);
      }
    }
  }
  const robots = join(DIST, "robots.txt");
  garantir(existsSync(robots), "robots.txt ausente do build");
  garantir(readFileSync(robots, "utf8").includes("Sitemap: " + ORIGIN + "/sitemap.xml"),
    "robots.txt sem endereço completo do sitemap");

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
