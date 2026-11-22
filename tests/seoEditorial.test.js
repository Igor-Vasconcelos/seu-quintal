import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { extractFaqs, readArticle } from "../scripts/gerar-artigos.mjs";

const ler = path => readFileSync(resolve(import.meta.dirname, "..", path), "utf8");

const base = [
  "---",
  'titulo: "Artigo de teste"',
  'descricao: "Descrição real do artigo"',
  'categoria: "Horta"',
  'autor: "Equipe Seu Quintal"',
  'imagem: "/imagens/horta.webp"',
  'imagemAlt: "Horta"',
  'ferramentaUrl: "/horta/organizador/"',
  'ferramentaTexto: "Abrir organizador"',
  'status: "publicado"',
];

test("metadados editoriais aceitam datas reais e rejeitam datas impossíveis", () => {
  const artigo = readArticle([...base, "dataPublicacao: 2026-11-20",
    "dataAtualizacao: 2026-11-21", "---", "Texto editorial"].join("\n"), "teste.md");
  assert.equal(artigo.dataPublicacao, "2026-11-20");
  assert.equal(artigo.dataAtualizacao, "2026-11-21");
  assert.throws(() => readArticle([...base, "dataPublicacao: 2026-02-30",
    "---", "Texto"].join("\n"), "teste.md"), /Data editorial inválida/);
  assert.throws(() => readArticle([...base, "dataPublicacao: 2026-11-21",
    "dataAtualizacao: 2026-11-19", "---", "Texto"].join("\n"), "teste.md"), /anterior/);
  assert.throws(() => readArticle([...base, "dataAtualizacao: 2026-11-21",
    "---", "Texto"].join("\n"), "teste.md"), /Informe dataPublicacao/);
});

test("FAQPage só pode existir com perguntas e respostas publicadas", () => {
  assert.deepEqual(extractFaqs("## Cultivo\n\nTexto comum"), []);
  const markdown = [
    "## Começando", "Texto comum",
    "## Perguntas frequentes",
    "### Qual é o melhor horário para regar?",
    "Depende do clima e da necessidade da planta.",
    "### Como saber se o solo está úmido?",
    "Observe a umidade no substrato antes da rega.",
    "## Cuidados adicionais", "Outro texto",
  ].join("\n");
  assert.deepEqual(extractFaqs(markdown), [
    {pergunta:"Qual é o melhor horário para regar?",
     resposta:"Depende do clima e da necessidade da planta."},
    {pergunta:"Como saber se o solo está úmido?",
     resposta:"Observe a umidade no substrato antes da rega."},
  ]);
  assert.throws(() => extractFaqs("## Perguntas frequentes\n### Pergunta sem resposta?"),
    /sem resposta/);
});

test("template contém metadados OG, JSON-LD editorial e CTA de ferramenta", () => {
  const codigo = ler("scripts/gerar-artigos.mjs");
  for (const label of ['og:image', 'og:image:alt', 'og:title', 'og:description',
      'twitter:card', 'datePublished', 'dateModified', '"@type": "FAQPage"',
      '"@type": "BlogPosting"', 'linkTarget(article.ferramentaUrl']) {
    assert.ok(codigo.includes(label), label);
  }
  const validador = ler("scripts/verificar-seo.mjs");
  for (const label of ["urlsHtml", "urlsXml", "meta description", "og:image",
      "H1 ausente", "artigo órfão", "robots.txt"]) assert.ok(validador.includes(label), label);
});
