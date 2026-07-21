import type { Uc } from "@/lib/types";

// Sobe a cadeia de pré-requisitos (o que precisa vir ANTES da UC) via busca em grafo
// sobre pre_requisitos, transitivamente. Usado tanto pelo Grafo quanto pelo botão
// "o que desbloqueia" do Plano.
export function calcularAnteriores(ucs: Uc[], codigo: string): Set<string> {
  const byCodigo = new Map(ucs.map((u) => [u.codigo, u]));

  const anteriores = new Set<string>();
  const pilha = [codigo];
  while (pilha.length > 0) {
    const cod = pilha.pop()!;
    const uc = byCodigo.get(cod);
    if (!uc) continue;
    for (const pre of uc.pre_requisitos) {
      if (!anteriores.has(pre)) {
        anteriores.add(pre);
        pilha.push(pre);
      }
    }
  }
  return anteriores;
}

// Desce a cadeia de dependentes (o que só pode vir DEPOIS da UC, direta ou
// indiretamente) — mesma lógica usada no Grafo pra destacar o ramo "depois".
export function calcularPosteriores(ucs: Uc[], codigo: string): Set<string> {
  const dependentesDiretos = new Map<string, string[]>();
  for (const uc of ucs) {
    for (const pre of uc.pre_requisitos) {
      const lista = dependentesDiretos.get(pre) ?? [];
      lista.push(uc.codigo);
      dependentesDiretos.set(pre, lista);
    }
  }

  const posteriores = new Set<string>();
  const pilha = [codigo];
  while (pilha.length > 0) {
    const cod = pilha.pop()!;
    for (const dep of dependentesDiretos.get(cod) ?? []) {
      if (!posteriores.has(dep)) {
        posteriores.add(dep);
        pilha.push(dep);
      }
    }
  }
  return posteriores;
}
