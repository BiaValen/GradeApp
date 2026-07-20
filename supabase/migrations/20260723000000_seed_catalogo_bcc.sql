-- Seed do catálogo oficial de UCs — Ciência da Computação (BCC), UNIFESP, PPC 2023.
-- Fonte: DOCS/CCOMP/PPC_BCC_2023.pdf (Figura 1 "Matriz Curricular do BCC", Tabela 2
-- "pré-requisitos", Tabela 3/4 "cargas horárias de extensão", e ementário item 7.5 —
-- de onde vieram os códigos/CH reais das UCs que não tinham código na matriz).
--
-- A maioria das UCs do BCC já existe no catálogo (são as mesmas UCs físicas
-- compartilhadas com Ecomp/BCT — ex: "Cálculo em Uma Variável", "Sistemas
-- Operacionais"), só a classificação por curso muda (ver curso_ucs). Só 5 UCs são
-- realmente novas no catálogo: Projeto Orientado a Objetos, Teoria dos Grafos,
-- Computação Gráfica, e os TCC I/II do BCC (créditos/CH diferentes do TCC do Ecomp,
-- por isso não dá pra reaproveitar o mesmo registro).
--
-- Eletivas interdisciplinares extensionistas (12cr/216h exigidos) reaproveitam o mesmo
-- pool já cadastrado pro Ecomp (mesma oferta do BCT, Tabela 4 do PPC do BCC confirma).
-- Eletivas do BCC (24cr/432h exigidos): só uma parte tem código/CH confirmado nesta
-- passada (13 UCs, principalmente Grupo 2 "Matemática e Computação" + a extensionista
-- Grupo 4) — o restante das ~90 opções nomeadas nos Grupos 1/2/3 do PPC não tem CH
-- detalhada extraída ainda; ficam de fora por ora (usuária pode adicionar via "+Nova UC"
-- enquanto isso, ou complementar depois lendo o ementário completo, páginas 40-67).
--
-- Reaplicar é seguro: ON CONFLICT em ambos os inserts.

insert into unidades_curriculares
  (codigo, nome, creditos, carga_horaria_teorica, carga_horaria_pratica, carga_horaria_total, carga_horaria_extensao, pre_requisitos)
values
  ('5168', 'Projeto Orientado a Objetos', 4, 36, 36, 72, 0, array['2471']::text[]),
  ('2975', 'Teoria dos Grafos', 4, 62, 10, 72, 0, array['3579']::text[]),
  ('3051', 'Computação Gráfica', 4, 36, 36, 72, 0, array['2832']::text[]),
  ('6106', 'Trabalho de Conclusão de Curso I', 4, 72, 0, 72, 0, array[]::text[]),
  ('SC-BCC-TCC2', 'Trabalho de Conclusão de Curso II', 4, 72, 0, 72, 0, array['6106']::text[])
on conflict (codigo) where criado_por is null do nothing;

-- Vínculos curso_ucs do BCC: classificação (tipo/semestre_sugerido/oferta) própria do
-- curso, mesmo quando a UC física é compartilhada com outro curso. Oferta segue o
-- mesmo critério já usado pro Ecomp: UCs fixas específicas do curso (bcc_fixa) tendem a
-- rodar só na paridade do próprio semestre sugerido; UCs fixas do núcleo BCT comum
-- (bct_fixa) e eletivas ficam 'ambos' (turma maior/oferta mais flexível).
insert into curso_ucs (curso_id, uc_id, tipo, semestre_sugerido, oferta)
select (select id from cursos where nome = 'Ciência da Computação'), u.id, v.tipo::uc_tipo, v.semestre_sugerido, v.oferta::uc_oferta
from unidades_curriculares u
join (
  values
    ('5702', 'bct_fixa', 1, 'ambos'),
    ('2672', 'bct_fixa', 1, 'ambos'),
    ('9394', 'bct_fixa', 1, 'ambos'),
    ('5704', 'bct_fixa', 1, 'ambos'),
    ('5703', 'bct_fixa', 1, 'ambos'),
    ('4369', 'bct_fixa', 2, 'ambos'),
    ('5870', 'bct_fixa', 2, 'ambos'),
    ('2650', 'bct_fixa', 2, 'ambos'),
    ('2832', 'bcc_fixa', 2, 'par'),
    ('4328', 'bcc_fixa', 2, 'par'),
    ('2201', 'bcc_fixa', 2, 'par'),
    ('2609', 'bcc_fixa', 3, 'impar'),
    ('3518', 'bcc_fixa', 3, 'impar'),
    ('5359', 'bcc_fixa', 3, 'impar'),
    ('2833', 'bcc_fixa', 3, 'impar'),
    ('2475', 'bcc_fixa', 3, 'impar'),
    ('2831', 'bcc_fixa', 4, 'par'),
    ('2471', 'bcc_fixa', 4, 'par'),
    ('3519', 'bcc_fixa', 4, 'par'),
    ('3579', 'bcc_fixa', 4, 'par'),
    ('2828', 'bcc_fixa', 4, 'par'),
    ('3490', 'bcc_fixa', 5, 'impar'),
    ('2616', 'bcc_fixa', 5, 'impar'),
    ('2612', 'bcc_fixa', 5, 'impar'),
    ('5168', 'bcc_fixa', 5, 'impar'),
    ('2975', 'bcc_fixa', 5, 'impar'),
    ('2617', 'bcc_fixa', 6, 'par'),
    ('2614', 'bcc_fixa', 6, 'par'),
    ('3580', 'bcc_fixa', 6, 'par'),
    ('2615', 'bcc_fixa', 6, 'par'),
    ('3051', 'bcc_fixa', 6, 'par'),
    ('9880', 'bcc_fixa', 7, 'impar'),
    ('6106', 'tcc', 7, 'ambos'),
    ('SC-BCC-TCC2', 'tcc', 8, 'ambos'),
    ('4748', 'bcc_eletiva_regular', null, 'ambos'),
    ('5132', 'bcc_eletiva_regular', null, 'ambos'),
    ('6090', 'bcc_eletiva_regular', null, 'ambos'),
    ('5928', 'bcc_eletiva_regular', null, 'ambos'),
    ('6098', 'bcc_eletiva_regular', null, 'ambos'),
    ('6095', 'bcc_eletiva_regular', null, 'ambos'),
    ('6102', 'bcc_eletiva_regular', null, 'ambos'),
    ('6104', 'bcc_eletiva_regular', null, 'ambos'),
    ('6033', 'bcc_eletiva_regular', null, 'ambos'),
    ('4406', 'bcc_eletiva_regular', null, 'ambos'),
    ('8271', 'bcc_eletiva_regular', null, 'ambos'),
    ('9881', 'bcc_eletiva_regular', null, 'ambos'),
    ('8536', 'bcc_eletiva_regular', null, 'ambos')
) as v(codigo, tipo, semestre_sugerido, oferta)
  on u.codigo = v.codigo and u.criado_por is null
on conflict (curso_id, uc_id) do nothing;

-- Eletivas interdisciplinares extensionistas: mesmo pool já vinculado ao Ecomp
-- (Tabela 4 do PPC do BCC confirma que são as UCs ofertadas pelo BCT, mesma fonte).
insert into curso_ucs (curso_id, uc_id, tipo, semestre_sugerido, oferta)
select (select id from cursos where nome = 'Ciência da Computação'), uc_id, tipo, semestre_sugerido, oferta
from curso_ucs
where curso_id = (select id from cursos where nome = 'Engenharia de Computação')
  and tipo = 'bct_eletiva_interdisciplinar'
on conflict (curso_id, uc_id) do nothing;
