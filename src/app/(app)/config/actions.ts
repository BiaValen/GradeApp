"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { AtividadeExtraTipo } from "@/lib/types";

async function requireUser(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");
  return user;
}

function parseAtividadeForm(formData: FormData) {
  return {
    nome: (formData.get("nome") as string).trim(),
    tipo: formData.get("tipo") as AtividadeExtraTipo,
    horas_semana: Number(formData.get("horas_semana")),
    semestre: Number(formData.get("semestre")),
  };
}

export async function createAtividade(
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  const input = parseAtividadeForm(formData);

  const { error } = await supabase
    .from("atividades_extras")
    .insert({ ...input, user_id: user.id });

  if (error) return { error: error.message };

  revalidatePath("/config");
  revalidatePath("/plano");
  return { success: true };
}

export async function updateAtividade(
  id: string,
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) {
  const supabase = await createClient();
  const input = parseAtividadeForm(formData);

  const { error } = await supabase.from("atividades_extras").update(input).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/config");
  revalidatePath("/plano");
  return { success: true };
}

export async function deleteAtividade(id: string) {
  const supabase = await createClient();
  await supabase.from("atividades_extras").delete().eq("id", id);
  revalidatePath("/config");
  revalidatePath("/plano");
}

export async function updateSemestreAtual(
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  const raw = formData.get("semestre_atual") as string;
  const semestre_atual = raw ? Number(raw) : null;

  const { error } = await supabase
    .from("perfil")
    .upsert({ user_id: user.id, semestre_atual }, { onConflict: "user_id" });

  if (error) return { error: error.message };

  revalidatePath("/config");
  revalidatePath("/plano");
  return { success: true };
}

export async function updateCurso(
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  const curso_id = formData.get("curso_id") as string;

  const { error } = await supabase
    .from("perfil")
    .upsert({ user_id: user.id, curso_id }, { onConflict: "user_id" });

  if (error) return { error: error.message };

  revalidatePath("/config");
  revalidatePath("/plano");
  return { success: true };
}
