-- A tabela "cursos" ficou com RLS ativado (provavelmente pelo linter de segurança do
-- Supabase) mas sem nenhuma política de leitura — toda consulta a ela (mesmo autenticada)
-- vinha vazia, quebrando a nova tela de seleção de curso (/curso). São só metadados
-- públicos do catálogo (nome do curso, universidade), sem dado sensível — qualquer
-- usuário autenticado pode ler.
-- Incremental, não apaga nada.

alter table cursos enable row level security;

create policy "usuário autenticado vê todos os cursos"
  on cursos for select
  to authenticated
  using (true);
