-- Perfil pessoal do usuário (Config): hoje só semestre atual, pra mostrar o selo "Atual" no Plano.
-- Incremental, não apaga nada.

create table if not exists perfil (
  user_id uuid primary key references auth.users (id) on delete cascade,
  semestre_atual smallint,
  updated_at timestamptz not null default now()
);

create trigger set_updated_at
  before update on perfil
  for each row
  execute function extensions.moddatetime(updated_at);

alter table perfil enable row level security;

create policy "usuário vê apenas seu próprio perfil"
  on perfil for select
  using (auth.uid() = user_id);

create policy "usuário insere apenas seu próprio perfil"
  on perfil for insert
  with check (auth.uid() = user_id);

create policy "usuário edita apenas seu próprio perfil"
  on perfil for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
