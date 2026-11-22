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
  ["artigo-horta", "/artigos/como-planejar-uma-horta-para-colher-com-frequencia/"],
  ["artigo-galinhas", "/artigos/quantas-galinhas-para-ter-ovos-em-casa/"],
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

      if (slug.startsWith("artigo-")) {
        const abertura = pagina.locator(".sq-article-opening");
        const box = await abertura.boundingBox();
        assert.ok(box && box.height < (largura < 700 ? 710 : 520),
          "Abertura de artigo não deve ocupar quase toda a página: " + JSON.stringify(box));
        const hero = abertura.locator(".sq-hero-image img");
        assert.ok(await hero.evaluate(img => img.complete && img.naturalWidth > 0),
          "Fotografia de abertura não carregou");
        const imgHeight = await hero.evaluate(img => img.getBoundingClientRect().height);
        assert.ok(imgHeight <= (largura < 700 ? 155 : 515),
          "A imagem de abertura está alta demais: " + imgHeight);
        assert.equal(await pagina.locator(".sq-prose .sq-step-figure img").count(), 2,
          "Cada artigo precisa de duas ilustrações durante a leitura");
        await abertura.screenshot({
          path: PASTA + "/" + slug + "-hero-" + nome + ".png",
          animations: "disabled",
        });
        for(const foto of await pagina.locator(".sq-prose .sq-step-figure img").all()) {
          await foto.scrollIntoViewIfNeeded();
          assert.ok(await foto.evaluate(img => img.decode().then(()=>img.naturalWidth>0).catch(()=>false)),
            "Imagem didática não carregou");
        }
        assert.ok(await pagina.locator(".sq-prose .sq-table-wrap").count() >= 1,
          "Artigo deve apresentar exemplo tabulado");
        const indice = pagina.locator(".sq-toc");
        const painel = indice.locator("details.sq-toc-details");
        await painel.waitFor({ state: "attached", timeout: 12000 });
        assert.equal(await painel.evaluate(el => el.open), largura > 1080,
          "Índice aberto no desktop e recolhido no celular");
        const faixa = pagina.locator(".sq-article-meta-bar");
        await faixa.waitFor({ state: "visible" });
        const metaBox = await faixa.boundingBox();
        assert.ok(metaBox && Math.abs(metaBox.x) <= 1 &&
          Math.abs(metaBox.width - largura) <= 2,
          "Faixa de metadados deve ocupar a viewport");
        assert.equal(await pagina.locator(".sq-learning-panel li").count(), 3,
          "O resumo editorial deve ter três aprendizados reais");
        const aSide = pagina.locator(".sq-article-aside");
        const mainText = pagina.locator(".sq-prose");
        const sideBox = await aSide.boundingBox();
        const textBox = await mainText.boundingBox();
        if (largura > 1080) {
          assert.ok(sideBox && textBox && sideBox.x > textBox.x + textBox.width,
            "Índice e recomendações devem ficar à direita do texto");
          assert.ok(await pagina.locator(".sq-side-related").isVisible(),
            "Conteúdo relacionado ausente no desktop");
        } else {
          assert.ok(sideBox && textBox && sideBox.y < textBox.y,
            "Sumário deve preceder o texto em tela pequena");
        }
        assert.ok(await pagina.locator(".sq-guide-section").count() >= 7,
          "Seções semânticas devem preservar todo o guia");
        assert.ok(await pagina.locator(".sq-guide-step").count() >= 1,
          "Pelo menos uma etapa deve ter texto e figura lado a lado no desktop");
        const campos = pagina.locator(".sq-article-layout");
        const colunas = await campos.evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").length);
        assert.equal(colunas, largura > 1080 ? 2 : 1,
          "Layout editorial deve ter duas colunas apenas quando houver espaço");
        if (largura <= 1080) await painel.locator("summary").click();
        const linksIndice = indice.locator('a[href^="#"]');
        assert.ok(await linksIndice.count() >= 2, "Índice vazio");
        const primeiro = linksIndice.first();
        await primeiro.click();
        await pagina.waitForFunction(() => location.hash.length > 1);
        await pagina.waitForFunction(() =>
          document.querySelector('.sq-toc a[aria-current="location"]') !== null);
        assert.ok(await pagina.locator(".sq-article-info").innerText(),
          "Metadados da leitura ausentes");
        await pagina.screenshot({
          path: PASTA + "/" + slug + "-" + nome + ".png",
          animations: "disabled",
        });
      }
      if (["home", "horta", "meu-quintal"].includes(slug)) {
        const botaoQuintal = pagina.locator(".menu-quintal");
        assert.equal(await botaoQuintal.locator("svg").count(), 1,
          "Meu Quintal deve apresentar o novo ícone SVG no cabeçalho");
        assert.ok(await botaoQuintal.locator("svg path").count() >= 7,
          "Ícone do Meu Quintal deve mostrar casa, horta e caminho");
      }
      if (["home", "horta", "meu-quintal"].includes(slug)) {
        const footer = pagina.locator(".rodape.rodape-v3");
        await footer.waitFor({ state: "visible", timeout: 16000 });
        const grupos = footer.locator(".rodape-navegacao");
        assert.equal(await grupos.count(), 3, "Rodapé deve ter três grupos de navegação");
        const titulos = ["Aprenda", "Planeje", "Cuide e organize"];
        for (let i = 0; i < 3; i++) {
          assert.equal(await grupos.nth(i).locator("h2").innerText(), titulos[i]);
          assert.equal(await grupos.nth(i).locator("a").count(), 4,
            "Rodapé precisa oferecer quatro caminhos por grupo");
        }
        const quintalLink = grupos.getByRole("link", { name: "Meu Quintal" });
        assert.match(await quintalLink.getAttribute("href"), /meu-quintal\/$/);
        await footer.screenshot({ path: PASTA + "/rodape-" + slug + "-" + nome + ".png", animations: "disabled" });
        await pagina.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      }
      if (slug === "meu-quintal") {
        const lateral = pagina.locator(".quintal-secoes");
        await lateral.waitFor({ state: "visible", timeout: 16000 });
        const links = lateral.locator(".quintal-secoes-links > a");
        assert.equal(await links.count(), 5, "Sidebar deve manter cinco seções");
        for (const link of await links.all()) {
          assert.equal(await link.locator(".quintal-navegacao-icone svg").count(), 1);
          assert.ok(await link.locator(".quintal-navegacao-icone svg path, .quintal-navegacao-icone svg rect").count() > 0,
            "Ícone do menu precisa ter desenho SVG");
        }
        assert.equal(await links.first().getAttribute("aria-current"), "location");
        assert.match(await lateral.locator(".quintal-secoes-rodape").innerText(), /Dados neste navegador/);
        await lateral.screenshot({ path: PASTA + "/menu-quintal-" + nome + ".png", animations: "disabled" });
        await pagina.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      }
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
        const emblema = pagina.locator(".home-meu-quintal-emblema");
        assert.equal(await emblema.locator("svg").count(), 1);
        assert.equal(await emblema.evaluate(el => getComputedStyle(el).borderRadius), "50%",
          "O emblema do Meu Quintal deve ter fundo circular acolhedor");
        await emblema.screenshot({
          path: PASTA + "/icone-meu-quintal-home-" + nome + ".png", animations: "disabled",
        });
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
      if (slug === "horta") {
        const escolha = pagina.locator("#guia-horta-plantas");
        await escolha.locator(".horta-opcao").first().waitFor({state:"visible",timeout:15000});
        assert.equal(await escolha.locator(".horta-estado-inicial").count(),1,
          "Deve orientar o início sem resultados vazios");
        await escolha.locator(".horta-campo-escolha").first().getByRole("button",{name:/Varanda/}).click();
        assert.match(await escolha.locator(".horta-estado-inicial").innerText(), /horas de sol/);
        await escolha.locator(".horta-campo-escolha").nth(1).getByRole("button",{name:/6 horas ou mais/}).click();
        const principais = escolha.locator(".horta-recomendacoes > ul.horta-culturas");
        assert.equal(await principais.locator("li").count(),4,
          "Varanda com sol pleno deve mostrar quatro boas opções iniciais");
        assert.equal(await escolha.locator(".horta-outras-condicoes").count(),1,
          "Mais horas de sol devem oferecer possibilidades de meia-sombra com ressalvas");
        await escolha.locator(".horta-outras-condicoes summary").click();
        await escolha.locator(".horta-outras-condicoes").getByText("Alface", {exact:true}).waitFor();
        for(const imagem of await principais.locator("img").all()) {
          await imagem.scrollIntoViewIfNeeded();
          assert.ok(await imagem.evaluate(img => img.decode().then(() => img.naturalWidth > 0).catch(() => false)),
            "Foto recomendada não carregou");
        }
        await pagina.screenshot({path:PASTA + "/horta-recomendacoes-" + nome + ".png",animations:"disabled"});
        await principais.getByRole("button",{name:/Calcular terra para Tomate-cereja/}).click();
        await pagina.locator(".horta-cultivo-selecionado").getByText("Exemplo para Tomate-cereja").waitFor();
        assert.match(await pagina.locator(".horta-cultivo-selecionado").innerText(),/terra molhada/);
        await pagina.screenshot({path:PASTA + "/horta-exemplo-planta-" + nome + ".png",animations:"disabled"});
        const form = pagina.locator(".form-terra");
        assert.equal(await form.locator('input[name="comprimento"]').inputValue(),"45");
        assert.match(await pagina.locator(".horta-resultado-volume").innerText(), /91,125/);
        await pagina.locator(".horta-cultivo-selecionado").getByRole("button",{name:"Voltar às plantas"}).click();
        assert.equal(await principais.locator("li").count(),4);
        await pagina.locator(".horta-secao-botao").nth(1).click();
        await form.getByRole("button",{name:/Jardineira/}).click();
        assert.equal(await form.locator('input[name="comprimento"]').inputValue(),"60");
        await form.locator('select[name="unidade"]').selectOption("m");
        assert.equal(await form.locator('input[name="comprimento"]').inputValue(),"0,6");
        await form.locator('input[name="saco"]').fill("20");
        await form.getByRole("button",{name:"Calcular terra",exact:true}).click();
        assert.match(await pagina.locator(".horta-resultado-volume").innerText(), /30/);
        assert.match(await pagina.locator(".horta-resultado-sacos").innerText(), /2 sacos/);
        await pagina.screenshot({path:PASTA + "/horta-terra-" + nome + ".png",animations:"disabled"});
        await form.locator('input[name="largura"]').fill("0");
        await form.getByRole("button",{name:"Calcular terra",exact:true}).click();
        assert.equal(await form.locator('input[name="largura"]').getAttribute("aria-invalid"),"true");
        await form.getByRole("button",{name:"Limpar",exact:true}).click();
        assert.equal(await form.locator('input[name="comprimento"]').inputValue(),"");
        await pagina.locator(".horta-secao-botao").nth(0).click();
        assert.equal(await principais.locator("li").count(),4,
          "As escolhas não devem desaparecer ao alternar as ferramentas");
        const excedente = await pagina.evaluate(() =>
          document.documentElement.scrollWidth - document.documentElement.clientWidth);
        assert.ok(excedente <= 2, "Horta " + nome + ": resultado causa overflow de " + excedente);
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
        await planejamento.getByText("Guia rápido: Cebolinha").waitFor({ state: "visible" });
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
        const iconeProjeto = pagina.locator(".quintal-ultimo-icone");
        assert.ok(await iconeProjeto.locator("svg path").count() >= 7,
          "O destaque de projeto deve usar o mesmo símbolo do Meu Quintal");
        if (await iconeProjeto.isVisible()) {
          await iconeProjeto.screenshot({
            path: PASTA + "/icone-meu-quintal-projeto-" + nome + ".png", animations: "disabled",
          });
        }
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
      ["artigo-horta", "/artigos/como-planejar-uma-horta-para-colher-com-frequencia/"],
      ["ferramentas", "/ferramentas/"], ["sisteminha", "/sisteminha.html"],
      ["meu-quintal", "/meu-quintal/"], ["horta", "/horta/"],
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
