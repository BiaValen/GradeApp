-- Quando uma UC é realmente oferecida: ímpar, par, ou ambos (todo semestre).
-- Sem isso, a trava de paridade do Plano (e a previsão de conclusão) assumia que TODA UC só
-- roda na mesma paridade do seu semestre_sugerido — errado pra UCs BCT (turma grande,
-- provavelmente ofertadas todo semestre) vs. UCs específicas da Ecomp (turma pequena,
-- ~25 alunos/ano, prováveis de rodar só uma vez por ano). É uma estimativa, ajustável
-- depois por UC se algum caso específico estiver errado.
-- Incremental, não apaga nada.

-- create type não tem "if not exists" no Postgres — protege manualmente, já que a
-- versão anterior desse script pode ter parcialmente rodado antes da UPDATE falhar.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'uc_oferta') then
    create type uc_oferta as enum ('impar', 'par', 'ambos');
  end if;
end $$;

alter table unidades_curriculares
  add column if not exists oferta uc_oferta not null default 'ambos';

update unidades_curriculares
set oferta = (case when semestre_sugerido % 2 = 0 then 'par' else 'impar' end)::uc_oferta
where tipo in ('ecomp_fixa', 'ecomp_trajetoria_integrada') and semestre_sugerido is not null;
