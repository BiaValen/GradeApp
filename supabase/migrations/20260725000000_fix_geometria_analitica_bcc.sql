-- Correção de classificação no catálogo do BCC: "Geometria Analítica" (código 2650) foi
-- seedada como bct_fixa por engano — mas a Tabela 1 do PPC do BCC (pág. 24) lista as UCs
-- Fixas do BCT como só 7 UCs (Cálculo em Uma Variável, CTS, CTSA, Fenômenos Mecânicos,
-- Fundamentos de Biologia Moderna, Lógica de Programação, Química Geral), que somam
-- exatamente 26 créditos / 468h (confirmado na Figura 1, pág. 37). Geometria Analítica faz
-- parte do núcleo específico do BCC (bcc_fixa) — com essa correção, "Fixas do BCC" bate
-- exatamente com os 108 créditos / 1944h da Figura 1 (100cr regulares + 8cr de TCC).
-- Não muda nenhum total agregado (curso.meta_horas_fixas já somava os dois tipos juntos),
-- só corrige a etiqueta/paridade exibida pra essa UC especificamente no catálogo do BCC.

update curso_ucs
set tipo = 'bcc_fixa', oferta = 'par'
where curso_id = (select id from cursos where nome = 'Ciência da Computação')
  and uc_id = (select id from unidades_curriculares where codigo = '2650' and criado_por is null);
