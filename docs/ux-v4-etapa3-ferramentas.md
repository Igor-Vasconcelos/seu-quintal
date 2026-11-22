# UX v4 — Etapa 3: padrão visual das ferramentas

## Modificações
- Páginas de canteiros, calendário, organizador, codornas, peixes e pomar: H1 e descrições preservados, abertura mais compacta, sinalização honesta (Gratuito, Sem cadastro, Salva neste navegador / Simulação / Croqui).
- Canteiros e Calendário: CTA âncora para iniciar a ferramenta.
- Organizador e calculadoras: orientações educativas extensas deslocadas **após** a ferramenta. Permanecem no HTML indexável e com mesma semântica; sem perder alertas técnicos.
- Meu Quintal: topo de workspace mais compacto, sem alterar navegação, backup, histórico ou cenários.
- CSS único escopado em tool-layout-v4.css, sem regras de negócio ou alterações em estados React.

## Garantias
- Nenhum cálculo, função geométrica, chave de localStorage ou formato JSON foi modificado.
- Resultados e textos de segurança técnica continuam nos próprios componentes.
- Não usar a etiqueta de armazenamento nos formulários que ainda não salvam projetos.
- URLs e metadados preservados.

## Validação
- node --test, build Vite e Playwright em 390px/1440px, incluindo Calendário e marcadores informativos.
- Revisar 320/768/1024px, acessibilidade com leitor de tela e navegação por teclado em dispositivos reais.
- Verificar se as âncoras iniciam no ponto correto; não remover instruções de manejo técnico.

## Próximo
Revisão das imagens: hero fotográfico do Sisteminha e fotos realistas adequadas à ferramenta; imagens sintéticas precisam de transparência na atribuição e revisão anatômica/agronômica.
