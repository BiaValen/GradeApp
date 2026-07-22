import { ehTipoEletivo, ehTipoFixo } from "@/lib/uc-classificacao";
import type { Curso, Uc } from "@/lib/types";

export interface CategoriaHoras {
  chave: string;
  titulo: string;
  descricao: string;
  concluidas: number;
  meta: number;
  // UCs que contam pra essa categoria — pra "fixas"/"estágio"/"tcc" (checklist fechado
  // de UCs específicas) inclui concluídas E pendentes, pra dar pra ver o que falta.
  // "eletivas" só lista as já concluídas (é escolha livre entre dezenas de opções do
  // catálogo — listar as pendentes ali seria ruído, mesmo critério já usado em
  // src/lib/analise.ts pras eletivas não aparecerem em "disponíveis"/"bloqueadas").
  ucs: Uc[];
}

function somaHoras(ucs: Uc[]): number {
  return ucs.reduce((soma, uc) => soma + uc.carga_horaria_total, 0);
}

// Metas vêm de curso.meta_* (por curso — ver migration 20260722000002_cursos_metas.sql).
// A extensão curricularizada NÃO soma à parte no total geral — é carga horária que já
// está embutida dentro das UCs fixas/eletivas concluídas, não um bloco extra de horas.
//
// horasCertificados: soma incremental dos certificados cadastrados em /certificados —
// substitui a antiga UC única "AC-108" (tudo-ou-nada) como fonte das horas de atividades
// complementares, já que agora dá pra ver o progresso subindo certificado por certificado.
export function calcularHoras(
  ucs: Uc[],
  curso: Curso,
  horasCertificados: number = 0,
): {
  categorias: CategoriaHoras[];
  totalConcluido: number;
  totalMeta: number;
} {
  const concluidas = ucs.filter((uc) => uc.status === "concluida");
  const ordenarPorSemestre = (lista: Uc[]) =>
    [...lista].sort(
      (a, b) => (a.semestre_sugerido ?? 999) - (b.semestre_sugerido ?? 999) || a.nome.localeCompare(b.nome),
    );

  // checklist fechado: todas as UCs desse tipo (concluídas e pendentes), não só as feitas.
  const fixasTodas = ordenarPorSemestre(ucs.filter((uc) => ehTipoFixo(uc.tipo)));
  const estagioTodas = ordenarPorSemestre(ucs.filter((uc) => uc.tipo === "estagio"));
  const tccTodas = ordenarPorSemestre(ucs.filter((uc) => uc.tipo === "tcc"));
  const eletivasConcluidas = ordenarPorSemestre(
    concluidas.filter((uc) => ehTipoEletivo(uc.tipo)),
  );

  const fixas = fixasTodas.filter((uc) => uc.status === "concluida");
  const estagio = estagioTodas.filter((uc) => uc.status === "concluida");
  const tcc = tccTodas.filter((uc) => uc.status === "concluida");
  const extensaoHoras = concluidas.reduce((soma, uc) => soma + uc.carga_horaria_extensao, 0);

  const categorias: CategoriaHoras[] = [
    {
      chave: "fixas",
      titulo: "UCs Fixas",
      descricao: "Carga horária total das unidades curriculares fixas do curso.",
      concluidas: somaHoras(fixas),
      meta: curso.meta_horas_fixas,
      ucs: fixasTodas,
    },
    {
      chave: "estagio",
      titulo: "Estágio Obrigatório",
      descricao: "Carga horária mínima para o estágio supervisionado obrigatório.",
      concluidas: somaHoras(estagio),
      meta: curso.meta_horas_estagio,
      ucs: estagioTodas,
    },
    {
      chave: "tcc",
      titulo: "Trabalho de Conclusão de Curso",
      descricao: "Carga horária total para o Trabalho de Conclusão de Curso (TCC I e TCC II).",
      concluidas: somaHoras(tcc),
      meta: curso.meta_horas_tcc,
      ucs: tccTodas,
    },
    {
      chave: "complementares",
      titulo: "Atividades Complementares",
      descricao:
        "Soma dos certificados cadastrados em /certificados — Iniciação Científica, Monitoria, participação em eventos etc.",
      concluidas: horasCertificados,
      meta: curso.meta_horas_complementares,
      ucs: [],
    },
    {
      chave: "eletivas",
      titulo: "UCs Eletivas",
      descricao: "Carga horária total das unidades curriculares eletivas do curso.",
      concluidas: somaHoras(eletivasConcluidas),
      meta: curso.meta_horas_eletivas,
      ucs: eletivasConcluidas,
    },
    {
      chave: "extensao",
      titulo: "Atividades de Extensão Curricularizadas",
      descricao:
        "Carga horária mínima em atividades de extensão, distribuída em unidades curriculares fixas e eletivas, exigida para alunos ingressantes a partir de 2023.",
      concluidas: extensaoHoras,
      meta: curso.meta_horas_extensao,
      ucs: [],
    },
  ];

  // se ela cadastrar mais certificados do que as horas exigidas, o excedente aparece no
  // card da categoria mas não infla o total geral além da meta reservada pra essa parte.
  const complementaresParaTotal = Math.min(horasCertificados, curso.meta_horas_complementares);
  const totalConcluido =
    somaHoras(fixas) +
    somaHoras(estagio) +
    somaHoras(tcc) +
    complementaresParaTotal +
    somaHoras(eletivasConcluidas);

  return { categorias, totalConcluido, totalMeta: curso.meta_horas_total };
}
