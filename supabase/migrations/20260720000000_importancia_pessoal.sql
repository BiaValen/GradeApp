-- Marcação pessoal de "importante" por UC — diferente do score de importância já
-- calculado no Plano/Grafo (nº de UCs que dependem dela, automático). Essa aqui é uma
-- escolha subjetiva da própria usuária, só pra destacar visualmente o card no Plano
-- (tom mais alaranjado); não entra em nenhum cálculo (previsão, horas, etc).
-- Incremental, não apaga nada.

alter table progresso_uc
  add column if not exists importante_pessoal boolean not null default false;
