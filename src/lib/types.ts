import type { UcTipo } from "@/lib/seed-data";
import type { UcStatus } from "@/lib/uc-labels";

export type UcOferta = "impar" | "par" | "ambos";

// Uma UC é uma identidade compartilhada entre cursos (curso_ucs guarda a classificação
// por curso — tipo/semestre_sugerido/oferta); curso_id não vive mais na UC em si.
export interface UcCatalogo {
  id: string;
  criado_por: string | null;
  codigo: string;
  nome: string;
  semestre_sugerido: number | null;
  creditos: number;
  carga_horaria_teorica: number;
  carga_horaria_pratica: number;
  carga_horaria_total: number;
  carga_horaria_extensao: number;
  tipo: UcTipo;
  pre_requisitos: string[];
  // quando a UC é realmente oferecida — nem toda UC segue a paridade do semestre_sugerido
  // (UCs BCT costumam rodar todo semestre; específicas da Ecomp, só uma vez por ano).
  oferta: UcOferta;
}

export interface Curso {
  id: string;
  nome: string;
  universidade: string;
  semestres_oficiais: number;
  meta_creditos: number;
  meta_horas_fixas: number;
  meta_horas_estagio: number;
  meta_horas_tcc: number;
  meta_horas_complementares: number;
  meta_horas_eletivas: number;
  meta_horas_extensao: number;
  meta_horas_total: number;
}

export interface Uc extends UcCatalogo {
  status: UcStatus;
  grupo_eletiva: string | null;
  // onde o usuário decidiu colocar essa UC no próprio planejamento (Plano).
  // null = segue o semestre_sugerido oficial do catálogo.
  semestre_planejado: number | null;
  // marcação subjetiva da própria usuária (não é o score de importância calculado) —
  // só destaca o card no Plano, não entra em nenhum cálculo.
  importante_pessoal: boolean;
}

export type AtividadeExtraTipo = "extensao" | "ic" | "estagio" | "outro";

export interface AtividadeExtra {
  id: string;
  nome: string;
  tipo: AtividadeExtraTipo;
  horas_semana: number;
  semestre: number;
}

export type CertificadoEixo =
  | "pessoal_cientifica"
  | "orientacao_academica"
  | "cidada_cultural"
  | "extensao";

export interface Certificado {
  id: string;
  nome: string;
  ano: number | null;
  eixo: CertificadoEixo;
  horas: number;
}
