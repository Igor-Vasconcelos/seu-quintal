CREATE TABLE IF NOT EXISTS contas (
  id uuid PRIMARY KEY,
  usuario text UNIQUE NOT NULL CHECK (usuario ~ '^[a-z0-9][a-z0-9._-]{2,31}$'),
  sal bytea NOT NULL,
  senha_hash bytea NOT NULL
);

CREATE TABLE IF NOT EXISTS sessoes (
  token_hash bytea PRIMARY KEY,
  conta_id uuid NOT NULL REFERENCES contas(id) ON DELETE CASCADE,
  expira_em timestamptz NOT NULL
);

CREATE INDEX IF NOT EXISTS sessoes_expiracao_idx ON sessoes (expira_em);

ALTER TABLE planejamentos
  ADD COLUMN IF NOT EXISTS dono_id uuid REFERENCES contas(id),
  ADD COLUMN IF NOT EXISTS criado_em timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS planejamentos_dono_pagina_idx
  ON planejamentos (dono_id, criado_em DESC, id DESC);
