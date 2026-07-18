import { LIMITE_SOBRECARREGADO } from "@/lib/carga";
import { calcularHoras } from "@/lib/horas";
import { missingPrerequisites } from "@/lib/status";
import type { UcTipo } from "@/lib/seed-data";
import { ehTipoEletivo, ehTipoFixo } from "@/lib/uc-classificacao";
import type { Curso, Uc } from "@/lib/types";

// "Obrigatório" combina qualquer tipo fixo (por curso, via ehTipoFixo) com os 3 tipos
// que são obrigatórios em todo curso independente de prefixo (estágio pode não valer
// pra um curso específico — ver curso.meta_horas_estagio — mas continua contando aqui
// como categoria obrigatória quando existe). "Eletivo" é qualquer tipo `*_eletiva_*`.
function ehObrigatorio(tipo: UcTipo): boolean {
  return ehTipoFixo(tipo) || tipo === "estagio" || tipo === "tcc" || tipo === "atividade_complementar";
}
const ehEletivo = ehTipoEletivo;

const SEMANAS_POR_SEMESTRE = 18;
// Teto de horas/semestre usado pra empilhar a simulação — mesmo limiar que marca um
// semestre como "sobrecarregado" no Plano (src/lib/carga.ts), só que aqui vira a
// capacidade máxima que a simulação deixa entrar num semestre futuro.
const MAX_HORAS_POR_SEMESTRE = LIMITE_SOBRECARREGADO * SEMANAS_POR_SEMESTRE;
// 1 crédito = 18h/semestre (conversão oficial) — usado só pra encaixar o volume de
// eletiva que ainda falta nos espaços vazios de cada semestre simulado, já que a UC
// eletiva específica é escolha livre (não faz sentido fixar qual delas "vai" quando).
const HORAS_POR_CREDITO = 18;

export interface UcBloqueada {
  uc: Uc;
  faltando: Array<{ codigo: string; nome: string }>;
}

export interface AnaliseResumo {
  percentualGeral: number;
  creditosConcluidos: number;
  creditosMeta: number;
  horasConcluidas: number;
  horasMeta: number;
  obrigatoriasConcluidas: number;
  obrigatoriasTotal: number;
  eletivasConcluidas: number;
  semestresPrevistos: number;
  semanasPrevistas: number;
  disponiveis: Uc[];
  bloqueadas: UcBloqueada[];
}

// Simulação semestre a semestre (não uma média/heurística): a cada semestre futuro,
// empilha as obrigatórias que já estão liberadas (pré-requisito cumprido e paridade de
// oferta batendo) até um teto de horas — igual um aluno real ia montando a matrícula —
// e usa o espaço que sobrar pra encaixar o volume de créditos de eletiva que falta.
// Isso substitui tanto o "próximo semestre que bate a cadeia" quanto a antiga média de
// créditos/semestre: agora as duas coisas competem pelo mesmo espaço de cada semestre.
function simularSemestreFinal(
  obrigatoriasParaAgendar: Uc[],
  creditosEletivaFaltantes: number,
  currentSemester: number,
): number {
  const porCodigo = new Map(obrigatoriasParaAgendar.map((uc) => [uc.codigo, uc]));
  const restantes = new Set(porCodigo.keys());
  let creditosEletivaRestantes = creditosEletivaFaltantes;

  let semestre = currentSemester + 1;
  let ultimoComAlgo = currentSemester;
  let iteracoes = 0;
  const maxIteracoes = 40;

  while ((restantes.size > 0 || creditosEletivaRestantes > 0) && iteracoes < maxIteracoes) {
    iteracoes++;
    let horasUsadas = 0;
    let alocouAlgo = false;
    const paridadeSemestre = semestre % 2 === 0 ? "par" : "impar";

    // elegível: pré-requisito não é mais nenhuma obrigatória ainda pendente (já
    // concluída antes da simulação começar, ou alocada num semestre anterior aqui) e a
    // paridade de oferta bate com esse semestre (undefined/"ambos" sempre bate — ver
    // fallback em src/lib/types.ts).
    const elegiveis = Array.from(restantes)
      .map((codigo) => porCodigo.get(codigo)!)
      .filter((uc) => {
        if (uc.oferta && uc.oferta !== "ambos" && uc.oferta !== paridadeSemestre) return false;
        return uc.pre_requisitos.every((codigoPre) => !restantes.has(codigoPre));
      })
      .sort((a, b) => (a.semestre_sugerido ?? 999) - (b.semestre_sugerido ?? 999));

    for (const uc of elegiveis) {
      if (horasUsadas + uc.carga_horaria_total <= MAX_HORAS_POR_SEMESTRE) {
        restantes.delete(uc.codigo);
        horasUsadas += uc.carga_horaria_total;
        alocouAlgo = true;
      }
    }

    if (creditosEletivaRestantes > 0) {
      const horasLivres = MAX_HORAS_POR_SEMESTRE - horasUsadas;
      const creditosCabendo = Math.min(
        creditosEletivaRestantes,
        Math.floor(horasLivres / HORAS_POR_CREDITO),
      );
      if (creditosCabendo > 0) {
        creditosEletivaRestantes -= creditosCabendo;
        alocouAlgo = true;
      }
    }

    if (alocouAlgo) ultimoComAlgo = semestre;
    semestre++;
  }

  return ultimoComAlgo;
}

