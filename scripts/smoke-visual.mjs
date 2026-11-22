import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import assert from "node:assert/strict";

const URL_BASE = "http://127.0.0.1:4173";
const PASTA = "artifacts/visual";
mkdirSync(PASTA, { recursive: true });
const rotas = [
  ["home", "/"],
  ["sisteminha", "/sisteminha.html"],
  ["guias", "/guias/"],
  ["horta", "/horta/"],
  ["canteiros", "/horta/canteiros/"],
  ["calendario", "/horta/calendario-de-plantio/"],
  ["organizador", "/horta/organizador/"],
  ["meu-quintal", "/meu-quintal/"],
  ["artigos", "/artigos/"],
  ["ferramentas", "/ferramentas/"],
  ["peixes", "/ferramentas/calculadora-peixes/"],
  ["pomar", "/ferramentas/planejador-de-pomar/"],
  ["codornas", "/ferramentas/calculadora-codornas/"],
];

const navegador = await chromium.launch({ headless: true });
let casos = 0;
try {
  for (const { nome, largura, altura } of [
    { nome: "celular", largura: 390, altura: 844 },
    { nome: "desktop", largura: 1440, altura: 900 },
  ]) {
    const contexto = await navegador.newContext({
      viewport: { width: largura, height: altura },
      reducedMotion: "reduce",
      deviceScaleFactor: 1,
    });
    for (const [slug, rota] of rotas) {
      const pagina = await contexto.newPage();
      const erros = [];
      pagina.on("pageerror", erro => erros.push(erro.message));
      const resposta = await pagina.goto(URL_BASE + rota, { waitUntil: "networkidle", timeout: 40000 });
      assert.ok(resposta?.ok(), rota + ": resposta HTTP inválida");
      await pagina.locator("h1").first().waitFor({ timeout: 25000 });
      const larguraExcedente = await pagina.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert.ok(larguraExcedente <= 2,
        slug + "/" + nome + ": conteúdo excede largura por " + larguraExcedente + " px");
      assert.deepEqual(erros, [], slug + "/" + nome + ": erro JavaScript");
      if (slug === "home" || slug === "sisteminha" || slug === "meu-quintal") {
        await pagina.screenshot({
          path: PASTA + "/" + slug + "-" + nome + ".png",
          animations: "disabled",
        });
      }
      if (["canteiros","calendario","organizador","codornas","peixes","pomar"].includes(slug)) {
        assert.equal(await pagina.locator('.ferramenta-meta span').count(),3,
          "Ferramenta deve apresentar 3 características claras");
      }
      if (slug === "home") {
        assert.equal(await pagina.locator(".home-destaque-card").count(), 4,
          "Home precisa mostrar quatro cartões editoriais");
        const imagens = pagina.locator(".home-destaque-imagem img");
        for (let i = 0; i < await imagens.count(); i++) {
          await imagens.nth(i).scrollIntoViewIfNeeded();
          assert.ok(await imagens.nth(i).evaluate(img => img.complete && img.naturalWidth > 0),
            "Imagem editorial deve carregar: " + i);
        }
        assert.ok(await pagina.locator(".home-editorial-ferramentas a").count() >= 6);
      }
      if (slug === "home" && nome === "celular") {
        const menu = pagina.locator(".menu-alternar");
        await menu.click();
        assert.equal(await menu.getAttribute("aria-expanded"), "true");
        const grupo = pagina.locator(".site-menu-grupo").first();
        await grupo.locator("summary").click();
        assert.ok(await grupo.locator('a[href*="horta/"]').first().isVisible(),
          "Menu de guias precisa abrir em telas móveis");
        await grupo.locator("summary").press("Escape");
        assert.equal(await grupo.getAttribute("open"), null,
          "Escape deve fechar o submenu");
      }
      if (slug === "ferramentas") {
        await pagina.locator('.ferramentas-catalogo').waitFor({ state: "visible" });
        assert.ok(await pagina.locator('a[href="../ferramentas/calculadora-peixes/"]').count() >= 1);
      }
      if (slug === "sisteminha") {
        const foto = pagina.locator('.sisteminha-panorama img');
        assert.ok(await foto.evaluate(img => img.complete && img.naturalWidth > 0),
          "Fotografia realista do Sisteminha deve carregar");
        await pagina.locator('.sisteminha-nav-rolagem a[href="#tanque"]').click();
        await pagina.locator("#modulos h2").first().waitFor({ state: "visible", timeout: 12000 });
        assert.match(await pagina.locator("#modulos h2").first().innerText(), /Tanque/i);
        const ferramentasPeixes = pagina.locator('.sisteminha-ferramentas-modulo a[href="./ferramentas/calculadora-peixes/"]');
        await ferramentasPeixes.waitFor({state:"visible",timeout:12000});
        assert.match(await ferramentasPeixes.innerText(),/Calculadora de peixes/);
        assert.ok(await pagina.locator(".sisteminha-guias-modulo a").count() >= 1,
          "Sisteminha deve conectar guias ao módulo");
        await pagina.locator('.sisteminha-nav-rolagem a[href="#ciclo"]').click();
        await pagina.locator("#ciclo").waitFor({ state: "visible", timeout: 12000 });
      }
      if (slug === "peixes") {
        const form = pagina.locator(".simulador-peixes form");
        await form.locator('button[type="submit"]').click();
        await pagina.locator("#resultado-peixes-titulo").waitFor({state:"visible",timeout:12000});
      }
      if (slug === "pomar") {
        const form = pagina.locator(".simulador-pomar form");
        await form.locator('button[type="submit"]').click();
        await pagina.locator("#resultado-pomar-titulo").waitFor({state:"visible",timeout:12000});
      }
      if (["canteiros","calendario","codornas"].includes(slug)) {
        const imagem = pagina.locator('.ferramenta-topo-figura img, .ferramenta-foto-realista img').first();
        assert.ok(await imagem.evaluate(img => img.complete && img.naturalWidth > 0),
          slug + ": fotografia editorial deve carregar");
      }
      if (slug === "codornas") {
        await pagina.locator(".codornas-formulario button[type=submit]").click();
        await pagina.locator("#codornas-resultado").waitFor({ state: "visible", timeout: 12000 });
        await pagina.locator('.codornas-modo').nth(1).click();
        await pagina.locator(".codornas-formulario button[type=submit]").click();
        await pagina.locator("#codornas-resultado").waitFor({ state: "visible", timeout: 12000 });
      }
      if (slug === "meu-quintal") {
        await pagina.locator('.quintal-secoes a[href="#canteiros"]').click();
        await pagina.locator(".canteiro-visual").waitFor({ state: "visible", timeout: 20000 });
        assert.ok(await pagina.locator("#quintal-backup").count());
        // O teste começa em navegador vazio: criar um terreno antes de adicionar áreas.
        await pagina.locator('.quintal-secoes a[href="#terreno"]').click();
        await pagina.locator('#planejador input[name="frente"]').fill('25');
        await pagina.locator('#planejador input[name="profundidade"]').fill('40');
        await pagina.locator('#planejador button[type="submit"]').click();
        await pagina.locator('.area-categoria').filter({hasText:"Animais"}).click();
        const codornario = pagina.locator('.area-opcao').filter({hasText:"Codornário"});
        await codornario.click();
        await pagina.locator('.adicionar-area-ilustrada button[type=submit]').click();
        await pagina.locator('.itens-terreno').getByText("Codornário").first().waitFor({state:"visible",timeout:12000});
      }
      console.log("PASSOU", nome, rota);
      await pagina.close();
      casos++;
    }
    await contexto.close();
  }
  // Validação adicional de larguras de transição do Design System 2.0.
  for (const largura of [320, 768, 1024]) {
    const contexto = await navegador.newContext({
      viewport: { width: largura, height: 860 }, reducedMotion: "reduce",
    });
    for (const [slug, rota] of [
      ["home", "/"], ["guias", "/guias/"], ["artigos", "/artigos/"],
      ["ferramentas", "/ferramentas/"], ["sisteminha", "/sisteminha.html"],
      ["meu-quintal", "/meu-quintal/"],
    ]) {
      const pagina = await contexto.newPage();
      await pagina.goto(URL_BASE + rota, {waitUntil: "networkidle", timeout: 40000});
      const excedente = await pagina.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert.ok(excedente <= 2, slug + "/" + largura + ": overflow de " + excedente + " px");
      if (slug === "home") {
        await pagina.screenshot({
          path: PASTA + "/home-" + largura + ".png",
          animations: "disabled",
        });
      }
      await pagina.close();
      casos++;
    }
    await contexto.close();
  }
} finally {
  await navegador.close();
}
console.log("Navegador: " + casos + " páginas verificadas; capturas em " + PASTA + ".");
