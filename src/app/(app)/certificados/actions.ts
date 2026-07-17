"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { CertificadoEixo } from "@/lib/types";

async function requireUser(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");
  return user;
}

function parseCertificadoForm(formData: FormData) {
  const anoRaw = formData.get("ano") as string;
  return {
    nome: (formData.get("nome") as string).trim(),
    ano: anoRaw ? Number(anoRaw) : null,
    eixo: formData.get("eixo") as CertificadoEixo,
    horas: Number(formData.get("horas")),
  };
}

export async function createCertificado(
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  const input = parseCertificadoForm(formData);

  const { error } = await supabase.from("certificados").insert({ ...input, user_id: user.id });

  if (error) return { error: error.message };

  revalidatePath("/certificados");
  revalidatePath("/horas");
  return { success: true };
}

export async function updateCertificado(
  id: string,
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) {
  const supabase = await createClient();
  const input = parseCertificadoForm(formData);

  const { error } = await supabase.from("certificados").update(input).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/certificados");
  revalidatePath("/horas");
  return { success: true };
}

export async function deleteCertificado(id: string) {
  const supabase = await createClient();
  await supabase.from("certificados").delete().eq("id", id);
  revalidatePath("/certificados");
  revalidatePath("/horas");
}
