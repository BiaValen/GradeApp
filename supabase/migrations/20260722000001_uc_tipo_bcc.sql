-- Multi-curso (2/4): novo tipo de UC pro catálogo do BCC (Ciência da Computação).
-- Eletiva interdisciplinar do BCC reaproveita 'bct_eletiva_interdisciplinar' (mesmo pool
-- compartilhado que o Ecomp já usa) — só a fixa própria e a eletiva regular própria do
-- BCC precisam de tipo novo.
-- ALTER TYPE ... ADD VALUE não roda dentro do mesmo bloco de transação que usa o valor
-- novo, por isso fica isolado num arquivo próprio.
-- Incremental, não apaga nada.

do $$
begin
  if not exists (
    select 1 from pg_enum where enumlabel = 'bcc_fixa'
      and enumtypid = 'uc_tipo'::regtype
  ) then
    alter type uc_tipo add value 'bcc_fixa';
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_enum where enumlabel = 'bcc_eletiva_regular'
      and enumtypid = 'uc_tipo'::regtype
  ) then
    alter type uc_tipo add value 'bcc_eletiva_regular';
  end if;
end $$;
