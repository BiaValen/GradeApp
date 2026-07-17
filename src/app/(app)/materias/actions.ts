"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { UcTipo } from "@/lib/seed-data";
import type { UcOferta } from "@/lib/types";

async function requireUser(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");
  return user;
}

async function getDefaultCursoId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data, error } = await supabase.from("cursos").select("id").limit(1).single();
  if (error || !data) throw new Error("Curso não encontrado. Rode as migrations no Supabase.");
  return data.id as string;
}

// concluída/cursando só podem ser marcadas se todos os pré-requisitos da UC já
// estiverem concluídos por esse usuário. disponível/bloqueada nunca chegam aqui
// (são calculadas, nunca gravadas por ação do usuário).
async function assertPrerequisitosCumpridos(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  ucId: string,
  novoStatus: string,
) {
  if (novoStatus !== "concluida" && novoStatus !== "cursando") return null;

  const { data: uc } = await supabase
    .from("unidades_curriculares")
    .select("pre_requisitos, curso_id")
    .eq("id", ucId)
    .single();

  if (!uc || uc.pre_requisitos.length === 0) return null;

  const { data: progresso } = await supabase
    .from("progresso_uc")
    .select("uc_id")
    .eq("user_id", userId)
    .eq("status", "concluida");

  const concludedUcIds = (progresso ?? []).map((p) => p.uc_id);
  let concludedCodes = new Set<string>();
  if (concludedUcIds.length > 0) {
    const { data: concludedUcs } = await supabase
      .from("unidades_curriculares")
      .select("codigo")
      .in("id", concludedUcIds);
    concludedCodes = new Set((concludedUcs ?? []).map((u) => u.codigo));
  }

  const faltando = (uc.pre_requisitos as string[]).filter((codigo) => !concludedCodes.has(codigo));

  if (faltando.length > 0) {
    return `Faltam pré-requisitos: ${faltando.join(", ")}`;
  }
  return null;
}

export async function seedOfficialData() {
  const supabase = await createClient();
  const user = await requireUser(supabase);

  const { data: catalogo, error: catalogoError } = await supabase
    .from("unidades_curriculares")
    .select("id")
    .is("criado_por", null);

  if (catalogoError) return { error: catalogoError.message };
  if (!catalogo || catalogo.length === 0) {
    return {
      error:
        "Catálogo oficial vazio. Rode a migration supabase/migrations/20260710000001_seed_catalogo_ecomp.sql no SQL Editor primeiro.",
    };
  }

  const rows = catalogo.map((uc) => ({ user_id: user.id, uc_id: uc.id }));

  const { error } = await supabase
    .from("progresso_uc")
    .upsert(rows, { onConflict: "user_id,uc_id", ignoreDuplicates: true });

  if (error) return { error: error.message };

  revalidatePath("/materias");
  revalidatePath("/plano");
  revalidatePath("/grafo");
  return { success: true };
}

export type UcFormInput = {
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
  oferta: UcOferta;
};

export async function createUc(
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  const cursoId = await getDefaultCursoId(supabase);
  const input = parseUcForm(formData);
  const grupoEletiva = ((formData.get("grupo_eletiva") as string) ?? "").trim() || null;

  const { data: novaUc, error } = await supabase
    .from("unidades_curriculares")
    .insert({ ...input, curso_id: cursoId, criado_por: user.id })
    .select("id")
    .single();

  if (error) return { error: error.message };

  const { error: progressoError } = await supabase
    .from("progresso_uc")
    .insert({ user_id: user.id, uc_id: novaUc.id, grupo_eletiva: grupoEletiva });

  if (progressoError) return { error: progressoError.message };

  revalidatePath("/materias");
  revalidatePath("/plano");
  revalidatePath("/grafo");
  return { success: true };
}

export async function updateUc(
  id: string,
  isPersonal: boolean,
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  const grupoEletiva = ((formData.get("grupo_eletiva") as string) ?? "").trim() || null;
  const status = formData.get("status") as string;

  const prereqError = await assertPrerequisitosCumpridos(supabase, user.id, id, status);
  if (prereqError) return { error: prereqError };

  if (isPersonal) {
    const input = parseUcForm(formData);
    const { error } = await supabase.from("unidades_curriculares").update(input).eq("id", id);
    if (error) return { error: error.message };
  }

  const { error: progressoError } = await supabase
    .from("progresso_uc")
    .upsert(
      { user_id: user.id, uc_id: id, status, grupo_eletiva: grupoEletiva },
      { onConflict: "user_id,uc_id" },
    );

  if (progressoError) return { error: progressoError.message };

  revalidatePath("/materias");
  revalidatePath("/plano");
  revalidatePath("/grafo");
  return { success: true };
}

