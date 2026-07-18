"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function selecionarCurso(cursoId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");

  await supabase
    .from("perfil")
    .upsert({ user_id: user.id, curso_id: cursoId }, { onConflict: "user_id" });

  revalidatePath("/config");
  redirect("/plano");
}
