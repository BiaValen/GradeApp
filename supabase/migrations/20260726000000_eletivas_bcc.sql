-- Completa o catálogo de eletivas do BCC (Grupos 1/2/3 da Tabela 1, PPC páginas 25-29).
-- Fonte dos códigos/CH/pré-requisitos: planilha "LISTA DE UCs - BCT" (mesma fonte
-- complementar já citada em src/lib/seed-data.ts pro catálogo do Ecomp), cruzada por
-- nome com os nomes exatos listados na Tabela 1 do PPC do BCC.
--
-- Também corrige um erro de escopo da migration anterior (20260723000000): o bulk-copy
-- do pool "bct_eletiva_interdisciplinar" do Ecomp trouxe pro BCC ~54 UCs, mas a Tabela 4
-- do PPC do BCC mostra que só 4 UCs específicas (Iniciação aos PEPICTs I/II, Práticas em
-- Projetos Extensionistas I/II — 216h) contam pra exigência de "eletivas interdisciplinares
-- extensionistas" do BCC. As demais ~50 UCs continuam válidas como opção de eletiva do BCC
-- (Grupos 1/2/3), só que com o tipo errado — corrigido aqui pra bcc_eletiva_regular.
-- Não afeta nenhum total agregado (ambos os tipos contam como "eletiva" pro app).

update curso_ucs
set tipo = 'bcc_eletiva_regular'
where curso_id = (select id from cursos where nome = 'Ciência da Computação')
  and tipo = 'bct_eletiva_interdisciplinar'
  and uc_id not in (
    select id from unidades_curriculares
    where codigo in ('SC-PEPICT-I', 'SC-PEPICT-II', '8240', '8051') and criado_por is null
  );

insert into unidades_curriculares
  (codigo, nome, creditos, carga_horaria_teorica, carga_horaria_pratica, carga_horaria_total, carga_horaria_extensao, pre_requisitos)
