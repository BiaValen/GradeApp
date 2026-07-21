-- Novo status "reprovada": marca uma UC que foi cursada e reprovada — não conta como
-- concluída (não soma horas/créditos na formação, não desbloqueia pré-requisitos), mas
-- fica visível no semestre em que foi cursada no Plano (não cai em "Atrasadas" como uma
-- UC que nunca foi tentada).
-- Incremental, não apaga nada.

do $$
begin
  if not exists (
    select 1 from pg_enum where enumlabel = 'reprovada'
      and enumtypid = 'uc_status'::regtype
  ) then
    alter type uc_status add value 'reprovada';
  end if;
end $$;
