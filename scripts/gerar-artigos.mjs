import { readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(ROOT, "content", "artigos");
const TARGET = join(ROOT, "artigos");
const ORIGIN = "https://igor-vasconcelos.github.io/seu-quintal";
const REQUIRED = ["titulo", "descricao", "categoria", "autor", "imagem", "imagemAlt", "ferramentaUrl", "ferramentaTexto", "status"];
const EXISTING = ["/", "/horta/", "/horta/calendario-de-plantio/", "/horta/organizador/", "/horta/canteiros/", "/guias/",
  "/guias/compostagem/", "/guias/irrigacao/", "/meu-quintal/", "/sisteminha.html", "/mapa-do-site/",
  "/ferramentas/calculadora-peixes/", "/ferramentas/planejador-de-pomar/"];

export function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function pathOnly(value) {
  if (!/^\/[a-z0-9/_.-]+\/?$/.test(value) || value.includes("//") || value.includes("..")) {
    throw new Error("Caminho interno inválido: " + value);
  }
  return value;
}

export function readArticle(source, file) {
  const match = source.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n([\s\S]+)$/);
  if (!match) throw new Error("Frontmatter obrigatório em " + file);
  const meta = {};
  for (const line of match[1].split("\n").filter(Boolean)) {
    const pair = line.match(/^([a-zA-Z][a-zA-Z0-9]*):\s*(.*)$/);
    if (!pair) throw new Error("Metadado inválido em " + file);
    if (Object.hasOwn(meta, pair[1])) throw new Error("Metadado repetido: " + pair[1]);
    const raw = pair[2].trim();
    meta[pair[1]] = raw.startsWith('"') && raw.endsWith('"') ? raw.slice(1, -1) : raw;
  }
  for (const key of REQUIRED) if (!meta[key]) throw new Error("Metadado ausente em " + file + ": " + key);
  if (!["publicado", "rascunho"].includes(meta.status)) throw new Error("Status inválido: " + meta.status);
  pathOnly(meta.imagem);
  pathOnly(meta.ferramentaUrl);
  if (meta.dataPublicacao && !/^\d{4}-\d{2}-\d{2}$/.test(meta.dataPublicacao)) {
    throw new Error("Data inválida em " + file);
  }
  return { ...meta, markdown: match[2] };
}

