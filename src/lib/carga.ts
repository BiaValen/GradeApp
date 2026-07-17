import type { AtividadeExtra, Uc } from "@/lib/types";

export type NivelCarga = "leve" | "ok" | "pesado" | "sobrecarregado";

export const CARGA_LABELS: Record<NivelCarga, string> = {
  leve: "Leve",
  ok: "OK",
  pesado: "Pesado",
  sobrecarregado: "Sobrecarregado",
};

export const CARGA_COLORS: Record<NivelCarga, string> = {
  leve: "bg-neutral-100 text-neutral-700",
  ok: "bg-green-100 text-green-800",
  pesado: "bg-amber-100 text-amber-800",
  sobrecarregado: "bg-red-100 text-red-800",
};

export const CARGA_BAR_COLORS: Record<NivelCarga, string> = {
  leve: "bg-neutral-400",
  ok: "bg-green-500",
  pesado: "bg-amber-500",
  sobrecarregado: "bg-red-500",
};

// UNIFESP: 1 crédito = 18h/semestre, ~18 semanas por semestre → horas/semana = horas totais / 18.
// Limiares são um primeiro palpite (ajustável quando o perfil configurável existir).
// Exportado: é o teto de horas/semana usado também na simulação de previsão em src/lib/analise.ts.
export const LIMITE_SOBRECARREGADO = 28;

export function nivelCarga(horasPorSemana: number): NivelCarga {
  if (horasPorSemana <= 14) return "leve";
  if (horasPorSemana <= 20) return "ok";
  if (horasPorSemana <= LIMITE_SOBRECARREGADO) return "pesado";
  return "sobrecarregado";
}

// % de preenchimento da barra visual — satura em 100% no limiar de "sobrecarregado".
export function percentualCarga(horasPorSemana: number): number {
  return Math.min(100, (horasPorSemana / LIMITE_SOBRECARREGADO) * 100);
}

export interface ColunaSemestre {
  semestre: number | "eletivas" | "atrasadas";
  ucs: Uc[];
  atividades: AtividadeExtra[];
  creditos: number;
  horasTotais: number;
  horasExtrasPorSemana: number;
  horasPorSemana: number;
  nivel: NivelCarga;
}

// semestre efetivo pro planejamento: o que o usuário escolheu (semestre_planejado)
// ou, na falta disso, o semestre_sugerido oficial do catálogo.
export function semestreEfetivo(uc: Uc): number | "eletivas" {
  return uc.semestre_planejado ?? uc.semestre_sugerido ?? "eletivas";
}

export function agruparPorSemestre(
  ucs: Uc[],
  atividadesExtras: AtividadeExtra[] = [],
  semestreAtual: number | null = null,
  semestresExtras: number[] = [],
): ColunaSemestre[] {
  const grupos = new Map<number | "eletivas" | "atrasadas", Uc[]>();

  // colunas adicionadas manualmente (ex: 11º, 12º semestre) — aparecem mesmo vazias.
  for (const sem of semestresExtras) {
    if (!grupos.has(sem)) grupos.set(sem, []);
  }

  for (const uc of ucs) {
    const efetivo = semestreEfetivo(uc);
    // UC de um semestre já passado que ainda não foi concluída: sai do semestre
    // original (onde ficaria esquecida) e vai pra uma coluna própria de pendências.
    const chave: number | "eletivas" | "atrasadas" =
      semestreAtual != null &&
      typeof efetivo === "number" &&
      efetivo < semestreAtual &&
      uc.status !== "concluida"
        ? "atrasadas"
        : efetivo;

    const lista = grupos.get(chave) ?? [];
    lista.push(uc);
    grupos.set(chave, lista);
  }

  const atividadesPorSemestre = new Map<number, AtividadeExtra[]>();
  for (const a of atividadesExtras) {
    const lista = atividadesPorSemestre.get(a.semestre) ?? [];
    lista.push(a);
    atividadesPorSemestre.set(a.semestre, lista);
    if (!grupos.has(a.semestre)) grupos.set(a.semestre, []);
  }

  const colunas: ColunaSemestre[] = Array.from(grupos.entries()).map(([semestre, lista]) => {
    const atividades =
      typeof semestre === "number" ? (atividadesPorSemestre.get(semestre) ?? []) : [];
    const creditos = lista.reduce((sum, uc) => sum + uc.creditos, 0);
    const horasTotais = lista.reduce((sum, uc) => sum + uc.carga_horaria_total, 0);
    const horasExtrasPorSemana = atividades.reduce((sum, a) => sum + a.horas_semana, 0);
    const horasPorSemana = horasTotais / 18 + horasExtrasPorSemana;
    return {
      semestre,
      ucs: lista,
      atividades,
      creditos,
      horasTotais,
      horasExtrasPorSemana,
      horasPorSemana,
      nivel: nivelCarga(horasPorSemana),
    };
  });

  colunas.sort((a, b) => {
    if (a.semestre === "atrasadas") return -1;
    if (b.semestre === "atrasadas") return 1;
    if (a.semestre === "eletivas") return 1;
    if (b.semestre === "eletivas") return -1;
    return (a.semestre as number) - (b.semestre as number);
  });

  return colunas;
}
