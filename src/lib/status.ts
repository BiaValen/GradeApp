import type { UcStatus } from "@/lib/uc-labels";
import type { Uc } from "@/lib/types";

// disponivel/bloqueada nunca são armazenados como escolha do usuário — são sempre
// derivados a partir dos pré-requisitos toda vez que a lista é carregada.
export function computeDisplayStatus(
  storedStatus: UcStatus,
  preRequisitos: string[],
  concludedCodes: Set<string>,
): UcStatus {
  if (storedStatus === "concluida" || storedStatus === "cursando") return storedStatus;

  const prereqsMet = preRequisitos.every((codigo) => concludedCodes.has(codigo));
  return prereqsMet ? "disponivel" : "bloqueada";
}

export function missingPrerequisites(
  preRequisitos: string[],
  concludedCodes: Set<string>,
): string[] {
  return preRequisitos.filter((codigo) => !concludedCodes.has(codigo));
}

// Aplica uma mudança de status localmente (sem ir ao banco) e recalcula disponível/bloqueada
// de toda a lista, já que concluir uma UC pode desbloquear outras na hora, na tela.
// concluida/cursando são "reais" (escolhidos pelo usuário); os demais são sempre recalculados.
export function aplicarStatusLocal(ucs: Uc[], ucId: string, novoStatus: UcStatus): Uc[] {
  const atualizado = ucs.map((uc) => (uc.id === ucId ? { ...uc, status: novoStatus } : uc));

  const concludedCodes = new Set(
    atualizado.filter((uc) => uc.status === "concluida").map((uc) => uc.codigo),
  );

  return atualizado.map((uc) => {
    if (uc.status === "concluida" || uc.status === "cursando") return uc;
    return { ...uc, status: computeDisplayStatus("planejada", uc.pre_requisitos, concludedCodes) };
  });
}