export function calcularAnalise(
  ucs: Uc[],
  curso: Curso,
  semestreAtual: number | null = null,
  horasCertificados: number = 0,
): AnaliseResumo {
  const { totalConcluido: horasConcluidas, totalMeta: horasMeta } = calcularHoras(
    ucs,
    curso,
    horasCertificados,
  );

  const obrigatoriasCatalogo = ucs.filter((uc) => ehObrigatorio(uc.tipo));
  const obrigatoriasConcluidas = obrigatoriasCatalogo.filter(
    (uc) => uc.status === "concluida",
  ).length;

  const eletivasConcluidas = ucs.filter(
    (uc) => ehEletivo(uc.tipo) && uc.status === "concluida",
  ).length;

  const concluidas = ucs.filter((uc) => uc.status === "concluida");
  const creditosConcluidos = concluidas.reduce((soma, uc) => soma + uc.creditos, 0);
  const concludedCodes = new Set(concluidas.map((uc) => uc.codigo));

  const currentSemester =
    semestreAtual ??
    Math.max(1, ...ucs.map((uc) => uc.semestre_planejado ?? uc.semestre_sugerido ?? 1));

  // "cursando" já ocupa o semestre atual (termina nele) — não entra na simulação de
  // semestres futuros, só as que ainda nem começaram.
  const obrigatoriasNaoConcluidas = obrigatoriasCatalogo.filter((uc) => uc.status !== "concluida");
  const creditosPendentesObrigatorias = obrigatoriasNaoConcluidas.reduce(
    (soma, uc) => soma + uc.creditos,
    0,
  );
  const obrigatoriasParaAgendar = obrigatoriasNaoConcluidas.filter(
    (uc) => uc.status !== "cursando",
  );

  // eletivas não têm cadeia de pré-requisito nem paridade fixa (oferta = "ambos" por
  // padrão) — o volume de créditos que falta é encaixado nos espaços livres de cada
  // semestre simulado junto com as obrigatórias (ver simularSemestreFinal).
  const creditosFaltantesEletivas = Math.max(
    0,
    curso.meta_creditos - creditosConcluidos - creditosPendentesObrigatorias,
  );

  const semestreFinal = simularSemestreFinal(
    obrigatoriasParaAgendar,
    creditosFaltantesEletivas,
    currentSemester,
  );
  const semestresPrevistos = Math.max(0, semestreFinal - currentSemester);
  const semanasPrevistas = semestresPrevistos * SEMANAS_POR_SEMESTRE;

  const nomePorCodigo = new Map(ucs.map((uc) => [uc.codigo, uc.nome]));

  // Eletivas ficam de fora dessas duas listas: são escolha livre (qualquer uma do grupo
  // conta), então listar as dezenas disponíveis como "o que eu preciso cursar" é ruído —
  // só as obrigatórias representam algo que ela realmente precisa fazer, sem escolha.
  const disponiveis = ucs.filter(
    (uc) => uc.status === "disponivel" && ehObrigatorio(uc.tipo),
  );
  const bloqueadas: UcBloqueada[] = ucs
    .filter((uc) => uc.status === "bloqueada" && ehObrigatorio(uc.tipo))
    .map((uc) => ({
      uc,
      faltando: missingPrerequisites(uc.pre_requisitos, concludedCodes).map((codigo) => ({
        codigo,
        nome: nomePorCodigo.get(codigo) ?? codigo,
      })),
    }));

  return {
    percentualGeral: Math.round((creditosConcluidos / curso.meta_creditos) * 100),
    creditosConcluidos,
    creditosMeta: curso.meta_creditos,
    horasConcluidas,
    horasMeta,
    obrigatoriasConcluidas,
    obrigatoriasTotal: obrigatoriasCatalogo.length,
    eletivasConcluidas,
    semestresPrevistos,
    semanasPrevistas,
    disponiveis,
    bloqueadas,
  };
}
