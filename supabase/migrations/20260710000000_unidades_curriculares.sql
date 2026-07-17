-- Modelo de dados curricular — GradeFlow
-- Catálogo de UCs é global por curso (mesma fonte pra qualquer usuário do mesmo curso),
-- com uma exceção: UCs "pessoais" (criado_por preenchido) só o próprio autor vê/edita.
-- Progresso (status, grupo_eletiva) é por usuário, em tabela separada.
--
-- Script idempotente: pode ser rodado de novo com segurança (apaga e recria do zero).
-- Isso apaga qualquer dado que já exista nessas tabelas — inofensivo agora (ainda não há
-- progresso real salvo), mas não rode isso depois que o app estiver em uso de verdade.

drop table if exists progresso_uc cascade;
drop table if exists unidades_curriculares cascade;
drop table if exists cursos cascade;
drop type if exists uc_status cascade;
drop type if exists uc_tipo cascade;

create extension if not exists pgcrypto with schema extensions;
create extension if not exists moddatetime with schema extensions;

create type uc_tipo as enum (
  'bct_fixa',
  'bct_eletiva_interdisciplinar',
  'bct_eletiva_regular',
  'ecomp_fixa',
  'ecomp_trajetoria_integrada',
  'estagio',
  'tcc',
  'atividade_complementar'
);

create type uc_status as enum (
  'concluida',
  'cursando',
  'disponivel',
  'bloqueada',
  'planejada'
);

-- ===== Cursos =====
-- MVP = 1 curso só, mas já modelado pra multi-curso no futuro sem precisar migrar de novo.
create table cursos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  universidade text not null default 'UNIFESP'
);

insert into cursos (nome) values ('Engenharia de Computação');

-- ===== Unidades Curriculares (catálogo, global por curso) =====
create table unidades_curriculares (
  id uuid primary key default gen_random_uuid(),
  curso_id uuid not null references cursos (id) on delete cascade,

  -- null = UC oficial do catálogo (visível a todos, só editável via migration).
  -- preenchido = UC pessoal, só o autor vê/edita/remove.
  criado_por uuid references auth.users (id) on delete cascade,

  codigo text not null,
  nome text not null,
  semestre_sugerido smallint,
  creditos smallint not null check (creditos >= 0),
  carga_horaria_teorica smallint not null default 0 check (carga_horaria_teorica >= 0),
  carga_horaria_pratica smallint not null default 0 check (carga_horaria_pratica >= 0),
  carga_horaria_total smallint not null check (carga_horaria_total >= 0),
  carga_horaria_extensao smallint not null default 0 check (carga_horaria_extensao >= 0),
  tipo uc_tipo not null,
  pre_requisitos text[] not null default '{}',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- código só precisa ser único dentro do catálogo oficial de um curso;
-- UCs pessoais podem reaproveitar/ter qualquer código.
create unique index unidades_curriculares_oficial_codigo_idx
  on unidades_curriculares (curso_id, codigo)
  where criado_por is null;

create index unidades_curriculares_curso_id_idx on unidades_curriculares (curso_id);
create index unidades_curriculares_criado_por_idx on unidades_curriculares (criado_por);

create trigger set_updated_at
  before update on unidades_curriculares
  for each row
  execute function extensions.moddatetime(updated_at);

alter table unidades_curriculares enable row level security;

create policy "vê UCs oficiais ou próprias"
  on unidades_curriculares for select
  using (criado_por is null or criado_por = auth.uid());

create policy "insere apenas UCs próprias"
  on unidades_curriculares for insert
  with check (criado_por = auth.uid());

create policy "edita apenas UCs próprias"
  on unidades_curriculares for update
  using (criado_por = auth.uid())
  with check (criado_por = auth.uid());

create policy "remove apenas UCs próprias"
  on unidades_curriculares for delete
  using (criado_por = auth.uid());

-- ===== Progresso por usuário =====
create table progresso_uc (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  uc_id uuid not null references unidades_curriculares (id) on delete cascade,

  status uc_status not null default 'planejada',
  grupo_eletiva text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (user_id, uc_id)
);

create index progresso_uc_user_id_idx on progresso_uc (user_id);

create trigger set_updated_at
  before update on progresso_uc
  for each row
  execute function extensions.moddatetime(updated_at);

alter table progresso_uc enable row level security;

create policy "usuário vê apenas seu próprio progresso"
  on progresso_uc for select
  using (auth.uid() = user_id);

create policy "usuário insere apenas seu próprio progresso"
  on progresso_uc for insert
  with check (auth.uid() = user_id);

create policy "usuário edita apenas seu próprio progresso"
  on progresso_uc for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "usuário remove apenas seu próprio progresso"
  on progresso_uc for delete
  using (auth.uid() = user_id);
