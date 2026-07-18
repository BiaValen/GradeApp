import type { UcTipo } from "@/lib/seed-data";

// Classificação "fixa vs eletiva" por padrão do nome do tipo, em vez de listas
// hardcoded por curso — cada curso novo (ex: bcc_fixa) já cai na regra certa sem
// precisar editar horas.ts/analise.ts de novo.
export function ehTipoFixo(tipo: UcTipo): boolean {
  return tipo.endsWith("_fixa") || tipo === "ecomp_trajetoria_integrada";
}

export function ehTipoEletivo(tipo: UcTipo): boolean {
  return tipo.includes("_eletiva_");
}
