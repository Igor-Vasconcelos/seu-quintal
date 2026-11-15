CREATE TABLE IF NOT EXISTS planejamentos (
  id uuid PRIMARY KEY,
  nome text NOT NULL CHECK (char_length(nome) BETWEEN 1 AND 80),
  largura numeric(7,2) NOT NULL CHECK (largura BETWEEN 0.01 AND 10000),
  profundidade numeric(7,2) NOT NULL CHECK (profundidade BETWEEN 0.01 AND 10000),
  itens jsonb NOT NULL CHECK (jsonb_typeof(itens) = 'array'),
  atualizado_em timestamptz NOT NULL DEFAULT now()
);