function linkTarget(value, prefix) {
  if (value.startsWith("/")) return prefix + pathOnly(value).slice(1);
  if (/^https:\/\/[^\s"'<>]+$/.test(value)) return value;
  if (/^#[a-z0-9_-]+$/.test(value)) return value;
  throw new Error("Link não suportado: " + value);
}

export function inlineMarkdown(text, prefix) {
  let html = escapeHtml(text);
  html = html.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
    const target = linkTarget(href.replaceAll("&amp;", "&"), prefix);
    return '<a href="' + escapeHtml(target) + '"' +
      (target.startsWith("https://") ? ' rel="noopener noreferrer"' : "") + ">" + label + "</a>";
  });
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return html;
}

export function renderMarkdown(markdown, prefix) {
  const output = [], headings = [], ids = new Set();
  let paragraph = [], list = "";
  function closeParagraph() {
    if (!paragraph.length) return;
    output.push("<p>" + inlineMarkdown(paragraph.join(" "), prefix) + "</p>");
    paragraph = [];
  }
  function closeList() {
    if (list) output.push("</" + list + ">");
    list = "";
  }
  for (const line of markdown.replace(/\r\n/g, "\n").split("\n")) {
    if (!line.trim()) { closeParagraph(); closeList(); continue; }
    const heading = line.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      closeParagraph(); closeList();
      const level = heading[1].length;
      const base = heading[2].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "topico";
      let id = base, suffix = 2;
      while (ids.has(id)) id = base + "-" + suffix++;
      ids.add(id);
      headings.push({ id, name: heading[2], level });
      output.push("<h" + level + ' id="' + id + '">' + inlineMarkdown(heading[2], prefix) + "</h" + level + ">");
      continue;
    }
    if (/^#\s/.test(line)) throw new Error("O H1 é gerado do título; use H2/H3 no Markdown.");
    const item = line.match(/^([-*]|\d+\.)\s+(.+)$/);
    if (item) {
      closeParagraph();
      const kind = /^\d/.test(item[1]) ? "ol" : "ul";
      if (list !== kind) { closeList(); output.push("<" + kind + ">"); list = kind; }
      output.push("<li>" + inlineMarkdown(item[2], prefix) + "</li>");
      continue;
    }
    closeList(); paragraph.push(line.trim());
  }
  closeParagraph(); closeList();
  return { html: output.join("\n"), headings };
}

function layout({ title, description, path, prefix, body, image, kind = "website", extraHead = "" }) {
  const nav = '<a href="' + prefix + '">Início</a><a href="' + prefix + 'horta/">Horta</a>' +
    '<a href="' + prefix + '#ferramentas">Ferramentas</a>' +
    '<a href="' + prefix + 'guias/">Guias</a><a href="' + prefix + 'artigos/">Artigos</a>' +
    '<a href="' + prefix + 'sisteminha.html">Sisteminha</a>';
  return [
    '<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<meta name="theme-color" content="#183C2B">',
    "<title>" + escapeHtml(title) + " | Seu Quintal</title>",
    '<meta name="description" content="' + escapeHtml(description) + '">',
    '<link rel="canonical" href="' + ORIGIN + path + '">',
    '<meta property="og:type" content="' + kind + '">',
    '<meta property="og:title" content="' + escapeHtml(title) + '">',
    '<meta property="og:description" content="' + escapeHtml(description) + '">',
    '<meta property="og:url" content="' + ORIGIN + path + '">',
    image ? '<meta property="og:image" content="' + ORIGIN + image + '">' : "",
    '<link rel="icon" href="' + prefix + 'favicon.svg" type="image/svg+xml">',
    '<script type="module" src="' + prefix + 'src/main-artigos.js"></script>', extraHead,
    '</head><body class="sq-artigos"><a class="sq-skip" href="#conteudo">Pular para o conteúdo</a>',
    '<header class="sq-header"><div class="sq-container sq-header-inner">',
    '<a class="sq-brand" href="' + prefix + '" aria-label="Seu Quintal, página inicial">' +
      '<img src="' + prefix + 'favicon.svg" width="42" height="42" alt="" aria-hidden="true">' +
      '<span class="sq-brand-text"><strong>Seu Quintal</strong><small>Da primeira muda ao seu sítio.</small></span></a>',
    '<nav class="sq-desktop-nav" aria-label="Menu principal">' + nav + "</nav>",
    '<a class="sq-account" href="' + prefix + 'meu-quintal/">Meu Quintal</a>',
    '<details class="sq-mobile-menu"><summary>Menu</summary><nav aria-label="Menu para celular">' + nav + '</nav></details>',
    '</div></header>',
    '<main id="conteudo" class="sq-container" tabindex="-1">' + body + "</main>",
    '<footer class="sq-footer"><div class="sq-container"><p><strong>Seu Quintal</strong> — Da primeira muda ao seu sítio.</p>',
    '<nav aria-label="Links do rodapé"><a href="' + prefix + '">Início</a><a href="' + prefix + 'artigos/">Artigos</a>',
    '<a href="' + prefix + 'guias/">Guias</a><a href="' + prefix + 'meu-quintal/">Meu Quintal</a></nav>',
    '</div></footer></body></html>',
  ].filter(Boolean).join("\n");
}

function renderArticle(article) {
  const prefix = "../../", path = "/artigos/" + article.slug + "/";
  const content = renderMarkdown(article.markdown, prefix);
  const summary = content.headings.filter(x => x.level === 2);
  const toc = summary.length > 1 ? '<nav class="sq-toc" aria-label="Neste artigo"><strong>Neste artigo</strong><ol>' +
    summary.map(x => '<li><a href="#' + x.id + '">' + escapeHtml(x.name) + "</a></li>").join("") + "</ol></nav>" : "";
  const date = article.dataPublicacao
    ? '<time datetime="' + article.dataPublicacao + '">' + escapeHtml(article.dataPublicacao.split("-").reverse().join("/")) + "</time>"
    : "";
  const tool = '<aside class="sq-tool"><p class="sq-eyebrow">COLOQUE EM PRÁTICA</p>' +
    '<h2>Experimente uma ferramenta gratuita</h2><p>Transforme o aprendizado em um plano para seu espaço.</p>' +
    '<a class="sq-button" href="' + linkTarget(article.ferramentaUrl, prefix) + '">' + escapeHtml(article.ferramentaTexto) + "</a></aside>";
  const body = '<nav class="sq-breadcrumb" aria-label="Você está aqui"><a href="../../">Início</a> / <a href="../">Artigos</a> / ' +
    escapeHtml(article.categoria) + '</nav><article class="sq-article"><header class="sq-article-header">' +
    '<p class="sq-eyebrow">' + escapeHtml(article.categoria) + "</p><h1>" + escapeHtml(article.titulo) + "</h1>" +
    '<p class="sq-lede">' + escapeHtml(article.descricao) + "</p>" +
    '<p class="sq-byline">Por ' + escapeHtml(article.autor) + (date ? " · " + date : "") + "</p></header>" +
    '<figure class="sq-hero-image"><img src="../../' + article.imagem.slice(1) +
    '" alt="' + escapeHtml(article.imagemAlt) + '" width="1200" height="675" decoding="async"></figure>' +
    '<div class="sq-article-layout">' + toc + '<div class="sq-prose">' + content.html + tool + "</div></div></article>" +
    '<p class="sq-back"><a href="../">Ver todos os artigos</a></p>';
  const structured = {
    "@context": "https://schema.org", "@type": "BlogPosting", headline: article.titulo,
    description: article.descricao, mainEntityOfPage: ORIGIN + path,
    author: { "@type": "Organization", name: article.autor },
  };
  if (article.dataPublicacao) structured.datePublished = article.dataPublicacao;
  const json = JSON.stringify(structured).replace(/</g, "\\u003c");
  return layout({ title: article.titulo, description: article.descricao, path, prefix, body,
    image: article.imagem, kind: "article",
    extraHead: '<script type="application/ld+json">' + json + "</script>" });
}

function categoryId(text) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function renderIndex(articles) {
  const categories = [...new Set(articles.map(x => x.categoria))];
  const sections = categories.map(category => '<section class="sq-category" id="' + categoryId(category) + '">' +
    "<h2>" + escapeHtml(category) + '</h2><ul class="sq-grid">' +
    articles.filter(x => x.categoria === category).map(article =>
      '<li><a class="sq-card" href="./' + article.slug + '/">' +
      '<img src="../' + article.imagem.slice(1) + '" alt="" loading="lazy" width="792" height="446">' +
      '<div><p class="sq-eyebrow">' + escapeHtml(category) + "</p><h3>" + escapeHtml(article.titulo) +
      "</h3><p>" + escapeHtml(article.descricao) +
      "</p><span>Leia o artigo →</span></div></a></li>").join("\n") + "</ul></section>").join("\n");
  const body = '<header class="sq-index-intro"><p class="sq-eyebrow">APRENDA NO SEU RITMO</p>' +
    "<h1>Artigos e guias para seu quintal</h1>" +
    '<p class="sq-lede">Dúvidas reais, respostas práticas e ferramentas gratuitas para planejar e cultivar seu espaço.</p></header>' +
    '<nav class="sq-categories" aria-label="Filtrar por assunto">' +
    categories.map(x => '<a href="#' + categoryId(x) + '">' + escapeHtml(x) + "</a>").join("") + "</nav>" + sections;
  return layout({ title: "Artigos e guias", description: "Artigos práticos sobre horta, animais e planejamento, conectados às ferramentas gratuitas do Seu Quintal.", path: "/artigos/", prefix: "../", body });
}

export function generateArticles() {
  const files = readdirSync(SOURCE).filter(name => name.endsWith(".md")).sort();
  const articles = files.map(name => {
    const slug = name.slice(0, -3);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Slug inválido: " + name);
    return { ...readArticle(readFileSync(join(SOURCE, name), "utf8"), name), slug };
  }).filter(x => x.status === "publicado");
  rmSync(TARGET, { recursive: true, force: true });
  mkdirSync(TARGET, { recursive: true });
  writeFileSync(join(TARGET, "index.html"), renderIndex(articles));
  for (const article of articles) {
    const folder = join(TARGET, article.slug);
    mkdirSync(folder, { recursive: true });
    writeFileSync(join(folder, "index.html"), renderArticle(article));
  }
  // A Home usa o mesmo catálogo editorial; nenhum card precisa ser cadastrado duas vezes.
  const destaques = articles.map(({ slug, titulo, descricao, categoria, imagem, imagemAlt }) =>
    ({ slug, titulo, descricao, categoria, imagem, imagemAlt }));
  writeFileSync(join(ROOT, "src", "data", "artigos-publicados.json"),
    JSON.stringify(destaques, null, 2) + "\n");
  const urls = [...EXISTING, "/artigos/", ...articles.map(x => "/artigos/" + x.slug + "/")];
  const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map(x => "  <url><loc>" + ORIGIN + x + "</loc></url>").join("\n") + "\n</urlset>\n";
  writeFileSync(join(ROOT, "public", "sitemap.xml"), sitemap);
  return articles.length;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.info("Seu Quintal: " + generateArticles() + " artigo(s) e sitemap gerados.");
}
