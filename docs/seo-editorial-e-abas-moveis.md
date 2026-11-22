# Seu Quintal — SEO editorial e descoberta de abas

## Geração estática existente
`scripts/gerar-artigos.mjs` cria HTML indexável para `artigos/index.html` e cada `artigos/<slug>/index.html`. O `sitemap.xml` é gerado no mesmo processo. O Vite publica múltiplas entradas (não é necessário adicionar react-snap).

## Metadados por artigo
- Título, descrição e canonical são únicos e calculados com base no slug.
- Tags Open Graph incluem título, descrição, URL, imagem absoluta, idioma e descrição da imagem.
- `twitter:card=summary_large_image` melhora prévias sociais onde há suporte.
- Schema `BlogPosting` (subtipo de `Article`) informa título, descrição, imagem, URL, autor, publisher e idioma.
- `datePublished` e `dateModified` são emitidos **somente com datas editoriais reais**. Para informar em novo artigo Markdown, use `dataPublicacao: AAAA-MM-DD` e, após revisão que altere conteúdo, `dataAtualizacao: AAAA-MM-DD`. Datas inválidas, regressivas ou atualização sem publicação fazem o build falhar. Não use hora do build como data editorial.

## FAQ opcional
Se houver dúvidas reais respondidas no conteúdo, edite o Markdown:

```md
## Perguntas frequentes
### Posso cultivar em um vaso pequeno?
A resposta precisa corresponder ao conteúdo técnico revisado.

### Como saber quando regar?
Observe o solo, a cultura e as condições do clima.
```

O gerador publicará o HTML das perguntas e, além do BlogPosting, um `FAQPage` equivalente. Se não houver FAQ visível, nenhum schema FAQ será criado. Não adicione perguntas artificiais para motores de busca. **Google descontinuou os resultados avançados de FAQ em 2026; esse schema não é promessa de destaque nem de tráfego.**

## Links para ferramentas
Metadados obrigatórios `ferramentaUrl` e `ferramentaTexto` controlam o CTA contextual no HTML do artigo. Os cards dos artigos em `src/App.jsx` e os links de `artigos/index.html` são `<a href>` reais. A Home também oferece um link HTML sem JavaScript para a categoria de artigos em `<noscript>`.

## Validação
`npm run build` executa a geração e depois `scripts/verificar-seo.mjs`. O script:
- verifica paridade bidirecional de `dist/artigos/**/*.html` e URLs de artigos no sitemap;
- rejeita URLs duplicadas e arquivos ausentes;
- exige H1 único, título, descrição, canonical e Open Graph preenchidos;
- valida imagem, autor e identidade do `BlogPosting`, FAQ se presente, links internos e CTA;
- confere o arquivo `robots.txt` no build.

## Robots.txt e GitHub Pages
O projeto é hospedado no endereço `https://igor-vasconcelos.github.io/seu-quintal/`. Logo, `public/robots.txt` torna-se `/seu-quintal/robots.txt` no GitHub Pages. **Isso não é o robots.txt efetivo do host**, que precisa estar em `https://igor-vasconcelos.github.io/robots.txt`. O arquivo foi criado como referência/documentação com `Sitemap: https://igor-vasconcelos.github.io/seu-quintal/sitemap.xml`. A entrega do sitemap ao Google deve ser feita diretamente no Search Console; não anunciar controle do robots da raiz que não pertence ao subdiretório.

## UX de abas no Sisteminha
No celular, a navegação mostra `Deslize para ver mais`, um próximo cartão parcialmente visível, gradiente na borda e um botão acessível para avançar. O botão não muda a seleção; apenas rola. A seleção de cada módulo continua em link nativo com hash. O controle respeita `prefers-reduced-motion`. O mesmo conteúdo é acessível no teclado.

## Revisão humana
Conteúdos científicos, datas editoriais, imagens e afirmações do artigo continuam sujeitos à verificação humana. JSON-LD não garante indexação ou rich result; verificar no Google Search Console depois da publicação.
