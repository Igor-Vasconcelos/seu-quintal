import { useState } from "react";
import { formatarMedida, lerMedida } from "../planejador/geometria.js";

const campos = [
  { id: "comprimento", rotulo: "Comprimento", exemplo: { cm: "60", m: "0,60" } },
  { id: "largura", rotulo: "Largura", exemplo: { cm: "25", m: "0,25" } },
  { id: "profundidade", rotulo: "Altura da terra", exemplo: { cm: "20", m: "0,20" } },
];

export default function CalculadoraTerra() {
  const [unidade, definirUnidade] = useState("cm");
  const [resultado, definirResultado] = useState(null);
  const [invalidos, definirInvalidos] = useState([]);

  function calcular(evento) {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    const dados = new FormData(formulario);
    const ids = [...campos.map(({ id }) => id), "saco"];
    const textos = ids.map((id) => dados.get(id).trim());
    const valores = textos.map((texto) => lerMedida(texto));
    const erros = ids.filter((id, i) => valores[i] === null && (id !== "saco" || textos[i]));
    if (erros.length) {
      definirInvalidos(erros);
      formulario.elements.namedItem(erros[0]).focus();
      return;
    }

    const fator = unidade === "m" ? 10000 : 100;
    const [comprimento, largura, altura, saco] = valores;
    // Trabalha com centésimos de centímetro para arredondar os sacos de forma exata.
    const medidaInteira = (valor) => BigInt(Math.round(valor * fator));
    const volume = medidaInteira(comprimento) * medidaInteira(largura) * medidaInteira(altura);
    const tamanhoSaco = saco === null ? null : BigInt(Math.round(saco * 100)) * 10000000n;
    const quantidade = tamanhoSaco === null ? null : (volume + tamanhoSaco - 1n) / tamanhoSaco;
    definirResultado({ litros: Number(volume) / 1e9, quantidade });
  }

  return (
    <section id="calculadora-terra" aria-labelledby="titulo-terra">
      <h3 id="titulo-terra">Quanta terra você precisa?</h3>
      <p className="nota" id="ajuda-terra">Meça por dentro do recipiente retangular. A altura vai do fundo até onde você quer colocar terra.</p>
      <form noValidate className="form-guia form-terra" onSubmit={calcular} onChange={() => {
        definirResultado(null);
        definirInvalidos([]);
      }}>
        <label className="campo">Unidade das medidas
          <select value={unidade} onChange={(evento) => definirUnidade(evento.target.value)} aria-describedby="ajuda-unidade-terra">
            <option value="cm">Centímetros (cm)</option>
            <option value="m">Metros (m)</option>
          </select>
        </label>
        <p className="nota" id="ajuda-unidade-terra">Use a mesma unidade nos três lados. 25 cm é o mesmo que 0,25 m.</p>
        <div className="campos-guia campos-terra">
          {campos.map(({ id, rotulo, exemplo }) => (
            <label className="campo" key={id}>{rotulo} ({unidade})
              <input name={id} inputMode="decimal" placeholder={`Ex.: ${exemplo[unidade]}`} required
                aria-invalid={invalidos.includes(id) || undefined}
                aria-describedby={invalidos.includes(id) ? "erro-terra" : "ajuda-terra"} />
            </label>
          ))}
        </div>
        <label className="campo saco-terra">Volume de um saco (L, opcional)
          <input name="saco" inputMode="decimal" placeholder="Ex.: 20"
            aria-invalid={invalidos.includes("saco") || undefined}
            aria-describedby={invalidos.includes("saco") ? "erro-terra" : undefined} />
        </label>
        {invalidos.length > 0 && <p className="erro" id="erro-terra" role="alert">Informe um valor de 0,01 a 10.000, com até duas casas decimais.</p>}
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
