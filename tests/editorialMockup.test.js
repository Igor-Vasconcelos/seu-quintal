import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
const read = p => readFileSync(resolve(import.meta.dirname,"..",p),"utf8");
test("Home mantém acesso imediato às ferramentas e hero editorial sem eliminar conteúdo",()=>{
 const app=read("src/App.jsx");
 assert.match(app,/className="home-hero-selo"/);
 assert.match(app,/className="home-hero-garantia"/);
 for(const target of ["ferramentas","guias","artigos","meu-quintal","sisteminha"]){
  assert.ok(app.includes(target));
 }
 assert.doesNotMatch(app,/home-jornada/);
 const css=read("src/styles/editorial-mockup.css");
 assert.match(css,/\.pagina-home \.home-abertura-imagem::after/);
 assert.match(css,/\.pagina-home \.home-abertura h1/);
 assert.match(css,/prefers-reduced-motion: reduce/);
});
test("Sisteminha usa ícones em oito tópicos com panorama e descrição prudente",()=>{
 const sys=read("src/main-sisteminha.jsx");
 assert.match(sys,/iconesAbas\[id\]/);
 assert.match(sys,/sisteminha-panorama-editorial/);
 assert.match(sys,/sisteminha-panorama-beneficios/);
 assert.match(sys,/Representação ilustrativa gerada por IA/);
 assert.match(sys,/não é um circuito único/i);
 assert.match(sys,/CalculadoraGalinheiro|<Galinheiro/);
 for(const id of ["ciclo","tanque","galinheiro","horta","compostagem","minhocario","integracao","materiais"])
   assert.ok(sys.includes(id));
 const icon=read("src/components/Icone.jsx");
 for(const nome of ["ciclo","peixe","galinha","recycle","minhoca","rede"])assert.ok(icon.includes(nome));
});
test("Página mantém caminhos de imagens reais do repositório e CSS isolado",()=>{
 const css=read("src/styles/editorial-mockup.css");
 const home=read("src/main.jsx"),sisteminha=read("src/main-sisteminha.jsx");
 assert.match(home,/editorial-mockup.css/);
 assert.match(sisteminha,/editorial-mockup.css/);
 assert.doesNotMatch(css,/(?:^|\n)\s*(?:input|select|\.editor-terreno|\.planta-item)\s*\{/);
});
