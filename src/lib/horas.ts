import type { Uc } from "@/lib/types";
import type { UcTipo } from "@/lib/seed-data";

export interface CategoriaHoras {
  chave: string;
  titulo: string;
  descricao: string;
  concluidas: number;
  meta: number;
}

const TIPOS_FIXAS: UcTipo[] = ["bct_fixa", "ecomp_fixa", "ecomp_trajetoria_integrada"];
const TIPOS_ELETIVAS: UcTipo[] = ["bct_eletiva_interdisciplinar", "bct_eletiva_regular"];

function somaHoras(ucs: Uc[]): number {
  return ucs.reduce((soma, uc) => soma + uc.carga_horaria_total, 0);
}

// Metas conforme o PPC 2023 (Projeto_Pedagogico_EC_2023.pdf, Tabela 4). A extensão
// curricularizada NÃO soma à parte no total geral — é carga horária que já está
// embutida dentro das UCs fixas/eletivas concluídas, não um bloco extra de horas.
//
// horasCertificados: soma incremental dos certificados cadastrados em /certificados —
// substitui a antiga UC única "AC-108" (tudo-ou-nada) como fonte das 108h de atividades
// complementares, já que agora dá pra ver o progresso subindo certificado por certificado.
export function calcularHoras(
  ucs: Uc[],
  horasCertificados: number = 0,
): {
  categorias: CategoriaHoras[];
  totalConcluido: number;
  totalMeta: number;
} {
  const concluidas = ucs.filter((uc) => uc.status === "concluida");

  const fixas = concluidas.filter((uc) => TIPOS_FIXAS.includes(uc.tipo));
  const estagio = concluidas.filter((uc) => uc.tipo === "estagio");
  const tcc = concluidas.filter((uc) => uc.tipo === "tcc");
  const eletivas = concluidas.filter((uc) => TIPOS_ELETIVAS.includes(uc.tipo));
  const extensaoHoras = concluidas.reduce((soma, uc) => soma + uc.carga_horaria_extensao, 0);

  const categorias: CategoriaHoras[] = [
    {
      chave: "fixas",
      titulo: "UCs Fixas",
      descricao: "Carga horária total das unidades curriculares fixas do curso.",
      concluidas: somaHoras(fixas),
      meta: 3276,
    },
    {
      chave: "estagio",
      titulo: "Estágio Obrigatório",
      descricao: "Carga horária mínima para o estágio supervisionado obrigatório.",
      concluidas: somaHoras(estagio),
      meta: 180,
    },
    {
      chave: "tcc",
      titulo: "Trabalho de Conclusão de Curso",
      descricao: "Carga horária total para o Trabalho de Conclusão de Curso (TCC I e TCC II).",
      concluidas: somaHoras(tcc),
      meta: 144,
    },
    {
      chave: "complementares",
      titulo: "Atividades Complementares",
      descricao:
        "Soma dos certificados cadastrados em /certificados — Iniciação Científica, Monitoria, participação em eventos etc.",
      concluidas: horasCertificados,
      meta: 108,
    },
    {
      chave: "eletivas",
      titulo: "UCs Eletivas",
      descricao: "Carga horária total das unidades curriculares eletivas (mín. 144h interdisciplinares + 108h regulares).",
      concluidas: somaHoras(eletivas),
      meta: 252,
    },
    {
      chave: "extensao",
      titulo: "Atividades de Extensão Curricularizadas",
      descricao:
        "Carga horária mínima em atividades de extensão, distribuída em unidades curriculares fixas e eletivas, exigida para alunos ingressantes a partir de 2023.",
      concluidas: extensaoHoras,
      meta: 396,
    },
  ];

  const totalMeta = 3276 + 180 + 144 + 108 + 252;
  // se ela cadastrar mais certificados do que as 108h exigidas, o excedente aparece no
  // card da categoria mas não infla o total geral além da meta reservada pra essa parte.
  const complementaresParaTotal = Math.min(horasCertificados, 108);
  const totalConcluido =
    somaHoras(fixas) +
    somaHoras(estagio) +
    somaHoras(tcc) +
    complementaresParaTotal +
    somaHoras(eletivas);

  return { categorias, totalConcluido, totalMeta };
}
