import type { UcTipo } from "@/lib/seed-data";

export const TIPO_LABELS: Record<UcTipo, string> = {
  bct_fixa: "BCT Fixa",
  bct_eletiva_interdisciplinar: "Eletiva Interdisciplinar",
  bct_eletiva_regular: "Eletiva Regular",
  ecomp_fixa: "Ecomp Fixa",
  ecomp_trajetoria_integrada: "Ecomp Trajetória Integrada",
  bcc_fixa: "BCC Fixa",
  bcc_eletiva_regular: "Eletiva Regular BCC",
  estagio: "Estágio",
  tcc: "TCC",
  atividade_complementar: "Atividade Complementar",
};

export type UcStatus =
  | "concluida"
  | "cursando"
  | "disponivel"
  | "bloqueada"
  | "planejada"
  | "reprovada";

export const STATUS_LABELS: Record<UcStatus, string> = {
  concluida: "Concluída",
  cursando: "Cursando",
  disponivel: "Disponível",
  bloqueada: "Bloqueada",
  planejada: "Planejada",
  reprovada: "Reprovada",
};

export const STATUS_COLORS: Record<UcStatus, string> = {
  concluida: "bg-green-100 text-green-800",
  cursando: "bg-blue-100 text-blue-800",
  disponivel: "bg-cyan-100 text-cyan-800",
  bloqueada: "bg-orange-100 text-orange-800",
  planejada: "bg-neutral-100 text-neutral-700",
  reprovada: "bg-rose-100 text-rose-800",
};
