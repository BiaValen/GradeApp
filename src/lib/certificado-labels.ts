import type { CertificadoEixo } from "@/lib/types";

// Mesmos 4 eixos usados no geral pela UNIFESP pra atividades complementares — aqui só
// categorizam e mostram subtotais, já que o PPC de Ecomp não define um teto por eixo,
// só o total geral de 108h (ver migration 20260718000000_certificados.sql).
export const EIXO_LABELS: Record<CertificadoEixo, string> = {
  pessoal_cientifica: "Formação pessoal, científica ou profissional",
  orientacao_academica: "Orientação acadêmica ou monitoria",
  cidada_cultural: "Formação cidadã, cultural ou artística",
  extensao: "Horas de extensão",
};

export const EIXO_COLORS: Record<CertificadoEixo, string> = {
  pessoal_cientifica: "bg-blue-100 text-blue-800",
  orientacao_academica: "bg-purple-100 text-purple-800",
  cidada_cultural: "bg-amber-100 text-amber-800",
  extensao: "bg-emerald-100 text-emerald-800",
};

// versão sólida (pontinho) das mesmas cores, pra usar sobre o fundo com gradiente do
// banner de progresso — o EIXO_COLORS (fundo claro) some nesse fundo colorido.
export const EIXO_DOT_COLORS: Record<CertificadoEixo, string> = {
  pessoal_cientifica: "#93c5fd",
  orientacao_academica: "#d8b4fe",
  cidada_cultural: "#fcd34d",
  extensao: "#6ee7b7",
};
