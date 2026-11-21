# Sisteminha Embrapa — Reorganização da página (V2.1)

## Diagnóstico
O site já tinha página pública em /sisteminha.html, panorama ilustrado, navegação por hash entre visão geral e cinco módulos, calculadora de galinheiro e links oficiais. O fluxo anterior consistia em duas sequências lineares que poderiam ser interpretadas como ligações físicas literais. A Bíblia 2.0 e o Design System Raiz & Caminho preveem oito tópicos, fluxo diferenciando recursos e conteúdo por módulo.

## O que foi organizado
- Navegação local com oito destinos: Visão geral, Tanque de peixes, Galinheiro, Horta e pomar, Compostagem, Minhocário, Como integrar e Materiais e fontes.
- URLs por hash permanecem funcionais, com histórico e foco atualizados. Link antigo #fontes passa a abrir Materiais e fontes.
- Visão geral: fluxos de **água e nutrientes**, **matéria orgânica** e **produção de alimentos**; links de acesso aos módulos. São conexões educativas, não um projeto hidráulico.
- Módulos: função, materiais, manejo, ligações, cuidados e ferramentas relacionadas. O conteúdo existente da calculadora de galinhas é reaproveitado sem alterações nas fórmulas.
- Integração: quatro passos ilustrativos para observar o espaço, definir os módulos, planejar conexões e começar com segurança.
- Materiais: referências oficiais da Embrapa, alertas técnicos e nota sobre imagens produzidas com IA.
- Design responsivo: navegação horizontal rolável no celular; fluxo empilhado e tarjetas claras para leitura mobile-first. Uso de tokens CSS oficiais.
- Metatítulo e descrição atualizados; testes de dados e regressão.

## Limites explícitos
- Os cinco módulos da página são uma **seleção educativa**, não todos os módulos oficiais do Sisteminha; a tecnologia é modular e adaptável.
- Não há dimensionamento técnico automático de tanques, filtros ou tratamento de resíduos nesta página.
- Água de criação não deve ser confundida com água potável. Dejetos animais exigem manejo apropriado antes da fertilização agrícola.
- A calculadora de galinhas existente permanece no tópico Galinheiro. Peixes e planejamento integrado continuam como melhorias futuras.
- Esta versão preserva **/sisteminha.html** e URLs com hash; páginas de módulo indexáveis como /sisteminha/{modulo}/, previstas na Bíblia, ainda não foram criadas. Evitar apresentá-las como existentes.
- As ilustrações já existentes não são registros reais ou fotos oficiais da Embrapa.

## Fontes
- https://www.embrapa.br/web/meio-norte/sisteminha
- https://www.infoteca.cnptia.embrapa.br/handle/doc/1111791
- https://www.embrapa.br/web/meio-norte/sisteminha/faq
- https://www.embrapa.br/web/maranhao/sisteminha
- Documentos internos: Bíblia do Produto 2.0, seção 9; Design System 2.0, seção 13; Design Tokens 2.0.

## Validação
Executar npm test e npm run build no GitHub Actions. Revisar manualmente no navegador a troca de conteúdos, retorno pelo histórico, links profundos e navegação pelo teclado, especialmente nas larguras 320, 390, 768 e 1440px. Antes de adicionar tutoriais de construção e receitas, realizar revisão técnica com fontes institucionais.
