# Migração visual V3 — Etapa 2/5: Home e Sisteminha

Base aprovada: Bíblia do Produto Seu Quintal 2.0 e Design System 2.0 — Raiz & Caminho. Visual inspirador de portal educativo com controles funcionais claros.

## Implementado
- Home: abertura fotográfica com gradiente de contraste, selo editorial e ações existentes preservadas; cartões de guias com proporção 3:2 e hover discreto; promessa "sem cadastro" exibida com clareza.
- Sisteminha: hero fotográfico com gradiente, composição de visão geral em três colunas desktop (texto, imagem e benefícios), navegação local ilustrada com oito ícones da mesma família SVG.
- Mobile-first: a visão geral se empilha; oito tabs continuam roláveis horizontalmente; acesso ao teclado e títulos continuam semanticamente definidos.
- Fotos existentes preservadas, sem autoria inventada; referência ao conteúdo IA permanece. Não usamos renderizações como projeto hidráulico.
- CSS exclusivo em \`editorial-mockup.css\`; nenhuma função agronômica, cálculo ou persistência editada.

## Critérios de aceitação
1. Escaneabilidade: propósito, próxima ação e natureza ilustrativa visíveis.
2. SEO: conservar títulos, textos, URLs e links de ferramentas.
3. A11y: contraste branco sob camada escura, rótulos de tabs legíveis, imagens com alt e texto alternativo; prefers-reduced-motion.
4. Performance: usar as imagens que já possuem srcSet, sizes e dimensões. Antes de novas imagens, preparar múltiplas resoluções e revisar os detalhes técnicos.
5. Regressão: verificar no navegador a Home, Sisteminha, calculadora de galinhas e menus globais.

## Próximo
Etapa 3: guias e artigos (padrão editorial e imagens responsivas), sem impactar os formulários.
