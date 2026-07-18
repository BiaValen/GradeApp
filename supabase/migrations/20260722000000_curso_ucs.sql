-- Multi-curso (1/4): UC vira entidade compartilhada entre cursos.
-- Hoje unidades_curriculares.curso_id amarra cada UC a um curso só — não dá pra
-- reaproveitar a mesma UC (ex: "Cálculo em uma Variável") em dois currículos com
-- classificação diferente (tipo/semestre sugerido/oferta). curso_ucs guarda essa
-- classificação por curso; unidades_curriculares vira só a identidade da UC.
--
-- Ordem cuidadosa pra não perder progresso real: 1) cria curso_ucs, 2) backfill 1:1 a
-- partir do que já existe em unidades_curriculares (id da UC não muda em nenhum passo,
-- então progresso_uc.uc_id continua válido sem tocar em nada), 3) RLS. As colunas
-- antigas (curso_id/tipo/semestre_sugerido/oferta) só são removidas de
-- unidades_curriculares numa migration seguinte (20260722000003), depois que o backfill
-- abaixo já rodou.
-- Incremental, não apaga nada.

create table if not exists curso_ucs (
  id uuid primary key default gen_random_uuid(),
  curso_id uuid not null references cursos (id) on delete cascade,
  uc_id uuid not null references unidades_curriculares (id) on delete cascade,

  tipo uc_tipo not null,
  semestre_sugerido smallint,
  oferta uc_oferta not null default 'ambos',

  unique (curso_id, uc_id)
);

create index if not exists curso_ucs_curso_id_idx on curso_ucs (curso_id);
create index if not exists curso_ucs_uc_id_idx on curso_ucs (uc_id);

-- Backfill 1:1 do vínculo que já existe hoje (cada UC pertencia a exatamente um curso).
insert into curso_ucs (curso_id, uc_id, tipo, semestre_sugerido, oferta)
select curso_id, id, tipo, semestre_sugerido, oferta
from unidades_curriculares
on conflict (curso_id, uc_id) do nothing;

alter table curso_ucs enable row level security;

-- Mesma regra de visibilidade de unidades_curriculares: oficial (criado_por null) =
-- todo mundo autenticado vê; pessoal = só o autor.
create policy "vê vínculos de UCs oficiais ou próprias"
  on curso_ucs for select
  using (
    exists (
      select 1 from unidades_curriculares uc
      where uc.id = curso_ucs.uc_id
        and (uc.criado_por is null or uc.criado_por = auth.uid())
    )
  );

create policy "insere apenas vínculos de UCs próprias"
  on curso_ucs for insert
  with check (
    exists (
      select 1 from unidades_curriculares uc
      where uc.id = curso_ucs.uc_id and uc.criado_por = auth.uid()
    )
  );

create policy "edita apenas vínculos de UCs próprias"
  on curso_ucs for update
  using (
    exists (
      select 1 from unidades_curriculares uc
      where uc.id = curso_ucs.uc_id and uc.criado_por = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from unidades_curriculares uc
      where uc.id = curso_ucs.uc_id and uc.criado_por = auth.uid()
    )
  );

create policy "remove apenas vínculos de UCs próprias"
  on curso_ucs for delete
  using (
    exists (
      select 1 from unidades_curriculares uc
      where uc.id = curso_ucs.uc_id and uc.criado_por = auth.uid()
    )
  );