// A trava de paridade usa o atributo "oferta" da UC (ímpar/par/ambos) — não mais o
// tipo nem a paridade do semestre_sugerido diretamente, já que UCs BCT costumam rodar
// todo semestre e UCs específicas da Ecomp costumam rodar só uma vez por ano.
export async function moverUcSemestre(ucId: string, novoSemestre: number | null) {
  const supabase = await createClient();
  const user = await requireUser(supabase);

  if (novoSemestre !== null) {
    const { data: uc } = await supabase
      .from("unidades_curriculares")
      .select("oferta")
      .eq("id", ucId)
      .single();

    if (uc?.oferta && uc.oferta !== "ambos") {
      const paridadeDestino = novoSemestre % 2 === 0 ? "par" : "impar";
      if (uc.oferta !== paridadeDestino) {
        const label = uc.oferta === "par" ? "par" : "ímpar";
        return { error: `Essa UC só é oferecida em semestres ${label}.` };
      }
    }
  }

  const { error } = await supabase
    .from("progresso_uc")
    .upsert(
      { user_id: user.id, uc_id: ucId, semestre_planejado: novoSemestre },
      { onConflict: "user_id,uc_id" },
    );

  if (error) return { error: error.message };

  revalidatePath("/plano");
  return { success: true };
}

export async function deleteUc(id: string, isPersonal: boolean) {
  const supabase = await createClient();
  const user = await requireUser(supabase);

  if (isPersonal) {
    // cascata remove o progresso_uc junto
    await supabase.from("unidades_curriculares").delete().eq("id", id);
  } else {
    // UC oficial: só remove da lista pessoal, não do catálogo global
    await supabase.from("progresso_uc").delete().eq("user_id", user.id).eq("uc_id", id);
  }

  revalidatePath("/materias");
  revalidatePath("/plano");
  revalidatePath("/grafo");
}

// A UI já se atualiza otimisticamente no cliente (ver aplicarStatusLocal em
// src/lib/status.ts), então o clique não espera essa revalidação — ela só garante
// que os dados fiquem corretos se o usuário navegar pra outra página e voltar.
export async function updateUcStatus(ucId: string, status: string) {
  const supabase = await createClient();
  const user = await requireUser(supabase);

  const prereqError = await assertPrerequisitosCumpridos(supabase, user.id, ucId, status);
  if (prereqError) return { error: prereqError };

  const { error } = await supabase
    .from("progresso_uc")
    .upsert({ user_id: user.id, uc_id: ucId, status }, { onConflict: "user_id,uc_id" });

  if (error) return { error: error.message };

  revalidatePath("/materias");
  revalidatePath("/plano");
  revalidatePath("/grafo");

  return { success: true };
}

function parseUcForm(formData: FormData): UcFormInput {
  const temPreRequisitos = formData.get("tem_pre_requisitos") === "on";
  const preReqRaw = temPreRequisitos ? ((formData.get("pre_requisitos") as string) ?? "") : "";
  const semestreRaw = formData.get("semestre_sugerido") as string;

  return {
    codigo: (formData.get("codigo") as string).trim(),
    nome: (formData.get("nome") as string).trim(),
    semestre_sugerido: semestreRaw ? Number(semestreRaw) : null,
    creditos: Number(formData.get("creditos")),
    carga_horaria_teorica: Number(formData.get("carga_horaria_teorica") || 0),
    carga_horaria_pratica: Number(formData.get("carga_horaria_pratica") || 0),
    carga_horaria_total: Number(formData.get("carga_horaria_total")),
    carga_horaria_extensao: Number(formData.get("carga_horaria_extensao") || 0),
    tipo: formData.get("tipo") as UcTipo,
    pre_requisitos: preReqRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    oferta: (formData.get("oferta") as UcOferta) || "ambos",
  };
}
