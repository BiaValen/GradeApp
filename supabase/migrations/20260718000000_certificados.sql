-- Certificados de atividades complementares: registro granular por certificado, pra
-- apoiar o cumprimento das 108h exigidas no PPC de Ecomp (Seção 11 do PPC 2023). Os
-- "eixos" seguem o mesmo modelo geral da UNIFESP (pessoal/científica, orientação
-- acadêmica, cidadã/cultural, extensão), usados aqui só pra categorizar e mostrar
-- subtotais — o PPC de Ecomp não define um teto por eixo, só o total geral de 108h
-- (diferente do modelo de BCT da usuária, que tem sub-limites por eixo).
-- Incremental, não apaga nada.

create type certificado_eixo as enum (
  'pessoal_cientifica',
  'orientacao_academica',
  'cidada_cultural',
  'extensao'
);

create table if not exists certificados (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,

  nome text not null,
  ano smallint,
  eixo certificado_eixo not null,
  horas numeric(5, 1) not null check (horas > 0),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists certificados_user_id_idx on certificados (user_id);

create trigger set_updated_at
  before update on certificados
  for each row
  execute function extensions.moddatetime(updated_at);

alter table certificados enable row level security;

create policy "usuário vê apenas seus próprios certificados"
  on certificados for select
  using (auth.uid() = user_id);

create policy "usuário insere apenas seus próprios certificados"
  on certificados for insert
  with check (auth.uid() = user_id);

create policy "usuário edita apenas seus próprios certificados"
  on certificados for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "usuário remove apenas seus próprios certificados"
  on certificados for delete
  using (auth.uid() = user_id);
