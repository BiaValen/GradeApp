-- Sprint 4 (planejador): semestre planejado por usuário + atividades extras pessoais.
-- Incremental (ALTER), não apaga nada — diferente das migrations anteriores, essa roda
-- depois que já existe progresso real salvo.

-- semestre_planejado: onde o usuário decidiu colocar a UC no próprio planejamento.
-- Se nulo, o Plano usa o semestre_sugerido oficial do catálogo como padrão.
alter table progresso_uc
  add column if not exists semestre_planejado smallint;

-- Atividades extras (extensão, IC, estágio não-curricular etc.) — não são UCs, não têm
-- créditos nem pré-requisitos, só consomem horas/semana do usuário num semestre. Vivem
-- na área de configurações pessoais, à parte do catálogo de UCs.
create type atividade_extra_tipo as enum ('extensao', 'ic', 'estagio', 'outro');

create table if not exists atividades_extras (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,

  nome text not null,
  tipo atividade_extra_tipo not null default 'outro',
  horas_semana numeric(4, 1) not null check (horas_semana >= 0),
  semestre smallint not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists atividades_extras_user_id_idx on atividades_extras (user_id);

create trigger set_updated_at
  before update on atividades_extras
  for each row
  execute function extensions.moddatetime(updated_at);

alter table atividades_extras enable row level security;

create policy "usuário vê apenas suas próprias atividades extras"
  on atividades_extras for select
  using (auth.uid() = user_id);

create policy "usuário insere apenas suas próprias atividades extras"
  on atividades_extras for insert
  with check (auth.uid() = user_id);

create policy "usuário edita apenas suas próprias atividades extras"
  on atividades_extras for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "usuário remove apenas suas próprias atividades extras"
  on atividades_extras for delete
  using (auth.uid() = user_id);
