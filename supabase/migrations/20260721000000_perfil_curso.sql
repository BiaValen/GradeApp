-- Salva qual curso a pessoa escolheu na tela /curso, pra lembrar da próxima vez que
-- ela logar e pra poder trocar depois em Configurações.
-- Incremental, não apaga nada.

alter table perfil
  add column if not exists curso_id uuid references cursos (id);
