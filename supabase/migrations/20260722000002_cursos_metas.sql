-- Multi-curso (3/4): cada curso passa a ter seus próprios atributos de meta de
-- horas/créditos — hoje esses números estavam hardcoded em src/lib/horas.ts e
-- src/lib/analise.ts, só valiam pra Engenharia de Computação (Ecomp).
--
-- meta_horas_extensao é informativa (extensão curricularizada já embutida dentro das
-- UCs fixas/eletivas concluídas) — não soma à parte em meta_horas_total, mesmo padrão
-- que o app já usava só pra Ecomp.
-- Incremental, não apaga nada.

alter table cursos
  add column if not exists semestres_oficiais smallint not null default 10,
  add column if not exists meta_creditos smallint not null default 0,
  add column if not exists meta_horas_fixas smallint not null default 0,
  add column if not exists meta_horas_estagio smallint not null default 0,
  add column if not exists meta_horas_tcc smallint not null default 0,
  add column if not exists meta_horas_complementares smallint not null default 0,
  add column if not exists meta_horas_eletivas smallint not null default 0,
  add column if not exists meta_horas_extensao smallint not null default 0,
  add column if not exists meta_horas_total smallint not null default 0;

-- Backfill Ecomp com os números já usados hoje (PPC 2023, Tabela 4).
update cursos
set
  semestres_oficiais = 10,
  meta_creditos = 214,
  meta_horas_fixas = 3276,
  meta_horas_estagio = 180,
  meta_horas_tcc = 144,
  meta_horas_complementares = 108,
  meta_horas_eletivas = 252,
  meta_horas_extensao = 396,
  meta_horas_total = 3276 + 180 + 144 + 108 + 252
where nome = 'Engenharia de Computação';

-- Insere o curso de Ciência da Computação (BCC), com os números derivados do PPC 2023
-- (DOCS/CCOMP/PPC_BCC_2023.pdf): 8 semestres, 170 créditos, sem estágio obrigatório.
insert into cursos (
  nome, universidade, semestres_oficiais, meta_creditos, meta_horas_fixas,
  meta_horas_estagio, meta_horas_tcc, meta_horas_complementares, meta_horas_eletivas,
  meta_horas_extensao, meta_horas_total
)
select
  'Ciência da Computação', 'UNIFESP', 8, 170, 2268,
  0, 144, 144, 648,
  94, 2268 + 0 + 144 + 144 + 648
where not exists (select 1 from cursos where nome = 'Ciência da Computação');

-- Perfis já criados antes de "curso" existir apontam pro curso real dela hoje (Ecomp).
update perfil
set curso_id = (select id from cursos where nome = 'Engenharia de Computação')
where curso_id is null;
