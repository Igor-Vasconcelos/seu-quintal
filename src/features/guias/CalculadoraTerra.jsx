import { useState } from "react";
import { formatarMedida, lerMedida } from "../planejador/geometria.js";

const campos = [
  { id: "comprimento", rotulo: "Comprimento (cm)" },
  { id: "largura", rotulo: "Largura (cm)" },
  { id: "profundidade", rotulo: "Profundidade a preencher (cm)" },
  { id: "saco", rotulo: "Volume por saco (L, opcional)" },
];

export default function CalculadoraTerra() {
  const [resultado, definirResultado] = useState(null);
  const [invalidos, definirInvalidos] = useState([]);

  function calcular(evento) {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    const dados = new FormData(formulario);
    const medidas = campos.map(({ id }) => dados.get(id).trim());
    const valores = medidas.map((medida) => lerMedida(medida));
    const erros = campos.filter(({ id }, indice) => valores[indice] === null && (id !== "saco" || medidas[indice]));
    if (erros.length) {
      definirInvalidos(erros.map(({ id }) => id));
      formulario.elements.namedItem(erros[0].id).focus();
      return;
    }

    const [comprimento, largura, profundidade, saco] = valores;
    const litros = comprimento * largura * profundidade / 1000;
    let quantidade = null;
    if (saco !== null) {
      // Calcula a divisão em inteiros para arredondar sacos sem erro de ponto flutuante.
      const centesimos = (valor) => BigInt(Math.round(valor * 100));
      const volume = centesimos(comprimento) * centesimos(largura) * centesimos(profundidade);
      const tamanhoSaco = centesimos(saco) * 10000000n;
      quantidade = (volume + tamanhoSaco - 1n) / tamanhoSaco;
    }
    definirResultado({ litros, quantidade });
  }

  return (
    <section className="painel-guia" id="calculadora-terra" aria-labelledby="titulo-terra">
      <h3 id="titulo-terra">Calculadora de terra</h3>
      <p>Meça por dentro do vaso, jardineira ou canteiro retangular.</p>
      <form noValidate className="form-guia" onSubmit={calcular} onChange={() => {
        definirResultado(null);
        definirInvalidos([]);
      }}>
        <div className="campos-guia campos-guia-duplo">
          {campos.map(({ id, rotulo }) => (
            <label className="campo" key={id}>{rotulo}
              <input name={id} inputMode="decimal" required={id !== "saco"}
                aria-invalid={invalidos.includes(id) || undefined}
                aria-describedby={invalidos.includes(id) ? "erro-terra" : undefined} />
            </label>
          ))}
        </div>
        {invalidos.length > 0 && <p className="erro" id="erro-terra" role="alert">Use valores de 0,01 a 10.000, com até duas casas decimais. Exemplo: 20,5.</p>}
        <button className="botao" type="submit">Calcular terra</button>
      </form>
      <div aria-live="polite">
        {resultado && <div className="resultado">
          <strong>{resultado.litros < 0.0001 ? "Menos de 0,0001" : formatarMedida(resultado.litros)} L de terra</strong>
          {resultado.quantidade !== null && (
            <p>{resultado.quantidade.toLocaleString("pt-BR")} {resultado.quantidade === 1n ? "saco" : "sacos"} do tamanho informado.</p>
          )}
        </div>}
      </div>
    </section>
  );
}
