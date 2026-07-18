-- Multi-curso (4/4): unidades_curriculares vira identidade compartilhada entre cursos.
-- curso_id/tipo/semestre_sugerido/oferta já foram copiados pra curso_ucs em
-- 20260722000000 — aqui só removemos as colunas antigas e trocamos o índice único de
-- código (que era por curso) por um global, já que um código oficial da UNIFESP
-- identifica a mesma UC em qualquer curso.
-- Precisa rodar depois de 20260722000000 (curso_ucs já populada).

drop index if exists unidades_curriculares_oficial_codigo_idx;
drop index if exists unidades_curriculares_curso_id_idx;

create unique index if not exists unidades_curriculares_oficial_codigo_idx
  on unidades_curriculares (codigo)
  where criado_por is null;

alter table unidades_curriculares
  drop column if exists curso_id,
  drop column if exists tipo,
  drop column if exists semestre_sugerido,
  drop column if exists oferta;