values
  -- Grupo 1: Eletivas Limitadas da Ciência da Computação
  ('4413', 'Aprendizado de Máquina e Reconhecimento de Padrões', 4, 48, 24, 72, 0, array['2609','9394']::text[]),
  ('4782', 'Aspectos de Implementação de Bancos de Dados', 4, 32, 40, 72, 0, array['2831']::text[]),
  ('4412', 'Introdução à Pesquisa Operacional', 4, 64, 8, 72, 0, array['2475']::text[]),
  ('3489', 'Introdução às Redes Neurais Artificiais', 4, 36, 36, 72, 0, array['2832']::text[]),
  ('2199', 'Paradigmas de Programação', 4, 36, 36, 72, 0, array['2471']::text[]),
  ('3581', 'Processamento de Imagens', 4, 48, 24, 72, 0, array['2832','4328']::text[]),
  ('4663', 'Programação Paralela e Processamento de Alto Desempenho', 4, 36, 36, 72, 0, array['3580']::text[]),
  ('4410', 'Realidade Virtual e Aumentada', 4, 54, 18, 72, 0, array['2832']::text[]),
  ('3819', 'Segurança Computacional', 4, 36, 36, 72, 0, array['2612']::text[]),
  ('3049', 'Sistemas Distribuídos', 4, 42, 30, 72, 0, array['2612']::text[]),
  ('3050', 'Validação e Verificação de Software', 4, 36, 36, 72, 0, array['2614']::text[]),
  -- Grupo 2: Eletivas de Matemática e Computação
  ('4146', 'Álgebra Linear Computacional', 4, 62, 10, 72, 0, array['2475','2828']::text[]),
  ('5373', 'Álgebra Linear II', 4, 72, 0, 72, 0, array['2475']::text[]),
  ('5773', 'Análise Real I', 4, 72, 0, 72, 0, array['5702']::text[]),
  ('5856', 'Bioinformática Avançada', 4, 36, 36, 72, 0, array['5372']::text[]),
  ('6103', 'Computação Bioinspirada', 4, 48, 24, 72, 0, array['2832']::text[]),
  ('4781', 'Desenvolvimento de Aplicações Robóticas', 4, 20, 52, 72, 0, array['2832']::text[]),
  ('6050', 'Introdução à Lógica Fuzzy', 4, 58, 14, 72, 0, array[]::text[]),
  ('5930', 'Laboratório de Eletrônica Digital', 2, 0, 36, 36, 0, array['3518']::text[]),
  ('8218', 'Processamento de Sinais', 2, 0, 36, 36, 4, array['5132','5414']::text[]),
  ('4662', 'Projeto de Sistemas Digitais', 4, 20, 52, 72, 0, array['3519','9394']::text[]),
  ('6057', 'Séries Temporais e Previsões', 4, 62, 10, 72, 0, array['4401']::text[]),
  ('4150', 'Simulação de Sistemas', 4, 44, 28, 72, 0, array['2609','9394']::text[]),
  ('6075', 'Sistemas Robóticos', 4, 52, 20, 72, 0, array['2832','4369']::text[]),
  ('6166', 'Tópicos em Fundamentos da Computação I', 4, 36, 36, 72, 0, array['2832']::text[]),
  ('6167', 'Tópicos em Fundamentos da Computação II', 4, 36, 36, 72, 0, array['2832']::text[]),
  ('7214', 'Tópicos em Fundamentos da Computação III', 4, 36, 36, 72, 0, array['2832']::text[]),
  ('7215', 'Tópicos em Fundamentos da Computação IV', 4, 72, 0, 72, 0, array[]::text[]),
  ('7216', 'Tópicos em Fundamentos da Computação V', 2, 36, 0, 36, 0, array[]::text[]),
  ('6168', 'Tópicos em Tecnologia da Computação I', 4, 36, 36, 72, 0, array['2832']::text[]),
  ('6169', 'Tópicos em Tecnologia da Computação II', 4, 36, 36, 72, 0, array['2832']::text[]),
  ('7217', 'Tópicos em Tecnologia da Computação III', 4, 36, 36, 72, 0, array['2832']::text[]),
  ('7218', 'Tópicos em Tecnologia da Computação IV', 4, 36, 36, 72, 0, array[]::text[]),
  ('7219', 'Tópicos em Tecnologia da Computação V', 4, 36, 36, 72, 0, array[]::text[]),
  ('6074', 'Tópicos Interdisciplinares em Computação I', 2, 24, 12, 36, 0, array['9394']::text[]),
  ('6080', 'Tópicos Interdisciplinares em Computação II', 2, 24, 12, 36, 0, array['9394']::text[]),
  ('6092', 'Tópicos Interdisciplinares em Computação III', 2, 24, 12, 36, 0, array['2832']::text[]),
  ('6097', 'Tópicos Interdisciplinares em Computação IV', 2, 24, 12, 36, 0, array['2832']::text[]),
  -- Grupo 3: Eletivas das Ciências Humanas, Econômicas e Sociais
  ('5775', 'Alteridade e Diversidade no Brasil: Implicações para Política de C&T', 2, 36, 0, 36, 0, array[]::text[]),
  ('5095', 'Análise de Investimentos e Riscos', 4, 30, 42, 72, 0, array[]::text[]),
  ('5115', 'Cidadania, Ciência e Polêmica', 4, 72, 0, 72, 0, array[]::text[]),
  ('5919', 'Cultura Digital', 4, 72, 0, 72, 0, array[]::text[]),
  ('5869', 'Ecologia Avançada', 4, 72, 0, 72, 0, array['4714']::text[]),
  ('6081', 'Economia Monetária e Bancos', 2, 36, 0, 36, 0, array['2609','5359']::text[]),
  ('6069', 'Introdução à Economia Global', 2, 36, 0, 36, 0, array[]::text[]),
  ('6082', 'Introdução à Engenharia Financeira', 4, 30, 42, 72, 0, array['2609','5359']::text[]),
  ('6034', 'Legislação Ambiental e Políticas Públicas', 4, 72, 0, 72, 0, array[]::text[]),
  ('4775', 'Macroeconomia', 2, 36, 0, 36, 0, array[]::text[]),
  ('4374', 'Metodologia da Pesquisa e Comunicação Científica', 2, 28, 8, 36, 0, array[]::text[]),
  ('6083', 'Organização Industrial', 2, 36, 0, 36, 0, array['5359']::text[]),
  ('6071', 'Política Científica e Tecnológica (PC&T)', 2, 36, 0, 36, 0, array[]::text[]),
  ('6070', 'Relações Étnico-Raciais e Cultura Afro-Brasileira e Indígena', 2, 36, 0, 36, 0, array[]::text[]),
  ('5887', 'Teoria das Finanças', 2, 36, 0, 36, 0, array[]::text[])
on conflict (codigo) where criado_por is null do nothing;

insert into curso_ucs (curso_id, uc_id, tipo, semestre_sugerido, oferta)
select (select id from cursos where nome = 'Ciência da Computação'), u.id, 'bcc_eletiva_regular'::uc_tipo, null, 'ambos'::uc_oferta
from unidades_curriculares u
where u.criado_por is null
  and u.codigo in (
    '4413','4782','4412','3489','2199','3581','4663','4410','3819','3049','3050',
    '4146','5373','5773','5856','6103','4781','6050','5930','8218','4662','6057','4150','6075',
    '6166','6167','7214','7215','7216','6168','6169','7217','7218','7219','6074','6080','6092','6097',
    '5775','5095','5115','5919','5869','6081','6069','6082','6034','4775','4374','6083','6071','6070','5887'
  )
on conflict (curso_id, uc_id) do nothing;
