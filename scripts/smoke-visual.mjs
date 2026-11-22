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
      // Cabeçalho e imagem da marca precisam chegar até as bordas da viewport,
      // mesmo quando a página usa um main de leitura com largura máxima.
      const header = pagina.locator(".topo.site-shell, .sq-header").first();
      const rect = await header.boundingBox();
      assert.ok(rect && Math.abs(rect.x) <= 1 &&
        Math.abs(rect.width - largura) <= 2,
        slug + "/" + nome + ": cabeçalho não ocupa a viewport (" +
        JSON.stringify(rect) + ")");
      const logo = pagina.locator('.site-marca-emblema img, .sq-brand img').first();
      assert.ok(await logo.evaluate(img => img.complete && img.naturalWidth > 0),
        slug + "/" + nome + ": logomarca não carregou");

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
      if (slug === "sisteminha") {
        const hero = await pagina.locator(".sisteminha-abertura").boundingBox();
        assert.ok(hero && Math.abs(hero.x) <= 1 && Math.abs(hero.width - largura) <= 2,
          "Hero do Sisteminha deve ocupar toda a largura: " + JSON.stringify(hero));
        const faixa = await pagina.locator(".sisteminha-nav-local").boundingBox();
        assert.ok(faixa && faixa.width >= largura * .88 &&
          Math.abs(faixa.x - (largura - faixa.width) / 2) <= 2,
          "Faixa de abas deve estar larga e centralizada: " + JSON.stringify(faixa));
        assert.equal(await pagina.locator(".sisteminha-nav-rolagem .icone-navegacao").count(), 8,
          "Os 8 ícones dos módulos precisam usar o novo conjunto vetorial");
      }
      if (slug === "home") {
        const hero = await pagina.locator(".home-abertura").boundingBox();
        assert.ok(hero && Math.abs(hero.x) <= 1 && Math.abs(hero.width - largura) <= 2,
          "Hero da Home deve continuar full-bleed");
        assert.equal(await pagina.locator(".home-trilhas .icone-navegacao").count(), 11,
          "As 11 categorias precisam de ícones vetoriais consistentes");
      }
      if (slug === "sisteminha" && nome === "celular") {
        const lista = pagina.locator(".sisteminha-nav-rolagem");
        assert.ok(await lista.evaluate(el => el.scrollWidth > el.clientWidth),
          "Abas móveis devem permitir rolagem horizontal");
        assert.ok(await pagina.getByText("Deslize para ver mais").isVisible(),
          "Dica de deslizar deve estar visível no celular");
        await pagina.getByRole("button", {name: "Mostrar próximos tópicos do Sisteminha"}).click();
        assert.ok(await lista.evaluate(el => el.scrollLeft > 0),
          "Botão de avançar precisa rolar as abas");
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
      if (slug === "canteiros") {
        await pagina.locator(".canteiro-catalogo-filtros input[type=search]").fill("pimentao");
        const culturaFiltrada = pagina.locator(".canteiro-cultura-item").filter({hasText:"Pimentão"});
        assert.equal(await pagina.locator(".canteiro-cultura-item").count(),1,
          "Busca do canteiro deve encontrar uma cultura");
        await culturaFiltrada.click();
        await pagina.getByText("Dicas para Pimentão").waitFor({state:"visible"});
        await pagina.locator(".canteiro-catalogo-filtros input[type=search]").fill("");
        await pagina.locator(".canteiro-catalogo-filtros select").selectOption("Temperos");
        assert.equal(await pagina.locator(".canteiro-cultura-item").count(),3);
        // A ferramenta independente fica em /horta/canteiros/.
        const dica = pagina.locator(".canteiro-dica a");
        await dica.waitFor({ state: "visible", timeout: 20000 });
        await dica.click();
        await pagina.waitForURL("**/horta/organizador/#planejamento-familiar");
        await pagina.locator("#planejamento-familiar[open]").waitFor({ state: "visible", timeout: 20000 });
      }
      if (slug === "organizador") {
        // Links antigos que circulam fora do site não devem mais mostrar 404.
        await pagina.goto(URL_BASE + "/organizador/#planejamento-familiar", { waitUntil: "networkidle" });
        await pagina.waitForURL("**/horta/organizador/#planejamento-familiar");
        const planejamento = pagina.locator("#planejamento-familiar[open]");
        await planejamento.waitFor({ state: "visible", timeout: 20000 });
        await pagina.getByRole("button", {name:"1. Escolher culturas"}).click();
        assert.ok(await planejamento.isVisible(), "Atalho deve abrir o planejamento familiar");
        await planejamento.locator("input[type=search]").fill("brocolis");
        assert.equal(await planejamento.locator(".familia-cultura-opcao").count(),2,
          "Busca sem acentos deve retornar os dois tipos de brócolis");
        await planejamento.getByRole("button",{name:"Ver dicas de cultivo de Brócolis de verão"}).click();
        await planejamento.getByText("Guia rápido: Brócolis de verão").waitFor({state:"visible"});
        await planejamento.locator("input[type=search]").fill("");
        await planejamento.getByRole("button", {name:"Temperos",exact:true}).click();
        assert.equal(await planejamento.locator(".familia-cultura-opcao").count(),3);
        await pagina.locator(".organizador-form select[name=cultura]").selectOption("Morango");
        assert.equal(await pagina.locator(".organizador-form select[name=origem]").inputValue(), "muda",
          "Morango precisa começar por muda pronta");
        assert.equal(await pagina.locator(".organizador-form select[name=origem] option").count(), 1);
        await pagina.locator(".organizador-form select[name=cultura]").selectOption("Pimentão");
        await pagina.getByText("Cuidados com Pimentão").waitFor({state:"visible"});
        await pagina.locator(".organizador-previsao").getByText("Primeiro lote").waitFor({state:"visible"});
        await pagina.screenshot({
          path: PASTA + "/organizador-" + nome + ".png", animations:"disabled",
        });
      }
      if (slug === "codornas") {
        await pagina.locator(".codornas-formulario button[type=submit]").click();
        await pagina.locator("#codornas-resultado").waitFor({ state: "visible", timeout: 12000 });
        await pagina.locator('.codornas-modo').nth(1).click();
        await pagina.locator(".codornas-formulario button[type=submit]").click();
        await pagina.locator("#codornas-resultado").waitFor({ state: "visible", timeout: 12000 });
      }
      if (slug === "meu-quintal") {
        // A visão geral é a entrada do workspace; menu e backup precisam funcionar com toque/teclado.
        await pagina.locator("#quintal-visao-titulo").waitFor({ state: "visible", timeout: 20000 });
        assert.equal(await pagina.locator(".quintal-secoes-links a").count(),5,
          "A navegação local deve apresentar os cinco destinos");
        assert.equal(await pagina.locator(".quintal-titulo").evaluate(el =>
          getComputedStyle(el).backgroundColor), "rgb(24, 60, 43)",
          "O banner do workspace precisa seguir o verde-floresta da marca");
        if (nome === "desktop") {
          const recolher = pagina.getByRole("button", { name: "Recolher menu lateral" });
          await recolher.click();
          assert.equal(await pagina.locator(".pagina-meu-quintal").getAttribute("data-menu-recolhido"),"true");
          assert.ok(await pagina.locator(".quintal-secoes-links a[href='#terreno']").isVisible(),
            "O menu recolhido não deve esconder a navegação");
          await pagina.getByRole("button", { name: "Expandir menu lateral" }).click();
          assert.equal(await pagina.locator(".pagina-meu-quintal").getAttribute("data-menu-recolhido"),null);
        }
        await pagina.getByRole("button", {name: "Fazer backup"}).click();
        assert.ok(await pagina.locator("#quintal-backup").evaluate(el => el.open),
          "A ação de backup precisa abrir seu painel");
        await pagina.locator('.quintal-secoes a[href="#canteiros"]').click();
        await pagina.locator(".canteiro-visual").waitFor({ state: "visible", timeout: 20000 });
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

        // Catálogo ampliado, com ícones SVG e sem criação de 'Área de manobra'.
        assert.equal(await pagina.locator(".area-categoria").count(),7,
          "O planejador deve oferecer sete categorias");
        await pagina.locator(".area-categoria").filter({hasText:"Acessos"}).click();
        assert.equal(await pagina.locator(".area-opcao").filter({hasText:"Caminho"}).count(),1);
        assert.equal(await pagina.locator(".area-opcao").filter({hasText:"Área de manobra"}).count(),0);
        await pagina.locator(".area-categoria").filter({hasText:"Compostagem"}).click();
        assert.equal(await pagina.locator(".area-opcao").filter({hasText:"Minhocário"}).count(),1);
        assert.equal(await pagina.locator(".area-opcao").filter({hasText:"Biodigestor"}).count(),1);

        await pagina.locator(".area-categoria").filter({hasText:"Apoio e lazer"}).click();
        for (const nomeArea of ["Piscina", "Campinho / quadra"]) {
          const opcao = pagina.locator(".area-opcao").filter({hasText:nomeArea});
          await opcao.click();
          assert.ok(await opcao.locator("svg path,svg rect,svg circle").count() > 0,
            nomeArea + ": ícone vetorial não renderizado");
          await pagina.locator('.adicionar-area-ilustrada button[type=submit]').click();
          await pagina.locator(".itens-terreno").getByText(nomeArea).first()
            .waitFor({state:"visible",timeout:12000});
        }
        await pagina.screenshot({
          path: PASTA + "/meu-quintal-editor-" + nome + ".png",
          animations: "disabled",
        });
        await pagina.locator('.quintal-secoes a[href="#geral"]').click();
        await pagina.locator(".quintal-ultimo-projeto h3").waitFor({ state: "visible", timeout: 20000 });
        assert.match(await pagina.locator(".quintal-ultimo-projeto h3").innerText(), /25 × 40 m/,
          "O projeto criado deve aparecer na visão geral");
        assert.equal(await pagina.locator(".quintal-indicadores strong").nth(2).innerText(), "3",
          "A visão geral precisa contar os três elementos adicionados ao cenário");
        // Este mesmo componente também é montado em Meu Quintal; a rota é diferente.
        await pagina.locator('.quintal-secoes a[href="#canteiros"]').click();
        const dicaDoQuintal = pagina.locator(".canteiro-dica a");
        await dicaDoQuintal.waitFor({ state: "visible", timeout: 20000 });
        await dicaDoQuintal.click();
        await pagina.waitForURL("**/horta/organizador/#planejamento-familiar");
        await pagina.locator("#planejamento-familiar[open]").waitFor({ state: "visible", timeout: 20000 });
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
      const header = pagina.locator(".topo.site-shell, .sq-header").first();
      const rect = await header.boundingBox();
      assert.ok(rect && Math.abs(rect.x) <= 1 && Math.abs(rect.width - largura) <= 2,
        slug + "/" + largura + ": header com margem externa indevida");

      if (slug === "sisteminha") {
        const hero = await pagina.locator(".sisteminha-abertura").boundingBox();
        assert.ok(hero && Math.abs(hero.x) <= 1 &&
          Math.abs(hero.width - largura) <= 2,
          "Sisteminha/" + largura + ": hero com margem indevida");
        const faixa = await pagina.locator(".sisteminha-nav-local").boundingBox();
        assert.ok(faixa && faixa.width >= largura * .88,
          "Sisteminha/" + largura + ": barra de módulos estreita demais");
      }
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
