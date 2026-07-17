import type { Uc } from "@/lib/types";

// "Importância" = quantas outras UCs dependem dessa, direta ou indiretamente,
// através da cadeia de pré-requisitos. Uma UC que destrava muitas outras é mais
// importante de cursar cedo — isso é calculado a partir dos dados reais da grade,
// não é uma marcação manual.
export function calcularImportancia(ucs: Uc[]): Map<string, number> {
  const dependentesDiretos = new Map<string, string[]>();
  for (const uc of ucs) {
    for (const prereq of uc.pre_requisitos) {
      const lista = dependentesDiretos.get(prereq) ?? [];
      lista.push(uc.codigo);
      dependentesDiretos.set(prereq, lista);
    }
  }

  const importancia = new Map<string, number>();
  for (const uc of ucs) {
    const visitados = new Set<string>();
    const pilha = [...(dependentesDiretos.get(uc.codigo) ?? [])];
    while (pilha.length > 0) {
      const codigo = pilha.pop()!;
      if (visitados.has(codigo)) continue;
      visitados.add(codigo);
      pilha.push(...(dependentesDiretos.get(codigo) ?? []));
    }
    importancia.set(uc.codigo, visitados.size);
  }

  return importancia;
}
