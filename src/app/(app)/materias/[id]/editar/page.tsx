import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { computeDisplayStatus } from "@/lib/status";
import type { Uc } from "@/lib/types";
import { updateUc } from "../../actions";
import { UcForm } from "../../uc-form";

export default async function EditarMateriaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: uc } = await supabase
    .from("unidades_curriculares")
    .select("*")
    .eq("id", id)
    .single();

  if (!uc) notFound();

  const { data: progresso } = await supabase
    .from("progresso_uc")
    .select("status, grupo_eletiva")
    .eq("user_id", user!.id)
    .eq("uc_id", id)
    .single();

  const { data: todoProgresso } = await supabase
    .from("progresso_uc")
    .select("uc_id")
    .eq("user_id", user!.id)
    .eq("status", "concluida");

  const concludedUcIds = (todoProgresso ?? []).map((p) => p.uc_id);
  let concludedCodes = new Set<string>();
  if (concludedUcIds.length > 0) {
    const { data: concludedUcs } = await supabase
      .from("unidades_curriculares")
      .select("codigo")
      .in("id", concludedUcIds);
    concludedCodes = new Set((concludedUcs ?? []).map((u) => u.codigo));
  }

  const isPersonal = uc.criado_por === user!.id;
  const storedStatus = (progresso?.status ?? "planejada") as Uc["status"];
  const merged: Uc = {
    ...uc,
    status: computeDisplayStatus(storedStatus, uc.pre_requisitos, concludedCodes),
    grupo_eletiva: progresso?.grupo_eletiva ?? null,
  };

  const updateUcWithId = updateUc.bind(null, id, isPersonal);

  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <Link href="/materias" className="text-sm text-blue-600 underline">
        ← Matérias
      </Link>
      <h1 className="mb-6 text-2xl font-semibold">Editar UC</h1>
      <UcForm action={updateUcWithId} initial={merged} editableCatalogo={isPersonal} />
    </main>
  );
}
